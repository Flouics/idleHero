
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator } from 'cc';
import { GardenProxy }  from "./GardenProxy";
import { TouchUtils, TouchUtilsEvent } from "../../utils/TouchUtils";
import { EventTouch } from "cc";
import { Debug } from "../../utils/Debug";
import { GardenAreaLand } from "./GardenAreaLand";
import { Size } from "cc";
const {ccclass, property} = _decorator;

@ccclass("GardenView")
export class GardenView extends BaseView {
    moduleName = "garden";
    proxy:GardenProxy;
    bgMusicName:string = ""
    landCount = 4;
    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
        this.initView();
    }

    initView(){
        this.getNode("nd_content").on(TouchUtilsEvent.click, this.onMapClick.bind(this));
        this.initAllLands();
        this.getNode("nd_content").getComponent(TouchUtils)?.setData(new Size(2048, 2048));
    }

    onMapClick(event: EventTouch){
        let pos = event.getLocation();
        Debug.log("GardenViewonMapClick click pos", pos);
    }

    initAllLands(){
        let count = this.landCount;
        for(let i = 1; i <= count; i++) {
            this.initLand(i);
        }
    }

    initLand(id:number){
        let land = this.getNode(`nd_areaLand_${id}`);
        if(!land) return;
        land.active = true;
        land.getComponent(GardenAreaLand)?.setData(id);
    }

    updateGardenInfo(){
        let count = this.landCount;
        for(let i = 1; i <= count; i++) {
            let land = this.getNode(`nd_areaLand_${i}`);
            if(!land) continue;
             land.getComponent(GardenAreaLand)?.updateLand();
        }
    }
}