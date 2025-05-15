
import { Proxy }from "../base/Proxy";
import {EquipCommand} from "./EquipCommand";
import { serialize } from "../../utils/Decorator";
import { Equip } from "./Equip";
import { App } from "../../App";
import { getMercenaryProxy } from "../mercenary/MercenaryProxy";

export enum EQUIP_POS{
    WEAPON = 1,
    SHIELD,
    ARMOR,
    HELMET,
    GLOVE,
    BOOT,
    NECKLACE,
    RING,
}

export class EquipProxy extends Proxy {
    cmd:EquipCommand;
    _className = "EquipProxy";       //防止js被压缩后的问题。    

    combineCount:number = 3;

    equipMap:Map<number,Equip> = new Map();
    @serialize()
    equipJson:{[key:number]:any} = {};

    useEquipPosMap:Map<number,number> = new Map();
    @serialize()
    useEquipPosMapJson:{[key:number]:any} = {};

    constructor(){       
        super();
        EquipProxy._instance = this;
    }

    static get instance ():EquipProxy{
        if( EquipProxy._instance){
            return EquipProxy._instance as EquipProxy;
        }else{
            let instance = new EquipProxy();
            return instance
        }
    }

    /**
     * 获取装备
     * @param id 装备类型
     * @param idx 装备索引idx
     */
    addEquip(id:number,idx?:number){
        let equip = new Equip(id,idx);
        this.equipMap.set(equip.idx,equip);
        this.updateViewTask("updateEquipInfo");
        this.dumpToDb(false);
    }

    /**
     * 删除装备
     * @param idx 装备索引idx
     */
    delEquip(idx:number){
        let equip = this.equipMap.get(idx);
        if(equip){
            equip.clear();
            this.updateViewTask("updateEquipInfo");
            this.dumpToDb(false);
        }
        this.equipMap.delete(idx);
        return true;
    }

    getEquipByIdx(idx:number){
        return this.equipMap.get(idx);
    }

    getAllEquips(){
        return this.equipMap;
    }

    getCombineList(){
        let cacheMap:Map<number,Array<number>> = new Map();
        this.equipMap.forEach((equip) => {
            if(!cacheMap.get(equip.id)){
                cacheMap.set(equip.id,new Array());
            }
            let list = cacheMap.get(equip.id);
            list.push(equip.idx);
        });
        let combineList:Array<Array<number>> = new Array();
        let combineCount = this.combineCount;
        cacheMap.forEach((list) => {
            while (list.length >= combineCount) {
                let newList = list.splice(0,combineCount);
                /**
                 * 已装备的放到前面，作为主材料。
                 */
                newList.forEach((equipIdx,index) => {
                    if (this.checkEquipIsUse(equipIdx)){
                        newList.splice(index,1);
                        newList.unshift(equipIdx);
                    }
                })
                combineList.push(newList);
            }
        });

        return combineList;
    }

    getUseEquipByPos(pos:number){
        let equipIdx = this.useEquipPosMap.get(pos);
        return this.equipMap.get(equipIdx);
    }

    /**
     * 检查装备时候否已经装备了
     * @param equipIdx 装备唯一 索引
     */
    checkEquipIsUse(equipIdx:number){
        let ret = false;
        this.useEquipPosMap.forEach((useEquipIdx) => {
            if (useEquipIdx == equipIdx){
                ret = true;
            }
        })
        return ret;
    }


    setUseEquip(pos:number,equipIdx:number){
        if (equipIdx == 0){
            // 相当于卸载
            this.useEquipPosMap.delete(pos);
        }else{
            let lastEquipIdx = this.useEquipPosMap.get(pos);
            if(lastEquipIdx && lastEquipIdx > 0){
                let equip = this.getEquipByIdx(lastEquipIdx);
                if(equip){
                    //todo 替换装备是否需要弹窗提示
                }
            }
            this.useEquipPosMap.set(pos,equipIdx);
        }

        getMercenaryProxy().updateCurMercenaryInfo();
        this.updateViewTask("setUseEquipResult")
        this.dumpToDb(false);
        return true;
    }

    dumpPrepare(){
        //导出数据的预处理
        this.equipJson = {}
        this.equipMap.forEach(equip=>{
            this.equipJson[equip.idx] = equip.toData();
        })

        this.useEquipPosMapJson = {}
        this.useEquipPosMap.forEach((equipIdx,pos)=>{
            this.useEquipPosMapJson[pos] = {
                pos : pos
                ,equipIdx : equipIdx
            };
        })        
    }

    reloadPrepare(){
        //加载数据的预处理
        for (const key in this.equipJson) {
            const json = this.equipJson[key];
            let euqip = new Equip(json.id,json.idx);
            this.equipMap.set(json.idx, euqip);
        }

        for (const key in this.useEquipPosMapJson) {
            const json = this.useEquipPosMapJson[key];
            this.useEquipPosMap.set(json.pos,json.equipIdx);
        }        
    }
};

export function getEquipProxy(): EquipProxy {
    return EquipProxy.instance;
}