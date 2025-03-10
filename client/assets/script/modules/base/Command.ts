import { Node } from "cc";
import App from "../../App";
import { nullfun } from "../../Global";
import { Proxy }from "./Proxy";

export default class Command{
    app:App;
    proxy:Proxy;
    moduleName:String = "";
    constructor(){
        this.app = App.getInstance(App);
    }
    init(){
    }
    showView(name:string,cb:Function = nullfun,parent:Node = null,...args:any[]){
        var winRes = name;
        if (name.startsWith("prefab") || name.startsWith("/prefab")){
            winRes = name;
        }else{
            winRes = this.proxy._prefabUrl + name;
        }
        App.windowMgr.open(winRes, cb,parent,...args);
    }

    hideView(name:string){
        var winRes = name;
        if (name.startsWith("prefab") || name.startsWith("/prefab")){
            winRes = name;
        }else{
            winRes = this.proxy._prefabUrl + name;
        }
        App.windowMgr.close(winRes);
    }
}
