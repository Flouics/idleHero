
import { BaseClass } from "../../zero/BaseClass";
import { serialize } from "../../utils/Decorator";
import { Node } from "cc";
import { Mine } from "../../logic/Mine";
import { getMapProxy, MapProxy_event } from "../../modules/map/MapProxy";


// 角色管理器
export class MineMgr extends BaseClass{
    @serialize()
    mineMap:{[key:number]:Mine} = {};
    _nodeRoot:Node = null; 

    constructor(){
        super();
        MineMgr._instance = this;
    }

    static get instance ():MineMgr{
        if( MineMgr._instance){
            return MineMgr._instance as MineMgr;
        }else{
            let instance = new MineMgr();
            return instance
        }
    }
    
    init(root:Node){
        this._nodeRoot = root;
        this.reset()
    }

    reset(){
        for (const key in this.mineMap) {
            if (this.mineMap.hasOwnProperty(key)) {
                this.mineMap[key].destroy()                
            }
        }
        this.mineMap = {};
        this.initSchedule();
    }

    initSchedule(){
        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
        getMapProxy().on(MapProxy_event.MapProxy_update,this.update,this);
    }

    clear(){
        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
    }

    create( x: number = 0, y: number = 0){
        let mine = new Mine(x,y);
        mine.initUI(this._nodeRoot)
        this.mineMap[mine.idx] = mine;        
        return mine;
    }

    refresh(){
        for (const key in this.mineMap) {
            if (this.mineMap.hasOwnProperty(key)) {
                this.mineMap[key].initUI(this._nodeRoot);                
            }
        }
    }

    clearMine(idx:number){
        let obj = this.mineMap[idx];
        if(obj){
            obj.destroy();
        }
        delete this.mineMap[idx]
    }
    
    update(dt:number){
        for (const key in this.mineMap) {
            if (this.mineMap.hasOwnProperty(key)) {
                this.mineMap[key].update(dt)                
            }
        }
    }
}