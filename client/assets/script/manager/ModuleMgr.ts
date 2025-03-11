import {Init} from "../modules/base/Init";
import {BaseClass} from "../zero/BaseClass";
import { Proxy } from "../modules/base/Proxy";
import { Debug }   from "../utils/Debug";
import { js } from "cc";

export class ModuleMgr extends BaseClass{
    _modules = {}  

    constructor(){
        super();
        ModuleMgr._instance = this;
    }

    static get instance ():ModuleMgr{
        if( ModuleMgr._instance){
            return ModuleMgr._instance as ModuleMgr;
        }else{
            let instance = new ModuleMgr();
            return instance
        }
    }


    getProxy<T extends Proxy>(proxy:string|object):T{
        var moduleName = "";
        if(typeof proxy === "object"){
            moduleName = (proxy as Proxy).moduleName as string;
        }else{
            moduleName = proxy;
        }
        let mod = this._modules[moduleName];
        if(!mod){
            Debug.error("this module has not exist by " + moduleName);
            return;
        }
        return mod.proxy;
    }

    init () {
        this._modules = {}
    };

    clear() {
        this.clearAllModules();
    }

    load(moduleName:string,moduleInit:Init){
        return this.loadModule(moduleName,moduleInit);
    }

    loadModule(moduleName:string,moduleInit:Init){
        moduleInit.initModule();
        this._modules[moduleName] = moduleInit;        
    }

    clearAllModules(): void {
        for (const key in this._modules) {
            if (Object.prototype.hasOwnProperty.call(this._modules, key)) {
                var mod = this._modules[key];
                mod.proxy.destory();
            }
        }
        this._modules = {}
    }
    command(moduleName:string,funcName:string,...params:any[]){
        let mod = this._modules[moduleName];
        if(!mod){
            Debug.error("this module has not exist by " + moduleName);
            return;
        }

        if(!mod.cmd[funcName]){
            Debug.error("this func has not exist by " + funcName + " in module " + moduleName);
            return;
        }
        Debug.log(js.formatStr("command->%s.%s ",moduleName,funcName),params)
        mod.cmd[funcName](...params)
    };

    dumpToDb(){
        for (const key in this._modules) {
            if (Object.prototype.hasOwnProperty.call(this._modules, key)) {
                var mod = this._modules[key];
                mod.proxy.dumpToDb();
            }
        }
    }

    reloadFromDb(){
        for (const key in this._modules) {
            if (Object.prototype.hasOwnProperty.call(this._modules, key)) {
                var mod = this._modules[key];
                mod.proxy.reloadFromDb();
            }
        }
    }
};


