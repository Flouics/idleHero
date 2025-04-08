
import { BoxBase }  from "../../logic/BoxBase";
import {BaseClass} from "../../zero/BaseClass";
import { serialize } from "../../utils/Decorator";
import { Node, Vec2 } from "cc";
import { Bullet }  from "../../logic/bullet/Bullet";
import { Bullet_1001 } from "../../logic/bullet/Bullet_1001";
import { Bullet_1010 } from "../../logic/bullet/Bullet_1010";
import { Bullet_1020 } from "../../logic/bullet/Bullet_1020";
import { Debug }   from "../../utils/Debug";
import { Bullet_1002 } from "../../logic/bullet/Bullet_1002";
import { getTimeFrame } from "../../Global";
import { getMapProxy, MapProxy_event } from "../../modules/map/MapProxy";

// 子弹管理器
export class BulletMgr extends BaseClass {
    @serialize()
    bulletMap:Map<number,Bullet> = new Map();
    _bulletTypeClassMap = {};
    _nd_root:Node = null;

    constructor(){
        super();
        BulletMgr._instance = this;
    }

    static get instance ():BulletMgr{
        if( BulletMgr._instance){
            return BulletMgr._instance as BulletMgr;
        }else{
            let instance = new BulletMgr();
            return instance
        }
    }
    
    initSchedule(){
        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
        getMapProxy().on(MapProxy_event.MapProxy_update,this.update,this);
    }
    
    clear(){
        this.bulletMap.forEach(bullet =>{
            bullet.destroy();
        });
        this.bulletMap.clear();

        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
    }

    init(root:Node){
        this._nd_root = root;
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
        this.clear();
        this.initSchedule()
    }

    create(shooter:BoxBase,target:BoxBase,fromViewPos:Vec2,data:any,cb?:Function):Bullet{    
        var BulletClass = this.getBulletClass(data.type);
        if (!BulletClass) {
            Debug.warn("bullet Class not exist.",data.type);
            return null;
        }    
        let bullet = new BulletClass(shooter,target,fromViewPos,data);
        this.bulletMap.set(bullet.idx, bullet);  
        bullet.initUI(this._nd_root,()=>{
            if(!!cb) cb(bullet);    
        });           
        return bullet;
    }

    refresh(){
        this.bulletMap.forEach(bullet =>{
            bullet.initUI(this._nd_root);       
        })
    }

    clearBullet(idx:number){
        let obj = this.bulletMap.get(idx);
        if(obj){
            obj.destroy();
        }
        this.bulletMap.delete(idx);
    }

    update(dt:number){
        dt = getTimeFrame();
        this.bulletMap.forEach(bullet =>{
            bullet.update(dt);
        })      
    }
}