(function () {

    window.game = window.game || {};

    var AssetManager = function () {
        this.initialize();
    }
    var p = AssetManager.prototype = new createjs.EventDispatcher();

    p.EventDispatcher_initialize = p.initialize;

    p.MENU_JSON = 'menu json';

    //sounds
    p.EXPLOSION = 'explosion';
    p.WIFI_SOUND = 'wifi sound';
    p.ADD_GAUGE = 'add gauge';
    p.NO_SIGNAL = 'no signal';
    p.SOUNDTRACK = 'soundtrack';

    //anims
    p.ANIM_WIFI = 'wifi anim';
    p.ANIM_WIFI_0 = 'wifi anim 0';
    p.ANIM_WIFI_1 = 'wifi anim 1';
    p.ANIM_WIFI_2 = 'wifi anim 2';
    p.ANIM_WIFI_3 = 'wifi anim 3';
    p.ANIM_WIFI_4 = 'wifi anim 4';

    //graphics
    p.GAME_SPRITES = 'game sprites';
    p.FONT_SPRITES = 'font sprites';

    //data
    p.GAME_SPRITES_DATA = 'game sprites data';
    p.FONT_SHEET_DATA = 'font sheet data';

    p.ANIM_WIFI_DATA = 'wifi anim data';
    p.ANIM_WIFI0_DATA = 'wifi0 anim data';
    p.ANIM_WIFI1_DATA = 'wifi1 anim data';
    p.ANIM_WIFI2_DATA = 'wifi2 anim data';
    p.ANIM_WIFI3_DATA = 'wifi3 anim data';
    p.ANIM_WIFI4_DATA = 'wifi4 anim data';

    //events
    p.ASSETS_PROGRESS = 'assets progress';
    p.ASSETS_COMPLETE = 'assets complete';

    p.assetsPath = 'assets/';
    p.assetsSounds = 'assets/sounds/';

    p.loadManifest = null;
    p.queue = null;
    p.loadProgress = 0;


    p.initialize = function () {
        this.EventDispatcher_initialize();
        this.loadManifest = [
            {id:this.WIFI_SOUND, src:this.assetsSounds + 'signal.mp3'},
            {id:this.EXPLOSION, src:this.assetsSounds + 'explosion.mp3'},
            {id:this.NO_SIGNAL, src:this.assetsSounds + 'nosignal.mp3'},
            {id:this.ADD_GAUGE, src:this.assetsSounds + 'wifi.mp3'},
            {id:this.FONT_SHEET_DATA, src:this.assetsPath + 'abc.json'},
            {id:this.FONT_SPRITES, src:this.assetsPath + 'abc.png'},
            {id:this.GAME_SPRITES_DATA, src:this.assetsPath + 'all.json'},
            {id:this.GAME_SPRITES, src:this.assetsPath + 'all.png'},
            {id:this.ANIM_WIFI0_DATA, src:this.assetsPath + 'wifi/reception0.json'},
            {id:this.ANIM_WIFI1_DATA, src:this.assetsPath + 'wifi/reception1.json'},
            {id:this.ANIM_WIFI2_DATA, src:this.assetsPath + 'wifi/reception2.json'},
            {id:this.ANIM_WIFI3_DATA, src:this.assetsPath + 'wifi/reception3.json'},
            {id:this.ANIM_WIFI4_DATA, src:this.assetsPath + 'wifi/reception4.json'},
            {id:this.ANIM_WIFI_0, src:this.assetsPath + 'wifi/reception0.png'},
            {id:this.ANIM_WIFI_1, src:this.assetsPath + 'wifi/reception1.png'},
            {id:this.ANIM_WIFI_2, src:this.assetsPath + 'wifi/reception2.png'},
            {id:this.ANIM_WIFI_3, src:this.assetsPath + 'wifi/reception3.png'},
            {id:this.ANIM_WIFI_4, src:this.assetsPath + 'wifi/reception4.png'}
        ];
    }
    p.preloadAssets = function () {
        createjs.Sound.initializeDefaultPlugins();
        this.queue = new createjs.LoadQueue();
        this.queue.installPlugin(createjs.Sound);
        this.queue.on("error", this.assetsError, this);
        this.queue.on('complete', this.assetsLoaded, this);
        this.queue.on('progress', this.assetsProgress, this);
        createjs.Sound.alternateExtensions = ["ogg"];
        this.queue.loadManifest(this.loadManifest);
    }

    p.assetsProgress = function (e) {
        this.loadProgress = e.progress;
        var event = new createjs.Event(this.ASSETS_PROGRESS);
        this.dispatchEvent(event);
    }
    p.assetsLoaded = function (e) {
        var event = new createjs.Event(this.ASSETS_COMPLETE);
        this.dispatchEvent(event);
    }
    p.assetsError = function (e) {
        console.log(e);
        this.queue.off();
    }
    p.getAsset = function (asset) {
        return this.queue.getResult(asset);
    }

    window.game.AssetManager = AssetManager;

}());
