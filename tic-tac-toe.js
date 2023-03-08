

/* TESTING */

// const myBoard = gameBoard();
// const myUserBoard = userBoard();
const gameOptions = "empty for now"




/* Button Function Bindings */
const gridButtons = Array.from(document.getElementsByClassName("ttt-grid-cell"));

gridButtons.forEach(item => {
    item.addEventListener('click', (e) => {
        userInputManager.inputReceived(e.target.dataset.x, e.target.dataset.y);
    });
});

const resetButton = document.getElementsByClassName("btn-reset-game")[0];

resetButton.addEventListener('click', () => {
    userInputManager.reset();
});


const userInputManager = (() => {

    const reset = () => {
        gameManager.newGame();
    };

    const inputReceived = (xCoord, yCoord) => {
        gameManager.receiveInput(xCoord, yCoord);

    };

    return {reset, inputReceived};
})();



const userDisplayManager = (() =>{
    const resetDisplay = () => {
        gridButtons.forEach( item => {
            item.textContent ="";
        });
    };

    const updateButton = (xCoord, yCoord, newVal) => {
        const _gridButton = document.querySelector(`[data-x="${xCoord}"][data-y="${yCoord}"]`);
        _gridButton.textContent = newVal;
    };

    return {resetDisplay, updateButton};
})();





const serverBoard = (() => {

    const _gridDefault = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    let grid = _gridDefault;

    const reset = () => {
        grid.splice(0, grid.length, [0, 0, 0], [0, 0, 0], [0, 0, 0]);
    };

    const getGrid = () => {
        return grid;
    };

    const isEmpty = (xCoord, yCoord) => {
        return (grid[yCoord][xCoord] == 0);
    };

    const changeVal = (xCoord, yCoord, newVal) => {
        grid[yCoord][xCoord] = newVal;
    };

    return {getGrid, reset, isEmpty, changeVal};
})();


const player = (playerName, playerType, playerMarker, playerTrackerVal) => {
    const name = playerName; // string display name
    const type = playerType; // CPU or Human
    const marker = playerMarker; // X or O
    const trackerVal = playerTrackerVal; // +1 or -1

    return {name, type, marker, trackerVal};
};


const gameManager = (() => {

    let players = [];
    let isGameOver = false;
    let round = 1;
    let activePlayer;

    const createPlayers = () => {
        const playerOne = player("PlayerX", "human", "X", 1);
        const playerTwo = player("PlayerO", "human", "O", -1);
        players = [playerOne, playerTwo]; // Needs gameManager.VARIABLE to set correctly.
    };

    const getPlayers = () => {
        return players;
    };

    const setActivePlayer = () => {
        if (round % 2) {
            activePlayer = players[0];
        } else {
            activePlayer = players[1];
        };
    };

    const resetGameVars = () => {
        this.players = [];
        isGameOver = false;
        round = 1;
        activePlayer = undefined;
    };

    const receiveInput = (xCoord, yCoord) => {
        if (serverBoard.isEmpty(xCoord, yCoord)){
            playRound(xCoord, yCoord);
        };
    };

    const newGame = () => {
        // Reset gamestates
        serverBoard.reset()
        userDisplayManager.resetDisplay()
        resetGameVars()
        createPlayers()
        setActivePlayer();
    };

    const playRound = (xCoord, yCoord) => {
        if (!isGameOver) {
            serverBoard.changeVal(xCoord, yCoord, activePlayer.trackerVal);
            userDisplayManager.updateButton(xCoord, yCoord, activePlayer.marker);
            round++;
            setActivePlayer();
        }
        else {
            declareWinner();
        };

    }
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
    return {getPlayers, createPlayers, newGame, receiveInput, playRound};
})();

gameManager.newGame();
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
