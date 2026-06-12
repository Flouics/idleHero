
import {App} from "../../App";

import { _decorator } from 'cc';
import { GardenProxy, getGardenProxy }  from "./GardenProxy";
import { BaseUI } from "../../zero/BaseUI";
import { instantiate } from "cc";
import { Node } from "cc";
import { GardenAreaLandItem } from "./GardenAreaLandItem";
import { checkObjKey, isValid } from "../../Global";
import { v3 } from "cc";
import { Vec3 } from "cc";
const {ccclass, property} = _decorator;

@ccclass("GardenAreaLand")
export class GardenAreaLand extends BaseUI {
    @property(Node)
    nd_landItem:Node = null;

    id:number = 0;
    conf:any = null;
    rowCount:number = 4; //一排多少个
    gridConfig:{width:number,height:number,offsetX:number} = null;//{width:0,height:0,offsetX:0};

    setData(id:number){        
        let conf = App.dataMgr.findById("gardenLand", id);
        if(conf == null) {
            this.node.active = false;
            return;
        }
        this.id = id;
        this.node.active = true;
        this.conf = conf;
        this.initLand();
    }

    initLand(){
        if(this.conf == null) {
            return;
        }
        let root = this.node;
        root.destroyAllChildren();
        this.updateLand();
    }

    getGridPosition(index:number):Vec3{
        let row = Math.floor(index / this.rowCount);
        let col = index % 4;
        let gridConfig = this.getGridConfig();
        let x = col * gridConfig.width;
        let y = row * gridConfig.height;
        x = x - row * gridConfig.offsetX;
        return v3(x,y,0)
    }

    getGridConfig(){
        if(this.gridConfig == null){
            this.gridConfig = {
                width:90,
                height:80,
                offsetX:0
            }
            const angle = 40;
            const radians = (angle * Math.PI) / 180;
            this.gridConfig.offsetX = this.gridConfig.height * Math.tan(radians);
        }
        return this.gridConfig;
    }

    updateLand(){
        if(this.conf == null) {
            return;
        }
        let landCount = this.conf.count;
        let root = this.node;
        let children = root.children;
        for(let i = 0; i < landCount; i++) {
            let landId = this.id * 1000 + i;
            let landItem = children[i] 
            if(!isValid(landItem)) {
                landItem = instantiate(this.nd_landItem);
                landItem.parent = root;
                landItem.getComponent(GardenAreaLandItem).initData(landId);  
                landItem.setPosition(this.getGridPosition(i));
            }            
            landItem.getComponent(GardenAreaLandItem).udpatePlant();                      
        }
    }


}