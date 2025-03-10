import { Mercenary } from "../../logic/Mercenary";
import UILive from "./UILive";

import { SkeletalAnimation, tween, Vec2, Vec3, _decorator} from 'cc';
import { uiKit } from "../../utils/UIKit";
import { toolKit } from "../../utils/ToolKit";
const {ccclass, property} = _decorator;

@ccclass("UIMercenary")
export default class UIMercenary extends UILive {    
    _baseUrl = "texture/mercenary/";
    _logicObj:Mercenary = null;
    reuse(data: any): void {
        super.reuse(data);
    }

    updateDirection(){
        if(!this._logicObj){
            return;
        }
        var logicObj = this._logicObj;
        if(!logicObj.dirV2){
            return;
        }
        var eulerAngle = toolKit.getEulerAngleByVec2(logicObj.dirV2);
        eulerAngle.z += -90;
        this.playDirectAction(eulerAngle.z);           
    }

    playDirectAction(angle:number):void {
        if(!!this._directAction) return;
        var duration = toolKit.limitNum(0.3 * Math.abs(angle) / 90,0,0.3);
        var self = this;
        if(this.sa_role){
            var eulerAngle = new Vec3(0,uiKit.getDeltaAngle(0,angle + 180),0);            
            this.sa_role.node.setRotationFromEuler(eulerAngle);
            eulerAngle.y = uiKit.getDeltaAngle(this.sa_role.node.eulerAngles.y,eulerAngle.y);
            var duration = toolKit.limitNum(0.3 * Math.abs(eulerAngle.y) / 90,0,0.3);
            this._directAction = tween(this.sa_role.node)
            .by(duration,
                {eulerAngles:eulerAngle})
            .call(() => {                
                //todo
                self.stopDirectAction();
            })                     
        }else{
            var eulerAngle = new Vec3(0,0,angle);
            eulerAngle.z = uiKit.getDeltaAngle(this.node.eulerAngles.z,eulerAngle.z);
            this._directAction = tween(this.node)
            .by(duration,
                { eulerAngles: eulerAngle})
            .call(() => {                
                //todo
                self.stopDirectAction();
            })
        }   
        self.stopDirectAction();
        //this._directAction.start();        
    }

    updateUI(){
        if(!this._logicObj){
            return
        }
        var self = this;
        var logicObj = this._logicObj
        
        var loadSpt = function(){
            let spt = self.spt_role;
            if(logicObj.id > 0){
                //self.loadSpt(spt, "" + logicObj.id)
                uiKit.setMercenaryImg(spt,logicObj.id,()=>{
                    if(spt.node.actor){
                        self.resetSkeletalAnimationRole(spt.node.actor);
                        self.playSkeletalAnimationByState(logicObj.stateMachine.state.id);
                        self.regSkeletalAnimationEvent();     
                        self.updateDirection();
                    }
                });
            }else{
                spt.spriteFrame = null;
            }       
        }
        this.updateDataToUI("mercenary.type",logicObj.id,()=>{
            loadSpt()           
        })
    }
}