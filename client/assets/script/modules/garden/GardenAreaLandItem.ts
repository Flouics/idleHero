
import {App} from "../../App";

import { _decorator } from 'cc';
import { GardenPlantState, GardenProxy, getGardenProxy }  from "./GardenProxy";
import { BaseUI } from "../../zero/BaseUI";
import { ListenerFunc } from "../../oops/core/common/event/EventMessage";
import { getPackageProxy } from "../package/PackageProxy";
import { RewardCommand } from "../reward/RewardCommand";
import { GardenEvent } from "./GardenEvent";
import { GardenCommand } from "./GardenCommand";
import { NodeEventType } from "cc";
const {ccclass, property} = _decorator;

@ccclass("GardenAreaLandItem")
export class GardenAreaLandItem extends BaseUI {
    landId:number = 0;
    plantId:number = 0;
    conf:any = null;
    state:GardenPlantState = GardenPlantState.Empty;
    plantTime:number = 0;
    data:any = null;

    onMsg(): void {
        this.on(GardenEvent.Garden_Plant, this.onPlant, this);
        this.on(GardenEvent.Garden_LandItemSelect,this.onPlantLandItemSelect,this);
        this.on(GardenEvent.Garden_PlantWater,this.onPlantWater,this);
        this.on(GardenEvent.Garden_PlantHarvest,this.onPlantHarvest,this);
        this.node.on(NodeEventType.TOUCH_END,this.onClickLand,this);
    }

    onPlant(param: {landId:number, plantId:number}){
        if(param?.landId != this.landId){
            return;
        }
        this.udpatePlant();
    }

    onPlantLandItemSelect(param: {landId:number}){
        this.getNode("spt_mask").active = this.landId == param?.landId;        
    }

    onPlantWater(param: {landId:number}){
        if(param?.landId != this.landId){
            return;
        }
        //todo 表现
        this.udpatePlant();
    }

    onPlantHarvest(param: {landId:number}){
        if(param?.landId != this.landId){
            return;
        }
        this.udpatePlant();
    }

    initData(id:number){
        this.landId = id;
        this._baseUrl = getGardenProxy().baseUrl;
        this.loadSptEmpty(this.getNode("spt_plant"));
        this.getNode("spt_mask").active = false;
    }

    udpatePlant(){
        let data = getGardenProxy().getPlant(this.landId);
        if(!data){
            this.plantId = 0;
            this.conf = null;
            this.data = null;
            this.updateUI();
            return;
        }
        this.plantId = data.plantId;
        this.plantTime = data.plantTime;
        this.data = data;
        let conf = App.dataMgr.findById("gardenPlant", this.plantId);
        if(conf == null){
            return;
        }        
        this.conf = conf;
        this.updateUI();
    }

    // 收获
    onHarvest(){
        let state = this.getState();
        if(state != GardenPlantState.Mature){
            return;
        }
        GardenCommand.instance.harvest(this.landId);
    }

    updateUI(): void {   
        let growState = this.getState();   
        this.updateDataToUI("plant_data", {id:this.plantId,state:growState}, () => {     
            if(this.plantId > 0){
                this.loadSpt(this.getNode("spt_plant"), `plant/garden_plant_${this.plantId}_${growState}`);
            }else{
                this.loadSptEmpty(this.getNode("spt_plant"));
            }
            
            let bg_index = this.plantId > 0 ? 2 : 1;
            this.loadSpt(this.getNode("spt_landBg"), `land/garden_land_${bg_index}`);
        });       
    }

    update(dt: number): void {
        this.updateUI();
    }

    getState(){
        if(this.conf == null){
            return GardenPlantState.Empty;
        }
        let now = App.timeMgr.getTime();
        if(this.data.harvestTime <= now){
            return GardenPlantState.Mature;
        }else{
            return GardenPlantState.Growing;
        }
    }
    
    onClickLand(event:TouchEvent){
        let state = this.getState();
        switch (state) {
            case GardenPlantState.Empty:
                GardenCommand.instance.showPlantChooseView(this.landId);
                this.dispatchEvent(GardenEvent.Garden_LandItemSelect,{landId:this.landId});
                break;
            case GardenPlantState.Growing:
                if (this.data.waterCount > 0){
                    GardenCommand.instance.showPlantWaterView(this.landId,this.node);
                }else{
                    GardenCommand.instance.showPlantTakeCareView(this.landId);
                }
                this.dispatchEvent(GardenEvent.Garden_LandItemSelect,{landId:this.landId});
                break;
            case GardenPlantState.Mature:
                this.onHarvest();
                break;
            default:
                break;
        }
    }

}