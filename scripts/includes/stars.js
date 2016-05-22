(function () {

    window.game = window.game || {}

    function Stars() {
        this.initialize();
    }

    var p = Stars.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    var nb_rows = 10;
    var nb_columns = 10;

    p.initialize = function () {
        this.Container_initialize();
    }

    p.drawStarsRow = function (origin_y, distant) {
        var star;
        var circle;
        var group_row = new createjs.Container();
        for (var i = 0; i < nb_rows; i++) {
            for (var j = 0; j < nb_columns; j++) {
                var delta_x = Math.random() * 50 - 25;
                var delta_y = Math.random() * 50 - 25;
                var rd = Math.floor(Math.random() * 5);
                var _x = j * (screen_width / 10);
                var _y = i * (screen_height / 10) + origin_y;
                var new_x = Math.round(_x + delta_x);
                var new_y = Math.round(_y + delta_y);
                if (rd == 0 && distant) {//tiny stars
                    circle = this.drawCircle(group_row, new_x, new_y);
                    group_row.addChild(circle);
                } else if (rd == 1) {//medium stars
                    var rdc = Math.floor(Math.random() * 3);
                    switch (rdc) {
                        case 0:
                            star = new createjs.Sprite(spriteSheet, "yellow_star");
                            break;
                        case 1:
                            star = new createjs.Sprite(spriteSheet, "blue_star");
                            break;
                        case 2:
                            star = new createjs.Sprite(spriteSheet, "star");
                            break;
                    }
                    group_row.addChild(star);
                    star.x = new_x;
                    star.y = new_y;
                    var new_scale = Math.round((0.3 + Math.random() * 0.3) * 100) / 100;
                    star.scaleX = star.scaleY = new_scale;
                    star.rotation = Math.random() * 360;
                    star.alpha = Math.round(((Math.random() * 5) * 0.1 + 0.3) * 100) / 100;
                }
            }
            //remove previous stars
            while (this.getNumChildren() > 2) {
                this.removeChildAt(0);
            }
        }
        this.addChild(group_row);
    }

    p.drawCircle = function (group, _x, _y) {
        var circle = new createjs.Shape();
        var new_size = Math.round((Math.random() * 2) * 100) / 100;
        circle.graphics.beginFill("white").drawCircle(_x, _y, new_size);
        return circle;
    }

    p.destroy = function () {
        for (var i = 0; i < nb_rows; i++) {
            for (var j = 0; j < nb_columns; j++) {
                this.removeChildAt(0);
            }
        }
        this.parent.removeChild(this);
    };

    p.show = function () {
        TweenLite.to(this, 1, {alpha: 0.1, ease: "Quad"})
    }

    window.game.Stars = Stars;

}());