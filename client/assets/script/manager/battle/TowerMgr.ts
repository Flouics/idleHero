
import {Tower} from "../../logic/tower/Tower";
import {Tower_1001} from "../../logic/tower/Tower_1001";
import {BaseClass} from "../../zero/BaseClass";
import { serialize } from "../../utils/Decorator";
import { Node, v2 } from "cc";
import {MapUtils} from "../../logic/MapUtils";
import { getMapProxy } from "../../modules/map/MapProxy";


// 怪物管理器
export class TowerMgr extends BaseClass{
    @serialize()
    towerMap:Map<number,Tower> = null;
    _nd_root:Node = null;
    _towerTypeClassMap = {};
    
    constructor(){
        super();
        TowerMgr._instance = this;
    }

    static get instance ():TowerMgr{
        if( TowerMgr._instance){
            return TowerMgr._instance as TowerMgr;
        }else{
            let instance = new TowerMgr();
            return instance
        }
    }

    init(root:Node){
        this._nd_root = root;
        this.initTowerTypeMap();
        this.reset()
    }
    
    initSchedule(){
        getMapProxy().emitter.off(this.getClassName(),this.update.bind(this));
        getMapProxy().emitter.on(this.getClassName(),this.update.bind(this));
    }
    
    clear(){
        getMapProxy().emitter.off(this.getClassName(),this.update.bind(this));
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
        let tower = new TowerClass() as Tower;
        tower.initUI(this._nd_root,()=>{
            if(!!task) task(tower);    
        });
        var pos = MapUtils.getViewPosByTilePos(v2(tx,ty))
        tower.createBuilding(this._nd_root,pos);
        this.towerMap[tower.idx] = tower;        
        return tower;
    }
    
    refresh(){
        for (const key in this.towerMap) {
            if (this.towerMap.hasOwnProperty(key)) {
                this.towerMap[key].initUI(this._nd_root);                
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