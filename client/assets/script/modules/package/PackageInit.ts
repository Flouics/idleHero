import { PackageProxy }from "./PackageProxy";
import Command from "./PackageCommand";
import Init from "../base/Init";

export default class PackageInit extends Init {
    proxy:PackageProxy;
    cmd:Command;
    init(){
        this.moduleName = "package";
        this.proxy = new PackageProxy(PackageProxy);
        this.cmd = new Command();        
    }

    onMsg(){
        //监听服务端消息   

    }
}

