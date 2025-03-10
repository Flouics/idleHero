/*
const CacheMode = cc.Enum({
    NONE: 0,
    BITMAP: 1,
    CHAR: 2,
});

var font = null;
var initFont =  function(cb){
    if(font){
        if (!!cb) {
            cb(font);
        }
        return;
    }
    cc.resources.load("font/base", function (err, font) {
        font = font;
        if (!!cb) {
            cb(font);
        }
    });
}

cc.Label.prototype.onLoad = function () {
    var self = this;

    //字体
    if (this.font == null){
        if (typeof App != 'undefined') {
            App.initFont(function (font) {
                self.font = font;
            });
        }else{
            initFont(function (font) {
                self.font = font;
            });
        }
    }

    if (this._batchAsBitmap && this.cacheMode === CacheMode.NONE) {
        this.cacheMode = CacheMode.BITMAP;
        this._batchAsBitmap = false;
    }

};
*/

/* cc.Button.prototype.soundName = {
    default: 'i18n:COMPONENT.label.string',
    visible: true,
}

cc.Button.prototype.onLoad = function () {
    this.node.on('click', function () {
        if (typeof App != 'undefined'){
            if(!empty(this.soundName)){
                App.audioMgr.playEffect(this.soundName);
            }
        }        
    }, this);
}; */



