import {MapMainView} from "../modules/map/MapMainView";
import {MapUtils} from "./MapUtils";
import { Live }  from "./Live";
import {HeroMgr} from "../manager/battle/HeroMgr";
import {TaskBase} from "./TaskBase";
import {DigTask} from "./task/DigTask";
import {PoolMgr, POOL_TAG_ENUM} from "../manager/PoolMgr";
import {StateMachine,STATE_ENUM} from "./stateMachine/StateMachine";
import {App} from "../App";
import {BuildTask} from "./task/BuildTask";
import {CarryTask} from "./task/CarryTask";
import { toolKit } from "../utils/ToolKit";
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
    _pb_tag:string = POOL_TAG_ENUM.HERO.tag;
    constructor(x: number = 0, y: number = 0) {
        super(x,y);
        this.idx = Hero._idIndex;
        Hero._idIndex += 1;
        this.init();
    }
    init(){
        this.heroMgr = HeroMgr.instance;
        this.monsterMgr = MonsterMgr.instance;
        this.mercenaryMgr = MercenaryMgr.instance;
    }

    onEnterState(params:any){
        var stateId = this.stateMachine.state.id;
        switch (stateId) {
            case STATE_ENUM.DIG:
                if(this.task){
                    this.digBlock(this.task);
                }else{
                    this.stateMachine.switchStateIdle();
                }
                                  
                break;
            case STATE_ENUM.BUILD:
                this.buildTower(this.task);                     
                break;
            default:
                super.onEnterState(params)
                break;
        }
    }

    onState(dt:number,params:any){
        var stateId = this.stateMachine.state.id;
        switch (stateId) { 
            case STATE_ENUM.NONE:
                this.stateMachine.switchState(STATE_ENUM.IDLE);
                break;
            case STATE_ENUM.IDLE:
                this.fetchTask();
                break;
            default:
                super.onState(dt,params)
                break;
        }
    }
    
    //每一秒的检测
    update(dt:number){
        this.mapProxy.isBattle == false && super.update(dt);
    }

    fetchTask(){
        if(this.task){
            this.checkAction();
        }else{
            var task = this.mapProxy.shiftTask();
            if(task){
                if(this.moveToTilePos(task.tilePos)){
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
        this.stateMachine.switchState(STATE_ENUM.IDLE);
    }

    digBlock(task:TaskBase){
        if(!task) return;
        toolKit.showTip("执行挖掘的动作。");
        var tilePos = task.tilePos;
        App.moduleMgr.command("map","digBlock",{tilePos : tilePos})
        this.stateMachine.switchState(STATE_ENUM.IDLE);
        this.clearTask();
    }

    buildTower(task:TaskBase){
        toolKit.showTip("执行建设炮台的动作。");
        var tilePos = task.tilePos
        App.moduleMgr.command("map","buildTower",{tilePos : tilePos})
        this.stateMachine.switchState(STATE_ENUM.IDLE);
        this.clearTask();
    }
    
    checkAction():boolean{
        // 检查目标行为，如果有可执行目标就执行。
        // 子类就是需要处理具体行为。        
        if(this.task){       
            if(this.task instanceof DigTask){
                var digPos = this.task.tilePos
                var block = this.mapProxy.getBlock(digPos.x,digPos.y);
                if(!block){
                    this.clearTask();
                    return false;
                }
                if(this.routeList.length < 1 && MapUtils.isNearBy(this.tilePos,this.task.tilePos)){                    
                    this.stateMachine.switchState(STATE_ENUM.DIG);
                    return true;
                }else{
                    this.stateMachine.switchState(STATE_ENUM.MOVING);
                }      
            }

            if(this.task instanceof BuildTask){
                var digPos = this.task.tilePos
                var block = this.mapProxy.getBlock(digPos.x,digPos.y);
                if(!block){
                    this.clearTask();
                    return false;
                }
                if(this.routeList.length < 1 || MapUtils.isNearBy(this.tilePos,this.task.tilePos)){                    
                    this.stateMachine.switchState(STATE_ENUM.BUILD);
                    return true;
                }else{
                    this.stateMachine.switchState(STATE_ENUM.MOVING);
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

    destroy(){
        //--todo表现
        super.destroy();
        if(this.node && this.node.isValid){
            let pool = PoolMgr.instance.getPool(this._pb_tag);
            pool.recycleItem(this.node); 
        }
    }
}