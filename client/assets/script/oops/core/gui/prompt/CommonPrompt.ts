import { Component, Label, _decorator } from "cc";
import { LanguageLabel } from "../../../libs/gui/language/LanguageLabel";
import { oops } from "../../Oops";

const { ccclass, property } = _decorator;

/** 公共提示窗口 */
@ccclass("CommonPrompt")
export class CommonPrompt extends Component {
    /** 窗口标题多语言组件 */
    @property(Label)
    private lb_title: Label | null = null;

    /** 提示内容多语言组件 */
    @property(Label)
    private lb_content: Label | null = null;

    /** 确认按钮文本多语言组件 */
    @property(Label)
    private lb_ok: Label | null = null

    /** 取消按钮文本多语言组件 */
    @property(Label)
    private lb_cancel: Label | null = null;

    private config: any = {};

    /**
     * 
     * 
     * @param params 参数 
     * {
     *     title:      标题
     *     content:    内容
     *     okWord:     ok按钮上的文字
     *     okFunc:     确认时执行的方法
     *     cancelWord: 取消按钮的文字
     *     cancelFunc: 取消时执行的方法
     *     needCancel: 是否需要取消按钮
     * }
     */
    onAdded(params: any): boolean {
        this.config = params || {};
        this.setTitle();
        this.setContent();
        this.setBtnOkLabel();
        this.setBtnCancelLabel();
        this.node.active = true;
        return true;
    }

    private setTitle() {
        this.lb_title!.string = this.config.title;
    }

    private setContent() {
        this.lb_content!.string = this.config.content;
    }

    private setBtnOkLabel() {
        this.lb_ok!.string = this.config.okWord;
    }

    private setBtnCancelLabel() {
        if (this.lb_cancel) {
            this.lb_cancel.string = this.config.cancelWord;
            this.lb_cancel.node.parent!.active = this.config.needCancel || false;
        }
    }

    private onOk() {
        if (typeof this.config.okFunc == "function") {
            this.config.okFunc();
        }
        this.close();
    }

    private onClose() {
        if (typeof this.config.closeFunc == "function") {
            this.config.closeFunc();
        }
        this.close();
    }

    private onCancel() {
        if (typeof this.config.cancelFunc == "function") {
            this.config.cancelFunc();
        }
        this.close();
    }

    private close() {
        oops.gui.removeByNode(this.node);
    }

    onDestroy() {
        this.config = null;
    }
}