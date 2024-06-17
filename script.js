const boardElement = document.getElementById('game-board');
const turnIndicator = document.getElementById('turn-indicator');
const resetButton = document.getElementById('reset-button');
const modal = document.getElementById('reset-modal');
const closeButton = document.querySelector('.close-button');
const confirmResetButton = document.getElementById('confirm-reset');
const cancelResetButton = document.getElementById('cancel-reset');
const boardSizeSelector = document.getElementById('board-size');
const gameModeSelector = document.getElementById('game-mode');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');

let boardSize = 3;
let isXTurn = true;
let gameActive = true;
let cells;
let scores = { X: 0, O: 0 };
let soloMode = false;

const initBoard = () => {
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;
    boardElement.style.gridTemplateRows = `repeat(${boardSize}, 100px)`;
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.cell = '';
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
    }
    cells = document.querySelectorAll('[data-cell]');
};

const handleCellClick = (e) => {
    const cell = e.target;
    if (cell.textContent || !gameActive) return;
    cell.textContent = isXTurn ? 'X' : 'O';
    if (checkWin()) {
        gameActive = false;
        scores[isXTurn ? 'X' : 'O']++;
        updateScores();
        turnIndicator.textContent = `${isXTurn ? 'Player X' : 'Player O'} Wins!`;
        setTimeout(resetBoard, 5000);
    } else if (isDraw()) {
        gameActive = false;
        turnIndicator.textContent = 'Draw!';
        setTimeout(resetBoard, 5000);
    } else {
        isXTurn = !isXTurn;
        turnIndicator.textContent = `Player ${isXTurn ? 'X' : 'O'}'s turn`;
        if (soloMode && !isXTurn && gameActive) {
            setTimeout(computerMove, 500);
        }
    }
};

const checkWin = () => {
    const winCombinations = getWinCombinations();
    return winCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent && cells[index].textContent === cells[combination[0]].textContent;
        });
    });
};

const isDraw = () => {
    return [...cells].every(cell => cell.textContent);
};

const resetBoard = () => {
    cells.forEach(cell => cell.textContent = '');
    isXTurn = true;
    gameActive = true;
    turnIndicator.textContent = `Player X's turn`;
};

const showResetModal = () => {
    modal.style.display = 'flex';
};

const hideResetModal = () => {
    modal.style.display = 'none';
};

const updateScores = () => {
    localStorage.setItem('scores', JSON.stringify(scores));
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
};

const getWinCombinations = () => {
    let combinations = [];

    // Rows
    for (let i = 0; i < boardSize; i++) {
        let row = [];
        for (let j = 0; j < boardSize; j++) {
            row.push(i * boardSize + j);
        }
        combinations.push(row);
    }

    // Columns
    for (let i = 0; i < boardSize; i++) {
        let column = [];
        for (let j = 0; j < boardSize; j++) {
            column.push(i + j * boardSize);
        }
        combinations.push(column);
    }

    // Diagonals
    let diagonal1 = [];
    let diagonal2 = [];
    for (let i = 0; i < boardSize; i++) {
        diagonal1.push(i * boardSize + i);
        diagonal2.push(i * boardSize + (boardSize - i - 1));
    }
    combinations.push(diagonal1);
    combinations.push(diagonal2);

    return combinations;
};

const loadScores = () => {
    const savedScores = localStorage.getItem('scores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
    }
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
};

const computerMove = () => {
    const emptyCells = [...cells].filter(cell => !cell.textContent);
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    if (randomCell) {
        randomCell.click();
    }
};

boardSizeSelector.addEventListener('change', (e) => {
    boardSize = parseInt(e.target.value);
    resetBoard();
    initBoard();
});

gameModeSelector.addEventListener('change', (e) => {
    soloMode = e.target.value === '1';
    resetBoard();
});

resetButton.addEventListener('click', showResetModal);
closeButton.addEventListener('click', hideResetModal);
confirmResetButton.addEventListener('click', () => {
    resetBoard();
    hideResetModal();
});
cancelResetButton.addEventListener('click', hideResetModal);

initBoard();
loadScores();
