
import Tower from "../../logic/tower/Tower";
import Tower_1001 from "../../logic/tower/Tower_1001";
import BaseClass from "../../zero/BaseClass";
import { serialize } from "../../utils/Decorator";
import { Node, v2 } from "cc";
import BattleMainView from "../../modules/map/BattleMainView";
import MapUtils from "../../logic/MapUtils";
import { TIME_FRAME } from "../../Global";

// 怪物管理器
export default class TowerMgr extends BaseClass{
    @serialize()
    towerMap:Map<number,Tower> = null;
    _mainView:BattleMainView = null;
    _nodeRoot:Node = null;
    _towerTypeClassMap = {};
    

    init(mainView:BattleMainView){
        this._mainView = mainView;
        this._nodeRoot = mainView.nd_buildingRoot;
        this.initTowerTypeMap();
        this.reset()
    }
    
    initSchedule(){
        this._mainView.offScheduleEvent(this.getClassName(),this.update.bind(this));
        this._mainView.onScheduleEvent(this.getClassName(),this.update.bind(this));
    }
    
    clear(){
        this._mainView.offScheduleEvent(this.getClassName(),this.update.bind(this));
    }

    reset(){
        for (const key in this.towerMap) {
            if (this.towerMap.hasOwnProperty(key)) {
                this.towerMap[key].destory()                
            }
        }
        this.towerMap = new Map();
        this.initSchedule();
    }

    initTowerTypeMap(){
        this._towerTypeClassMap[1001] = Tower_1001;
    }

    getTowerClass(type:number){
        return this._towerTypeClassMap[type] || Tower;
    }

    create(tx: number = 0, ty: number = 0,towerType:number,task?:Function){
        let TowerClass = this.getTowerClass(towerType);
        let tower = new TowerClass(this._mainView) as Tower;
        tower.initUI(this._nodeRoot,()=>{
            if(!!task) task(tower);    
        });
        var pos = MapUtils.getViewPosByTilePos(v2(tx,ty))
        tower.createBuilding(pos);
        this.towerMap[tower.idx] = tower;        
        return tower;
    }
    
    refresh(){
        for (const key in this.towerMap) {
            if (this.towerMap.hasOwnProperty(key)) {
                this.towerMap[key].initUI(this._nodeRoot);                
            }
        }
    }

    clearTower(idx:number){
        let obj = this.towerMap[idx];
        if(obj){
            obj.destory();
        }
        delete this.towerMap[idx]
    }

    update(){
        for (const key in this.towerMap) {
            if (this.towerMap.hasOwnProperty(key)) {
                this.towerMap[key].update()                
            }
        }
    }
}