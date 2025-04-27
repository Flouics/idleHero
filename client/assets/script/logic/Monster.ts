import { Live }  from "./Live";
import { MonsterMgr } from "../manager/battle/MonsterMgr";
import { Building }  from "./Building";
import {PoolMgr, POOL_TAG_ENUM} from "../manager/PoolMgr";
import {StateMachine,STATE_ENUM} from "./stateMachine/StateMachine";
import {App} from "../App";
import { Node, v2, Vec2 } from "cc";
import { MercenaryMgr } from "../manager/battle/MercenaryMgr";
import { Mercenary } from "./Mercenary";
import {UILive} from "../modules/map/UILive";
export class Monster extends Live {
    baseMoveSpeed: number = 60;    //1秒
    static _idIndex = 100000;
    _pb_tag:string = POOL_TAG_ENUM.MONSTER.tag;
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
        this.moveSpeed = 2.0;//data.moveSpeed;
        this.skillList = data.skillList;
        this.bulletId = 100101;    //data.bulletId;

        this.life = this.lifeMax;
    }

    initUI(parent:Node,cb?:Function) {
        super.initUI(parent,cb);
    }

    clear(){
        this.monsterMgr.clearMonster(this.idx);        
    }    
    moveToHeadquarters(){
        var toPos = v2(this.x,this.y - 20);
        this.moveToTilePos(toPos);
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
                //this.moveToHeadquarters();
                break;
            case STATE_ENUM.ATTACK:
                this.atkTarget();
                break;
            default:
                super.onState(dt,params)
                break;
        }
    }

    findTarget() {
        return null;
    }

    findAllTargets() {
        var mercenaryMap = this.mercenaryMgr.mercenaryMap;
        var targetList = [];
        mercenaryMap.forEach(mercenary => {
            targetList.push(mercenary);
        })
        return targetList;
    }

    getTargetMap():Map<number,Mercenary>{
        var mercenaryMap = this.mercenaryMgr.mercenaryMap;
        return mercenaryMap;
    }

    update(dt:number){
        super.update(dt);
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