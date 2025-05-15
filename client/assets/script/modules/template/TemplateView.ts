
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { _decorator } from 'cc';
import { TemplateProxy }  from "./TemplateProxy";
const {ccclass, property} = _decorator;

@ccclass("TemplateView")
export class TemplateView extends BaseView {
    moduleName = "template"
    proxy:TemplateProxy;
    bgMusicName:string = ""
    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句
    }

    setData() {            
       if(this.hasInit == true) {
            return;
       }
       this.hasInit = true;
    }
}