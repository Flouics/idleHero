import { Proxy }from "./Proxy";
import {Command} from "./Command";
import { UIConfig } from "../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
export class Init {
    proxy:Proxy;
    cmd:Command;
    moduleName:string;
    UIConfigData:{ [key: number]: UIConfig } = {};


    constructor(){
        //this.init();     //构造函数会导致子类同名属性
    }

    initModule() {
        this.init();
        this.initProxyCmd();
        this.initViews();
        this.onMsg();
    }
    initViews(){
        oops.gui.add(this.UIConfigData);
    }
    init(){
        this.moduleName = "base";
        this.proxy = new Proxy();
        this.cmd = new Command();     
    }
    initProxyCmd(){
        this.proxy.setCommand(this.cmd);
        this.proxy.setModuleName(this.moduleName);
    }

    onMsg(){
        //监听服务端消息   
    }
}
