

import {App} from "../../App";
import {Item} from "../../logic/Item";
import { serialize } from "../../utils/Decorator";
import { toolKit } from "../../utils/ToolKit";
import { Proxy }from "../base/Proxy";
import { getPlayerProxy } from "../player/PlayerProxy";
import { getRewardProxy } from "../reward/RewardProxy";
import { getTimeProxy } from "../time/TimeProxy";
import {PackageCommand} from "./PackageCommand";
/*
 * 背包数据
 */

var IDLE_REWARD = {
    INTELVAL_TIME:60 * 10,
    MAX_TIME:3600 * 12,
    MAX_LEVEL:10,
}

var FREE_STAMINA_REWARD = {
    INTELVAL_TIME:60 * 10,
    MAX_VALUE:100,
}

export class PackageProxy extends Proxy {
    cmd:PackageCommand;
    _className = "PackageProxy";  
    itemMap:Map<number,Item> = new Map();
    idleItemMap:Map<number,Item> = new Map();
    idleRwdLevel:number = 1;

    @serialize()
    lastIdleTimeStamp:number = 0;
    @serialize()
    settleIdleCount:number = 0;

    @serialize()
    lastStaminaTimeStamp:number = 0;

    @serialize()
    itemJson:{[key:number]:any} = {};
    @serialize()
    idleItemJson:{[key:number]:any} = {};

    constructor(){       
        super();
        PackageProxy._instance = this;
    }

    static get instance ():PackageProxy{
        if( PackageProxy._instance){
            return PackageProxy._instance as PackageProxy;
        }else{
            let instance = new PackageProxy();
            return instance
        }
    }

    //方法
    init(){
        this.loadItemInfo();       
    }

    loadItemInfo(){

    }

    itemToData(item:Item){
        return item.toData();
    }    

    addItemList(itemDataList:any[]|Map<number,Item>){
        var self = this;
        itemDataList.forEach(itemData =>{
            self.addItem(itemData);
        })
    }

    reduceItemList(itemDataList:any[]){
        if(this.checkItemList(itemDataList)){
            var self = this;
            itemDataList.forEach(itemData =>{
                self.reduceItemById(itemData.id,itemData.count);
            })
        }
    }

    checkItemList(itemDataList:any[]){
        var self = this;
        var checkItem = itemDataList.some(itemData =>{
            var item = self.getItemById(itemData.id);
            if(item.count <  itemData.count){
                return item;
            }
        })
        return !checkItem;
    }

    addItem(itemData:any){
        return this.addItemById(itemData.id,itemData.count);
    }

    addItemById(id:number,count:number){
        if (this.itemMap.get(id) == null){
            this.itemMap.set(id, new Item(id));
        }
        var item = this.itemMap.get(id);
        item.add(count);
        this.updateViewTask("updatePackageInfo"); //todo 有待优化
        this.dumpToDb();
        return item;
    }

    reduceItem(itemData:any){
        return this.reduceItemById(itemData.id,itemData.count);
    }

    reduceItemById(id:number,count:number){
        var item = this.getItemById(id);
        if(item.count < count){
            return null;
        }
        item.reduce(count);
        this.updateViewTask("updatePackageInfo"); //todo 有待优化
        this.dumpToDb();
        return item;
    }


    getItemById(id:number){
        if (this.itemMap.get(id) == null){
            this.itemMap.set(id, new Item(id));
        }
        return this.itemMap.get(id);
    }

    getAllItems(){
        return this.itemMap;
    }

    initIdleRwdLevel(){
        var idleRwdLevel = Math.floor(getPlayerProxy().stageId / 10)
        idleRwdLevel = toolKit.limitNum(idleRwdLevel,1,IDLE_REWARD.MAX_LEVEL);
        if(App.dataMgr.findById("idleRwd",idleRwdLevel)){
            this.idleRwdLevel = idleRwdLevel;
        }
    }

    //待机奖励，先写在这里了。
    addIdleItemList(itemDataList:any[]){
        var self = this;
        itemDataList.forEach(itemData =>{
            var id = itemData.id;
            if (this.idleItemMap.get(id) == null){
                this.idleItemMap.set(id, new Item(id));
            }
            var item = this.idleItemMap.get(id);
            item.add(itemData.count);
        })
    }
    
