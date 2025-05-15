
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator } from 'cc';
import { EquipProxy }  from "./EquipProxy";
const {ccclass, property} = _decorator;

@ccclass("EquipView")
export class EquipView extends BaseView {
    moduleName = "equip"
    proxy:EquipProxy;
    bgMusicName:string = ""
    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
    }

    setData() {            
       if(this.hasInit == true) {
            return;
       }
       this.hasInit = true;
    }
}