import { GardenProxy }  from "./GardenProxy";
import {GardenCommand} from "./GardenCommand";
import {Init} from "../base/Init";
import { LayerType,UIConfig} from "../../oops/core/gui/layer/LayerManager"
import { UUID } from "../../utils/UUID";
import { oops } from "../../oops/core/Oops";

export enum UIID_Garden {
    /** 资源加载界面 */
    GardenView = UUID.UIID_INDEX,
    GardenPlantChooseView = UUID.UIID_INDEX,
    GardenPlantTakeCareView = UUID.UIID_INDEX,
    GardenPlantWaterView = UUID.UIID_INDEX,
}

/** 打开界面方式的配置数据 */
let getUIConfigData = () => {
    var UIConfigData: { [key: number]: UIConfig } = {
        [UIID_Garden.GardenView]: 
            { 
                layer: LayerType.UI
                , prefab: "/prefab/garden/GardenView"
                , bundle: "bundles" 
            },
        [UIID_Garden.GardenPlantChooseView]: 
            { 
                layer: LayerType.UI
                , prefab: "/prefab/garden/GardenPlantChooseView"
                , bundle: "bundles" 
            },
        [UIID_Garden.GardenPlantTakeCareView]: 
            { 
                layer: LayerType.UI
                , prefab: "/prefab/garden/GardenPlantTakeCareView"
                , bundle: "bundles" 
            },
        [UIID_Garden.GardenPlantWaterView]: 
            { 
                layer: LayerType.UI
                , prefab: "/prefab/garden/GardenPlantWaterView"
                , bundle: "bundles" 
            },
    }
    return UIConfigData;
}

export class GardenInit extends Init {
    proxy:GardenProxy;
    cmd:GardenCommand;

    init(){
        this.moduleName = "garden";
        this.proxy = new GardenProxy();
        this.cmd = new GardenCommand();   
        this.UIConfigData = getUIConfigData();    
    }

    onMsg(){
        //监听服务端消息   
    }
}

