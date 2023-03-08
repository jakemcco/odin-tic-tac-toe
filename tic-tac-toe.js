

/* TESTING */

// const myBoard = gameBoard();
// const myUserBoard = userBoard();
const gameOptions = "empty for now"




/* Button Function Bindings */
const gridButtons = Array.from(document.getElementsByClassName("ttt-grid-cell"));

gridButtons.forEach(item => {
    item.addEventListener('click', (e) => {
        userBoard.inputReceived(e.target.dataset.x, e.target.dataset.y);
    });
});

const resetButton = document.getElementsByClassName("btn-reset-game")[0];

resetButton.addEventListener('click', () => {
    userBoard.reset();
});




/**
 * 
 */

const userBoard = (() => {

    const reset = () => {
        gridButtons.forEach( item => {
            item.textContent ="";
        });
    };

    const updateButton = (xCoord, yCoord, newVal) => {
        const _gridButton = document.querySelector(`[data-x="${xCoord}"][data-y="${yCoord}"]`);
        _gridButton.textContent = newVal;
    };

    const inputReceived = (xCoord, yCoord) => {
        const _xCoord = xCoord;
        const _yCoord = yCoord;

        if (serverBoard.isEmpty(_xCoord, _yCoord)){
            reset();//myBoard.changeVal(x,y, newVal); //when gameboard changes Val, should call updateDisplay function
            gridButtons.forEach( item => {
                item.textContent ="X";
            });
        };
    }

    return {reset, inputReceived, updateButton};
})();


const serverBoard = (() => {

    const _gridDefault = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    let grid = _gridDefault;

    const reset = () => {
        grid = _gridDefault;
    };

    const getGrid = () => {
        return grid;
    };

    const isEmpty = (xCoord, yCoord) => {
        return (grid[xCoord][yCoord] == 0);
    };

    const changeVal = (xCoord, yCoord, newVal) => {
        grid[xCoord][yCoord] = newVal;
    };

    return {getGrid, reset, isEmpty, changeVal};
})();


const player = (playerID, playerName, playerType, playerMarker) => {
    const id = playerID; // 1, 2
    const name = playerName; // string display name
    const type = playerType; // CPU or Human
    const marker = playerMarker; // X or O

    return {id, name, type, marker};
};


const gameManager = (() => {

    let players = [];

    const getPlayers = () => {
        return players;
    }

    const createPlayers = () => {
        const playerOne = player(1, "Player1", "human", "X");
        const playerTwo = player(2, "Player2", "cpu", "O");
        players = [playerOne, playerTwo]; // Needs gameManager.VARIABLE to set correctly.
    };

    const newGame = () => {
        serverBoard.reset()
        userBoard.reset()
        createPlayers()
        //resetGamestate
    };

    // const createPlayers = () => {
    //     const playerOne = player(1, "Player1", "human", "X");
    //     const playerTwo = player(2, "Player2", "cpu", "O");
    //     players = [playerOne, playerTwo];
    // };
        //startTurn

    /*
    Action/Turn tracker
        set starting player

        Player action -> evaluate game state against game conclusion criteria
            if concluded, determine outcome, update display
            else
                switch active player, wait for active player action

        
        
        wait for user input
        validate user input
            if valid -> update game state
            if invalid -> wait for user input
        
        update game state ->

    */


     /* Board updater
     * Board evaluator
     *      
     */
    return {getPlayers, createPlayers, newGame};
})();

/* Game State Manager */
    /*
    Game state array
    Game state evaluator
    Player

    */

/* Display Manager */
    /*
        Clear/reset grid
        Update grid

    */


/* TESTING */
