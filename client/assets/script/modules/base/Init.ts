import { Proxy }from "./Proxy";
import Command from "./Command";
export default class Init {
    proxy:Proxy;
    cmd:Command;
    moduleName:string;


    constructor(){
        //this.init();     //构造函数会导致子类同名属性
    }

    initModule() {
        this.init();
        this.initProxyCmd();
        this.onMsg();
    }
    init(){
        this.moduleName = "base";
        this.proxy = Proxy.getInstance(Proxy);
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
