
import App from "../../App";
import BaseView from "../../zero/BaseView";

import { _decorator, ScrollView } from 'cc';
import { PackageProxy }  from "./PackageProxy";
const {ccclass, property} = _decorator;

@ccclass("PackageView")
export default class PackageView extends BaseView {
    moduleName = "package"
    proxy:PackageProxy;

    @property(ScrollView)
    sv_itemListRoot:ScrollView;

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
        this.initRwdList();
    }

    init() {            //预加载就调用

    }

    show() {            //显示时调用
        
    }
    
    hide() {            //隐藏后调用

    }

    initRwdList(){
        var itemMap = this.proxy.getAllItems();
        itemMap.forEach(item => {
            item.initUI(this.sv_itemListRoot.content);
        })
    }
}