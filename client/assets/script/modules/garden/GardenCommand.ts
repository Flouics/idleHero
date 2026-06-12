

import { Node } from "cc";
import {App} from "../../App";
import { lang } from "../../Global";
import { UICallbacks } from "../../oops/core/gui/layer/Defines";
import { toolKit } from "../../utils/ToolKit";
import {Command} from "../base/Command"
import { ITEM_ID_ENUM } from "../package/ItemEnum";
import { getPackageProxy } from "../package/PackageProxy";
import { RewardCommand } from "../reward/RewardCommand";
import { GardenEvent } from "./GardenEvent";
import { UIID_Garden } from "./GardenInit";
import { GardenProxy }  from "./GardenProxy";

export class GardenCommand extends Command{
    proxy:GardenProxy;
    constructor(){
        super();
        GardenCommand._instance = this;
    }

    static get instance ():GardenCommand{
        return App.getInstance(GardenCommand);
    }

    showPlantChooseView(landId:number){
        this.showView(UIID_Garden.GardenPlantChooseView,{landId:landId});
    }

    showPlantWaterView(landId:number,target:Node){
        this.showView(UIID_Garden.GardenPlantWaterView,{landId:landId,target:target});
    }

    showPlantTakeCareView(landId:number){
        this.showView(UIID_Garden.GardenPlantTakeCareView,{landId:landId});
    }

    plant(landId:number, plantId:number){
        let conf = App.dataMgr.findById("gardenPlant", plantId);
        if(!conf){
            return;
        }
        if(!getPackageProxy().reduceItemById(conf.needItem,1)){
            toolKit.showTip(lang("common.notEnoughItem"))
            return
        }
        this.proxy.plant(landId, plantId);        
    }

    water(landId:number){
        let data = this.proxy.getPlant(landId);
        if(!data){
            return;
        }
        if(!getPackageProxy().reduceItemById(ITEM_ID_ENUM.STAMINA,1)){
            toolKit.showTip(lang("stage.noEnoughStamina"))
            return
        }
        this.proxy.water(landId);        
    }
    

    harvest(landId:number){
        let data = this.proxy.getPlant(landId);
        if(!data){
            return;
        }
        let conf = App.dataMgr.findById("gardenPlant", data.plantId);
        let pruductList = conf.productList;
        this.proxy.harvest(landId);

        //奖励
        getPackageProxy().addItemList(pruductList);
        RewardCommand.instance.addRwdList(pruductList);
        RewardCommand.instance.float();
    }
}
