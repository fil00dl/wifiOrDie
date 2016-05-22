(function () {

    window.ui = window.ui || {}

    function HUD() {
        this.initialize();
    }

    // vars
    var p = HUD.prototype = new createjs.Container();
    p.stage;
    p.score = 0;
    p.fps = 0;
    p.container = new createjs.Container();
    p.menu = new createjs.Container();
    p.scoreText;
    p.titleText;
    p.fpsText;
    p.distanceStarsText;
    p.distanceDStarsText;
    p.difficultyText;
    p.speedText;
    p.distanceText;
    p.zoomText;

    p.initialize = function() {
        var ui = this.container;
        ui.alpha = 0;

        this.fpsText = new createjs.Text("", "20px Arial", "#FFFFFF");
        this.fpsText.x = screen_width - screen_width/4;
        this.fpsText.y = 10;

        this.distanceStarsText = new createjs.Text("", "20px Arial", "#FFFFFF");
        this.distanceStarsText.x = screen_width - screen_width/3;
        this.distanceStarsText.y = 70;

        this.distanceDStarsText = new createjs.Text("", "20px Arial", "#FFFFFF");
        this.distanceDStarsText.x = screen_width - screen_width/3;
        this.distanceDStarsText.y = 100;

        this.difficultyText = new createjs.Text("", "20px Arial", "#FFFFFF");
        this.difficultyText.x = screen_width - screen_width/3;
        this.difficultyText.y = 70;

        this.speedText = new createjs.Text("", "20px Arial", "#FFFFFF");
        this.speedText.x = 10;
        this.speedText.y = 50;

        this.distanceText = new createjs.Text("", "20px Arial", "#FFFFFF");
        this.distanceText.x = screen_width - screen_width/3;
        this.distanceText.y = 40;

        this.zoomText = new createjs.Text("", "20px Arial", "#FFFFFF");
        this.zoomText.x = 10;
        this.zoomText.y = 35;

        this.scoreText = getBitmapTxt("", 10, 50, 1);

        this.titleText = getBitmapTxt("Wifi  or  die", 10, 10, 0.7);

        ui.addChild(this.scoreText, this.titleText, this.fpsText, this.distanceStarsText,  this.distanceText, this.distanceDStarsText, this.difficultyText, this.speedText, this.zoomText);
        this.menu.addChild(ui);
        stage.addChild(this.menu);
    }

    p.show = function() {
        TweenLite.to(this.container, 0.5, {alpha: 1, ease: "Quad"});
    }

    p.hide = function() {
        TweenLite.to(this.container, 0.5, {alpha: 0, ease: "Quad"});
    }

    p.destroy = function() {
        TweenLite.killTweensOf(this.container);
        this.container.removeChild(this.scoreText, this.fpsText, this.distanceStarsText, this.distanceDStarsText, this.difficultyText, this.speedText, this.distanceText, this.zoomText)
        this.menu.removeChild(this.container);
        stage.removeChild(this.menu);
    }

    p.setFPS = function() {
        this.fpsText.text = "FPS : "+Math.round(createjs.Ticker.getMeasuredFPS());
    }

    p.setDistanceStars = function(value) {
        this.distanceStarsText.text = "planet X : "+ value;
    }

    p.setDistanceDStars = function(value) {
        this.distanceDStarsText.text = "dstars "+ value;
    }

    p.setDifficulty = function(value) {
        this.difficultyText.text = "difficulty " + value;
    }

    p.setSpeed = function(speed) {
        this.speedText.text = "SPEED : " + speed;
    }

    p.setDistance = function(value) {
        this.distanceText.text = "distance : " + value;
    }

    p.setZoom = function(value) {
        this.zoomText.text = "ZOOM (+/-) : " + value;
    }

    p.setScore = function(value) {
        this.scoreText.text = "Score  "+value;
    }

    window.ui.HUD = HUD;

}());