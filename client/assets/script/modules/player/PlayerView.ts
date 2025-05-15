
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator, ScrollView } from 'cc';
import { PlayerProxy }  from "./PlayerProxy";
const {ccclass, property} = _decorator;

@ccclass("PlayerView")
export class PlayerView extends BaseView {
    moduleName = "package"
    proxy:PlayerProxy;

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句

    }

    setData() {            //预加载就调用

    }

    show() {            //显示时调用
        
    }
    
    hide() {            //隐藏后调用

    }


}