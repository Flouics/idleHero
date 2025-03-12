import {UIBuilding} from "../modules/map/UIBuilding";
import { BoxBase }  from "./BoxBase";
import { serialize } from "./../utils/Decorator";
import { assetManager, instantiate, loader, Node, Prefab, resources, v2, Vec2 } from "cc";
import { Debug }   from "../utils/Debug";
import { DamageRet } from "../Interface";
import { MapMainView } from "../modules/map/MapMainView";

var BUILDING_VALUE_ENUM = {
    EMPTY:0,
    COMMON:1,
    TOWER:2,
}

export class Building extends BoxBase {

    @serialize()
    area:Vec2[] = [v2(0,0)];
    @serialize()
    realArea:Vec2[] = [v2(0,0)];   // 实际坐标系
    node: Node = null; // 
    ui:UIBuilding = null
    @serialize()
    static _idIndex = 1;
    @serialize()
    _pb_url:string = "";    //不预先加载的原因是因为种类比较多，而且基本上不会复用。
    constructor() {
        super();
    }

    initUI(parent:Node,cb?:Function) {
        let self = this;
        if(this._pb_url == "") {
            return;
        }
        resources.load(this._pb_url, Prefab, function (err: any, prefab: any) {
            if (err) {
                Debug.error(self._pb_url, err);
            }else{
                let node = instantiate(prefab);
                let viewPos = self.pos;
                parent.addChild(node);
                node.setPosition(viewPos.x, viewPos.y);
                self.bindUI(node.getComponent(UIBuilding));
            }
        })
    }

    createBuilding(parent:Node,toPos:Vec2){
        Debug.log("createBuilding",toPos)
        this.setIdx(Building);       
        this.x = toPos.x;
        this.y = toPos.y;        
        this.initUI(parent);       
        var self = this; 
        this.realArea = this.area.map((pos)=>{
            var x = pos.x + self.tilePos.x;
            var y = pos.y + self.tilePos.y;
            return  new Vec2(x,y);
        })
    }    
    onBeAtked(damageRet:DamageRet,atker:BoxBase){
        this.life += -damageRet.damage;
        if(this.ui){
            this.ui.onBeAtked(damageRet);
        }
        Debug.log(this.name,this.life);
        if(!this.checkLive()) {
            this.clear();
        }
        super.onBeAtked(damageRet,atker);
    }

    getArea(){
        return this.area;
    }

    getRealArea(){
        return this.realArea;
    }

    destroy(){
        this.clear();
        super.destroy();
        if(this.node){
            this.node.removeFromParent();
        }        
    }
    update(){

    }
}