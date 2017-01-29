var Game = (function () {
    function Game() {
        this.el = $(".board");
        this.buttons = this.el.find(".square");
        this.addEventListeners();
        this.start();
        $(document).focus(); // 4 keyboard nav
    }
    Game.prototype.addEventListeners = function () {
        var _this = this;
        this.buttons.click(function () {
            _this.buttonSet($(event.currentTarget));
        });
        this.buttons.on("mouseover", function () {
            _this.buttons.removeClass("active");
            $(event.currentTarget).addClass("active");
        });
        $(document).on("keyup", function (e) {
            if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                var nextActive = void 0, activeNow = _this.el.find(".active"), activeNowNumber = +activeNow.attr("data-square");
                // left
                if (e.keyCode === 37 && !([0, 3, 6].indexOf(activeNowNumber) > -1)) {
                    nextActive = _this.el.find("[data-square=" + (activeNowNumber - 1) + "]");
                    _this.checkSet(nextActive);
                }
                // up
                if (e.keyCode === 38 && !([0, 1, 2].indexOf(activeNowNumber) > -1)) {
                    nextActive = activeNow.prev();
                    _this.checkSet(nextActive);
                }
                // right
                if (e.keyCode === 39 && !([2, 5, 8].indexOf(activeNowNumber) > -1)) {
                    nextActive = _this.el.find("[data-square=" + (activeNowNumber + 1) + "]");
                    _this.checkSet(nextActive);
                }
                // down
                if (e.keyCode === 40 && !([6, 7, 8].indexOf(activeNowNumber) > -1)) {
                    nextActive = activeNow.next();
                    _this.checkSet(nextActive);
                }
            }
            else if (e.keyCode === 13) {
                // enter
                var activeNow = _this.el.find(".active");
                _this.buttonSet(activeNow);
                _this.checkSet(activeNow);
            }
        });
    };
    Game.prototype.buttonSet = function (button) {
        if (!(button.hasClass("zero") || button.hasClass("ex"))) {
            button.addClass("ex").text("X");
            this.board[button.attr("data-square")] = 1;
            this.checkWinner(1) ? this.finishGame() : this.cpuMove();
        }
    };
    Game.prototype.checkSet = function (button) {
        if (!this.game) {
            this.buttons.removeClass("active denied");
            (button.hasClass("ex") || button.hasClass("zero"))
                ? button.addClass("active denied")
                : button.addClass("active");
        }
    };
    Game.prototype.start = function () {
        this.buttons.text("").removeClass("ex zero denied active");
        this.board = [];
        this.game = null;
        this.el.removeAttr("data-win-method");
        this.buttons.eq(0).addClass("active");
    };
    Game.prototype.cpuMove = function () {
        var button = this.getRandomButton();
        if (!this.checkDraw()) {
            if (button.hasClass("ex") || button.hasClass("zero")) {
                this.cpuMove();
            }
            else {
                button.addClass("zero").text("0");
                this.board[button.attr("data-square")] = 0;
                this.checkWinner(0) && this.finishGame();
            }
        }
        else {
            this.askNewGame();
        }
    };
    Game.prototype.checkDraw = function () {
        return ((this.el.find(".ex").length + this.el.find(".zero").length) === 9);
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
        method && this.el.attr("data-win-method", method);
        return this.game;
    };
    Game.prototype.finishGame = function () {
        var winCount = +$(".js-won[data-id=" + this.game.winner + "]").text();
        $(".js-won[data-id=" + this.game.winner + "]").text(++winCount);
        this.askNewGame();
    };
    Game.prototype.askNewGame = function () {
        var _this = this;
        setTimeout(function () {
            var gameCount = +$(".js-game").text(), question = (_this.checkDraw() && !_this.game)
                ? confirm("Draw game! Do you want to start a new one?")
                : confirm((_this.game.winner === 1 ? "player" : "cpu") + " wins! Do you want to start new game?");
            if (question) {
                $(".js-game").text(++gameCount);
                _this.start();
            }
        }, 1000);
    };
    return Game;
}());
;
