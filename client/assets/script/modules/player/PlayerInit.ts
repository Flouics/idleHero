import { PlayerProxy } from "./PlayerProxy";
import {PlayerCommand} from "./PlayerCommand";
import {Init} from "../base/Init";
import { LayerType,UIConfig} from "../../oops/core/gui/layer/LayerManager"
import { UUID } from "../../utils/UUID";

export enum UIID_Player {
    /** 资源加载界面 */
    PlayerView = UUID.UIID_INDEX,
    PlayerTopInfoView = UUID.UIID_INDEX,
}

/** 打开界面方式的配置数据 */
let getUIConfigData = () => {
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
    return UIConfigData;
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
        this.UIConfigData = getUIConfigData();          
    }

    onMsg(){
        //监听服务端消息   

    }
}

