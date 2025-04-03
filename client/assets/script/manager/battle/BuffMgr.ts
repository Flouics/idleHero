
import { BoxBase }  from "../../logic/BoxBase";
import {BaseClass} from "../../zero/BaseClass";
import { Live } from "../../logic/Live";
import {App} from "../../App";
import { MapProxy , getMapProxy } from "../../modules/map/MapProxy";
import { Debug } from "../../utils/Debug";
import {STATE_ENUM} from "../../logic/stateMachine/StateMachine";
import { toolKit } from "../../utils/ToolKit";

export class BuffData{
    id:number = 0;
    type:number = 0;
    power:number = 0;
    interval:number = 0;
    duration:number = 0;
    data_1:number = 0;
    data_2:number = 0;
    data_3:number = 0;
    lastEffetTime:number = 0;
    clearTime:number = 0;
    element:number  = 0;
    data:any = null;

    constructor(buffId:number){
        this.id =  buffId;
    }
    init(){
        var data = App.dataMgr.findById("buff",this.id);
        if(!data){
            return;
        }
        this.type = data.type;
        this.power = data.power;
        this.interval = data.interval;
        this.duration = data.duration;
        this.element = data.element;
        this.data_1 = data.data_1;
        this.data_2 = data.data_2;
        this.data_3 = data.data_3;
        this.data = data;
    }
}

// buff管理器
export class BuffMgr extends BaseClass {

    constructor(){
        super();
        BuffMgr._instance = this;
    }

    static get instance ():BuffMgr{
        if( BuffMgr._instance){
            return BuffMgr._instance as BuffMgr;
        }else{
            let instance = new BuffMgr();
            return instance
        }
    }

    clear(){

    }

    dealBuff(owner:Live,data:BuffData,cb?:Function){    
        var buffFunc = this["buffFunc_" + data.type];
        if (!buffFunc) {
            Debug.warn("BuffMgr deal buff failed by type",data.type)
            return null;
        }   
        buffFunc = buffFunc.bind(this);
        var nowTime = getMapProxy().getMapTime();
        if(data.lastEffetTime < nowTime){
            data.lastEffetTime = nowTime + data.interval;
            buffFunc(owner,data,cb); 
        }       
    }

    baseBuffFunc(owner:Live,data:BuffData){
        //基础处理，先预留出来

    }

    //毒系伤害
    buffFunc_1001(owner:Live,data:BuffData,cb?:Function){
        this.baseBuffFunc(owner,data)
        //正常的逻辑处理
        var value = data.data_1;  //data_1  存储伤害
        owner.onDamaged(value);
    }

    
    //灼烧伤害
    buffFunc_1002(owner:Live,data:BuffData,cb?:Function){
        this.baseBuffFunc(owner,data)
        //正常的逻辑处理
        var value = data.data_1;  //data_1  存储伤害
        owner.onDamaged(value);
    }

    //被击退
    buffFunc_1003(owner:Live,data:BuffData,cb?:Function){
        this.baseBuffFunc(owner,data)
        //正常的逻辑处理       
        var dir = toolKit.parseNumToVec2Normalize(data.data_1);
        var distance = data.data_2;  //data_1  被击退的距离
        var duration = owner.setMoveActionForce(distance,dir,600);
        owner.stateMachine.switchState(STATE_ENUM.STUN,{duration:duration});     
        owner.clearBuff(data); //一次性的。
    }

    clearBuff(owner:Live,buffData:BuffData){
        // todo 清除状态需要处理的事件，大部分不需要
    }

    update(dt:number){
  
    }
}