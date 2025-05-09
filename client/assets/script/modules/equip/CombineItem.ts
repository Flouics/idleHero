
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator, Label, Node, Sprite } from 'cc';
import { Equip } from "./Equip";
import { EquipProxy, getEquipProxy } from "./EquipProxy";
import { EquipItem } from "./EquipItem";
import { BaseUI } from "../../zero/BaseUI";

const {ccclass, property} = _decorator;

@ccclass("CombineItem")
export class CombineItem extends BaseUI {

    @property(Node)
    nd_resRoot:Node = null;
    @property(Node)
    nd_resultRoot:Node = null;

    onLoad(): void {
        super.onLoad();
    }

    init() {            //预加载就调用
        
    }

    show() {            //显示时调用

    }
        
    hide() {            //隐藏后调用

    }

    setData(list:Array<number>){
        let idx = list[0];
        let proxy = getEquipProxy();
        list.forEach((resIdx) => {
            let resEquip = proxy.getEquipByIdx(resIdx);
            this.addEquipItem(this.nd_resRoot,resEquip);
        })
        let equip = proxy.getEquipByIdx(idx);
        equip = new Equip(equip.id,equip.idx);
        equip.id++;
        this.addEquipItem(this.nd_resultRoot,equip);
    }

    addEquipItem(root:Node,data:any){
        this.loadPrefabEx("prefab/equip/items/EquipItem",(node:Node) => {
            root.addChild(node);
            node.getComponent(EquipItem)?.setItem(data);               
        });
    }
}