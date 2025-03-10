import { Bullet }  from "../../logic/bullet/Bullet";
import { toolKit } from "../../utils/ToolKit";


import { _decorator,Size,Sprite, UITransform, Vec3, Node} from 'cc';
import UIBullet from "./UIBullet";
const {ccclass, property} = _decorator;

@ccclass("UIBullet_1010")
export default class UIBullet_1010 extends UIBullet {  

    resetSize(size:Size){
        this.node.getComponent(UITransform).setContentSize(size);
        var scaleX = size.width / 32;
        this.nd_effect.setScale(scaleX,1,1);
    }

}