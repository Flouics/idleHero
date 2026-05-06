import { Node, Size, UITransform } from "cc";
import { Bullet }  from "./Bullet";
import { BoxBase }  from "../BoxBase";
import {POOL_TAG_ENUM} from "../../manager/PoolMgr";

//激光
export class Bullet_1010 extends Bullet {    
    _pb_tag:string = POOL_TAG_ENUM.BULLET_1010.tag;

    checkInterval:number = 200; //200毫秒检测一次
    checkTime:number = 0
   
    init(){
        super.init();
    }

    initUI(parent:Node,cb?:Function) {        
        super.initUI(parent,()=>{
            var size = new Size(this.data_1,this.data_2);          
            this.ui.resetSize(size);
            this.updateDirectionByTarget();
            this.ui.updatePosition();
            this.ui.updateDirection();
        });       
    }
    
    onDamaged(){
   
    }

    checkTargets(){
        var targetMap = this.getTargetMap();
        if(targetMap && targetMap.size > 0){
            targetMap.forEach(target => {
                if(target && target.checkLive()){
                    if(this.checkTargetIntoRange(target)){                    
                        target.onBeAtked(this.getDamageRet(),this.shooter);            
                    }
                }
            });
        }        
    }

    update(dt:number){
        if(!this.ui?.isReady){
            this.ui.update(dt); // ui还是继续刷
            return; // 等UI加载了再进行计算。
        }
        
        if(!this.shooter.checkLive()){
            this.clear();
        }

        var nowTime = this.mapProxy.getMapTime()
        if(this.checkTime < nowTime){
            this.checkTime = nowTime + this.checkInterval;
            this.checkTargets();
        }        
        if (this.clearTime < nowTime){
            this.clear()
        }   
    }

}
