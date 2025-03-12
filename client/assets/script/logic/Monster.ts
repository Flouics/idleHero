import { Live }  from "./Live";
import { MonsterMgr } from "../manager/battle/MonsterMgr";
import { Building }  from "./Building";
import {PoolMgr} from "../manager/PoolMgr";
import {StateMachine} from "./stateMachine/StateMachine";
import {App} from "../App";
import { Node, v2 } from "cc";
import { MercenaryMgr } from "../manager/battle/MercenaryMgr";
import { Mercenary } from "./Mercenary";
import {UILive} from "../modules/map/UILive";
export class Monster extends Live {
    baseMoveSpeed: number = 30;    //1秒
    static _idIndex = 100000;
    _pb_tag:string = PoolMgr.POOL_TAG_ENUM.MONSTER.tag;
    target:Live|Building = null;
    monsterMgr:MonsterMgr = null;
    mercenaryMgr:MercenaryMgr = null;
    constructor(monsterType:number,x: number = 0, y: number = 0) {
        super(x,y)
        this.setIdx(Monster);
        this.id = monsterType;
        this.init();
        this.name = "Monster_" +  this.idx;       
    }

    init(){
        this.initData();
        this.monsterMgr = MonsterMgr.instance;
        this.mercenaryMgr = MercenaryMgr.instance;
    }
    initData(){
        this.data = App.dataMgr.findById("monster",this.id);
        
        //基础数据初始化
        var data = this.data;
        this.id = data.id;
        this.name = data.name;
        this.race = data.race;
        this.battleType = data.battleType;
        this.openLevel = data.openLevel;
        this.element = data.element;
        this.lifeMax = data.lifeMax;
        this.atk = data.atk;
        this.atkBuffList = data.atkBuffList;
        this.atkSpeed = data.atkSpeed;
        this.searchRange = data.searchRange;
        this.atkRange = data.atkRange;
        this.atkTargetCount = data.atkTargetCount;
        this.atkCount = data.atkCount;
        this.augmentList = data.augmentList;
        this.moveSpeed = data.moveSpeed;
        this.skillList = data.skillList;
        this.bulletId = data.bulletId;

        this.life = this.lifeMax;
    }

    initUI(parent:Node,cb?:Function) {
        super.initUI(parent,cb);
    }

    clear(){
        this.monsterMgr.clearMonster(this.idx);        
    }    
    moveToHeadquarters(){
        var toPos = v2(this.x,this.y - 1000);
        this.moveToPos(toPos);
    }

    onEnterState(params:any){
        var stateId = this.stateMachine.state.id;
        switch (stateId) {
            default:
                super.onEnterState(params)
                break;
        }
    }
    
    onState(dt:number,params:any){
        var stateId = this.stateMachine.state.id;
        switch (stateId) {
            case StateMachine.STATE_ENUM.IDLE:                
                this.moveToHeadquarters();
                break;
            case StateMachine.STATE_ENUM.ATTACK:
                this.atkTarget();
                break;
            default:
                super.onState(dt,params)
                break;
        }
    }

    findTarget() {
        var mercenaryMap = this.mercenaryMgr.mercenaryMap;
        var targetList = this.findTargetsByGroup(mercenaryMap);
        var target = targetList.shift();
        if(!target){            
            if(this.checkCrossBuilding(this.mapProxy.headquarters)){
                target = this.mapProxy.headquarters;
                targetList = [];
            }
        }
        if(!!target){
            this.target = target;
            this.targetExtraList = targetList;
        }
        
        return target;
    }

    findAllTargets() {
        var mercenaryMap = this.mercenaryMgr.mercenaryMap;
        var targetList =  this.findTargetsByGroup(mercenaryMap);
        return targetList;
    }

    getTargetMap():Map<number,Mercenary>{
        var mercenaryMap = this.mercenaryMgr.mercenaryMap;
        return mercenaryMap;
    }

    update(dt:number){
        super.update(dt);
    }

    destroy(isAction = false){
        //--todo表现
        super.destroy(isAction);        
    }
}