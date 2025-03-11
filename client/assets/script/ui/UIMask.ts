import { _decorator } from 'cc';
import { BaseUI } from '../zero/BaseUI';
const {ccclass, property} = _decorator;
@ccclass("UIMask")
export class UIMask extends BaseUI{
    
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
