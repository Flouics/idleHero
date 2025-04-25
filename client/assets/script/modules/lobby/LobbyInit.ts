import { LobbyProxy }  from "./LobbyProxy";
import {LobbyCommand} from "./LobbyCommand";
import {Init} from "../base/Init";
import { LayerType,UIConfig} from "../../oops/core/gui/layer/LayerManager"
import { UUID } from "../../utils/UUID";

export enum UIID_Lobby {
    /** 资源加载界面 */
    LobbyView = UUID.UIID_INDEX,
}

/** 打开界面方式的配置数据 */
let getUIConfigData = () => {
    var UIConfigData: { [key: number]: UIConfig } = {
        [UIID_Lobby.LobbyView]: 
            { 
                layer: LayerType.UI
                , prefab: "/prefab/lobby/LobbyView"
                , bundle: "resources" 
            },
    }
return UIConfigData;
}

export class LobbyInit extends Init {
    proxy:LobbyProxy;
    cmd:LobbyCommand;
    moduleName:string = "lobby";
    init(){
        this.moduleName = "lobby";
        this.proxy = new LobbyProxy();
        this.cmd = new LobbyCommand();   
        this.UIConfigData = getUIConfigData();    
    }

    onMsg(){
        //监听服务端消息   
    }
}

