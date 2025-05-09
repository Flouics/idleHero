
import { MapProxy }  from "./MapProxy";
import {BaseView} from "../../zero/BaseView";
import {App} from "../../App";
import {BaseUI} from "../../zero/BaseUI";
import {TouchUtils} from "../../utils/TouchUtils";

import { _decorator} from 'cc';
import { LayerDialog } from "../../oops/core/gui/layer/LayerDialog";
import { ScrollView } from "cc";
import { getPackageProxy } from "../package/PackageProxy";
import { getRewardProxy } from "../reward/RewardProxy";
import { Item } from "../../logic/Item";
const {ccclass, property} = _decorator;

@ccclass("FailView")
export class FailView extends BaseView {
    mapProxy:MapProxy = null;
    moduleName = "map";
    stageId:number = 0;
    waveIndex:number = 0;

    @property(ScrollView)
    sv_rwdListRoot:ScrollView;

    data:any;
    
    onLoad(){
        super.onLoad()
        this.mapProxy = this.proxy as MapProxy;
    }

    show(params:{stageId:number,waveIndex:number}): void {
        this.stageId = params.stageId;
        this.waveIndex = params.waveIndex;
        this.initData();
        this.mapProxy = this.proxy as MapProxy;
    }

    initData(){
        var data = App.dataMgr.findById("stage",this.stageId);
        if(!data){
            return;
        }
        let waveCount = data.waveList.length;
        let percent = this.waveIndex / waveCount;
        this.data = data;
        var self = this;
        var rwdList = [];
        data.rwdList.forEach((rwd) => {
            let count = Math.floor(rwd.count * percent);
            count > 0 && rwdList.push({id:rwd.id,count:count})
        })
        
        getPackageProxy().cmd.addRwdList(rwdList);
        getRewardProxy().cmd.addRwdList(rwdList);
        rwdList.forEach(itemData=>{
            var item = new Item(itemData.id,itemData.count);
            item.initUI(self.sv_rwdListRoot.content)
        })   
    }

    onClickComfirm(){
        this.mapProxy.updateView("exitBattle");
        this.close();
    }

    onClickAgain(){
        this.mapProxy.updateView("againBattle");
        this.close();
    }
}
