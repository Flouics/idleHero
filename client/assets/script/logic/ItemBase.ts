import MapUtils from "./MapUtils";
import { serialize } from "../utils/Decorator";
import BaseUI from "../zero/BaseUI";
import { Node, Rect, UITransform, v2, Vec2, Vec3 } from "cc";
import BaseClass from "../zero/BaseClass";

export class ItemBase extends BaseClass {
    @serialize()
    _id:number = null;   //type属性 二进制存储数据  
    _pb_tag:string = "";      
    get id(){
        return this._id;
    }
    set id(value:any){
        this._id = value;           
    }

    @serialize()
    idx: number = 0;    // 唯一的识别码，直接自增

    static _idIndex = 1;

    @serialize()
    _x: number = 0;  //地图的坐标
    @serialize()
    _y: number = 0;  //地图的坐标
    @serialize()
    _z: number = 0;  //地图的坐标

    @serialize()
    _tx: number = 0;  //瓦片地图坐标
    @serialize()
    _ty: number = 0;  //瓦片地图坐标


    get x():number{
        return this._x;
    }
    set x(value:number){
        this._x = value;
        this._tx = MapUtils.getTilePosByViewPosX(this._x);
    }
    get y():number{
        return this._y;
    }

    set y(value:number){
        this._y = value;
        this._ty = MapUtils.getTilePosByViewPosY(this._y);
    }

    get z():number{
        return this._z;
    }
    set z(value:number){
        this._z = value;
    }

    get pos():Vec2{
        return new Vec2(this._x,this._y);
    }

    set pos(position:Vec2){
        this._x = position.x;
        this._y = position.y;
    }

    get tx():number{
        return this._tx;
    }
    set tx(value:number){
        this._tx = value;
        this._x = MapUtils.getViewPosByTilePosX(this._tx);
    }
    get ty():number{
        return this._ty;
    }

    set ty(value:number){
        this._ty = value;
        this._y = MapUtils.getViewPosByTilePosY(this._ty);
    }

    get tilePos():Vec2{
        return new Vec2(this._tx,this._ty);
    }

    set tilePos(position:Vec2){
        this._tx = position.x;
        this._ty = position.y;
    }

    _dirV2:Vec2 = null;  //   当前的方向朝向
    set dirV2 (dir:Vec2){   
        this.onChangeDirV2(dir);
        this._dirV2 = new Vec2(dir.x,dir.y);
    }
    get dirV2 (){
        return this._dirV2;
    }    

    name:string = "";
    isDestroy:boolean = false;
    node:Node = null;
    ui:BaseUI = null;

    bindUI(ui:BaseUI){
        if (ui == null) {
            return
        }
        this.ui = ui;
        this.node = ui.node;
        this.ui.bindBox(this);
    }    
    setIdx(_class:any){
        this.idx = _class._idIndex;
        _class._idIndex += 1;
    }
    updateUI() {
        if(this.ui){
            this.ui.updateUI()
        }
    }

    onChangeDirV2(newDir:Vec2){

    }
    
    onLoad(ui?:BaseUI) {

    }

    show() {

    }
    hide() {

    }
    onEnable(ui?:BaseUI) {
    }

    onClose(ui?:BaseUI) {

    }

    onDisable(ui?:BaseUI) {
    }

    onDestroy(ui?:BaseUI) {
        this.ui = null
    }

    
    destory(){
        this.isDestroy = true;
    }
}