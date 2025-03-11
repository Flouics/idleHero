import {App} from "../App";

import { _decorator,RichText,Label} from 'cc';
import { BaseUI } from "../zero/BaseUI";
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";
const {ccclass, property} = _decorator;

@ccclass("Tips")
export class Tips extends BaseUI {
    @property(Label)
    lb_content:Label = null;
    @property
    num_tipShowTime:number = 1500;
    index:number = 499;

    tipsList:any[] = [];
    closeTime:number = 0;
    
    onLoad () {
        super.onLoad()
        this.tipsList = []; //队列。
        this.closeTime = 0;
    }

    open (msg:string) {
        this.lb_content.string = msg;
        //todo ddz 队列后面在说
        this.closeTime = new Date().getTime() + this.num_tipShowTime;
    }

    update () {
        var nowTimestamp = new Date().getTime();
        if (nowTimestamp > this.closeTime) {
            this.onClose();
            oops.gui.removeByNode(this.node);
        }
    }
}
