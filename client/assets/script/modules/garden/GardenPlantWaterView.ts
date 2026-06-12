
import {App} from "../../App";

import { Node,_decorator } from 'cc';
import { GardenPlantState, GardenProxy, getGardenProxy }  from "./GardenProxy";
import { BaseView } from "../../zero/BaseView";
import { instantiate } from "cc";
import { Label } from "cc";
import { GardenEvent } from "./GardenEvent";
import { GardenCommand } from "./GardenCommand";
import { lang, winSize } from "../../Global";
import { getTimeProxy } from "../time/TimeProxy";
import { UITransform } from "cc";
import { MathUtil } from "../../oops/core/utils/MathUtil";
const {ccclass, property} = _decorator;

@ccclass("GardenPlantWaterView")
export class GardenPlantWaterView extends BaseView {
    moduleName = "garden";
    proxy:GardenProxy;      
    landId:number = 0;

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
        this.landId = this.params?.landId;       
        this.initView();
    }

    initView(){

    }

    resetPos(){
        let target:Node = this.params?.target;
        let node = this.getNode("nd_choose");
        if(!(target && target.parent && node)){
            return;
        }
        let worldPos = target.parent.getComponent(UITransform).convertToWorldSpaceAR(target.position);        
        let nodePos = node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        let contentSize = node.getComponent(UITransform).contentSize;
        nodePos.y += contentSize.height/2 + 50;
        nodePos.x = MathUtil.clamp(nodePos.x,-(winSize.width/2 - contentSize.width/2),winSize.width/2 - contentSize.width/2);
        node.setPosition(nodePos);        
    }

    start(): void {
        this.resetPos();
    }
    
    onClickWater(){
        GardenCommand.instance.water(this.landId);
        this.close();
    }

    onDisable(): void {
        super.onDisable();
        this.dispatchEvent(GardenEvent.Garden_LandItemSelect,{landId:0});
    }

}