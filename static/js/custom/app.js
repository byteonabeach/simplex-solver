class GameSolverApp {
    constructor() {
        this.matrixManager = new MatrixManager();
        this.simplexSolver = new SimplexSolver(this.matrixManager);
        this.uiManager = new UIManager(this.matrixManager, this.simplexSolver);
       
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.init();
            });
        } else {
            this.init();
        }
    }

    init() {
        this.initEventListeners();
        this.loadFromSessionStorage();
    }

    initEventListeners() {
        const createMatrixBtn = document.getElementById('create-matrix-btn');
        const loadExampleBtn = document.getElementById('load-example-btn');
        const startSolvingBtn = document.getElementById('start-solving-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const autoBtn = document.getElementById('auto-btn');

        if (createMatrixBtn) {
            createMatrixBtn.addEventListener('click', () => {
                const rows = parseInt(document.getElementById('rows').value);
                const cols = parseInt(document.getElementById('cols').value);
                this.matrixManager.createMatrixInput(rows, cols, 'matrix-input');
                this.uiManager.showMatrixContainer();
                this.uiManager.hideSolutionSteps();
                this.saveToSessionStorage();
            });
        }

        if (loadExampleBtn)
            loadExampleBtn.addEventListener('click', () => {
                const exampleKey = document.getElementById('example-select').value;
                if (exampleKey && this.examples[exampleKey]) {
                    this.matrixManager.loadExample(this.examples[exampleKey]);
                    this.uiManager.showMatrixContainer();
                    this.uiManager.hideSolutionSteps();
                    
                    const matrix = this.examples[exampleKey];
                    document.getElementById('rows').value = matrix.length;
                    document.getElementById('cols').value = matrix[0].length;
                    
                    this.saveToSessionStorage();
                }
            });

        if (startSolvingBtn)
            startSolvingBtn.addEventListener('click', () => {
                this.startSolving();
            });
  

        if (prevBtn)
            prevBtn.addEventListener('click', () => {
                if (this.simplexSolver.previousIteration()) {
                    this.uiManager.updateIterationControls();
                    this.uiManager.renderCurrentIteration();
                }
            });

        if (nextBtn)
            nextBtn.addEventListener('click', () => {
                if (this.simplexSolver.nextIteration()) {
                    this.uiManager.updateIterationControls();
                    this.uiManager.renderCurrentIteration();
                }
            });

        if (autoBtn)
            autoBtn.addEventListener('click', () => {
                const results = this.simplexSolver.autoSolve();
                this.uiManager.updateIterationControls();
                this.uiManager.renderCurrentIteration();
                this.uiManager.renderResults(results);
            });
    }

    startSolving() {
        try {
            this.matrixManager.getMatrix();
            this.uiManager.showSolutionSteps();
            this.simplexSolver.initializeSolution();
            this.uiManager.renderInitialSteps();
            this.uiManager.updateIterationControls();
            this.uiManager.renderCurrentIteration();
            
            this.saveToSessionStorage();
        } catch (error) {
            console.error('Ошибка при решении:', error);
            alert('Ошибка при решении: ' + error.message);
        }
    }

    saveToSessionStorage() {
        try {
            const matrix = this.matrixManager.getMatrixForDisplay();
            const { m, n } = this.matrixManager.getDimensions();
            
            const gameState = {
                rows: m,
                cols: n,
                matrix: matrix,
                timestamp: new Date().getTime()
            };
            
            sessionStorage.setItem('gameSolverState', JSON.stringify(gameState));
        } catch (error) {
            console.error('Ошибка при сохранении в sessionStorage:', error);
        }
    }

    loadFromSessionStorage() {
        try {
            const savedState = sessionStorage.getItem('gameSolverState');
            if (savedState) {
                const gameState = JSON.parse(savedState);
                const oneHour = 60 * 60 * 1000;

                if (gameState.timestamp && (new Date().getTime() - gameState.timestamp) < oneHour) {
                    const rowsInput = document.getElementById('rows');
                    const colsInput = document.getElementById('cols');

                    if (rowsInput && colsInput) {
                        rowsInput.value = gameState.rows;
                        colsInput.value = gameState.cols;
                    }
                    
                    this.matrixManager.loadExample(gameState.matrix);
                    this.uiManager.showMatrixContainer();
                    
                    <!-- TO-DO: ПОЧИСТИТЬ ГОВНО console.log('Состояние восстановлено из sessionStorage'); -->
                }
            }
        } catch (error) {
            <!-- To-Do: ПОЧИСТИТЬ ГОВНО -->
            console.error('Ошибка при загрузке из sessionStorage:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameSolverApp();
});
