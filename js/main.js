import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { checkGameStatus } from "./utils.js";
import { 
    getCellElementList,
    getCurrentTurnElement,
    getCellElementAtIdx,
    getGameStatusElement,
    getReplayButton,
    getCellListElement,
} from "./selectors.js";

/**
 * Global variables
 */

let currentTurn = TURN.CROSS;
let cellValues = new Array(9).fill("");
let gameStatus = GAME_STATUS.PLAYING;

// switch turn X O
function toggleTurn() {
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
    updateCurrentTurn(currentTurn);
}

// update current turn
function updateCurrentTurn(currentTurn) {
    const currentTurnElement = getCurrentTurnElement();
    if(currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
}

//update game status
function updateGameStatus(newGameStatus) {
    const gameStatusElement = getGameStatusElement();
    gameStatus = newGameStatus;

    if(gameStatusElement) {
        gameStatusElement.textContent = gameStatus;
    }
}

// show replay button
function showReplayButton() {
    const replayButton = getReplayButton();
    
    if(replayButton) {
        replayButton.classList.add('show');
    }
}

// hightlight win cell
function hightlightWinCells(winPositions) {
    if(!Array.isArray(winPositions) && winPositions.length !== 3) {
        throw new Error('Invalid win positons');
    }
    
    for(const positon of winPositions) {
        const cell = getCellElementAtIdx(positon);
        cell.classList.add('win');
    }
}

// hide replay button
function hideReplayButton() {
    const replayButton = getReplayButton();
    
    if(replayButton) {
        replayButton.classList.remove('show');
    }
}

function handleCellClick(cell, index) {
    //when cell clicked
    const isClicked = cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);
    const isEndGame = gameStatus !== GAME_STATUS.PLAYING;

    if(isClicked || isEndGame) return;

    //set select cell
    cell.classList.add(currentTurn);

    //update game status
    cellValues[index] = currentTurn === TURN.CROSS ? CELL_VALUE.CROSS: CELL_VALUE.CIRCLE;

    //toogle turn
    toggleTurn();

    //update game status
    const game = checkGameStatus(cellValues);
    console.log(game);
    switch(game.status) {
        case GAME_STATUS.ENDED: {
            //update game status
            updateGameStatus(game.status);

            //show replay button
            showReplayButton();
            //hightlight win cell
            break;
        }
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN: {
            //update game status
            updateGameStatus(game.status);

            //show replay button
            showReplayButton();

            //hightlight win cell
            hightlightWinCells(game.winPositions)
            break;
        }
        default:
    }
}

function handleResetGame() {
    currentTurn = TURN.CROSS;
    cellValues  = cellValues.map(() => '');
    gameStatus  = GAME_STATUS.PLAYING;

    // update game status
    updateGameStatus(gameStatus);

    // remove game board
    const cellElementList = getCellElementList();
    if(!cellElementList) return;
    
    for(const cell of cellElementList) {
        cell.className = '';
    }

    // hide replay button
    hideReplayButton();

    //reset current turn
    updateCurrentTurn(currentTurn);
}

//init cell element list
function initCellElementList() {
    const cellElementList = getCellElementList(),
          cellListElement = getCellListElement();

    if(!cellElementList && !cellListElement) return;

    // set data index cell element
    cellElementList.forEach((cell, index) => {
        cell.dataset.idx = index;
    })

    //ref data to index cell element
    cellListElement.addEventListener('click', function(event) {
        const target = event.target;
        
        if(target.tagName !== 'LI') return;
        
        handleCellClick(target, target.dataset.idx);
    })
}
 
//init replay button
function initReplayButton() {
    const replayButton = getReplayButton();
    if(!replayButton) return;

    replayButton.addEventListener('click', handleResetGame);
}
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

// main
(() => {
    initCellElementList();
    initReplayButton();
})()
