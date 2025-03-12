import { getMapProxy } from "../../modules/map/MapProxy";
import { serialize } from "../../utils/Decorator";

export class State {
    @serialize()
    id:number = 0;      //执行的动作行为
    finishTime:number = 0;
    startTime:number = 0;
    exitParams:any = null;
    enterStateHandler:Function;             //进入状态执行函数
    onStateHandler:Function;                //处于状态执行函数
    exitStateHandler:Function;               //结束状态执行函数

    constructor(stateId:number,enterHandler?:Function,exitHandler?:Function,onHandler?:Function) {
        this.id = stateId;
        this.regeditHandler(enterHandler,exitHandler,onHandler);
    }


    setFinishTime(value:number){
        this.finishTime = value;
    }

    checkFinishTime(){
        if(this.finishTime > 0){
            if(this.getTime() >  this.finishTime){
                return true;
            }else{
                return false;
            }
        }
        return false;
    }

    getTime(){
        return getMapProxy().getMapTime();
    }

    enter(params:any,exitParams?:any){
        this.startTime = this.getTime();
        this.exitParams = exitParams;
        if(params?.duration){
            this.setFinishTime(this.getTime() + params.duration);
        }

        var handler = this.enterStateHandler;
        if(handler){
            handler(params)
        }            
    }

    exit(){
        var handler = this.exitStateHandler
        var exitParams = this.exitParams;
        this.exitParams = null; //保证一次性的
        if(handler){
            handler(exitParams)
        }

    }

    isState(stateId:number){
        return this.id == stateId
    }
    
    regeditHandler(enterHandler?:Function,exitHandler?:Function,onHandler?:Function){
        if(enterHandler){
            this.enterStateHandler = enterHandler
        }
        if(onHandler){
            this.onStateHandler = onHandler
        }
        if(enterHandler){
            this.exitStateHandler = exitHandler
        }
    }    
}