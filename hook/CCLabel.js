var font = null;
var initFont = function(cb){
    if(font){
        if (!!cb) {
            cb(font);
        }
        return;
    }
    cc.assetManager.loadAny("font/base", function (err, font) {
        font = font;
        if (!!cb) {
            cb(font);
        }
    });
}
cc.Class({
    extends: cc.Label,

     properties: {
        showKey: {
            get: function () {
                if (this.textKey == undefined) {
                    cc.error('label textKey is ', this.textKey, this.node.name, typeof this.textKey);
                    return this.textKey;
                }
                //this.textKey 可能是number
                var firstString = typeof this.textKey == 'string' ? this.textKey.slice(0, 1) : this.textKey;
                return firstString === '$' ? i18n.t(this.textKey.slice(1).trim()) : this.textKey;
            },
            set: function () {
                //只显示，不设置。
            }
        },

        textKey: {
            default: '$COMMON_NONE_1',
            multiline: true,
            visible: true,
            notify: function () {
                if (this._sgNode) {
                    this._sgNode.setString(this.string);
                    this._updateNodeSize();
                }
            }
        },

        string: {
            override: true,
            visible: false,
            tooltip: '这里显示的是翻译结果',
            get: function () {
                if (this.textKey == undefined) {
                    cc.error('label textKey is ', this.textKe, this.node.name, typeof this.textKey);
                    return 'NULL';
                }
                //this.textKey 可能是number
                var firstString = typeof this.textKey == 'string' ? this.textKey.slice(0, 1) : this.textKey;
                if (this._sgNode) {
                    this._updateNodeSize();
                }
                return firstString === '$' ? i18n.t(this.textKey.slice(1).trim()) : this.textKey;
            },
            set: function (value) {
                this.textKey = value;
            }
        },
    }, 
    onLoad: function(){
        var self = this;
        //字体
        if (CC_EDITOR){        
            initFont(function (font) {
                self.font = font;
            });
        }else if (cc.sys.isNative) {
            if (!App && this.font == null) {
                App.initFont(function (font) {
                    self.font = font;
                });
            }
        }
    }
});


