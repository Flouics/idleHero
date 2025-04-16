import { Node } from "cc";
import { UICallbacks } from "../.././oops/core/gui/layer/Defines";
import { oops } from "../.././oops/core/Oops";
import {App} from "../../App";
import { nullfun } from "../../Global";
import { Proxy }from "./Proxy";

export class Command{
    app:App;
    proxy:Proxy;
    moduleName:String = "";
    constructor(){
        this.app = App.getInstance(App);
    }
    init(){
    }
    showView(id:number,args?:any,uic?:UICallbacks){
        oops.gui.open(id,args,uic);
    }

    hideView(id:number,isDestroy?:boolean){
        oops.gui.remove(id,isDestroy);
    }
}
