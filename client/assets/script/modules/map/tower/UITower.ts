import {UIBuilding} from "../UIBuilding";

import { _decorator} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("UITower")
export class UITower extends UIBuilding {
    _baseUrl = "texture/map/";

    updateUI(){
/*         var self = this;
        var logicObj = this._logicObj
        this.updateDataToUI("building.type",logicObj.id,()=>{
            if(logicObj.id > 0){
                self.loadSpt(self.spt_face, "building/building_" + logicObj.id)
            }else{
                self.spt_face.spriteFrame = null;
            }           
        }) */
    }
}