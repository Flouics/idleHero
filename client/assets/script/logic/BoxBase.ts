import MapUtils from "./MapUtils";
import { serialize } from "../utils/Decorator";
import BaseUI from "../zero/BaseUI";
import { Node, Rect, UITransform, v2, Vec2, Vec3 } from "cc";
import { ItemBase } from "./ItemBase";
import { uiKit } from "../utils/UIKit";
import { DamageRet } from "../Interface";

export class BoxBase extends ItemBase {

    life:number = 1;
    lifeMax:number = 1;    
    atk:number = 0;
    def:number = 0;

    atkColdTime:number = 3000;  //毫秒
    atkSpeed: number = 1;
    atkRange: number = 1;
    atkTagetCount: number = 1;
    atkCount: number = 1;
    searchRange:number = 1;

    _data_1:number = 0;   //额外存储的数据字段1
    _data_2:number = 0;   //额外存储的数据字段2
    _data_3:number = 0;   //额外存储的数据字段3

    _hasInit:boolean = false;

    get data_1(){
        return this._data_1;
    }
    set data_1(value){
        this._data_1 = value;       
    }

    get data_2(){
        return this._data_2;
    }
    set data_2(value){
        this._data_2 = value;       
    }
    get data_3(){
        return this._data_3;
    }
    set data_3(value){
        this._data_3 = value;       
    }

    _scale:number = 1.0 //尺寸
    set scale(value:number){
        this._scale = value;
        if(this.ui){
            uiKit.setScale(this.ui.node,value);
        }
    }

    get scale(){
        return this._scale;
    }

    target:BoxBase = null;
    targetExtraList:BoxBase[] = null;   //副目标列表    
    toPos:Vec2 = null;              //移动的目的地

    getBoundingBox():any{
        if(this.node?.isValid && this.node.getComponent(UITransform) && this.node.parent && this.node.parent.getComponent(UITransform)){
            var uiTransform = this.node.getComponent(UITransform);
            // var rect = uiTransform.getBoundingBoxToWorld();    
            var anchorPoint = uiTransform.anchorPoint;
            var angle = this.node.eulerAngles.z; 
            var size = uiTransform.contentSize;
            var world_pos = uiTransform.convertToWorldSpaceAR( new Vec3(0, 0,0));
            var x = world_pos.x;
            var y = world_pos.y;
            var rect = new Rect(x,y,size.width * this.scale,size.height * this.scale);            
            return {rect:rect,anchorPoint:anchorPoint,angle:angle};
        }else{
 /*            var width = 10;
            var height = 10;
            var rect = new Rect(this.x - width/2,this.y - height/2,width,height);
            return rect; */
            return null;
        }
    }

    updateUI() {
        if(this.ui){
            this.ui.updateUI()
        }
    }    

    getTileDistance(toPos:Vec2){
        var tilePos = MapUtils.getTilePosByViewPos(toPos);
        var abs_delta_x = Math.abs(this.tx - tilePos.x);
        var abs_delta_y = Math.abs(this.ty - tilePos.y);
        return Math.sqrt(abs_delta_x * abs_delta_x  + abs_delta_y * abs_delta_y);
    }

    getViewDistance(toPos:Vec2){
        var abs_delta_x = Math.abs(this.x - toPos.x);
        var abs_delta_y = Math.abs(this.y - toPos.y);
        return Math.sqrt(abs_delta_x * abs_delta_x  + abs_delta_y * abs_delta_y);
    }


    getTargetUIDistance(): number {  
        if(this.target){
           return -1; 
        }else{
            return  MapUtils.getLineDis(this.target.getUIPos(),this.getUIPos());
        }
    }
    getUIPos(){
        return this.pos;
    }

    //发起攻击
    onAtk(target:BoxBase = this.target){
    }

    //受到攻击
    onBeAtked(damageRet:DamageRet,atker:BoxBase){

    }

    checkLive(){
        if(this.life > 0){
            return true;
        }else{
            return false
        }
    }

    getDamageRet():DamageRet{
        var baseDamage = this.atk;
        var damage = baseDamage;
        var isCrit = this.checkCrit();
        var ret:DamageRet = {damage:damage,isCrit:isCrit}
        return ret;
    }

    setDamageRet(){
        //交给子类去实现
    }

    checkCrit(){
        return false
    }

    findTarget(){
        return this.target;
    }

    //查找所有目标，主要用于技能。不缓存，马上用，马上查找。
    findAllTargets(){
        return []; 
    }

    getTargetMap ():Map<number,any>{
        return new Map(); 
    }

    //通用寻找目标 //特殊的各类单独实现
    findTargetsByGroup(map:Map<number,any>) {
        var self = this;
        var list = [];
        map.forEach(target =>{
            if (self.getViewDistance(target.pos) < self.searchRange){
                list.push(target);
            }   
        });

        if(list.length > 0){
            list.sort((a,b)=>{
                return self.getViewDistance(a.pos) - self.getViewDistance(b.pos);
            })
        }
        return list;
    }

    checkTarget(){
        return this.checkTargetInAtkRange();
    }

    checkTargetInSkillRange(target: BoxBase = this.target){  
        if(!target){
            return false;
        }
        if(!target.checkLive()){
            return false;
        }     
        if(this.getViewDistance(target.pos) > this.searchRange){
            return false;
        }
        return true;
    }

    checkTargetInAtkRange(target: BoxBase = this.target){   
        if(!target){
            return false;
        }
        if(!target.checkLive()){
            return false;
        }    
        if(this.getViewDistance(target.pos) > this.atkRange){
            return false;
        }
        return true;
    }

    addBuff(buffId:number,data_1?:number,data_2?:number,data_3?:number){
        //交给子类去实现。
    }
}