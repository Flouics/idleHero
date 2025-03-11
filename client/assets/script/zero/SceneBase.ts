import { winSize } from "../Global";
import {BaseUI} from "./BaseUI";

import { _decorator, Canvas, view } from 'cc';
const {ccclass, property} = _decorator;
@ccclass("SceneBase")
export class SceneBase extends BaseUI{
    // use this for initialization
    is_fit:boolean = false;
    onLoad () {
        super.onLoad();
        this.fitWinSize();
    }

    fitWinSize () {
        var size = view.getVisibleSize();
        var is_fit = size.width / size.height >= winSize.width / winSize.height;
        this.is_fit = is_fit;
    }
}
