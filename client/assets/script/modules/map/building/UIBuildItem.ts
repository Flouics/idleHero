import {App} from "../../../App";
import { toolKit } from "../../../utils/ToolKit";
import {BaseUI} from "../../../zero/BaseUI";
import { LogicUI } from "../../../zero/LogicUI";
import {UIBuilding} from "../UIBuilding";

import { _decorator, Color, Node, NodeEventType, ProgressBar, Sprite, tween, Tween} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("UIBuildItem")
export class UIBuildItem extends LogicUI {
    _baseUrl = "texture/map/";
    
    @property(Sprite)
    spt_build:Sprite;
    
    onClickBtn(){
        this.dispatchEvent("UIBuildItem.onClickBtn")
    }

    updateUI(){
        var logicObj = this._logicObj
        if(!logicObj){
            return;
        }
        this.updateDataToUI("buildItem.id",logicObj.id,()=>{
            this.loadSpt(this.spt_build,"building/building_" + logicObj.id);
        });
    }
}
