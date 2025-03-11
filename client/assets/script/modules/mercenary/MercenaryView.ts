
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator, Button, instantiate, js, Label, Node, NodeEventType, RichText, ScrollView, Sprite, utils } from 'cc';
import { MercenaryData, MercenaryProxy } from "./MercenaryProxy";
import { toolKit } from "../../utils/ToolKit";
import { lang } from "../../Global";
import { getPackageProxy } from "../package/PackageProxy";
import { ITEM_ID_ENUM } from "../../logic/Item";
import {MercenaryItem} from "./MercenaryItem";
const {ccclass, property} = _decorator;

@ccclass("MercenaryView")
export class MercenaryView extends BaseView {
    moduleName = "mercenary"
    proxys:any[] = [];
    proxy:MercenaryProxy;

    @property(Sprite)
    spt_role:Sprite;
    @property(RichText)
    rt_nameInfo:RichText;

    @property(Node)
    nd_upgradeInfoRoot:Node;
    @property(Node)
    nd_attrItem:Node;
    @property(Button)
    btn_upgrade:Button;    
    @property(Label)
    lb_upgradeLabel:Label;   
    @property(Label)
    lb_cost_1:Label;
    @property(Label)
    lb_cost_2:Label;
    @property(Label)
    lb_cost_3:Label;

    @property(ScrollView)
    sv_mercenary:ScrollView;

