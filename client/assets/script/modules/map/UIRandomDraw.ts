
import BaseUI from "../../zero/BaseUI";

import { _decorator, Label, Node, NodeEventType, ScrollView, Sprite} from 'cc';
import { MapProxy , getMapProxy } from "./MapProxy";
import { Augment } from "../../manager/battle/AugmentMgr";
import { toolKit } from "../../utils/ToolKit";
import App from "../../App";
import { cache } from "../../utils/Cache";
const {ccclass, property} = _decorator;

@ccclass("UIRandomDraw")
export default class UIRandomDraw extends BaseUI {
    _baseUrl = "texture/";
    _prefabUrl = "prefab/map/";
    maxCount:number = 3;
    proxy:MapProxy = null;

    @property(ScrollView)
    sv_draw:ScrollView = null;

    @property(Label)
    lb_coinCount:Label = null;

    onLoad(): void {
        super.onLoad();
        this.initUI();
    }

    initUI(){
        this.sv_draw.node.active = false;
        this.proxy = getMapProxy();
        var self = this;        
        var index = 0;
        for (var i = 0; i < this.maxCount; i++) {
            this.loadPrefab("items/drawItem",function(node:Node){
                self.sv_draw.content.addChild(node);
                self.setItem(node,null);
                node.on(NodeEventType.TOUCH_END,function(){
                    self.onClickItem(node);
                });
                index++;
                if(index == self.maxCount){
                    self.updateRandomDrawList();
                }
            });
        }
    }

    onClickShowRandomDrawView(){
        this.sv_draw.node.active = true;
        this.proxy.updateView("pauseBattle");
    }

    onClickHideRandomDrawView(){
        this.sv_draw.node.active = false;
        this.proxy.updateView("resumeBattle");
    }

    onClickItem(item:Node){
        if(cache.checkCache("drawRandom",1,0.5)){
            var data = (item as any).data as Augment;
            if(!!data){
                App.moduleMgr.command(this.proxy.moduleName,"drawRandom",data);
                this.onClickHideRandomDrawView();
            }            
        }
    }

    setItem(item:Node,data:Augment){
        if(!item){
            return;
        }
        if(!data){
            item.active = false;
            return;
        }
        item.active = true;
        (item as any).data = data as Augment;
        var spt_item = toolKit.getChild(item,"spt_item").getComponent(Sprite);
        var spt_mask = toolKit.getChild(item,"spt_mask").getComponent(Sprite);
        var lb_name = toolKit.getChild(item,"lb_name").getComponent(Label);
        var lb_cost = toolKit.getChild(item,"lb_cost").getComponent(Label);
        var self = this;
        this.updateDataToUI(item.uuid + "_value", + data.id, () => {
            if(data.type == 900){
                self.loadSpt(spt_item,"mercenary/" + data.data_1);
            }else{
                //self.loadSpt(spt_item,"augment/" + data.id);
                self.loadSpt(spt_item,"package/item/2");
            }            
        });
        spt_mask.node.active = false;

        lb_name.string = data.desc;
        lb_cost.string = "" + data.price;
    }

    updateBattleCoin(){
        var children = this.sv_draw.content.children;
        var self = this;
        var battleCoin = this.proxy.battleCoin;
        children.forEach(item => {
            var nd_mask = toolKit.getChild(item,"spt_mask");
            var data = (item as any).data as Augment;
            if(!data){
                nd_mask.active = true;
            }else{
                nd_mask.active = (battleCoin < data.price);
            }
            
        });
        this.lb_coinCount.string = "" +  battleCoin;
    }

    updateRandomDrawList(){
        var list = this.proxy.randomDrawMgr.getLastDrawList();
        var index = 0;
        var children = this.sv_draw.content.children;
        var self = this;
        list.forEach(data => {
            var item = children[index];
            self.setItem(item, data);
            index++;
        });

        this.updateBattleCoin();
    }
}