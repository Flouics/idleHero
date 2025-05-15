
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator } from 'cc';
import { EquipProxy }  from "./EquipProxy";
import { ScrollView } from "cc";
import { Node } from "cc";
import { CombineItem } from "./CombineItem";
const {ccclass, property} = _decorator;

@ccclass("EquipCombineView")
export class EquipCombineView extends BaseView {
    moduleName = "equip"
    proxy:EquipProxy;
    combineList:Array<Array<number>>;
    @property(ScrollView)
    sv_combine:ScrollView = null;
    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
    }

    setData(combineList?:Array<Array<number>>){
        this.combineList = combineList || this.proxy.getCombineList();
        this.initCombineListView();
    }

    setData() {            
       if(this.hasInit == true) {
            return;
       }
       this.hasInit = true;
    }

    initCombineListView(){
        this.sv_combine.content.removeAllChildren();
        this.combineList.forEach((list) => {
            this.loadPrefab("items/CombineItem",(node:Node) => {
                let ui = node.getComponent(CombineItem)
                ui.setData(list);
                this.sv_combine.content.addChild(node);
            })
        })
    }
    onClickComfirm(){
        this.proxy.cmd.autoCombineAll(this.combineList);
        this.close();
    }
}