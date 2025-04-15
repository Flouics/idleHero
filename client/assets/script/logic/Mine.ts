
import {MapUtils} from "./MapUtils";
import { Debug }  from "../utils/Debug";
import { empty, merge } from "../Global";
import { BoxBase } from "./BoxBase";
import { MineMgr } from "../manager/battle/MineMgr";
import { serialize } from "../utils/Decorator";
import { Item } from "./Item";
import { instantiate, Node, Prefab, resources } from "cc";
import { UIMine } from "../modules/map/UIMine";
import { getMapProxy } from "../modules/map/MapProxy";
import { getRewardProxy } from "../modules/reward/RewardProxy";
import { uiKit } from "../utils/UIKit";
import { App } from "../App";
import { toolKit } from "../utils/ToolKit";
import { getPackageProxy } from "../modules/package/PackageProxy";
import { getTimeProxy } from "../modules/time/TimeProxy";

/**
 * 每次计算产出的时间。默认X秒一次
 */
let PER_CAC_PRODUCT_TIME = 20;
/** 
 * 配表数据是多长时间的产量，默认X小时
 */
let PRODUCT_TIME = 60 * 60 * 1;
export class Mine extends BoxBase {
    static _idIndex = 0;

    mineMgr:MineMgr = null;
    data = null;
    @serialize()
    itemMap:{[key:number]:Item} = {};

    @serialize()
    produceTimeLast:number = null;    

    _pb_url:string = "prefab/map/UIMine";
    constructor(data:any, tx: number = 0, ty: number = 0) {
        super();
        this.tx = tx;
        this.ty = ty;
        this.id = data.id;
        Mine._idIndex++;
        this.idx = Mine._idIndex;        
        this.data = App.dataMgr.findById("mine",this.id);
        merge(this.data,data);
        this.init();
    }

    init(){
        this.mineMgr = MineMgr.instance;     
    }
    
    initUI(parent:Node,cb?:Function) {
        if(this._pb_url == "") {
            return;
        }
        uiKit.loadPrefab(this._pb_url,(node:Node) => {
            let viewPos = this.pos;
            node.parent = parent;
            node.setPosition(viewPos.x, viewPos.y);
            this.bindUI(node.getComponent(UIMine));
        })
    }
    
    calcProduct(deltaTime:number){
        if(empty(this.data)){
            return
        }

        this.data.productList.forEach(product => {
            let count = Math.round(product.count / PRODUCT_TIME * deltaTime);
            this.addItem(product.id,count);
        });
    }

    calcProductTime(){
        if(empty(this.data)){
            return
        }
        let nowTime = getTimeProxy().getTime();
        if(this.produceTimeLast == null){
            this.produceTimeLast = nowTime;
            return;
        }
        let deltaTime = (nowTime - this.produceTimeLast)/1000;
        if(deltaTime > PER_CAC_PRODUCT_TIME ){
            this.calcProduct(deltaTime);
            this.produceTimeLast = nowTime;
        }
    }

    addItem(id:number,count:number){
        if (this.itemMap[id] == null){
            this.itemMap[id] = new Item(id);
        }
        this.itemMap[id].add(count);
    }

    getRwd(){
        let itemList = [];
        for (const key in this.itemMap) {
            itemList.push(this.itemMap[key]);
        }
        this.itemMap = {};
        getPackageProxy().addItemList(itemList);
        getRewardProxy().cmd.addRwdList(itemList);
        getRewardProxy().cmd.float();        
    }

    clear(){
        this.mineMgr.clearMine(this.idx)
    }

    destroy(isAction = false){
        //--todo表现
        super.destroy();     
        if(this.node){
            this.node.removeFromParent();
        }   
    }

    update(dt:number){
        this.calcProductTime();
    }
}