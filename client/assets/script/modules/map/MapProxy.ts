/*
 * 用户数据
 */

import { Proxy }from "../base/Proxy";
import Block from "../../logic/Block";
import { Building }  from "../../logic/Building";
import DigTask from "../../logic/task/DigTask";
import TaskBase from "../../logic/TaskBase";
import MapUtils from "../../logic/MapUtils";
import Headquarters from "../../logic/building/Headquarters";
import { MonsterMgr } from "../../manager/battle/MonsterMgr";
import HeroMgr from "../../manager/battle/HeroMgr";
import TowerMgr from "../../manager/battle/TowerMgr";
import { BulletMgr }  from "../../manager/battle/BulletMgr";
import { serialize } from "../../utils/Decorator";
import BuildTask from "../../logic/task/BuildTask";
import { Debug }   from "../../utils/Debug";
import { js, Vec2 } from "cc";
import { MercenaryMgr } from "../../manager/battle/MercenaryMgr";
import AugmentMgr, { Augment } from "../../manager/battle/AugmentMgr";
import RandomDrawMgr from "../../manager/battle/RandomDrawMgr";
import MapCommand from "./MapCommand";
import BuffMgr from "../../manager/battle/BuffMgr";
import SkillMgr from "../../manager/battle/SkillMgr";

export class MapProxy extends Proxy {
    cmd:MapCommand;
    _className = "MapProxy";  

    attrs:{[key:string]:any} = {} 
    @serialize()
    margin_x: number = 40;   //一边block的个数 总共为   2 * margin_x + 1
    @serialize()
    margin_y: number = 70;   //
    @serialize()
    blockWidth: number = 10;
    @serialize()
    blockHeight:number = 10;
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
        return MonsterMgr.getInstance(MonsterMgr);
    }
    get heroMgr ():HeroMgr{
        return HeroMgr.getInstance(HeroMgr);
    }
    get towerMgr ():TowerMgr{
        return TowerMgr.getInstance(TowerMgr);
    }
    get bulletMgr ():BulletMgr{
        return BulletMgr.getInstance(BulletMgr);
    }

    get mercenaryMgr():MercenaryMgr{
        return MercenaryMgr.getInstance(MercenaryMgr);
    }    

    get augmentMgr():AugmentMgr{
        return AugmentMgr.getInstance(AugmentMgr);
    }
    
    get randomDrawMgr():RandomDrawMgr{
        return RandomDrawMgr.getInstance(RandomDrawMgr);
    }

    get buffMgr():BuffMgr{
        return BuffMgr.getInstance(BuffMgr);
    }

    get skillMgr():SkillMgr{
        return SkillMgr.getInstance(SkillMgr);
    }

    task:TaskBase[] = [];
    taskMap = {}

    monsterEntryPos = new Vec2(0, 60);          //tilePos
    mercenaryEntryPos = new Vec2(0, -30);       //tilePos
    headquartersPos = new Vec2(0,-40);         //tilePos

    isPause:boolean = false;
    battleTimeStamp:number = 0;
    _battleCoin:number = 0;
    get battleCoin():number {
        return this._battleCoin;
    }
    set battleCoin(battleCoin:number){
        this._battleCoin = battleCoin;
        this.updateView("updateBattleCoin");
    }
    battleCoinAddPerTime:number = 2;
    battleMercenaryCountMax = 5;
    battleCoinInterval:number = 2000;       //2秒
    battleCoinLastTime:number = 0;

    SCALE_MERCENARY = 0.8
    SCALE_MONSTER = 0.8
    SCALE_MONSTER_BOSS = 1.0
    

    //方法
    init(){

    }

    load(){

    }

    getBattleTime(){
        return this.battleTimeStamp * 1000;
    }

    tryAddBattleCoin(dt:number){
        var nowTime = this.getBattleTime();
        if(nowTime > this.battleCoinLastTime){
            this.battleCoinLastTime = nowTime +  this.battleCoinInterval;
            this.battleCoin += this.battleCoinAddPerTime;           
        }
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
                var block = this.getBlock(task.pos.x,task.pos.y)
                if(block){
                    block.setFlag(Block.BLOCK_FLAG_ENUM.DIG);
                }
            }
        }
    }

    getTaskMapKey(task:TaskBase){
        var key = ""
        if(task instanceof DigTask || task instanceof BuildTask){
            key = js.formatStr("%s_%s_%s",task.type,task.pos.x,task.pos.y)
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
        this.taskMap[key] = null;
        return ret;
    }

    shiftTask(){
        var task = this.task.shift()
        return task;
    }

    getBlock(x: number, y: number) {        
        x = this.fixPosX(x);
        y = this.fixPosY(y); 
        // Debug.tryObject(this.blockMap[x][y], "blockList out")
        if (this.blockMap[x]) {
            return this.blockMap[x][y];
        } else {
            return null
        }
    }

    checkBlock(pos: Vec2) {
        var block = this.getBlock(pos.x,pos.y)
        if (block) {
            return ((block.id | Block.CROSS_VALUE) == 0 && block.buildingId == 0)
        } else {
            return false;
        }
    }

    //避免遍历死循环。
    checkBlockRoute(pos: Vec2) {
        var max_x =  this.margin_x * 2 + 1;
        var max_y =  this.margin_y * 2 + 1;
        var x = pos.x;
        var y = pos.y;
        if (x <= -max_x || x >=  max_x){
            return false
        }

        if (y <= -max_y || y >=  max_y){
            return false
        }

        var block = this.getBlock(pos.x,pos.y)
        if (block) {
            return ((block.id | Block.CROSS_VALUE) == 0 && block.buildingId == 0)
        } else {
            return false;
        }
    }


    getBuilding(x: number, y: number) {        
        x = this.fixPosX(x);
        y = this.fixPosY(y); 
        // Debug.tryObject(this.blockMap[x][y], "blockList out")
        if (this.buildingMap[x]) {
            return this.buildingMap[x][y];
        } else {
            return null
        }
    }

    fixPosX(x: number){
        var num =  this.margin_x * 2 + 1;
        x = x % num;
        if(x >= -this.margin_x && x <= this.margin_x){
            return x;
        }
        if(x < -this.margin_x){
            x = x + num;
        }else if(x > this.margin_x){
            x = x - num;
        }
        return x;
    }

    fixPosY(y: number){
        var num =  this.margin_y * 2 + 1;
        y = y % num;
        if(y >= -this.margin_y && y <= this.margin_y){
            return y;
        }
        if(y < -this.margin_y){
            y = y + num;
        }else if(y > this.margin_y){
            y = y - num;
        }
        return y;
    }

    obtainAugment(augment: Augment){       
        if(this.battleCoin > augment.price){
            this.battleCoin += -augment.price;
            this.mercenaryMgr.obtainAugment(augment);
        }        
    }
};

export function getMapProxy(): MapProxy {
    return MapProxy._instance;
}



