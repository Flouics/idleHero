import MapMainView from "../../modules/map/MapMainView";
import { Building }  from "../Building";
import { BoxBase }  from "../BoxBase";
import MapUtils from "../MapUtils";
import DataMgr from "../../manager/DataMgr";
import { BulletMgr }  from "../../manager/battle/BulletMgr";
import { Monster } from "../Monster";
import { MonsterMgr } from "../../manager/battle/MonsterMgr";
import TowerMgr from "../../manager/battle/TowerMgr";
import TimeMgr from "../../manager/TimeMgr";
import { serialize } from "../../utils/Decorator";
import App from "../../App";
import { v2 } from "cc";
import BattleMainView from "../../modules/map/BattleMainView";
import { MapProxy , getMapProxy } from "../../modules/map/MapProxy";

export default class Tower extends Building {
    @serialize()
    static _idIndex = 1;
    @serialize()    
    bulletId = 100101;
    bulletCfg:any = {};
    towerMgr:TowerMgr = null;
    lastAttackTime:number = 0;
    mapProxy:MapProxy = null;
    constructor(mainView: BattleMainView) {
        super(mainView)
        this.init()
    } 
    init(){
        //不能直接引用TowerMgr，会导致交叉引用的问题。
        this.towerMgr = this._mainView.towerMgr;
        this.setIdx(Tower);  
        this.atk = 1;
        this.atkRange = 100;
        this.mapProxy = getMapProxy();
        this.setBullet(this.bulletId);
        this.initSchedule();
    }

    setBullet(bulletId:number){
        this.bulletId = bulletId;
        this.bulletCfg = App.dataMgr.findById("bullet",this.bulletId);
    }

    atkTarget(){
        if(this.target){
            var nowTimeStamp = this.mapProxy.getBattleTime();
            var deltaAngle = this.setDirection(this.target);
            if (Math.abs(deltaAngle) > 30){
                return
            }
            if(nowTimeStamp > this.lastAttackTime){
                this.genBullet()
                var coldTime = 2000; //todo
                this.lastAttackTime = nowTimeStamp + coldTime;
            }            
        }
    }

    setDirection(target:BoxBase){
        if (!this.ui){
            return
        }
        var angle = MapUtils.getAngle(v2(this.x,this.y),v2(target.x,target.y));
        var deltaAngle = angle - this.ui.node.angle;
        if (Math.abs(deltaAngle) > 180){
            if(deltaAngle > 0){
                deltaAngle += -360;
            }else{
                deltaAngle += 360;
            }
        }
        this.ui.playDirectAction(this.ui.node.angle + deltaAngle);
        return deltaAngle;
    }

    stopDirectAction(){
        if(this.ui){
            this.ui.stopDirectAction();
        }
    }

    addExtraTarget(target:BoxBase){
        if(this.targetExtraList.indexOf(target) == -1){
            this.targetExtraList.push(target)
        }
    }
    //寻找主目标
    findTarget(){
        var monsterMap = MonsterMgr.getInstance(MonsterMgr).monsterMap;
        var target:Monster = null;
        for (const key in monsterMap) {
            if (monsterMap.hasOwnProperty(key)) {                
                if(this.checkTargetIntoRange(monsterMap[key])){
                    target = monsterMap[key];
                    break;
                }                
            }
        }
        return target;
    }
    genBullet(){
        BulletMgr.getInstance(BulletMgr).create(this,this.target,this.pos,this.bulletCfg);
    }
    checkTargetIntoRange(target:BoxBase){
        if(target && target.checkLive()){            
            var distance  = MapUtils.getLineDis(target.getUIPos(),this.getUIPos())
            return  distance < this.atkRange;
        }
        return false;
    }
    clear(){
        this.towerMgr.clearTower(this.idx);        
    }    
    update(){
        if(this.target){
            if (!this.checkTargetIntoRange(this.target)) {
                this.target = null;
                this.stopDirectAction();                
            } else{
                this.atkTarget();
            }
        }else{
            this.target = this.findTarget();
            this.atkTarget();
        }
    }
}