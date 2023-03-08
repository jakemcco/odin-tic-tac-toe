

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
        //grid.splice(0, grid.length, [0, 0, 0], [0, 0, 0], [0, 0, 0]);// This also works
        grid.forEach((item, index) => {
            grid[index] = [0, 0, 0]; 
        });
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
    let gameResult;
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
            evalGameOver();

            if (!isGameOver){
                round++;
                setActivePlayer();
            };

        };
    };

    //Evaluate 8 possible lines, 3 rows, 3 columns, 2 diagonals
    const evalGameOver = () => {
                
        const checkRows = () => {
            for  (let i=0; i<3; i++) {
                const rowSum = serverBoard.getGrid()[i][0] + serverBoard.getGrid()[i][1] + serverBoard.getGrid()[i][2];
                if (rowSum == 3) {
                    isGameOver = true;
                    return declareGameResult(3);
                }
                else if (rowSum == -3){
                    isGameOver = true;
                    return declareGameResult(-3);
                };
            };
        };

        const checkCols = () => {
            for  (let j=0; j<3; j++) {
                const colSum = serverBoard.getGrid()[0][j] + serverBoard.getGrid()[1][j] + serverBoard.getGrid()[2][j];
                if (colSum == 3) {
                    isGameOver = true;
                    return declareGameResult(3);
                }
                else if (colSum === -3){
                    isGameOver = true;
                    return declareGameResult(-3);
                };
            };
        };

        const checkDiags = () => {
            const diag1 = serverBoard.getGrid()[0][0] + serverBoard.getGrid()[1][1] + serverBoard.getGrid()[2][2];
            const diag2 = serverBoard.getGrid()[2][0] + serverBoard.getGrid()[1][1] + serverBoard.getGrid()[0][2];

            if (diag1 == 3 || diag2 == 3) {
                return declareGameResult(3);
            }
            else if (diag1 == -3 || diag2 == -3) {
                return declareGameResult(-3);
            };
        };
        
        checkRows();
        if (!isGameOver){
            checkCols();
            if (!isGameOver){
                checkDiags();
            };
        };

        if (round == 9 && !isGameOver) {
            return declareGameResult('draw');
        };

    };

    const declareGameResult = (checkResult) => {

        switch (checkResult) {
            case 3:
                console.log(`Player X wins!`);
                break;
            case -3:
                console.log(`Player O wins!`);
                break;

            case 'draw':
                console.log(`Game is a Draw!`);
                break;
        };

    };

    return {getPlayers, createPlayers, newGame, receiveInput, playRound};
})();

gameManager.newGame();

/* TESTING */
