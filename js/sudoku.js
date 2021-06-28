/*
Author: Jani Heinikoski
Last modified: 28.06.2021
Description: Sudoku game logic
Sources:*/
/* ---------------------- GLOBAL VARIABLES ----------------------*/
// Minimum amount of correctly filled clues
const MIN_CLUES = 17;
// Represents the Sudoku as an 2d-array consisting of the input elements
const GAME_GRID = [];
// An example sudoku
const EXAMPLE_GAME_SLOW = [
    [3, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 7, 0, 0, 0, 5, 0, 3, 9],
    [0, 0, 0, 0, 0, 7, 0, 6, 2],
    [0, 0, 0, 0, 0, 0, 6, 0, 0],
    [0, 0, 0, 4, 8, 0, 2, 9, 0],
    [8, 5, 3, 0, 0, 6, 0, 1, 0],
    [2, 0, 6, 0, 0, 0, 3, 0, 0],
    [0, 0, 0, 7, 9, 0, 0, 0, 6],
    [0, 0, 0, 0, 0, 8, 0, 0, 4],
];
const EXAMPLE_GAME_FAST = [
    [8, 2, 0, 3, 0, 0, 0, 0, 0],
    [4, 9, 0, 0, 0, 6, 0, 7, 1],
    [0, 1, 0, 4, 0, 0, 0, 0, 9],
    [0, 0, 0, 0, 0, 5, 3, 0, 0],
    [0, 4, 9, 0, 7, 0, 0, 0, 2],
    [3, 6, 2, 9, 0, 0, 7, 0, 0],
    [0, 3, 0, 0, 6, 8, 0, 0, 5],
    [0, 7, 0, 0, 0, 9, 0, 1, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 7],
];
// ON/OFF -flag to swap between examples
let GAME_FLAG = false;
/* ---------------------- UTILITY FUNCTIONS ----------------------*/
// Checks that the sudoku contains at least n clues (see project/docs/sudoku_solver_plan.docx)
const checkClueCount = (n, gameGrid) => {
    let count = 0;
    gameGrid.forEach((row) => {row.forEach((clue) => {if (clue.value !== '') count++;})});
    return count >= n;
}
// Returns the (0-based) row and col of the top-left cell in a three by three Sudoku grid 
const getStartOf3by3 = (row, col) => {
    let getCol = (r) => {
        if (col >= 0 && col <= 2)
            return [r, 0];
        else if (col >= 3 && col <= 5)
            return [r, 3];
        else
            return [r, 6];
    }
    if (row >= 0 && row <= 2)
        return getCol(0);
    else if (row >= 3 && row <= 5)
        return getCol(3);
    else
        return getCol(6);
}
// Checks if the number at gameGrid[row][col] fits as per Sudoku's rules
const fits = (row, col, gameGrid) => {
    let val = gameGrid[row][col].value, r, c;
    // An empty cell always "fits"
    if (val === '')
        return true;
    // Check if the row has the same number already
    for (let i = 0; i < 9; i++)
        if (gameGrid[row][i].value === val && i !== col)
            return false;
    // Check if the column has the same number already
    for (let i = 0; i < 9; i++)
        if (gameGrid[i][col].value === val && i !== row)
            return false;
    [r, c] = getStartOf3by3(row, col);
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (gameGrid[r + i][c + j].value === val && (r + i) !== row && (c + j) !== col)
                return false;
    return true;
}
// Checks if the grid has been filled with proper values
const checkGridSanity = (gameGrid) => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            // If a cell contains something, it must be a number between 1 and 9
            if (gameGrid[i][j].value !== '' && !(gameGrid[i][j].value <= 9 && gameGrid[i][j].value >= 1))
                return false;
            if (!fits(i, j, gameGrid)) 
                return false;
        }
    }
    return checkClueCount(MIN_CLUES, gameGrid);
}
// Get the (row, col) of the first empty cell
const getNextAvailableCell = (gameGrid) => {
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
            if (gameGrid[i][j].value === '')
                return [i, j];
    return null;
}
// Loads (and displays) an example game
const loadExampleGame = (exampleGame, gameGrid) => {
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
            gameGrid[i][j].value = (exampleGame[i][j] === 0) ? '' : exampleGame[i][j];
}
/* ---------------------- SOLVING LOGIC ----------------------*/
// Solves the sudoku by using a naive exhaustive brute force algorithm 
const bruteForceSolve = (gameGrid) => {
    let coords = getNextAvailableCell(gameGrid), solved = false;
    if (coords === null) {
        return true;
    }
    for (let i = 1; i <= 9 && solved === false; i++) {
        gameGrid[coords[0]][coords[1]].value = i;
        if (fits(coords[0], coords[1], gameGrid)) {
             if (bruteForceSolve(gameGrid)) {
                solved = true;
                return true;
             }
        }
    }
    gameGrid[coords[0]][coords[1]].value = '';
    return false;
}
/* ---------------------- INITIALIZATION ----------------------*/
// Fetches the references of the game grid's input elements to the global GAME_GRID array
const initializeGameGrid = () => {
    for (let i = 1; i < 10; i++) {
        GAME_GRID[i - 1] = [];
        for (let j = 1; j < 10; j++) {
            GAME_GRID[i - 1].push(document.getElementById(`${i}${j}`));
        }
    }
}
// Initialize the game grid before adding event listeners to the buttons
initializeGameGrid();
// Event listener for the "Solve Button"
const SOLVE_BTN = document.getElementsByClassName('solve')[0];
SOLVE_BTN.addEventListener('click', () => {
    if (checkGridSanity(GAME_GRID))
        bruteForceSolve(GAME_GRID) === true ? console.log('Solution found') : console.log('No solution');
    
});
// Event listener for the "Reset Button"
const RESET_BTN = document.getElementsByClassName('reset')[0];
RESET_BTN.addEventListener('click', () => {
    GAME_GRID.forEach((arr) => {arr.forEach((element) => {element.value = ''})});
})
// Event listener for the "Load Example Button"
const EXAMPLE_BTN = document.getElementsByClassName('example')[0];
EXAMPLE_BTN.addEventListener('click', () => {
    if (GAME_FLAG)
        loadExampleGame(EXAMPLE_GAME_SLOW, GAME_GRID);
    else
        loadExampleGame(EXAMPLE_GAME_FAST, GAME_GRID);
    GAME_FLAG = !GAME_FLAG;
});