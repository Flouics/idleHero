import App from "../App";
import SceneBase from "../zero/SceneBase";


import { _decorator,Node,Label, director} from 'cc';
const {ccclass, property} = _decorator;
@ccclass("Launch")
export default class Launch extends SceneBase{

    @property(Node)
    nd_login: Node = null;
    @property(Label)
    lb_version: Label = null;

    loadEvents:{[key:string]:any} = {}

    // use this for initialization
    onLoad () {
        super.onLoad();
        this.nd_login.active = false;
    };

    onEnable () {
        super.onEnable();
        this.nd_login.active = false;       
    };

    hotUpdateCheck () {
        this.loadEvents = {'loadtxt': false};
        //先不加进度条，就一个文本。
        App.dataMgr.tryLoadAllTable(function () {
            this.loadEvents.loadtxt = true;
            this.loadGame();
        }.bind(this));
    };

    start () {
        this.hotUpdateCheck();
        this.preLoad();
        this.setVersion();
    };

    preLoad () {
        var res = [];
        App.loadingMgr.preLoadRes(res);
        var prefabs = [
        
        ];
        App.loadingMgr.preLoadPrefab(prefabs);
        director.preloadScene('game');
    };

    setVersion () {
        if (App.config.version) {
            this.lb_version.string = App.config.version;
        } else {
            this.lb_version.string = '1.0.0';
        }
    };

    loadGame () {
        var isCmp = true;
        for (var key in this.loadEvents) {
            if (this.loadEvents[key] == false) {
                isCmp = false;
                break;
            }
        }
        if (!!isCmp) {
            //重新加载数据
            App.reloadFromDb();
            App.onLaunchGame();
            
            App.sceneMgr.loadScene('game');            
        }
    };
};
