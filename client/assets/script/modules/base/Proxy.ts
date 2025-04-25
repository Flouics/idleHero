import {App,DELAY_TASK_KEY } from "../../App";
import {BaseClass} from "../../zero/BaseClass";
import {BaseView} from "../../zero/BaseView";
import { Debug }   from "../../utils/Debug";
import { getPlayerProxy } from "../player/PlayerProxy";
import {Command} from "./Command";
import { Emitter } from "../../zero/Emitter";
import { EventDispatcher } from "../../oops/core/common/event/EventDispatcher";
import { ListenerFunc } from "../../oops/core/common/event/EventMessage";

export class Proxy extends BaseClass {
    viewMap:{[key:string]:any} = {};
    attrs:{[key:string]:any} = {};
    app:App;
    cmd:Command;
    isDump:boolean = true;
    moduleName:string = "";
    _baseUrl:string = "";
    _prefabUrl: string = "";
    //#region 全局事件管理
    _event:EventDispatcher|null = null;
    constructor(){       
        super();
        // Proxy._instance = this;
        this.app = App.instance;
    }

    static get instance ():Proxy{
        if( Proxy._instance){
            return Proxy._instance as Proxy;
        }else{
            let instance = new Proxy();
            return instance
        }
    }

    /** 全局事件管理器 */
    get event(): EventDispatcher {
        if (this._event == null) this._event = new EventDispatcher();
        return this._event;
    }           
        
    /**
     * 注册全局事件
     * @param event       事件名
     * @param listener    处理事件的侦听器函数
     * @param object      侦听函数绑定的this对象
     */
    on(event: string, listener: ListenerFunc, object: any) {
        this.event.on(event, listener, object);
    }

    /**
     * 移除全局事件
     * @param event      事件名
     */
    off(event: string,listener: ListenerFunc) {
        this.event.off(event,listener);
    }

    /** 
     * 触发全局事件 
     * @param event      事件名
     * @param args       事件参数
     */
    dispatchEvent(event: string, ...args: any) {
        this.event.dispatchEvent(event, ...args);
    }

    emit(event: string, ...args: any){
        this.dispatchEvent(event,...args);
    }

    setCommand<T extends Command>(command:T){
        this.cmd = command as T;
        this.cmd.proxy = this;
        Node
    }

    setModuleName(name:string) {
        this.moduleName = name;
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

    dumpPrepare(){
        
    }

    reloadPrepare(){

    }

    dumpToDb(isImmediate = true){
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
            // 延时1秒
            App.taskOnce(doAction,1.0,DELAY_TASK_KEY + "dumpToDb_" + this.getClassName());
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

