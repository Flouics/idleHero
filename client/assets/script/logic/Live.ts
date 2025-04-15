
import {MapUtils} from "./MapUtils";
import {UILive} from "../modules/map/UILive";
import { BoxBase }  from "./BoxBase";
import { getMapProxy, MapProxy }  from "../modules/map/MapProxy";
import {PoolMgr} from "../manager/PoolMgr";
import {StateMachine,STATE_ENUM} from "./stateMachine/StateMachine";
import { Node, v2, Vec2 } from "cc";
import { toolKit } from "../utils/ToolKit";
import { Debug }   from "../utils/Debug";
import { BulletMgr }  from "../manager/battle/BulletMgr";
import {App} from "../App";
import { BATTLE_TYPE_ENUM, RACE_ENUM } from "../modules/mercenary/MercenaryProxy";
import { Building }  from "./Building";
import { BuffData } from "../manager/battle/BuffMgr";
import { SkillData } from "../manager/battle/SkillMgr";
import { nullfun, getTimeFrame, empty } from "../Global";
import { DamageRet } from "../Interface";
import { BLOCK_CROSS_VALUE, BLOCK_VALUE_ENUM } from "./Block";

export class Live extends BoxBase {
    static SERRCH_TIME = 500;   // 500 毫秒搜索一次
    static MIN_DISTANCE = 5;

    baseMoveSpeed: number = 60;    //1秒
    moveSpeed: number = 1.0;
    baseMoveSpeedForce: number = 0;     //被动位移速度
    dirV2Force:Vec2 = null;             //被动位移的方向
    moveForceFinishTime:number = 0;

    race:number = RACE_ENUM.EMPTY;
    battleType:number = BATTLE_TYPE_ENUM.MELEE;
    atkBuffList:Array<number> = [];              //攻击附带的debuff特效
    skillList:Array<number> = [];                  //主动技能
    openLevel:number = 0;
    element:number = 0;
    atkTargetCount:number = 0;
    critRate:number = 0;
    critPower:number = 0;
    augmentList = [];
    coldTime:number = 0;
    level:number = 1;
    bulletId:number = 100101;
    data:any = null;    

    buffMap:Map<number,BuffData> = new Map();    
    skillMap:Map<number,SkillData> = new Map();
    skillAugmentAttrMap:Map<number,any> =  new Map();

    stateMachine:StateMachine = new StateMachine();      //执行的动作行为
    routeList:Vec2[] = [];    // 移动路径图
    ui:UILive = null;
    mapProxy:MapProxy = null;

    static _idIndex = 1;
    lastAttackTime:number = 0;
    lastMoveCheckTime:number = 0;

    constructor( x: number = 0, y: number = 0) {
        super()
        this.x = x;
        this.y = y;

        this.mapProxy = getMapProxy();
        this.stateMachine.regeditHandler(this.onEnterState.bind(this),this.onExitState.bind(this),this.onState.bind(this))       
    }

    getTime(){
        return getMapProxy().getMapTime();
    }

    onEnterState(params:any){
        var stateId = this.stateMachine.state.id;
        switch (stateId) {
            case STATE_ENUM.IDLE:
                this.ui?.playSkeletalAnimationByState(stateId);
                break;
            case STATE_ENUM.MOVING:
                this.moveStep();
                this.ui?.playSkeletalAnimationByState(stateId);
                break;
            case STATE_ENUM.ATTACK:
                //this.atkTarget();  
                this.updateDirectionByTarget();
                break;
            default:
                this.ui?.playSkeletalAnimationByState(stateId);
                break;
        }

        if(params?.cb){
            params.cb();
        }

    }

    onState(dt:number,params:any){  
        if (stateId != STATE_ENUM.STUN) {
            this.tryUseSkill(); //技能优先判断
        }        

        var stateId = this.stateMachine.state.id;
        switch (stateId) {
            case STATE_ENUM.IDLE:
                this.tryMoveToNextEmpty();
                break;
            case STATE_ENUM.MOVING:
                if(!this.checkMovingAction()){
                    this.doMovingAction(dt);
                }
                break;
            case STATE_ENUM.STUN:
                this.doMovingActionForce(dt);
                break;
            case STATE_ENUM.ASSAULT:
                this.doMovingActionAssault(dt);
                break;                
            case STATE_ENUM.ATTACK:
                this.atkTarget();
                break;
            default:
                break;
        }

        if(params?.cb){
            params.cb();
        }

    }

