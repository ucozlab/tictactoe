class Game {

    el: any;
    buttons: any;
    board: number[];
    game: FinishGame;
    canvas: any;

    constructor() {

        this.el = $(".board");
        this.buttons = this.el.find(".square");
        this.canvas = this.el.find(".canvas");

        this.addEventListeners();
        this.start();
    }

    addEventListeners() {
        this.buttons.click(() => {

            const button = $(event.currentTarget);

            if (!(button.hasClass("zero") || button.hasClass("ex"))) {
                button.addClass("ex").text("X");
                this.board[button.attr("data-square")] = 1;
                this.checkWinner(1) ? this.finishGame() : this.cpuMove();
            }
        });
    }

    start() {
        this.buttons.text("").removeClass("ex").removeClass("zero");
        this.board = [];
        this.game = null;
    }

    cpuMove() {
        const button = this.getRandomButton();

        if ( button.hasClass("ex") || button.hasClass("zero") ) {
            this.cpuMove();
        } else {
            button.addClass("zero").text("0");
            this.board[button.attr("data-square")] = 0;
            this.checkWinner(0) && this.finishGame();
        }

    }

    getRandomButton() {
        return this.buttons.eq(Math.floor((Math.random() * 9)));
    }

    checkWinner(player: number) {

        let method: number;

        // horizontal
        [this.board[0], this.board[1], this.board[2]].every((value) => value === player) && (method = 1);
        [this.board[3], this.board[4], this.board[5]].every((value) => value === player) && (method = 2);
        [this.board[6], this.board[7], this.board[8]].every((value) => value === player) && (method = 3);

        // vertical
        [this.board[0], this.board[3], this.board[6]].every((value) => value === player) && (method = 4);
        [this.board[1], this.board[4], this.board[7]].every((value) => value === player) && (method = 5);
        [this.board[2], this.board[5], this.board[8]].every((value) => value === player) && (method = 6);

        // diagonal
        [this.board[0], this.board[4], this.board[8]].every((value) => value === player) && (method = 7);
        [this.board[2], this.board[4], this.board[6]].every((value) => value === player) && (method = 8);

        method && (this.game = {
            moves: this.board,
            winner: player,
            method: method
        });

        return this.game;

    }

    finishGame() {

        let winCount: number = +$(`.js-won[data-id=${this.game.winner}]`).text();
        $(`.js-won[data-id=${this.game.winner}]`).text(++winCount);

        setTimeout(() => {
            let question: boolean = confirm(`${this.game.winner === 1 ? "player" : "cpu"} wins! Do you want to start new game?`);
            question && this.start();
        }, 1000);

    }

    drawLine() {
        var context = this.canvas.getContext('2d');

        context.beginPath();
        context.moveTo(64, 64);
        context.lineTo(336, 336;
        context.stroke();
    }

}

interface FinishGame {
    moves: number[];
    winner: number;
    method: number;
};