import {App} from "../App";

var charStr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var getRand = function (min: number, max: number): number {
    var n = max - min;
    return min + Math.round(Math.random() * n);
};

var getRandFromArray = function (array: any[]): any {
    var len = array.length;
    var randIndex = getRand(0, len - 1);
    return array[randIndex];
};



export class UUID {   
    static _ID_AUTO = 0;
    static _UIID_INDEX = 0;
    static gen(len: number = 16) {
        var chars = charStr.split("");
        var times = new Date().getTime().toString().split("")
        var timeLen = times.length 
        var offset = getRand(1,20)
        var ret = []
        if (len < timeLen * 2){
            timeLen = Math.floor(len/2)
        } 
        for (let index = timeLen; index >=0; index--) {
            ret[index * 2] = chars[index +  offset] || "x"            
        }
        for (let index = 0; index < len; index++) {
            if (ret[index] == null){
                ret[index] = getRandFromArray(chars);
            }
        }
        return ret.join("")
    }
    static get ID_AUTO(){
        UUID._ID_AUTO++;
        return UUID._ID_AUTO;
    }
    static get UIID_INDEX(){
        UUID._UIID_INDEX++;
        return UUID._UIID_INDEX;
    }
}
