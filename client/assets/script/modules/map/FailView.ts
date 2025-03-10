
import { MapProxy }  from "./MapProxy";
import BaseView from "../../zero/BaseView";
import App from "../../App";
import BaseUI from "../../zero/BaseUI";
import TouchUtils from "../../utils/TouchUtils";

import { _decorator} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("FailView")
export default class FailView extends BaseView {
    mapProxy:MapProxy = null;
    moduleName = "map";
    
    onLoad(){
        super.onLoad()
        this.mapProxy = this.proxy as MapProxy;
    }
    show(): void {
        this.initData();
    }

    initData(){
        //todo 刷新奖励
    }

    onClickComfirm(){
        this.mapProxy.updateView("exitBattle");
        this.close();
    }

    onClickAgain(){
        this.close();
        this.mapProxy.updateView("againBattle");
    }
}
