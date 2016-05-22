(function () {

    window.ui = window.ui || {}

    function Intro() {
        this.initialize();
    }

    // const
    const LOGO_DELAY = 4;

    // vars
    var p = Intro.prototype = new createjs.Container();

    p.menu = new createjs.Container(); //intro contains logo and menu

    p.initialize = function () {
        console.log("> Scene introduction...");

        this.alpha = 0;

        this.initFirstScreen(this, assets);
        stage.addChild(this);

        this.addChild(this.menu);
        this.hideMenu();
    }

    p.initFirstScreen = function (intro, assets) {
        var game_by = getBitmapTxt("a game by", screen_width / 2, 200, 1);
        intro.addChild(game_by);
        game_by.regX = game_by.getBounds().width / 2;

        var logo_wdc = new createjs.Sprite(spriteSheet, 'logo');
        logo_wdc.setTransform(screen_width / 2, screen_height / 2, 1, 1);
        logo_wdc.regX = logo_wdc.getBounds().width / 2;
        logo_wdc.regY = logo_wdc.getBounds().height / 2;
        console.log(logo_wdc.x, logo_wdc.regX);
        intro.addChild(logo_wdc);
        //fade out
        TweenLite.to(logo_wdc, 0.5, {delay: LOGO_DELAY, scaleX: 0.5, scaleY: 0.5, alpha: 0, ease: Circ.easeOut});
        TweenLite.to(game_by, 0.5, {delay: LOGO_DELAY, alpha: 0, onComplete: this.dispatchGameStart});
        this.showMenu(LOGO_DELAY);
    }

    var pulseLogo = function (obj) {
        obj.scaleX = obj.scaleY = 1;
        TweenLite.to(obj, 0.52, {scaleX: 1.1, scaleY: 1.1, ease: Bounce.easeOut, onComplete: pulseLogo, onCompleteParams: [obj]});
    }

    p.dispatchGameStart = function () {
        stage.dispatchEvent("gameStart");
    }

    p.showMenu = function (delay) {
        TweenLite.to(this.menu, 1.5, {delay: delay, alpha: 1, ease: "Quad"});
    }

    p.hideMenu = function () {
        TweenLite.to(this.menu, 0, {alpha: 0, ease: "Quad"});
    }

    p.show = function () {
        TweenLite.to(this, 1.5, {alpha: 1, ease: "Quad"});
    }

    p.hide = function () {
        console.log("> Closing introduction...");
        TweenLite.to(this, 0.5, {alpha: 0, ease: "Quad"});
    }

    p.destroy = function () {
        while (this.menu.getNumChildren() > 0) {
            this.menu.removeChildAt(0);
        }
        this.menu = null;
        while (this.getNumChildren() > 0) {
            this.removeChildAt(0);
        }
        this.parent.removeChild(this);
    }

    window.ui.Intro = Intro;

}());