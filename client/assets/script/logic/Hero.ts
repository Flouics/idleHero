import MapMainView from "../modules/map/MapMainView";
import MapUtils from "./MapUtils";
import { Live }  from "./Live";
import HeroMgr from "../manager/battle/HeroMgr";
import TaskBase from "./TaskBase";
import DigTask from "./task/DigTask";
import PoolMgr from "../manager/PoolMgr";
import StateMachine from "./stateMachine/StateMachine";
import App from "../App";
import BuildTask from "./task/BuildTask";
import CarryTask from "./task/CarryTask";
import { toolKit } from "../utils/ToolKit";
import BattleMainView from "../modules/map/BattleMainView";
import { MercenaryMgr } from "../manager/battle/MercenaryMgr";
import { MonsterMgr } from "../manager/battle/MonsterMgr";

export class Hero extends Live {
    baseMoveSpeed: number = 180;    //1秒
    carryWeight: number = 1000;     //负重
    task:TaskBase = null;
    heroMgr:HeroMgr = null;
    monsterMgr:MonsterMgr = null;
    mercenaryMgr:MercenaryMgr  = null;
    static _idIndex = 1000;
    _pb_tag:string = "" //PoolMgr.POOL_TAG_ENUM.HERO.tag;
    constructor(x: number = 0, y: number = 0) {
        super(x,y);
        this.idx = Hero._idIndex;
        Hero._idIndex += 1;
        this.init();
    }
    init(){
        this.heroMgr = HeroMgr.getInstance(HeroMgr);
        this.monsterMgr = MonsterMgr.getInstance(MonsterMgr);
        this.mercenaryMgr = MercenaryMgr.getInstance(MercenaryMgr);
    }

    onEnterState(params:any){
        var stateId = this.stateMachine.state.id;
        switch (stateId) {
            case StateMachine.STATE_ENUM.IDLE:
                this.clearTask();               
                break;
            case StateMachine.STATE_ENUM.DIG:   
                this.digBlock(this.task);                  
                break;
            case StateMachine.STATE_ENUM.BUILD:
                this.buildTower(this.task);                     
                break;
            case StateMachine.STATE_ENUM.MOVING:                     
                //break;
            default:
                super.onEnterState(params)
                break;
        }
    }

    onState(dt:number,params:any){
        var stateId = this.stateMachine.state.id;
        switch (stateId) {
            case StateMachine.STATE_ENUM.IDLE:
                this.fetchTask();
                break;
            default:
                super.onState(dt,params)
                break;
        }
    }
    
    //每一秒的检测
    update(dt:number){
        super.update(dt);
    }

    fetchTask(){
        if(this.task){
            this.checkAction();
        }else{
            var task = this.mapProxy.shiftTask();
            if(task){
                if(this.moveToPos(task.pos)){
                    this.task = task;                
                    return true;
                }else{
                    this.mapProxy.pushTask(task);   //无法完成的任务，重新塞回队列。
                    return false;
                }           
            }
            return false;
        }        
    }

    clearTask(){
        this.task = null;
        this.stateMachine.switchState(StateMachine.STATE_ENUM.IDLE);
    }

    fetchDigTask(){

    }
    digBlock(task:TaskBase){
        toolKit.showTip("执行挖掘的动作。");
        var pos = task.pos
        App.moduleMgr.command("map","digBlock",{pos : pos})
        this.stateMachine.switchState(StateMachine.STATE_ENUM.IDLE);
    }

    buildTower(task:TaskBase){
        toolKit.showTip("执行建设炮台的动作。");
        var pos = task.pos
        App.moduleMgr.command("map","buildTower",{pos : pos})
        this.stateMachine.switchState(StateMachine.STATE_ENUM.IDLE);
    }
    
    checkAction():boolean{
        // 检查目标行为，如果有可执行目标就执行。
        // 子类就是需要处理具体行为。        
        if(this.task){       
            if(this.task instanceof DigTask){
                var digPos = this.task.pos
                var block = this.mapProxy.getBlock(digPos.x,digPos.y);
                if(!block){
                    this.clearTask();
                    return false;
                }
                if(this.routeList.length < 1 || MapUtils.isNearBy(this.pos,this.task.pos)){                    
                    this.stateMachine.switchState(StateMachine.STATE_ENUM.DIG);
                    return true;
                }      
            }

            if(this.task instanceof BuildTask){
                var digPos = this.task.pos
                var block = this.mapProxy.getBlock(digPos.x,digPos.y);
                if(!block){
                    this.clearTask();
                    return false;
                }
                if(this.routeList.length < 1 || MapUtils.isNearBy(this.pos,this.task.pos)){                    
                    this.stateMachine.switchState(StateMachine.STATE_ENUM.BUILD);
                    return true;
                }      
            }        
            
            if(this.task instanceof CarryTask){
                this.clearTask();
                return false;
            }  
        }else{
            this.fetchTask();
        }
        return false;
    }
    clear(){
        this.heroMgr.clearHero(this.idx)
    }

    destory(){
        //--todo表现
        super.destory();
        let pool = PoolMgr.getInstance(PoolMgr).getPool(this._pb_tag);
        pool.recycleItem(this.node);
    }
}