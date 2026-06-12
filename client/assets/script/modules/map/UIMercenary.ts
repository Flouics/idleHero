import { Mercenary } from "../../logic/Mercenary";
import {UILive} from "./UILive";

import { SkeletalAnimation, tween, Vec2, Vec3, _decorator, Node} from 'cc';
import { uiKit } from "../../utils/UIKit";
import { toolKit } from "../../utils/ToolKit";
const {ccclass, property} = _decorator;

@ccclass("UIMercenary")
export class UIMercenary extends UILive {    
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
        if(false && this.sp_role){
            var eulerAngle = new Vec3(0,uiKit.getDeltaAngle(0,angle + 180),0);            
            this.sp_role.node.setRotationFromEuler(eulerAngle);
            eulerAngle.y = uiKit.getDeltaAngle(this.sp_role.node.eulerAngles.y,eulerAngle.y);
            var duration = toolKit.limitNum(0.3 * Math.abs(eulerAngle.y) / 90,0,0.3);
            this._directAction = tween(this.sp_role.node)
            .by(duration,
                {eulerAngles:eulerAngle})
            .call(() => {                
                //todo
                this.stopDirectAction();
            })                     
        }else{
            var eulerAngle = new Vec3(0,0,angle);
            eulerAngle.z = uiKit.getDeltaAngle(this.node.eulerAngles.z,eulerAngle.z);
            this._directAction = tween(this.node)
            .by(duration,
                { eulerAngles: eulerAngle})
            .call(() => {                
                //todo
                this.stopDirectAction();
            })
        }   
        this.stopDirectAction();
        //this._directAction.start();        
    }

    updateUI(){
        if(!this._logicObj){
            return
        }
        var logicObj = this._logicObj
        
        var loadSpt = () => {
            let spt = this.spt_role;
            if(logicObj.id > 0){
                //self.loadSpt(spt, "" + logicObj.id)
                uiKit.setMercenaryImg(spt,logicObj.id,(actor:Node)=>{
                    if(actor){
                        this.resetSpineRole(actor);
                        this.playAnimationByState(logicObj.stateMachine.state.id);
                        this.regSpineEvent();     
                        this.updateDirection();
                    }
                });
            }else{
                this.loadSptEmpty(spt);
            }       
        }
        this.updateDataToUI("mercenary.type",logicObj.id,()=>{
            loadSpt()           
        })
    }
}
