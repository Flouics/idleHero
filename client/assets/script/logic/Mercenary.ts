
import {MapUtils} from "./MapUtils";
import {TaskBase} from "./TaskBase";
import {POOL_TAG_ENUM, PoolMgr} from "../manager/PoolMgr";
import {STATE_ENUM} from "./stateMachine/StateMachine";
import { MercenaryMgr } from "../manager/battle/MercenaryMgr";
import { MonsterMgr } from "../manager/battle/MonsterMgr";
import { toolKit } from "../utils/ToolKit";
import { Live }  from "./Live";
import { Monster } from "./Monster";
import { Vec2 } from "cc";
import { clone } from "../Global";

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
        this.bulletId = 100101;//data.bulletId;
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
            case STATE_ENUM.MOVING:
                break;
            default:
                super.onEnterState(params)
                break;
        }
    }

    onState(dt:number,params:any){
        var stateId = this.stateMachine.state.id;
        switch (stateId) {
            case STATE_ENUM.IDLE:
                //this.fetchTask();
                break;
            default:
                super.onState(dt,params)
                break;
        }
    }
    moveStep() {
            var toTilePos:Vec2;
            if(this.target && this.target.checkLive()){
                toTilePos = new Vec2(this.target.tx,this.target.ty);
            }else{
                toTilePos = this.toTilePos;  
            }
            if (!toTilePos){
                this.stateMachine.trySwitchLastState();
                return;
            }    
            let toPos = MapUtils.getViewPosByTilePos(toTilePos);
            let viewDistance = MapUtils.getLineDis(toPos,this.getUIPos());
            //距离小于最小一个单位的距离就不移动了。
            if(viewDistance < Live.MIN_DISTANCE){        
                this.stateMachine.switchStateIdle();          
                return;
            }
        }
    
    //每一秒的检测
    update(dt:number){
        super.update(dt);
    }

    fetchTask(){
        // 没有目标的，就定个目标
        if(this.target){
            if(this.checkTarget()){
                this.stateMachine.switchState(STATE_ENUM.ATTACK)
                return;
            }else{
                if(!this.target.checkLive()){
                    this.target = null;
                }                
            }            
        }else{
            if(!this.findTarget()){
                this.toTilePos = clone(this.mapProxy.monsterEntryPos);
                this.toTilePos.y = 0;//不要过半场
                this.toTilePos.x = 0; //toolKit.getRand(-10,10);
                this.stateMachine.switchState(STATE_ENUM.MOVING);
            }
        }
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
        return null;
    }

    findAllTargets() {
        var monsterMap = this.monsterMgr.monsterMap;
        var targetList = []
        monsterMap.forEach(monster => {
            targetList.push(monster);
        })
        return targetList;
    }

    getTargetMap():Map<number,Monster>{
        var monsterMap = this.monsterMgr.monsterMap;
        return monsterMap;
    }

    clear(){
        this.mercenaryMgr.clearMercenary(this.idx)
    }
    
    getMoveRoute(toPos:Vec2):{route:Array<Vec2>,isPass:boolean}{       
        return {route:[toPos],isPass:true};             // 直接取终点。不存在障碍，直接取终点
    }

    destroy(isAction = false){
        //--todo表现
        super.destroy();     
        if(this.node && this.node.isValid){
            let pool = PoolMgr.instance.getPool(this._pb_tag);
            pool.recycleItem(this.node); 
        }
    }
}