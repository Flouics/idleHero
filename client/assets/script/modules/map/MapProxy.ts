/*
 * 用户数据
 */

import { Proxy }from "../base/Proxy";
import {Block, BLOCK_FLAG_ENUM, BLOCK_CROSS_VALUE, BLOCK_VALUE_ENUM} from "../../logic/Block";
import {DigTask} from "../../logic/task/DigTask";
import {TaskBase} from "../../logic/TaskBase";
import {MapUtils} from "../../logic/MapUtils";
import { serialize } from "../../utils/Decorator";
import {BuildTask} from "../../logic/task/BuildTask";
import { Debug }   from "../../utils/Debug";
import { js, Vec2 } from "cc";
import {MapCommand} from "./MapCommand";


export let MapProxy_event = {
    MapProxy_update : "MapProxy_update",
}

//四个方向
let dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

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
    
    task:TaskBase[] = [];
    taskMap = {}

    monsterEntryPos = new Vec2(0, 8);          //tilePos
    monsterBattlePos = new Vec2(0, 2);          //tilePos
    mercenaryEntryPos = new Vec2(0, -2);       //tilePos

    isPause:boolean = false;
    isBattle:boolean = false;
    battleTimeStamp:number = 0;
    @serialize()
    digBlockCost = 0;    

    SCALE_MERCENARY = 0.8;
    SCALE_MONSTER = 0.8;
    SCALE_MONSTER_ELIT = 1.0;
    BASE_DIG_BLOCK_COST = 50;    
    
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
        if(this.digBlockCost == 0){
            this.digBlockCost = this.BASE_DIG_BLOCK_COST;
        }
    }

    update(dt:number){
        !this.isPause && (this.battleTimeStamp += dt);

        this.emit(MapProxy_event.MapProxy_update,dt);
    }

    /**
     * 战斗时间
     * @returns 毫秒
     */
    getMapTime(){
        return this.battleTimeStamp * 1000;
    }

    dumpPrepare(){
        let mapToJson = function(map){
            let json = {}
            for (var i in map) {
                json[i] = {}
                for (var j in map[i]) {
                    json[i][j] = map[i][j].serialize();
                }
            }
            return json
        }

        this.blockMapJson = mapToJson(this.blockMap);     
    }

    getBlockJson(x: number, y: number){
        if(this.blockMapJson[x]){
            return this.blockMapJson[x][y];
        }else{
            return null;
        }        
    }

    reloadPrepare(){
        Debug.log("reloadPrepare Map")
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

    updateAllBlockFlag(){
        let hasSetMap = {}
        for (var x in this.blockMap) {
            for (var y in this.blockMap[x]) {
                if(hasSetMap[x] && hasSetMap[x][y]){
                    // 已经检查过了。
                    continue;
                }
                let block = this.blockMap[x][y];
                if(!block){
                    continue;
                }
                
                if (block.checkType(BLOCK_VALUE_ENUM.EMPTY)){
                    hasSetMap[x] = hasSetMap[x] || {}
                    hasSetMap[x][y] = block;
                    block.clearFlag();                    
                    for (const dir of dirs) {
                        let block_check = this.getBlock(block.tx + dir[0],block.ty + dir[1]);
                        if(block_check){
                            hasSetMap[x] = hasSetMap[x] || {}
                            hasSetMap[x][y] = block_check;
                            block_check.clearFlag();
                        }
                    }
                    
                }
            }
        }
    }

    /**
     * 刷新四周block的flag
     * @param block 
     */
    updateBlockFlag(block:Block){
        if (block.checkType(BLOCK_VALUE_ENUM.EMPTY)){                 
            for (const dir of dirs) {
                block = this.getBlock(block.tx + dir[0],block.ty + dir[1]);
                if(block){
                    block.clearFlag();
                }
            }            
        }
    } 
};

export function getMapProxy(): MapProxy {
    return MapProxy._instance;
}



