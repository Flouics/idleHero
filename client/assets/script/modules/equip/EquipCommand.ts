

import {App} from "../../App";
import {Command} from "../base/Command"
import { Equip } from "./Equip";
import { EquipProxy }  from "./EquipProxy";

export class EquipCommand extends Command{
    proxy:EquipProxy;

    /**
     * 合成
     * @param idx 装备idx 
     * @param resList 材料[装备idx]
     */
    combine(idx:number,resList:Array<number>){
        let equip = this.proxy.getEquipByIdx(idx);

        //简单判断下逻辑
        if(!equip){
            return false;
        }
        if(resList.length != this.proxy.combineCount - 1){
            return false
        }
        let error = 0;
        resList.some((resIdx) => {
            let resEquip = this.proxy.getEquipByIdx(resIdx);
            if(!(resEquip && resEquip.id == equip.id)){
                error = 1;
                return true;
            }

            /**
             * 装备正在使用
             */
            if(this.proxy.checkEquipIsUse(resIdx)){
                error = 2;
                return true;
            }
        }) 

        if(error > 0){
            return false;
        }

        let allDel = resList.every((resIdx) => {
            if(this.proxy.delEquip(resIdx)){
                return true;
            }           
        })

        if(!allDel){
            return false;
        } 
        
        if(equip.upgrade()){
            this.proxy.updateViewTask("updateEquipList");
            this.proxy.updateViewTask("updateUpgradeInfo");
            return true;
        }
        return false;
    }

    /**
     * 一键自动合成
     */
    autoCombineAll(combineList?:Array<Array<number>>){
        combineList = combineList || this.proxy.getCombineList(); 
        let ret = combineList.every((list) => {
            return this.combine(list[0],list.slice(1));
        })        
        return ret && combineList;
    }

    setUseEquip(pos:number,equipIdx:number){
        this.proxy.setUseEquip(pos,equipIdx);
    }
}
