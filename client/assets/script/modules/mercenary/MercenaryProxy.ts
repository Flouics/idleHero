
import {App} from "../../App";
import { checkObjKey } from "../../Global";
import { serialize } from "../../utils/Decorator";
import { toolKit } from "../../utils/ToolKit";
import { Proxy }from "../base/Proxy";
import { getEquipProxy } from "../equip/EquipProxy";
import {MercenaryCommand} from "./MercenaryCommand";
/*

 */

export var RACE_ENUM = {
    EMPTY:0,
    HUMAN:1,
    UNDEAD:2,
    SPRITE:4,
    ORC:8,
}

export var BATTLE_TYPE_ENUM = {
    EMPTY:0,
    MELEE:1,
    RANGE:2,
    MAGIC:4,
}

function getMercenaryLevelData(mercenaryId:number,level:number){
    var key = mercenaryId * 1000 + level;
    var data = App.dataMgr.findById("mercenaryLevelData",key);
    return data;       
}

export class MercenaryData {
    id:number = 0;
    level:number = 1;
    life:number = 0;
    atk:number = 0;
    baseMoveSpeed: number = 60;    //1秒
    moveSpeed: number = 1.0;
    atkSpeed: number = 1;
    searchRange:number = 1;
    atkRange: number = 1;
    atkTagetCount: number = 1;
    atkCount: number = 1;
    race:number = RACE_ENUM.EMPTY;
    battleType:number =  BATTLE_TYPE_ENUM.MELEE;
    atkBuffList:Array<number> = [];              //攻击附带的debuff特效
    skillList:Array<number> = [];                  //主动技能
    openLevel:number = 0;
    element:number = 0;
    atkTargetCount:number = 0;
    augmentList = [];
    coldTime:number = 0;
    lifeMax:number  = 1;
    name:string  = "";
    quality:number = 0;
    bulletId:number = 0;
    data:any = null;
    get useEquipPosMap (){
        return getEquipProxy().useEquipPosMap;
    }


    constructor(data:any,level = 1){
        this.level = level;
        this.data = data;

        //基础数据初始化
        this.id = data.id;
        this.name = data.name;
        this.race = data.race;
        this.battleType = data.battleType;
        this.openLevel = data.openLevel;
        this.quality = data.quality;
        this.element = data.element;
        this.lifeMax = data.lifeMax;
        this.atk = data.atk;
        this.atkBuffList = data.atkBuffList;
        this.atkSpeed = data.atkSpeed;
        this.searchRange = data.searchRange;
        this.atkRange = data.atkRange;
        this.atkTargetCount = data.atkTargetCount;
        this.atkCount = data.atkCount;
        this.augmentList = data.augmentList;
        this.moveSpeed = data.moveSpeed;
        this.skillList = data.skillList;
        this.bulletId = data.bulletId;
       
        this.cacAllAttrs();
        
        this.life = this.lifeMax;   
    }

    cacAllAttrs(){
        let attrMap = this.getLevelAttrsAddTotalMap(this.level);
        let otherAttrMapList = [            
            this.getEquipAllAttrs(),
        ]

        otherAttrMapList.forEach((otherAttrMap) => {
            for (const key in attrMap) {
                if (checkObjKey(otherAttrMap, key)){            
                    if (Array.isArray(attrMap[key])){
                        attrMap[key] = toolKit.arrayAdd(attrMap[key],otherAttrMap[key]);
                    }else{
                        var attr = toolKit.cacAttr(otherAttrMap[key]);
                        attrMap[key].value += attr.value;
                        attrMap[key].percent += attr.percent;
                    }
                }
            }            
        })
                
        //加入属性
        for (const key in attrMap) {
            var attr = attrMap[key];
            if (Array.isArray(attr)){
                this[key] = toolKit.arrayAdd(this.data[key],attr);
            }else{
                var originValue = this.data[key];
                var value = originValue * (100 + attr.percent)/100 + attr.value
                this[key] = Math.ceil(toolKit.limitNum(value,0) * 10000)/10000;
            }
        }   
    }

    getLevelAttrsAddTotalMap(level:number){
        var attrMap = null;
        //先汇总属性
        for(var i = 1;i < level + 1 ;i++ ){
            var data = this.getLevelAttrsAddMap(i);
            if(!data){
                continue;
            }
            if(attrMap == null){
                attrMap = data;
            }else{
                for (const key in attrMap) {
                    if (Array.isArray(attrMap[key])){
                        attrMap[key] = toolKit.arrayAdd(attrMap[key],data[key]);
                    }else{
                        var attr = data[key];
                        attrMap[key].value += attr.value;
                        attrMap[key].percent += attr.percent;
                    }
                }  
            }          
        }
        return attrMap
    }

