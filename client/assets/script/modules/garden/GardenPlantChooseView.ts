
import {App} from "../../App";

import { Node,_decorator } from 'cc';
import { GardenPlantState, GardenProxy, getGardenProxy }  from "./GardenProxy";
import { BaseView } from "../../zero/BaseView";
import { instantiate } from "cc";
import { Label } from "cc";
import { GardenEvent } from "./GardenEvent";
import { GardenCommand } from "./GardenCommand";
import { toolKit } from "../../utils/ToolKit";
import { app } from "electron";
import { getPackageProxy } from "../package/PackageProxy";
const {ccclass, property} = _decorator;

@ccclass("GardenPlantChooseView")
export class GardenPlantChooseView extends BaseView {
    moduleName = "garden";
    proxy:GardenProxy;  
    @property(Node)
    nd_plant:Node = null;
    
    landId:number = 0;

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
        this.landId = this.params?.landId;       
        this.initView();
    }

    initView(){
        let list = App.dataMgr.getTable("gardenPlant")?.list;
        if(!list){
            return;
        }
        let root = this.getNode("nd_plantChoose");
        root.destroyAllChildren();
        for(let i = 0; i < list.length; i++){
            let itemNode = instantiate(this.nd_plant);
            itemNode.parent = root;

            //简单处理
            let conf = list[i];
            let nd_plant = itemNode.getChildByName("spt_plant");
            let lb_name = itemNode.getChildByName("lb_name").getComponent(Label);
            let growState = GardenPlantState.Mature;
            this.loadSpt(nd_plant, `plant/garden_plant_${conf.id}_${growState}`);
            lb_name.string = conf.name;

            let count = getPackageProxy().getItemById(conf.needItem).count;
            toolKit.getChildByName(itemNode,"lb_count").getComponent(Label).string = count.toString();

            itemNode.on(Node.EventType.TOUCH_END,()=>{
                GardenCommand.instance.plant(this.landId, conf.id);
                this.close();
            })
        }
    }
    
    onDisable(): void {
        super.onDisable();
        this.dispatchEvent(GardenEvent.Garden_LandItemSelect,{landId:0});
    }

}