import { Hero } from "../../logic/Hero";
import {UILive} from "./UILive";

import { _decorator} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("UIHero")
export class UIHero extends UILive {    
    _baseUrl = "texture/hero/";
    _logicObj:Hero = null;
    updateUI(){
        var logicObj = this._logicObj
        this.updateDataToUI("hero.type",logicObj.id,()=>{
            //loadSpt()           
        })
    }
}
