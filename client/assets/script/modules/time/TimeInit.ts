import { TimeProxy }from "./TimeProxy";
import {TimeCommand} from "./TimeCommand";
import {Init} from "../base/Init";
import { UIConfig } from "../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";

export enum UIID_Template {
    /** 资源加载界面 */

}

/** 打开界面方式的配置数据 */
var UIConfigData: { [key: number]: UIConfig } = {

}

export class TimeInit extends Init {
    proxy:TimeProxy;
    cmd:TimeCommand;
    init(){
        this.moduleName = "time";
        this.proxy = new TimeProxy();
        this.cmd = new TimeCommand();
        this.UIConfigData = UIConfigData;    
    }

    onMsg(){
        //监听服务端消息   
    }
}

