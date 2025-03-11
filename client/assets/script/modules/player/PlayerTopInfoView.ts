
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator, js, Label, ProgressBar, RichText, ScrollView, Sprite, TERRAIN_HEIGHT_BASE } from 'cc';
import { PlayerProxy }  from "./PlayerProxy";
import { getPackageProxy } from "../package/PackageProxy";
import { ITEM_ID_ENUM } from "../../logic/Item";
import { toolKit } from "../../utils/ToolKit";
import { empty } from "../../Global";
const {ccclass, property} = _decorator;

@ccclass("PlayerTopInfoView")
export class PlayerTopInfoView extends BaseView {
    moduleName = "player"
    proxys:any[] = ["package"];
    proxy:PlayerProxy;
    
    @property(RichText)
    rt_name:RichText;
    @property(Label)
    lb_exp:Label;
    @property(ProgressBar)
    pgb_expProgress:ProgressBar;


    packageItemIdList:number[] = [];

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
    }

    init() {            //预加载就调用

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
        this.rt_name.string = js.formatStr("<color=#ffffff>%s</color><color=#3aff3a> Lv.%s</color>",this.proxy.name,this.proxy.level)
        this.pgb_expProgress.progress = percent;
        this.lb_exp.string = this.proxy.exp.toString();        
    }

    updatePackageInfo(){
        var packageProxy = getPackageProxy();      
        var self = this;
        this.packageItemIdList.forEach((value,index) => {
            var root = toolKit.getChild(self.node,"res_" + index);
            if(root){
                var lb_cost = toolKit.getChild(root,"lb_cost").getComponent(Label);
                var itemVo = packageProxy.getItemById(value);
                lb_cost.string = toolKit.parseNum(itemVo.count);
            }
        })
    }

    setPackageItemIdList(itemIdList:number[]){
        if(empty(itemIdList)){
            itemIdList = [ITEM_ID_ENUM.GOLD,ITEM_ID_ENUM.COIN,ITEM_ID_ENUM.SOUL,ITEM_ID_ENUM.DIAMOND];
        }
        this.packageItemIdList = itemIdList;
        var startIndex = this.packageItemIdList.length;        
        var self = this;
        for (let i = startIndex; i < 4; i++) {            
            var root = toolKit.getChild(this.node,"res_" + i);
            if(root){
                root.active = false;
            }
        }
        this.packageItemIdList.forEach((value,index) => {
            var root = toolKit.getChild(self.node,"res_" + index);
            if(root){
                var spt_icon = toolKit.getChild(root,"spt_icon").getComponent(Sprite);
                self.loadSptEx(spt_icon,"texture/package/item/" + value)
            }
        })
        this.show();
    }

    setPackageItemIdList_common(){
        var itemIdList = [ITEM_ID_ENUM.GOLD,ITEM_ID_ENUM.COIN,ITEM_ID_ENUM.SOUL,ITEM_ID_ENUM.DIAMOND];
        this.setPackageItemIdList(itemIdList);
    }

    setPackageItemIdList_battle(){
        var itemIdList = [ITEM_ID_ENUM.GOLD,ITEM_ID_ENUM.COIN,ITEM_ID_ENUM.SOUL,ITEM_ID_ENUM.STAMINA];
        this.setPackageItemIdList(itemIdList);
    }
}