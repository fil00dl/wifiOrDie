(function () {

    window.ui = window.ui || {}

    function GameOver() {
        this.initialize();
    }

    // vars
    var p = GameOver.prototype = new createjs.Container();

    p.restart_btn = null;
    p.restart_bg = null;
    p.btn_over = null;
    p.btn_out = null;

    p.titleText;
    p.currentScore = null;
    p.bestScore = null;

    p.menu = new createjs.Container();

    p.initialize = function() {
        this.alpha = 0;
        isTutorial = true;

        this.initScreen();
        this.initStartButton();
        this.addChild(this.menu);

        stage.addChild(this);
    }

    p.initScreen = function(){
        this.titleText = getBitmapTxt("/Wifi  or  die", 10, 10, 0.7);

        var gameOver = getBitmapTxt("GAME OVER", screen_width/2, 70, 3);
        gameOver.alpha = 0;
        gameOver.regX = gameOver.getBounds().width/2;

        this.currentScore = getBitmapTxt("", 20, 230, 1);
        this.bestScore = getBitmapTxt("BEST SCORE : ", 20, 300, 1);
        this.bestScore.alpha = this.currentScore.alpha = 0;

        this.addChild(this.titleText, gameOver, this.currentScore, this.bestScore);

        //fade out
        TweenLite.to(gameOver, 1 , {scaleX: 1.2, scaleY:1.2, alpha:1, ease:Bounce.easeOut});
        TweenLite.to(this.currentScore, 1 , {delay:1,  alpha:1, ease:Bounce.easeOut});
        TweenLite.to(this.bestScore, 1 , {delay:2,  alpha:1, ease:Bounce.easeOut});
    }

    p.initStartButton = function(){
        var coordX = screen_width -  screen_width/4;
        var coordY = screen_height -  screen_height/4;
        this.btn_over= new createjs.Sprite(spriteSheet,"blue_planet");
        this.restart_btn = getBitmapTxt("RETRY", screen_width/2, 70, 3);//this.btn_out.clone();
        this.restart_bg = this.btn_over.clone();
        this.restart_btn.setTransform(coordX, coordY, 0.8, 0.8);
        this.restart_bg.setTransform(coordX, coordY, 3, 3);
        this.restart_btn.regX= this.restart_btn.getBounds().width/2;
        this.restart_btn.regY= this.restart_btn.getBounds().height/2;
        this.restart_bg.regX= this.restart_bg.getBounds().width/2;
        this.restart_bg.regY= this.restart_bg.getBounds().height/2;
        this.restart_bg.addEventListener("mouseover", onRollOver);
        this.restart_btn.addEventListener("mouseover", changeCursor);
        this.restart_bg.addEventListener("mouseout", onRollOut);
        this.menu.addChild(this.restart_bg);
        this.menu.addChild(this.restart_btn);
    }

    var onRollOver = function(evt){
        changeCursor(evt);
        TweenLite.to(evt.currentTarget, 0.2, {alpha: 0.1});
    }

    var changeCursor = function(evt){
        evt.currentTarget.cursor = "pointer";
    }

    var onRollOut = function(evt){
        TweenLite.to(evt.currentTarget, 0.2, {alpha: 1});
    }

    p.show = function() {
        TweenLite.to(this, 1.5, {alpha: 1, ease: "Quad"});
    }

    p.hide = function() {
        TweenLite.to(this, 0.5, {alpha: 0, ease: "Quad"});
    }

    p.destroy = function() {
        while(this.menu.getNumChildren() > 0){
            this.menu.removeChildAt(0);
        }
        this.menu = null;
        while(this.getNumChildren() > 0){
            this.removeChildAt(0);
        }
        this.parent.removeChild(this);
    }

    p.setBestScore = function(value) {
        this.bestScore.text = "BEST SCORE IS   "+value;
    }

    p.setCurrentScore = function(value) {
        this.currentScore.text = "YOUR SCORE IS   "+value;
    }

    window.ui.GameOver = GameOver;

}());