
import { MapProxy }  from "./MapProxy";
import {BaseView} from "../../zero/BaseView";

import { _decorator, ScrollView} from 'cc';
import {App} from "../../App";
import { getPackageProxy } from "../package/PackageProxy";
import {Item} from "../../logic/Item";
import { getRewardProxy } from "../reward/RewardProxy";
import { getPlayerProxy } from "../player/PlayerProxy";
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
        
    }

    init(stageId?:number,...args:any[]): void {
        this.mapProxy = this.proxy as MapProxy;
        this.stageId = stageId;
    }

    onEnable(): void {        
        this.initData();
    }

    initData(){
        var data = App.dataMgr.findById("stage",this.stageId);
        if(!data){
            return;
        }
        this.data = data;
        var self = this;
        var rwdList = data.rwdList;
        getPackageProxy().cmd.addRwdList(rwdList);
        getRewardProxy().cmd.addRwdList(rwdList);
        rwdList.forEach(itemData=>{
            var item = new Item(itemData.id,itemData.count);
            item.initUI(self.sv_rwdListRoot.content)
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
