class Game {

    el: any;
    buttons: any;
    board: number[];
    game: FinishGame;

    constructor() {

        this.el = $(".board");
        this.buttons = this.el.find(".square");

        this.addEventListeners();
        this.start();
        $(document).focus();    // 4 keyboard nav
    }

    addEventListeners() {
        this.buttons.click(() => {
            this.buttonSet($(event.currentTarget));
        });

        this.buttons.on("mouseover", () => {
            this.buttons.removeClass("active");
            $(event.currentTarget).addClass("active");
        });

        $(document).on("keyup", (e) => {

            if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {

                let nextActive, activeNow = this.el.find(".active"), activeNowNumber = +activeNow.attr("data-square");

                // left
                if (e.keyCode === 37 && !([0, 3, 6].indexOf(activeNowNumber) > -1)) {
                    nextActive = this.el.find(`[data-square=${activeNowNumber - 1}]`);
                    this.checkSet(nextActive);
                }
                // up
                if (e.keyCode === 38 && !([0, 1, 2].indexOf(activeNowNumber) > -1)) {
                    nextActive = activeNow.prev();
                    this.checkSet(nextActive);
                }
                // right
                if (e.keyCode === 39 && !([2, 5, 8].indexOf(activeNowNumber) > -1)) {
                    nextActive = this.el.find(`[data-square=${activeNowNumber + 1}]`);
                    this.checkSet(nextActive);
                }
                // down
                if (e.keyCode === 40 && !([6, 7, 8].indexOf(activeNowNumber) > -1)) {
                    nextActive = activeNow.next();
                    this.checkSet(nextActive);
                }

            } else if (e.keyCode === 13) {
                // enter
                const activeNow = this.el.find(".active");
                this.buttonSet(activeNow);
                this.checkSet(activeNow);
            }

        });

    }

    buttonSet(button) {

        if (!(button.hasClass("zero") || button.hasClass("ex"))) {
            button.addClass("ex").text("X");
            this.board[button.attr("data-square")] = 1;
            this.checkWinner(1) ? this.finishGame() : this.cpuMove();
        }

    }

    checkSet(button) {

        if (!this.game) {
            this.buttons.removeClass("active denied");
            (button.hasClass("ex") || button.hasClass("zero"))
                ? button.addClass("active denied")
                : button.addClass("active");
        }

    }

    start() {
        this.buttons.text("").removeClass("ex zero denied active");
        this.board = [];
        this.game = null;
        this.el.removeAttr("data-win-method");
        this.buttons.eq(0).addClass("active");
    }

    cpuMove() {
        const button = this.getRandomButton();

        if ( !this.checkDraw() ) {
            if ( button.hasClass("ex") || button.hasClass("zero") ) {
                this.cpuMove();
            } else {
                button.addClass("zero").text("0");
                this.board[button.attr("data-square")] = 0;
                this.checkWinner(0) && this.finishGame();
            }
        } else {
            this.askNewGame();
        }

    }

    checkDraw(): boolean {
        return ((this.el.find(".ex").length + this.el.find(".zero").length) === 9);
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

        method && this.el.attr("data-win-method", method);

        return this.game;

    }

    finishGame() {
        let winCount: number = +$(`.js-won[data-id=${this.game.winner}]`).text();
        $(`.js-won[data-id=${this.game.winner}]`).text(++winCount);
        this.askNewGame();
    }

    askNewGame() {
        setTimeout(() => {
            let gameCount: number = +$(`.js-game`).text(),
                question: boolean =
                    (this.checkDraw() && !this.game)
                        ? confirm(`Draw game! Do you want to start a new one?`)
                        : confirm(`${this.game.winner === 1 ? "player" : "cpu"} wins! Do you want to start new game?`);
            if (question) {
                $(`.js-game`).text(++gameCount);
                this.start();
            }
        }, 1000);
    }

}

interface FinishGame {
    moves: number[];
    winner: number;
    method: number;
};