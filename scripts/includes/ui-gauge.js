(function () {

    window.game = window.game || {}

    function UI_Gauge() {
        this.initialize();
    };

    const TWEEN_DELAY = 0.5;
    const DELTA_Y = 100;

    var p = UI_Gauge.prototype = new createjs.Container();
    var line_front;
    var lifeValue = 100;

    p.initialize = function () {
        this.initLines();
    }

    p.initLines = function () {
        var gaugeWidth = 10;
        var gaugeHeight = screen_height;
        var group_lines = new createjs.Container();

        var line_back = new createjs.Shape(
            new createjs.Graphics().beginFill("#ffffff").drawRect(0, 0, gaugeWidth, gaugeHeight)
        );
        line_back.regX = gaugeWidth / 2;
        line_back.regY = gaugeHeight / 2;
        line_back.y = gaugeHeight / 2;

        var frontGaugeHeight = gaugeHeight / 2 + gaugeHeight / 8;
        line_front = new createjs.Shape(
            new createjs.Graphics().beginFill("#ffffff").drawRect(0, 0, gaugeWidth, frontGaugeHeight)
        );
        line_front.regX = gaugeWidth / 2;
        line_front.regY = gaugeHeight / 2;
        line_front.y = frontGaugeHeight - gaugeHeight / 16;

        group_lines.addChild(line_back, line_front);
        group_lines.x = screen_width >> 1;

        line_back.alpha = 0.1;
        line_front.alpha = 0.8;

        this.addChild(group_lines);
    }

    p.setValue = function (value) {
        if (value != lifeValue) {
            var new_scale = Math.round((value / 10000) * 10000) / 100;
            lifeValue = value;
            TweenLite.to(line_front, TWEEN_DELAY, {scaleY: new_scale, ease: Bounce.easeIn});
        }
    }

    p.destroy = function () {
        //destroy all elements
        while (this.getNumChildren() > 0) {
            this.removeChildAt(0);
        }
        this.parent.removeChild(this);
    }
    window.game.Gauge = UI_Gauge;

}());