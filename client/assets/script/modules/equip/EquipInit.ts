import { EquipProxy }  from "./EquipProxy";
import {EquipCommand} from "./EquipCommand";
import {Init} from "../base/Init";
import { LayerType,UIConfig} from "../../oops/core/gui/layer/LayerManager"
import { UUID } from "../../utils/UUID";
import { oops } from "../../oops/core/Oops";

export enum UIID_Equip {
    /** 资源加载界面 */
    EquipView = UUID.UIID_INDEX,
    EquipCombineView = UUID.UIID_INDEX,
}

/** 打开界面方式的配置数据 */
let getUIConfigData = () => {
    var UIConfigData: { [key: number]: UIConfig } = {
        [UIID_Equip.EquipView]: 
            { 
                layer: LayerType.UI
                , prefab: "/prefab/equip/EquipView"
                , bundle: "resources" 
            },

        [UIID_Equip.EquipCombineView]: 
            { 
                layer: LayerType.UI
                , prefab: "/prefab/equip/EquipCombineView"
                , bundle: "resources" 
            },
    }
    return UIConfigData;
}

export class EquipInit extends Init {
    proxy:EquipProxy;
    cmd:EquipCommand;

    init(){
        this.moduleName = "equip";
        this.proxy = new EquipProxy();
        this.cmd = new EquipCommand();   
        this.UIConfigData = getUIConfigData();    
    }

    onMsg(){
        //监听服务端消息   
    }
}

