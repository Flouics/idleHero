
import { MonsterMgr } from "../../manager/battle/MonsterMgr";
import {HeroMgr} from "../../manager/battle/HeroMgr";
import { getMapProxy, MapProxy }  from "./MapProxy";
import { BulletMgr }  from "../../manager/battle/BulletMgr";
import {BaseView} from "../../zero/BaseView";
import { _decorator, Label, Node, Size, UITransform, v2, Vec2, Vec3 } from "cc";
import { toolKit } from "../../utils/ToolKit";
import {MapMainView} from "./MapMainView";
import {App } from "../../App";
import {MapUtils} from "../../logic/MapUtils";
import { clone, lang } from "../../Global";
import { PlayerProxy,  getPlayerProxy } from "../player/PlayerProxy";
import { getPackageProxy, PackageProxy } from "../package/PackageProxy";
import { ITEM_ID_ENUM } from "../../logic/Item";
import { getLobbyProxy } from "../lobby/LobbyProxy";
import { Monster } from "../../logic/Monster";
import { DEBUG } from "cc/env";
import { Mercenary } from "../../logic/Mercenary";
import { MercenaryMgr } from "../../manager/battle/MercenaryMgr";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UIID_Map } from "./MapInit";
import { Block } from "../../logic/Block";

const {ccclass, property} = _decorator;
@ccclass("BattleMainView")
export class BattleMainView extends BaseView {
    _prefabUrl = "prefab/map/"  
    @property(Node)
    nd_info:Node = null;          // 战斗界面
    @property(Node)
    nd_roleRoot: Node = null;  //人物的地图层
    @property(Node)
    nd_bulletRoot: Node = null;  //怪物的地图层

    proxy: MapProxy = null;
    playerProxy:PlayerProxy = null;
    packageProxy:PackageProxy = null;
    
    monsterEntryPos: Vec2 = v2(0, 0);
    mercenaryEntryPos: Vec2 = v2(0, 0);
    moduleName = "map";
    centerPos: Vec2 = v2(0, 0);
    mapSize:Size = new Size(0,0);

    _mapMainView:MapMainView = null;

    curStageId:number = 0;
    stageData:any   = null;

    curWaveIndex:number = 0;
    curWaveData:any = null;
    waveList = [];
    battleState:number = 0;          //简单处理，
    digBlock:Block;

    // use this for initialization
    onLoad() {
        super.onLoad();
        
        DEBUG && (window["battle"] = this);
    }
    start(){
        this.enterBattle();
    }

    init() {           
        if(this.hasInit == true) {
             return;
        }
        this.hasInit = true;

        this.proxy =  getMapProxy();   
        this.playerProxy = getPlayerProxy();
        this.packageProxy = getPackageProxy();
     }

    resetMap(){
        MonsterMgr.instance.reset();
        BulletMgr.instance.reset();    
        MercenaryMgr.instance.reset();
    }

    initStage(stageId:number){     
        //this.curStageId = this.playerProxy.stageId;   
        this.curStageId = stageId;
        this.stageData = App.dataMgr.findById("stage",this.curStageId);
    }

    setDigBlock(block:Block){
        this.digBlock = block;
    }

    exitBattle(){
        this.resetMap();
        getLobbyProxy().updateView("onExitBattle");
        this.battleState = 0;
    }

    stopBattle(){
        MonsterMgr.instance.clear();
        HeroMgr.instance.clear();
        BulletMgr.instance.clear();    
        MercenaryMgr.instance.clear();
        this.battleState = 0;
    }

    pauseBattle(){
        //暂停战斗
        this.proxy.isPause = true;
    }

    resumeBattle(){
        this.proxy.isPause = false;
    }

    enterBattle(){ 
        if(!this.stageData){
            toolKit.showTip(lang("stage.dataError"));
            return
        }

        this.initEntryPos();
        this.initMercenary();
        this.initHeros();
        this.initMonsters();

        this.waveList = this.stageData.waveList;
        this.curWaveIndex = 0;
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
        toolKit.getChild(this.nd_info,"waveTip").getComponent(Label).string = lang("stage.tip_1",this.curWaveIndex + 1,this.waveList.length)
        //直接生成，不再交给计时器
        this.curWaveData.monsterList.forEach(monsterId => {
            var count = 1;
            var monsterEntryPos = new Vec2(self.proxy.monsterEntryPos.x + toolKit.getRand(-10,10),self.proxy.monsterEntryPos.y)
            MonsterMgr.instance.createMultiple(monsterId,count, monsterEntryPos, (monster: Monster) => {
                monster.moveToHeadquarters();
            });  
        }); 

        return true        
    }

    checkWave(){
        if(MonsterMgr.instance.checkAllMonstersAreClear()){
            this.curWaveIndex += 1;
            if(!this.setWaveData()){
                this.proxy.cmd.showWinView(this.curStageId);
                this.digBlock && this.digBlock.onDig();
            }            
        }                
    }

    initEntryPos() {
        this.monsterEntryPos = this.proxy.monsterEntryPos;
        this.mercenaryEntryPos = this.proxy.mercenaryEntryPos;
    }
    
    initHeros() {
        //let hero = HeroMgr.instance.create(2, 0);
    }

    initMercenary() {
        var mercenaryId = 3;
        MercenaryMgr.instance.addMercenaryGenPool(mercenaryId);
        //不再通过计时器去生成，直接生成一个
        MercenaryMgr.instance.create(mercenaryId);
    }

    initMonsters() {        

    }

    initTowers(){
/*         this.towerMgr.create(-30,-40,1001);
        this.towerMgr.create(30,-40,1001); */
    }
    clearHero(heroId: number) {
        HeroMgr.instance.clearHero(heroId);
    }
    clearMercenary(mercenaryId: number) {
        MercenaryMgr.instance.clearMercenary(mercenaryId);
    }
    clearMonster(monsterId: number) {
        MonsterMgr.instance.clearMonster(monsterId);
    }

    exitStage(){
        this.resetMap();
        oops.gui.remove(UIID_Map.BattleMainView);
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
        this.proxy.battleTimeStamp += dt;
        super.update(dt);
        if(this.battleState == 1){
            this.checkWave();
            this.updateAllRolesSiblingIndex();
        }        
    }

    //测试区域


};


