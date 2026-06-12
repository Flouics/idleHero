
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator, js, Label, ProgressBar, RichText, ScrollView, Sprite, TERRAIN_HEIGHT_BASE } from 'cc';
import { PlayerProxy }  from "./PlayerProxy";
import { getPackageProxy } from "../package/PackageProxy";
import { toolKit } from "../../utils/ToolKit";
import { empty } from "../../Global";
import { PlayerEvent } from "./PlayerEvent";
import { PackageEvent } from "../package/PackageEvent";
import { ITEM_ID_ENUM } from "../package/ItemEnum";
const {ccclass, property} = _decorator;

@ccclass("PlayerTopInfoView")
export class PlayerTopInfoView extends BaseView {
    moduleName = "player"
    proxy:PlayerProxy;
    
    @property(Label)
    lb_name:Label;
    @property(Label)
    lb_exp:Label;
    @property(Label)
    lb_level:Label;
    @property(ProgressBar)
    pgb_expProgress:ProgressBar;


    packageItemIdList:number[] = [];

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
    }

    setData() {            //预加载就调用

    }
    

    onMsg(): void {
        this.on(PlayerEvent.Player_UpdatePlayerInfo, this.updatePlayerInfo, this);
        this.on(PackageEvent.Package_UpdatePackageInfo, this.updatePackageInfo, this);
    }

    offMsg(): void {
        this.off(PlayerEvent.Player_UpdatePlayerInfo, this.updatePlayerInfo);
        this.off(PackageEvent.Package_UpdatePackageInfo, this.updatePackageInfo);
    }

    show() {            //显示时调用
        this.updatePlayerInfo();
        this.updatePackageInfo();
    }
    
    hide() {            //隐藏后调用

    }

    updatePlayerInfo(){
        var levelConf = this.proxy.getLevelData();
        if(!levelConf){
            return;
        }
        var percent = levelConf.exp == 0 ? 1 : toolKit.limitNum(this.proxy.exp / levelConf.exp,0,1);
        this.lb_name.string = this.proxy.name;
        this.lb_level.string = this.proxy.level.toString();
        this.pgb_expProgress.progress = percent;
        this.lb_exp.string = this.proxy.getExpPercent() + "%";     
    }

    updatePackageInfo(){
        var packageProxy = getPackageProxy();      
        this.packageItemIdList.forEach((value,index) => {
            var root = toolKit.getChild(this.node,"res_" + index);
            if(root){
                var lb_cost = toolKit.getChild(root,"lb_cost").getComponent(Label);
                var itemVo = packageProxy.getItemById(value);
                lb_cost.string = toolKit.parseNum(itemVo.count);
            }
        })
    }

    setPackageItemIdList(itemIdList:number[]){
        if(empty(itemIdList)){
            itemIdList = [ITEM_ID_ENUM.GOLD,ITEM_ID_ENUM.COIN,ITEM_ID_ENUM.STAMINA,ITEM_ID_ENUM.DIAMOND];
        }
        this.packageItemIdList = itemIdList;
        var startIndex = this.packageItemIdList.length;        
        for (let i = startIndex; i < 4; i++) {            
            var root = toolKit.getChild(this.node,"res_" + i);
            if(root){
                root.active = false;
            }
        }
        this.packageItemIdList.forEach((value,index) => {
            var root = toolKit.getChild(this.node,"res_" + index);
            if(root){
                var spt_icon = toolKit.getChild(root,"spt_icon").getComponent(Sprite);
                this.loadSptEx(spt_icon,"texture/package/item/small/" + value)
            }
        })
        this.show();
    }

    setPackageItemIdList_common(){
        var itemIdList = [ITEM_ID_ENUM.STAMINA,ITEM_ID_ENUM.COIN,ITEM_ID_ENUM.DIAMOND];
        this.setPackageItemIdList(itemIdList);
    }

    setPackageItemIdList_battle(){
        var itemIdList = [ITEM_ID_ENUM.GOLD,ITEM_ID_ENUM.COIN,ITEM_ID_ENUM.STAMINA];
        this.setPackageItemIdList(itemIdList);
    }
}
