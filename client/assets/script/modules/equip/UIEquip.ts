import {BaseUI} from "../../zero/BaseUI";

import { _decorator, Sprite, Label} from 'cc';
import {Item} from "../../logic/Item";
import { Priority } from "../../oops/libs/behavior-tree";
import { LogicUI } from "../../zero/LogicUI";
const {ccclass, property} = _decorator;

@ccclass("UIEquip")
export class UIEquip extends LogicUI {
    @property(Sprite)
    spt_icon:Sprite = null;
    @property(Label)
    lb_name:Label;

    _baseUrl = "texture/equip/";
    _logicObj:Item = null;
    close(){
        
    }
    reuse(){
        this.node.setPosition(0,0,0);
    }
    updateUI(){
        var logicObj = this._logicObj
        if(!logicObj){
            return;
        }
        var loadSpt = () => {
            let spt = this.spt_icon;
            if(logicObj.id > 0){
                this.loadSpt(spt, "equip/" + logicObj.id)
            }else{
                this.loadSptEmpty(spt);
            }   
        }
        this.updateDataToUI("equip.type",logicObj.id,loadSpt)

        this.updateDataToUI("equip.name",logicObj.name,()=>{
            this.lb_name.string = logicObj.name;
        })
    }
}
