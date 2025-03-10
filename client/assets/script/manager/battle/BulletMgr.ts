
import { BoxBase }  from "../../logic/BoxBase";
import BaseClass from "../../zero/BaseClass";
import { serialize } from "../../utils/Decorator";
import { Node, Vec2 } from "cc";
import BattleMainView from "../../modules/map/BattleMainView";
import { Bullet }  from "../../logic/bullet/Bullet";
import { Bullet_1001 } from "../../logic/bullet/Bullet_1001";
import { Bullet_1010 } from "../../logic/bullet/Bullet_1010";
import { Bullet_1020 } from "../../logic/bullet/Bullet_1020";
import { Debug }   from "../../utils/Debug";
import { Bullet_1002 } from "../../logic/bullet/Bullet_1002";
import { TIME_FRAME } from "../../Global";

// 子弹管理器
export class BulletMgr extends BaseClass {
    @serialize()
    bulletMap:Map<number,Bullet> = new Map();
    _bulletTypeClassMap = {};
    _mainView:BattleMainView = null;
    _nodeRoot:Node = null;
    
    initSchedule(){
        this._mainView.offScheduleEvent(this.getClassName(),this.update.bind(this));
        this._mainView.onScheduleEvent(this.getClassName(),this.update.bind(this));
    }
    
    clear(){
        this._mainView.offScheduleEvent(this.getClassName(),this.update.bind(this));
    }

    init(mainView:BattleMainView){
        this._mainView = mainView;
        this._nodeRoot = mainView.nd_bulletRoot;
        this.initBulletTypeMap();
        this.reset()
    }

    initBulletTypeMap(){
        this._bulletTypeClassMap[1001] = Bullet_1001;
        this._bulletTypeClassMap[1002] = Bullet_1002;
        this._bulletTypeClassMap[1010] = Bullet_1010;
        this._bulletTypeClassMap[1020] = Bullet_1020;
    }

    getBulletClass(type:number){
        return this._bulletTypeClassMap[type];
    }

    reset(){
        this.bulletMap.forEach(Bullet =>{
            Bullet.destory();
        });
        this.bulletMap.clear();
        this.initSchedule()
    }

    create(shooter:BoxBase,target:BoxBase,fromViewPos:Vec2,data:any,cb?:Function):Bullet{    
        var BulletClass = this.getBulletClass(data.type);
        if (!BulletClass) {
            Debug.warn("bullet Class not exist.",data.type);
            return null;
        }    
        let bullet = new BulletClass(this._mainView,shooter,target,fromViewPos,data);
        bullet.initUI(this._nodeRoot,()=>{
            if(!!cb) cb(bullet);    
        });
        this.bulletMap.set(bullet.idx, bullet);             
        return bullet;
    }

    refresh(){
        this.bulletMap.forEach(bullet =>{
            bullet.initUI(this._nodeRoot);       
        })
    }

    clearBullet(idx:number){
        let obj = this.bulletMap.get(idx);
        if(obj){
            obj.destory();
        }
        this.bulletMap.delete(idx);
    }

    update(dt:number){
        dt = TIME_FRAME;
        this.bulletMap.forEach(bullet =>{
            bullet.update(dt);
        })      
    }
}