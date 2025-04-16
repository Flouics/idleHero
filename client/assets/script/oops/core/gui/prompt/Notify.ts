/*
 * @Author: dgflash
 * @Date: 2022-04-14 17:08:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-09-02 14:07:13
 */
import { Animation, Component, Label, _decorator } from "cc";
import { lang } from "../../../../../../assets/script/Global";
import L10nComponent from "../../../../../localization-editor/static/assets/components/l10n-component";

const { ccclass, property } = _decorator;

/** 滚动消息提示组件  */
@ccclass('Notify')
export class Notify extends Component {
    @property(Label)
    private lab_content: Label = null!;

    @property(Animation)
    private animation: Animation = null!;

    /** 提示动画完成 */
    onComplete: Function = null!;

    onLoad() {
        if (this.animation)
            this.animation.on(Animation.EventType.FINISHED, this.onFinished, this);
    }

    private onFinished() {
        this.node.destroy();
        this.onComplete && this.onComplete();
        this.onComplete = null!;
    }

    /**
     * 显示提示
     * @param msg       文本
     */
    toast(msg: string) {
        let label = this.lab_content.getComponent(Label)!;
        label.string = lang(msg);
    }
}