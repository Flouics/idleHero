import { nullfun } from "../Global";

import { _decorator,RichText,Node,Label} from 'cc';
import { BaseUI } from "../zero/BaseUI";
const {ccclass, property} = _decorator;

@ccclass("MsgBox")
export class MsgBox extends BaseUI {
    @property(Node)
    nd_btnOK:Node = null;
    @property(Node)
    nd_btnCancel:Node = null;
    @property(Label)
    lb_content:Label = null;
    cb_ok:Function = nullfun;
    cb_cancel:Function = nullfun;

    // use this for initialization
    onLoad() {
        super.onLoad();
    }

    //打开一个窗口
    open (content:string,cb_ok:Function = nullfun, cb_cancel?:Function) {
        this.lb_content.string = content;
        if (cb_ok) {
            this.nd_btnOK.active = true;
            this.cb_ok = cb_ok;
        } else {
            this.nd_btnOK.active = false;
        }
        if (cb_cancel) {
            this.nd_btnCancel.active = true;
            this.cb_cancel = cb_cancel;
        } else {
            this.nd_btnCancel.active = false;
        }
    }

    onClickOK() {
        // 关闭界面
        if (typeof this.cb_ok == "function") {
            this.cb_ok();
        }
        this.close();
    }

    onClickCancel() {
        // 关闭界面
        if (typeof this.cb_cancel == "function") {
            this.cb_cancel();
        }
        this.close();
    }
}
