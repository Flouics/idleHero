
import {Command} from "../base/Command"
import { MapProxy }  from "./MapProxy";
import { Block, BLOCK_VALUE_ENUM} from "../../logic/Block";
import {TaskBase} from "../../logic/TaskBase";
import { UIID_Map } from "./MapInit";
import { Vec2 } from "cc";
import { MapEvent } from "./MapEvent";
import { App } from "../../App";

export class MapCommand extends Command{
    proxy:MapProxy;
    moduleName:String = "map";

    constructor(){
        super();
        MapCommand._instance = this;
    }

    static get instance ():MapCommand{
        return App.getInstance(MapCommand);
    }

    pushTask(task:TaskBase){
        this.proxy.pushTask(task)
    }

    digBlock(params:{tilePos?:Vec2,block?:Block}){
        var tilePos = params?.tilePos;
        var block = params.block || this.proxy.getBlock(tilePos.x,tilePos.y);  
        tilePos = tilePos || block.tilePos;
        if(block && block.checkType(BLOCK_VALUE_ENUM.BLOCK)){
            block.onDig()
            this.proxy.dispatchEvent(MapEvent.Map_DigBlock, params);
        }        
    }

    showWinView(stageId:number){
        this.showView(UIID_Map.WinView,{stageId:stageId});
        this.proxy.dispatchEvent(MapEvent.Map_StopBattle);
    }

    showFailView(stageId:number,waveIndex:number = 0){
        this.showView(UIID_Map.FailView,{stageId:stageId,waveIndex:waveIndex});
        this.proxy.dispatchEvent(MapEvent.Map_StopBattle);
        
    }
    
    reloadMapView(){
        this.proxy.dispatchEvent(MapEvent.Map_ReloadMapView);
    }
}
