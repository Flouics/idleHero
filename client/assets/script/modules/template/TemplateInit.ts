import { TemplateProxy }  from "./TemplateProxy";
import {TemplateCommand} from "./TemplateCommand";
import {Init} from "../base/Init";
import { uuidIndex } from "../../common/config/GameUIConfig";
import { LayerType, UIConfig } from "../.././oops/core/gui/layer/LayerManager";
import { UUID } from "../../utils/UUID";
import { oops } from "../.././oops/core/Oops";

export enum UIID_Template {
    /** 资源加载界面 */
    TemplateView = uuidIndex(),
}

/** 打开界面方式的配置数据 */
var UIConfigData: { [key: number]: UIConfig } = {
    [UIID_Template.TemplateView]: 
        { 
            layer: LayerType.UI
            , prefab: "/prefab/template/TemplateView"
            , bundle: "resources" 
        },
}

export class TemplateInit extends Init {
    proxy:TemplateProxy;
    cmd:TemplateCommand;
    moduleName:string = "template";

    init(){
        this.moduleName = "template";
        this.proxy = new TemplateProxy();
        this.cmd = new TemplateCommand();   
        this.UIConfigData = UIConfigData;    
    }

    onMsg(){
        //监听服务端消息   
    }
}

