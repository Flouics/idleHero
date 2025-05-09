
import {App} from "../../App";
import { BaseUI } from "../../zero/BaseUI";

import { _decorator, Label, Node, Sprite } from 'cc';

const {ccclass, property} = _decorator;

@ccclass("EquipItem")
export class EquipItem extends BaseUI {

    data:any = null;

    @property(Sprite)
    spt_role:Sprite;
    @property(Label)
    lb_name:Label;
    @property(Node)
    nd_select:Node;

    onLoad(): void {
        super.onLoad();
    }

    init() {            //预加载就调用
        
    }

    show() {            //显示时调用

    }
        
    hide() {            //隐藏后调用

    }

    setItem(data:any,isSelected:boolean = false){
        this.data = data;
        this.updateDataToUI("equip.id",data.id,()=>{
            this.loadSptEx(this.spt_role,"texture/equip/"  + data.id);
        })

        this.updateDataToUI("equip.name",data.name,()=>{
            this.lb_name.string = data.name;
        })

        this.setSelected(isSelected);
    }

    setSelected(isSelected:boolean = false){
        this.nd_select.active = isSelected;
    }

    updateUI() {
        let data = this.data;
        if(!data){
            return;
        }
        this.updateDataToUI("equip.id",data.id,()=>{
            this.loadSptEx(this.spt_role,"texture/equip/"  + data.id);
        })

        this.updateDataToUI("equip.name",data.name,()=>{
            this.lb_name.string = data.name;
        })
    }
}