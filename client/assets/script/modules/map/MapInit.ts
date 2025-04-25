import { MapProxy } from "./MapProxy";
import {MapCommand} from "./MapCommand";
import {Init} from "../base/Init";
import { LayerType,UIConfig} from "../../oops/core/gui/layer/LayerManager"
import { UUID } from "../../utils/UUID";

export enum UIID_Map {
    /** 资源加载界面 */
    MapMainView = UUID.UIID_INDEX,
    BattleMainView = UUID.UIID_INDEX,
    FailView = UUID.UIID_INDEX,
    WinView =  UUID.UIID_INDEX,
}

/** 打开界面方式的配置数据 */
let getUIConfigData = () => {
    var UIConfigData: { [key: number]: UIConfig } = {
        [UIID_Map.MapMainView]: 
            { 
                layer: LayerType.UI
                , prefab: "/prefab/map/MapMainView"
                , bundle: "resources" 
            },
        [UIID_Map.BattleMainView]: 
            { 
                layer: LayerType.UI
                , prefab: "/prefab/map/BattleMainView"
                , bundle: "resources" 
            },

        [UIID_Map.FailView]: 
            { 
                layer: LayerType.Dialog
                , prefab: "/prefab/map/FailView"
                , bundle: "resources" 
            },
        [UIID_Map.WinView]: 
            { 
                layer: LayerType.Dialog
                , prefab: "/prefab/map/WinView"
                , bundle: "resources" 
            },
    }
    return UIConfigData;
}

export class MapInit extends Init {
    proxy:MapProxy;
    cmd:MapCommand;
    
    init(){
        this.moduleName = "map";
        this.proxy = new MapProxy();
        this.cmd = new MapCommand();  
        this.UIConfigData = getUIConfigData();          
    }

    onMsg(): void {
        //监听服务端消息        
    }
    
}

