(function() {
    let gameIsStarted = false;
    let interval = null;
    let matrix = [];
    let generation = 0;
    const wrapper = document.querySelector('#game');
    const startButton = document.querySelector('#startButton');
    const resetButton = document.querySelector('#resetButton');
    const fieldSize = document.querySelector('#fieldSize');
    const counter = document.querySelector('#counter');

    document.body.addEventListener('click', event => {
        const target = event.target;
        if (gameIsStarted === false && target.classList.contains('cell')) {
            const cell = matrix[target.dataset.row][target.dataset.cell];
            matrix[target.dataset.row][target.dataset.cell] = cell === 1 ? 0 : 1;
            draw();
        }
    });
    startButton.addEventListener('click', () => {
        gameIsStarted = !gameIsStarted;

        if (gameIsStarted) {
            interval = setInterval(nextGeneration, 300);
            startButton.innerText = 'Stop game';
        } else {
            stopGame();
        }
    });
    resetButton.addEventListener('click', () => {
        stopGame();
        createMatrix();
        draw();
    });

    fieldSize.addEventListener('change', () => {
        stopGame();
        createMatrix();
        draw();
    });

    function stopGame() {
        gameIsStarted = false;
        clearInterval(interval);
        interval = null;
        startButton.innerText = 'Start game';
    }

    function createMatrix() {
        matrix = [];
        const size = Number(fieldSize.value);
        for (let i = 0; i < size; i += 1) {
            matrix[i] = [];
            for (let x = 0; x < size; x += 1) {
                matrix[i][x] = 0;
            }
        }
    }

    function nextGeneration() {
        let needUpdate = false;
        for (let i = 0; i < matrix.length; i += 1) {
            const row = matrix[i];
            for (let x = 0; x < row.length; x += 1) {
                const cell = row[x];

                let aliveNeighbours = 0;
                for (let l = -1; l <= 1; l += 1) {
                    for (let m = -1; m <= 1; m += 1) {
                        if (matrix[i + l] && matrix[i + l][x + m] !== undefined) {
                            aliveNeighbours += matrix[i + l][x + m];
                        }
                    }
                }
                aliveNeighbours -= cell;

                if (cell === 1 && aliveNeighbours < 2) {
                    needUpdate = true;
                    row[x] = 0;
                } else if (cell === 1 && aliveNeighbours > 3) {
                    needUpdate = true;
                    row[x] = 0;
                } else if (cell === 0 && aliveNeighbours === 3) {
                    needUpdate = true;
                    row[x] = 1;
                }
            }
        }
        if (needUpdate) {
            generation += 1;
            draw();
        } else {
            stopGame();
        }
    }

    function draw() {
        wrapper.innerHTML = matrix.map((row, rowIndex) => {
            const result = row.map((cell, cellIndex) => {
                const className = cell === 1 ? 'alive' : 'died';
                return `<div data-row="${rowIndex}" data-cell="${cellIndex}" class="cell ${className}"></div>`
            }).join('');

            return `<div class="row">${result}</div>`;
        }).join('');
        counter.innerText = generation;
    }
    createMatrix();
    draw();
})();