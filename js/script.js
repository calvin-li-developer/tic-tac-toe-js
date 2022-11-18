const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';

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

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function setComputerMode()
{
    vsComputer = true;
    gameModeSelector.classList.add('hide');
    board.classList.add('show');
    gameModeText.innerHTML = " vs " + "COMPUTER";
}

function setPlayerMode()
{
    vsComputer = false;
    gameModeSelector.classList.add('hide');
    board.classList.add('show');
    gameModeText.innerHTML = " vs " + "PLAYER 2";
}

function handleClick(e) {

    if (vsComputer)
    {
        const cell = e.target;
        
        if (circleTurn == false)
        {
            if (!cell.classList.contains("circle"))
            {
                placeMark(cell, X_CLASS);

                gameNotify(X_CLASS);
            }
        }
        if (circleTurn == true)
        {   
            oPlaced = false
            for (let i = 0; i < cellElements.length; i++) {
                selected_cell = cellElements[i]
                if (!selected_cell.classList.contains("x") && !selected_cell.classList.contains("circle"))
                {
                    placeMark(selected_cell, CIRCLE_CLASS);
                    if (checkWin(CIRCLE_CLASS))
                    {
                        gameNotify(CIRCLE_CLASS);
                        oPlaced = true
                        break
                    }
                    else
                    {
                        selected_cell.classList.remove(CIRCLE_CLASS);
                    }
                }
            }

            if (oPlaced == false)
            {
                for (let i = 0; i < cellElements.length; i++) {
                    selected_cell = cellElements[i]
                    if (!selected_cell.classList.contains("x") && !selected_cell.classList.contains("circle"))
                    {
                        placeMark(selected_cell, X_CLASS);
                        if (checkWin(X_CLASS))
                        {
                            selected_cell.classList.remove(X_CLASS);
                            placeMark(selected_cell, CIRCLE_CLASS);
                            gameNotify(CIRCLE_CLASS);
                            oPlaced = true
                            break
                        }
                        else
                        {
                            selected_cell.classList.remove(X_CLASS);
                        }
                    }
                }
            }

            if (oPlaced == false)
            {
                generateMove();
            }
        }
    }
    else
    {
        const cell = e.target;
        const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

        placeMark(cell, currentClass);

        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        }
        else {
            swapTurns();
            setBoardHoverClass();
        }
    }
}

function generateMove()
{
    value = Math.floor(Math.random()*cellElements.length)
    rand_cell = cellElements[value]

    while (rand_cell.classList.contains("x") || rand_cell.classList.contains("circle"))
    {
        value = Math.floor(Math.random()*cellElements.length)
        rand_cell = cellElements[value]
    }
    placeMark(rand_cell, CIRCLE_CLASS);
    gameNotify(CIRCLE_CLASS);
}

function gameNotify(playerClass)
{
    if (checkWin(playerClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    }
    else {
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
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    }
    else {
        board.classList.add(X_CLASS);
    }
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
    }
    else {
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