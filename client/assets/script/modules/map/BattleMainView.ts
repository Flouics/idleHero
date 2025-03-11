import { Building }  from "../../logic/Building";
import {Headquarters} from "../../logic/building/Headquarters";
import { MonsterMgr } from "../../manager/battle/MonsterMgr";
import {HeroMgr} from "../../manager/battle/HeroMgr";
import { getMapProxy, MapProxy }  from "./MapProxy";
import {TowerMgr} from "../../manager/battle/TowerMgr";
import { BulletMgr }  from "../../manager/battle/BulletMgr";
import {BaseView} from "../../zero/BaseView";
import { _decorator, EventTouch, instantiate, Label, Node, NodeEventType, Prefab, ScrollView, Size, Sprite, TERRAIN_HEIGHT_BASE, UITransform, v2, Vec2, Vec3 } from "cc";
import { toolKit } from "../../utils/ToolKit";
import { MercenaryMgr } from "../../manager/battle/MercenaryMgr";
import {MapMainView} from "./MapMainView";
import {App, DELAY_TASK_KEY } from "../../App";
import {MapUtils} from "../../logic/MapUtils";
import {UIMercenaryGen} from "./UIMercenaryGen";
import {UIRandomDraw} from "./UIRandomDraw";
import { lang, TIME_FRAME } from "../../Global";
import { PlayerProxy,  getPlayerProxy } from "../player/PlayerProxy";
import { Debug }   from "../../utils/Debug";
import {Emitter} from "../../zero/Emitter";
import { getPackageProxy, PackageProxy } from "../package/PackageProxy";
import { ITEM_ID_ENUM } from "../../logic/Item";
import { getLobbyProxy } from "../lobby/LobbyProxy";
import { Monster } from "../../logic/Monster";


var SCHEDULE_EVENT = "SCHEDULE_EVENT";

const {ccclass, property} = _decorator;
@ccclass("BattleMainView")
export class BattleMainView extends BaseView {
    _prefabUrl = "prefab/map/"
    @property(Node)
    nd_mapRoot: Node = null;  //基础的地图层
    @property(Node)
    nd_roleRoot: Node = null;  //人物的地图层
    @property(Node)
    nd_bulletRoot: Node = null;  //怪物的地图层
    @property(Node)
    nd_buildingRoot: Node = null;  //建筑地图层    
    @property(Node)
    nd_randomDraw:Node = null; // 雇佣兵层
    @property(Node)
    nd_mercenaryGen:Node = null; // 雇佣兵层
    @property(Node)
    nd_stage:Node = null;           // 关卡选择界面
    @property(Node)
    nd_battle:Node = null;          // 战斗界面
    @property(Node)
    nd_info:Node = null;          // 战斗界面
    @property(ScrollView)
    sv_stage:ScrollView = null;

    mapProxy: MapProxy = null;
    proxy:MapProxy = null;
    playerProxy:PlayerProxy = null;
    packageProxy:PackageProxy = null;
    
    headquarters: Headquarters = null;
    monsterMgr: MonsterMgr = null;
    heroMgr: HeroMgr = null;
    towerMgr:TowerMgr = null;
    bulletMgr:BulletMgr = null;
    mercenaryMgr:MercenaryMgr = null;
    monsterEntryPos: Vec2 = v2(0, 0);
    mercenaryEntryPos: Vec2 = v2(0, 0);
    moduleName = "map";
    centerPos: Vec2 = v2(0, 0);
    mapSize:Size = new Size(0,0);
    ui_mercenaryGen:UIMercenaryGen = null;
    ui_randomDraw:UIRandomDraw = null;

    _mapMainView:MapMainView = null;

    curStageId:number = 0;
    stageIdMax:number = 0;
    stageData:any   = null;
    stageItemSize:Size = null;

    curWaveIndex:number = 0;
    curWaveData:any = null;
    waveList = [];
    battleState:number = 0;          //简单处理，

    emitter:Emitter = new Emitter();

    onScheduleEvent(tag:string,cb:Function){
        this.emitter.on(SCHEDULE_EVENT,tag,cb);
    }

