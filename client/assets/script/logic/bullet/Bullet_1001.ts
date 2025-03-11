import { Node } from "cc";
import {PoolMgr} from "../../manager/PoolMgr";
import { Bullet }  from "./Bullet";

//子弹跟踪目标
export class Bullet_1001 extends Bullet {    
    _pb_tag:string = PoolMgr.POOL_TAG_ENUM.BULLET_1001.tag;
    update(dt:number): void {
        super.update(dt);
        this.ui.updateDirection();
    }
}