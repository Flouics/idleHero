import {App} from "../App";
import {BaseClass} from "../zero/BaseClass";
import {Emitter} from "../zero/Emitter";
import { clone, empty, nullfun } from "../Global";
import { Debug }   from "../utils/Debug";
import { toolKit } from "../utils/ToolKit";
import { getTimeProxy } from "../modules/time/TimeProxy";

/** 等待实现 */
let proto = {} as any;
proto.SC = {} as any;
proto.SC.create = nullfun;
proto.CS = {} as any;
let MD5 = {} as any;
let Base64 = {} as any;

var desArr = [
    ['3','1','5','8','9','7','4','2','0','6'],
    ['0','5','3','2','1','7','9','4','8','6'],
    ['1','0','6','7','3','8','2','5','4','9'],
    ['6','1','5','4','2','9','0','3','8','7'],
    ['7','6','0','2','5','8','1','4','9','3'],
    ['6','5','3','4','0','2','8','1','7','9'],
    ['9','6','1','4','0','5','3','2','8','7'],
    ['8','9','3','1','5','7','0','6','4','2'],
    ['6','2','4','9','1','5','3','8','0','7']];

    
function encryptStr(txt:string,key:string){
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.";
    var ikey ="-x6g6ZWm2G9g_vr0Bo.pOq3kRIxsZ6rm";
    var nh1 = toolKit.getRand(0, 64);
    var nh2 = toolKit.getRand(0, 64);
    var nh3 = toolKit.getRand(0, 64);
    //console.log("nh1:"+nh1+"-nh2:"+nh2+"-nh3:"+nh3);
    var ch1 = chars.substring(nh1, nh1 + 1);
    var ch2 = chars.substring(nh2, nh2 + 1);
    var ch3 = chars.substring(nh3, nh3 + 1);
    //console.log("ch1:"+ch1+"-ch2:"+ch2+"-ch3:"+ch3);
    var nhnum = nh1 + nh2 + nh3;
    var knum = 0;
    var keyLen = key.length;
    for (var i=0;i<keyLen;i++) {
        knum += key.substring(i, i+1).charCodeAt(0);
    }
    var mdKey = MD5.md5(MD5.md5(MD5.md5(key + ch1) + ch2 + ikey) + ch3).substring(nhnum%8, knum%8 + (knum%8 + 16));
    //console.log("knum:"+knum+ "-mdKey:"+mdKey);
    txt = Base64.encode(txt);
    txt = txt.replace(/\+/g, "-");
    txt = txt.replace(/\//g, "_");
    txt = txt.replace(/=/g, ".");
    var tmp = '';
    var j=0;
    var k = 0;
    var tlen = txt.length;
    var klen = mdKey.length;
    for (i=0; i<tlen; i++) {
        k = k == klen ? 0 : k;
        k++;
        j = (nhnum + chars.indexOf(txt.substring(i, i + 1)) + mdKey.substring(k, k + 1).charCodeAt(0)) % 64;
        tmp = tmp + chars.substring(j, j + 1);
    }
    var tmpLen = tmp.length;
    tmpLen++;
    tmp = tmp.slice(0, nh2 % tmpLen) + ch3 + tmp.slice(nh2 % tmpLen);
    tmpLen++;
    tmp = tmp.slice(0, nh1 % tmpLen) + ch2 + tmp.slice(nh1 % tmpLen);
    tmpLen++;
    tmp = tmp.slice(0, knum % tmpLen) + ch1 + tmp.slice(knum % tmpLen);
    
    return tmp;

}

function encryptTime(time: number) {
    var codeRand = Math.floor(Math.random() * 9); 
    var atime = atime + "";
    var cipher = "";
    var len = atime.length;
    for (var i = 0; i < len; i++){
        for (var j = 0; j < desArr[codeRand].length; j++){
            if (desArr[codeRand][j] == atime.substr(i,1)){
                cipher += j + "";
            }
        }
    }
    return codeRand + "" + cipher;
}

function encryptData(data: any, str: string){
    if (empty(data))return "";
    
    var isUrlEncode = false;
    for (var i = 0; i < data.length; i++){
        if (data.charCodeAt(i) > 127){
            isUrlEncode = true;
            data = encodeURI(data);
            break;
        }
    }        
    var s = "";
    var index = Math.ceil(data.length / 20);
    index = Math.ceil(Math.random() * index + index/2);
    index = index > 9?9:index;
    var c = 0;
    var j = 0;
    for (var i = 0; i < data.length; i++){
        s += data[c * index + j];
        c ++;
        if (c * index + j >= data.length){
            j++;
            c = 0;
        }
    }
    
    return s + "#" + index + (isUrlEncode?"1":"0") + str;
}
    

export class ProtoCS{
    url:string;
    cmd: string;
    method:string;
    jsonData: object;
    protoUint8Array:Uint8Array;
    cb: Function;
    errCb: Function;
    isWaiting:boolean;
    rsn: string;
    data:any;
    constructor(cmd:string, jsonData:object,_cb: Function = nullfun, _errCb: Function = nullfun){
        this.url = "";
        this.method = "POST";
        this.cb = _cb;
        this.errCb = _errCb;
        var ar = cmd.split('.');      

        if(App.httpMgr.mse > 0 ){
            this.rsn = encryptTime(getTimeProxy().getTime()) + " ~ "  + toolKit.getRand(10000000,99999999)
        }else{
            this.rsn = encryptTime(getTimeProxy().getTime())
        }

        var obj = {};
        
        var temp = obj;
        //  下标从1开始，去掉CS。
        for(var i = 1; i < ar.length; i++){
            temp[ar[i]] = {};
            temp = temp[ar[i]];
        }
        temp = jsonData;
        this.jsonData = obj;
        this.protoUint8Array = proto.CS.encode(proto.CS.create(this.jsonData)).finish();  

        if(App.httpMgr.mse > 0){
            this.data = encryptData(this.protoUint8Array,this.rsn);
        }else{
            this.data = this.protoUint8Array;
        }        
    }
}

export class HttpMgr extends BaseClass {
    _reqHttpList: any[] = []; //网络请求——键值对队列
    _isReqHttpIng: boolean = false; //当前是否还有网络请求还在进行
/* 
    DEBUG = false;
    isRSN = false;
    getUrlHandle = null;
    subscribeMap = {};
    var gameData = {};
    var httpWaitUI = null;
    var regPos = /^\d+$/; // 非负整数
    var isWaitSend = false;
    var lastJson = "";
    var getSecondHandler = null;
    var serUrl = "";
    var encryptKey = "YTZiMTM3Nj";
    var snKey = "nsib3Blbm";
    var snLength = 6;
    var isMM=0;

    CMD = HttpCmd; */
    _login_server: any = null;
    emitter: Emitter = new Emitter();
    emitterDepth:number = 4;

    //直接请求 不需要排队的网络请求
    no_queue_filter: any[] = [];
    
    isDebug = false;
    sc:proto.SC = null;  //用于缓存后端发送的数据 proto.SC
    mse:number = 0;
    mm:number = 0;

    constructor(){
        super();
        HttpMgr._instance = this;
    }

    static get instance ():HttpMgr{
        if( HttpMgr._instance){
            return HttpMgr._instance as HttpMgr;
        }else{
            let instance = new HttpMgr();
            return instance
        }
    }

    init(){
        
        this.sc = proto.SC.create();
        window["sc"] = this.sc;
    }

    clear() {
        this._reqHttpList = [];
        this._isReqHttpIng = false;
        this.emitter.clear();
    }

    getIsWaiting(obj: ProtoCS,isWaiting?:boolean):boolean{
        if (isWaiting == null) {
            this.no_queue_filter.forEach(key => {
                let regexp = new RegExp(key);
                if (regexp.test(obj.cmd)){
                    return false;
                }
            });
            return true;
        }else{
            return isWaiting;
        }
    }
    getUrl(){
        return "";
    }

    send(obj: ProtoCS,_isWaiting?:boolean) {
        var isWaiting = this.getIsWaiting(obj,_isWaiting);
        obj.isWaiting = isWaiting;
        if (isWaiting) {
            // 添加到请求队列
            this._reqHttpList.push(obj.cmd);
            if (this._isReqHttpIng) {
                return;
            } else {
                this.httpReq(obj);
            }            
        } else {
            this.httpReq(obj);
        }
    };
    
    httpReq(obj?: ProtoCS) {
        var is_queue = !obj;
        if (!obj) obj = this._reqHttpList[0];
        if (!obj) return;
        var method = obj.method;
        var cmd = obj.cmd;
        var url = obj.url;
        var cb = obj.cb;
        var errCb = obj.errCb;
        var self = this;
        function callback(res: any) {
            if (!!cb) cb(res);
            if(!!obj && obj.isWaiting){
                self._isReqHttpIng = false;
                if (is_queue) {
                    self.httpReq();
                }
            }
        };

        function callback_error(res: any) {
            if(!!obj && obj.isWaiting){
                self._isReqHttpIng = false;
                if (!!errCb) errCb(res);
            }
        };
        
        if(this.isDebug){
            Debug.dump("send->",obj);
        }
        this.ajax(method, obj.url,obj.data, callback, callback_error, 5);

        // 心跳不走loading
        if (!!obj.isWaiting) {
            this._isReqHttpIng = true;
            App.loadingMgr.playAnimation();
        }
    };       

    //_method 类型 GET   POST
    //_url 地址  https://www.crystalgames.com
    //_param  发送参数 type=101&gameid=4&channel=ios
    //_timeOut  超时(毫秒)
    //_cb 回调
    //_errCb 错误回调
    ajax(_method: string, _url: string, _data: any, _cb?: Function, _errCb?: Function, _timeOut?: number) {
        var xmlhttp = new XMLHttpRequest();
        if (!xmlhttp || typeof xmlhttp == 'undefined') {
            Debug.error("Init xmlhttprequest fail");
            if (_errCb)
                _errCb('');
            return;
        }

        var t1: any;// 用来作超时处理
        var self = this;
        _method = _method.toUpperCase();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                self._isReqHttpIng = false;
                App.loadingMgr.stopAnimation();

                if (_method == "POST") {
                    try {
                        var ret:any;
                        if(true){
                            ret = self.parse( Buffer.from(xmlhttp.responseText,"base64") );
                        }else{
                            ret = JSON.parse(xmlhttp.responseText);
                        }                        
                        if (!!_cb) _cb(ret);          
                    } catch (error) {
                        Debug.log('could not transform to json data:', _url, _data);
                        if (!!xmlhttp.responseText) {
                            if (!!_errCb) _errCb('');          
                        } else {
                            if (!!_cb) _cb(xmlhttp.responseText);
                        }
                    }
                } else {
                    if (!!_cb) _cb(xmlhttp.responseText);          
                }
                if (t1)
                    clearTimeout(t1);
            }
        };
        if (!_url) {
            Debug.error('打开的地址有问题,跳过这一步');
            if (_errCb)
                _errCb('');
            return;
        }
        
        Debug.log('url:' + _url);
        xmlhttp.open(_method, _url);
        if (_method == "POST") {
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send(_data);
        } else {
            xmlhttp.send();
        }

        var connecttoFail = function () {
            if (xmlhttp)
                xmlhttp.abort();
            Debug.error('time out', _url, _data);
            if (_errCb)
                _errCb('');
        };
        t1 = setTimeout(connecttoFail, _timeOut); // 用来作超时处理
    };

    // 简单的Get数据
    get( _url: string, _cb?: Function) {
        var xmlhttp = new XMLHttpRequest();
        if (!xmlhttp || typeof xmlhttp == 'undefined') {
            Debug.error("Init xmlhttprequest fail");
            return;
        }
        var self = this;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var ret = xmlhttp.responseText
                if (!!_cb) _cb(ret);   
            }
        };
        if (!_url) {
            return;
        }        
        Debug.log('url:' + _url);
        xmlhttp.open("Get", _url);
        xmlhttp.send();
    };

    parse(res:Uint8Array){
        if (!!this.isDebug){
            Debug.dump(res);
        }
        let data = proto.ResponseMessage.decode(res);
        this.mergeData(data.a,this.sc);
        this.dealEmit(data);
        return data;
    }

    mergeData(data:any,cache:any,path:string = "SC."){
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const element = data[key];
                if(Array.isArray(element)){
                    cache[key] = data[key];
                }else if(typeof element === 'object'){                
                    if (typeof data[key] === typeof cache[key]){
                        this.mergeData( data[key], cache[key],path + "." + key)
                    }else{
                        Debug.warn("数据类型不匹配:" + path + "." + key)
                    }                   
                }else{
                    cache[key] = data[key];
                }
            }
        }
    }

    dealEmit(obj:any,cache:any = this.sc,path:string = "",depth:number = 1){ 
        if (depth > this.emitterDepth){ return} 
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const element = obj[key];
                const data = clone(cache[key]);                
                if(typeof element === 'object'){
                    path = path + "." + key;
                    this.emitter.emit(path,data);
                }
                this.dealEmit(element,data,path,depth + 1);
            }
        }        
    }

    on(cmd: string, tag: any, fn?: Function, errcb?: Function) {
        this.emitter.on(cmd, tag, fn, errcb);
    };

    once(cmd: string, fn?: Function) {
        this.emitter.once(cmd, fn);
    };

    off(cmd: string, tag: any, fn?: Function) {
        this.emitter.off(cmd, tag, fn);
    };

    emit(cmd: string, data: any) {
        this.emitter.emit(cmd, data);
    };
};
