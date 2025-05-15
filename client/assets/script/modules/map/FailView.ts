
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
import { toolKit } from "../../utils/ToolKit";
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

    parseRwd(rwd:{id:number,count:number},percent:number){
        if(!rwd){
            return null;
        }
        let ret = {id:rwd.id,count:0};
        for (let i = 0; i < rwd.count; i++) {
            if (toolKit.getRand(1,100) <= percent){
                ret.count++;
            }
        }
        return ret.count > 0 ? ret : null;
    }

    initData(){
        var data = App.dataMgr.findById("stage",this.stageId);
        if(!data){
            return;
        }
        let waveCount = data.waveList.length;
        let percent = this.waveIndex * 100 / waveCount;
        this.data = data;
        var rwdList = [];
        data.rwdList.forEach((rwd) => {
            let ret = this.parseRwd(rwd,percent);
            ret && rwdList.push(ret);
        })

        var randomRwd = toolKit.getRandFromArray(data.randomRwdList) as any;
        let ret = this.parseRwd(randomRwd,percent);
        ret && rwdList.push(ret);        
        
        getPackageProxy().cmd.addRwdList(rwdList);
        getRewardProxy().cmd.addRwdList(rwdList);
        rwdList.forEach(itemData=>{
            var item = new Item(itemData.id,itemData.count);
            item.initUI(this.sv_rwdListRoot.content)
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
