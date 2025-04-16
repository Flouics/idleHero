import { MercenaryProxy } from "./MercenaryProxy";
import {MercenaryCommand} from "./MercenaryCommand";
import {Init} from "../base/Init";
import { uuidIndex } from "../../common/config/GameUIConfig";
import { LayerType, UIConfig } from "../.././oops/core/gui/layer/LayerManager";

export enum UIID_Mercenary {
    /** 资源加载界面 */
    MercenaryView = uuidIndex(),
}

/** 打开界面方式的配置数据 */
var UIConfigData: { [key: number]: UIConfig } = {
    [UIID_Mercenary.MercenaryView]: 
        { 
            layer: LayerType.UI
            , prefab: "/prefab/mercenary/MercenaryView"
            , bundle: "resources" 
        },
}

export class MercenaryInit extends Init {
    proxy:MercenaryProxy;
    cmd:MercenaryCommand;
    moduleName:string = "mercenary";
    init(){
        this.moduleName = "mercenary";
        this.proxy = new MercenaryProxy();
        this.cmd = new MercenaryCommand();    
        this.UIConfigData = UIConfigData;       
    }

    onMsg(){
        //监听服务端消息   
    }
}

