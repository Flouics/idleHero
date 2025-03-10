
import { BoxBase }  from "../logic/BoxBase";
import BaseUI from "./BaseUI";

import { _decorator } from 'cc';
const {ccclass, property} = _decorator;
@ccclass("BaseUIItem")
export default class BaseUIItem extends BaseUI {

    reuse(data:any){
        this._logicObj = data;
    }

    updateUI() {
        // var self = this;
        // var logicObj = this._logicObj
        // this.updateDataToUI("value", logicObj.id, () => {
        //     //--todo
        // })
    }
}
