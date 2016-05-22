(function () {

    window.game = window.game || {}

    function Checkpoint() {
        this.initialize()
    };

    var p = Checkpoint.prototype = new createjs.Container()

    const DISTANCE_BEFORE_APPEAR = 1000;
    const DISTANCE_BY_CHECKPOINT = 4000;
    const NB_MOTIFS_CHECKPOINT = 10;

    p.deltaCollision = 150;

    p.milestones;
    p.currentY;
    p.isPassed;

    var spriteFrame = null;

    p.initialize = function(){
        this.milestones =  new Array();
        this.isPassed = true;
        this.currentY = 0;
        this.alpha = 0.5;
        spriteFrame = new createjs.Sprite(spriteSheet, "blue_planet");
    }

    p.add = function(){
        var y = this.milestones.length * DISTANCE_BY_CHECKPOINT + DISTANCE_BEFORE_APPEAR;
        this.currentY = y;
        this.y = y;
        this.isPassed = false;
        var ckContainer = new createjs.Container();
        this.addChild(ckContainer);
        var ckPlanet;
        var deltaX = screen_width/NB_MOTIFS_CHECKPOINT;
       for(var i=0; i<NB_MOTIFS_CHECKPOINT; i++){
           ckPlanet = spriteFrame.clone();
           ckPlanet.x = i * deltaX;;
           ckPlanet.scaleX = ckPlanet.scaleY = 0.5;
               ckContainer.addChild(ckPlanet);
        }
        this.milestones.push(y);
    }

    p.destroy = function(){
        while(this.getNumChildren()>0){
                this.removeChildAt(0);
        }
        this.parent.removeChild(this);
    }

    p.getMiles = function(){
        return this.milestones.length;
    }

    p.getDistance = function(){
        var distance = this.getMiles() * DISTANCE_BY_CHECKPOINT;
        return distance;
    }

    window.game.Checkpoint = Checkpoint;
}());