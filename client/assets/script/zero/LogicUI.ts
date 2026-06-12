
import { EDITOR } from "cc/env";

import { _decorator,resources,Sprite,SpriteFrame,Component, js, Prefab, instantiate } from 'cc';
import {CCEvent} from "./CCEvent";
import { Debug }   from "../utils/Debug";
import { ItemBase } from "../logic/ItemBase";
import {App} from "../App";
import { oops } from ".././oops/core/Oops";
import { DelegateComponent } from ".././oops/core/gui/layer/DelegateComponent";
import { empty, isValid, NodeEx } from "../Global";
import { UUID } from "../utils/UUID";
import { Node } from "cc";
import { ListenerFunc } from "../oops/core/common/event/EventMessage";
import { BaseUI } from "./BaseUI";
const {ccclass, property} = _decorator;

@ccclass("LogicUI")
export class LogicUI extends BaseUI {
    _logicObj: ItemBase = null; //绑定的逻辑对象 主要用于复杂的逻辑，ui和逻辑分离 基础UI用不到 需要绑定的对象需要从ItemBase继承，方便管理和扩展 

    bindBox(box: ItemBase) {
        if(this._logicObj == box){
            return;
        }
        this._logicObj = box;
        this.clearData();
        if (empty(this._pb_tag)) {
            this._pb_tag = box._pb_tag;
        }     
    }


    // use this for initialization
    onLoad() {
        super.onLoad();
        if (this._logicObj){
            this._logicObj.onLoad(this)
        }
    }

    onEnable() {
        super.onEnable();
        if (this._logicObj){
            this._logicObj.onEnable(this)
        }
    }

    onClose() {
        super.onClose();
        if (this._logicObj){
            this._logicObj.onClose(this)
        }
    }

    onDisable() {
        super.onDisable();
        if (this._logicObj){
            this._logicObj.onDisable(this)
        }
    }

    onDestroy() {
        super.onDestroy();
        if (this._logicObj){
            this._logicObj.onDestroy(this)
        }
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
}