    offScheduleEvent(tag:string,cb:Function){
        this.emitter.off(SCHEDULE_EVENT,tag,cb);
    }

    emitScheuleEvent(dt:number){
        if(this.proxy.isPause){
            return;
        }
        this.emitter.emit(SCHEDULE_EVENT,dt);
    }

    initScheuleEvent(){
        this.unschedule(this.emitScheuleEvent);
        this.schedule(this.emitScheuleEvent,TIME_FRAME);
    }

    get blockSize():Size {
        return this._mapMainView._blockSize;
    }

    get blockSizeVec2():Vec2 {
        return this._mapMainView._blockSizeVec2;
    }

    // use this for initialization
    onLoad() {
        super.onLoad();
        window["battle"] = this;
    }

    init() {            //预加载就调用 通过windowMgr.open打开才会调用这个接口
        if(this.hasInit == true) {
             return;
        }
        this.hasInit = true;

        this.mapProxy =  getMapProxy();   
        this.playerProxy = getPlayerProxy();
        this.packageProxy = getPackageProxy();
        this.initScheuleEvent();
     }

    resetMap(){
        this.monsterMgr.reset();
        this.heroMgr.reset();
        this.bulletMgr.reset();    
        this.mercenaryMgr.reset();
        this.mapProxy.augmentMgr.reset();
        this.mapProxy.randomDrawMgr.reset();
    }

    initMap(mapMainView:MapMainView) {
        if(!mapMainView){
            return;
        }
        this.init();
        this._mapMainView = mapMainView;
        this.monsterMgr = this.mapProxy.monsterMgr;
        this.heroMgr = this.mapProxy.heroMgr;
        this.towerMgr = this.mapProxy.towerMgr;
        this.bulletMgr = BulletMgr.instance;
        this.mercenaryMgr = MercenaryMgr.instance;
        this.monsterMgr.init(this);
        this.heroMgr.init(this);
        this.towerMgr.init(this);
        this.bulletMgr.init(this);
        this.mercenaryMgr.init(this);  
        this.mapProxy.augmentMgr.init();
        this.mapProxy.randomDrawMgr.init();
        
        this.ui_mercenaryGen = this.nd_mercenaryGen.getComponent(UIMercenaryGen);
        this.ui_randomDraw = this.nd_randomDraw.getComponent(UIRandomDraw);       

        this.nd_stage.active = true;
        this.nd_battle.active = false;
    }

    initStage(mapMainView:MapMainView){
        this._mapMainView = mapMainView;
        this.initMap(this._mapMainView);

        var stageListData =  App.dataMgr.getTable("stage");
        var self = this;
        var index = 0;
        var len = stageListData.list.length;
        stageListData.list.forEach(data => {
            self.loadPrefab("items/StageItem",function(node:Node){
                self.sv_stage.content.addChild(node);
                self.setStageItem(node,data);
                if(!self.stageItemSize){
                    self.stageItemSize = node.getComponent(UITransform).contentSize;
                }
                index++;
                if(index >= len){
                    var offset = self.sv_stage.getScrollOffset();
                    var x = (self.curStageId - 1) * self.stageItemSize.width;
                    App.taskOnce(function(){
                        self.sv_stage.scrollToOffset(new Vec2(x,offset.y),0);
                    },0,DELAY_TASK_KEY + "BattleMainView.sv_stage.scrollToOffset");                    
                }
            });            
        });

        this.curStageId = this.playerProxy.stageId;
        this.stageIdMax = stageListData.list.length;
    }

    scrollSVStageToStageId(stageId?:number){
        var self = this;
        if(!stageId){
            stageId = this.playerProxy.stageId;
        }
        self.curStageId = stageId;
        var offset = self.sv_stage.getScrollOffset();
        var x = (self.curStageId - 1) * self.stageItemSize.width;
        App.taskOnce(function(){
            self.sv_stage.scrollToOffset(new Vec2(x,offset.y),0);
        },0,DELAY_TASK_KEY + "BattleMainView.sv_stage.scrollToOffset");
    }

