import { objToJson, jsonToObj } from "../utils/Decorator";
import {UUID} from "../utils/UUID";

export class BaseClass {
    _classDbKey:string;
    _class = null;
    _classId: string = "";
    _className:string = "";
    static _instance = null;       
    constructor(){
        this._classId = UUID.gen(16);        
        this._className = this.constructor.name
        this._classDbKey = this.getClassName();
    }

    public get className() : string {
        return this.getClassName();
    }
    
    //单例
    static get instance(){
        if( BaseClass._instance){
            return BaseClass._instance
        }else{
            let instance = new BaseClass();
            return instance
        }
    }

    clear(){

    }

    destory(){
        this.clear();
        if(this._class){
            this._class.instance = null;
        }
    }

    getClassName(){
        return this._className;
    }

    getId(){
        return this._classId
    }
    //序列化
    serialize(){
        return objToJson(this)
    }
    //反序列号
    unserialize(json:string){
        if(json){
            jsonToObj(this,json);
        }        
    }
}