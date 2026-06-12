
import { BaseClass } from "../../zero/BaseClass";
import { serialize } from "../../utils/Decorator";
import { Node } from "cc";
import { Mine } from "../../logic/Mine";
import { getMapProxy } from "../../modules/map/MapProxy";
import { App } from "../../App";
import { Debug } from "../../utils/Debug";
import { MapEvent } from "../../modules/map/MapEvent";


// 角色管理器
export class MineMgr extends BaseClass{
    @serialize()
    mineMap:Map<number,Mine> = new Map();
    _nd_root:Node = null; 

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
        this._nd_root = root;
        this.reset()
    }

    reset(){
        this.mineMap.forEach(mine =>{
            mine.destroy();
        });
        this.mineMap.clear();
        this.initSchedule();
    }

    initSchedule(){
        getMapProxy().off(MapEvent.Map_Update,this.update);
        getMapProxy().on(MapEvent.Map_Update,this.update,this);
    }

    clear(){
        getMapProxy().off(MapEvent.Map_Update,this.update);
    }

    create( x: number = 0, y: number = 0,mineId:number){
        let data = App.dataMgr.findById("mine",mineId);
        if(!data){
            Debug.log("can't find mine config by id:",mineId);
            return;
        }
        let mine = new Mine(data,x,y);
        mine.initUI(this._nd_root)
        this.mineMap.set(mine.idx,mine);        
        return mine;
    }

    refresh(){
        this.mineMap.forEach(mine =>{
            mine.initUI(this._nd_root);
        });
    }

    clearMine(idx:number){
        let obj = this.mineMap.get(idx);
        if(obj){
            obj.destroy();
        }
        delete this.mineMap[idx]
    }
    
    update(dt:number){
        this.mineMap.forEach(mine =>{
            mine.update(dt);
        });
    }
}