    //结算一段时间的奖励
    settleIdleTime(){
        this.initIdleRwdLevel();
        var nowTime = getTimeProxy().getTime();
        var deltaTime = Math.floor((nowTime - this.lastIdleTimeStamp)/1000);
        deltaTime = toolKit.limitNum(deltaTime,0,IDLE_REWARD.MAX_TIME);
        var count = Math.floor( deltaTime / IDLE_REWARD.INTELVAL_TIME);
        if(count -  this.settleIdleCount < 1){
            return 0;
        }
        var data = App.dataMgr.findById("idleRwd",this.idleRwdLevel);
        for (let i = this.settleIdleCount; i < count; i++) {
            this.addIdleItemList(data.rwdList);
            this.addIdleItemList(toolKit.getRandArrayFromArray(data.randomRwdList,1));
        }

        this.settleIdleCount = count;
        return count;
    }

    // 领取挂机奖励
    getIdleRwd(){
        var self = this;
        this.lastIdleTimeStamp = getTimeProxy().getTime();
        try {
            this.idleItemMap.forEach(itemVo =>{
                self.addItem(itemVo);
            })
            this.idleItemMap.clear();
            this.settleIdleCount = 0;
        } catch (error) {
            
        }
    }

    getIdleRwdMaxTime(){
        return IDLE_REWARD.MAX_TIME;
    }

    settleStaminaRwd(){
        var item = this.getItemById(Item.ITEM_ID_ENUM.STAMINA);
        if(item.count >= FREE_STAMINA_REWARD.MAX_VALUE){
            this.lastStaminaTimeStamp = 0;
            return;
        }
        var nowTime = getTimeProxy().getTime();
        if(this.lastStaminaTimeStamp == 0){
            this.lastStaminaTimeStamp = nowTime;
            return;
        }
        var deltaTime = Math.floor((nowTime - this.lastStaminaTimeStamp)/1000);
        var count = Math.floor(deltaTime / FREE_STAMINA_REWARD.INTELVAL_TIME);
        if(count < 1){
            return;
        }
        if(item.count + count >= FREE_STAMINA_REWARD.MAX_VALUE){
            count = FREE_STAMINA_REWARD.MAX_VALUE - item.count;
            this.lastStaminaTimeStamp = 0;
        }else{
            this.lastStaminaTimeStamp = this.lastStaminaTimeStamp + count * FREE_STAMINA_REWARD.INTELVAL_TIME * 1000;
        }

        var addItemData = {id:item.id,count:count};
        this.addItem(addItemData);

        //直接给奖励
        getRewardProxy().cmd.addRwdList([addItemData]);
        getRewardProxy().cmd.float();
    }

    dumpPrepare(){
        //导出数据的预处理
        this.itemJson = {}
        var self = this;
        this.itemMap.forEach(item=>{
            this.itemJson[item.id] = self.itemToData(item);
        })

        this.idleItemMap.forEach(item=>{
            this.idleItemJson[item.id] = self.itemToData(item);
        })
    }

    reloadPrepare(){
        //加载数据的预处理
        this.itemMap = new Map();       
        this.loadItemInfo();
        for (const key in this.itemJson) {
            const json = this.itemJson[key];
            var data = this.getItemById(Number(key));
            if(data){
                data.count = json.count; 
            }
        }

        // 挂机奖励
        for (const key in this.idleItemJson) {
            const json = this.idleItemJson[key];
            var id = json.id
            if (this.idleItemMap.get(id) == null){
                this.idleItemMap.set(id, new Item(id));
            }
            var data = this.idleItemMap.get(id);

            if(data){
                data.count = json.count; 
            }
        }
        if(this.lastIdleTimeStamp == 0){
            this.lastIdleTimeStamp = getTimeProxy().getTime();
        }
    }
    reloadFromDb(){
        super.reloadFromDb();

        //开启定时任务
        App.task(this.settleStaminaRwd.bind(this),1000*60,"settleStaminaRwd");
    }
};

export function getPackageProxy(): PackageProxy {
    return PackageProxy.instance;
}