    onExitState(params:any){
        var stateId = this.stateMachine.state.id;
        switch (stateId) {
            case STATE_ENUM.MOVING:
                this.toTilePos = null;
                break;
            case STATE_ENUM.STUN:
                this.ui?.resumeSkeletalAnimation();
                break;
            case STATE_ENUM.ASSAULT:
            default:
                break;
        }

        if(params?.cb){
            params.cb();
        }
    }

    initUI(parent:Node,cb?:Function) {
        let pool = PoolMgr.instance.getPool(this._pb_tag);
        let node = pool.getItem(this);
        let viewPos = this.pos;
        let ui = node.getComponent(UILive);
        node.parent = parent; 
        node.setPosition(viewPos.x, viewPos.y);    
        this.bindUI(ui);     
        if(!!cb) cb(this);
    }

    moveToTilePos(toTilePos: Vec2) {
        var routeData = this.getMoveRoute(toTilePos)
        var moveRouteList = routeData.route
        var isPass = routeData.isPass
        if (!isPass){
            return false;
        }
        this.routeList = moveRouteList;
        this.ui.stopMoveAction();
        this.stateMachine.switchState(STATE_ENUM.MOVING);
        this.updateDirection(toTilePos);     
        return true;
    }

    updateDirectionByTarget(){
        if(!this.target){
            return;
        }
        var toPos = new Vec2(this.target.x,this.target.y);       
        this.updateDirection(toPos);
    }
    
    // 修改朝向
    updateDirection(toPos: Vec2){
        // 只有两个朝向
        if(this.getViewDistance(toPos) < Live.MIN_DISTANCE){
            return;
        }
        
        var dirV2 = MapUtils.getDirNormalizeV2(this.pos,toPos);
        this.dirV2 = dirV2;
        this.ui.updateDirection(dirV2)
    }

    getNearByPos(area: Vec2[]):Vec2 {
        return MapUtils.getNearByPos(area,this.pos);
    }
    //检查是否可以通过
    checkBlock(pos:Vec2){
        return this.mapProxy.checkBlock(pos);
    }

    //避免遍历死循环。
    checkBlockRoute(pos:Vec2){
        return this.mapProxy.checkBlockRoute(pos);
    }

    /**
     * 移动到附近空的格子
     */
    tryMoveToNextEmpty(){
        if (!empty(this.routeList)){
            return;
        }
        let block = this.mapProxy.getBlock(this.tx,this.ty);
        if (block && !block.checkType(BLOCK_CROSS_VALUE)){
            var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            for (const key in dirs) {
                let dir = dirs[key]
                let toTilePos = v2(this.tx + dir[0],this.ty + dir[1])
                block = this.mapProxy.getBlock(toTilePos.x,toTilePos.y);
                if (block && block.checkType(BLOCK_CROSS_VALUE)){
                    this.routeList = [toTilePos];
                    this.stateMachine.switchState(STATE_ENUM.MOVING);
                    return;
                }
            }
        } 
    }
    
    moveNext(){
        if(!this.checkAction()){
            // 执行队列行进路径
            var lastRoute = this.routeList.pop()
            if(!!lastRoute){
                this.moveTileStepCheck(lastRoute)
            }
        }
    }

    checkMovingAction(){       
        if(this.mapProxy.isBattle == false){
            return false;
        }
        
        // 战斗部分的判断
        var nowTimeStamp = this.getTime(); // 本地时间就够了 
        if (nowTimeStamp > this.lastMoveCheckTime){
            this.lastMoveCheckTime = nowTimeStamp + Live.SERRCH_TIME;
            var target = this.findTarget();
            if(!!target){                
                this.stateMachine.switchState(STATE_ENUM.ATTACK);
                this.updateDirection(target.pos);
                return true;
            }
            return false;
        }else{            
            return false;
        }
    } 

    setMoveActionForce(distance:number,dir:Vec2,baseMoveSpeedForce:number = this.baseMoveSpeed){
        this.baseMoveSpeedForce = baseMoveSpeedForce;
        var duration = distance / this.baseMoveSpeedForce * 1000;
        this.moveForceFinishTime = this.getTime() + duration;
        this.dirV2Force = dir;
        return duration;
    }
    
