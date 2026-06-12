import {App,DELAY_TASK_KEY } from "../../App";
import {BaseClass} from "../../zero/BaseClass";
import {BaseView} from "../../zero/BaseView";
import { Debug }   from "../../utils/Debug";
import { getPlayerProxy } from "../player/PlayerProxy";
import {Command} from "./Command";
import { Emitter } from "../../zero/Emitter";
import { EventDispatcher } from "../../oops/core/common/event/EventDispatcher";
import { ListenerFunc } from "../../oops/core/common/event/EventMessage";
import { DEBUG } from "cc/env";

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
    get baseUrl(){
        return this._baseUrl;
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
    }

    setModuleName(name:string) {
        this.moduleName = name;
        this._baseUrl = "texture/" + this.moduleName + "/";
        this._prefabUrl = "prefab/" + this.moduleName + "/";

        //方便调试
        DEBUG && (window[this.moduleName + "Proxy"] = this);
        
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

    /**
     * 延时一帧发射事件
     * @param event 
     * @param params 
     */
    emitTask(event:string,params?:{}){
        this.dispatchEventTask(event,params)
    }
    
    /**
     * 延时一帧发射事件
     * @param event 
     * @param params 
     */
    dispatchEventTask(event:string,params?:{}){
        App.taskOnce(() => {
            this.dispatchEvent(event, params);
        },0,"delayTask_dispatchEventTask_" + this.getClassName() + event);
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

    /**
     * 数据持久化到数据库
     * @param isImmediate 是否立即执行，默认为true，如果为false则会在delayTime时间后执行
     * @param delayTime 延迟执行的时间，单位为秒，默认为0
     */
    dumpToDb(isImmediate = true,delayTime = 0){
        if (!this.isDump) {
            return
        }
        var doAction = () => {
            this.dumpPrepare()
            var key = this.getDbKey();
            var json = this.serialize();
            Debug.log("dumpToDb",key)
            App.dbMgr.setItem(key,json);
        }
        if(isImmediate){
            doAction();
        }else{
            // 延时1秒
            App.taskOnce(doAction,delayTime,DELAY_TASK_KEY + "dumpToDb_" + this.getClassName());
        }       
    }
    
    reloadFromDb(){
        if (!this.isDump) {
            return
        }        
        var key = this.getDbKey();
        var json = App.dbMgr.getItem(key);
        if(json){
            Debug.log("reloadFromDb",key)
            this.unserialize(json);            
        }
        this.reloadPrepare();
    }
}

