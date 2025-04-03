/**
 * Created by Administrator on 2017/7/30.
 * 所有需要用NodePool缓存处理的管理池
 */

import { instantiate, Node, NodePool, Prefab, resources } from "cc";
import {BaseClass} from "../zero/BaseClass";
import { Debug }   from "../utils/Debug";
import { empty } from "../Global";

class Pool {
    _scriptName: string;
    _pb_item: any;
    buffMinCount: number = 5;
    buffMaxCount: number = 10;
    _pool: NodePool;
    constructor(pb_item: any, scriptName: string, buffMinCount: number = 5, buffMaxCount: number = 10) {
        if (!pb_item) {
            return;
        }
        this._scriptName = scriptName;
        this._pb_item = pb_item;
        this.buffMinCount = buffMinCount;
        this.buffMaxCount = buffMaxCount;
        this._pool = new NodePool(scriptName);
    }

    initialize() {
        for (var i = 0; i < this.buffMinCount; i++) {
            this._pool.put(instantiate(this._pb_item));
        }
    };

    getItem(data: any) {
        //有奇怪的BUG。
        if (this._pool.size() < this.buffMinCount) {
            this._pool.put(instantiate(this._pb_item));
        }
        var item = this._pool.get(data);
        (item as any).itemPool = this;
        return item;
    };

    recycleItem(item: Node) {
        if (!item) {
            return;
        }
        if (!empty(this._scriptName) && !item.getComponent(this._scriptName)) {
            Debug.warn('item is not pool member', item.name);
            item.destroy();
            return;
        }

        if (this._pool.size() < this.buffMaxCount) {
            this._pool.put(item);
        } else {
            item.destroy();
        }
        return true;
    };

    getItemScriptComp(data: any) {
        var item = this.getItem(data);
        return item.getComponent(this._scriptName);
    };

    recycleItemScriptComp(itemScriptComp: any) {
        if (!itemScriptComp) {
            return;
        }
        return this.recycleItem(itemScriptComp.node);
    };

};

export class PoolItemEnum {
    tag:string;
    prefabUrl:string;
    scriptName:string;
    constructor(tag:string,prefabUrl:string,scriptName:string){
        this.tag = tag;
        this.prefabUrl = prefabUrl;
        this.scriptName = scriptName;
    }
};

export let POOL_TAG_ENUM = {
    MONSTER: new PoolItemEnum("monster","prefab/map/UIMonster","UIMonster")
    ,MERCENARY: new PoolItemEnum("mercenary","prefab/map/UIMercenary","UIMercenary")
    ,HERO:new PoolItemEnum("hero","prefab/map/UIHero","UIHero")
    ,ITEM:new PoolItemEnum("item","prefab/package/UIItem","UIItem")
    ,BULLET:new PoolItemEnum("bullet","prefab/map/bullet/UIBullet","UIBullet")
    ,BULLET_1001:new PoolItemEnum("bullet_1001","prefab/map/bullet/UIBullet_1001","UIBullet_1001")
    ,BULLET_1010:new PoolItemEnum("bullet_1010","prefab/map/bullet/UIBullet_1010","UIBullet_1010")
}

export class PoolMgr extends BaseClass {
    poolMap:{[key:string]:Pool} = {};

    constructor(){
        super();
        PoolMgr._instance = this;
    }

    static get instance ():PoolMgr{
        if( PoolMgr._instance){
            return PoolMgr._instance as PoolMgr;
        }else{
            let instance = new PoolMgr();
            return instance
        }
    }

    
    //生成一个缓冲池
    genPool(tag: string, pb_item: any, scriptName?: string, buffMinCount?: number, buffMaxCount?: number) {
        var pool = this.poolMap[tag];
        if (!pool) {
            var pool = new Pool(pb_item, scriptName, buffMinCount, buffMaxCount);
            this.poolMap[tag] = pool;
            pool.initialize()
        }
        return pool;
    };

    genPoolByTagItem(tagItem: PoolItemEnum, buffMinCount?: number, buffMaxCount?: number,cb?:Function) {
        var tag = tagItem.tag;
        var pool = this.poolMap[tagItem.tag];
        if (!pool) {
            var prefabUrl = tagItem.prefabUrl;
            var scriptName = tagItem.scriptName;
            var self = this;
            resources.load(prefabUrl,Prefab, function (err: any, prefab: any) {
                if (err) {
                    Debug.error("[genPool] create error",prefabUrl, err);
                }
                else {
                    var pb_item = instantiate(prefab);
                    var pool = new Pool(pb_item, scriptName, buffMinCount, buffMaxCount);
                    self.poolMap[tag] = pool;
                    pool.initialize()
                    if(cb) cb(pool);
                }
            });
        }else{
            if(cb) cb(pool);
        }
    };

    init(){
        for (const key in POOL_TAG_ENUM) {
            if (Object.prototype.hasOwnProperty.call(POOL_TAG_ENUM, key)) {
                const element = POOL_TAG_ENUM[key];
                this.genPoolByTagItem(element,1);
            }
        }
    }

    getPool(tag:string){
        var pool = this.poolMap[tag];
        return pool;
    }

    clearPool(tag:string){
        delete this.poolMap[tag]
    }
};