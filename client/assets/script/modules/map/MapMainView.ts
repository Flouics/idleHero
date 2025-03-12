

import {Block} from "../../logic/Block";
import {TouchUtils, TouchUtilsEvent} from "../../utils/TouchUtils";
import { Debug }   from "../../utils/Debug";
import { MapProxy }  from "./MapProxy";
import {BaseView} from "../../zero/BaseView";
import { _decorator, EventTouch, instantiate, Node, Prefab, Size, UITransform, v2, Vec2, Vec3, approx } from "cc";
import {MapUtils} from "../../logic/MapUtils";
import { AsyncTaskMgr } from "../../manager/AsyncTaskMgr";
import { Hero } from "../../logic/Hero";
import { HeroMgr } from "../../manager/battle/HeroMgr";
import { MineMgr } from "../../manager/battle/MineMgr";
import { Headquarters } from "../../logic/building/Headquarters";
import { Building } from "../../logic/Building";
import { DigTask } from "../../logic/task/DigTask";
import { lang, TIME_FRAME } from "../../Global";
import { DEBUG } from "cc/env";
import { getPackageProxy } from "../package/PackageProxy";
import { ITEM_ID_ENUM } from "../../logic/Item";
import { toolKit } from "../../utils/ToolKit";
import { App } from "../../App";
import { UICallbacks } from "../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines";
import { BattleMainView } from "./BattleMainView";
import { UIID_Map } from "./MapInit";


export enum OPERATION_ENUM {
    COMMON =  0,
    DIG =  1,
    BUILD = 2,
}


const {ccclass, property} = _decorator;
@ccclass("MapMainView")
export class MapMainView extends BaseView {    
    margin_x: number = 10;  //  一边block的个数  会被mapProxy 重写
    margin_y: number = 10;
    @property(Node)
    nd_contentRoot: Node = null;  //contentRoot  
    @property(Node)
    nd_mapRoot: Node = null;  //基础的地图层
    @property(Node)
    nd_heroRoot: Node = null;  //人物的地图层
    @property(Node)
    nd_mineRoot: Node = null;  //矿产的地图层
    @property(Node)
    nd_buildingRoot: Node = null;  //建筑地图层  


    @property(Prefab)
    pb_block = null;            //瓦片资源

    proxy: MapProxy = null;
    
    _blockSize: Size = null;
    _blockSizeVec2: Vec2 = null;         //size 转成矢量，方便转化真实尺寸。
    blockMap: { [k1: number]: { [k2: number]: Block } } = {};
    buildingMap: { [key: number]: Building } = {};

    moduleName = "map";
    centerPos: Vec2 = v2(0, 0);
    mapSize:Size = new Size(0,0);

    operation: number = OPERATION_ENUM.COMMON;
    testHero: Hero = null;
    headquarters: Headquarters = null;
    heroMgr: HeroMgr = null;
    mineMgr: MineMgr = null;

    // use this for initialization
    onLoad() {
        super.onLoad();
        this.proxy = this.proxy as MapProxy;
        this.blockMap = this.proxy.blockMap;
        this.initMap();
   
        DEBUG && (window["map"] = this);               
    }

    reloadMapView(){
        this.blockMap = this.proxy.blockMap;
        this.initMap();
    }
    
    initMap() {
        this.heroMgr = HeroMgr.instance;
        this.margin_x = this.proxy.margin_x;
        this.margin_y = this.proxy.margin_y;             
        
        this.initBlocks();
        this.nd_contentRoot.on(TouchUtilsEvent.click, this.onMapClick.bind(this));
    }

    enterStage(block:Block){
        //扣除体力
        let stageId = toolKit.getRand(1,2);
        let stageData = App.dataMgr.findById("stage",stageId);
        if(!stageData){
            toolKit.showTip(lang("stage.dataError"));
            return
        }
        if(!getPackageProxy().reduceItemById(ITEM_ID_ENUM.STAMINA,stageData.costStamina)){
            toolKit.showTip(lang("stage.noEnoughStamina"));
            return;
        }

        let uic:UICallbacks = {
            onAdded:(node:Node) => {
                let comp = node.getComponent(BattleMainView);
                comp!.initStage(stageId);
                comp!.setDigBlock(block);
            }
        }
        this.proxy.cmd.showView(UIID_Map.BattleMainView,null,uic);
    }

    onEnterBattle(){

    }

    onExitBattle(){

    }

    initBlockSize(size: Size) {
        this._blockSize = size;
        this._blockSizeVec2 = new Vec2(size.width, size.height);
    }

    initBlocks() {
        //方块数据
        let blockSize = new Size(this.proxy.blockWidth,this.proxy.blockHeight);
        this.initBlockSize(blockSize);
        MapUtils.initBlockData(blockSize);
        //this.mapSize = winSize;
        this.mapSize = new Size(
            (this.margin_x * 2 + 1) * this._blockSize.width
            , (this.margin_y * 2 + 1) * this._blockSize.height
        );
        
        MapUtils.initMapData(this.mapSize,this.margin_x,this.margin_y)
        //touch触摸的尺寸。        
        let touchUtils = this.nd_contentRoot.getComponent(TouchUtils);
        if (touchUtils) {
            touchUtils.init(this.mapSize);
        }

        //先初始化数据
        for (let i = -this.margin_x; i <= this.margin_x; i++) {
            this.blockMap[i] = {};
            for (let j = -this.margin_y; j <= this.margin_y; j++) {
                let block = new Block(this, i, j);
                block.unserialize(this.proxy.getBlockJson(i,j))
                this.blockMap[i][j] = block;
            }
        }

        //--UI初始化丢给异步
        for (let i = -this.margin_x; i <= this.margin_x; i++) {
            for (let j = -this.margin_y; j <= this.margin_y; j++) {
                this.createBlock(i, j);
                          
                if (Math.abs(i) < 11 && Math.abs(j) < 8) {
                    this.createBlock(i, j);
                } else {
                    AsyncTaskMgr.instance.newAsyncTask(() => {
                        this.createBlock(i, j);
                    });
                } 
            }
        }
    }

