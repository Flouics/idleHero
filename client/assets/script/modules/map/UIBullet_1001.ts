import { Bullet }  from "../../logic/bullet/Bullet";
import { toolKit } from "../../utils/ToolKit";


import { _decorator,Size,Sprite, UITransform, Vec3, Node} from 'cc';
import {UIBullet} from "./UIBullet";
const {ccclass, property} = _decorator;

@ccclass("UIBullet_1001")
export class UIBullet_1001 extends UIBullet {  
    updateUI() {
        if(!this._logicObj) return;
        this.node.active = true;
        this._isReady = true;
    }
}