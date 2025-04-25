import { Node } from "cc";
import { ItemBase } from "../../logic/ItemBase";
import { serialize } from "../../utils/Decorator";
import { UIEquip } from "./UIEquip";
import { App } from "../../App";
import { uiKit } from "../../utils/UIKit";
import { instantiate } from "cc";




// 常用资源ID
export let ITEM_ID_ENUM = {
    GOLD:1,             //金币
    COIN:2,             //铜币
    SOUL:3,             //灵魂
    DIAMOND:4,          //钻石
    STAMINA:5,          //体力    
}

export class Equip extends ItemBase {
    @serialize()
    _id:number = null;   // 道具类型 
    @serialize()
    _count:number = 0;     // 数量
    @serialize()
    _kind:number = 0;       //道具类型
    @serialize()
    idx: number = 0;    // 唯一的识别码，直接自增

    node:Node = null;
    ui:UIEquip = null;

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

    constructor(id:number,count:number = 0) {
        super()
        this.idx = Equip._idIndex;
        Equip._idIndex += 1;
        this.id = id;
        this.count = count;
    }

    initData(){
        this.data = App.dataMgr.findById("equip",this.id)
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
        let pb_url = "";
        uiKit.loadPrefab(pb_url,(prefab) => {
            let node = instantiate(prefab);
            node.parent = parent;   
            this.node = node;
            this.ui = this.node.getComponent(UIEquip);
            this.ui.bindBox(this);
            if(!!cb) cb(this);     
        })
    }

    clear(){
        this.destroy();
    }

    destroy(){
        //--todo表现
        super.destroy();
        this.node.removeFromParent();
    }
    update(){
        
    }
}