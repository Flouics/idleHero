import {BaseUI} from "../../zero/BaseUI";

import { _decorator, Sprite, Label} from 'cc';
import {Item} from "../../logic/Item";
import { UIOpacity } from "cc";
import { v3 } from "cc";
const {ccclass, property} = _decorator;

@ccclass("UIItem")
export class UIItem extends BaseUI {
    @property(Sprite)
    spt_item:Sprite = null;
    @property(Label)
    lb_count:Label;

    _baseUrl = "texture/package/";
    _logicObj:Item = null;
    close(){
        
    }
    reuse(){
        this.node.setPosition(0,0,0);
        this.node.getComponent(UIOpacity).opacity = 255;
        this.node.setScale(v3(1,1,1));
    }
    updateUI(){
        var logicObj = this._logicObj
        if(!logicObj){
            return;
        }
        var loadSpt = () => {
            let spt = this.spt_item;
            if(logicObj.id > 0){
                this.loadSpt(spt, "item/" + logicObj.id)
            }else{
                this.loadSptEmpty(spt);
            }   
        }
        this.updateDataToUI("item.type",logicObj.id,loadSpt)

        this.updateDataToUI("item.count",logicObj.count,()=>{
            this.lb_count.string = logicObj.count > 0 ? logicObj.count.toString() : "0";
        })
    }
}
