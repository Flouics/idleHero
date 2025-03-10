
import BaseCommand from "../base/Command"
import WindowMgr from "../../manager/WindowMgr"
import ModuleMgr from "../../manager/ModuleMgr"
import App from "../../App";
import { MapProxy }  from "./MapProxy";
import Block from "../../logic/Block";
import TaskBase from "../../logic/TaskBase";
import { toolKit } from "../../utils/ToolKit";
import { Augment } from "../../manager/battle/AugmentMgr";
import { nullfun } from "../../Global";

export default class MapCommand extends BaseCommand{
    proxy:MapProxy;
    moduleName:String = "map";

    pushTask(task:TaskBase){
        this.proxy.pushTask(task)
    }

    digBlock(params:any){
        var pos = params.tilePos || {}
        var block = this.proxy.getBlock(pos.x,pos.y)
        if(block && block.checkType(Block.BLOCK_VALUE_ENUM.BLOCK)){
            block.onDig()
            this.proxy.updateView("digBlock", params);
        }        
    }

    drawRandom(drawItem: Augment){
        this.proxy.augmentMgr.obtainAugment(drawItem.id);
        this.proxy.updateView("onGetDrawResult",drawItem);
        this.proxy.randomDrawMgr.onGetDrawResult(drawItem);
    }

    buildTower(params:any){
        var pos = params.tilePos || {}
        var block = this.proxy.getBlock(pos.x,pos.y)
        //todo 修改炮塔
        if(block && block.checkType(Block.BLOCK_VALUE_ENUM.EMPTY)){
            //todo tower
            var towerType = 1001;
            this.proxy.towerMgr.create(pos.x,pos.y,towerType)
            block.id = Block.BLOCK_VALUE_ENUM.BUILDING;
            this.proxy.updateView("buildTower", params);
        }    
    }

    showWinView(stageId:number){
        this.showView("winView",nullfun,null,stageId);
        this.proxy.updateView("stopBattle");
    }

    showFailView(){
        this.showView("failView");
        this.proxy.updateView("stopBattle");
        
    }
    
    reloadMapView(){
        this.proxy.updateView("reloadMapView");
    }
}
