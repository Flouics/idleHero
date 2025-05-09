import { Node } from "cc";
import { ItemBase } from "../../logic/ItemBase";
import { serialize } from "../../utils/Decorator";
import { UIEquip } from "./UIEquip";
import { App } from "../../App";
import { uiKit } from "../../utils/UIKit";
import { instantiate } from "cc";
import { EquipProxy } from "./EquipProxy";
import { Debug } from "../../utils/Debug";




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
    idx: number = 0;    // 唯一的识别码，直接自增

    node:Node = null;
    ui:UIEquip = null;

    data:any = {};
    pb_url = "";
    get id (){
        return this._id;
    }
    
    set id(value:any){
        this._id = value;
        this.initData();            
    }

    get equipPos(){
        return this.data.pos;
    }
    
    static _idIndex = 1;

    constructor(id:number,idx:number = 0) {
        super();
        if (idx > 0 ){ 
            if(idx > Equip._idIndex){
                Equip._idIndex = idx + 1;
            }               
        }else{
            idx = Equip._idIndex;
            Equip._idIndex++;            
        }
        
        this.idx = idx;           
        this.id = id;
    }

    initData(){
        this.data = App.dataMgr.findById("equip",this.id)
    }

    /**
     * 升级
     */
    upgrade(){
        let id = this.id + 1;
        let data = App.dataMgr.findById("equip",id);
        if(data){
            this.id = id;
            this.data = data;
            return true;
        }else{
            Debug.error(`can't find equip conf by id ${id}`)
            return false;
        }
    }

    toData(){
        return {id:this.id,idx:this.idx}
    }

    initUI(parent:Node,cb?:Function) {
        let pb_url = this.pb_url;
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
        uiKit.isValid(this.node) && this.node.removeFromParent();
    }
    update(){
        
    }
}