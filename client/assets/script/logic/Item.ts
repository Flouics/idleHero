import {MapMainView} from "../modules/map/MapMainView";
import {MapUtils} from "./MapUtils";
import { MapProxy }  from "../modules/map/MapProxy";
import { serialize } from "../utils/Decorator";
import {PoolMgr} from "../manager/PoolMgr";
import {StateMachine} from "./stateMachine/StateMachine";
import {App} from "../App";
import {DataMgr} from "../manager/DataMgr";
import {UIItem} from "../modules/package/UIItem";
import { empty } from "../Global";
import {BaseUI} from "../zero/BaseUI";
import { Node } from "cc";
import { ItemBase } from "./ItemBase";


// 常用资源ID
export let ITEM_ID_ENUM = {
    GOLD:1,             //金币
    COIN:2,             //铜币
    SOUL:3,             //灵魂
    DIAMOND:4,          //钻石
    STAMINA:5,          //体力    
}

export class Item extends ItemBase {
    @serialize()
    _id:number = null;   // 道具类型 
    @serialize()
    _count:number = 0;     // 数量
    @serialize()
    _kind:number = 0;       //道具类型
    @serialize()
    idx: number = 0;    // 唯一的识别码，直接自增

    node:Node = null;
    ui:UIItem = null;

    data:any = {};

    get id (){
        return this._id;
    }
    
    set id(value:any){
        this._id = value;
        this.initData();            
    }
    
    get count(){
        return this._count;
    }
    set count(value){
        this._count = Number(value);       
    }

    get kind(){
        return this._kind;
    }
    set kind(value){
        this._kind = Number(value);       
    }

    static _idIndex = 1;

    _pb_tag:string = PoolMgr.POOL_TAG_ENUM.ITEM.tag;
    constructor(id:number,count:number = 0) {
        super()
        this.idx = Item._idIndex;
        Item._idIndex += 1;
        this.id = id;
        this.count = count;
    }

    initData(){
        this.data = App.dataMgr.findById("item",this.id)
    }

    toData(){
        return {id:this.id,count:this.count}
    }

    add(count:number = 0){    
        this.count += count;
    }
    reduce(count:number = 0){
        this.count += -count;              
    }

    initUI(parent:Node,cb?:Function) {
        let pool = PoolMgr.instance.getPool(this._pb_tag);
        let node = pool.getItem(this);
        node.parent = parent;
        this.node = node;
        this.ui = this.node.getComponent(UIItem);
        this.ui.bindBox(this);
        if(!!cb) cb(this);
    }

    clear(){
        this.destroy();
    }

    destroy(){
        //--todo表现
        super.destroy();
        let pool = PoolMgr.instance.getPool(this._pb_tag);
        pool.recycleItem(this.node);
    }
    update(){
        
    }
}