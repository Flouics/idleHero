
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator, ScrollView } from 'cc';
import { RewardProxy }  from "./RewardProxy";
import {Item} from "../../logic/Item";
const {ccclass, property} = _decorator;

@ccclass("RewardView")
export class RewardView extends BaseView {
    moduleName = "reward"
    proxy:RewardProxy;

    @property(ScrollView)
    sv_itemListRoot:ScrollView;

    itemList:any[] = [];

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
    }

    show(params:any) {            //显示时调用     
        this.itemList = params || this.proxy.getRwd();   
        this.initRwdList();
    }
    
    hide() {            //隐藏后调用

    }   

    initRwdList(){
        var itemList = this.itemList;
        if(!itemList){
            return;
        }
        itemList.forEach(itemData => {
            var item = new Item(itemData.id,itemData.count);
            item.initUI(this.sv_itemListRoot.content);
        })
    }

    onClickComfirm(){
        this.command("float"); 
        this.close();
    }
}