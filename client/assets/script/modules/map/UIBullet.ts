import { Bullet }  from "../../logic/bullet/Bullet";
import { toolKit } from "../../utils/ToolKit";
import {BaseUI} from "../../zero/BaseUI";

import { _decorator,Size,Sprite, UITransform, Vec3, Node} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("UIBullet")
export class UIBullet extends BaseUI {
    @property(Sprite)
    spt_bullet:Sprite = null;    
    @property(Node)
    nd_effect:Node = null;    
    _baseUrl = "texture/map/bullet/";
    _logicObj:Bullet;
    _isReady = false;
    get isReady() {
        return this._isReady;
    }
    
    reuse(data:any){
        this.node.active = false;
        this._isReady = false;
        this.clearData();
    }

    resetSize(size:Size){
        this.node.getComponent(UITransform).setContentSize(size);
    }

    resetAnchorPoint(x:number,y:number){
        this.node.getComponent(UITransform).setAnchorPoint(0.5,0);        
        this.spt_bullet.node.getComponent(UITransform).setAnchorPoint(0.5,0);      
    }

    updateUI() {
        if(!this._logicObj) return;
        var self = this;
        var logicObj = this._logicObj;
        if(logicObj.data && logicObj.data.icon > 0){
            this.updateDataToUI("icon", logicObj.data.icon, () => {
                self.loadSpt(self.spt_bullet,logicObj.data.icon,()=>{
                    self.spt_bullet.node.setPosition(0,0,0);
                    self.node.active = true;
                    self._isReady = true;
                });                
            },()=>{
/*                 if(self.isReady == false){
                    self.node.active = true;
                    self._isReady = true;
                } */
            }) 
        }
    }

    updateDirection(){
        if(!this._logicObj){
            return;
        }
        var logicObj = this._logicObj;
        if(!logicObj.dirV2){
            return;
        }
        var eulerAngle = toolKit.getEulerAngleByVec2(logicObj.dirV2);
        eulerAngle.z += -90;
        this.node.setRotationFromEuler(eulerAngle)
    }

    updatePosition(){
        if(!this._logicObj){
            return
        }
        var logicObj = this._logicObj;
        this.node.setPosition(logicObj.x,logicObj.y,logicObj.z);
    }

    update(dt:number = 0){
        this.updateUI();
        this.updatePosition();
    }
    
    destory(){
        this.node.active = false;
        super.destory();
    }
}