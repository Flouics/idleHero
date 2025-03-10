import App, { DELAY_TASK_KEY } from "../../App";
import BaseClass from "../../zero/BaseClass";
import BaseView from "../../zero/BaseView";
import { Debug }   from "../../utils/Debug";
import { getPlayerProxy } from "../player/PlayerProxy";
import Command from "./Command";

export class Proxy extends BaseClass {
    viewMap:{[key:string]:any} = {};
    attrs:{[key:string]:any} = {};
    app:App;
    cmd:Command;
    isDump:boolean = true;
    moduleName:string = "";
    _baseUrl:string = "";
    _prefabUrl: string = "";
    static _moduleName:string = "";
    constructor(_class:any){       
        super(_class);
        this.app = App.getInstance(App);
        this.init()
    }

    setCommand<T extends Command>(command:T){
        this.cmd = command as T;
        this.cmd.proxy = this;
        Node
    }

    setModuleName(name:string) {
        this.moduleName = name;
        this._class._moduleName = name;
        this._baseUrl = "texture/" + this.moduleName + "/";
        this._prefabUrl = "prefab/" + this.moduleName + "/";
        window[this.moduleName + "Proxy"] = this;
        if(this.cmd){
            this.cmd.moduleName = this.moduleName;
        }
    }
    
    init(){
        
    }
    onHttpMsg(cmd:string,data:any){
        Debug.log(cmd,data);
    }

    onSocketMsg(cmd:string,data:any){
        Debug.log(cmd,data);
    }

    bindView(view:BaseView){
        this.viewMap[view.getId()] = view;
    }
    unbindView(view:BaseView){
        delete this.viewMap[view.getId()];
    }
    updateView(funcName:string,params?:{}){
        for (var uuid in this.viewMap) {
            if (this.viewMap.hasOwnProperty(uuid)) {
                let  ui = this.viewMap[uuid];
                if(ui[funcName] && typeof(ui[funcName]) == "function"){
                    ui[funcName](params)
                }
            }
        }
    }

    updateViewTask(funcName:string,params?:{}){
        var self = this;
        App.taskOnce(function () {
            self.updateView(funcName,params);
        },0,"delayTask_updateView_" + this.getClassName())
    }

    getConf(filename:string,id?: number){
        var ret:any;
        if(!id){
            ret = App.dataMgr.getTable(filename);
        }else{
            ret = App.dataMgr.findById(filename,id);            
        }
        return ret; 
    }

    getDbKey(){        
        return this._classDbKey;
    }

    dumpPrepare(){
        
    }

    reloadPrepare(){

    }

    dumpToDb(isImmediate = false){
        if (!this.isDump) {
            return
        }
        var self = this;
        var doAction = function(){
            self.dumpPrepare()
            var key = self.getDbKey();
            var json = self.serialize();
            Debug.log("dumpToDb",json)
            App.dbMgr.setItem(key,json);
        }
        if(isImmediate){
            doAction();
        }else{
            // 延时100毫秒
            App.taskOnce(doAction,0,DELAY_TASK_KEY + "ddumpToDb_" + this.getClassName());
        }       
    }
    
    reloadFromDb(){
        if (!this.isDump) {
            return
        }        
        var key = this.getDbKey();
        var json = App.dbMgr.getItem(key);
        if(json){
            Debug.log("reloadFromDb",json)
            this.unserialize(json);            
        }
        this.reloadPrepare();
    }
}

