import { Node, Size, UITransform } from "cc";
import { Bullet }  from "./Bullet";
import { BoxBase }  from "../BoxBase";
import {PoolMgr} from "../../manager/PoolMgr";

//激光
export class Bullet_1010 extends Bullet {    
    _pb_tag:string = PoolMgr.POOL_TAG_ENUM.BULLET_1010.tag;

    checkInterval:number = 200; //200毫秒检测一次
    checkTime:number = 0
   
    init(){
        super.init();
    }

    initUI(parent:Node,cb?:Function) {        
        var self = this;
        super.initUI(parent,()=>{
            var size = new Size(self.data_1,self.data_2);          
            self.ui.resetSize(size);
            self.updateDirectionByTarget();
            self.ui.updatePosition();
            self.ui.updateDirection();
        });       
    }
    
    onDamaged(){
   
    }

    checkTargets(){
        var self = this;
        var targetMap = this.getTargetMap();
        if(targetMap && targetMap.size > 0){
            targetMap.forEach(target => {
                if(target && target.checkLive()){
                    if(self.checkTargetIntoRange(target)){                    
                        target.onBeAtked(self.getDamageRet(),self.shooter);            
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