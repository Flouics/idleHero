import App from "../../App";
import { Building }  from "../../logic/Building";
import BaseUI from "../../zero/BaseUI";

import { _decorator, Node, Sprite, tween, Tween} from 'cc';
import { DamageRet } from "../../Interface";
const {ccclass, property} = _decorator;

@ccclass("UIBuilding")
export default class UIBuilding extends BaseUI {
    @property(Sprite)
    spt_face:Sprite = null;
    _baseUrl = "texture/map/";
    _logicObj:Building = null;
    _directAction:Tween<Node> = null;
    _beAtkedAction:Tween<Node>;
    
    playDirectAction(angle:number):void {
        if(!!this._directAction) return;
        var duration = 0.3;
        var self = this;
        this._directAction = tween(this.node)
        .to(duration,
            { angle: angle})
        .call(() => {                
            //todo
            self.stopDirectAction();
        })
        this._directAction.start();
    }

    onBeAtked(damageRet:DamageRet){

    }
    
    stopDirectAction(): void {
        this._directAction = null;
    }

    updateUI(){
        var self = this;
        var logicObj = this._logicObj
        this.updateDataToUI("building.type",logicObj.id,()=>{
            if(logicObj.id > 0){
                self.loadSpt(self.spt_face, "building/building_" + logicObj.id)
            }else{
                self.spt_face.spriteFrame = null;
            }           
        })
    }
}