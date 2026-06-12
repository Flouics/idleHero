import { Monster } from "../../logic/Monster";
import {UILive} from "./UILive";
import { Label, SkeletalAnimation, tween, Vec3, _decorator, Node} from 'cc';
import { uiKit } from "../../utils/UIKit";
import { toolKit } from "../../utils/ToolKit";
import { Debug } from "../../utils/Debug";
const {ccclass, property} = _decorator;

@ccclass("UIMonster")
export class UIMonster extends UILive {    
    _baseUrl = "texture/monster/";
    _logicObj:Monster = null;
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
            this._directAction = tween(this.node)
            .to(duration,
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
                uiKit.setMonsterImg(spt,logicObj.id,(actor:Node)=>{
                    if(actor){
                        this.resetSpineRole(actor);
                        this.regSpineEvent();
                        this.playAnimationByState(logicObj.stateMachine.state.id);                             
                        this.updateDirection();
                    }
                });
            }else{
                this.loadSptEmpty(spt);
            }       
        }
        this.updateDataToUI("monster.type",logicObj.id,()=>{
            loadSpt()           
        })

        this.updateDataToUI("monster.name",logicObj.idx,()=>{
            toolKit.getChild(this.node,"name").getComponent(Label).string = (logicObj.idx % 100000).toString();          
        })
        
    }
}
