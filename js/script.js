const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const vsComputerText = "COMPUTER";
const vsPlayerText = "PLAYER 2";

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winning-message');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');
const player2Button = document.getElementById('player2');
const computerButton = document.getElementById('computer');
const gameModeText = document.querySelector('[game-mode]');
const gameModeSelector = document.getElementById("mode-selector");

let vsComputer;
let circleTurn;

function setupGame() {
    gameModeSelector.classList.add('hide');
    board.classList.add('show');
}

function setGameModeText(playerType) {
    gameModeText.innerHTML = `${playerType} vs ${vsComputer ? vsComputerText : vsPlayerText}`;
}

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS, CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function setComputerMode() {
    vsComputer = true;
    setupGame();
    setGameModeText("COMPUTER");
}

function setPlayerMode() {
    vsComputer = false;
    setupGame();
    setGameModeText("PLAYER 2");
}

function handleClick(e) {
    if (vsComputer) {
        if (!circleTurn) {
            const cell = e.target;
            if (!cell.classList.contains(CIRCLE_CLASS)) {
                placeMark(cell, X_CLASS);
                gameNotify(X_CLASS);
            }
        } else {
            generateMove();
        }
    } else {
        const cell = e.target;
        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
        placeMark(cell, currentClass);
        gameNotify(currentClass);
    }
}

function generateMove() {
    const availableCells = [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS));
    const randIndex = Math.floor(Math.random() * availableCells.length);
    const randCell = availableCells[randIndex];
    placeMark(randCell, CIRCLE_CLASS);
    gameNotify(CIRCLE_CLASS);
}

function gameNotify(playerClass) {
    if (checkWin(playerClass) || isDraw()) {
        endGame(!checkWin(playerClass));
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS, CIRCLE_CLASS);
    board.classList.add(circleTurn ? CIRCLE_CLASS : X_CLASS);
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

restartButton.addEventListener('click', startGame);
computerButton.addEventListener('click', setComputerMode);
player2Button.addEventListener('click', setPlayerMode);

startGame();
