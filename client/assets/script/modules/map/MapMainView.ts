

import Block from "../../logic/Block";
import TouchUtils from "../../utils/TouchUtils";
import { Debug }   from "../../utils/Debug";
import { MapProxy }  from "./MapProxy";
import BaseView from "../../zero/BaseView";
import { _decorator, EventTouch, instantiate, Node, Prefab, Size, UITransform, v2, Vec2, Vec3, approx } from "cc";
import MapUtils from "../../logic/MapUtils";
import { nullfun, winSize } from "../../Global";
import BattleMainView from "./BattleMainView";
import App from "../../App";
import { toolKit } from "../../utils/ToolKit";


/**
 * Created by Administrator on 2017/9/12.
 * 独立所有场景之外。
 */


const {ccclass, property} = _decorator;
@ccclass("MapMainView")
export default class MapMainView extends BaseView {    
    margin_x: number = 10;  //  一边block的个数  会被mapProxy 重写
    margin_y: number = 10;
    @property(Node)
    nd_mapRoot: Node = null;  //基础的地图层
    @property(Node)
    nd_battleMainRoot: Node = null;  //战斗的地图层

    @property(Prefab)
    pb_block = null;            //瓦片资源

    mapProxy: MapProxy = null;
    _blockSize: Size = null;
    _blockSizeVec2: Vec2 = null;         //size 转成矢量，方便转化真实尺寸。
    blockMap: { [k1: number]: { [k2: number]: Block } } = {};
    moduleName = "map";
    centerPos: Vec2 = v2(0, 0);
    mapSize:Size = new Size(0,0);
    _battleMainView:BattleMainView;

    // use this for initialization
    onLoad() {
        super.onLoad();
        window["map"] = this;
        this.mapProxy = this.proxy as MapProxy;
        this.blockMap = this.mapProxy.blockMap;
        this.initMap();
    }

    reloadMapView(){
        this.blockMap = this.mapProxy.blockMap;
        this.initMap();
    }

    initMap() {
        this.margin_x = this.mapProxy.margin_x;
        this.margin_y = this.mapProxy.margin_y;             
        
        this.initBlocks();
        this.node.on("map_click", this.onMapClick.bind(this));
        this._battleMainView = this.nd_battleMainRoot.getComponent(BattleMainView);
        this.nd_battleMainRoot.active = false;   
    }

    enterStage(){
        this.nd_battleMainRoot.active = true;   
        this._battleMainView.initStage(this);
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
        let blockSize = new Size(this.mapProxy.blockWidth,this.mapProxy.blockHeight);
        this.initBlockSize(blockSize);
        MapUtils.initBlockData(blockSize);
        this.mapSize = winSize;
        MapUtils.initMapData(this.mapSize,this.margin_x,this.margin_y)
        //touch触摸的尺寸。        
        let touchUtils = this.node.getComponent(TouchUtils);
        if (touchUtils) {
            touchUtils.init(this.mapSize);
        }

        //先初始化数据
        for (let i = -this.margin_x; i <= this.margin_x; i++) {
            this.blockMap[i] = {};
            for (let j = -this.margin_y; j <= this.margin_y; j++) {
                let block = new Block(this, i, j);
                block.unserialize(this.mapProxy.getBlockJson(i,j))
                this.blockMap[i][j] = block;
            }
        }

        //--UI初始化丢给异步
        for (let i = -this.margin_x; i <= this.margin_x; i++) {
            for (let j = -this.margin_y; j <= this.margin_y; j++) {
                this.createBlock(i, j);
                /*                 
                if (Math.abs(i) < 11 && Math.abs(j) < 8) {
                    this.createBlock(i, j);
                } else {
                    AsyncTaskMgr.getInstance(AsyncTaskMgr).newAsyncTask(function () {
                        this.createBlock(i, j);
                    }.bind(this));
                } 
                */
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
        return this.mapProxy.getBlock(x,y);
    }

    checkBlock(pos: Vec2) {
        return this.mapProxy.checkBlock(pos);
    }
    digBlock(params:any){
        //todo
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
    }

    dealAllBlocks(dealFunc: Function) {
        for (var i in this.blockMap) {
            for (var j in this.blockMap[i]) {
                dealFunc(this.blockMap[i][j])
            }
        }
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


