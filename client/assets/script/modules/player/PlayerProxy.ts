/*
 * 用户数据
 */
import {App} from "../../App";
import { clone, empty, merge, nullfun } from "../../Global";
import { ITEM_ID_ENUM } from "../../logic/Item";
import { serialize } from "../../utils/Decorator";
import { toolKit } from "../../utils/ToolKit";
import {UUID} from "../../utils/UUID";
import { Proxy }from "../base/Proxy";
import { getPackageProxy } from "../package/PackageProxy";
import { UIID_Reward } from "../reward/RewardInit";
import { getRewardProxy } from "../reward/RewardProxy";

export class PlayerProxy extends Proxy {
    _className = "PlayerProxy";  

    @serialize()
    attrs:{[key:string]:any} = {}  

    @serialize()
    name:string ;

    get stamina(){
        var itemVo = getPackageProxy().getItemById(ITEM_ID_ENUM.STAMINA);
        return itemVo.count;
    }
    @serialize()
    staminaMax:number = 200;         //最大体力

    @serialize()
    level:number = 1;
    @serialize()
    exp:number = 0;

    @serialize()
    stageId = 1;            //当前关卡

    get uid (){
        return App.accountInfo.uid;
    }

    constructor(){       
        super();
        PlayerProxy._instance = this;
    }

    static get instance ():PlayerProxy{
        if( PlayerProxy._instance){
            return PlayerProxy._instance as PlayerProxy;
        }else{
            let instance = new PlayerProxy();
            return instance
        }
    }

    //方法
    init(){

    }
    
    load(){

    }

    checkPlayer(){
        if(empty(this.name)){
            this.name = UUID.gen(6);
            this.getCreateRwd();
            this.dumpToDb();
        }
    }

    getCreateRwd(){
        var data = App.dataMgr.findById("config",1001);
        if(data){
            getPackageProxy().addItemList(data.rwdList);
        }
    }

    getLevelData(level:number = this.level){
        var data = App.dataMgr.findById("userLevel",level);
        return data;
    }

    addExp(expValue:number){
        this.exp += expValue;        
        //判断是否会升级
        var levelData = this.getLevelData();
        var rwdList;
        while(levelData && levelData.exp > 0 && this.exp >= levelData.exp){
            this.exp += -levelData.exp;
            this.level += 1;
            levelData = this.getLevelData();
            if(!rwdList){
                rwdList = clone(levelData.rwdList);
            }else{
                toolKit.arrayAdd(rwdList,levelData.rwdList)
            }
        }
        if (!empty(rwdList)){
            getRewardProxy().cmd.showView(UIID_Reward.RewardView,rwdList);
            this.updateViewTask("updatePlayerInfo")
            this.dumpToDb();
        }
    }

    passStage(stageId:number){
        if(stageId == this.stageId){
            var stageData = App.dataMgr.findById("stage",this.stageId + 1);
            if(stageData){
                this.stageId += 1;
                this.dumpToDb();
            }  
        } 
    }
};

export function getPlayerProxy(): PlayerProxy {
    return PlayerProxy.instance;
}

