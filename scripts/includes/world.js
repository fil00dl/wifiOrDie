(function () {
    // main developer : Philippe (fil00dl) De Luca - fil00dl@gmail.com
    window.game = window.game || {}

    function World(stage) {
        this.initialize(stage);
    }

    var p = World.prototype = new createjs.Container();

    const SPEED_DEFAULT = 200;//speed of landscape
    const SPEED_ADDITIONAL = 5;//each threshold passed
    const FRAME = 1;
    const ZOOM_FACTOR = 0.1;
    const ZOOM_THRESHOLD = 0.05;
    const ZOOM_DEFAULT = 1;
    const ZOOM_MINI = 0.7;
    const SPEED_MODULO = 20;
    const DIFF_MODULO = 25;
    const ORIGIN_Y_CHARACTER = 150;
    const WIFI_LOST_COLLISION = 50;
    const GOD_MODE = false;

    //game layers vars
    var landscape = null;
    var background = null;
    var frontRedLayer = null;
    var frontGreenLayer = null;
    var character = null;
    var selectedPlanet = null;

    //gameplay vars
    var pulseZoom = 1;
    var difficulty = 1;
    var score;
    var speed;

    //flag vars
    var isPlay = false;
    var isCheckCollision;

    //display vars
    var sWidth;
    var sHeight;
    var centerX;
    var centerY;
    p.distancePlanetX = 0;
    p.distancePlanetY = 0;
    p.stage = null;
    p.x = 0;
    p.y = 0;

    //debug var
    var displayLandscape = true;//obstacles, stars and planets
    var displayBackground = true;//tiny static stars
    var displayFrontLayer = true;//green/red fx

    p.initialize = function (stage) {
        this.stage = stage;
        this.alpha = 0;
        sWidth = this.stage.canvas.width;
        sHeight = this.stage.canvas.height;
        centerX = sWidth / 2;
        centerY = sHeight / 2;

        score = 0;
        difficulty = 1;

        speed = SPEED_DEFAULT;
        selectedPlanet = null;
        this.distancePlanetX = 0;
        this.distancePlanetY = 0;

        isPlay = false;
        isCheckCollision = true;

        this.initBackground();
        this.initLandscape();

        //init character
        character = new game.Character(centerX, ORIGIN_Y_CHARACTER);
        this.addChild(character);

        //init front layer (allowing: green/red feedback, fog... over the world)
        this.initFrontLayer();

        this.stage.addChild(this);

        console.log("WORLD contains " + this.getNumChildren());

        //center world reference
        this.x = this.regX = centerX;
        this.y = this.regY = character.y;

        //zoom by default
        this.scaleX = this.scaleY = ZOOM_DEFAULT;

        character.show();
    }

    p.start = function () {
        //temporize 1sec before launch game
        setTimeout(this.play, 1000);
    }

    p.initLandscape = function () {
        if (displayLandscape) {
            //init landscape
            landscape = new game.Landscape();
            this.addChild(landscape);
            landscape.show();
        }
    }

    p.selectPlanet = function (planet) {
        if (landscape && planet) {
            var planet_y = Math.round(Math.abs(-landscape.y - planet.y));
            this.getCharacter().lookAt(planet.x, planet_y);
            selectedPlanet = planet;
        }
    }

    p.initBackground = function () {
        if (displayBackground) {
            //create background
            background = new game.Background();
            this.addChild(background);
        }
    }

    p.initFrontLayer = function () {
        if (displayFrontLayer) {
            frontRedLayer = new createjs.Shape();
            //frontRedLayer.overColor = "#3281FF";
            frontRedLayer.outColor = "#FF0000";
            frontRedLayer.graphics.beginFill(frontRedLayer.outColor).drawRect(0, 0, sWidth, sHeight).endFill();
            frontRedLayer.x = 0;
            frontRedLayer.y = 0;
            frontRedLayer.alpha = 0;
            this.stage.addChild(frontRedLayer);

            frontGreenLayer = new createjs.Shape();
            frontGreenLayer.outColor = "green";
            frontGreenLayer.graphics.beginFill(frontGreenLayer.outColor).drawRect(0, 0, sWidth, sHeight).endFill();
            frontGreenLayer.x = 0;
            frontGreenLayer.y = 0;
            frontGreenLayer.alpha = 0;
            this.stage.addChild(frontGreenLayer)
        }
    }

    p.update = function () {
        if (isPlay) {
            if (landscape) {
                landscape.update();
                if (character && isCheckCollision) {
                    if (landscape.planets) {
                        this.checkCollisionIn(character.getSatellite(), landscape.planets.getGroup());
                    }
                    if (landscape.obstacles) {
                        this.checkCollisionIn(character.getSatellite(), landscape.obstacles.getGroup());
                    }
                }
            }
            if (background) {
                background.update();
            }
            if (character) {
                character.update();
                if (character.getGaugeValue() <= 0 && !GOD_MODE) {
                    createjs.Sound.play(assets.NO_SIGNAL);
                    this.initGameOver();
                }

                if (selectedPlanet) {
                    var planetY = Math.round(-landscape.y - selectedPlanet.y);
                    var absPlanetY = Math.abs(planetY);
                    character.updateRotation(selectedPlanet.x, absPlanetY);
                    if (planetY > 0) {
                        selectedPlanet.sendWifi = false;
                        selectedPlanet = null;
                        character.lookAtBottom();
                        this.distancePlanetX = this.distancePlanetY = 0;
                    } else {
                        //distance between satellite and planet
                        var dx = Math.round(Math.abs(selectedPlanet.x - character.x));
                        var dy = Math.round(Math.abs(absPlanetY - character.y));
                        this.distancePlanetX = dx;
                        this.distancePlanetY = dy;
                    }
                } else {
                    if (!mouseAllowed) {
                        var closePlanet = landscape.planets.getClosePlanet();
                        console.log("closePlanet " + closePlanet);
                        if (closePlanet) {
                            landscape.planets.selectPlanet(closePlanet);
                        }
                    }
                }
            }
        }
    }

    p.show = function () {
        TweenLite.to(this, 1, {alpha: 1, ease: "Quad"});
    }

    p.hide = function () {
        TweenLite.to(this, 1, {alpha: 0, ease: "Quad"})
    }

    p.setZoom = function (param) {
        if (param == "+") {
            this.scaleX = this.scaleY = Math.round((this.scaleX + ZOOM_FACTOR) * 10) / 10;
        } else if (param == "-" && this.scaleX > ZOOM_MINI) {
            this.scaleX = this.scaleY = Math.round((this.scaleX - ZOOM_FACTOR) * 10) / 10;
        }
    }

    p.setPulseZoom = function (param) {
        if (param == "+") {
            pulseZoom = Math.round((this.scaleX + ZOOM_THRESHOLD) * 100) / 100;
        } else if (param == "-") {
            pulseZoom = Math.round((this.scaleX - ZOOM_THRESHOLD) * 100) / 100;
        }
        TweenLite.to(this, 1, {scaleX: pulseZoom, scaleY: pulseZoom, ease: Elastic.easeOut, onComplete: this.setDefaultZoom});
    }

    p.setDefaultZoom = function () {
        this.scaleX = this.scaleY = ZOOM_DEFAULT;
    }

    p.getLandscape = function () {
        return landscape;
    }

    p.getCharacter = function () {
        return character;
    }

    p.getZoom = function () {
        return this.scaleX;
    }

    var moveAutomatically = function () {
        var pos_X = character.direction * sWidth / 2;
        var pos_Y = Math.round(-speed - landscape.distance);
        TweenLite.to(landscape, FRAME, {x: pos_X, y: pos_Y, onComplete: onMoveComplete, ease: Linear.easeIn});
    }

    var onMoveComplete = function (e) {
        if (landscape) {
            moveAutomatically();
        }
    }

    p.play = function () {
        isPlay = true;
        console.log("> PLAY");
        if (landscape) {
            moveAutomatically();
        }
    }

    p.checkCollisionIn = function (perso, group) {
        var obstacle;
        var numChildren = group.getNumChildren();

        for (var i = 0; i < numChildren; i++) {
            obstacle = group.getChildAt(i);
            var collision = ndgmr.checkPixelCollision(perso, obstacle);
            if (collision) {
                isCheckCollision = false;
                if (!GOD_MODE) {
                    this.fail(group, i);
                }
                break;
            }
        }
    }

    p.greenVisualFx = function () {
        if (isPlay) {
            TweenLite.to(frontGreenLayer, 0.25, {alpha: 0.4, ease: Elastic.easeOut});
            TweenLite.to(frontGreenLayer, 0.25, {delay: 0.1, alpha: 0, ease: Elastic.easeOut});
        }
    }

    p.fail = function (group, i) {
        TweenLite.to(frontRedLayer, 0.5, {alpha: 0.9, ease: Elastic.easeOut});
        TweenLite.to(frontRedLayer, 1, {delay: 0.5, alpha: 0, ease: Elastic.easeOut});
        this.shake();
        var currentWifi = character.getGaugeValue();
        createjs.Sound.play(assets.EXPLOSION);
        if (currentWifi > WIFI_LOST_COLLISION && group.type != "planets") {
            character.setGaugeValue(currentWifi - WIFI_LOST_COLLISION);
            this.removeObstacle(group, i);
        } else {
            character.setGaugeValue(0);
            this.initGameOver();
            return;
        }
    }

    p.removeObstacle = function (group, i) {
        group.removeChildAt(i);
        isCheckCollision = true;
    }

    p.shake = function () {
        var origin_x = this.x;
        TweenLite.to(this, 0.1, {x: origin_x - 3, ease: Bounce.easeOut});
        TweenLite.to(this, 0.1, {delay: 0.1, x: origin_x + 3, ease: Bounce.easeOut});
        TweenLite.to(this, 0.1, {delay: 0.2, x: origin_x - 3, ease: Bounce.easeOut});
        TweenLite.to(this, 0.1, {delay: 0.3, x: origin_x + 3, ease: Bounce.easeOut});
        TweenLite.to(this, 0.1, {delay: 0.4, x: origin_x, ease: Bounce.easeOut});
    }

    p.initGameOver = function () {
        isPlay = false;
        speed = 5;
        moveAutomatically();
        character.disappear();
        TweenLite.to(this, 0.1, {delay: 1, onComplete: launchGameOver, onCompleteParams: [this]});
    }

    var launchGameOver = function (obj) {
        obj.dispatchEvent("gameOver");
    }

    p.updateScore = function () {
        //console.log("UPDATE SCORE " + score);
        score++;
        var moduloSpeed = score % SPEED_MODULO;
        var moduloDiff = score % DIFF_MODULO;
        if (moduloSpeed == 0) {
            speed += SPEED_ADDITIONAL;//accelerate
        }
        if (moduloDiff == 0) {
            difficulty++;
        }
    }

    p.getDifficulty = function () {
        return difficulty;
    }

    p.getSpeed = function () {
        return speed;
    }

    p.setSpeed = function (value) {
        speed = value;
    }

    p.getBackground = function () {
        return background;
    }

    p.destroyElements = function () {
        this.destroyLandscape();
        this.destroyBackground();
        this.destroyCharacter();
        this.destroyFrontLayers();
    }

    p.destroyLandscape = function () {
        if (landscape) {
            landscape.destroy();
            landscape = null;
        }
    }
    p.destroyBackground = function () {
        if (background) {
            background.destroy();
            background = null;
        }
    }
    p.destroyCharacter = function () {
        if (character) {
            character.destroy();
            character = null;
        }
    }

    p.destroyFrontLayers = function () {
        if (frontRedLayer) {
            this.stage.removeChild(frontRedLayer);
            frontRedLayer = null;
        }
        if (frontGreenLayer) {
            this.stage.removeChild(frontGreenLayer);
            frontGreenLayer = null;
        }
    }

    p.destroy = function () {
        console.log("DESTROY WORLD - score was " + score);
        TweenLite.killTweensOf(frontRedLayer);
        TweenLite.killTweensOf(frontGreenLayer);
        TweenLite.killTweensOf(landscape);
        TweenLite.killTweensOf(this);
        this.destroyElements();
        stage.removeChild(this);
    }

    p.getScore = function () {
        return score;
    }

    p.isCollision = function () {
        return isCheckCollision;
    }

    window.game.World = World;

}());
