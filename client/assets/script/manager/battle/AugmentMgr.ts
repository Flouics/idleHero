
import BaseClass from "../../zero/BaseClass";
import App from "../../App";
import { toolKit } from "../../utils/ToolKit";
import { MapProxy , getMapProxy } from "../../modules/map/MapProxy";
import { Debug }   from "../../utils/Debug";
import { getPlayerProxy, PlayerProxy } from "../../modules/player/PlayerProxy";
import { getMercenaryProxy } from "../../modules/mercenary/MercenaryProxy";

export class Augment{
    id:number = 0;
    name:string = "";
    type:number = 0;
    isConflict:number = 0;
    rate:number = 0;
    price:number = 0;
    level:number = 1;
    maxLevel:number = 0;	
    mercenaryList = [];
    mercenaryListMap:Map<number,any> = null;	
    discountPrice:number = 0;
    coldTime:number = 0;
    life:number = 0;	
    atk:number = 0;
    atkBuffList:Array<number> = [];
    atkSpeed:number = 0;	
    atkRange:number = 0;	
    atkTargetCount:number = 0;
    atkCount:number = 0;	
    critRate:number = 0;
    critPower:number = 0;
    moveSpeed:number = 0;	
    skillList:Array<number> = [];
    data_1:number = 0;	
    data_2:number = 0;	
    data_3:number = 0;	
    desc:string = "";
    constructor(data:any){
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.isConflict = data.isConflict;
        this.rate = data.rate;
        this.price = data.price;
        this.level = data.level;
        this.maxLevel = data.maxLevel;
        this.mercenaryList = data.mercenaryList;
        this.mercenaryListMap = toolKit.tableToMap(this.mercenaryList);
        this.discountPrice = data.discountPrice;
        this.coldTime = data.coldTime;
        this.life = data.life;
        this.atk = data.atk;
        this.atkBuffList = data.atkBuffList;
        this.atkSpeed = data.atkSpeed;
        this.atkRange = data.atkRange;
        this.atkTargetCount = data.atkTargetCount;
        this.atkCount = data.atkCount;
        this.critRate = data.critRate;
        this.critPower = data.critPower;
        this.moveSpeed = data.moveSpeed;
        this.skillList = data.skillList;
        this.data_1 = data.data_1;
        this.data_2 = data.data_2;
        this.data_3 = data.data_3;
        this.desc = data.desc;
    }
}

// 角色管理器
export default class AugmentMgr extends BaseClass{
    augmentIdMap: Map<number,Augment> = new Map();
    augmentTypeMap:Map<number,Array<Augment>> = new Map();
    augmentGotMap:Map<number,Augment> = new Map();
    augmentGotLevelMap:Map<number,number> = new Map();
    augmentGenPool:Map<number,Augment> = new Map();
    _scheduleId:number  = null;    
    proxy:MapProxy = null;
    
    init(){
        this.initAugmentGenPool();
        this.reset()
    }

    reset(){
        this.proxy = getMapProxy();
        this.augmentGotMap = new Map();
    }

    initAugmentGenPool(){
        this.augmentGenPool = new Map();
        this.augmentTypeMap = new Map();
        this.augmentGotLevelMap = new Map();
        var ret  = App.dataMgr.getTable("augment");
        var list = ret.list;
        list.forEach(data => {
            if (!this.augmentTypeMap.has(data.type)){
                this.augmentTypeMap.set(data.type, []);
            }
            let augment = new Augment(data);
            this.augmentTypeMap.get(data.type).push(augment);
            this.augmentIdMap.set(data.id, augment);

            if (data.level == 1){
                this.augmentGenPool.set(data.id, augment);
            }
            this.augmentGotLevelMap.set(data.type, 0);
        });
    }

    obtainAugment(augmentId: number){
        let augment = this.augmentGenPool.get(augmentId);
        if(!augment){
            Debug.warn("augment is not exist",augmentId);
            return 
        }



        if(augment.isConflict == 1){
            this.augmentGenPool.delete(augmentId);            
            let list = this.augmentTypeMap.get(augment.type);
            list.forEach(data => {
                if(data.level > augment.level){
                    this.augmentGenPool.set(data.id, data);                
                }
            });

            let level = augment.level;
            this.augmentGotLevelMap.set(augment.type, level);
            this.augmentGotMap.set(augment.id, augment);
        }else{           
            var level = this.augmentGotLevelMap.get(augment.type) || 0;
            if(level < augment.maxLevel){                
                this.augmentGotLevelMap.set(augment.type,level + 1)
            }else{
                this.augmentGenPool.delete(augmentId);
            }
        }
        
        this.proxy.obtainAugment(augment);
    }

    genAugmentList(count:number){
        var map = new Map();
        var playerLevel =  getPlayerProxy().level;       
        this.augmentGenPool.forEach(augment => {
            if(augment.type == 900){ 
                if(!this.proxy.mercenaryMgr.isMercenaryGenMax()){
                    const mercenaryId = augment.data_1;
                    if (mercenaryId > 0 && !this.proxy.mercenaryMgr.getMercenaryGenData(mercenaryId)){
                        var mercenaryData = getMercenaryProxy().getMercenaryById(mercenaryId);
                        if (mercenaryData && mercenaryData.openLevel <= playerLevel){
                            map.set(augment.id,augment);
                        }                        
                    }
                }
            }else{
                if(augment.mercenaryList.length == 0){
                    map.set(augment.id,augment);
                }else{
                    var flag = false;
                    for (const key in augment.mercenaryList) {
                        const mercenaryId = augment.mercenaryList[key];
                        if (!!this.proxy.mercenaryMgr.getMercenaryGenData(mercenaryId)){
                            flag = true;
                            break;
                        }     
                    }
    
                    if (flag){
                        map.set(augment.id,augment);
                    }
                }
            }
        });

        var list = toolKit.getRandArrayFromMap(map,count);
        return list;
    }

    getAugmentById(augmentId:number){
        return this.augmentIdMap.get(augmentId);
    }

    getGotAugmentIdListByMercenaryId(mercenaryId:number){
        var list = [];
        for (const key in this.augmentGotMap) {
            const augment = this.augmentGotMap.get(Number(key));                
            if (augment.mercenaryList.length == 0 || augment.mercenaryListMap.get(mercenaryId)){
                list.push(augment.id);
            }
        }
        return list;
    }

}