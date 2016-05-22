(function () {

    window.game = window.game || {}

    function Planets() {
        this.initialize()
    };

    const ALLOW_ROLLOVER = true;

    const DEFAULT_SCALE = 2;
    const START_TUTO_Y = 1000;//start of the tutorial (y coordinate)
    const END_TUTO_Y = 3000; //end of the tutorial (y coordinate)
    const NB_PLANETS_MAX = 3;//nb planets max displayed
    const BEST_DISTANCE = 150;//best distance near planet to receive Wifi
    const PERFECT_DISTANCE = 80;//perfect distance near planet to receive Wifi
    const LOW_DISTANCE = 450;//bad reception Wifi
    const PULSE_DELAY = 0.5;//pulse animation planet

    var p = Planets.prototype = new createjs.Container();

    var life_planet;
    var green_planet;
    var blue_planet;

    var wifi = null;

    var currentPlanet;

    var groupPlanets, groupText, groupMask;

    var idPlanet = 0;

    p.initialize = function () {
        groupPlanets = new createjs.Container();
        groupPlanets.type = "planets";
        groupText = new createjs.Container();
        groupMask = new createjs.Container();
        life_planet = new createjs.Sprite(spriteSheet, "white_planet");
        green_planet = new createjs.Sprite(spriteSheet, "green_planet");
        blue_planet = new createjs.Sprite(spriteSheet, "blue_earth");
        wifi = new createjs.Sprite(wifi4Sheet, "wifi");
        idPlanet = 0;
        currentPlanet = null;
        this.addChild(groupPlanets, groupMask, groupText);
    }

    p.drawRandom = function (position_y) {
        var x_random = Math.floor(Math.random() * screen_width);
        this.drawPlanet(x_random, position_y);
    }

    p.drawPlanet = function (position_x, position_y) {
        var planet = life_planet.clone();
        planet.regX = planet.getBounds().width / 2;
        planet.regY = planet.getBounds().height / 2;
        if (position_x < 50) {
            position_x += 50;
        } else if (position_x > 975) {
            position_x -= 50;
        }
        planet.x = position_x;
        planet.y = position_y;
        planet.id = idPlanet++;
        var addScale = Math.round((Math.random() * 5 * 0.1) * 10) / 10;
        planet.initialScale = DEFAULT_SCALE + addScale;
        planet.scaleX = planet.scaleY = planet.initialScale;
        if (mouseAllowed) {
            planet.addEventListener("click", onPlanetSelected);
            planet.addEventListener("mouseover", this.changeCursor);
            if (ALLOW_ROLLOVER) {
                planet.addEventListener("mouseover", onPlanetSelected);
            }
        }
        planet.sendWifi = false;
        groupPlanets.addChild(planet);

        var wifiPlanet = wifi.clone();
        wifiPlanet.regX = 0;
        wifiPlanet.regY = Math.round(planet.getBounds().height);
        wifiPlanet.x = planet.x;
        wifiPlanet.y = planet.y - 10;
        wifiPlanet.scaleX = wifiPlanet.scaleY = 0.8;
        wifiPlanet.type = "wifi";
        groupText.addChild(wifiPlanet);

        //the first planets indicate user action
        if (isTutorial && position_y > START_TUTO_Y && position_y < END_TUTO_Y) {
            var textValue = "CLICK ME";
            if (ALLOW_ROLLOVER) {
                textValue = "MOUSE OVER";
            }
            if (!mouseAllowed) {
                textValue = "APPROACH";
            }
            var clickMe = getBitmapTxt(textValue, planet.x, planet.y, 0.8);
            clickMe.regX = clickMe.getBounds().width / 2;
            clickMe.regY = clickMe.getBounds().height / 2;
            groupText.addChild(clickMe);
        }

        this.drawMask(planet);
        //remove previous
        if (position_y > (END_TUTO_Y + screen_height)) {
            while (groupText.getNumChildren() > NB_PLANETS_MAX) {
                groupText.removeChildAt(0);
            }
            while (groupPlanets.getNumChildren() > NB_PLANETS_MAX) {
                groupPlanets.removeChildAt(0);
            }
            while (groupMask.getNumChildren() > NB_PLANETS_MAX) {
                groupMask.removeChildAt(0);
            }
        }
    }

    p.getGroup = function () {
        return groupPlanets;
    }

    p.getClosePlanet = function () {
        var nbPlanets = groupPlanets.getNumChildren();
        console.log("nbPlanets " + nbPlanets);
        var closePlanet = null;
        if (nbPlanets > 0) {
            closePlanet = groupPlanets.getChildAt(nbPlanets - 1);
        }
        return closePlanet;
    }

    p.drawMask = function (planet) {
        var greenPlanet = green_planet.clone();
        greenPlanet.regX = greenPlanet.getBounds().width / 2;
        greenPlanet.regY = greenPlanet.getBounds().height / 2;
        greenPlanet.x = planet.x;
        greenPlanet.y = planet.y;
        greenPlanet.scaleX = greenPlanet.scaleY = DEFAULT_SCALE;
        groupMask.addChild(greenPlanet);

        planet.circle_mask = new createjs.Shape(new createjs.Graphics().drawCircle(0, 0, planet.getBounds().width));
        planet.circle_mask.x = planet.x;
        planet.circle_mask.y = planet.y;
        greenPlanet.mask = planet.circle_mask;

        planet.circle_mask.scaleX = planet.circle_mask.scaleY = 0;
    }

    p.destroy = function () {
        TweenLite.killTweensOf(currentPlanet);
        //destroy all elements
        while (groupText.getNumChildren() > 0) {
            groupText.removeChildAt(0);
        }
        while (groupPlanets.getNumChildren() > 0) {
            groupPlanets.removeChildAt(0);
        }
        while (groupMask.getNumChildren() > 0) {
            groupMask.removeChildAt(0);
        }
        this.removeChild(groupPlanets, groupMask, groupText);
        while (this.getNumChildren() > 0) {
            this.removeChildAt(0);
        }
        this.parent.removeChild(this);
    }

    var onPlanetSelected = function (evt) {
        if (currentPlanet != evt.currentTarget) {
            createjs.Sound.play(assets.WIFI_SOUND);
            currentPlanet = evt.currentTarget;
            world.selectPlanet(currentPlanet);
            currentPlanet.sendWifi = true;
            initTween(currentPlanet);
        }
    }

    p.selectPlanet = function (planet) {
        world.selectPlanet(planet);
        planet.sendWifi = true;
        initTween(planet);
    }


    p.update = function () {
        var nb_obj = groupText.getNumChildren();
        for (var i = 0; i < nb_obj; i++) {
            var obj = groupText.getChildAt(i);
            if (obj.type != undefined) {//so is wifi
                var planetY = Math.round(-world.getLandscape().y - obj.y);
                var absPlanetY = Math.abs(planetY);
                var dy = absPlanetY - world.getCharacter().y;
                var dx = obj.x - world.getCharacter().x;
                var angle = (180 * (Math.atan2(dy, dx)) / Math.PI) - 90;
                obj.rotation = Math.round(angle - 90);
            }
        }
    }

    var initTween = function (planet) {
        var new_scale = planet.initialScale + 0.2;
        var current_delay = PULSE_DELAY;
        if (world.distancePlanetX > 0 && world.distancePlanetX < BEST_DISTANCE && world.distancePlanetY < BEST_DISTANCE) {
        //very good WIFI reception
            if (world.distancePlanetX < PERFECT_DISTANCE && world.distancePlanetY < PERFECT_DISTANCE) {
                current_delay = PULSE_DELAY / 3;
            } else {
                current_delay = PULSE_DELAY / 2;
            }
            world.greenVisualFx();
            world.getCharacter().changeSignalWifi(4);
        } else if (world.distancePlanetX < BEST_DISTANCE * 2 && world.distancePlanetY < BEST_DISTANCE * 2) {
        //good reception
            current_delay = PULSE_DELAY;
            world.getCharacter().changeSignalWifi(3);
        } else if (world.distancePlanetX > LOW_DISTANCE * 1.5 || world.distancePlanetY > LOW_DISTANCE * 1.5) {
        //no reception
            current_delay = PULSE_DELAY * 3;
            world.getCharacter().changeSignalWifi(0);
        } else if (world.distancePlanetX > LOW_DISTANCE || world.distancePlanetY > LOW_DISTANCE) {
        //low reception
            current_delay = PULSE_DELAY * 2;
            world.getCharacter().changeSignalWifi(1);
        } else {
        //medium reception
            world.getCharacter().changeSignalWifi(2);
        }

        var scaleMask = 0;
        if (current_delay <= 1) {
            var nearDistance = current_delay - PULSE_DELAY / 2;
            scaleMask = Math.round((1 - nearDistance) * 100) / 100;
        }

        TweenLite.to(planet.circle_mask, 1, {scaleX: scaleMask, scaleY: scaleMask});
        TweenLite.to(planet, current_delay, {scaleX: new_scale, scaleY: new_scale, alpha: 0.9, ease: Bounce.easeIn, onComplete: tweenComplete, onCompleteParams: [planet, current_delay]});

    }

    var tweenComplete = function (obj, delay) {
        if (obj) {
            obj.scaleX = obj.scaleY = obj.initialScale;
            if (obj.sendWifi) {
                initTween(obj);
            }
            if (world && world.getCharacter()) {
                world.getCharacter().receiveWifi();
            }
        }
    }

    p.changeCursor = function (evt) {
        evt.currentTarget.cursor = "pointer";
    }

    window.game.Planets = Planets;

}());