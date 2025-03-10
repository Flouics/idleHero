import App from "../../App";
import BaseUI from "../../zero/BaseUI";

import { _decorator, Color, Node, Sprite, tween, Tween, UITransform, v2, Vec2, Vec3, SkeletalAnimation, SkeletalAnimationState} from 'cc';
import StateMachine from "../../logic/stateMachine/StateMachine";
import { Debug } from "../../utils/Debug";
import { empty } from "../../Global";
import { toolKit } from "../../utils/ToolKit";
import { uiKit } from "../../utils/UIKit";
import { Live } from "../../logic/Live";
const {ccclass, property} = _decorator;

var SKELETAL_ANIMATION_NAME = {
    ATTACK:"attack"
    ,IDLE:"idle"
    ,MOVING:"run"
    ,DIE:"die"
    ,REVIVE:"revive"
    ,SKILL:"attack"
    
}
@ccclass("UILive")
export default class UILive extends BaseUI {
    static SKELETAL_ANIMATION_NAME = SKELETAL_ANIMATION_NAME;
    _logicObj: Live = null;

    @property(Sprite)
    spt_role:Sprite = null;   

    sa_role:SkeletalAnimation = null;
    lastAnimName:string = "";
    nextAnimName:string = "";

    _baseUrl = "texture/hero/";
    _moveAction:Tween<Node>;
    _beAtkedAction:Tween<Node>;
    _directAction:Tween<Node>;

    reuse(data:any){
        this.lastAnimName = "";
        this.sa_role = null;
    }
    resetSkeletalAnimationRole(actorNode:Node){        
        this.sa_role = actorNode.getComponent(SkeletalAnimation);
        this.lastAnimName = "";
    }

    regSkeletalAnimationEvent(){
        if(!this.sa_role){
            return;
        }
        var self = this;
        var lastFrameFunc = function (type:string,skeletalAnimationState:SkeletalAnimationState){
            if(self.lastAnimName == SKELETAL_ANIMATION_NAME.MOVING){
                return;
            }

            if(self.lastAnimName == SKELETAL_ANIMATION_NAME.DIE){             
                self.destory();
                return;
            }
            var lastAnimName = self.lastAnimName;
            self.lastAnimName = "";
            if(!empty(self.nextAnimName)){             
                self.playSkeletalAnimation(self.nextAnimName);
            }else{
                //没有下一组动画，就进入闲置     
                if(lastAnimName == SKELETAL_ANIMATION_NAME.ATTACK){                    
                    self.playSkeletalAnimation(SKELETAL_ANIMATION_NAME.IDLE);
                }
            }
        }
        this.sa_role.on(SkeletalAnimation.EventType.LASTFRAME,lastFrameFunc);
    }

    playSkeletalAnimation(animName:string){
        if(!this.sa_role){
            return;
        }
        if(this.lastAnimName == animName){
            return;
        }
        if(empty(this.lastAnimName) 
            || this.lastAnimName == SKELETAL_ANIMATION_NAME.MOVING
            || this.lastAnimName == SKELETAL_ANIMATION_NAME.IDLE
            ){
            var logicObj = this._logicObj;
            if(animName == SKELETAL_ANIMATION_NAME.ATTACK && logicObj && logicObj.atkSpeed){
                const animationState = this.sa_role.getState(animName);
                animationState.frameRate = 3.0 * this._logicObj.atkSpeed;
            }
            this.lastAnimName = animName;   
            this.sa_role.play(animName);
        }else{
            this.nextAnimName = animName;
        }           
    }

    pauseSkeletalAnimation(){
        this.sa_role.pause();
    }

    resumeSkeletalAnimation(){
        this.sa_role.resume();
    }

