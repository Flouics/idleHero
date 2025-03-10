import { objToJson, jsonToObj } from "../utils/Decorator";
import UUID from "../utils/UUID";

export default class BaseClass {
    _classDbKey:string;
    _class = null;
    _classId: string = "";
    _className:string = "";
    static _instance = null;       
    constructor(_class?:any){
        if (_class != null) {
            this._class = _class;
            _class._instance = this;         //单例
        }
        this._classId = UUID.gen(16);        
        this._className = this.constructor.name
        this._classDbKey = this.getClassName();
    }

    public get className() : string {
        return this.getClassName();
    }

    static clearInstance(_class:any){
        if(_class._instance){
            let instance = _class._instance;
            instance.destory();
            _class._instance = null;
        }        
    }
    
    //单例
    static getInstance(_class:any){
        if( _class._instance){
            return _class._instance
        }else{
            let instance = new _class(_class);
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