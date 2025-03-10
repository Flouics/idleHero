
import App from "../../App";
import BaseView from "../../zero/BaseView";

import { _decorator } from 'cc';
import { TemplateProxy }  from "./TemplateProxy";
const {ccclass, property} = _decorator;

@ccclass("TemplateView")
export default class TemplateView extends BaseView {
    moduleName = "template"
    proxy:TemplateProxy;
    bgMusicName:string = ""
    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
    }

    init() {            //预加载就调用 通过windowMgr.open打开才会调用这个接口
       if(this.hasInit == true) {
            return;
       }
       this.hasInit = true;
    }

    show() {            //显示时调用

    }
    
    hide() {            //隐藏后调用

    }
}