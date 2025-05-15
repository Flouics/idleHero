
import { MapProxy }  from "./MapProxy";
import {BaseView} from "../../zero/BaseView";

import { _decorator, ScrollView} from 'cc';
import {App} from "../../App";
import { getPackageProxy } from "../package/PackageProxy";
import {Item} from "../../logic/Item";
import { getRewardProxy } from "../reward/RewardProxy";
import { getPlayerProxy } from "../player/PlayerProxy";
import { toolKit } from "../../utils/ToolKit";
import { clone } from "../../Global";
import { DEBUG } from "cc/env";
const {ccclass, property} = _decorator;

@ccclass("WinView")
export class WinView extends BaseView {
    mapProxy:MapProxy = null;
    moduleName = "map";
    stageId:number = 0;

    @property(ScrollView)
    sv_rwdListRoot:ScrollView;

    data:any;
    
    onLoad(){
        super.onLoad()
        this.mapProxy = this.proxy as MapProxy;
        DEBUG && (window["winView"] = this);
    }

    show(params:any): void {        
        this.stageId = params.stageId;
        this.initData();
    }

    initData(){
        var data = App.dataMgr.findById("stage",this.stageId);
        if(!data){
            return;
        }
        this.data = data;        
        var rwdList = clone(data.rwdList);
        var randomRwd = toolKit.getRandFromArray(data.randomRwdList);
        rwdList.push(randomRwd)

        getPackageProxy().cmd.addRwdList(rwdList);
        getRewardProxy().cmd.addRwdList(rwdList);
        rwdList.forEach(itemData=>{
            var item = new Item(itemData.id,itemData.count);
            item.initUI(this.sv_rwdListRoot.content)
        })   
    }

    onClickComfirm(){
        this.mapProxy.updateView("exitBattle");
        getRewardProxy().cmd.float();

        var data = this.data;
        if(data && data.exp && data.exp > 0){
            getPlayerProxy().addExp(data.exp);
        }

        getPlayerProxy().passStage(this.stageId);

        this.close();
    }
}
