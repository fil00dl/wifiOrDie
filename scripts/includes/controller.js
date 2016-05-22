(function () {

    window.game = window.game || {}

    function Controller(stage, world, ui) {
        this.initialize(stage, world, ui);
    }

    const ARROW_KEY_LEFT = 37;
    const ARROW_KEY_RIGHT = 39;
    const ARROW_KEY_DOWN = 40;
    const ARROW_KEY_UP = 38;
    const KEY_A = 65;
    const KEY_Q = 81;
    const KEY_D = 68;

    const DELTA_MOVE = 50;

    var p = Controller.prototype = new createjs.Container();

    var refWorld = null;
    var refUI = null;
    var sWidth;
    var sHeight;

    var keys = {};

    p.initialize = function (stage, world, ui) {
        sWidth = stage.canvas.width;
        sHeight = stage.canvas.height;
        refWorld = world;
        refUI = ui;

        stage.addChild(this);

        if ('ontouchstart' in document.documentElement) {
            canvas.addEventListener('touchstart', function (e) {
                handleKeyDown();
            }, false);

        } else {
            document.onkeydown = handleKeyDown; //addEventListener("keydown",handleKeyDown);
            document.onkeyup = handleKeyUp; //addEventListener("keyup",handleKeyUp);
        }
    }

    function handleKeyDown(e) {
        var currentSpeed = refWorld.getSpeed();
        var refCharacter = refWorld.getCharacter();
        keys[e.keyCode] = true;
        if (debug) {
            switch (e.keyCode) {
                case ARROW_KEY_UP:
                    if (currentSpeed < 2000) {
                        refWorld.setSpeed(currentSpeed + 10);
                    }
                    break;
                case ARROW_KEY_DOWN:
                    if (currentSpeed > 0) {
                        refWorld.setSpeed(currentSpeed - 10);
                    }
                    break;
                case ARROW_KEY_LEFT:
                case KEY_A:
                case KEY_Q:
                    refCharacter.moveToHorizontal(refCharacter.x - DELTA_MOVE);
                    break;
                case ARROW_KEY_RIGHT:
                case KEY_D:
                    refCharacter.moveToHorizontal(refCharacter.x + DELTA_MOVE);
                    break;
                case 97://1 numpad
                    break;
                case 98://2 numpad
                    break;
                case 99://3 numpad
                    break;
                case 100://4 numpad
                    break;
                case 106://6 numpad
                    break;
                case 107://7 numpad dezoom
                    refWorld.setZoom("+");
                    break;
                case 109://9 numpad zoom
                    refWorld.setZoom("-");
                    break;
                case 105://9 numpad
                    break;
            }
        } else {
            switch (e.keyCode) {
                case ARROW_KEY_LEFT:
                case KEY_A:
                case KEY_Q:
                    refCharacter.moveToHorizontal(refCharacter.x - DELTA_MOVE);
                    break;
                case ARROW_KEY_RIGHT:
                case KEY_D:
                    refCharacter.moveToHorizontal(refCharacter.x + DELTA_MOVE);
                    break;
            }
        }
    }

    function handleKeyUp(e) {
        keys[e.keyCode] = false;
    }

    window.game.Controller = Controller;

}());