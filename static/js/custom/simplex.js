class SimplexSolver {
    constructor(matrixManager) {
        this.matrixManager = matrixManager;
        this.simplexTable = [];
        this.basis = [];
        this.iterations = [];
        this.currentIteration = 0;
        this.calculatedResults = null;
    }

    initializeSolution() {
        const { m, n } = this.matrixManager.getDimensions();
        const gameMatrix = this.matrixManager.getMatrixForDisplay();
        
        this.simplexTable = [];
        this.basis = [];
        
        for (let i = 0; i < m; i++) {
            const row = [];

            for (let j = 0; j < n; j++)
                row.push(gameMatrix[i][j]);

            for (let j = 0; j < m; j++) 
                row.push(i === j ? 1 : 0);

            row.push(1);
            this.simplexTable.push(row);
            this.basis.push(`s_{${i+1}}`);
        }
        
        const objectiveRow = [];
        for (let j = 0; j < n; j++) 
            objectiveRow.push(-1);

        for (let j = 0; j < m; j++)
            objectiveRow.push(0);
        
        objectiveRow.push(0);
        this.simplexTable.push(objectiveRow);
        
        this.iterations = [JSON.parse(JSON.stringify(this.simplexTable))];
        this.currentIteration = 0;
        this.calculatedResults = null;
    }

    solveSimplex() {
        const { m, n } = this.matrixManager.getDimensions();
        let table = JSON.parse(JSON.stringify(this.simplexTable));
        let basis = [...this.basis];
        
        let optimal = false;
        let iterationCount = 0;
        const maxIterations = 10;
        
        while (!optimal && iterationCount < maxIterations) {
            iterationCount++;
            
            const objectiveRow = table[table.length - 1];
            let minCoeff = 0;
            let pivotCol = -1;
            
            for (let j = 0; j < n + m; j++) {
                if (objectiveRow[j] < minCoeff) {
                    minCoeff = objectiveRow[j];
                    pivotCol = j;
                }
            }
            
            if (pivotCol === -1) {
                optimal = true;
                break;
            }
            
            let minRatio = Infinity;
            let pivotRow = -1;
            
            for (let i = 0; i < m; i++) {
                if (table[i][pivotCol] > 0) {
                    const ratio = table[i][n + m] / table[i][pivotCol];
                    if (ratio < minRatio) {
                        minRatio = ratio;
                        pivotRow = i;
                    }
                }
            }
            
            if (pivotRow === -1) {
                break;
            }

            const pivotElement = table[pivotRow][pivotCol];
            for (let j = 0; j <= n + m; j++)
                table[pivotRow][j] /= pivotElement;
            
            for (let i = 0; i < table.length; i++) {
                if (i !== pivotRow) {
                    const factor = table[i][pivotCol];
                    for (let j = 0; j <= n + m; j++) 
                        table[i][j] -= factor * table[pivotRow][j];
                }
            }
            
            if (pivotCol < n)
                basis[pivotRow] = `y_{${pivotCol + 1}}`;
            else
                basis[pivotRow] = `s_{${pivotCol - n + 1}}`;
            
            this.iterations.push(JSON.parse(JSON.stringify(table)));
        }
        
        return { table, basis };
    }

    calculateGameValue(table) {
        const { m, n } = this.matrixManager.getDimensions();
        const objectiveValue = -table[table.length - 1][n + m];
        
        if (objectiveValue <= 0)
            return 0.5;
        
        const v = 1 / objectiveValue;
        return v;
    }

    calculateStrategies(table, basis, v) {
        const { m, n } = this.matrixManager.getDimensions();
        const gameMatrix = this.matrixManager.getMatrixForDisplay();
        const p = new Array(m).fill(0);
        const q = new Array(n).fill(0);

        for (let i = 0; i < m; i++)
            if (basis[i].startsWith('y_')) {
                const yIndex = parseInt(basis[i].match(/\d+/)[0]) - 1;
                q[yIndex] = table[i][n + m] * v;
            }
        
        const objectiveRow = table[table.length - 1];
        for (let j = 0; j < m; j++)
            p[j] = objectiveRow[n + j] * v; 

        const sumP = p.reduce((sum, val) => sum + val, 0);
        const sumQ = q.reduce((sum, val) => sum + val, 0);
        
        if (sumP > 0)
            for (let i = 0; i < m; i++) 
                p[i] = (p[i] / sumP).toFixed(3);
        
        if (sumQ > 0)
            for (let j = 0; j < n; j++)
                q[j] = (q[j] / sumQ).toFixed(3);
        
        return { p, q };
    }

    autoSolve() {
        if (!this.calculatedResults) {
            const { table, basis } = this.solveSimplex();
            const v = this.calculateGameValue(table);
            const strategies = this.calculateStrategies(table, basis, v);
            
            this.calculatedResults = {
                v: v,
                p: strategies.p,
                q: strategies.q
            };
            
            this.currentIteration = this.iterations.length - 1;
        }
        
        return this.calculatedResults;
    }

    nextIteration() {
        if (this.currentIteration < this.iterations.length - 1) {
            this.currentIteration++;
            return true;
        }

        return false;
    }

    previousIteration() {
        if (this.currentIteration > 0) {
            this.currentIteration--;
            return true;
        }

        return false;
    }

    getCurrentIteration() {
        return this.iterations[this.currentIteration];
    }

    getIterationInfo() {
        return {
            current: this.currentIteration,
            total: this.iterations.length - 1
        };
    }

    getBasis() {
        return this.basis;
    }
}
