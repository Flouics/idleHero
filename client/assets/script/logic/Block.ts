import {MapMainView} from "../modules/map/MapMainView";
import {UIBlock} from "../modules/map/UIBlock";

import { Building }  from "./Building";
import { BoxBase }  from "./BoxBase";
import { serialize } from "../utils/Decorator";
import { instantiate, Node, Vec2, Vec3 } from "cc";
import { toolKit } from "../utils/ToolKit";
import { uiKit } from "../utils/UIKit";
import { TouchUtils } from "../utils/TouchUtils";
import { getMapProxy } from "../modules/map/MapProxy";

/** 瓦片地图属性 */ 
export enum BLOCK_VALUE_ENUM  {
    EMPTY = 0,
    BLOCK = 1,
    BUILDING,
    MONSTER_ENTRY,
    ELITE_ENTRY,
    MINE,
}

/** 标记 */
export enum BLOCK_FLAG_ENUM {
    EMPTY = 0,
    MASK,
    DIG,
}
/** 可以通过属性检查 */
export var BLOCK_CROSS_VALUE =  BLOCK_VALUE_ENUM.EMPTY;

export class Block extends BoxBase {
    static _idIndex = 0;
    @serialize()
    buildingId:number = 0;   // 额外属性，value不同，数据不同

    @serialize() 
    _idPre:number = 0; // 预定的属性 挖掉之后显示
    get id (){
        return this._id;
    }
    set id(value:any){
        this._id = value; 
        if (this.checkType(BLOCK_VALUE_ENUM.BLOCK)){
            if(this.data_1 == 0){
                this.data_1 = 1
            }
        }              
    }
    _event:number = 0;     //临时事件等
    get event(){
        return this._event;
    }
    set event(value){
        this._event = value;
    }
    
    node: Node = null;
    floor_1: number = 0;   //第一层，基础层
    mapMainView: MapMainView = null;    //地图组件
    ui:UIBlock = null;
    constructor(mapMainView: MapMainView, tx: number = 0, ty: number = 0) {
        super()
        this.tx = tx;
        this.ty = ty;
        this.mapMainView = mapMainView;
        this.setIdx(Block);

        if(this.tx == 0 && this.ty == 0){
            this.id = BLOCK_VALUE_ENUM.EMPTY
        }else{
            this.setFlag(BLOCK_FLAG_ENUM.MASK)
        }
        if(this.id == null){
            this.id = BLOCK_VALUE_ENUM.BLOCK;
        }

        //临时属性
        if(this.checkType(BLOCK_VALUE_ENUM.BLOCK)){
            let value = toolKit.getRand(1,100)
            if(value < 30){
                this._idPre = BLOCK_VALUE_ENUM.ELITE_ENTRY;
            }else {
                this._idPre = BLOCK_VALUE_ENUM.MONSTER_ENTRY;
            }
        }   
    }
    initUI() {
        let node = instantiate(this.mapMainView.pb_block) as Node;
        node.parent = this.mapMainView.nd_mapRoot;
        node.setPosition(this.x,this.y);
        uiKit.setScale(node,0.95);
        this.bindUI(node.getComponent(UIBlock));
        this.updateUI();
    }

    move(offsetPos:Vec2){
        var x = this.x + offsetPos.x;
        var y = this.y + offsetPos.y;
        this.node.setPosition(x,y);
    }
    createBuilding(building:Building){
        this.buildingId = building.idx; 
        this.id = BLOCK_VALUE_ENUM.BUILDING;
    }
    resetBuilding(building?:Building){
        this.buildingId = building ? building.idx : 0;
        this.id = BLOCK_VALUE_ENUM.BUILDING;
    }
    clearBlock(){
        this.id = BLOCK_VALUE_ENUM.EMPTY;
        this.clearFlag();
    }
    clearFlag(){
        this.setFlag(BLOCK_FLAG_ENUM.EMPTY);
    }
    checkType(value:number){
        return this.id == value;
    }
    checkFlag(value:number){
        return this.data_2 == value;
    }
    setFlag(value:number){
        this.data_2 = value;
    }
    onDig(){
        this.clearBlock();
        this.clearFlag();
        if(this._idPre == BLOCK_VALUE_ENUM.MINE){
            this.data_1 = 1001;
            getMapProxy().cmd.buildMine({block:this});            
        }    
        if (this._idPre > 0){
            this.id = this._idPre;
            this._idPre = 0;        // 只赋值一次
        }    
        getMapProxy().updateBlockFlag(this);
        getMapProxy().dumpToDb();
        return true;
    }
}