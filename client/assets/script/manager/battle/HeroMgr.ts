import { Hero } from "../../logic/Hero";
import BaseClass from "../../zero/BaseClass";
import { serialize } from "../../utils/Decorator";
import { Node } from "cc";
import BattleMainView from "../../modules/map/BattleMainView";
import { TIME_FRAME } from "../../Global";


// 角色管理器
export default class HeroMgr extends BaseClass{
    @serialize()
    heroMap:{[key:number]:Hero} = {};
    _mainView:BattleMainView = null;
    _nodeRoot:Node = null;
    _scheduleId:number  = null;    
    
    init(mainView:BattleMainView){
        this._mainView = mainView;
        this._nodeRoot = mainView.nd_roleRoot;
        this.reset()
    }

    reset(){
        for (const key in this.heroMap) {
            if (this.heroMap.hasOwnProperty(key)) {
                this.heroMap[key].destory()                
            }
        }
        this.heroMap = {};
        this.initSchedule();
    }

    initSchedule(){
        this._mainView.offScheduleEvent(this.getClassName(),this.update.bind(this));
        this._mainView.onScheduleEvent(this.getClassName(),this.update.bind(this));
    }

    clear(){
        this._mainView.offScheduleEvent(this.getClassName(),this.update.bind(this));
    }

    create( x: number = 0, y: number = 0){
        let hero = new Hero(this._mainView,x,y)
        hero.initUI(this._nodeRoot)
        this.heroMap[hero.idx] = hero;        
        return hero;
    }

    refresh(){
        for (const key in this.heroMap) {
            if (this.heroMap.hasOwnProperty(key)) {
                this.heroMap[key].initUI(this._nodeRoot);                
            }
        }
    }

    clearHero(idx:number){
        let obj = this.heroMap[idx];
        if(obj){
            obj.destory();
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