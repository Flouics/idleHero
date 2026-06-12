
import {App} from "../../App";
import { Proxy }from "../base/Proxy";
/*
 * 背包数据
 */
export class TimeProxy extends Proxy {
    _timeZone:number;
    _className = "TimeProxy";  
    
    constructor(){       
        super();
        TimeProxy._instance = this;
    }

    static get instance ():TimeProxy{
        return App.getInstance(TimeProxy);
    }

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
    
    /**
     * 根据模版返回显示的时间
     * @param leftSec 
     * @param template 返回模版格式 hh:mm:ss hh时mm分ss秒 mm:ss mm分ss秒
     * @returns string
     */
    formatLeftSec(leftSec: number = 0,template: string = "hh:mm:ss"): string {
        leftSec = leftSec > 0 ? leftSec : 0;
        const hours = Math.floor(leftSec / 3600);
        const minutes = Math.floor((leftSec % 3600) / 60);
        const seconds = Math.floor(leftSec % 60);

        // 使用 padStart(2, '0') 确保不足两位时前面补 0
        const pad = (num) => String(num).padStart(2, '0');
        return template
            .replace('hh', pad(hours))
            .replace('mm', pad(minutes))
            .replace('ss', pad(seconds));
    }
};

export function getTimeProxy(): TimeProxy {
    return TimeProxy.instance;
}

