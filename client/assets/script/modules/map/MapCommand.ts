
import {Command} from "../base/Command"
import { MapProxy }  from "./MapProxy";
import { Block, BLOCK_VALUE_ENUM} from "../../logic/Block";
import {TaskBase} from "../../logic/TaskBase";
import { toolKit } from "../../utils/ToolKit";
import { nullfun } from "../../Global";
import { UIID_Map } from "./MapInit";
import { Vec2 } from "cc";

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

    buildTower(params:{tilePos?:Vec2,block?:Block}){
        var tilePos = params?.tilePos;
        var block = params.block || this.proxy.getBlock(tilePos.x,tilePos.y)
        tilePos = tilePos || block.tilePos;
        //todo 修改炮塔
        if(block && block.checkType(BLOCK_VALUE_ENUM.EMPTY)){
            //todo tower
            var towerType = 1001;
            this.proxy.towerMgr.create(tilePos.x,tilePos.y,towerType)
            block.id = BLOCK_VALUE_ENUM.BUILDING;
            this.proxy.updateView("buildTower", params);
        }    
    }

    buildMine(params:{tilePos?:Vec2,block?:Block}){
        var tilePos = params!.tilePos;
        var block = params.block || this.proxy.getBlock(tilePos.x,tilePos.y)
        tilePos = tilePos || block.tilePos;
        if(block && block.checkType(BLOCK_VALUE_ENUM.EMPTY)){
            let mine = this.proxy.mineMgr.create(tilePos.x,tilePos.y,block.data_1);
            !this.proxy.mineMap[tilePos.x] && (this.proxy.mineMap[tilePos.x] = {});
            this.proxy.mineMap[tilePos.x][tilePos.y] = mine;
        }
    }

    showWinView(stageId:number){
        this.showView(UIID_Map.WinView,stageId);
        this.proxy.updateView("stopBattle");
    }

    showFailView(){
        this.showView(UIID_Map.FailView);
        this.proxy.updateView("stopBattle");
        
    }
    
    reloadMapView(){
        this.proxy.updateView("reloadMapView");
    }
}