    getLevelAttrsAddMap(level:number){
        var attrMap = {     
            coldTime:{value:0,percent:0}
            ,lifeMax:{value:0,percent:0}
            ,atk:{value:0,percent:0}
            ,atkBuffList:[]
            ,atkSpeed:{value:0,percent:0}
            ,atkRange:{value:0,percent:0}
            ,atkTargetCount:{value:0,percent:0}
            ,atkCount:{value:0,percent:0}
            ,moveSpeed:{value:0,percent:0}
            ,skillList:[]
        }

        //汇总属性
        var data = getMercenaryLevelData(this.id,level);
        if(!data){
            return attrMap;
        }
        for (const key in attrMap) {
            if (checkObjKey(data, key)){            
                if (Array.isArray(attrMap[key])){
                    attrMap[key] = toolKit.arrayAdd(attrMap[key],data[key]);
                }else{
                    var attr = toolKit.cacAttr(data[key]);
                    attrMap[key].value += attr.value;
                    attrMap[key].percent += attr.percent;
                }
            }
        }
        return attrMap
    }

    getEquipAllAttrs(){
        let attrMap;
        this.useEquipPosMap.forEach((equipIdx) => {            
            if(equipIdx > 0){
                var data = this.getEquipAttr(equipIdx);
                if(attrMap == null){
                    attrMap = data;
                }else{
                    for (const key in attrMap) {
                        if (Array.isArray(attrMap[key])){
                            attrMap[key] = toolKit.arrayAdd(attrMap[key],data[key]);
                        }else{
                            var attr = data[key];
                            attrMap[key].value += attr.value;
                            attrMap[key].percent += attr.percent;
                        }
                    }  
                }  
            }    
        })
        return attrMap || [];
    }

    getEquipAttr(equipIdx:number){
        var attrMap = {     
            coldTime:{value:0,percent:0}
            ,lifeMax:{value:0,percent:0}
            ,atk:{value:0,percent:0}
            ,atkBuffList:[]
            ,atkSpeed:{value:0,percent:0}
            ,atkRange:{value:0,percent:0}
            ,atkTargetCount:{value:0,percent:0}
            ,atkCount:{value:0,percent:0}
            ,moveSpeed:{value:0,percent:0}
            ,skillList:[]
        }

        //汇总属性
        let equip = getEquipProxy().getEquipByIdx(equipIdx);
        if(!equip){
            return attrMap;
        }

        let data = equip.data;
        for (const key in attrMap) {
            if (checkObjKey(data, key)){            
                if (Array.isArray(attrMap[key])){
                    attrMap[key] = toolKit.arrayAdd(attrMap[key],data[key]);
                }else{
                    var attr = toolKit.cacAttr(data[key]);
                    attrMap[key].value += attr.value;
                    attrMap[key].percent += attr.percent;
                }
            }
        }
        return attrMap
    }

    getNextLevelData(){
        return getMercenaryLevelData(this.id,this.level + 1);
    }

    checkMaxLevel(){
        return this.getNextLevelData() == null;
    }

    upgrade(){
        if(this.checkMaxLevel()){
            return false;
        }
        this.level++;
        this.cacAllAttrs();
        return true;
    }

    setUseEquip(pos:number,equipIdx:number){
        return getEquipProxy().setUseEquip(pos,equipIdx);
    }
}


export class MercenaryProxy extends Proxy {
    cmd:MercenaryCommand;
    _className = "MercenaryProxy";  
    
    mercenaryMap:Map<number,MercenaryData> = new Map();

    @serialize()
    mercenaryJson:{[key:number]:any} = {};

    //当前的追随者
    curMercenaryId:number = 1;

    constructor(){       
        super();
        MercenaryProxy._instance = this;        
    }

    static get instance ():MercenaryProxy{
        if( MercenaryProxy._instance){
            return MercenaryProxy._instance as MercenaryProxy;
        }else{
            let instance = new MercenaryProxy();
            return instance
        }
    }

    init(): void {
        this.loadMercenaryInfo();
        this.curMercenaryId = 2;
    }

    loadMercenaryInfo(){
        this.mercenaryMap = new Map();       
        var dataObj = App.dataMgr.getTable("mercenary");
        dataObj.list.forEach(data => {
            data.level = 1;
            this.mercenaryMap.set(data.id, new MercenaryData(data,1));
        })
    }

    getMercenaryById(mercenaryId:number){
        return this.mercenaryMap.get(mercenaryId);
    }

    getMercenaryMap(){
        return this.mercenaryMap;
    }

    dumpPrepare(){
        //导出数据的预处理
        this.mercenaryJson = {}
        this.mercenaryMap.forEach(data=>{
            this.mercenaryJson[data.id] = {
                id:data.id
                ,level:data.level
                };
        })
    }


    reloadPrepare(){
        //加载数据的预处理
        for (const key in this.mercenaryJson) {
            const json = this.mercenaryJson[key];

            var data = this.mercenaryMap.get(Number(key));
            if(data){
                data.level = json.level;
            }              
        }
    }
};

export function getMercenaryProxy(): MercenaryProxy {
    return MercenaryProxy.instance;
}