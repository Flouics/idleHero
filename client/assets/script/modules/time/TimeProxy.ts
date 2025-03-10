
import App from "../../App";
import { Proxy }from "../base/Proxy";
/*
 * 背包数据
 */
export class TimeProxy extends Proxy {
    _timeZone:number;
    _className = "TimeProxy";  
    
    //方法
    init(){
        this.setTimeZone(8);        
    }

    setTimeZone(timeZone:number){
        this._timeZone = timeZone;
        App.timeMgr._timeZone = this._timeZone;
    }
    getTime():number{
        return App.timeMgr.getTime();
    }

    //服务端和客户端时间差
    updateServerTimeDiff(server_timestamp: number) {
        App.timeMgr.updateServerTimeDiff(server_timestamp);
    };
};

export function getTimeProxy(): TimeProxy {
    return TimeProxy._instance;
}