    //被动位移
    doMovingActionForce(dt:number){
        if(this.baseMoveSpeedForce == 0 || this.dirV2Force == null){
            return;
        }
        if(this.getTime() > this.moveForceFinishTime){
            this.baseMoveSpeedForce = 0;
            this.dirV2Force == null;
            return;
        }
        var distance = this.baseMoveSpeedForce * dt;
        var posDelta = new Vec2( distance * this.dirV2Force.x, distance * this.dirV2Force.y );
        var pos = this.pos.add(posDelta);
        this.x = pos.x;
        this.y = pos.y;
    }
    // 冲锋的位移
    doMovingActionAssault(dt:number){
        //根据moveSpeed去位移
        var toPos:Vec2;
        if(this.target && this.target.checkLive()){         // 有目标再跳转方向，否则不调整
            toPos = new Vec2(this.target.x,this.target.y);        
        }else{
            toPos = MapUtils.getViewPosByTilePos(this.toTilePos);
        }
        if (!toPos){
            this.stateMachine.switchState(STATE_ENUM.IDLE);
            return;
        }

        if (this.getViewDistance(toPos) < Live.MIN_DISTANCE){
            this.stateMachine.switchState(STATE_ENUM.IDLE);
            return;
        }
        this.updateDirection(toPos);
        var assaultSpeed = 720;
        var distance = assaultSpeed * dt;
        var posDelta = new Vec2( distance * this.dirV2.x, distance * this.dirV2.y );
        var pos = this.pos.add(posDelta);
        this.x = pos.x;
        this.y = pos.y;
    }
    
    doMovingAction(dt:number){
        //根据moveSpeed去位移
        var toPos:Vec2;
        if(this.target && this.target.checkLive()){         // 有目标再跳转方向，否则不调整
            toPos = new Vec2(this.target.x,this.target.y);        
        }else{
            toPos = MapUtils.getViewPosByTilePos(this.toTilePos);
        }
        if (!toPos){
            this.stateMachine.switchState(STATE_ENUM.IDLE);
            return;
        }

        if (this.getViewDistance(toPos) < Live.MIN_DISTANCE){
            this.stateMachine.switchState(STATE_ENUM.IDLE);
            return;
        }
        this.updateDirection(toPos);
        var distance = this.baseMoveSpeed * this.moveSpeed * dt;
        var posDelta = new Vec2( distance * this.dirV2.x, distance * this.dirV2.y );
        var pos = this.pos.add(posDelta);
        this.x = pos.x;
        this.y = pos.y;
    }

    checkAction():boolean{
        // 检查目标行为，如果有可执行目标就执行。
        // 子类就是需要处理具体行为。
        return false;
    }
    
    //只能移动到相邻的格子
    moveTileStepCheck(tilePos: Vec2) {
        if (this.getTileDistance(tilePos) > 1) {
            return;
        }
        this.stateMachine.switchState(STATE_ENUM.MOVING,{tilePos:tilePos})  
    }

    moveStep() {
        var toTilePos:Vec2;
        if(this.target && this.target.checkLive()){
            toTilePos = new Vec2(this.target.tx,this.target.ty);
        }else{
            toTilePos = this.routeList.pop();  
        }
        if (!toTilePos){
            this.stateMachine.trySwitchLastState();
            return;
        }    
        this.toTilePos = toTilePos;
        let toPos = MapUtils.getViewPosByTilePos(toTilePos);
        let routeDistance = MapUtils.getRouteDis(toTilePos,this.tilePos)
        let block = this.mapProxy.getBlock(toTilePos);
        let viewDistance = MapUtils.getLineDis(toPos,this.getUIPos());
        //距离小于最小一个单位的距离就不移动了。
        if(viewDistance <= this.mapProxy.blockWidth && !block.checkType(BLOCK_CROSS_VALUE)){        
            this.stateMachine.switchStateIdle();          
            return;
        }
        /**
        let duration = viewDistance / (this.baseMoveSpeed * this.moveSpeed);
        this.ui.moveStep(duration,toPos,() => {
            this.x = toPos.x;
            this.y = toPos.y;
            this.stateMachine.switchStateIdle();        
        }); 
        */
    }

