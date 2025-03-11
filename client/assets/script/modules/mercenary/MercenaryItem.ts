
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator, Label, Node, Sprite } from 'cc';

const {ccclass, property} = _decorator;

@ccclass("MercenaryItem")
export class MercenaryItem extends BaseView {

    data:any = null;

    @property(Sprite)
    spt_role:Sprite;
    @property(Label)
    lb_name:Label;
    @property(Label)
    lb_level:Label;
    @property(Node)
    nd_select:Node;

    onLoad(): void {

    }
    reuse(data:any,isSelected = false){
        this.setItem(data,isSelected)
    }

    init() {            //预加载就调用
        
    }

    show() {            //显示时调用

    }
        
    hide() {            //隐藏后调用

    }

    setItem(data:any,isSelected = false){
        this.data = data;
        var self = this;
        this.updateDataToUI("role.id",data.id,()=>{
            self.loadSptEx(self.spt_role,"texture/mercenary/"  + data.id);
        })

        this.updateDataToUI("role.name",data.name,()=>{
            self.lb_name.string = data.name;
        })

        this.updateDataToUI("role.level",data.level,()=>{
            self.lb_level.string = "Lv." + data.level;
        })
        self.nd_select.active = isSelected;
    }
}