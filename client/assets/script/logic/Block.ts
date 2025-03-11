import {MapMainView} from "../modules/map/MapMainView";
import {UIBlock} from "../modules/map/UIBlock";

import { Building }  from "./Building";
import { BoxBase }  from "./BoxBase";
import { serialize } from "../utils/Decorator";
import {TouchUtils} from "../utils/TouchUtils";
import { instantiate, Node, Vec2, Vec3 } from "cc";
import { toolKit } from "../utils/ToolKit";
import { uiKit } from "../utils/UIKit";
var BLOCK_VALUE_ENUM = {
    EMPTY:0,
    BLOCK:1,
    BUILDING:2,
    MONSTER:4,
    MONSTER_ENTRY:8,
    MINE:16,
}

var BLOCK_FLAG_ENUM = {
    EMPTY:0,
    DIG:1,
}
var CROSS_VALUE =  BLOCK_VALUE_ENUM.EMPTY;

export class Block extends BoxBase {
    static BLOCK_VALUE_ENUM = BLOCK_VALUE_ENUM;     //瓦片地图属性枚举
    static CROSS_VALUE = CROSS_VALUE;       //可以通过属性检查
    static BLOCK_FLAG_ENUM = BLOCK_FLAG_ENUM; //标记
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
    }
    initUI() {
        if(true){
            this.id = BLOCK_VALUE_ENUM.EMPTY;
            return;    // 目前不需要对格子UI
        }
        let node = instantiate(this.mapMainView.pb_block) as Node;
        node.parent = this.mapMainView.nd_mapRoot;
        var x = this.x * this.mapMainView._blockSize.width;
        var y = this.y * this.mapMainView._blockSize.height;
        node.setPosition(x,y);
        uiKit.setScale(node,0.95);
        if(this.id == null){
            this.id = toolKit.getRand(1,10) > 8 ? Block.BLOCK_VALUE_ENUM.BLOCK : 0;
        }        
        this.bindUI(node.getComponent(UIBlock));
        this.updateUI();
    }

    move(offsetPos:Vec2){
        var x = this.x * this.mapMainView._blockSize.width + offsetPos.x;
        var y = this.y * this.mapMainView._blockSize.height + offsetPos.y;
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
    setFlag(value:number){
        this.data_2 = value;
    }
    onDig(){
        if (this._idPre > 0){
            this.id = this._idPre;
            this.clearFlag();
            return true
        }
        this.clearBlock()
        return false;
    }
}