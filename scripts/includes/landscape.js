(function () {

    window.game = window.game || {}

    function Landscape() {
        this.initialize();
    }

    var p = Landscape.prototype = new createjs.Container();

    const DELTA_Y_APPEAR = 1000;//delta y of obstacle appear

    p.Container_initialize = p.initialize;

    p.stars = null;
    p.distantStars = null;
    p.obstacles = null;
    p.planets = null;
    p.checkpoint = null;

    p.distance = 0;
    p.flagDistance = 0;

    p.flagStarsDistance = 0;

    p.countPassed = 0;
    p.numColor = 0;

    p.height = 0;
    p.width = 0;

    var group_lines = null;
    var group_line_l, group_line_c, group_line_r = null;

    //debug vars
    var displayStars = false;
    var displayDistantStars = true;
    var displayPlanets = true;
    var displayObstacles = true;
    var displayLines = false;
    var displayCheckpoint = false;

    p.initialize = function () {
        this.Container_initialize();
        this.height = screen_height;
        this.width = screen_width;
        this.alpha = 0;

        this.distance = 0;
        this.flagDistance = 0;

        this.initStars();
        this.initObstacles();
        this.initLines();
        this.initCheckpoint();
        this.initPlanets();

        console.log("LANDSCAPE contains " + this.getNumChildren());
    }

    p.initStars = function () {
        if (displayStars) {
            //create stars background
            this.stars = new game.Stars();
            this.addChild(this.stars);
            this.stars.drawStarsRow(this.distance, false);
        }
        if (displayDistantStars) {
            //create distant stars background
            this.distantStars = new game.Stars();
            this.addChild(this.distantStars);
            this.distantStars.drawStarsRow(0, true);
            this.addDistantBackground();
        }
    }

    p.initObstacles = function () {
        if (displayObstacles) {
            //create obstacles
            this.obstacles = new game.Obstacles();
            this.addChild(this.obstacles);
        }
    }

    p.initPlanets = function () {
        if (displayPlanets) {
            //create planets (obstacles)
            this.planets = new game.Planets();
            this.addChild(this.planets);
        }
    }

    p.initLines = function () {
        if (displayLines) {
            group_lines = new createjs.Container();
            group_line_l = new createjs.Container();
            group_line_c = new createjs.Container();
            group_line_r = new createjs.Container();
            //create vertical lines (debug)
            this.drawLines(this.distance);
            this.drawLines(this.distance + this.height)
        }
        this.addChild(group_lines);
    }

    p.initCheckpoint = function () {
        if (displayCheckpoint) {
            this.checkpoint = new game.Checkpoint();
            this.addChild(this.checkpoint);
        }
    }

    p.drawLines = function (distance_y) {
        //vertical lines
        var line_l = new createjs.Shape(
            new createjs.Graphics().beginFill("#ffffff").drawRect(0, distance_y, 10, this.height)
        );
        line_l.regX = 5;
        var line_c = new createjs.Shape(
            new createjs.Graphics().beginFill("#ffffff").drawRect(0, distance_y, 10, this.height)
        );
        line_c.regX = 5;
        var line_r = new createjs.Shape(
            new createjs.Graphics().beginFill("#ffffff").drawRect(0, distance_y, 10, this.height)
        );
        line_r.regX = 5;
        group_line_l.addChild(line_l);
        group_line_l.x = 0;
        group_line_c.addChild(line_c);
        group_line_c.x = this.width >> 1;
        group_line_r.addChild(line_r);
        group_line_r.x = this.width;
        group_line_l.regX = group_line_c.regX = group_line_r.regX = 0;//group_line_l.width/2;

        this.destroyLines(3);//remove undisplayed lines

        group_lines.addChild(group_line_l, group_line_c, group_line_r);
        group_lines.alpha = 0.1;
    };


    p.update = function () {
        this.distance = Math.round(-this.y);

        if (this.planets) {
            this.planets.update();
        }

        if (this.checkpoint) {
            //checkpoint update
            var isCheckpoint = false;
            if (this.distance >= this.checkpoint.getDistance()) {
                this.checkpoint.add();//draw next checkpoint
                isCheckpoint = true;
            }
            var checkpoint_y = this.checkpoint.currentY - this.checkpoint.deltaCollision;
            if (this.distance >= checkpoint_y && !this.checkpoint.isPassed) {
                this.checkpoint.isPassed = true;
                this.parent.dispatchEvent("checkpoint");
            }
        }

        if (this.distance >= this.flagDistance) {
            this.flagDistance += this.height;

            //obstacles
            if (this.obstacles && !isCheckpoint) {
                //draw the next two obstacles (two maximum visible by screen_height)
                var obstacle_y = this.distance + DELTA_Y_APPEAR;
                this.obstacles.drawRandom(obstacle_y);
                this.obstacles.drawRandom(obstacle_y + 1 / 2 * screen_height);
                var difficulty = world.getDifficulty();
                //more obstacles
                if (difficulty > 1) this.obstacles.drawRandom(Math.round(obstacle_y + 1 / 4 * screen_height));
                if (difficulty > 2) this.obstacles.drawRandom(Math.round(obstacle_y + 2 / 3 * screen_height));
                if (difficulty > 3) this.obstacles.drawRandom(Math.round(obstacle_y + 1 / 3 * screen_height));
                if (difficulty > 4) this.obstacles.drawRandom(Math.round(obstacle_y + 3 / 4 * screen_height));
                if (difficulty > 5) this.obstacles.drawRandom(Math.round(obstacle_y + 3 / 2 * screen_height));
                if (difficulty > 6) this.obstacles.drawRandom(Math.round(obstacle_y + 3 / 5 * screen_height));
                if (difficulty > 7) this.obstacles.drawRandom(Math.round(obstacle_y + 2 / 5 * screen_height));
                if (difficulty > 8) this.obstacles.drawRandom(Math.round(obstacle_y + 4 / 5 * screen_height));
                if (difficulty > 9) this.obstacles.drawRandom(Math.round(obstacle_y + 1 / 5 * screen_height));
                if (difficulty > 10) this.obstacles.drawRandom(Math.round(obstacle_y));
            }
            //planets
            if (this.planets && !isCheckpoint) {
                var planet_y = this.distance + DELTA_Y_APPEAR;
                this.planets.drawRandom(planet_y + screen_height / 3);
            }
            //misc
            var new_y = this.flagDistance + this.height / 2;
            if (group_lines) {
                this.drawLines(new_y);
            }
            //stars background
            if (this.stars) {
                this.stars.drawStarsRow(new_y, false);
            }
        }

        //distant stars parallax
        if (this.distantStars) {
            if (this.distantStars.y >= 1000) {
                this.distantStars.y = 0;
                this.addDistantBackground();
            }
            this.distantStars.y++;
        }
    }

    p.addDistantBackground = function () {
        for (var i = 1; i <= 2; i++) {
            this.distantStars.drawStarsRow(this.distance + this.height * i + 100, true);
        }
    }

    p.getLineFrom = function (direction) {
        switch (direction) {
            case "left" :
                return group_line_l;
            case "right" :
                return group_line_r;
            case "bottom" :
                return group_line_c;
        }
    }

    p.getLines = function () {
        return group_lines;
    }

    p.show = function () {
        TweenLite.to(this, 1, {alpha: 1, ease: "Quad"})
    }

    p.hide = function () {
        TweenLite.to(this, 1, {alpha: 0, ease: "Quad"})
    }

    p.toString = function () {
        return (this.constructor.name);
    }

    p.destroy = function () {
        TweenLite.killTweensOf(this);
        this.destroyStars();
        this.destroyPlanets();
        this.destroyObstacles();
        this.destroyLines(0);
        this.destroyCheckpoint();
        this.parent.removeChild(this);
    }
    p.destroyObstacles = function () {
        if (this.obstacles) {
            this.obstacles.destroy();
            this.obstacles = null;
        }
    }

    p.destroyPlanets = function () {
        if (this.planets) {
            this.planets.destroy();
            this.planets = null;
        }
    }

    p.destroyStars = function () {
        if (this.stars) {
            this.stars.destroy();
            this.stars = null;
        }
        if (this.distantStars) {
            this.distantStars.destroy();
            this.distantStars = null;
        }
    }

    p.destroyCheckpoint = function () {
        if (this.checkpoint) {
            this.checkpoint.destroy();
            this.checkpoint = null;
        }
    }
    p.destroyLines = function (id) {
        if(group_line_l){
            while (group_line_l.getNumChildren() > id) {
                group_line_l.removeChildAt(0);
            }
            while (group_line_c.getNumChildren() > id) {
                group_line_c.removeChildAt(0);
            }
            while (group_line_r.getNumChildren() > id) {
                group_line_r.removeChildAt(0);
            }
            group_lines.removeChild(group_line_l, group_line_c, group_line_r);
            if (id == 0) {//all lines is erased so the group too
                group_lines = null;
            }
        }
    }

    window.game.Landscape = Landscape;
}());
