import {BaseClass} from "../../zero/BaseClass";
import { serialize } from "../../utils/Decorator";
import { toolKit } from "../../utils/ToolKit";
import { merge, getTimeFrame } from "../../Global";
import { MapProxy , getMapProxy, MapProxy_event } from "../../modules/map/MapProxy";
import { Debug }   from "../../utils/Debug";
import {MapUtils} from "../../logic/MapUtils";
import { Mercenary } from "../../logic/Mercenary";
import { getMercenaryProxy } from "../../modules/mercenary/MercenaryProxy";
import { Node, v2 } from "cc";


// 角色管理器
export class MercenaryMgr extends BaseClass{
    @serialize()
    mercenaryMap:Map<number,Mercenary> = new Map();
    mercenaryGenPool:Map<number,Mercenary> = new Map();
    _nd_root:Node = null;
    proxy:MapProxy = null;

    constructor(){
        super();
        MercenaryMgr._instance = this;
    }

    static get instance ():MercenaryMgr{
        if( MercenaryMgr._instance){
            return MercenaryMgr._instance as MercenaryMgr;
        }else{
            let instance = new MercenaryMgr();
            return instance
        }
    }
    
    init(root:Node){
        this._nd_root = root;
        this.proxy = getMapProxy();
        this.reset()
    }

    reset(){
        this.mercenaryMap.forEach(data => {
            data.destroy();
        })

        this.mercenaryMap.clear();
        this.mercenaryGenPool.clear();
        this.initSchedule();
    }

    addMercenaryGenPool(mercenaryId:number){
        this.updateMercenaryGenPool(mercenaryId);
    }

    updateMercenaryGenPool(mercenaryId:number,data?:any){
        var cfg = this.mercenaryGenPool.get(mercenaryId);
        if(!cfg){
            var mercenaryData = getMercenaryProxy().getMercenaryById(mercenaryId);
            if(!mercenaryData){
                return;
            }
            cfg = new Mercenary(mercenaryData);
            this.mercenaryGenPool.set(mercenaryId,cfg);
            cfg.lastGenTime = this.proxy.getMapTime();
            
        }       

        if(!!data){
            merge(cfg,data);
        }
    }

    getMercenaryGenMap(){
        return this.mercenaryGenPool;
    }

    isMercenaryGenMax(){
        return false;
        //return this.mercenaryGenPool.size >= this.proxy.battleMercenaryCountMax;
    }

    getMercenaryGenData(mercenaryId:number){
        return this.mercenaryGenPool.get(mercenaryId);
    }

    initSchedule(){
        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
        getMapProxy().on(MapProxy_event.MapProxy_update,this.update,this);
    }

    clear(){
        getMapProxy().off(MapProxy_event.MapProxy_update,this.update);
    }

    checkGen(){
        var nowTime = this.proxy.getMapTime();
        var self = this;
        this.mercenaryGenPool.forEach((data,key,map)=> {
            if(nowTime > data.lastGenTime){
                if(self.create(data.id)){
                    data.lastGenTime = nowTime + data.coldTime;
                }                
            }  
        });
    }

    create( mercenaryId:number){
        var data = this.getMercenaryGenData(mercenaryId);
        if(!data){
            return null;
        }      

        var existCount = 0;
        this.mercenaryMap.forEach(mercenary => {
            if(mercenary.id == mercenaryId){
                existCount++;
            }
        });
        if(existCount > 0){
            return null; //只存在一个追随者;
        }

        var pos = MapUtils.getViewPosByTilePos(this.proxy.mercenaryEntryPos);
        var x = pos.x + toolKit.getRand(-300,300);
        var y = pos.y;
        Debug.log("createMercenary",mercenaryId,v2(x,y));
        let mercenary = new Mercenary(data,x,y);
        mercenary.initUI(this._nd_root);
        this.mercenaryMap.set(mercenary.idx, mercenary);        

        mercenary.scale = this.proxy.SCALE_MERCENARY;

        return mercenary;
    }

    refresh(){
        this.mercenaryMap.forEach(mercenary => {
            mercenary.initUI(this._nd_root);  
        });
    }

    clearMercenary(idx:number){
        let obj = this.mercenaryMap.get(idx);
        if(obj){
            obj.destroy();
        }
        this.mercenaryMap.delete(idx);
    }
    
    update(dt:number){
        this.mercenaryMap.forEach(mercenary =>{
            mercenary.update(dt);
        });

        //this.checkGen();
    }
}