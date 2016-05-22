(function () {

    window.game = window.game || {}

    function Character(x, y) {
        this.initialize(x, y);
    }

    var p = Character.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    //GAMEPLAY const
    const LOOK_AT_DELAY = 0.5;
    const MOVE_DELAY = 0.5;
    const SCORE_DELAY = 0.5;      
    //with mouse
    const WIFI_LOST = 0.22;
    const WIFI_WIN = 6;
    //without mouse (target automatically)
    const WIFI_LOST_ = 0.20;
    const WIFI_WIN_ = 5;

    const LOW_GAUGE = 30;

    p.x = 0;
    p.y = 0;
    p.width = 0;
    p.height = 0;

    var satContainer = null;
    var satellite = null;
    var wifi = null;
    var instructions;

    var isTurning = false;

    var fxContainer;
    var groupText;
    var pointsText;
    //gauge
    var group_lines;
    var line_back;
    var line_front;
    var line_redFx;
    var gaugeValue;

    var gaugeIsLow = false;

    p.initialize = function(x , y) {
        this.Container_initialize(x , y);
        satContainer = new createjs.Container();
        groupText = new createjs.Container();

        isTurning = false;

        satellite = new createjs.Sprite(spriteSheet,"satellite");
        this.x = Math.round(x);
        this.y = Math.round(y);
        //set position
        this.width = satellite.getBounds().width;
        this.height = satellite.getBounds().height;
        satellite.regX = Math.round(this.width/2);
        satellite.regY = Math.round(this.height/2);

        this.changeSignalWifi(0);

        this.scaleX = this.scaleY = 0.8;

       // this.snapToPixel = true;
        satContainer.addChild(satellite);
        satContainer.addChild(wifi);
        this.addChild(satContainer);

        gaugeValue = 100;
        this.initGauge();
        this.addChild(groupText);

        wifi.alpha = 0;
      }

    p.changeSignalWifi = function(reception_quality){
        var currentFrame = 0;
        if(wifi){
            currentFrame = wifi.currentFrame;
            satContainer.removeChild(wifi);
        }
        switch(reception_quality){
            case 0:
                wifi = new createjs.Sprite(wifi0Sheet,"wifi");
                break;
            case 1:
                wifi = new createjs.Sprite(wifi1Sheet,"wifi");
                break;
            case 2:
                wifi = new createjs.Sprite(wifi2Sheet,"wifi");
                break;
            case 3:
                wifi = new createjs.Sprite(wifi3Sheet,"wifi");
                break;
            case 4:
                wifi = new createjs.Sprite(wifi4Sheet,"wifi");
                break;
        }
        wifi.rotation = 90;
        wifi.regX = Math.round(wifi.getBounds().width/2);
        wifi.regY = Math.round(wifi.getBounds().height/2);
        wifi.scaleX = wifi.scaleY = 0.8;
        wifi.y = 80;
        satContainer.addChild(wifi);
        wifi.gotoAndPlay(currentFrame);
    }


    p.removeInstructions = function(){
        //this.removeChild(instructions);
    }

    p.show = function() {
        TweenLite.to(this, 1, {alpha: 1, ease: "Quad"});
        this.setTutorial();
    }

    p.setTutorial = function(){
        if(isTutorial){
            instructions = getBitmapTxt("left                OR             right", satellite.x, satellite.y, 0.8);
            instructions.regX = instructions.getBounds().width/2;
            instructions.regY = instructions.getBounds().height/2;
            instructions.y = -5;
            groupText.addChild(instructions);
        }
        TweenLite.to(instructions, 1, {delay:3, alpha:0, onComplete:this.removeInstructions});
    }

    p.initGauge = function(){
        const DELTA_X = -1;
        const DELTA_Y = 5;
        var gaugeWidth = 10;
        var gaugeHeight = 60;
        group_lines = new createjs.Container();

        line_back = new createjs.Shape(
            new createjs.Graphics().beginFill("#666666").drawRect(0, 0, gaugeWidth, gaugeHeight)
        );
        line_back.regX = gaugeWidth/2;
        line_back.regY = gaugeHeight/2;

        var frontGaugeHeight = gaugeHeight;
        line_front = new createjs.Shape(
            new createjs.Graphics().beginFill("#33cc66").drawRect(0, 0, gaugeWidth, frontGaugeHeight)
        );
        line_redFx = new createjs.Shape(
            new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, gaugeWidth, gaugeHeight)
        );
        line_front.regX = line_redFx.regX = gaugeWidth/2;
        line_front.regY = line_redFx.regY = gaugeHeight/2;
        line_back.x = line_front.x = line_redFx.x = DELTA_X;
        line_back.y = line_front.y = line_redFx.y = DELTA_Y;

        group_lines.addChild(line_back, line_redFx, line_front);
        group_lines.x = satellite.x;

        line_back.alpha = 1;
        line_front.alpha = 0.8;
        line_redFx.alpha = 0;

        satContainer.addChild(group_lines);
    }

    var pulseRedLine = function(){
        line_redFx.alpha = 0;
        var new_alpha = (4 - Math.round(gaugeValue/10)) *0.25;
        if(gaugeValue < LOW_GAUGE){
            TweenLite.to(line_redFx, 0.5, {alpha : new_alpha, onComplete: pulseRedLine});
        }
    }

    p.hide = function() {
        TweenLite.to(this, 1, {alpha: 0, ease: "Quad"})
    }

    p.destroy = function(){
        this.removeAllListeners();
        //destroy gauge
        while(group_lines.getNumChildren() > 0){
            group_lines.removeChildAt(0);
        }
        while(groupText.getNumChildren() > 0){
            groupText.removeChildAt(0);
        }
        while(satContainer.getNumChildren() > 0){
            satContainer.removeChildAt(0);
        }
        this.removeChild(group_lines);
        this.removeChild(groupText);
        this.removeChild(satContainer);
        this.parent.removeChild(this);
    }

    p.removeAllListeners = function(){
        TweenLite.killTweensOf(pointsText);
        TweenLite.killTweensOf(wifi);
        TweenLite.killTweensOf(satContainer);
        TweenLite.killTweensOf(satellite);
        TweenLite.killTweensOf(instructions);
        TweenLite.killTweensOf(line_redFx);
        TweenLite.killTweensOf(this);
    }

    p.updateRotation = function(planet_x, planet_y){
       if(isTurning == false){
            var dy = planet_y - this.y;
            var dx = planet_x - this.x;
            var angle = (180 * (Math.atan2(dy,dx))/ Math.PI) - 90;
           satContainer.rotation = angle;
        }
    }

    p.update = function (){
        if(gaugeValue > 0){
            this.decrementGauge();
            this.checkIfLowGauge();
        }
    }

    p.decrementGauge = function(){
        var nextGaugeValue = gaugeValue - WIFI_LOST;
        if(!mouseAllowed){//set another value
            nextGaugeValue = gaugeValue - WIFI_LOST_;
        }
        this.setGaugeValue(nextGaugeValue);
    }

    p.checkIfLowGauge = function(){
        if(gaugeValue < LOW_GAUGE){
            if(!gaugeIsLow){
               pulseRedLine();
            }
            gaugeIsLow = true;
        }else{
            if(gaugeIsLow){
                line_redFx.alpha = 0;
                TweenLite.killTweensOf(line_redFx);
            }
            gaugeIsLow = false;
        }
    }

    p.setGaugeValue = function(value){
        if(value != gaugeValue){
            var new_scale = Math.round((value/10000)*10000)/100;
            gaugeValue = value;
            line_front.scaleY = new_scale;
        }
    }

    p.getGaugeValue = function(){
        return gaugeValue;
    }

    p.lookAt = function(_x, _y){
        var dy = _y - this.y;
        var dx = _x - this.x;
        var angle = (180 * (Math.atan2(dy,dx))/ Math.PI) - 90;
        isTurning = true;
        TweenLite.to(wifi, LOOK_AT_DELAY, {alpha:1});
        TweenLite.to(satContainer, LOOK_AT_DELAY, {rotation:angle, ease:Back.easeOut, onComplete:this.turnTowardsComplete});
    }

    p.lookAtBottom = function(){
        TweenLite.to(wifi, LOOK_AT_DELAY, {alpha:0});
        TweenLite.to(satContainer, LOOK_AT_DELAY, {rotation:0, ease:Back.easeOut});
    }

    p.turnTowardsComplete = function(){
        isTurning = false;
    }

    p.moveToHorizontal = function(value){
        const BORDER = 50;
        var nextValue = this.x + value;
        if(nextValue > BORDER && nextValue < (screen_width*2 - BORDER)){
            TweenLite.to(this, MOVE_DELAY, {x:value, ease: Back.easeOut});
        }
    }

    p.getSatellite = function(){
        return satellite;
    }

    p.disappear= function(){
       TweenLite.to(this, 1 , {alpha:0, ease:"Quad"});//TODO better fx
    }

    p.receiveWifi = function(){
       if(gaugeValue > 0){
            addPoint(this, SCORE_DELAY);
           var newValue = gaugeValue + WIFI_WIN;
           if(!mouseAllowed){
               newValue = gaugeValue + WIFI_WIN_;
           }
            if(newValue <= 100){
                this.setGaugeValue(newValue);
            }
        }
    }

    var addPoint = function(obj, duration){
        fxContainer = new createjs.Container();
        groupText.addChild(fxContainer);
        //add text effect
        pointsText = getBitmapTxt("+1", satellite.x, satellite.y, 1);
        TweenLite.to(pointsText, duration/4, {scaleX:1, scaleY:1, ease: Bounce.easeIn});
        TweenLite.to(pointsText, duration/4, {delay:duration/4, scaleX:.6, scaleY:.6, ease: Bounce.easeOut});
        TweenLite.to(pointsText, duration/2, {alpha:0, delay:duration/2, x:-100, y:-100, onComplete:pointComplete, onCompleteParams:[fxContainer]});
        pointsText.regX = satellite.regX;
        pointsText.regY = satellite.regY;
        fxContainer.addChild(pointsText);
        createjs.Sound.play(assets.ADD_GAUGE);
    }

    var pointComplete = function(){
        world.updateScore();
    }

    p.removeContainer= function(container){
        while(container.getNumChildren() > 0){
            container.removeChildAt(0);
        }
        this.removeChild(container);
    }

    window.game.Character = Character;

}());