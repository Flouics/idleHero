import { LobbyProxy }  from "./LobbyProxy";
import {LobbyCommand} from "./LobbyCommand";
import {Init} from "../base/Init";
import { uuidIndex } from "../../common/config/GameUIConfig";
import { LayerType, UIConfig } from "../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";

export enum UIID_Lobby {
    /** 资源加载界面 */
    LobbyView = uuidIndex(),
}

/** 打开界面方式的配置数据 */
var UIConfigData: { [key: number]: UIConfig } = {
    [UIID_Lobby.LobbyView]: 
        { 
            layer: LayerType.UI
            , prefab: "/prefab/lobby/LobbyView"
            , bundle: "resources" 
        },
}

export class LobbyInit extends Init {
    proxy:LobbyProxy;
    cmd:LobbyCommand;
    moduleName:string = "lobby";
    init(){
        this.moduleName = "lobby";
        this.proxy = new LobbyProxy();
        this.cmd = new LobbyCommand();   
        this.UIConfigData = UIConfigData;    
    }

    onMsg(){
        //监听服务端消息   
    }
}

