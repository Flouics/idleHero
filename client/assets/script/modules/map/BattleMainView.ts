
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
import { clone, empty, lang } from "../../Global";
import { PlayerProxy,  getPlayerProxy } from "../player/PlayerProxy";
import { getPackageProxy, PackageProxy } from "../package/PackageProxy";
import { ITEM_ID_ENUM } from "../../logic/Item";
import { getLobbyProxy } from "../lobby/LobbyProxy";
import { Monster } from "../../logic/Monster";
import { DEBUG } from "cc/env";
import { Mercenary } from "../../logic/Mercenary";
import { MercenaryMgr } from "../../manager/battle/MercenaryMgr";
import { oops } from "../../oops/core/Oops";
import { UIID_Map } from "./MapInit";
import { Block } from "../../logic/Block";
import { STATE_ENUM } from "../../logic/stateMachine/StateMachine";
import { MineMgr } from "../../manager/battle/MineMgr";
import { runInThisContext } from "vm";

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
    
    moduleName = "map";
    centerPos: Vec2 = v2(0, 0);
    mapSize:Size = new Size(0,0);

    _mapMainView:MapMainView = null;

    curStageId:number = 0;
    stageData:any   = null;

    curWaveIndex:number = 0;
    curWaveData:any = null;
    waveList = [];
    battleState:number = 0;          //简单处理，0 未开战  1战斗准备状态 2战斗状态
    digBlock:Block;
    curMercenary:Mercenary = null;
    

    // use this for initialization
    onLoad() {
        super.onLoad();
        this.initBattle();
        
        DEBUG && (window["battle"] = this);
    }
    start(){
        this.enterBattle();
    }

    initBattle() {           
        if(this.hasInit == true) {
             return;
        }
        this.hasInit = true;

        this.proxy =  getMapProxy();   
        this.playerProxy = getPlayerProxy();
        this.packageProxy = getPackageProxy();

        MonsterMgr.instance.init(this.nd_roleRoot);
        BulletMgr.instance.init(this.nd_bulletRoot);    
        MercenaryMgr.instance.init(this.nd_roleRoot);

        MonsterMgr.instance.reset();
        BulletMgr.instance.reset();    
        MercenaryMgr.instance.reset();
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

    onClickExitBattle(){
        this.exitBattle();
    }

    exitBattle(){
        //this.resetMap();
        this.stopBattle();
        getLobbyProxy().updateView("onExitBattle");
        this.proxy.isBattle = false;
        this.close();
    }

    againBattle(){
        toolKit.showTip("暂时先屏蔽，看需求");
    }

    stopBattle(){
        MonsterMgr.instance.clear();
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
        this.proxy.isBattle = true;
        this.initMercenary();
        this.initMonsters();

        this.waveList = this.stageData.waveList;
        this.curWaveIndex = 0;
        this.battleState = 1;
        this.proxy.updateView("onEnterBattle");
        getLobbyProxy().updateView("onEnterBattle");  
        this.checkWave();      
    }

    setWaveData(){
        var curWaveData =  App.dataMgr.findById("wave",this.waveList[this.curWaveIndex]);
        if (!curWaveData){
            return false
        }
        this.curWaveData = curWaveData;
        toolKit.getChild(this.nd_info,"waveTip").getComponent(Label).string = lang("stage.tip_1",this.curWaveIndex + 1,this.waveList.length)
        //直接生成，不再交给计时器
        MonsterMgr.instance.setWaveData(this.curWaveData);
        return true        
    }

    checkWave(){
        if(MonsterMgr.instance.checkAllMonstersAreClear()){
            if(!this.setWaveData()){
                this.proxy.cmd.showWinView(this.curStageId);
                this.digBlock && this.digBlock.onDig();   
                this.battleState = 0;
                return false;            
            }
            this.battleState = 1;
            this.curWaveIndex += 1;
            return true;           
        }else{
            if(this.curWaveIndex > 0 && empty(MercenaryMgr.instance.mercenaryMap)){
                getMapProxy().cmd.showFailView();
                this.battleState = 0;
            }
            return false;     
        }           
    }

    initMercenary() {
        var mercenaryId = 2;
        MercenaryMgr.instance.addMercenaryGenPool(mercenaryId);
        //不再通过计时器去生成，直接生成一个
        let mercenary = MercenaryMgr.instance.create(mercenaryId);
        mercenary.stateMachine.switchStateIdle();
        this.curMercenary = mercenary;
    }

    initMonsters() {        

    }

    checkBattle(){
        if(this.battleState == 1){
            if(!MonsterMgr.instance.checkIsReady()){
                return;
            }
            this.battleState = 2;
            let monsterMap =  MonsterMgr.instance.monsterMap;
            monsterMap.forEach(monster => {
                monster.stateMachine.switchState(STATE_ENUM.ATTACK);
            });
            if(this.curMercenary.checkLive()){
                this.curMercenary.stateMachine.switchState(STATE_ENUM.ATTACK);
            }
        }else{
            if(this.checkWave()){  
                if(this.battleState == 1){
                    let monsterMap =  MonsterMgr.instance.monsterMap;
                    monsterMap.forEach(monster => {
                        monster.stateMachine.switchState(STATE_ENUM.IDLE);
                    });
                    if(this.curMercenary.checkLive()){
                        this.curMercenary.stateMachine.switchState(STATE_ENUM.IDLE);
                    }
                }
            }            
        }




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

    update(dt: number): void {
        if(this.proxy.isPause){
            return;
        }
        super.update(dt);
        if(this.battleState > 0){
            this.checkBattle();           
        }        
    }

    //测试区域


};


