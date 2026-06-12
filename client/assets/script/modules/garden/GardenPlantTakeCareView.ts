
import {App} from "../../App";

import { Node,_decorator } from 'cc';
import { GardenPlantState, GardenProxy, getGardenProxy }  from "./GardenProxy";
import { BaseView } from "../../zero/BaseView";
import { instantiate } from "cc";
import { Label } from "cc";
import { GardenEvent } from "./GardenEvent";
import { GardenCommand } from "./GardenCommand";
import { lang } from "../../Global";
import { getTimeProxy } from "../time/TimeProxy";
import { RichText } from "cc";
const {ccclass, property} = _decorator;

@ccclass("GardenPlantTakeCareView")
export class GardenPlantTakeCareView extends BaseView {
    moduleName = "garden";
    proxy:GardenProxy;  
    @property(Node)
    nd_operate:Node = null;
    
    landId:number = 0;
    plantId:number = 0;

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
        this.landId = this.params?.landId;  
        let data = getGardenProxy().getPlant(this.landId);
        this.plantId = data?.plantId || 0;
        this.initView();
    }

    initView(){
        this.updateTipInfo();
    }

    updateTipInfo(){
        this.updateColdTime();
        let conf = App.dataMgr.findById("gardenPlant",this.plantId);
        let data = getGardenProxy().getPlant(this.landId);
        if(!conf || !data){
            return;
        }
        let growState = 3;
        this.loadSptEx(this.getNode("spt_plant"),`plant/garden_plant_${this.plantId}_${growState}`);
        this.getNode("lb_plantName").getComponent(Label).string = conf.name;
        this.getNode("rt_leftCount").getComponent(RichText).string = lang("garden.tip2",data.harvestCount);
    }

    update(dt: number): void {
        super.update(dt);
        this.updateColdTime();
    }

    updateColdTime(){
        let data = getGardenProxy().getPlant(this.landId);
        if(!data){
            return;
        }
        let coldTime = data.harvestTime - Date.now();
        let rt_coldTime = this.getNode("rt_coldTime").getComponent(RichText);
        
        rt_coldTime.string = lang("garden.tip1",getTimeProxy().formatLeftSec(Math.floor(coldTime/1000)));
    }

    onDisable(): void {
        super.onDisable();
        this.dispatchEvent(GardenEvent.Garden_LandItemSelect,{landId:0});
    }

}