
import { MapProxy }  from "./MapProxy";
import {BaseView} from "../../zero/BaseView";
import {App} from "../../App";
import {BaseUI} from "../../zero/BaseUI";
import {TouchUtils} from "../../utils/TouchUtils";

import { _decorator} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("MineView")
export class MineView extends BaseView {
    mapProxy:MapProxy = null;
    mineId:number = 0; //矿山id
    mineData = {};  // 矿山数据
    moduleName = "map";
    
    onLoad(){
        super.onLoad()
        this.mapProxy = this.proxy as MapProxy;
    }
    initData(id:number): void {
       this.mineId = id; 
    }
}
