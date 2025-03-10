import BaseClass from "../../zero/BaseClass";
import { serialize } from "../../utils/Decorator";
import { isDisplayStats, Node, v2 } from "cc";
import BattleMainView from "../../modules/map/BattleMainView";
import App from "../../App";
import { toolKit } from "../../utils/ToolKit";
import { merge, TIME_FRAME } from "../../Global";
import { MapProxy , getMapProxy } from "../../modules/map/MapProxy";
import { Debug }   from "../../utils/Debug";
import MapUtils from "../../logic/MapUtils";
import { Augment } from "./AugmentMgr";
import { Mercenary } from "../../logic/Mercenary";
import { getMercenaryProxy } from "../../modules/mercenary/MercenaryProxy";


// 角色管理器
export class MercenaryMgr extends BaseClass{
    @serialize()
    mercenaryMap:Map<number,Mercenary> = new Map();
    mercenaryGenPool:Map<number,Mercenary> = new Map();
    _mainView:BattleMainView = null;
    _nodeRoot:Node = null;
    _scheduleId:number  = null;    
    proxy:MapProxy = null;
    
    init(mainView:BattleMainView){
        this._mainView = mainView;
        this._nodeRoot = mainView.nd_roleRoot;
        this.proxy = getMapProxy();
        this.reset()
    }

    reset(){
        this.mercenaryMap.forEach(data => {
            data.destory();
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
            cfg.lastGenTime = this.proxy.getBattleTime();
            
        }       

        if(!!data){
            merge(cfg,data);
        }
        cfg.augmentList = this.proxy.augmentMgr.getGotAugmentIdListByMercenaryId(mercenaryId);
    }

    getMercenaryGenMap(){
        return this.mercenaryGenPool;
    }

    isMercenaryGenMax(){
        return this.mercenaryGenPool.size >= this.proxy.battleMercenaryCountMax;
    }

    getMercenaryGenData(mercenaryId:number){
        return this.mercenaryGenPool.get(mercenaryId);
    }

    initSchedule(){
        this._mainView.offScheduleEvent(this.getClassName(),this.update.bind(this));
        this._mainView.onScheduleEvent(this.getClassName(),this.update.bind(this));
    }

    clear(){
        this._mainView.offScheduleEvent(this.getClassName(),this.update.bind(this));
    }

    checkGen(){
        var nowTime = this.proxy.getBattleTime();
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
        mercenary.initUI(this._nodeRoot);
        this.mercenaryMap.set(mercenary.idx, mercenary);        

        mercenary.scale = this.proxy.SCALE_MERCENARY;

        return mercenary;
    }

    refresh(){
        this.mercenaryMap.forEach(mercenary => {
            mercenary.initUI(this._nodeRoot);  
        });
    }

    obtainAugment(augment: Augment){
        if (!augment){
            Debug.warn("No augment exists");
            return;
        }
        var augmentId = augment.id;
        var self = this;
        var map:Map<number,any> = new Map();
        if(augment.type == 900){
            this.addMercenaryGenPool(augment.data_1);        
        }else {
            if(augment.mercenaryList.length == 0){
                this.mercenaryGenPool.forEach(data =>{
                    if (data.augmentList.indexOf(augmentId) == -1){
                        data.augmentList.push(augmentId);
                        map.set(data.id,data);
                    }  
                });
            }else{
                augment.mercenaryList.forEach(mercenaryId => {
                    let data = this.mercenaryGenPool.get(mercenaryId);
                    if(!!data){
                        if (data.augmentList.indexOf(augmentId) == -1){
                            data.augmentList.push(augmentId);
                            map.set(data.id,data);
                        }  
                    }
                });
            }
        }

        //刷新已经存在的mercenary
        this.mercenaryMap.forEach((mercenary)=>{
            var data = map.get(mercenary.id);
            if(data){
                mercenary.onObtainAugment(data);
            }
        })
    }

    clearMercenary(idx:number){
        let obj = this.mercenaryMap.get(idx);
        if(obj){
            obj.destory();
        }
        this.mercenaryMap.delete(idx);
    }
    
    update(dt:number){
        this.mercenaryMap.forEach(mercenary =>{
            mercenary.update(dt);
        });

        this.checkGen();
    }
}