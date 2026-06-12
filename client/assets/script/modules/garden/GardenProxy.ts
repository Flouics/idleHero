
import { Proxy }from "../base/Proxy";
import {GardenCommand} from "./GardenCommand";
import { serialize } from "../../utils/Decorator";
import { App } from "../../App";
import { GardenEvent } from "./GardenEvent";
import { getPackageProxy } from "../package/PackageProxy";
import { toolKit } from "../../utils/ToolKit";

export enum GardenPlantState {
    Empty = 0, //空地
    /** 种植 */
    Planting = 1,
    /** 成长中 */
    Growing = 2,
    /** 已成熟 */
    Mature = 3
}

export class GardenProxy extends Proxy {
    cmd:GardenCommand;
    _className = "GardenProxy";       //防止js被压缩后的问题。

    @serialize()
    plantMap:{[key:number]:{
                landId:number
                ,plantId:number
                ,plantTime:number
                ,harvestTime:number
                ,waterCount:number      //可浇水次数
                ,feedCount:number       //可施肥次数
                ,harvestCount:number    //可收获次数
            }} = {};  //key为土地id，value为种植的植物id和种植时间

    constructor(){       
        super();
        GardenProxy._instance = this;
    }

    static get instance ():GardenProxy{
        return App.getInstance(GardenProxy);
    }

    getPlant(landId:number){
        return this.plantMap[landId];
    }

    plant(landId:number, plantId:number){
        let conf = App.dataMgr.findById("gardenPlant", plantId);
        if(!conf){
            return;
        }

        let now = App.timeMgr.getTime();
        let data = {
            landId:landId
            ,plantId:plantId
            ,plantTime:now
            ,harvestTime:now + conf.growTime* 1000
            ,waterCount:1
            ,feedCount:1
            ,harvestCount: conf.harvestCount
        };
        this.plantMap[landId] = data;
        this.dispatchEvent(GardenEvent.Garden_Plant, {landId:landId, plantId:plantId});
        this.dumpToDb(false,0);
    }

    water(landId:number){
        let data = this.getPlant(landId);
        if(!data){
            return;
        }
        if(data.waterCount > 0){
            data.waterCount--;
            //todo 浇水什么效果，浇水减少600秒？
            data.harvestTime += -600 * 1000; 
            this.dispatchEvent(GardenEvent.Garden_PlantWater,{landId:landId});
        }
        this.dumpToDb(false,0);
    }

    harvest(landId:number){
        let data = this.getPlant(landId);
        if(!data){
            return;
        }
        let conf = App.dataMgr.findById("gardenPlant",data.plantId);
        if(!conf){
            return;
        }
        
        if (data.harvestCount > 1){
            let now = App.timeMgr.getTime();
            data.harvestCount--; 
            //data.waterCount = 1;
            //data.feedCount = 1;
            data.harvestTime = now + conf.growTime * 1000;
        }else{
            delete this.plantMap[landId];
        }
        this.dispatchEvent(GardenEvent.Garden_PlantHarvest, {landId:landId});
        this.dumpToDb(false,0);
    }

    dumpPrepare(){
        //导出数据的预处理 *写入本地之前调用*
    }

    reloadPrepare(){
        //加载数据的预处理 *读取本地之后调用*
        for (const key in this.plantMap) {
            const element = this.plantMap[key];
            let conf = App.dataMgr.findById("gardenPlant", element.plantId);
            if(!conf)continue;
            element.harvestTime =  element.plantTime + conf.growTime * 1000; //重新结算收货时间 当配置修改的时候，时间可以马上生效
        }
    }
};

export function getGardenProxy(): GardenProxy {
    return GardenProxy.instance;
}