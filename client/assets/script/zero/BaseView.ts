import {App} from "../App";
import { Proxy }from "../modules/base/Proxy";
import { Debug }   from "../utils/Debug";
import { toolKit } from "../utils/ToolKit";

import { _decorator, EventTouch, find, NodeEventType } from 'cc';
import { BaseUI } from "./BaseUI";

const {ccclass, property} = _decorator;

@ccclass("BaseView")
export class BaseView extends BaseUI {
    _objFlags: number;
    moduleName:string = "";
    proxy:Proxy;
    hasInit:boolean = false;
    params:any;   

    onLoad() {
        super.onLoad();
        this._baseInit(); 
        !this.proxy && this.tryInitProxy();           
    }

    _baseInit(): void {
        var nd_close = find('close', this.node) || find('btn_close', this.node);
        if (nd_close) {
            nd_close.on(NodeEventType.TOUCH_END, this.onClose.bind(this));
        }

        this.node.on(NodeEventType.TOUCH_END, this.onBgClick.bind(this));
    }

    tryInitProxy() {
        if (!toolKit.empty(this.moduleName)){
            this.proxy = App.moduleMgr.getProxy(this.moduleName);
            if(!this.proxy){
                return;
            }
              
            if(this._prefabUrl == ""){
                this._prefabUrl = this.proxy._prefabUrl;
            }    
            if(this._baseUrl == ""){
                this._baseUrl = this.proxy.baseUrl;
            }         
        } else{
            Debug.warn("moduleName is null",this.moduleName);
        }
    }

    onBgClick (event:EventTouch) {
        //Debug.log("event propagationStopped",this);
        //event.propagationStopped = true;
    }

    getResUrl(res_url:string){
        if(this.proxy){
            return this.proxy.baseUrl + res_url;
        }else{
            return super.getResUrl(res_url);
        }        
    }

    onAdded(params:any){
       this.params = params;   
       !this.proxy && this.tryInitProxy();      
    }

    onBeforeRemove(){
        this.hide();
    }

    show(params:any) {
       
    }
    
    hide() {

    }
    start(): void {
        super.start();        
    }
    onEnable() {
        super.onEnable();
        this.show(this.params);
    }

    getDataUnique(data: any) {
        if (typeof (data) == "object") {
            return JSON.stringify(data)
        } else {
            return data;
        }
    }

    /**
     * 发送模块命令 废弃不用，尽量用事件机制
     * @param funcName 模块命令函数名
     * @param params 模块命令参数
     */
    command(funcName:string,...params:any[]){
        if (!toolKit.empty(this.moduleName)){
            App.moduleMgr.command(this.moduleName,funcName,...params)
        }
    }
}
