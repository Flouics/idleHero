import { BoxBase }  from "../BoxBase";
import {UIBullet} from "../../modules/map/UIBullet";
import { MapProxy , getMapProxy } from "../../modules/map/MapProxy";
import {PoolMgr, POOL_TAG_ENUM} from "../../manager/PoolMgr";
import {MapUtils} from "../MapUtils";
import { BulletMgr }  from "../../manager/battle/BulletMgr";
import { Node, v2, Vec2 } from "cc";
import {BattleMainView} from "../../modules/map/BattleMainView";
import { g, Z_Max_2D } from "../../Global";
import { toolKit } from "../../utils/ToolKit";
import { DamageRet } from "../../Interface";

export class Bullet extends BoxBase {    
    moveSpeed: number = 120;    //1秒
    zSpeed:number = 120;   //1秒
    _mainView: BattleMainView = null;    //地图组件
    ui:UIBullet = null;
    bulletId:number = 100101;
    data:any = {};
    viewPos:Vec2 = v2(0,0);
    shooter:BoxBase = null;
    target:BoxBase = null;
    targetMap:any = null;
    bulletMgr:BulletMgr = null;
    clearTime:number = 0;
    duration:number = 10 * 1000;    
    mapProxy:MapProxy = null;
    g:number = g;
    _damageRet:DamageRet = {damage:0,isCrit:false};

    set damageRet(value:DamageRet){
        this._damageRet = value;
    }

    get damageRet(){
        return this._damageRet;
    }

    static _idIndex = 1;

    _pb_tag:string = POOL_TAG_ENUM.BULLET.tag;
    constructor(shooter:BoxBase,target:BoxBase, viewPos:Vec2,bulletData:any) {
        super()
        this.shooter = shooter;
        this.target = target;
        this.pos = viewPos;
        this.data = bulletData;
        this.data_1 = bulletData.data_1;
        this.data_2 = bulletData.data_2;
        this.data_3 = bulletData.data_3;

        this.setTargetMap();    
        this.init();
        this.setIdx(Bullet);        
        this.setDamageRet();       //防止shooter被回收了
    }

    init(){
        this.mapProxy  = getMapProxy();
        this.bulletMgr = this.mapProxy.bulletMgr;  
        if(this.data.duration > 0){
            this.duration = this.data.duration;
        }
        this.clearTime = this.mapProxy.getMapTime() + this.duration;
        this.moveSpeed = this.data.moveSpeed;
        this.lifeMax = this.data.lifeMax;
        this.life = this.lifeMax;
        this._dirV2 = null;
        this.cacZSpeed();
    }

    cacZSpeed(){
        if(this.data && this.data.height > 0){
            var distance = MapUtils.getLineDis(this.target.getUIPos(),this.getUIPos())
            var h = this.data.height;
            var t = distance * 0.5 / this.moveSpeed;
            var g = 2 * h / (t * t);
            var v = 0.5 * g * t;
            this.zSpeed = v;
            this.g = g;
        }
    }

    initUI(parent:Node,cb?:Function) {        
        //实现基本的子弹逻辑
        let pool = PoolMgr.instance.getPool(this._pb_tag);
        let node = pool.getItem(this);
        node.active = false;
        parent.addChild(node);
        this.bindUI(node.getComponent(UIBullet));
        if(!!cb) cb(this);        
        this.update(0);
        this.ui.updateDirection();       
        this._hasInit = true;        
    }

    getTargetMap(){
        this.setTargetMap(); //尝试刷新目标
        return this.targetMap;
    }

    setTargetMap(){
        if(this.shooter && this.shooter.getTargetMap){
            this.targetMap = this.shooter.getTargetMap();
        }
    }

    //重新获取目标
    resetTarget() {
        var self = this;
        var targetRet = null;
        var distanceRet = -1;
        if(this.shooter){
            var targetMap = this.shooter.getTargetMap();
            if(targetMap && targetMap.size > 0){
                targetMap.forEach(target => {
                    if(target && target.checkLive() ){
                        var distance = self.getViewDistance(target);
                        if(distanceRet == -1){
                            targetRet = target;
                            distanceRet = distance;
                        }else{
                            if(distance < distanceRet){
                                targetRet = target;
                                distanceRet = distance;
                            }
                        }
                    }
                });
            }    
        }
        if(targetRet){
            this.target = targetRet;
            return true;
        }
        return false;
    }
    

    clear(){
        this.bulletMgr.clearBullet(this.idx);       
    }

    checkTargetIntoRange(target:BoxBase){
        if(target && target.checkLive()){
            var targetBoundingBox = target.getBoundingBox();
            var bulletBoundingBox = this.getBoundingBox();
            if(targetBoundingBox && bulletBoundingBox){
                return toolKit.checkRectIntersect(
                    targetBoundingBox.rect          ,bulletBoundingBox.rect
                    ,targetBoundingBox.angle        ,bulletBoundingBox.angle
                    ,targetBoundingBox.anchorPoint  ,bulletBoundingBox.anchorPoint
                )
            }else{
                return false;
            }            
        }else{
            this.resetTarget();
            return false;
        }
        return false;
    }

    destroy(){
        //--todo表现
        super.destroy();
        this.ui.destory();  
    }

    getDamageRet(){        
        return this.damageRet;
    }

    setDamageRet(){
        var damageRet = this.shooter.getDamageRet();
        var damage = this.data.power * damageRet.damage /100;   
        damageRet.damage = damage;
        this.damageRet = damageRet;        
    }

    doAtk(){
        if(this.target && this.target.isDestroy == false){
            var self = this;
            this.target.onBeAtked(this.getDamageRet(),this.shooter);           
            this.data.atkBuffList.forEach(buffId=>{
                self.target.addBuff(buffId);
            })           
            this.onDamaged();
        }else{
            if(this.resetTarget()){
                
            }  
        }        
    }

    onDamaged(){
        this.life--;
        if(!this.checkLive()){
            this.clear();
        }     
    }
    
    updateTrajectory(dt:number){
        //弹道修正
        if(this.z <= 0 && this.zSpeed <= 0){
            this.z = 0;
            return;
        }
        var moveZ = this.zSpeed * dt;
        this.z = toolKit.limitNum(this.z + moveZ,0,Z_Max_2D);
        this.zSpeed += -this.g * dt;               
    }

    updateDirectionByTarget(){
        if(!!this.target){
            var dirV2 = this.target.getUIPos().subtract(this.getUIPos());
            dirV2.normalize();            
            this.dirV2 = dirV2;
        }else{
            this.dirV2 = new Vec2(0,0);
        }
    }

    onChangeDirV2(newDir:Vec2){
        if(!newDir){
            return;
        }
        if(this.dirV2 == null){
            //子弹先飞一点距离，和发射者位置错开
            var moveDis = 100;
            this.x = this.x + newDir.x * moveDis;
            this.y = this.y + newDir.y * moveDis;
        }
    }

    update(dt:number){
        if(!this.ui?.isReady){
            this.ui.update(dt); // ui还是继续刷
            return; // 等UI加载了再进行计算。
        }
        var moveDis = this.moveSpeed * dt;
        this.updateDirectionByTarget();

        // todo 角度。
        this.x = this.x + this.dirV2.x * moveDis;
        this.y = this.y + this.dirV2.y * moveDis;

        this.updateTrajectory(dt);

        this.ui.update(dt);

        if(this.checkTargetIntoRange(this.target)){
            this.doAtk();
        }else{
            if (this.clearTime < this.mapProxy.getMapTime()){
                this.clear()
            }
        }
    }

}