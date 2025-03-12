import { math, Node, Size, UITransform } from "cc";
import { Bullet }  from "./Bullet";
import { BoxBase }  from "../BoxBase";
import { toolKit } from "../../utils/ToolKit";

//卫星
export class Bullet_1020 extends Bullet {    
    checkInterval:number = 200; //200毫秒检测一次
    checkTime:number = 0;
    radian:number = 0;
    r:number = 0;

    init(){
        super.init();
    }

    initUI(parent:Node,cb?:Function) {        
        super.initUI(parent,cb);
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

    // 围绕在shooter身上
    update(dt:number){
        if(!this.ui?.isReady){
            this.ui.update(dt); // ui还是继续刷
            return; // 等UI加载了再进行计算。
        }
        
        if(!this.shooter.checkLive()){
            this.clear();
        }
        this.radian += this.moveSpeed * dt;
        var dirV2 = toolKit.getVec2ByRadian(this.radian);      
        var r = this.r;
        this.dirV2 = dirV2;
        this.x = this.shooter.x + r * dirV2.x;
        this.y = this.shooter.y + r * dirV2.y;
        
        this.ui.update(dt);
        this.ui.updateDirection();

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