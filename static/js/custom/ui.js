class UIManager {
    constructor(matrixManager, simplexSolver) {
        this.matrixManager = matrixManager;
        this.simplexSolver = simplexSolver;
    }

    renderInitialSteps() {
        const gameMatrix = this.matrixManager.getMatrixForDisplay();
        const { m, n } = this.matrixManager.getDimensions();
        
        let html = `<h3>Исходная матрица выигрышей</h3>`;
        html += `<div class="math-display">\\[ A = \\begin{pmatrix}`;
        for (let i = 0; i < m; i++) {
            html += gameMatrix[i].join(' & ') + (i < m-1 ? ' \\\\' : '');
        }
        html += `\\end{pmatrix} \\]</div>`;
        document.getElementById('step-0-initial').innerHTML = html;

        html = `<h3>Формулировка двойственной задачи</h3>`;
        html += `<div class="math-display">`;
        html += `Для игрока B (минимизация):<br>`;
        html += `Найти вероятности \\(q_1, q_2, \\ldots, q_${n}\\) такие, что:<br>`;
        html += `\\[ \\begin{cases}`;
    
        for (let i = 0; i < m; i++) {
            let constraint = '';
          
            for (let j = 0; j < n; j++)
                constraint += (gameMatrix[i][j] >= 0 && j > 0 ? '+' : '') + gameMatrix[i][j] + 'q_' + (j+1);
          
            html += constraint + ` \\leq v \\\\`;
        }

        html += `q_1 + q_2 + \\cdots + q_${n} = 1 \\\\`;
        html += `q_j \\geq 0 \\\\`;
        html += `\\end{cases} \\]`;
        html += `</div>`;
        document.getElementById('step-1-lp-formulation').innerHTML = html;

        this.renderSimplexSetup();
    }

    renderSimplexSetup() {
        const basis = this.simplexSolver.getBasis();
        let html = `<h3>Начальная симплекс-таблица для двойственной задачи</h3>`;
        html += `<div class="math-display">`;
        html += `Замена переменных: \\(y_j = \\frac{q_j}{v}\\), максимизация \\(\\frac{1}{v}\\)<br>`;
        html += `Начальный базис: \\(${basis.join(', ')}\\)`;
        html += `</div>`;
        document.getElementById('step-2-simplex-setup').innerHTML = html;
    }

    renderCurrentIteration() {
        const table = this.simplexSolver.getCurrentIteration();
        const iterationInfo = this.simplexSolver.getIterationInfo();
        const { m, n } = this.matrixManager.getDimensions();
        const basis = this.simplexSolver.getBasis();
        
        let html = `<h3>Итерация ${iterationInfo.current}</h3>`;
        html += `<div class="iteration-info">`;
        html += `Текущая итерация: <strong>${iterationInfo.current}</strong> из <strong>${iterationInfo.total}</strong>`;
        html += `</div>`;
        
        html += `<div class="simplex-table">`;
        html += `<table>`;
        html += `<tr><th>Базис</th>`;

        for (let j = 0; j < n; j++)
            html += `<th>\\(y_{${j+1}}\\)</th>`;
    
        for (let j = 0; j < m; j++)
            html += `<th>\\(s_{${j+1}}\\)</th>`;
      
        html += `<th>RHS</th></tr>`;
        
        for (let i = 0; i < table.length - 1; i++) {
            html += `<tr>`;
            html += `<td class="basis">\\(${basis[i]}\\)</td>`;

            for (let j = 0; j < table[i].length; j++)
                html += `<td>${parseFloat(table[i][j]).toFixed(3)}</td>`;
            
            html += `</tr>`;
        }
        
        html += `<tr><td>\\(Z\\)</td>`;
        for (let j = 0; j < table[table.length-1].length; j++) {
            html += `<td>${parseFloat(table[table.length-1][j]).toFixed(3)}</td>`;
        }
        html += `</tr>`;
        html += `</table></div>`;
        
        document.getElementById('current-iteration').innerHTML = html;
        this.updateMathJax();
    }

    renderResults(results) {
        const { v, p, q } = results;
        const { m, n } = this.matrixManager.getDimensions();
        
        let isValid = true;
        let validationMessage = '';
        
        const sumP = p.reduce((sum, val) => sum + parseFloat(val), 0);
        const sumQ = q.reduce((sum, val) => sum + parseFloat(val), 0);
        
        if (Math.abs(sumP - 1) > 0.01) {
            isValid = false;
            validationMessage += `Сумма вероятностей игрока A (${sumP.toFixed(3)}) не равна 1. `;
        }
        
        if (Math.abs(sumQ - 1) > 0.01) {
            isValid = false;
            validationMessage += `Сумма вероятностей игрока B (${sumQ.toFixed(3)}) не равна 1.`;
        }
        
        const html = `
            <h3>Результаты решения</h3>
            ${!isValid ? `<div class="validation-error" style="color: red; margin-bottom: 15px;">${validationMessage}</div>` : ''}
            <div class="math-display"> 
                Оптимальная стратегия игрока A:<br>
                \\[ p = \\left(${p.join(', ')}\\right) \\]<br><br>
                 
            </div>
        `;
        document.getElementById('step-4-results').innerHTML = html;
        this.updateMathJax();
    }

    updateMathJax() {
        if (window.MathJax)
            MathJax.typesetPromise().catch(err => {
                console.log('MathJax error:', err);
            }); 
    }

    updateIterationControls() {
        const iterationInfo = this.simplexSolver.getIterationInfo();
        document.getElementById('prev-btn').disabled = iterationInfo.current === 0;
        document.getElementById('next-btn').disabled = iterationInfo.current === iterationInfo.total;
        document.getElementById('iteration-counter').textContent = 
            `Итерация ${iterationInfo.current} из ${iterationInfo.total}`;
    }

    showSolutionSteps() {
        document.getElementById('solution-steps').style.display = 'block';
    }

    showMatrixContainer() {
        document.getElementById('matrix-container').style.display = 'block';
    }

    hideMatrixContainer() {
        document.getElementById('matrix-container').style.display = 'none';
    }

    hideSolutionSteps() {
        document.getElementById('solution-steps').style.display = 'none';
    }
}
