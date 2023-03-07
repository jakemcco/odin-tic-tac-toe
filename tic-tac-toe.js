






/** Input Handler 
*/

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


/** Input Validation
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



/**
 * Display Update
 * @returns 
 */

    //document.querySelector(`[data-x="${xCoord}"][data-y="${yCoord}"]`);


    /* Button event listeners
        var elements = document.getElementsByClassName("class");

            for (var i=0; i<elements.length; i++) {
                elements[i].addEventListener("click", function(){…});
        }

        OR

        Array.from(document.getElementsByClassName("class"))
            .forEach(function(element){
                element.addEventListener("click", function(){…});
        });

        New Game / Reset buttons    
    */


const serverBoard = (() => {
    let grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]

    const isEmpty = (xCoord, yCoord) => {
        return (grid[xCoord][yCoord] == 0);
    }

    // grid[y][x],
    return {grid, isEmpty};
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

// const myBoard = gameBoard();
// const myUserBoard = userBoard();