    fixPositionByView(){
        var pos = this.node.position;
        this.x = pos.x;
        this.y = pos.y;
    }
    getMoveRoute(toTilePos:Vec2):{route:Array<Vec2>,isPass:boolean}{        
        return MapUtils.getRouteList(v2(this.tx,this.ty),toTilePos,this.checkBlockRoute.bind(this))
    }

    clear(){
        this.destory();
    }    

    isMelee(){
        return (this.battleType & BATTLE_TYPE_ENUM.MELEE) == BATTLE_TYPE_ENUM.MELEE;
    }

    isRange(){
        return (this.battleType & BATTLE_TYPE_ENUM.RANGE) == BATTLE_TYPE_ENUM.RANGE;
    }

    useSkill():boolean{
        var self = this;
        var targetList = this.findAllTargets();
        var flag = false;
        this.skillMap.forEach(skillData =>{
            if(!skillData.isCD()){
                if(self.mapProxy.skillMgr.tryUseSkill(this,targetList,skillData)){
                    flag = true;
                }
            }
        })
        return flag;
    }

    checkSkill():boolean{
        var flag = false;
        this.skillMap.forEach(skillData =>{
            if(!skillData.isCD()){
                flag = true;
            }
        })
        return flag;
    }

    genBullet(bulletId:number,cb:Function = nullfun){
        var bulletCfg = App.dataMgr.findById("bullet",bulletId);
        if(!!bulletCfg){
            var bullet =  BulletMgr.instance.create(this,this.target,this.pos,bulletCfg);
            if(bullet){
                cb(bullet);
            }
        }else{
            Debug.warn("Bullet is not Exsit",bulletId);
        }        
    }

    doAttackAction(){
        if (!this.target){
            return false;
        }
        if(!!this.ui?._directAction) return false; //调整方向，先不攻击。
        
        this.ui.playSkeletalAnimation(UILive.SKELETAL_ANIMATION_NAME.ATTACK);
        
        //先直接做延时，不绑定帧了
        this.ui.scheduleOnce(this.doAttack.bind(this),30 * getTimeFrame());
        return true;
    }

    doAttack(){
        if(this.isMelee()){
            this.target.onBeAtked(this.getDamageRet(),this);            
            this.onAtk(this.target);
        }else if(this.isRange()){
            this.genBullet(this.bulletId);
        }
    }

    tryUseSkill(){
        var nowTimeStamp = this.mapProxy.getMapTime();
        if(nowTimeStamp < this.lastAttackTime){
            return;
        }

        if(!this.checkSkill()){
            return;
        }

        var targetList = this.findAllTargets()
        if(targetList.length > 0){
            //发起施展技能
            this.ui.playSkeletalAnimation(UILive.SKELETAL_ANIMATION_NAME.SKILL);   
            //先直接做延时，不绑定帧了
            this.ui.scheduleOnce(this.useSkill.bind(this),15 * getTimeFrame());
            this.lastAttackTime = nowTimeStamp + this.atkColdTime / this.atkSpeed;  
        }        
    }
    
    atkTarget(){
        var nowTimeStamp = this.mapProxy.getMapTime();
        if(nowTimeStamp < this.lastAttackTime){
            return;
        }

        var atkCount = this.atkCount;
        for (let i = 0; i < atkCount; i++) {
            if(this.checkTarget()){            
                //发起攻击
                if(this.doAttackAction()){
                    this.lastAttackTime = nowTimeStamp + this.atkColdTime / this.atkSpeed;
                }                    
            }else{
                var target = this.findTarget();
                if(!!target){  //不浪费攻击机会，没有人可以选就打别人                  
                    this.target = target;
    
                    //调整方向
                    var toPos = new Vec2(this.target.x,this.target.y);       
                    this.updateDirection(toPos);
    
                    if(this.checkTargetInAtkRange(this.target)){
                        if(this.doAttackAction()){
                            this.lastAttackTime = nowTimeStamp + this.atkColdTime / this.atkSpeed;
                        }  
                    }else{
                        this.stateMachine.switchState(STATE_ENUM.MOVING);
                    }
                }else{  
                    this.stateMachine.switchState(STATE_ENUM.IDLE);
                }
            }        
        }        
    }

