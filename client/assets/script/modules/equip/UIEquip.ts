import {BaseUI} from "../../zero/BaseUI";

import { _decorator, Sprite, Label} from 'cc';
import {Item} from "../../logic/Item";
const {ccclass, property} = _decorator;

@ccclass("UIEquip")
export class UIEquip extends BaseUI {
    @property(Sprite)
    spt_item:Sprite = null;
    @property(Label)
    lb_count:Label;

    _baseUrl = "texture/equip/";
    _logicObj:Item = null;
    close(){
        
    }
    reuse(){
        this.node.setPosition(0,0,0);
    }
    updateUI(){
        var self = this;
        var logicObj = this._logicObj
        if(!logicObj){
            return;
        }
        var loadSpt = function(){
            let spt = self.spt_item;
            if(logicObj.id > 0){
                self.loadSpt(spt, "equip/" + logicObj.id)
            }else{
                self.loadSptEmpty(spt);
            }   
        }
        this.updateDataToUI("equip.type",logicObj.id,loadSpt)

        this.updateDataToUI("equip.count",logicObj.count,()=>{
            self.lb_count.string = logicObj.count > 0 ? logicObj.count.toString() : "0";
        })
    }
}