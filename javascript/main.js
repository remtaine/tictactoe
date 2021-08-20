const gameSquares = Array.from(document.getElementsByClassName('game-square'));
// const gameGrid = document.getElementById('game-grid');
const buttonRestart = document.getElementById('restart');
const buttonSetup = document.getElementById('setup');
const buttonSubmit = document.getElementById('submit');
const overlay = document.getElementById('overlay');

buttonRestart.addEventListener('click', function() {
    document.getElementById("name-prompt").reset(); 
    location.reload();
});

buttonSetup.addEventListener('click', function() {
    overlay.style.display = "flex";
});

buttonSubmit.addEventListener('click', function() {
    let n1 = document.getElementById('name1').value;
    let n2 = document.getElementById('name2').value;
    // let b1 = document.getElementById('bot1').checked;
    // let b2 = document.getElementById('bot2').checked;
    
    const form = new FormData(document.getElementById('name-prompt'));
    if (n1 != null) players[0].name = n1;
    if (n2 != null) players[1].name = n2;
    // players[0].name = form.get('name1');
    // players[1].name = form.get('name2');
    

    // players[0].isBot = b1;
    // players[1].isBot = b2;

    console.log("It's " + players[0].name + " vs " + players[1].name +"!");
    // console.log("It's " + ((players[0].isBot) ? "bot" : "human") + " vs " + ((players[1].isBot) ? "bot" : "human") +"!");

    // document.getElementById("name-prompt").reset(); 
    overlay.style.display = "none";
});

for (let i=0; i<gameSquares.length; i++) {
    let square = gameSquares[i]
    square.addEventListener('click', function() {
        if (!square.classList.contains('filled') && !square.classList.contains('done') && !square.classList.contains('win')){
            GameManager.placePiece(square);
        }
    });
}
//TODO GameBoard module
const GameBoard = (function() {
    let squareTokens = ['', '', '', '', '', '', '', '', '']; //blank string nine times

    const changeToken = function(pos, token) {
        if (squareTokens[pos] === '') {
            squareTokens[pos] = token;
        }
    };

    const getToken = function(pos) {
        return squareTokens[pos];
    };

    const isFull = function() {
        return (!squareTokens.includes(''));
    };

    const getBoardState = function() {
        return squareTokens;
    };

    return {changeToken, getToken, isFull, getBoardState};
})();

//TODO GameManager module
const GameManager = (function(){
    const title = document.getElementById('title');
    const defaultTitle = title.innerHTML;

    // let turns = ['X', 'O'];
    let turns = ['X', 'O'];
    let currentTurnIndex = 0;

    const placePiece = function(square) {
        let n = []
        n[0] = (players[0].name !== "") ? players[0].name: turns[0];
        n[1] = (players[1].name !== "") ? players[1].name: turns[1];

        square.innerHTML = turns[currentTurnIndex];
        square.classList.add('filled');

        let pos = gameSquares.indexOf(square);
        let token = turns[currentTurnIndex];

        GameBoard.changeToken(pos, token);

        if (checkState(token) === "win") {
            markSquares('done');
            title.innerHTML = n[currentTurnIndex] + " Wins!";
        }
        // else if (checkState(token) === "lose") {

        // }
        else if (checkState(token) === "tie") {
            markSquares('done');
            title.innerHTML = "It's a Tie!";
        }
        else {
            currentTurnIndex = (currentTurnIndex + 1) % turns.length;
            title.innerHTML = n[currentTurnIndex] + "'s Turn!";
        }
    };

    const markSquares = function(c) {
        for (let i=0; i<gameSquares.length; i++) {
            let square = gameSquares[i]
            square.classList.add(c);
        }
    }
    const checkState = function(token) {
        //rows
        for (let i=0; i < 3; i++) {
            let mark = [];
            mark[0] = 3 * i;
            mark[1] = mark[0] + 1;
            mark[2] = mark[0] + 2;

            if (GameBoard.getToken(mark[0]) === token && GameBoard.getToken(mark[1]) === token && 
                    GameBoard.getToken(mark[2]) === token) {
                gameSquares[mark[0]].classList.add('win');
                gameSquares[mark[1]].classList.add('win');
                gameSquares[mark[2]].classList.add('win');
                return 'win';
            }
        }
        //column
        for (let i=0; i < 3; i++) {

            let mark = [];
            mark[0] = i;
            mark[1] = mark[0] + 3;
            mark[2] = mark[1] + 3;
            if (GameBoard.getToken(mark[0]) === token && GameBoard.getToken(mark[1]) === token && 
                    GameBoard.getToken(mark[2]) === token) {
                gameSquares[mark[0]].classList.add('win');
                gameSquares[mark[1]].classList.add('win');
                gameSquares[mark[2]].classList.add('win');
                return 'win';
            }
            // if (GameBoard.getToken(i) === token && GameBoard.getToken(3 + i) === token && 
            // GameBoard.getToken(6 + i) === token) return 'win';
        }
        //diagonals
        if (GameBoard.getToken(0) === token && GameBoard.getToken(4) === token && GameBoard.getToken(8) === token) { 
            gameSquares[0].classList.add('win');
            gameSquares[4].classList.add('win');
            gameSquares[8].classList.add('win');
            return 'win';
        }
        if (GameBoard.getToken(2) === token && GameBoard.getToken(4) === token && GameBoard.getToken(6) === token)
        {
            gameSquares[2].classList.add('win');
            gameSquares[4].classList.add('win');
            gameSquares[6].classList.add('win');
            return 'win';
        }

        //full board
        if (GameBoard.isFull()) return 'tie';

        return 'none';
    };

    return {placePiece, checkState};
})();

//TODO Player factory
const Player = (name, piece, isBot = false) => {
    // const getPiece = () => piece;
    return {name, isBot};
};

//MAIN
const players = [];
players[0] = Player("", "X");
players[1] = Player("", "O");