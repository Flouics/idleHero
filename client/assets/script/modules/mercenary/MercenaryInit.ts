import { MercenaryProxy } from "./MercenaryProxy";
import MercenaryCommand from "./MercenaryCommand";
import Init from "../base/Init";

export default class MercenaryInit extends Init {
    proxy:MercenaryProxy;
    cmd:MercenaryCommand;
    moduleName:string = "mercenary";
    init(){
        this.moduleName = "mercenary";
        this.proxy = MercenaryProxy.getInstance(MercenaryProxy);
        this.cmd = new MercenaryCommand();       
    }

    onMsg(){
        //监听服务端消息   
    }
}

