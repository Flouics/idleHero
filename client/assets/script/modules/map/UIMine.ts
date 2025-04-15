import { empty } from "../../Global";
import {Mine} from "../../logic/Mine";
import { toolKit } from "../../utils/ToolKit";
import { uiKit } from "../../utils/UIKit";
import {BaseUI} from "../../zero/BaseUI";

import { _decorator, Label, Sprite} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("UIMine")
export class UIMine extends BaseUI {
    @property(Sprite)
    spt_face:Sprite = null;
    @property(Sprite)
    spt_resIcon:Sprite = null;
    @property(Label)
    lb_resValue:Label = null;
    _baseUrl = "texture/map/";
    _logicObj:Mine = null;
    onLoad(): void {
        super.onLoad();
        uiKit.repeatUpDown(this.getNode("lt_resource"),20,1.0,0.3);
    }
    onClickRwd(){
        var logicObj = this._logicObj
        if(!logicObj){
            return 
        }
        logicObj.getRwd();
        this.updateUI();
    }

    onClickDetail(){
        toolKit.showTip("todo 显示矿洞详情");
    }
    
    updateUI(){
        var logicObj = this._logicObj
        if(!logicObj){
            return 
        }
        this.updateDataToUI("mine.data",logicObj.data,()=>{
            if(logicObj.id > 0){
                this.loadSpt(this.spt_face, "mine/mine_" + logicObj.id)
            }else{
                this.loadSptEmpty(this.spt_face);                
            }
            let productList = logicObj.data.productList;            
            if(!empty(productList)){       
                let product = productList[0];
                let count = logicObj.itemMap[product.id]?.count || 0;
                this.getNode("lt_resource").active = count > 0;
                this.loadSpt(this.spt_resIcon, "texture/package/item_" + product.id)
                this.lb_resValue.string = "+" + count;
            }else{
                this.getNode("lt_resource").active = false;
            }
        })

        this.updateDataToUI("mine.itemMap",logicObj.itemMap,()=>{
            let productList = logicObj.data.productList;            
            if(!empty(productList)){           
                let product = productList[0];
                let count = logicObj.itemMap[product.id]?.count || 0;
                this.getNode("lt_resource").active = count > 0;
                this.lb_resValue.string = "+" + count;
            }else{
                this.getNode("lt_resource").active = false;
            }
        })
    }
}