
import { EDITOR } from "cc/env";

import { _decorator,resources,Sprite,SpriteFrame,Component, js, Prefab, instantiate } from 'cc';
import {CCEvent} from "./CCEvent";
import { Debug }   from "../utils/Debug";
import { ItemBase } from "../logic/ItemBase";
import {App} from "../App";
import { GameComponent } from ".././oops/module/common/GameComponent";
import { oops } from ".././oops/core/Oops";
import { DelegateComponent } from ".././oops/core/gui/layer/DelegateComponent";
import { empty, isValid, NodeEx } from "../Global";
import { UUID } from "../utils/UUID";
import { Node } from "cc";
import { ListenerFunc } from "../oops/core/common/event/EventMessage";
const {ccclass, property} = _decorator;

@ccclass("BaseUI")
export class BaseUI extends GameComponent {
    private _bindData: { [key: string]: any } = {};
    _baseUrl: string = "";      //texture基础路径
    _prefabUrl: string = "";    //预制体基础路径
    _pb_tag:string = "";    //预制体标签，方便对象池管理 在PoolMgr中枚举 POOL_TAG_ENUM
    //onAuto事件，Disable时会自动调用来取消监听，只需注册onMsg
    //如果不需要自动取消监听，请用on
    private onAutoEventMap: Map<string, { event: string, listener: ListenerFunc, target: any }> = new Map();

    getId(){        
        return this.uuid
    }

    setBaseUrl(baseUrl:string){
        this._baseUrl = baseUrl;        
    }

    setPrefabUrl(prefabUrl:string){
        this._prefabUrl = prefabUrl;        
    }

    start(){
        this.updateUI();
    }

    updateUI() {
        //todo需要重写
    /*         var self = this;
        var logicObj = this._logicObj
        this.updateDataToUI("value", logicObj.id, () => {
            //--todo
        }) */
    }

    // use this for initialization
    onLoad() {
        this.nodeTreeInfoLite();
        this.clearData();
    }

    onEnable() {
        this.onMsg();
    }

    onClose() {

    }

    onDisable() {
        this.offMsg();
        this.offMsgAuto();
    }

    onMsg(){

    }
    offMsg(){
        
    }
    onAuto(event: string, listener: ListenerFunc, target: any) {
        this.on(event, listener, target);        
        this.onAutoEventMap.set(event, { event, listener, target });
    }
    
    protected offMsgAuto(){
        this.onAutoEventMap.forEach((item) => {
            this.off(item.event, item.listener);
        });
        this.onAutoEventMap.clear();
    }

    onDestroy() {

    } 

    getResUrl(res_url:string){
        return this._baseUrl + res_url;
    }

    /**
     * 会拼接this._baseUrl + res_url
     * @param spt 
     * @param res_url 
     * @param cb 
     */
    loadSpt(spt: Sprite | Node, res_url: string = null, cb?: Function) {
        this.loadSptEx(spt,this.getResUrl(res_url),cb);
    };

    loadSptEmpty(spt: Sprite | Node) {
        this.loadSptEx(spt,null);
    };
    
    /**
     * 不拼接res_url
     * @param _spt 
     * @param res_url 
     * @param cb 
     * @returns 
     */
    loadSptEx(_spt:Sprite | Node, res_url: string = null, cb?: Function) {
        if (!isValid(_spt)) return;
        let spt = _spt instanceof Node ? _spt.getComponent(Sprite) : _spt;

        if(empty(res_url)){
            spt.spriteFrame = null;
            if (!!cb) cb( null );
            return;
        }
        let node = spt.node as NodeEx;
        node.loadIndex = node.loadIndex || UUID.ID_AUTO;
        let loadIndex = node.loadIndex;
        this.load(res_url + "/spriteFrame", SpriteFrame, function (err, spriteFrame) {
            if (!err && spt && spt.isValid) {
                if(node.loadIndex == loadIndex){
                    spt.spriteFrame = spriteFrame;                    
                }else{
                    Debug.log("loadIndex is not equal",res_url,spt)
                }      
                if (!!cb) cb( spt.spriteFrame );             
            }else{
                Debug.log(js.formatStr("loadSptEx error,error->%s spt->%s", err,spt));
            }
        });
    };

    getPrefabUrl(prefab_url:string){
        return this._prefabUrl + prefab_url;
    }
    
    loadPrefab(pb_url:string, cb?:Function){        
        this.loadPrefabEx(this.getPrefabUrl(pb_url),cb);
    }

    loadPrefabEx(pb_url:string, cb?:Function){        
        this.load(pb_url, Prefab, function (err: any, prefab: any) {
            if (err) {
                Debug.warn(pb_url, err);
            }else{
                let node = instantiate(prefab);
                if(!!cb) cb(node);
            }
        })
    }

    updateDataToUI(key: string, data: any, cb: Function,ecb?:Function) {
        let dataKey = this.getDataKey(key)
        let dataUnique = this.getDataUnique(data)
        if (this._bindData[dataKey] != dataUnique) {
            if (!!cb) {
                cb(data);
            }
        }else{
            if (!!ecb) {
                ecb();
            }
        }
        this._bindData[dataKey] = dataUnique;
    }

    getDataUnique(data: any) {
        if (typeof (data) == "object") {
            return JSON.stringify(data)
        } else {
            return data;
        }
    }

    clearData(){
        this._bindData = {};
    }

    getDataKey(key:string){
        return key;      
    }

    taskDelayOnceTime(cb:Function,delay:number,key:string){
        App.taskDelayOnceTime(() => {
            this.isValid && cb();
        },delay,key)
    }

    update(dt:number){
        if(!EDITOR){
            //不希望自动updateUI 就重写update
            this.updateUI();
        }        
    }

    onClickClose(){
        this.close();
    }

    close(){
        let comp = this.node.getComponent(DelegateComponent);
        if(comp && comp.vp){
            oops.gui.removeByNode(this.node);
        }else{
            //
            console.log("需要实现自己的关闭方式");
        }        
    }

    destory(){
        let pool = App.poolMgr.getPool(this._pb_tag);
        if(pool){
            pool.recycleItem(this.node);
        }else{
            if(this.node.parent){
                this.node.destroy();
            }            
        }        
    }
}