    playSkeletalAnimationByState(stateId:number){
        if(this.lastAnimName == ""){
            Debug.log("Monster",this._logicObj.idx,stateId);
        }
        
        switch (stateId) {
            case StateMachine.STATE_ENUM.IDLE:                
                this.playSkeletalAnimation(SKELETAL_ANIMATION_NAME.IDLE);
                break;
            case StateMachine.STATE_ENUM.ATTACK:
                this.playSkeletalAnimation(SKELETAL_ANIMATION_NAME.ATTACK);
                break;
            case StateMachine.STATE_ENUM.MOVING:
                this.playSkeletalAnimation(SKELETAL_ANIMATION_NAME.MOVING);
                break;
            case StateMachine.STATE_ENUM.DIE:
                this.playSkeletalAnimation(SKELETAL_ANIMATION_NAME.DIE);
                break;
            case StateMachine.STATE_ENUM.STUN:
                this.pauseSkeletalAnimation();
                break;
            default:
                this.playSkeletalAnimation(SKELETAL_ANIMATION_NAME.MOVING);
                break;
        }
    }

    playEffect(){

    }
    
    stopEffect(){

    }

    removeEffect(){

    }

    moveStep(duration:number,toPos:Vec2,cb?:Function) {
        this.stopMoveAction();
        this._moveAction = tween(this.node)
            .to(duration,
                { position: new Vec3(toPos.x,toPos.y)})
            .call(() => {                
                if (!!cb) cb()
            })
        this._moveAction.start();
        this.updateDirection(toPos);
    }

    removeTweenAction(actionTween:Tween<Node>){
        if(actionTween){
            actionTween.stop()
            actionTween.removeSelf()
        }       
    }

    stopMoveAction(){
        this.removeTweenAction(this._moveAction);
        this._moveAction = null;
    }

    updateDirection(dirV2:Vec2){
        // todo 方向
    }

    updatePosition(){
        if(!!this._moveAction){     //正在位移，就同步坐标
            return;
        }
        if(!this._logicObj){
            return
        }
        var logicObj = this._logicObj;
        this.node.setPosition(logicObj.x,logicObj.y);
    }

    onBeAtked(damage:number){
        if(this._beAtkedAction) return;
        var duration = 0.5;
        var self = this;
        this._beAtkedAction = tween(this.spt_role.node)
        .to(duration,
            { },{
                onUpdate(tar:Node){
                    tar.getComponent(Sprite).color = Color.RED;
                }
            })
        .to(duration,
            { },{
                onUpdate(tar:Node){
                    tar.getComponent(Sprite).color = Color.WHITE;
                }
            })
        .call(() => {                
            //todo
            self.stopBeAtkedAction();
        })
        this._beAtkedAction.start();

        //播放特效
        var worldPos =  this.node.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0,0,0));
        var param = {
            value:-damage,
            x:worldPos.x,
            y:worldPos.y,
        }
        App.effectMgr.playEffectLife(param);
    }

    stopBeAtkedAction(){
        this.removeTweenAction(this._beAtkedAction);
        this._beAtkedAction = null;
    }
     
    playDirectAction(angle:number):void {
        if(!!this._directAction) return;
        var duration = toolKit.limitNum(0.3 * Math.abs(angle) / 90,0,0.3);
        var self = this;
        var eulerAngle = new Vec3(0,0,angle);
        eulerAngle.z = uiKit.getDeltaAngle(this.node.eulerAngles.z,eulerAngle.z);
        this._directAction = tween(this.node)
        .to(duration,
            { eulerAngles: eulerAngle})
        .call(() => {                
            //todo
            self.stopDirectAction();
        })
        this._directAction.start();
    }
    
    stopDirectAction(): void {
        this._directAction = null;
        //this.node.angle = 0;
    }

    updateUI(){
       
    }

    updateSiblingIndex(){
        var index = 1334 - Math.floor(this.node.position.y/10);
        var self = this;
        this.updateDataToUI("Live.updateSiblingIndex",index,()=>{
            self.node.setSiblingIndex(index);
        });        
    }
    update(dt:number){
        this.updateUI();
        this.updatePosition();
    //this.updateSiblingIndex();  //需要知道所有节点的index才能使用。
    }
}