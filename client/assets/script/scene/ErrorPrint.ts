
/**
 * Created by Administrator on 2017/9/12.
 * 独立所有场景之外。
 */

import App from "../App";
import { g_event_error_str } from "../Global";

import { _decorator,Component,Label } from 'cc';
const {ccclass, property} = _decorator;
@ccclass("ErrorPrint")
export default class ErrorPrint extends Component{

    @property(Label)
    lb_error: Label = null;


    // use this for initialization
    onLoad() {

    };

    onEnable() {
        this.lb_error.string = g_event_error_str;
    };

    onRestart() {
        //todo ddz
        App.restart();
    };
};