    curMercenaryData:MercenaryData = null;
    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
        this.initMercenaryList();
    }

    init() {            //预加载就调用
        
    }

    show() {            //显示时调用
        if(this.curMercenaryData){
            this.updateRoleInfo();
            this.updateUpgradeInfo();
            this.updateMercenaryList();     
        }   
    }

    hide() {            //隐藏后调用

    }

    updateRoleInfo(){
        var self = this;
        this.updateDataToUI("role.id",self.curMercenaryData.id,() => {
            self.loadSpt(self.spt_role,""  + self.curMercenaryData.id);
        });

        var data = {
                name:self.curMercenaryData.name
                ,level:self.curMercenaryData.level
            }
        this.updateDataToUI("role.name",data,() => {
            self.rt_nameInfo.string = js.formatStr("<color=#00ff00>%s</color><color=#0fffff>Lv.%s</color>",data.name,data.level);
        });
    }

    updateUpgradeInfo(){
        var self = this;
        var nextLevelAttrMap = this.curMercenaryData.getLevelAttrsAddTotalMap(this.curMercenaryData.level + 1);
        var curLevelAttrMap = this.curMercenaryData.getLevelAttrsAddTotalMap(this.curMercenaryData.level);
        var isMaxLevel = this.curMercenaryData.checkMaxLevel();
        this.nd_upgradeInfoRoot.removeAllChildren();
        if(isMaxLevel){
            this.btn_upgrade.interactable = false;
            this.lb_upgradeLabel.string = lang("common.maxLevel");
            return;
        }
        this.lb_upgradeLabel.string = lang("common.upgrade");

        var keyList= ["lifeMax","atk","atkRange","coldTime","skillList"] //必然显示属性
        var otherKeyList = ["atkSpeed","atkTargetCount","atkCount","moveSpeed","atkBuffList"] //非必要属性
        
        keyList.forEach((key)=> {
            var curValue = this.curMercenaryData[key];
            if (Array.isArray(curValue)){
                //todo
                //数组先跳过
                if(key == "skillList"){
                    var nextLevelSkillList = nextLevelAttrMap[key];
                    var curLevelSkillList = curValue;
                    var addSkillList = toolKit.arrayMinus(nextLevelSkillList,curLevelSkillList);
                    curLevelSkillList.forEach((skillId) => {
                        var skillData = App.dataMgr.findById("skill",skillId);
                        if(skillData){
                            var attrItem = instantiate(this.nd_attrItem);
                            attrItem.removeFromParent();
                            this.nd_upgradeInfoRoot.addChild(attrItem);
                            var rt_attr = toolKit.getChild(attrItem,"rt_attr").getComponent(RichText);
                            rt_attr.string = js.formatStr("<color=#ffffff>%s</color><color=#fffff> %s%s</color>"
                                                ,lang("mercenary.skill")
                                                ,skillData.desc
                                                ,"");
                        }
                    });

                    addSkillList.forEach((skillId) => {
                        var skillData = App.dataMgr.findById("skill",skillId);
                        if(skillData){
                            var attrItem = instantiate(this.nd_attrItem);
                            attrItem.removeFromParent();
                            this.nd_upgradeInfoRoot.addChild(attrItem);
                            var rt_attr = toolKit.getChild(attrItem,"rt_attr").getComponent(RichText);
                            rt_attr.string = js.formatStr("<color=#ffffff>%s</color><color=#fffff> %s%s</color>"
                                                ,lang("mercenary.skill")
                                                ,skillData.desc
                                                ,"");
                        }
                    });
                }

            }else{
                var nextLevelAttr = nextLevelAttrMap[key];
                var curLevelAttr = curLevelAttrMap[key];           
                var originValue = this.curMercenaryData.data[key];
                var value = curValue;
                if(nextLevelAttr){
                    value = originValue * (100 + nextLevelAttr.percent)/100 + nextLevelAttr.value;
                }                                
                var deltaValue = value - curValue;
                var attrItem = instantiate(this.nd_attrItem);
                attrItem.removeFromParent();
                this.nd_upgradeInfoRoot.addChild(attrItem);
                var rt_attr = toolKit.getChild(attrItem,"rt_attr").getComponent(RichText);
                var sign = deltaValue < 0 ? "" : "+";
                var content = deltaValue.toString();
                if (key == "coldTime"){
                    curValue = (Math.floor(curValue)/1000).toString() + lang("time.sec");
                    content = (Math.floor(deltaValue)/1000).toString() + lang("time.sec");
                }
                var addContent = deltaValue == 0 ? "" : js.formatStr("(%s%s)",sign,content);
                rt_attr.string = js.formatStr("<color=#ffffff>%s:%s</color><color=#0ff0f>%s</color>"
                                    ,lang("mercenary." + key)
                                    ,curValue
                                    ,addContent);            
            }
        });
        
        var data = App.dataMgr.findById("mercenaryLevelUpgrade",this.curMercenaryData.level);
        if(!data){
            return;
        }
        //检查资源
        var packageProxy =  getPackageProxy();
        var item_1 = packageProxy.getItemById(ITEM_ID_ENUM.GOLD);
        var item_2 = packageProxy.getItemById(ITEM_ID_ENUM.COIN);
        var item_3 = packageProxy.getItemById(ITEM_ID_ENUM.SOUL);
        var isCanUpgrade = !(item_1.count < data.cost_1 || item_2.count < data.cost_2 || item_3.count < data.cost_3)
        
        this.btn_upgrade.interactable = isCanUpgrade;
        this.btn_upgrade.getComponent(Sprite).grayscale = !isCanUpgrade;

        this.lb_cost_1.string = data.cost_1;
        this.lb_cost_2.string = data.cost_2;
        this.lb_cost_3.string = data.cost_3;
    }

    initMercenaryList(){
        var mercenaryMap = this.proxy.getMercenaryMap();
        var self = this;
        mercenaryMap.forEach(data => {
            if(!self.curMercenaryData){
                self.curMercenaryData = data;
                self.onSwitchMercenary(data);
            }
            self.loadPrefab("items/MercenaryItem",function(item:Node){
                self.sv_mercenary.content.addChild(item);
                self.setItem(item,data);
                item.on(NodeEventType.TOUCH_END,()=>{
                    self.onSwitchMercenary(item.getComponent(MercenaryItem)?.data);
                })
            })             
        });
    }

    setItem(item:Node,data:any){
        item.getComponent(MercenaryItem)?.setItem(data,this.curMercenaryData.id == data.id);
    }

    onSwitchMercenary(mercenaryData:MercenaryData){
        this.curMercenaryData = mercenaryData;
        this.updateRoleInfo();
        this.updateUpgradeInfo();
        this.updateMercenaryList();
    }

    updateMercenaryList(){
        var children = this.sv_mercenary.content.children;
        var self = this;
        children.forEach(item => {
            var data = self.proxy.getMercenaryById(item.getComponent(MercenaryItem)?.data.id);
            self.setItem(item,data);
        })
    }

    onClickUpgrade(){
        var isMaxLevel = this.curMercenaryData.checkMaxLevel();
        if(isMaxLevel){
            return;
        }
        var data = App.dataMgr.findById("mercenaryLevelUpgrade",this.curMercenaryData.level);
        if(!data){
            return;
        }
        //检查资源
        var packageProxy =  getPackageProxy();
        var item_1 = packageProxy.getItemById(ITEM_ID_ENUM.GOLD);
        var item_2 = packageProxy.getItemById(ITEM_ID_ENUM.COIN);
        var item_3 = packageProxy.getItemById(ITEM_ID_ENUM.SOUL);
        if (item_1.count < data.cost_1){
            return;
        }

        if (item_2.count < data.cost_2){
            return;
        }

        if (item_3.count < data.cost_3){
            return;
        }
        //扣除道具
        if(!!packageProxy.reduceItemById(item_1.id,data.cost_1) 
            && !!packageProxy.reduceItemById(item_2.id,data.cost_2) 
            && !!packageProxy.reduceItemById(item_3.id,data.cost_3)){
            //升级
            this.command("upgrade",this.curMercenaryData.id)
        }      
    }

    upgradeResult(){
        this.updateRoleInfo();
        this.updateUpgradeInfo();
        this.updateMercenaryList();
    }
}