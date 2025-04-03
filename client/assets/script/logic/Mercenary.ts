
import {MapUtils} from "./MapUtils";
import {TaskBase} from "./TaskBase";
import {POOL_TAG_ENUM} from "../manager/PoolMgr";
import {STATE_ENUM} from "./stateMachine/StateMachine";
import { MercenaryMgr } from "../manager/battle/MercenaryMgr";
import { MonsterMgr } from "../manager/battle/MonsterMgr";
import { toolKit } from "../utils/ToolKit";
import { Live }  from "./Live";
import { Monster } from "./Monster";
import { Vec2 } from "cc";

export class Mercenary extends Live {
    static _idIndex = 1000;
    _pb_tag:string = POOL_TAG_ENUM.MERCENARY.tag;
    quality: number = 1;     //品质
    baseMoveSpeed: number = 20;    //1秒
    
    task:TaskBase = null;
    mercenaryMgr:MercenaryMgr = null;
    monsterMgr:MonsterMgr = null;
    lastGenTime:number = 0;
    data = null;

    constructor(data:any, x: number = 0, y: number = 0) {
        super(x,y)
        this.id = data.id;
        this.idx = Mercenary._idIndex;
        Mercenary._idIndex += 1;
        this.data = data;
        this.init();
    }

    init(){
        this.monsterMgr = MonsterMgr.instance;
        this.mercenaryMgr = MercenaryMgr.instance;

        //基础数据初始化
        var data = this.data;    //是MercenaryData  并非是cfg的原始数据了。

        this.id = data.id;
        this.name = data.name;
        this.race = data.race;
        this.battleType = data.battleType;
        this.openLevel = data.openLevel;
        this.quality = data.quality;
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
        this.coldTime = data.coldTime;

        this.life = this.lifeMax;
        var self = this;
        this.skillList.forEach(skillId => {
            self.addSkill(skillId);
        })               
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
        super.update(dt);
    }

    fetchTask(){
        // 没有目标的，就定个目标
/*         var routeList = this.getMoveRoute(this.mapProxy.monsterEntryPos);
        this.routeList = routeList; */
        this.toPos = MapUtils.getViewPosByTilePos(this.mapProxy.monsterEntryPos);
        this.toPos.y = 0;//不要过半场
        this.toPos.x = toolKit.getRand(-200,200);

        this.stateMachine.switchState(STATE_ENUM.MOVING);
    }

    clearTask(){
        this.task = null;
        this.stateMachine.switchState(STATE_ENUM.IDLE);
    }
   
    checkAction():boolean{
        // 检查目标行为，如果有可执行目标就执行。
        // 子类就是需要处理具体行为。  
        if(this.stateMachine.isState(STATE_ENUM.ATTACK))   {
            if(this.checkTarget()){       
                
            }else{
                this.findTarget();
            }
        }        
        return false;
    }

    findTarget() {
        var monsterMap = this.monsterMgr.monsterMap;
        var targetList =  this.findTargetsByGroup(monsterMap);
        var target = targetList.shift();
        if(!!target){
            this.target = target;
            this.targetExtraList = targetList;
        }

        return target;
    }

    findAllTargets() {
        var monsterMap = this.monsterMgr.monsterMap;
        var targetList =  this.findTargetsByGroup(monsterMap);
        return targetList;
    }

    getTargetMap():Map<number,Monster>{
        var monsterMap = this.monsterMgr.monsterMap;
        return monsterMap;
    }

    clear(){
        this.mercenaryMgr.clearMercenary(this.idx)
    }
    
    getMoveRoute(toPos:Vec2){       
        return [toPos];             // 直接取终点。不存在障碍，直接取终点
    }

    destroy(isAction = false){
        //--todo表现
        super.destroy();     
    }
}