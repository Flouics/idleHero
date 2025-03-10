
cc.Class({
    extends: cc.Button,
    properties: {
        soundName: {
            default: '',
            multiline: true,
            visible: true
        },
    },
    onLoad: function() {
        this.node.on('click', function () {
            if (!empty(this.soundName) && !App){
                App.audioMgr.playEffect(this.soundName);
            }
        }, this);
    }
});
