
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator, ScrollView, Label } from 'cc';
import { RewardProxy }  from "./RewardProxy";
import {Item} from "../../logic/Item";
import { getPackageProxy } from "../package/PackageProxy";
import { getTimeProxy } from "../time/TimeProxy";
import { empty, lang } from "../../Global";
import { toolKit } from "../../utils/ToolKit";
const {ccclass, property} = _decorator;

@ccclass("IdleRewardView")
export class IdleRewardView extends BaseView {
    moduleName = "reward"
    proxy:RewardProxy;

    @property(ScrollView)
    sv_itemListRoot:ScrollView;
    @property(Label)
    lb_desc:Label;

    itemList:any[] = [];

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
    }

    setData() {            //预加载就调用
        var settleCount = getPackageProxy().settleIdleTime();
        if(settleCount == 0 && !empty(this.itemList)){
            return;
        }
        this.itemList = [];   
        var self = this;
        var proxy = getPackageProxy();
        proxy.idleItemMap.forEach((item)=>{
            self.itemList.push(item.toData());
        })
    }

    show() {            //显示时调用     
        this.initRwdList();
    }
    
    hide() {            //隐藏后调用

    }

    updateDesc(){
        var nowTime = getTimeProxy().getTime();
        var deltaTime = nowTime - getPackageProxy().lastIdleTimeStamp;
        deltaTime = toolKit.limitNum(deltaTime,0,getPackageProxy().getIdleRwdMaxTime())
        this.lb_desc.string = lang("idle.timeDesc",App.timeMgr.getLeftTimeDHMSMM(deltaTime,3))
    }

    updateReward(){
        this.setData();
        var self = this;
        this.updateDataToUI("IdleRewardView.itemList",this.itemList,()=>{
            self.initRwdList();
        });
    }

    initRwdList(){
        var itemList = this.itemList;
        if(!itemList){
            return;
        }
        var self = this;
        self.sv_itemListRoot.content.removeAllChildren();
        itemList.forEach(itemData => {
            var item = new Item(itemData.id,itemData.count);
            item.initUI(self.sv_itemListRoot.content);
        })
    }

    onClickComfirm(){     
        if(!empty(this.itemList)){
            getPackageProxy().getIdleRwd();
            this.proxy.cmd.addRwdList(this.itemList);
            this.command("float");
        }          
        this.close();
    }

    update(){
        this.updateDesc();
        this.updateReward();
    }
}