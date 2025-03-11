import {App} from "../App";
import { PlayerProxy,  getPlayerProxy } from "../modules/player/PlayerProxy";
import {BaseClass} from "../zero/BaseClass";
import { sys } from "cc";
import { Debug }   from "../utils/Debug";
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";

export var LOCAL_STORAGE = {
    AUDIO_SETTING: 'audio_setting',
    ACCOUNT_INFO: 'ACCOUNT_INFO',
};

export class DBMgr extends BaseClass {    
    uid:string  = "";
    LOCAL_STORAGE: any = LOCAL_STORAGE;
    constructor(){
        super();
        DBMgr._instance = this;
    }

    static get instance ():DBMgr{
        if( DBMgr._instance){
            return DBMgr._instance as DBMgr;
        }else{
            let instance = new DBMgr();
            return instance
        }
    }

    setId(uid:string){
        this.uid = uid;
    }

    getItem(_key: string) {
        var key = this.getKey(_key);
        return this._getItem(key);
    };

    setItem(_key: string, value: any) {
        var key = this.getKey(_key);
        return this._setItem(key, value);
    };

    removeItem(_key: string) {
        var key = this.getKey(_key);
        return this._removeItem(key);
    };

    getJsonItem(_key: string) {
        var key = this.getKey(_key);

        return this._getJsonItem(key);
    };

    setJsonItem(_key: string, obj: any) {
        var key = this.getKey(_key);
        return this._setJsonItem(key, obj);
    };

    removeJsonItem(_key: string) {
        var key = this.getKey(_key);
        return this._removeJsonItem(key);
    };


    _getItem(key: string) {
        var ret = oops.storage.get(key);
        return ret;
    };

    _setItem(key: string, value: any) {
        oops.storage.set(key, value);
    };

    _removeItem(key: string) {
        oops.storage.remove(key);
    };

    _getJsonItem(key: string) {
        var ret = this._getItem(key);
        try {
            ret = JSON.parse(ret);
        } catch (e) {
            Debug.error("could not parse data");
            ret = null;
        }

        return ret;
    };

    _setJsonItem(key: string, obj: any) {
        if (obj) {
            try {
                var ret = JSON.stringify(obj);
                this._setItem(key, ret);
                return true;
            } catch (e) {
                Debug.error("could not stringify data", obj);
                return false;
            }
        }
        return false;
    };

    _removeJsonItem(key: string) {
        try {
            this._removeItem(key);
            return true;
        } catch (e) {
            Debug.error("could not remove data", key);
            return false;
        }
    };

    destory() {
        oops.storage.clear();
    };

    //防止不同用户之间用户数据冲突
    getKey(key: string) {
        this.uid = this.uid;
        var key_prefix = this.uid.slice(0, 7);
        return key_prefix + key;
    };
};