    createBlock(i: number, j: number) {
        let block = this.getBlock(i, j)
        if (block) {
            block.initUI()
        }
    }
    getBlockByPos(tilePos: Vec2) {
        return this.getBlock(tilePos.x, tilePos.y);
    }
    getBlock(x: number, y: number) {
        return this.proxy.getBlock(x,y);
    }

    initHeros() {
        let hero = this.heroMgr.create(2, 0);
        this.testHero = hero;
    }

    clearHero(heroId: number) {
        this.heroMgr.clearHero(heroId);
    }

    initBuildings() {
        let headquarters = new Headquarters();
        this.createBuilding(headquarters, v2(0, 0));
        this.buildingMap[headquarters.idx] = headquarters;
        this.headquarters = headquarters;
    }

    checkBlock(pos: Vec2) {
        return this.proxy.checkBlock(pos);
    }

    digBlock(params:{pos:Vec2}){
        let pos = params.pos;
        let block = this.proxy.getBlock(pos.x,pos.y);
        let isBattle = toolKit.getRand(1,10) > 5;
        if(isBattle){
            this.enterStage(block);
        }else{
            block.onDig();
        }
    }

    buildTower(params:any){
        //todo
        Debug.log("随机建造炮台")
    }

    // 地图触发了点击事件
    onMapClick(event: EventTouch) {
        var touchEndPos = event.getLocation();
        var viewPos = this.nd_mapRoot.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(touchEndPos.x, touchEndPos.y,0));
        var tilePos = MapUtils.getTilePosByViewPos(viewPos);
        var block = this.getBlockByPos(tilePos);

        // todo 应该弹出界面让玩家选择
        switch (block.id) {
            case Block.BLOCK_VALUE_ENUM.BLOCK:
                this.command("pushTask",new DigTask(tilePos.x, tilePos.y));
                break;        
            case Block.BLOCK_VALUE_ENUM.EMPTY:
                this.testHero.moveToPos(tilePos);                
                //this.command("pushTask",new BuildTask(tilePos.x, tilePos.y));
                break;    
            default:
                break;
        }
    }

    dealAllBlocks(dealFunc: Function) {
        for (var i in this.blockMap) {
            for (var j in this.blockMap[i]) {
                dealFunc(this.blockMap[i][j]);
            }
        }
    }

    createBuilding(building: Building, toPos: Vec2) {
        building.createBuilding(this.nd_buildingRoot,toPos);
        var maskArea = building.getRealArea();
        var self = this;
        maskArea.forEach((pos) => {
            let block = self.getBlockByPos(pos); 
            block.createBuilding(building)     
        })
    }

    // 地图移动时，地图重新显示
    onMapMove(){
        var offsetPos = new Vec2(this.node.position.x - this.centerPos.x,this.node.position.y - this.centerPos.y);
        var x = Math.ceil(offsetPos.x/this._blockSize.width)
        var y = Math.ceil(offsetPos.y/this._blockSize.height)

        var map = {};
        for (var i in this.blockMap) {
            map[i] = {}
            for (var j in this.blockMap[i]) {
                map[i][j] = this.blockMap[i][j];
            }
        }
        
        if(x > 0){
            for (let i = -this.margin_x; i < this.margin_x + x; i++) {
                var blocks = this.blockMap[i];
                for (const key in blocks) {
                    if (Object.prototype.hasOwnProperty.call(blocks, key)) {
                        const block = blocks[key];
                        block.move(new Vec2(this.mapSize.width,0))
                    }
                }
            }
        }else if(x < 0){
            for (let i = this.margin_x; i > this.margin_x + x; i--) {
                var blocks = this.blockMap[i];
                for (const key in blocks) {
                    if (Object.prototype.hasOwnProperty.call(blocks, key)) {
                        const block = blocks[key];
                        block.move(new Vec2(-this.mapSize.width,0))
                    }
                }
            }
        }

        if(y > 0){
            for (let i = -this.margin_y; i < this.margin_y + y; i++) {
                var blocks = map[i];
                for (const key in blocks) {
                    if (Object.prototype.hasOwnProperty.call(blocks, key)) {
                        const block = blocks[key];
                        block.move(new Vec2(0,this.mapSize.height))
                    }
                }
            }
        }else if(y < 0){
            for (let i = this.margin_y; i > this.margin_y + y; i--) {
                var blocks = map[i];
                for (const key in blocks) {
                    if (Object.prototype.hasOwnProperty.call(blocks, key)) {
                        const block = blocks[key];
                        block.move(new Vec2(0,-this.mapSize.height))
                    }
                }
            }
        }
        
    }

    //测试区域
    printBlocks(posList: Vec2[]) {
        var self = this;
        this.dealAllBlocks((block: Block) => {
            block.event = 0;
        })
        posList.forEach((pos) => {
            self.getBlockByPos(pos).event = 1;
        })
    }

};


