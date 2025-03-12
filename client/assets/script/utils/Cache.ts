import {BaseClass} from "../zero/BaseClass";
import { empty } from "../Global";
import { Debug }   from "./Debug";

class Data{
    data:any;
    expireTime:number;
    constructor(data:any, expireTime:number) { 
        this.data = data;
        this.expireTime = expireTime;
    }
}

class Cache extends BaseClass {
    _cacheMap = {};
    _expireTime = 1;    //默认 过期时间，单位秒
    setCache(key: string, value:any,time: number = this._expireTime): void{
        if(empty(key)){ 
            Debug.warn("Cache.setCache:key must is not null")
            return
        }

        var expireTime = new Date().getTime() + time * 1000;
        this._cacheMap[key] = new Data(value,expireTime);   
    }

    updateCache(key: string, value:any,time?:number){
        if(empty(key)){ 
            Debug.warn("Cache.updateCache:key must is not null")
            return
        }
        var ret = this.getCache(key)
        if(this.getCache(key)){
            ret.data = value
        }else{
            this.setCache(key,value,time)
        }
    }

    getCache(key: string){
        var ret = this._cacheMap[key]
        if(ret){
            var expireTime = new Date().getTime();
            if (ret.expireTime > expireTime){
                return ret
            }else{
                this.clearCache(key);
            }
        }
    }

    checkCache(key: string, value:any,time?: number){
        var ret = this.getCache(key);
        if(empty(ret)){
            this.setCache(key,value,time)
            return true
        }else{
            return false
        }
    }
    clearCache(key:string){
        this._cacheMap[key] = null;
    }
    destroy( ){
        this._cacheMap = {};
    }
}

export let cache = new Cache(Cache);