    checkCrossBuilding(building:Building){
        var area = building.getRealArea();
        var isCross = area.some((pos)=>{
            var viewPos = MapUtils.getViewPosByTilePos(pos);
            if(this.getViewDistance(viewPos) <= this.atkRange){
                return true
            }
        })       
        return !!isCross;
    }

    checkTargetInAtkRange(target: BoxBase){
        if(target instanceof Building){
            return this.checkCrossBuilding(target);
        }
                
        return super.checkTargetInAtkRange(target);
    }

    onBeAtked(damageRet:DamageRet,atker:BoxBase){     
        this.onDamaged(damageRet.damage)
        if(!this.checkLive()) {
            this.clear();
        }
        if(this.ui){
            this.ui.onBeAtked(damageRet.damage);
        }
        super.onBeAtked(damageRet,atker);
    }

    onDamaged(damage:number){
        if(damage == 0){
            return;
        }
        this.life += -damage;
        //Debug.log("onDamaged",this.name,this.life);
    }

    //skill相关的
    addSkill(skillId:number,data_1?:number,data_2?:number,data_3?:number){
        var skillData = new SkillData(skillId);
        skillData.init();
        if (skillData.type == 0){
            Debug.warn("addSkill fail ->",skillId);
            return;
        }
        var skillDataOld = this.skillMap.get(skillData.type);
        if(!!skillDataOld){
            if(skillDataOld.id > skillId){
                return;
            }          
            skillData = skillDataOld;
        }else{
            
            this.skillMap.set(skillData.type,skillData);
        }

        //只刷新必要的数据
        if(data_1){
            skillData.data_1 = data_1;
        }

        if(data_2){
            skillData.data_2 = data_2;
        }

        if(data_3){
            skillData.data_3 = data_3;
        }

        var skillAttrMap = this.skillAugmentAttrMap.get(skillId);      
        for (const key in skillAttrMap) {
            if (this.hasOwnProperty(key)){
                var attr = skillAttrMap[key];
                if(Array.isArray(attr)){
                    if(!toolKit.empty(attr)){
                        skillData[key] = toolKit.arrayAdd(skillData[key],attr);
                    }                    
                }else{
                    if(attr.percent != 0 || attr.value != 0){
                        var originValue = skillData[key];
                        var value = originValue * (100 + attr.percent)/100 + attr.value
                        skillData[key] = Math.ceil(toolKit.limitNum(value,0));
                    }
                }
            }
        }
    }

    //buff相关的
    addBuff(buffId:number,data_1?:number,data_2?:number,data_3?:number){
        var buffData = new BuffData(buffId);
        buffData.init();
        if (buffData.type == 0){
            Debug.warn("addBuff fail ->",buffId);
            return;
        }
        var buffDataOld = this.buffMap.get(buffData.type);
        if(!!buffDataOld){
            if(buffDataOld.id > buffId){
                return;
            }          
            buffData = buffDataOld;
        }else{
            
            this.buffMap.set(buffData.type,buffData);
        }

        //只刷新必要的数据
        buffData.clearTime = this.mapProxy.getMapTime() + buffData.duration;
        if(data_1){
            buffData.data_1 = data_1;
        }

        if(data_2){
            buffData.data_2 = data_2;
        }

        if(data_3){
            buffData.data_3 = data_3;
        }
    }

    clearBuff(buffData:BuffData){
        this.buffMap.delete(buffData.type);
        this.mapProxy.buffMgr.clearBuff(this,buffData);
    }

    checkBuff(){
        var nowTimeStamp = this.mapProxy.getMapTime();
        var self = this;
        this.buffMap.forEach(buffData =>{
            if(buffData.clearTime < nowTimeStamp){
                self.buffMap.delete(buffData.type);
                self.mapProxy.buffMgr.clearBuff(self,buffData);
            } 
        });
    }

    dealBuff(){
        var self = this;
        this.buffMap.forEach(buffData =>{   
            self.mapProxy.buffMgr.dealBuff(self,buffData);        //交给buffMg
        });
    }

    destory(isAction = false){
        //--todo表现
        this.buffMap.clear();
        super.destroy();
        if(isAction){
            this.ui?.playSkeletalAnimation(UILive.SKELETAL_ANIMATION_NAME.DIE);
        }else{
            this.ui.destory();
        };
    }
    update(dt:number){
        this.stateMachine.checkState(dt);
        this.dealBuff();
        this.checkBuff();        
    }
}