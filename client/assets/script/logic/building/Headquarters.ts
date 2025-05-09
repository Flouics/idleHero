import { Building }  from "../Building";
import {UIBuilding} from "../../modules/map/UIBuilding";
import { serialize } from "../../utils/Decorator";
import { v2, Vec2, Node, Tween} from "cc";
import { BoxBase }  from "../BoxBase";
import { getMapProxy } from "../../modules/map/MapProxy";
import { DamageRet } from "../../Interface";

export class Headquarters extends Building {
    ui:UIBuilding = null;
    @serialize()
    area:Vec2[] = [v2(0,0),v2(1,0),v2(0,1),v2(-1,0)]
    @serialize()
    static _idIndex = 1;
    @serialize()
    life:number = 10000;
    lifeMax: number = 10000;
    _pb_url:string = "prefab/map/building/Headquarters";
    _beAtkedAction:Tween<Node> = null;
    isFail:boolean = false;
    constructor() {
        super();
        this.isFail = false;
    }

    onBeAtked(damageRet:DamageRet,atker:BoxBase){
        super.onBeAtked(damageRet,atker);
        if(this.isFail == false){
            if(!this.checkLive()) {
                this.isFail = true;
                getMapProxy().cmd.showFailView(1);
            }
        }
    }

    update(){
        super.update();
        this.updateUI();
    }
}