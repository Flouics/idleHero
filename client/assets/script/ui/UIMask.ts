import { _decorator } from 'cc';
import BaseWin from '../zero/BaseWin';
const {ccclass, property} = _decorator;
@ccclass("UIMask")
export default class UIMask extends BaseWin{
        
    index:number = 1000;
    closeTime:number = 0;

    setUIMaskBlockTime(time:number = 0){
        this.closeTime = new Date().getTime() + time;
        this.update();
    }

    update () {
        var nowTimestamp = new Date().getTime();
        if (nowTimestamp >= this.closeTime) {
            this.close();
        }
    }
}
