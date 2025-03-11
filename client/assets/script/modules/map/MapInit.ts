import { MapProxy } from "./MapProxy";
import {MapCommand} from "./MapCommand";
import {Init} from "../base/Init";
import { uuidIndex } from "../../common/config/GameUIConfig";
import { LayerType, UIConfig } from "../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";

export enum UIID_Map {
    /** 资源加载界面 */
    MapMainView = uuidIndex(),
    BattleMainView = uuidIndex(),
    FailView = uuidIndex(),
    WinView =  uuidIndex(),
}

/** 打开界面方式的配置数据 */
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

export class MapInit extends Init {
    proxy:MapProxy;
    cmd:MapCommand;
    
    init(){
        this.moduleName = "map";
        this.proxy = new MapProxy();
        this.cmd = new MapCommand();  
        this.UIConfigData = UIConfigData;          
    }

    onMsg(): void {
        //监听服务端消息        
    }
    
}

