
import {Command} from "../base/Command"
import { MapProxy }  from "./MapProxy";
import { Block, BLOCK_VALUE_ENUM} from "../../logic/Block";
import {TaskBase} from "../../logic/TaskBase";
import { toolKit } from "../../utils/ToolKit";
import { nullfun } from "../../Global";
import { UIID_Map } from "./MapInit";
import { Vec2 } from "cc";
import { TowerMgr } from "../../manager/battle/TowerMgr";

export class MapCommand extends Command{
    proxy:MapProxy;
    moduleName:String = "map";

    pushTask(task:TaskBase){
        this.proxy.pushTask(task)
    }

    digBlock(params:{tilePos?:Vec2,block?:Block}){
        var tilePos = params?.tilePos;
        var block = params.block || this.proxy.getBlock(tilePos.x,tilePos.y);  
        tilePos = tilePos || block.tilePos;
        if(block && block.checkType(BLOCK_VALUE_ENUM.BLOCK)){
            block.onDig()
            this.proxy.updateView("digBlock", params);
        }        
    }

    showWinView(stageId:number){
        this.showView(UIID_Map.WinView,{stageId:stageId});
        this.proxy.updateView("stopBattle");
    }

    showFailView(stageId:number,waveIndex:number = 0){
        this.showView(UIID_Map.FailView,{stageId:stageId,waveIndex:waveIndex});
        this.proxy.updateView("stopBattle");
        
    }
    
    reloadMapView(){
        this.proxy.updateView("reloadMapView");
    }
}
