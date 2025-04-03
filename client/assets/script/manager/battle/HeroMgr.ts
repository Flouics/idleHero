import { Hero } from "../../logic/Hero";
import {BaseClass} from "../../zero/BaseClass";
import { serialize } from "../../utils/Decorator";
import { Node } from "cc";
import {BattleMainView} from "../../modules/map/BattleMainView";
import { MapMainView } from "../../modules/map/MapMainView";
import { getMapProxy, MapProxy_event } from "../../modules/map/MapProxy";


// 角色管理器
export class HeroMgr extends BaseClass{
    @serialize()
    heroMap:{[key:number]:Hero} = {};
    _nd_root:Node = null; 

    constructor(){
        super();
        HeroMgr._instance = this;
    }

    static get instance ():HeroMgr{
        if( HeroMgr._instance){
            return HeroMgr._instance as HeroMgr;
        }else{
            let instance = new HeroMgr();
            return instance
        }
    }
    
    init(root:Node){
        this._nd_root = root;
        this.reset()
    }

    reset(){
        for (const key in this.heroMap) {
            if (this.heroMap.hasOwnProperty(key)) {
                this.heroMap[key].destroy()                
            }
        }
        this.heroMap = {};
        this.initSchedule();
    }

    initSchedule(){        
        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
        getMapProxy().on(MapProxy_event.MapProxy_update,this.update,this);
    }

    clear(){
        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
    }

    create( x: number = 0, y: number = 0){
        let hero = new Hero(x,y);
        hero.initUI(this._nd_root)
        this.heroMap[hero.idx] = hero;        
        return hero;
    }

    refresh(){
        for (const key in this.heroMap) {
            if (this.heroMap.hasOwnProperty(key)) {
                this.heroMap[key].initUI(this._nd_root);                
            }
        }
    }

    clearHero(idx:number){
        let obj = this.heroMap[idx];
        if(obj){
            obj.destroy();
        }
        delete this.heroMap[idx]
    }
    
    update(dt:number){
        for (const key in this.heroMap) {
            if (this.heroMap.hasOwnProperty(key)) {
                this.heroMap[key].update(dt)                
            }
        }
    }
}