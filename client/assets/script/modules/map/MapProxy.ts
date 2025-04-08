/*
 * 用户数据
 */

import { Proxy }from "../base/Proxy";
import {Block, BLOCK_FLAG_ENUM, BLOCK_CROSS_VALUE} from "../../logic/Block";
import { Building }  from "../../logic/Building";
import {DigTask} from "../../logic/task/DigTask";
import {TaskBase} from "../../logic/TaskBase";
import {MapUtils} from "../../logic/MapUtils";
import {Headquarters} from "../../logic/building/Headquarters";
import { MonsterMgr } from "../../manager/battle/MonsterMgr";
import {HeroMgr} from "../../manager/battle/HeroMgr";
import {TowerMgr} from "../../manager/battle/TowerMgr";
import { BulletMgr }  from "../../manager/battle/BulletMgr";
import { serialize } from "../../utils/Decorator";
import {BuildTask} from "../../logic/task/BuildTask";
import { Debug }   from "../../utils/Debug";
import { js, Vec2 } from "cc";
import { MercenaryMgr } from "../../manager/battle/MercenaryMgr";
import {MapCommand} from "./MapCommand";
import {BuffMgr} from "../../manager/battle/BuffMgr";
import {SkillMgr} from "../../manager/battle/SkillMgr";
import { App } from "../../App";
import { getTimeFrame } from "../../Global";

export let MapProxy_event = {
    MapProxy_update : "MapProxy_update",
}

export class MapProxy extends Proxy {
    cmd:MapCommand;
    _className = "MapProxy";  

    attrs:{[key:string]:any} = {} 
    @serialize()
    margin_x: number = 6;   //一边block的个数 总共为   2 * margin_x + 1
    @serialize()
    margin_y: number = 6;   //
    @serialize()
    blockWidth: number = 115;
    @serialize()
    blockHeight:number = 115;
    blockMap: { [k1: number]: { [k2: number]: Block } } = {};
    @serialize()
    blockMapJson = {};
    buildingMap: { [key: number]: Building } = {};
    @serialize()
    buildingMapJson = {};    
    headquarters: Headquarters = null;
    @serialize()
    headquartersJson = {};      //todo
    @serialize()
    mineMapJson = {};  

    get monsterMgr ():MonsterMgr{
        return MonsterMgr.instance;
    }
    get heroMgr ():HeroMgr{
        return HeroMgr.instance;
    }
    get towerMgr ():TowerMgr{
        return TowerMgr.instance;
    }
    get bulletMgr ():BulletMgr{
        return BulletMgr.instance;
    }

    get mercenaryMgr():MercenaryMgr{
        return MercenaryMgr.instance;
    }    

    get buffMgr():BuffMgr{
        return BuffMgr.instance;
    }

    get skillMgr():SkillMgr{
        return SkillMgr.instance;
    }

    task:TaskBase[] = [];
    taskMap = {}

    monsterEntryPos = new Vec2(0, 8);          //tilePos
    mercenaryEntryPos = new Vec2(0, -3);       //tilePos
    headquartersPos = new Vec2(0,-4);         //tilePos

    isPause:boolean = false;
    isBattle:boolean = false;
    battleTimeStamp:number = 0;    

    SCALE_MERCENARY = 0.8
    SCALE_MONSTER = 0.8
    SCALE_MONSTER_BOSS = 1.0
    
    constructor(){       
        super();
        MapProxy._instance = this;
    }

    static get instance ():MapProxy{
        if( MapProxy._instance){
            return MapProxy._instance as MapProxy;
        }else{
            let instance = new MapProxy();
            return instance
        }
    }

    //方法
    init(){
    
    }

    update(dt:number){
        !this.isPause && (this.battleTimeStamp += dt);

        this.emit(MapProxy_event.MapProxy_update,dt);
    }

    getMapTime(){
        return this.battleTimeStamp * 1000;
    }

    dumpPrepare(){
        this.blockMapJson = {}
        for (var i in this.blockMap) {
            this.blockMapJson[i] = {}
            for (var j in this.blockMap[i]) {
                this.blockMapJson[i][j] = this.blockMap[i][j].serialize();
            }
        }

        this.buildingMapJson = {}
        for (var i in this.buildingMap) {
            this.buildingMapJson[i] = this.buildingMap[i].serialize();
        }
    }

    getBlockJson(x: number, y: number){
        if(this.blockMapJson[x]){
            return this.blockMapJson[x][y];
        }else{
            return null;
        }        
    }

    getBuildingJson(x: number){
        return this.buildingMapJson[x];
    }

