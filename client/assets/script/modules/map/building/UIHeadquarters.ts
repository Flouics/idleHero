import {App} from "../../../App";
import { toolKit } from "../../../utils/ToolKit";
import {UIBuilding} from "../UIBuilding";

import { _decorator, Color, Label, Node, ProgressBar, Sprite, tween, Tween} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("UIHeadquarters")
export class UIHeadquarters extends UIBuilding {
    _baseUrl = "texture/map/";
    _beAtkedAction:Tween<Node>;
    @property(ProgressBar)
    lifeBar:ProgressBar = null;
    @property(Label)
    lb_life:Label = null;
    onBeAtked(damage:number){
        if(this._beAtkedAction) return;
        var duration = 0.5;
        var self = this;
        this._beAtkedAction = tween(this.node)
        .to(duration,
            { },{
                onUpdate(){
                    self.spt_face.color = Color.RED;
                }
            })
        .to(duration,
            { },{
                onUpdate(){
                    self.spt_face.color = Color.WHITE;
                }
            })
        .call(() => {                
            //todo
            self.stopBeAtkedAction();
        })
        this._beAtkedAction.start();
        App.effectMgr.playEffectLife({root:this.node,value:-damage})
    }

    stopBeAtkedAction(){
        this.removeTweenAction(this._beAtkedAction);
        this._beAtkedAction = null;
    }
    removeTweenAction(actionTween:Tween<Node>){
        if(actionTween){
            actionTween.stop()
            actionTween.removeSelf()
        }       
    }

    updateUI(){
        var self = this;
        var logicObj = this._logicObj
        if(!logicObj){
            return;
        }
        var data = {life : logicObj.life,lifeMax : logicObj.lifeMax}
        this.updateDataToUI("headquarters.life",data,()=>{
            var percent = data.life * 100 / data.lifeMax;
            percent = toolKit.limitNum(percent,0,100);
            this.lifeBar.progress = percent/100;
            this.lb_life.string = data.life.toString();
        });
    }
}