
import { Monster } from "../../logic/Monster";
import BaseClass from "../../zero/BaseClass";
import App from "../../App";
import { Node, Vec2, Vec3 } from "cc";
import { nullfun, TIME_FRAME } from "../../Global";
import { Debug }   from "../../utils/Debug";
import BattleMainView from "../../modules/map/BattleMainView";
import { MapProxy , getMapProxy } from "../../modules/map/MapProxy";
import MapUtils from "../../logic/MapUtils";
import { toolKit } from "../../utils/ToolKit";

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
    _mainView:BattleMainView = null;
    _nodeRoot:Node = null;
    _scheduleTask:ScheduleTask[] = [];
    proxy:MapProxy = null;
    waveData:any = null;
    isWaveEnd:boolean = false;

    init(battleMainView:BattleMainView){
        this._mainView = battleMainView;
        this._nodeRoot = battleMainView.nd_roleRoot;
        this.proxy = getMapProxy();
        this.reset()
    }
    
    initSchedule(){
        this._mainView.offScheduleEvent(this.getClassName(),this.update);
        this._mainView.onScheduleEvent(this.getClassName(),this.update.bind(this));
    }

    clear(){
        this._mainView.offScheduleEvent(this.getClassName(),this.update);
    }

    reset(){
        this._scheduleTask = [];
        this.monsterMap.forEach(monster =>{
            monster.destory();
        });
        this.monsterMap.clear();
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
                var monsterEntryPos = new Vec2(self.proxy.monsterEntryPos.x + toolKit.getRand(-10,10),self.proxy.monsterEntryPos.y)
                self.createMultiple(monsterId,count, monsterEntryPos, (monster: Monster) => {
                    //monster.moveToHeadquarters();
                });  
            });             
        }      
        
        var cmp = function(){
            self.isWaveEnd = true;
        }

        this.addScheduleTask(self.waveData.count,self.waveData.coldTime,{},createMonster,"createMonster",cmp);
    }

    checkAllMonstersAreClear(){
        return this.monsterMap.size == 0;
    }

    create(monsterType:number = 0,tilePos:Vec2,task?:Function){
        Debug.log("createMonster",monsterType,tilePos)
        var pos = MapUtils.getViewPosByTilePos(tilePos);
        let monster = new Monster(monsterType,pos.x,pos.y);
        monster.initUI(this._nodeRoot,()=>{
            if(!!task) task(monster);    
        });
        this.monsterMap.set(monster.idx, monster); 
        monster.scale = this.proxy.SCALE_MONSTER;

        return monster;
    }

    createMultiple(monsterType:number = 0,count:number = 1,tilePos:Vec2,data = {},task?:Function){
        var self = this;
        for (let i = 0; i < count; i++) {
            let offsetX = (i % 2 == 0 ? 1 : -1) * Math.floor((i+1)/2) * 9;
            App.asyncTaskMgr.newAsyncTask(()=>{
                self.create(monsterType,new Vec2(tilePos.x + offsetX ,tilePos.y),task);      
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
        var nowTime = this.proxy.getBattleTime();        
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
            monster.initUI(this._nodeRoot);
        })
    }
    
    clearMonster(idx:number){
        let obj = this.monsterMap.get(idx);
        if(obj){
            obj.destory();
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