var Game = (function () {
    function Game() {
        this.el = $(".board");
        this.buttons = this.el.find(".square");
        this.addEventListeners();
        this.start();
    }
    Game.prototype.addEventListeners = function () {
        var _this = this;
        this.buttons.click(function () {
            var button = $(event.currentTarget);
            if (!(button.hasClass("zero") || button.hasClass("ex"))) {
                button.addClass("ex").text("X");
                _this.board[button.attr("data-square")] = 1;
                _this.checkWinner(1) ? _this.finishGame() : _this.cpuMove();
            }
        });
    };
    Game.prototype.start = function () {
        this.buttons.text("").removeClass("ex").removeClass("zero");
        this.board = [];
        this.game = null;
    };
    Game.prototype.cpuMove = function () {
        var button = this.getRandomButton();
        if (button.hasClass("ex") || button.hasClass("zero")) {
            this.cpuMove();
        }
        else {
            button.addClass("zero").text("0");
            this.board[button.attr("data-square")] = 0;
            this.checkWinner(0) && this.finishGame();
        }
    };
    Game.prototype.getRandomButton = function () {
        return this.buttons.eq(Math.floor((Math.random() * 9)));
    };
    Game.prototype.checkWinner = function (player) {
        var method;
        // horizontal
        [this.board[0], this.board[1], this.board[2]].every(function (value) { return value === player; }) && (method = 1);
        [this.board[3], this.board[4], this.board[5]].every(function (value) { return value === player; }) && (method = 2);
        [this.board[6], this.board[7], this.board[8]].every(function (value) { return value === player; }) && (method = 3);
        // vertical
        [this.board[0], this.board[3], this.board[6]].every(function (value) { return value === player; }) && (method = 4);
        [this.board[1], this.board[4], this.board[7]].every(function (value) { return value === player; }) && (method = 5);
        [this.board[2], this.board[5], this.board[8]].every(function (value) { return value === player; }) && (method = 6);
        // diagonal
        [this.board[0], this.board[4], this.board[8]].every(function (value) { return value === player; }) && (method = 7);
        [this.board[2], this.board[4], this.board[6]].every(function (value) { return value === player; }) && (method = 8);
        method && (this.game = {
            moves: this.board,
            winner: player,
            method: method
        });
        return this.game;
    };
    Game.prototype.finishGame = function () {
        var _this = this;
        var winCount = +$(".js-won[data-id=" + this.game.winner + "]").text();
        $(".js-won[data-id=" + this.game.winner + "]").text(++winCount);
        setTimeout(function () {
            var question = confirm((_this.game.winner === 1 ? "player" : "cpu") + " wins! Do you want to start new game?");
            question && _this.start();
        }, 1000);
    };
    return Game;
}());
;