    reloadPrepare(){
        //Debug.log("reloadPrepare")
    }

    sortTask(){
        var taskList = this.task;
        if(!taskList){
            return;
        }
        taskList.sort((a,b)=>{
            return a.priority - b.priority;
        })
        taskList.forEach((task,index) => {
            task.index = index;
        });
    }
    
    pushTask(task:TaskBase){
        if(this.checkTask(task)){  
            this.task.push(task)
            var key = this.getTaskMapKey(task);
            this.taskMap[key] = task;
            if(task instanceof DigTask){
                var block = this.getBlock(task.tilePos.x,task.tilePos.y)
                if(block){
                    block.setFlag(BLOCK_FLAG_ENUM.DIG);
                }
            }
        }
    }

    getTaskMapKey(task:TaskBase){
        var key = ""
        if(task instanceof DigTask || task instanceof BuildTask){
            key = js.formatStr("%s_%s_%s",task.type,task.tilePos.x,task.tilePos.y)
        }else{
            key = js.formatStr("%s_%s_%s",task.type,task.id)
        }
        return key;
    }

    checkTask(task:TaskBase){
        var key = this.getTaskMapKey(task);
        return !this.taskMap[key]
    }

    delTask(task:TaskBase){
        var taskList = this.task;
        var ret = false;
        if(taskList){
            for (let index = 0; index < taskList.length; index++) {
                if(taskList[index].id == task.id){
                    taskList.splice(index)
                    ret = true;
                    break;
                }                
            }
        }
        var key = this.getTaskMapKey(task);
        delete this.taskMap[key];
        return ret;
    }

    shiftTask(){
        var task = this.task.shift();
        if(task){
            var key = this.getTaskMapKey(task);
            delete this.taskMap[key];
        }
        return task;
    }

    getBlock(_tx: number|Vec2, _ty?: number) {     
        let tx = _tx;
        let ty = _ty; 
        if(_tx instanceof Vec2){
            tx = _tx.x;
            ty = _tx.y;
        }
        tx = this.fixPosX(tx as number);
        ty = this.fixPosY(ty); 
        // Debug.tryObject(this.blockMap[x][y], "blockList out")
        if (this.blockMap[tx]) {
            return this.blockMap[tx][ty];
        } else {
            return null
        }
    }

    checkBlock(pos: Vec2) {
        var tilePos = MapUtils.getTilePosByViewPos(pos);
        var block = this.getBlock(tilePos.x,tilePos.y);
        if (block) {
            return (block.id == BLOCK_CROSS_VALUE && block.buildingId == 0)
        } else {
            return false;
        }
    }

    //避免遍历死循环。
    checkBlockRoute(tilePos: Vec2) {
        var max_x =  this.margin_x * 2 + 1;
        var max_y =  this.margin_y * 2 + 1;
        var tx = tilePos.x;
        var ty = tilePos.y;
        if (tx <= -max_x || tx >=  max_x){
            return false
        }

        if (ty <= -max_y || ty >=  max_y){
            return false
        }

        var block = this.getBlock(tilePos.x,tilePos.y)
        if (block) {
            return (block.id == BLOCK_CROSS_VALUE && block.buildingId == 0)
        } else {
            return false;
        }
    }

    getBuilding(_tx?: number|Vec2, _ty?: number) {    
        let tx = _tx;
        let ty = _ty; 
        if(_tx instanceof Vec2){
            tx = _tx.x;
            ty = _tx.y;
        }    
        tx = this.fixPosX(tx as number);
        ty = this.fixPosY(ty); 
        // Debug.tryObject(this.blockMap[x][y], "blockList out")
        if (this.buildingMap[tx]) {
            return this.buildingMap[tx][ty];
        } else {
            return null
        }
    }

    fixPosX(tx: number){
        var num =  this.margin_x * 2 + 1;
        tx = tx % num;
        if(tx >= -this.margin_x && tx <= this.margin_x){
            return tx;
        }
        if(tx < -this.margin_x){
            tx = tx + num;
        }else if(tx > this.margin_x){
            tx = tx - num;
        }
        return tx;
    }

    fixPosY(ty: number){
        var num =  this.margin_y * 2 + 1;
        ty = ty % num;
        if(ty >= -this.margin_y && ty <= this.margin_y){
            return ty;
        }
        if(ty < -this.margin_y){
            ty = ty + num;
        }else if(ty > this.margin_y){
            ty = ty - num;
        }
        return ty;
    }
};

export function getMapProxy(): MapProxy {
    return MapProxy._instance;
}



