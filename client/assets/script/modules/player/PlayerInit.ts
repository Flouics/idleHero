import { PlayerProxy } from "./PlayerProxy";
import {PlayerCommand} from "./PlayerCommand";
import {Init} from "../base/Init";
import { uuidIndex } from "../../common/config/GameUIConfig";
import { LayerType, UIConfig } from "../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";

export enum UIID_Player {
    /** 资源加载界面 */
    PlayerView = uuidIndex(),
    PlayerTopInfoView = uuidIndex(),
}

/** 打开界面方式的配置数据 */
var UIConfigData: { [key: number]: UIConfig } = {
    [UIID_Player.PlayerView]: 
        { 
            layer: LayerType.UI
            , prefab: "/prefab/player/PlayerView"
            , bundle: "resources" 
        },
    [UIID_Player.PlayerTopInfoView]: 
        { 
            layer: LayerType.UI
            , prefab: "/prefab/player/PlayerTopInfoView"
            , bundle: "resources" 
        },
}

export class PlayerInit extends Init{
    proxy:PlayerProxy;
    cmd:PlayerCommand;
    moduleName:string = "player";

    init(){
        this.moduleName = "player";
        this.proxy = new PlayerProxy();
        this.proxy.init();
        this.cmd = new PlayerCommand();  
        this.UIConfigData = UIConfigData;          
    }

    onMsg(){
        //监听服务端消息   

    }
}

