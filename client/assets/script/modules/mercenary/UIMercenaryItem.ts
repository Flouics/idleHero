import { Mercenary } from "../../logic/Mercenary";
import TouchUtils from "../../utils/TouchUtils";
import BaseUI from "../../zero/BaseUI";

import { _decorator, Label, Sprite} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("UIMercenary")
export default class UIMercenary extends BaseUI {    
    _baseUrl = "texture/mercenary/";
    _logicObj:Mercenary = null;
    @property(Sprite)
    spt_role:Sprite;
    @property(Label)
    lb_level:Label;
    @property(Label)
    lb_name:Label;

    reuse(data: any): void {
        
    }
    updateUI(){
        var self = this;
        var logicObj = this._logicObj
        if(!logicObj){
            return;
        }
        var loadSpt = function(){
            let spt = self.spt_role;
            if(logicObj.id > 0){
                self.loadSpt(spt, "" + logicObj.id)
            }else{
                spt.spriteFrame = null;
            }       
        }
        this.updateDataToUI("mercenary.type",logicObj.id,()=>{
            loadSpt()           
        })

        this.updateDataToUI("mercenary.name",logicObj.name,()=>{
            this.lb_name.string = logicObj.name;          
        })

        this.updateDataToUI("mercenary.level",logicObj.level,()=>{
            this.lb_level.string = logicObj.level.toString();          
        })
    }
}