(function () {

    window.game = window.game || {}

    function Obstacles() {
      this.initialize()
    };

    var p = Obstacles.prototype = new createjs.Container();

    const BORDER_X = 200;
    const START_TUTO_Y = 100;
    const END_TUTO_Y = 2500;
    const NB_OBSTACLES_MAX = 32;

    var yellow_planet;
    var blue_planet;
    var red_planet;
    var black_planet;
    var various_obstacles = new Array();
    var nb_various;

    var groupObstacles, groupText;

    p.initialize= function(){
        groupObstacles = new createjs.Container();
        groupObstacles.type = "obstacles";
        groupText = new createjs.Container();
        this.addChild(groupObstacles, groupText);

        yellow_planet = new createjs.Sprite(spriteSheet,"yellow_planet");
        blue_planet = new createjs.Sprite(spriteSheet,"blue_planet");
        red_planet = new createjs.Sprite(spriteSheet,"red_planet");
        black_planet = new createjs.Sprite(spriteSheet,"black_planet");

        various_obstacles.push(yellow_planet, black_planet, red_planet);
        nb_various = various_obstacles.length;
    }

    //draw an obstacle
    p.drawRandom = function(position_y){
        var shape_random = Math.floor(Math.random()*nb_various);
        var x_random =  Math.floor(Math.random()*screen_width);
        this.drawObstacle(x_random, position_y, shape_random);
    }

    p.drawObstacle = function(position_x, position_y, shape_id){
        var obstacle = various_obstacles[shape_id].clone();
            obstacle.regX = obstacle.getBounds().width/2;
            obstacle.regY = obstacle.getBounds().height/2;
            if(position_x < 50){
                position_x += 50;
            }else if(position_x > 975){
                position_x -= 50;
            }
            obstacle.x = position_x;
            obstacle.y = position_y;
            groupObstacles.addChild(obstacle);
        if(isTutorial && position_y > START_TUTO_Y){
            var avoid = getBitmapTxt("AVOID", obstacle.x, obstacle.y, 0.8);
            avoid.regX = avoid.getBounds().width/2;
            avoid.regY = avoid.getBounds().height/2;
            groupText.addChild(avoid);
        }
        if(position_y > (END_TUTO_Y + screen_height)){//remove previous
            while(groupText.getNumChildren() > 0){
                groupText.removeChildAt(0);
            }
            while(groupObstacles.getNumChildren() > NB_OBSTACLES_MAX){
                groupObstacles.removeChildAt(0);
            }
        }
    }

    p.getGroup = function(){
        return groupObstacles;
    }

    p.destroy = function(){
        //destroy all elements
        while(groupText.getNumChildren() > 0){
            groupText.removeChildAt(0);
        }
        while(groupObstacles.getNumChildren() > 0){
            groupObstacles.removeChildAt(0);
        }
        while(this.getNumChildren() > 0){
            this.removeChildAt(0);
        }
        this.parent.removeChild(this);
    }
    window.game.Obstacles = Obstacles;

}());