import { getMapProxy } from "../../modules/map/MapProxy";
import { serialize } from "../../utils/Decorator";
import {State} from "./State";

export enum STATE_ENUM {
    NONE = 0,
    IDLE, 
    MOVING,
    ATTACK,
    DIG,
    BUILD,
    PATHFINDING,             // 寻路中
    GOTO_MINE,             //去挖矿
    MINING,                //挖矿ing
    CARRY_RESOURCES,     // 搬运资源
    DIE,
    STUN,               //眩晕
    ASSAULT,            //冲锋
}

export class StateMachine {
    state:State = new State(STATE_ENUM.NONE);      //执行的动作行为
    lastState:State = new State(STATE_ENUM.NONE);   //旧状态
    enterStateHandler:Function = ()=>{};             //进入状态执行函数
    onStateHandler:Function = ()=>{};                //处于状态执行函数
    exitStateHandler:Function = ()=>{};               //结束状态执行函数

    constructor(enterHandler?:Function,exitHandler?:Function,onHandler?:Function) {
        this.regeditHandler(enterHandler,exitHandler,onHandler);
    }

    switchState(stateId:number,enterParams?:any,exitParams?:any){
        if (this.isState(stateId)) {
            return;     //相同状态不切换
        }
        this.state.exit();
        this.lastState = this.state;
        this.state = new State(stateId,this.enterStateHandler,this.exitStateHandler,this.onStateHandler)
        this.state.enter(enterParams,exitParams)
    }
    //尝试将状态切换回上一次的状态，
    //如果状态相同，则切换成idle
    trySwitchLastState(){   
        if(this.isState(this.lastState.id)){
            this.switchState(STATE_ENUM.IDLE);
        }else{
            this.switchState(this.lastState.id);
        }     
    }

    switchStateIdle(){   
        this.switchState(STATE_ENUM.IDLE);
    }


    setDuration(duration:number){
        var value = this.state.getTime() + duration;
        this.state.setFinishTime(value);
    }

    checkState(dt:number,params?:any){
        var handler = this.onStateHandler
        if(handler){
            handler(dt,params)
        }
        if(this.state.checkFinishTime()){
            this.trySwitchLastState(); //返回之前的状态
        }
    }

    isState(stateId:number){
        return this.state.id == stateId
    }

    isLastState(stateId:number){
        return this.lastState.id == stateId
    }

    setLastState(stateId:number){
        this.lastState = new State(stateId,this.enterStateHandler,this.exitStateHandler,this.onStateHandler)
    }
    
    regeditHandler(enterHandler?:Function,exitHandler?:Function,onHandler?:Function){
        if(enterHandler){
            this.enterStateHandler = enterHandler
        }
        if(onHandler){
            this.onStateHandler = onHandler
        }
        if(exitHandler){
            this.exitStateHandler = exitHandler
        }
    }    
}