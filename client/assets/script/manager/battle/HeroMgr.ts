import { Hero } from "../../logic/Hero";
import {BaseClass} from "../../zero/BaseClass";
import { serialize } from "../../utils/Decorator";
import { Node } from "cc";
import {BattleMainView} from "../../modules/map/BattleMainView";
import { MapMainView } from "../../modules/map/MapMainView";
import { getMapProxy, MapProxy_event } from "../../modules/map/MapProxy";
import { empty } from "../../Global";


// 角色管理器
export class HeroMgr extends BaseClass{
    @serialize()
    heroMap:Map<number,Hero> = new Map();
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
        this.clear();
        this.initSchedule();
    }

    initSchedule(){        
        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
        getMapProxy().on(MapProxy_event.MapProxy_update,this.update,this);
    }

    clear(){
        this.heroMap.forEach(hero => {
            hero.destroy();
        });
        this.heroMap.clear();
        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
    }

    create( x: number = 0, y: number = 0){
        let hero = new Hero(x,y);
        hero.initUI(this._nd_root)
        this.heroMap.set(hero.idx,hero);        
        return hero;
    }

    refresh(){
        this.heroMap.forEach(hero => {
            hero.initUI(this._nd_root);  
        });
    }

    clearHero(idx:number){
        let obj = this.heroMap.get(idx);
        if(obj){
            obj.destroy();
        }
        this.heroMap.delete(idx);
    }
    
    update(dt:number){
        this.heroMap.forEach(hero =>{
            hero.update(dt);
        });
    }
}