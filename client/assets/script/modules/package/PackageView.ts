
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator, ScrollView } from 'cc';
import { PackageProxy }  from "./PackageProxy";
import { Item } from "../../logic/Item";
const {ccclass, property} = _decorator;

@ccclass("PackageView")
export class PackageView extends BaseView {
    moduleName = "package"
    proxy:PackageProxy;

    @property(ScrollView)
    sv_itemListRoot:ScrollView;

    itemMap:Map<number,Item> = new Map();

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
        this.initItemList();
    }

    setData() {            //预加载就调用

    }

    show() {            //显示时调用
        
    }
    
    hide() {            //隐藏后调用

    }

    initItemList(){
        var itemMap = this.proxy.getAllItems();
        itemMap.forEach(_item => {
            let item = this.itemMap.get(_item.id);
            if(item){
                item.count = _item.count;
            }else{
                item = new Item(_item.id,_item.count);
                item.initUI(this.sv_itemListRoot.content);
                this.itemMap.set(_item.id,item);
            }            
        });
    }

    updateItemList(){
        this.initItemList();
    }
}