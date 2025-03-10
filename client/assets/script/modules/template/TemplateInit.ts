import { TemplateProxy }  from "./TemplateProxy";
import TemplateCommand from "./TemplateCommand";
import Init from "../base/Init";

export default class TemplateInit extends Init {
    proxy:TemplateProxy;
    cmd:TemplateCommand;
    moduleName:string = "template";
    init(){
        this.moduleName = "template";
        this.proxy = TemplateProxy.getInstance(TemplateProxy);
        this.cmd = new TemplateCommand();       
    }

    onMsg(){
        //监听服务端消息   
    }
}

