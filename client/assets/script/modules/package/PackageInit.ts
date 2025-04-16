import { PackageProxy }from "./PackageProxy";
import {PackageCommand} from "./PackageCommand";
import {Init} from "../base/Init";
import { uuidIndex } from "../../common/config/GameUIConfig";
import { LayerType, UIConfig } from "../.././oops/core/gui/layer/LayerManager";

export enum UIID_Package {
    /** 资源加载界面 */
    PackageView = uuidIndex(),
}

/** 打开界面方式的配置数据 */
var UIConfigData: { [key: number]: UIConfig } = {
    [UIID_Package.PackageView]: 
        { 
            layer: LayerType.UI
            , prefab: "/prefab/package/PackageView"
            , bundle: "resources" 
        },
}
export class PackageInit extends Init {
    proxy:PackageProxy;
    cmd:PackageCommand;
    init(){
        this.moduleName = "package";
        this.proxy = new PackageProxy();
        this.cmd = new PackageCommand();   
        this.UIConfigData = UIConfigData;         
    }

    onMsg(){
        //监听服务端消息   

    }
}

