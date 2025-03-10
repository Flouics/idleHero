import App from "../App";

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

export default class UUID {    
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
}