    onSVStageEvent(target:ScrollView,eventType:number){
        //todo 有问题，等重写，先跳过
        if(true) return;
        if(eventType == 9){
            if(!this.stageItemSize){
                return;
            }
            var offset = this.sv_stage.getScrollOffset();
            this.curStageId = Math.ceil(-offset.x / this.stageItemSize.width);
            var x = (this.curStageId - 1) * this.stageItemSize.width;
            this.sv_stage.scrollToOffset(new Vec2(x,offset.y));
        }
    }

    onSVStageLeft(...args:any[]){
        this.curStageId = toolKit.limitNum(this.curStageId - 1 ,1);

        if(!this.stageItemSize){
            return;
        }
        var offset = this.sv_stage.getScrollOffset();
        var x = (this.curStageId - 1) * this.stageItemSize.width;
        this.sv_stage.scrollToOffset(new Vec2(x,offset.y,),1.0);
    }

    onSVStageRight(...args:any[]){
        this.curStageId = toolKit.limitNum(this.curStageId + 1,1,this.stageIdMax);
        var offset = this.sv_stage.getScrollOffset();
        var x = (this.curStageId - 1) * this.stageItemSize.width;
        this.sv_stage.scrollToOffset(new Vec2(x,offset.y),1.0);
    }

    updateStage(){
        var children = this.sv_stage.content.children;
        var self = this;
        children.forEach(item =>{
            self.updateStageItem(item);
        })
    }

    setStageItem(item:Node,data:any){
        (item as any).data = data;
        var lb_name = toolKit.getChild(item, "lb_name").getComponent(Label);
        var lb_cost = toolKit.getChild(item,"lb_cost").getComponent(Label);
        var spt_box = toolKit.getChild(item,"spt_box").getComponent(Sprite);

        lb_name.string = lang(data.name);
        lb_cost.string = lang("stage.costTip",data.costStamina);
        this.updateStageItem(item);
    }

    updateStageItem(item:Node){
        var nd_mask = toolKit.getChild(item,"spt_mask");
        var data = (item as any).data;
        nd_mask.active = data.id > this.playerProxy.stageId;
    }

    exitBattle(){
        this.resetMap();
        this.nd_stage.active = true;
        this.nd_battle.active = false;
        this.proxy.updateView("onExitBattle");
        getLobbyProxy().updateView("onExitBattle");
        this.battleState = 0;
        this.scrollSVStageToStageId();
    }

    stopBattle(){
        this.monsterMgr.clear();
        this.heroMgr.clear();
        this.bulletMgr.clear();    
        this.mercenaryMgr.clear();
        this.battleState = 0;
    }

    pauseBattle(){
        //暂停战斗
        this.proxy.isPause = true;
    }

    resumeBattle(){
        this.proxy.isPause = false;
    }

    againBattle(){
        this.resetMap();
        this.enterBattle();
    }

    enterBattle(){              
        if(this.curStageId > this.playerProxy.stageId){
            toolKit.showTip(lang("stage.lock"));
            return;
        }
        //扣除体力
        this.stageData = App.dataMgr.findById("stage",this.curStageId);
        if(!this.stageData){
            toolKit.showTip(lang("stage.dataError"));
            return
        }
        if(!this.packageProxy.reduceItemById(ITEM_ID_ENUM.STAMINA,this.stageData.costStamina)){
            toolKit.showTip(lang("stage.noEnoughStamina"));
            return;
        }

        this.initEntryPos();
        this.initBuildings();
        this.initMercenary();
        this.initHeros();
        this.initMonsters();
        //this.initTowers();
        
        this.nd_stage.active = false;
        this.nd_battle.active = true;


        this.waveList = this.stageData.waveList;
        this.curWaveIndex = 0;
        this.mapProxy.randomDrawMgr.initRandomDrawList(); 
        this.setWaveData();
        this.battleState = 1;
        this.proxy.updateView("onEnterBattle");
        getLobbyProxy().updateView("onEnterBattle");
        
    }

