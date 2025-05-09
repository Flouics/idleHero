
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator, Button, instantiate, js, Label, Node, NodeEventType, RichText, ScrollView, Sprite, utils } from 'cc';
import { MercenaryData, MercenaryProxy } from "./MercenaryProxy";
import { toolKit } from "../../utils/ToolKit";
import { empty, lang } from "../../Global";
import { getPackageProxy } from "../package/PackageProxy";
import { ITEM_ID_ENUM } from "../../logic/Item";
import {MercenaryItem} from "./MercenaryItem";
import { getEquipProxy } from "../equip/EquipProxy";
import { Equip } from "../equip/Equip";
import { EquipItem } from "../equip/EquipItem";
import { UIID_Equip } from "../equip/EquipInit";
import { UICallbacks } from "../../oops/core/gui/layer/Defines";
import { EquipCombineView } from "../equip/EquipCombineView";
import { uiKit } from "../../utils/UIKit";
const {ccclass, property} = _decorator;

@ccclass("MercenaryView")
export class MercenaryView extends BaseView {
    moduleName = "mercenary"
    proxys:any[] = ["equip"];
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
    sv_equipRoot:ScrollView;

    curMercenaryData:MercenaryData = null;
    _curEquipData:Equip = null;
    get curEquipData():Equip{
        return this._curEquipData;
    }

    set curEquipData(data:Equip){
        this._curEquipData = data;
        this.taskDelayOnceTime(
            () => {
                this.updateUseEquipInfo();
                this.updateEquipItemSelect();
            }
            ,0.5
            ,"updateUseEquipInfo");
        ;
    }


    equipMap:Map<number,Equip> = new Map();
    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
        this.initMercenary();
        this.initEquipList();
    }

    init() {            //预加载就调用
        
    }

    show() {            //显示时调用
        if(this.curMercenaryData){
            this.updateRoleInfo();
            this.updateUpgradeInfo();                 
        }   
        this.taskDelayOnceTime(() => {
            this.updateEquipList();
        },0.5,"updateEquipList");        
        this.updateUseEquipInfo();
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

    updateUseEquipInfo(){
        let curEquipDataIsEquip = false;
        for (let i = 1; i < 5; i++) {
            let root = this.getNode(`equipPos_${i}`);
            let equip = getEquipProxy().getUseEquipByPos(i);
            let resUrl = equip ? `texture/equip/${equip.id}` : null;       
            this.loadSptEx(toolKit.getChild(root,"spt_equip"),resUrl);
            toolKit.getChild(root,"btn_off").active = !!equip;
            if (this.curEquipData && equip && this.curEquipData.idx == equip.idx){
                curEquipDataIsEquip = true;
            }
        }
        let isCanEquip = !!this.curEquipData && !curEquipDataIsEquip;
        uiKit.setBtnGray(this.getNode("btn_on"),!isCanEquip);   
    }

    updateEquipItemSelect(){
        var children = this.sv_equipRoot.content.children;
        children.forEach((item)=> {
            let ui = item.getComponent(EquipItem);
            if(ui.data && this.curEquipData && ui.data.idx == this.curEquipData.idx){
                ui.setSelected(true);
            }else{
                ui.setSelected(false);
            }
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

    initEquipList(){
        this.sv_equipRoot.content.removeAllChildren();
    }

    getEquipList(){
        var equipMap = getEquipProxy().getAllEquips();
        var list = [];
        equipMap.forEach((equip) => {
            list.push(equip);        
        })

        list.sort((a,b) => {
            if(a.type == b.type){
                return a.idx - b.idx;
            }else{
                return a.type - b.type;
            }
        })
        return list;
    }

    setItem(item:Node,data:any){
        item.getComponent(EquipItem)?.setItem(data);
    }

    initMercenary(){
        this.curMercenaryData = this.proxy.getMercenaryById(this.proxy.curMercenaryId);
        this.updateRoleInfo();
        this.updateUpgradeInfo();
    }

    updateEquipList(){
        var children = this.sv_equipRoot.content.children;
        var list = this.getEquipList();
        if(this.curEquipData == null 
            || getEquipProxy().getEquipByIdx(this.curEquipData.idx) == null){
            this.curEquipData = list[0];
        }
        children.forEach((item,i)=> {
            var data = list[i];
            if(!data){
                item.removeFromParent();                
            }else{
                this.setItem(item,data);
            }
        })
        var len = this.sv_equipRoot.content.children.length;
        for (let i = len; i < list.length; i++) {
            let data = list[i];
            this.loadPrefabEx("prefab/equip/items/EquipItem",(node:Node) => {
                node.on(NodeEventType.TOUCH_END,() => {
                    this.onClickEquip(node);
                })
                this.sv_equipRoot.content.addChild(node);
                this.setItem(node,data);
            });
        }
    }

    onClickEquip(item:Node){
        let ui = item.getComponent(EquipItem);
        this.curEquipData = ui.data;
    }

    onClickAutoCombine(){
        let combineList = getEquipProxy().getCombineList(); 
        if(empty(combineList)){
            return;
        }
        let uic:UICallbacks = {
            onAdded:(node:Node) => {
                node.getComponent(EquipCombineView).setData(combineList);
            }
        }
        getEquipProxy().cmd.showView(UIID_Equip.EquipCombineView,null,uic);
    }

    onClickEquipOff(event:string,customEventData:number){
        let equipPos = customEventData;
        getEquipProxy().cmd.setUseEquip(equipPos,0);
    }

    onClickEquipOn(){
        let equip = this.curEquipData;
        if(!equip){
            return;
        }
        getEquipProxy().cmd.setUseEquip(equip.equipPos,equip.idx);
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
    }

    setUseEquipResult(){
        this.updateRoleInfo();
        this.updateUseEquipInfo();
    }

    
}