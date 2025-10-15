class MatrixManager {
    constructor() {
        this.gameMatrix = [];
        this.m = 0;
        this.n = 0;
    }

    createMatrixInput(rows, cols, containerId) {
        this.m = rows;
        this.n = cols;
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Контейнер с id ${containerId} не найден`);
            return;
        }
        
        container.innerHTML = '';
        
        const matrixDiv = document.createElement('div');
        matrixDiv.className = 'matrix-input';
        
        for (let i = 0; i < rows; i++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'matrix-row';
            
            for (let j = 0; j < cols; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.value = 0;
                input.id = `cell-${i}-${j}`;
                rowDiv.appendChild(input);
            }
            matrixDiv.appendChild(rowDiv);
        }
        
        container.appendChild(matrixDiv);
    }

    loadExample(matrix) {
        if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
            console.error('Некорректная матрица');
            return;
        }
        
        this.m = matrix.length;
        this.n = matrix[0].length;
        this.gameMatrix = matrix;
        
        const container = document.getElementById('matrix-input');
        if (!container) {
            console.error('Контейнер matrix-input не найден');
            return;
        }
        
        container.innerHTML = '';
        
        const matrixDiv = document.createElement('div');
        matrixDiv.className = 'matrix-input';
        
        for (let i = 0; i < this.m; i++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'matrix-row';
            
            for (let j = 0; j < this.n; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.value = matrix[i] && matrix[i][j] !== undefined ? matrix[i][j] : 0;
                input.id = `cell-${i}-${j}`;
                rowDiv.appendChild(input);
            }
            matrixDiv.appendChild(rowDiv);
        }
        
        container.appendChild(matrixDiv);
    }

    getMatrix() {
        this.gameMatrix = [];
        for (let i = 0; i < this.m; i++) {
            const row = [];
            for (let j = 0; j < this.n; j++) {
                const input = document.getElementById(`cell-${i}-${j}`);
                const value = input ? parseInt(input.value) || 0 : 0;
                row.push(value);
            }
            this.gameMatrix.push(row);
        }

        return this.gameMatrix;
    }

    getMatrixForDisplay() {
        return this.gameMatrix;
    }

    getDimensions() {
        return { m: this.m, n: this.n };
    }
}
