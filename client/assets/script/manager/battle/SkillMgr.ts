

import {BaseClass} from "../../zero/BaseClass";
import { getMapProxy } from "../../modules/map/MapProxy";
import { Live } from "../../logic/Live";
import {App} from "../../App";
import { Bullet_1020 } from "../../logic/bullet/Bullet_1020";
import { Bullet } from "../../logic/bullet/Bullet";
import { math, tween } from "cc";
import { toolKit } from "../../utils/ToolKit";
import {StateMachine} from "../../logic/stateMachine/StateMachine";

export class SkillData{
    id:number = 0;
    name:string = "";
    type:number = 0;
    power:number = 0;
    coldTime:number = 0;
    bulletId:number = 0;
    data_1:number = 0;
    data_2:number = 0;
    data_3:number = 0;
    lastCastTime:number = 0;
    element:number  = 0;
    atkBuffList:number[] = [];
    atkTargetCount:number = 0;
    data:any = null;

    constructor(skillId:number){
        this.id =  skillId;
    }
    init(){
        var data = App.dataMgr.findById("skill",this.id);
        if(!data){
            return;
        }
        this.name = data.name;
        this.type = data.type;
        this.power = data.power;
        this.coldTime = data.coldTime;
        this.element = data.element;
        this.atkBuffList = data.atkBuffList;
        this.atkTargetCount = data.atkTargetCount;
        this.bulletId = data.bulletId;
        this.data_1 = data.data_1;
        this.data_2 = data.data_2;
        this.data_3 = data.data_3;
        this.data = data;
    }

    isCD(){
        var nowTime = getMapProxy().getBattleTime();
        return this.lastCastTime >= nowTime;
    }
}

// 子弹管理器
export class SkillMgr extends BaseClass {  

    constructor(){
        super();
        SkillMgr._instance = this;
    }

    static get instance ():SkillMgr{
        if( SkillMgr._instance){
            return SkillMgr._instance as SkillMgr;
        }else{
            let instance = new SkillMgr();
            return instance
        }
    }

    clear(){
        
    }

    tryUseSkill(owner:Live,targetList:Live[],data:SkillData,cb?:Function){    
        var skillFunc = this["skillFunc_" + data.type].bind(this);
        if (!skillFunc) {
            return null;
        }   
        if(!data.isCD()){
            if(data.atkTargetCount > 0){
                targetList = targetList.slice(0,data.atkTargetCount - 1);
            }
            if(skillFunc(owner,targetList,data,cb)){
                data.lastCastTime = getMapProxy().getBattleTime()  + data.coldTime;
                return true
            }
            return false;
        }
        return false;
    }

    baseSkillFunc(owner:Live,targetList:Live[],data:SkillData,...args:any[]){
        //基础处理，先预留出来
        this.baseSkillAtk(owner,targetList,data,args);
        this.baseSkillBuff(owner,targetList,data,args);

    }
    baseSkillAtk(owner:Live,targetList:Live[],data:SkillData,...args:any[]){
        if(data.power > 0){
            if(data.bulletId > 0){      //需要导弹作为轨迹的
                // 交给子弹
                owner.genBullet(data.bulletId);
            }else{
                var damageRet = owner.getDamageRet()
                damageRet.damage =  damageRet.damage * data.power / 100;
                targetList.forEach(target => {
                    target.onBeAtked(damageRet,owner);
                })
            }
        }
    }

    baseSkillBuff(owner:Live,targetList:Live[],data:SkillData,...args:any[]){
        data.atkBuffList.forEach(buffId=>{
            targetList.forEach(target=>{
                target.addBuff(buffId,...args);
            })            
        })
    }

    //群体上毒
    skillFunc_1001(owner:Live,targetList:Live[],data:SkillData,cb?:Function){
        if(targetList.length < 1){
            return false;
        }
        var damage = owner.atk * data.data_1 / 100;
        this.baseSkillFunc(owner,targetList,data,damage);
        //正常的逻辑处理
        return true;
    }

    //群体灼烧
    skillFunc_1002(owner:Live,targetList:Live[],data:SkillData,cb?:Function){
        if(targetList.length < 1){
            return false;
        }
        var damage = owner.atk * data.data_1 / 100;
        this.baseSkillFunc(owner,targetList,data,damage);
        return true;
    }

    //三重箭
    skillFunc_1003(owner:Live,targetList:Live[],data:SkillData,cb?:Function){
        if(targetList.length < 1){
            return false;
        }
        var damage = owner.atk * data.data_1 / 100;
        var dirV2 = null;
        var index = 0;

        if(data.power > 0){
            if(data.bulletId > 0){      //需要导弹作为轨迹的
                var count = data.data_1;
                var angle = data.data_2;
                for (var i = 0; i < count;i++){
                    // 交给子弹
                    owner.genBullet(data.bulletId,function(bullet:Bullet){  
                        if(dirV2 == null){
                            bullet.updateDirectionByTarget();
                            dirV2 = bullet.dirV2;
                        }else{                           
                            //两边方向生成
                            var curAngle = (Math.floor(index / 2) + 1) * angle 
                            if(index % 2 == 0){
                                curAngle = -curAngle;
                            }
                            bullet.dirV2 = toolKit.getVec2ByVec2Rotate(dirV2,curAngle);                            
                        }       
                        index++;                 
                    });
                }  
            }
        }

        this.baseSkillBuff(owner,targetList,data,damage);

        return true;
    }

    //激光
    skillFunc_2001(owner:Live,targetList:Live[],data:SkillData,cb?:Function){
        if(targetList.length < 1){
            return false;
        }
        this.baseSkillFunc(owner,targetList,data);
        return true;
    }

    //卫星
    skillFunc_2002(owner:Live,targetList:Live[],data:SkillData,cb?:Function){
        if(data.power > 0){
            if(data.bulletId > 0){      //需要导弹作为轨迹的
                // 交给子弹
                var count =  data.data_1;
                var radian = 2 * Math.PI / count;
                for(let i = 0;i < count; i++){
                    owner.genBullet(data.bulletId,function( bullet:Bullet_1020){
                        bullet.radian = i * radian;
                        bullet.r =  bullet.data.data_1;
                        if(bullet.r > 0){
                            bullet.moveSpeed = bullet.data.moveSpeed / bullet.r;
                        }                        
                    });   
                } 
                            
            }
        }
        return true;
    }

    //冲锋
    skillFunc_3001(owner:Live,targetList:Live[],data:SkillData,cb?:Function){
            var self = this;
            if(data.power > 0){
                var target = targetList[0];
                var dirV2 = target.pos.subtract(owner.pos);
                var dirValue = toolKit.parseVec2ToNumNormalize(dirV2);
                var self = this;
                owner.stateMachine.switchState(StateMachine.STATE_ENUM.ASSAULT,null,{cb:()=>{
                    self.baseSkillAtk(owner,[target],data);        
                    self.baseSkillBuff(owner,[target],data,dirValue);
                    owner.stateMachine.switchState(StateMachine.STATE_ENUM.ATTACK)
                }});
            }
            return true;
        }

    update(dt:number){
  
    }
}