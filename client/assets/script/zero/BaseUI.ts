
import { EDITOR } from "cc/env";

import { _decorator,resources,Sprite,SpriteFrame,Component, js, Prefab, instantiate } from 'cc';
import {CCEvent} from "./CCEvent";
import { Debug }   from "../utils/Debug";
import { ItemBase } from "../logic/ItemBase";
import {App} from "../App";
import { GameComponent } from "../../../extensions/oops-plugin-framework/assets/module/common/GameComponent";
const {ccclass, property} = _decorator;

@ccclass("BaseUI")
export class BaseUI extends GameComponent {
    _bindData: { [key: string]: any } = {};
    _baseUrl: string = "";
    _prefabUrl: string = "";
    _logicObj: ItemBase = null;
    _pb_tag:string = ""; 
    active:boolean = false;

    @property({
        tooltip: '切换场景的时候是否直接destroy'
    })
    is_destroy: boolean = true;    

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
        this.clearData();
        if (this._logicObj){
            this._logicObj.onLoad(this)
        }
    }

    onEnable() {
        if (this._logicObj){
            this._logicObj.onEnable(this)
        }
        this.active = true;
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
        this.active = false;
    }

    onDestroy() {
        if (this._logicObj){
            this._logicObj.onDestroy(this)
        }
    } 

    getResUrl(res_url:string){
        return this._baseUrl + res_url;
    }

    loadSpt(spt: Sprite, res_url: string = null, cb?: Function) {
        this.loadSptEx(spt,this.getResUrl(res_url),cb);
    };
    
    loadSptEx(spt: Sprite, res_url: string = null, cb?: Function) {
        if (!res_url) return;
        spt.node.active = false;
        resources.load(res_url + "/spriteFrame", SpriteFrame, function (err, spriteFrame) {
            if (!err && spt && spt.node) {
                spt.spriteFrame = spriteFrame;
                spt.node.active = true;
                if (!!cb) cb( spriteFrame);
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

    update(dt:number){
        if(!EDITOR){
            this.updateUI();
        }        
    }

    close(){

    }

    //CC 引擎的事件派发
    dispatchEvent(key:string,detail:any = this._logicObj){
        this.node.dispatchEvent(new CCEvent(key,true,detail));
    }

    regClickEvent(key:string,callback?:Function){
        this.node.on(key,(event:CCEvent)=>{
            event.propagationStopped = true;
            if (callback) callback(event);          
        });
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
