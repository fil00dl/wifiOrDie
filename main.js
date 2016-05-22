//--- WIFI OR DIE : a game by WE DARE CREATE, developed during LUDUM DARE 30 ----//
// main developer : Philippe De Luca : fil00dl@gmail.com

var debug = false;//display fps and distance, also numpad shortcut
var directPlay = false; //if true : splash screen is not displayed
var mouseAllowed = true; //if false : controls without mouse (gameplay for mobile version -> WIP)

var screen_width, screen_height;
var real_width, real_height;
var canvas, stage;
var intro;
var hud;
var gameOver = null;
var controller;
var preLoader;
var assets;
var spriteSheet;
var fontSheet;
var wifi0Sheet, wifi1Sheet, wifi2Sheet, wifi3Sheet, wifi4Sheet;
var world;
var isUpdate = true;
var isGame = false;
var isTutorial = true;

var bestScore = 0;

function init() {
    // set globals
    canvas = document.getElementById('canvas');
    stage = new createjs.Stage(canvas);
    screen_width = canvas.width;
    screen_height = canvas.height;
    // end globals
    createjs.Touch.enable(stage);
    stage.enableMouseOver();
    //init assets queue
    assets = new game.AssetManager();
    preloadAssets();
    window.onresize = resizeGame;
    resizeGame();
}

function preloadAssets() {
    preLoader = new Preloader('#0F0', '#FFF');
    preLoader.x = (stage.canvas.width / 2) - (preLoader.width / 2);
    preLoader.y = (stage.canvas.height / 2) - (preLoader.height / 2);
    stage.addChild(preLoader);
    assets.on(assets.ASSETS_PROGRESS, onAssetsProgress);
    assets.on(assets.ASSETS_COMPLETE, onAssetsComplete);
    assets.preloadAssets();
}

function onAssetsProgress() {
    preLoader.update(assets.loadProgress);
    stage.update();
}
function onAssetsComplete() {
    stage.removeChild(preLoader);
    stage.enableMouseOver();

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", update);

    fontSheet = new createjs.SpriteSheet(assets.getAsset(assets.FONT_SHEET_DATA));
    spriteSheet = new createjs.SpriteSheet(assets.getAsset(assets.GAME_SPRITES_DATA));
    wifi0Sheet = new createjs.SpriteSheet(assets.getAsset(assets.ANIM_WIFI0_DATA));
    wifi1Sheet = new createjs.SpriteSheet(assets.getAsset(assets.ANIM_WIFI1_DATA));
    wifi2Sheet = new createjs.SpriteSheet(assets.getAsset(assets.ANIM_WIFI2_DATA));
    wifi3Sheet = new createjs.SpriteSheet(assets.getAsset(assets.ANIM_WIFI3_DATA));
    wifi4Sheet = new createjs.SpriteSheet(assets.getAsset(assets.ANIM_WIFI4_DATA));

    startIntro();
}

function resizeGame() {
    var nTop, nLeft, scale;
    var gameWrapper = document.getElementById('gameWrapper');
    var w = window.innerWidth;
    var h = window.innerHeight;
    real_width = window.innerWidth;
    real_height = window.innerHeight;
    var widthToHeight = canvas.width / canvas.height;
    var newWidthToHeight = real_width / real_height;
    if (newWidthToHeight > widthToHeight) {
        real_width = real_height * widthToHeight;
        scale = real_width / canvas.width;
        nLeft = (w / 2) - (real_width / 2);
        gameWrapper.style.left = (nLeft) + "px";
        gameWrapper.style.top = "0px";
    } else {
        real_height = real_width / widthToHeight;
        scale = real_height / canvas.height;
        nTop = (h / 2) - (real_height / 2);
        gameWrapper.style.top = (nTop) + "px";
        gameWrapper.style.left = "0px";
    }
    canvas.setAttribute("style", "-webkit-transform:scale(" + scale + ")");
    window.scrollTo(0, 0);
}

function startIntro() {
    stage.addEventListener("gameStart", startGame);

    intro = new ui.Intro();
    intro.show();

    stage.update();

    if (directPlay) {
        startGame();
    }
}

function startGame() {
    if (!isGame) {
        console.log("> START GAME");
        intro.hide();

        destroyPrevious();

        world = new game.World(stage);
        world.addEventListener("gameOver", onGameOver);
        world.show();

        controller = new game.Controller(stage, world, hud);

        isGame = true;

        hud = new ui.HUD();
        hud.show();

        world.start();
    }
}

function destroyPrevious() {
    if (gameOver) {
        gameOver.destroy();
        gameOver = null;
    }
    if (world) {
        world.destroy();
        world = null;
    }
    if (hud) {
        hud.destroy();
        hud = null;
    }
}

function onGameOver() {
    world.removeEventListener("gameOver", onGameOver);
    if (world.getScore() > bestScore) {
        bestScore = world.getScore();
    }

    gameOver = new ui.GameOver();
    gameOver.restart_btn.addEventListener("click", startGame);
    gameOver.restart_bg.addEventListener("click", startGame);
    gameOver.show();

    hud.destroy();
    world.destroy();
    isGame = false;
}

function update() {
    if (isGame) {
        world.update();
        if (isUpdate) {
            if (debug) {
                hud.setFPS();
                var landscape = world.getLandscape();
                if (landscape) {
                    var closePlanet = landscape.planets.getClosePlanet();
                    if (closePlanet) {
                        var remainingDistance = Math.round(Math.abs(-landscape.y - closePlanet.y));
                        hud.setDistance(remainingDistance);
                    }
                }
            }
            hud.setScore(world.getScore());
        }
    } else if (gameOver) {
        gameOver.setBestScore(bestScore);
        gameOver.setCurrentScore(world.getScore());
    }
    stage.update();
}

function getBitmapTxt(txt, x, y, scale) {
    var txt = new createjs.BitmapText(txt, fontSheet);
    txt.letterSpacing = 6;
    txt.x = x;
    txt.y = y;
    txt.scaleX = txt.scaleY = scale != null ? scale : 1;
    return txt;
}
