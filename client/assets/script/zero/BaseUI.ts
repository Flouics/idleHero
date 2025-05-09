
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
const {ccclass, property} = _decorator;

@ccclass("BaseUI")
export class BaseUI extends GameComponent {
    _bindData: { [key: string]: any } = {};
    _baseUrl: string = "";
    _prefabUrl: string = "";
    _logicObj: ItemBase = null;
    _pb_tag:string = ""; 

    getId(){        
        return this.uuid
    }

    bindBox(box: ItemBase) {
        if(this._logicObj == box){
            return;
        }
        this._logicObj = box;
        this._bindData = {};
        this._pb_tag = box._pb_tag;
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
        if (this._logicObj){
            this._logicObj.onLoad(this)
        }
    }

    onEnable() {
        if (this._logicObj){
            this._logicObj.onEnable(this)
        }
    }

    onClose() {
        if (this._logicObj){
            this._logicObj.onClose(this)
        }
    }

    onDisable() {
        if (this._logicObj){
            this._logicObj.onDisable(this)
        }
    }

    onDestroy() {
        if (this._logicObj){
            this._logicObj.onDestroy(this)
        }
    } 

    getResUrl(res_url:string){
        return this._baseUrl + res_url;
    }

    loadSpt(spt: Sprite | Node, res_url: string = null, cb?: Function) {
        this.loadSptEx(spt,this.getResUrl(res_url),cb);
    };

    loadSptEmpty(spt: Sprite | Node) {
        this.loadSptEx(spt,null);
    };
    
    loadSptEx(_spt:Sprite | Node, res_url: string = null, cb?: Function) {
        if (!isValid(_spt)) return;
        let spt = _spt instanceof Node ? _spt.getComponent(Sprite) : _spt;
         let node = spt.node as NodeEx;
        node.loadIndex = node.loadIndex || UUID.ID_AUTO;
        let loadIndex = node.loadIndex;
        if(empty(res_url)){
            spt.spriteFrame = null;
            if (!!cb) cb( null );
            return;
        }
        resources.load(res_url + "/spriteFrame", SpriteFrame, function (err, spriteFrame) {
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
        resources.load(pb_url, Prefab, function (err: any, prefab: any) {
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
        if(!this._logicObj){
            return key
        }else{
            return this._logicObj.getClassName() + "." + key
        }        
    }

    taskDelayOnceTime(cb:Function,delay:number,key:string){
        App.taskDelayOnceTime(() => {
            this.isValid && cb();
        },delay,key)
    }

    update(dt:number){
        if(!EDITOR){
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
                this.node.removeFromParent();
            }            
        }        
    }
}
