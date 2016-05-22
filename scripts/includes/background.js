(function () {

    window.game = window.game || {}

    function Background() {
        this.initialize();
    };

    var p = Background.prototype = new createjs.Container();

    const NB_STARS_BG = 36;

    p.initialize = function() {
        this.initElements();
    }

    p.initElements = function(){
        var star;
        for(var i=0; i< NB_STARS_BG ; i++){
            star = new createjs.Sprite(spriteSheet,"star");
            star.regX = star.getBounds().width/2;
            star.regY = star.getBounds().height/2;
            star.x = Math.floor(Math.random()*screen_width);
            star.y = Math.floor(Math.random()*screen_height);
            star.scaleX = star.scaleY = Math.random()*4 * 0.025;
           // star.alpha = Math.random()*5 * 0.1;
            this.addChild(star);

        }
    }

    p.update = function() {

    }

    p.destroy = function (){
        while(this.getNumChildren() > 0){
            this.removeChildAt(0);
        }
        this.parent.removeChild(this);
    }

    window.game.Background = Background;

}());