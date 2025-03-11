import { Mercenary } from "../../logic/Mercenary";
import {BaseUI} from "../../zero/BaseUI";

import { _decorator, instantiate, Label, Node, resources, ScrollView, Sprite} from 'cc';
import { MapProxy , getMapProxy } from "./MapProxy";
import {Item} from "../../logic/Item";
import { toolKit } from "../../utils/ToolKit";
const {ccclass, property} = _decorator;

@ccclass("UIMercenaryGen")
export class UIMercenaryGen extends BaseUI {    
    _baseUrl = "texture/mercenary/";
    _prefabUrl = "prefab/map/";
    proxy:MapProxy = null;
    @property(ScrollView)
    sv_mercenaryGen:ScrollView;

    onLoad(): void {
        super.onLoad();
        this.initUI();
    }

    initUI(){
        var self = this;
        this.proxy = getMapProxy();
        for (var i = 0; i < this.proxy.battleMercenaryCountMax; i++) {
            this.loadPrefab("items/MercenaryItem",function(node:Node){
                self.sv_mercenaryGen.content.addChild(node);
                self.setItem(node,null);
            });
        }
    }

    setItem(item:Node,data:Mercenary){
        if(!item){
            return;
        }
        if(!data){
            item.active = false;
            return;
        }
        item.active = true;
        var spt_item = toolKit.getChild(item,"spt_mercenarty").getComponent(Sprite);
        var spt_process = toolKit.getChild(item,"spt_process").getComponent(Sprite);
        var self = this;
        this.updateDataToUI(item.uuid + "_value", data.id, () => {
            this.loadSpt(spt_item,data.id);
        });

        var leftTime = toolKit.limitNum(data.lastGenTime - this.proxy.getBattleTime(),0);
        var percent = leftTime / data.coldTime;
        spt_process.fillRange = percent;        
    }

    updateUI(){
        var map = this.proxy.mercenaryMgr.getMercenaryGenMap();
        if(!map){
            return;
        }
        var index = 0;
        var children = this.sv_mercenaryGen.content.children;
        var self = this;
        map.forEach(data => {
            var item = children[index];
            self.setItem(item, data);
            index++;
        });
    }
}