import { Node, TERRAIN_HEIGHT_BASE, Vec3 } from "cc";
import { Bullet }  from "./Bullet";

//指向子弹，不跟踪目标
export class Bullet_1002 extends Bullet {      
    updateDirectionByTarget() {        
        if (!this.dirV2){
            super.updateDirectionByTarget();
        }
    }

    checkTargetIntoRange_1002(){
        var targetMap = this.getTargetMap();
        var self = this;
        if(targetMap){
            for (const target of targetMap.values()) {
                if(target && target.checkLive()){
                    if(self.checkTargetIntoRange(target)){
                        this.target = target;
                        return true;
                    }
                }                
            }
        }
        return false
    }

    updateUIDirection(dt:number){
        var eulerAngleOrigon = this.node.eulerAngles;
        var deltaAngle = 360 * dt;
        var eulerAngle = new Vec3(eulerAngleOrigon.x,eulerAngleOrigon.y,eulerAngleOrigon.z + deltaAngle)
        this.node.setRotationFromEuler(eulerAngle)
    }

    update(dt: number): void {
        if(!this.ui?.isReady){
            this.ui.update(dt); // ui还是继续刷
            return; // 等UI加载了再进行计算。
        }
        
        var moveDis = this.moveSpeed * dt;
        //this.updateDirectionByTarget();

        if(this.dirV2){         // dirV2生成的时候去设置
            this.x = this.x + this.dirV2.x * moveDis;
            this.y = this.y + this.dirV2.y * moveDis;
        }

        this.updateTrajectory(dt);

        this.ui.update(dt);

        this.updateUIDirection(dt);

        if(this.checkTargetIntoRange_1002()){
            this.doAtk();
        }else{
            if (this.clearTime < this.mapProxy.getBattleTime()){
                this.clear()
            }   
        }
    }
}