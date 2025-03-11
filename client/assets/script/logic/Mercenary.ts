
import {MapUtils} from "./MapUtils";
import {TaskBase} from "./TaskBase";
import {PoolMgr} from "../manager/PoolMgr";
import {StateMachine} from "./stateMachine/StateMachine";
import { MercenaryMgr } from "../manager/battle/MercenaryMgr";
import { MonsterMgr } from "../manager/battle/MonsterMgr";
import { Augment } from "../manager/battle/AugmentMgr";
import { toolKit } from "../utils/ToolKit";
import { Debug }  from "../utils/Debug";
import { Live }  from "./Live";
import { Monster } from "./Monster";
import { empty } from "../Global";
import {UILive} from "../modules/map/UILive";
import { SkillData } from "../manager/battle/SkillMgr";

export class Mercenary extends Live {
    static _idIndex = 1000;
    _pb_tag:string = PoolMgr.POOL_TAG_ENUM.MERCENARY.tag;
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

        this.cacAllAugment();

        this.life = this.lifeMax;
        var self = this;
        this.skillList.forEach(skillId => {
            self.addSkill(skillId);
        })               
    }

    onObtainAugment(data:any){
        var self = this;
        this.augmentList = data.augmentList;
        var lifeMax = this.lifeMax;
        this.cacAllAugment();
        var deltaLife = this.lifeMax - lifeMax;
        if(deltaLife > 0){
            this.life += deltaLife;
        }        
        //重新计算技能属性
        this.skillList.forEach(skillId => {
            self.addSkill(skillId);
        })     
    }
    
    //计算增强的属性部分
    cacAllAugment(){
        var attrMap = {     
            coldTime:{value:0,percent:0}
            ,lifeMax:{value:0,percent:0}
            ,atk:{value:0,percent:0}
            ,atkBuffList:[]
            ,atkSpeed:{value:0,percent:0}
            ,atkRange:{value:0,percent:0}
            ,atkTargetCount:{value:0,percent:0}
            ,atkCount:{value:0,percent:0}
            ,critRate:{value:0,percent:0}
            ,critPower:{value:0,percent:0}
            ,moveSpeed:{value:0,percent:0}
            ,skillList:[]
        }

        this.skillAugmentAttrMap.clear();

        this.augmentList.forEach(augmentId=> {
            var augment = this.mapProxy.augmentMgr.getAugmentById(augmentId);
            if(augment.type >= 200 && augment.type < 300){
                // 技能强化的
                if(!empty(augment.skillList)){
                    augment.skillList.forEach((skillId)=>{
                        var skillAttrMap = this.skillAugmentAttrMap.get(skillId)
                        if(!skillAttrMap){
                            skillAttrMap = {
                                coldTime:{value:0,percent:0}            
                                ,atkBuffList:[]
                                ,atkTargetCount:{value:0,percent:0}
                                ,bulletId:0
                                ,data_1:0
                                ,data_2:0
                                ,data_3:0
                            }                
                        }
                        this.cacAugment(augment,skillAttrMap)
                        this.skillAugmentAttrMap.set(skillId,skillAttrMap)
                    })
                }
            }else{
                this.cacAugment(augment,attrMap)
            }            
        });

        this.doAllAugment(attrMap);
    }
    
    cacAugment(augment:Augment,attrMap:any){
        if(augment.type >= 200 && augment.type < 300){
            //技能
            for (const key in attrMap) {
                if (augment.hasOwnProperty(key)){
                    if(Array.isArray(augment[key])){
                        if(!Array.isArray(attrMap[key])){
                            Debug.log("attrMap->",key,"is not Array")
                        }else{
                            if(!toolKit.empty(augment[key])){
                                attrMap[key] = toolKit.arrayAdd(attrMap[key],augment[key]);
                            }
                        }
                    }else{
                        if(augment[key] > 0){
                            var value = Math.floor(augment[key] / 10);
                            var type = augment[key] % 10;
                            if(augment.isConflict == 0){
                                var level = this.mapProxy.augmentMgr.augmentGotLevelMap.get(augment.type) || 0;
                                value = value * level;
                            }
                            if(type == 1){
                                attrMap[key].value += value;
                            }else if(type == 2){
                                attrMap[key].percent += value;
                            }else{
                                attrMap[key].value += value;
                            }
                        }
                    }
                }            
            }
        }else{
            for (const key in attrMap) {
                if (augment.hasOwnProperty(key)){
                    if(Array.isArray(augment[key])){
                        if(!Array.isArray(attrMap[key])){
                            Debug.log("attrMap->",key,"is not Array")
                        }else{
                            if(!toolKit.empty(augment[key])){
                                attrMap[key] = toolKit.arrayAdd(attrMap[key],augment[key]);
                            }
                        }
                    }else{
                        if(augment[key] > 0){
                            var value = Math.floor(augment[key] / 10);
                            var type = augment[key] % 10;
                            if(augment.isConflict == 0){
                                var level = this.mapProxy.augmentMgr.augmentGotLevelMap.get(augment.type) || 0;
                                value = value * level;
                            }                            
                            if(type == 1){
                                attrMap[key].value += value;
                            }else if(type == 2){
                                attrMap[key].percent += value;
                            }else{
                                attrMap[key].value += value;
                            }
                        }
                    }
                }            
            }
        }
    }

    doAllAugment(attrMap:any){
        for (const key in attrMap) {
            if (this.hasOwnProperty(key)){
                var attr = attrMap[key];
                if(Array.isArray(attr)){
                    if(!toolKit.empty(attr)){
                        this[key] = toolKit.arrayAdd(this[key],attr);
                    }                    
                }else{
                    if(attr.percent != 0 || attr.value != 0){
                        var originValue = this.data[key];
                        var value = originValue * (100 + attr.percent)/100 + attr.value
                        this[key] = Math.ceil(toolKit.limitNum(value,0));
                    }
                }
            }
        }
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

        this.stateMachine.switchState(StateMachine.STATE_ENUM.MOVING);
    }

    clearTask(){
        this.task = null;
        this.stateMachine.switchState(StateMachine.STATE_ENUM.IDLE);
    }
   
    checkAction():boolean{
        // 检查目标行为，如果有可执行目标就执行。
        // 子类就是需要处理具体行为。  
        if(this.stateMachine.isState(StateMachine.STATE_ENUM.ATTACK))   {
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

    destory(isAction = false){
        //--todo表现
        super.destory(isAction);     
    }
}