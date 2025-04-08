
import { Monster } from "../../logic/Monster";
import {BaseClass} from "../../zero/BaseClass";
import {App} from "../../App";
import { Node, Vec2, Vec3 } from "cc";
import { nullfun, getTimeFrame } from "../../Global";
import { Debug }   from "../../utils/Debug";
import { MapProxy , getMapProxy, MapProxy_event } from "../../modules/map/MapProxy";
import {MapUtils} from "../../logic/MapUtils";
import { toolKit } from "../../utils/ToolKit";
import { STATE_ENUM } from "../../logic/stateMachine/StateMachine";

// 怪物管理器
class ScheduleTask  {
    count:number = 0;
    interval:number = 0;
    task:Function = nullfun;
    cmp:Function = nullfun;
    data:any = null;
    lastUpdateTimeStamp:number = 0;
    constructor(count:number = 1,interval: number = 1000,data = {},task?:Function,cmp?:Function){
        this.count = count;
        this.interval = interval;
        this.data = data;
        if(task){
            this.task = task;
        }
        if(cmp){
            this.cmp = cmp;
        }       
        //this.lastUpdateTimeStamp = getMapProxy().getBattleTime();
    }
}
export class MonsterMgr extends BaseClass {
    monsterMap:Map<number,Monster> = new Map();
    _nd_root:Node = null;
    _scheduleTask:ScheduleTask[] = [];
    proxy:MapProxy = null;
    waveData:any = null;
    isWaveEnd:boolean = true;

    constructor(){
        super();
        MonsterMgr._instance = this;
    }

    static get instance ():MonsterMgr{
        if( MonsterMgr._instance){
            return MonsterMgr._instance as MonsterMgr;
        }else{
            let instance = new MonsterMgr();
            return instance
        }
    }

    init(root:Node){
        this._nd_root = root;
        this.proxy = getMapProxy();
        this.reset()
    }
    
    initSchedule(){
        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
        getMapProxy().on(MapProxy_event.MapProxy_update,this.update,this);
    }

    clear(){
        this._scheduleTask = [];
        this.monsterMap.forEach(monster =>{
            monster.destroy();
        });
        this.monsterMap.clear();

        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
    }

    reset(){
        this.clear();
        this.initSchedule();
    }

    setWaveData(data:any){
        this.waveData = data;
        this.isWaveEnd = false;
        this.checkWave();
    }

    checkWave(){
        var self = this;              
        if (!self.waveData){
            return;
        }
        var createMonster = function(){
            self.waveData.monsterList.forEach(monsterId => {
                var count = 1;
                var monsterEntryPos = new Vec2(
                                            self.proxy.monsterEntryPos.x + toolKit.getRand(-3,3)
                                            ,self.proxy.monsterEntryPos.y)
                self.createMultiple(monsterId,count, monsterEntryPos, (monster: Monster) => {
                    monster.stateMachine.switchState(STATE_ENUM.IDLE);
                });  
            });             
        }      
        
        var cmp = function(){
            self.isWaveEnd = true;
        }

        this.addScheduleTask(self.waveData.count,self.waveData.coldTime,{},createMonster,"createMonster",cmp);
    }

    checkAllMonstersAreClear(){
        return this.monsterMap.size == 0 && this.isWaveEnd == true;
    }

    create(monsterType:number = 0,tilePos:Vec2,task?:Function){
        Debug.log("createMonster",monsterType,tilePos)
        var pos = MapUtils.getViewPosByTilePos(tilePos);
        let monster = new Monster(monsterType,pos.x,pos.y);
        monster.initUI(this._nd_root,()=>{
            if(!!task) task(monster);    
        });
        this.monsterMap.set(monster.idx, monster); 
        monster.scale = this.proxy.SCALE_MONSTER;

        return monster;
    }

    createMultiple(monsterType:number = 0,count:number = 1,tilePos:Vec2,task?:Function){
        for (let i = 0; i < count; i++) {
            let offsetX = (i % 2 == 0 ? 1 : -1) * Math.floor((i + 1)/2) * 9;
            App.asyncTaskMgr.newAsyncTask(()=>{
                this.create(monsterType,new Vec2(tilePos.x + offsetX ,tilePos.y),task);      
            })           
        }
    }

    addScheduleTask(count:number = 1,interval: number,data:any = {},task:Function,key?:string,cmp?:Function){
        key = key || task.prototype.name;
        if (this._scheduleTask[key]){
            Debug.warn(this.getClassName(),"hasScheduleTask by key:",key);
        }
        var scheduleTask = new ScheduleTask(count,interval,data,task,cmp);
        this._scheduleTask[key] = scheduleTask;
    }

    updateScheduleTask(){
        var nowTime = this.proxy.getMapTime();        
        for (const key in this._scheduleTask) {
            var scheduleTask = this._scheduleTask[key];
            if (nowTime > scheduleTask.lastUpdateTimeStamp){
                scheduleTask.lastUpdateTimeStamp = nowTime + scheduleTask.interval;
                scheduleTask.count = scheduleTask.count - 1;
                scheduleTask.task();
                if (scheduleTask.count < 1){
                    scheduleTask.cmp();
                    delete this._scheduleTask[key];             
                }              
            }
        };
    }

    refresh(){
        this.monsterMap.forEach(monster =>{
            monster.initUI(this._nd_root);
        })
    }
    
    clearMonster(idx:number){
        let obj = this.monsterMap.get(idx);
        if(obj){
            obj.destroy();
        }
        this.monsterMap.delete(idx)
    }

    update(dt:number){
        this.monsterMap.forEach(monster =>{
            monster.update(dt);
        })        
        this.updateScheduleTask()
    }
}