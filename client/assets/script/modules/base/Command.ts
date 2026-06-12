import { Node } from "cc";
import { UICallbacks } from "../../oops/core/gui/layer/Defines";
import { oops } from "../../oops/core/Oops";
import {App} from "../../App";
import { Proxy }from "./Proxy";

export class Command{
    app:App;
    proxy:Proxy;
    moduleName:String = "";
    static _instance = null;
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
