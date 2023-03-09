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

//User Input, calls appropriate game functions
const userInputManager = (() => {
    const reset = () => {
        gameManager.newGame();
    };

    const inputReceived = (xCoord, yCoord) => {
        gameManager.receiveInput(xCoord, yCoord);

    };

    return {reset, inputReceived};
})();

//User Display, updates buttons and game text
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

    const changeGameText = (message) => {
        const _gameText = document.querySelector('.game-text');
        _gameText.textContent = message;
    }

    return {resetDisplay, updateButton, changeGameText};
})();

//Tracks game state array, allows queries and modifications
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

//Player properties
const player = (playerName, playerType, playerMarker, playerTrackerVal) => {
    const name = playerName; // string display name
    const type = playerType; // CPU or Human
    const marker = playerMarker; // X or O
    const trackerVal = playerTrackerVal; // +1 or -1

    return {name, type, marker, trackerVal};
};

//Manages gamestate, players, win conditions
const gameManager = (() => {
    let players = [];
    let isGameOver = false;
    let round = 1;
    let activePlayer;

    const createPlayers = () => {
        const playerOne = player("PlayerX", "human", "X", 1);
        const playerTwo = player("PlayerO", "human", "O", -1);
        players = [playerOne, playerTwo];
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
        // Reset game vars, UI
        serverBoard.reset()
        userDisplayManager.resetDisplay()
        resetGameVars()
        createPlayers()
        setActivePlayer();
        userDisplayManager.changeGameText(`${activePlayer.name}'s turn`);
    };

    const playRound = (xCoord, yCoord) => {
        if (!isGameOver) {
            serverBoard.changeVal(xCoord, yCoord, activePlayer.trackerVal);
            userDisplayManager.updateButton(xCoord, yCoord, activePlayer.marker);
            evalGameOver();
            
            //Get ready for a new round whenever player input is received
            if (!isGameOver){
                round++;
                setActivePlayer();
                userDisplayManager.changeGameText(`${activePlayer.name}'s turn`);
            };

        };
    };

    /**Evaluate serverBoard for win/draw conditions
     * 8 lines to check: 3 rows, 3 columns, 2 diagonals
     * Player X marks board as +1, Player O marks board as -1, so a line sum of +3 or -3 is a win
     * If 9 rounds have been played without a winner, default to a draw
    */
    const evalGameOver = () => {
        //Evaluator functions
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
                isGameOver = true;
                return declareGameResult(3);
            }
            else if (diag1 == -3 || diag2 == -3) {
                isGameOver = true;
                return declareGameResult(-3);
            };
        };
        
        //Perform the checks: start with rows, then cols, then diags
        checkRows();
        if (!isGameOver){
            checkCols();
            if (!isGameOver){
                checkDiags();
            };
        };

        //All spaces are filled and no winner detected, must be a draw
        if (round == 9 && !isGameOver) {
            isGameOver = true;
            return declareGameResult('draw');
        };
    };

    //Handle game results based on results of evalGameOver
    const declareGameResult = (checkResult) => {
        switch (checkResult) {
            case 3:
                console.log(`Player X wins!`),
                userDisplayManager.changeGameText('PlayerX Wins!');
                break;
            case -3:
                console.log(`Player O wins!`),
                userDisplayManager.changeGameText('PlayerO Wins!');
                break;

            case 'draw':
                console.log(`Game is a Draw!`),
                userDisplayManager.changeGameText('Game is a Draw!');
                break;
        };
    };

    return {newGame, receiveInput};
})();

//Start a fresh game on script load
gameManager.newGame();