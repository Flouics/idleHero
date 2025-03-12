
import {MapUtils} from "./MapUtils";
import { Debug }  from "../utils/Debug";
import { empty } from "../Global";
import { BoxBase } from "./BoxBase";
import { MineMgr } from "../manager/battle/MineMgr";
import { serialize } from "../utils/Decorator";
import { Item } from "./Item";
import { instantiate, Node, Prefab, resources } from "cc";
import { UIMine } from "../modules/map/UIMine";
import { getMapProxy } from "../modules/map/MapProxy";

export class Mine extends BoxBase {
    static _idIndex = 0;

    mineMgr:MineMgr = null;
    data = null;
    @serialize()
    itemMap:{[key:number]:Item} = null;

    @serialize()
    produceTimeLast:number = null;    

    _pb_url:string = "";    //不预先加载的原因是因为种类比较多，而且基本上不会复用。
    constructor(data:any, x: number = 0, y: number = 0) {
        super();
        this.x = x;
        this.y = y;
        this.id = data.id;
        Mine._idIndex++;
        this.idx = Mine._idIndex;        
        this.data = data;
        this.init();
    }

    init(){
        this.mineMgr = MineMgr.instance;

        //基础数据初始化           
    }

    
    initUI(parent:Node,cb?:Function) {
        let self = this;
        if(this._pb_url == "") {
            return;
        }
        resources.load(this._pb_url, Prefab, function (err: any, prefab: any) {
            if (err) {
                Debug.error(this._pb_url, err);
            }else{
                let node = instantiate(prefab);
                let viewPos = MapUtils.getViewPosByTilePos(self.pos);
                node.parent = parent;
                node.setPosition(viewPos.x, viewPos.y);
                self.bindUI(node.getComponent(UIMine));
            }
        })
    }

    
    calcProduct(deltaTime:number){
        if(empty(this.data)){
            return
        }

        this.data.product.forEach(product => {
            let item = new Item(product.id,product.count * deltaTime);
        });
    }

    calcProductTime(){
        if(empty(this.data)){
            return
        }
        let nowTime = getMapProxy().getMapTime();
        if(this.produceTimeLast == null){
            this.produceTimeLast = nowTime;
            return;
        }
        let deltaTime = nowTime - this.produceTimeLast;
        if(deltaTime > 1){
            this.calcProduct(deltaTime);
            this.produceTimeLast = nowTime;
        }
    }

    addItem(item:Item){
        if (this.itemMap[item.id] == null){
            this.itemMap[item.id] = new Item(item.id);
        }
        this.itemMap[item.id].add(item.count);
    }

    clear(){
        this.mineMgr.clearMine(this.idx)
    }

    destroy(isAction = false){
        //--todo表现
        super.destroy();     
    }

    update(dt:number){
        //todo;
    }
}