    setWaveData(){
        var curWaveData =  App.dataMgr.findById("wave",this.waveList[this.curWaveIndex]);
        if (!curWaveData){
            return false
        }
        this.curWaveData = curWaveData;
        //this.monsterMgr.setWaveData(this.curWaveData);
        toolKit.getChild(this.nd_info,"waveTip").getComponent(Label).string = lang("stage.tip_1",this.curWaveIndex + 1,this.waveList.length)
        return true        
    }

    checkWave(){
        if(this.monsterMgr.isWaveEnd){
            this.curWaveIndex += 1;
            if(!this.setWaveData()){
                if(this.monsterMgr.checkAllMonstersAreClear()){
                    this.mapProxy.cmd.showWinView(this.curStageId);
                }
            }
        }
    }

    initEntryPos() {
        this.monsterEntryPos = this.mapProxy.monsterEntryPos;
        this.mercenaryEntryPos = this.mapProxy.mercenaryEntryPos;
    }
    
    initHeros() {
        //let hero = this.heroMgr.create(2, 0);
    }

    initMercenary() {
        var mercenaryId = 3;
        this.mercenaryMgr.addMercenaryGenPool(mercenaryId);
    }

    initMonsters() {        
        var self = this;
        // 测试代码
        var createMonster = function(){
            var monsterType = 10002;
            var monsterEntryPos = new Vec2(self.monsterEntryPos.x + toolKit.getRand(-20,20),self.monsterEntryPos.y)
            var count = 1;
            self.monsterMgr.createMultiple(monsterType,count, monsterEntryPos, (monster: Monster) => {
                //monster.moveToHeadquarters();
            });
        }
        //this.monsterMgr.addScheduleTask(200,5 * 1000,{},createMonster,"createMonster");
        createMonster();
    }
    initTowers(){
/*         this.towerMgr.create(-30,-40,1001);
        this.towerMgr.create(30,-40,1001); */
    }
    clearHero(heroId: number) {
        this.heroMgr.clearHero(heroId);
    }
    clearMercenary(mercenaryId: number) {
        this.mercenaryMgr.clearMercenary(mercenaryId);
    }
    clearMonster(monsterId: number) {
        this.monsterMgr.clearMonster(monsterId);
    }
    initBuildings() {
        let headquarters = new Headquarters(this);
        this.createBuilding(headquarters, this.mapProxy.headquartersPos);
        this.mapProxy.headquarters = headquarters;
        this.headquarters = headquarters;
    }
    createBuilding(building: Building, tilePos: Vec2) {
        var pos = MapUtils.getViewPosByTilePos(tilePos);
        building.createBuilding(pos);
        var maskArea = building.getRealArea();
        var self = this;
        maskArea.forEach((tilePos) => {
            let block = self.getBlockByPos(tilePos); 
            block.createBuilding(building)     
        })
    }
    getBlockByPos(tilePos: Vec2) {
        return this._mapMainView.getBlock(tilePos.x, tilePos.y);
    }

    exitStage(){
        this.resetMap();
        this.node.active = false;
        var proxy = getLobbyProxy();
        proxy.updateView("switchMenu",proxy.MENU_ENUM.COMMON);        
    }

    updateBattleCoin(){
        this.ui_randomDraw.updateBattleCoin();
    }

    updateRandomDrawList(){
        this.ui_randomDraw.updateRandomDrawList();
    }

    updateAllRolesSiblingIndex(){
        var children = this.nd_roleRoot.children;
        children.sort((a,b)=>{
            return Math.floor(b.position.y/10) - Math.floor(a.position.y/10);
        });
        children.forEach((node,index)=>{
            node.setSiblingIndex(index);
        });
    }

    update(dt: number): void {
        if(this.proxy.isPause){
            return;
        }
        super.update(dt);
        this.mapProxy.battleTimeStamp += dt;
        if(this.battleState == 1){
            this.mapProxy.tryAddBattleCoin(dt);
            this.checkWave();
            this.updateAllRolesSiblingIndex();
        }        
    }

    //测试区域


};


