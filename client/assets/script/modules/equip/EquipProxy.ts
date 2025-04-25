
import { Proxy }from "../base/Proxy";
import {EquipCommand} from "./EquipCommand";
import { serialize } from "../../utils/Decorator";
import { Equip } from "./Equip";
/*

 */
export class EquipProxy extends Proxy {
    cmd:EquipCommand;
    _className = "EquipProxy";       //防止js被压缩后的问题。
    
    equipMap:Map<number,Equip>

    @serialize()
    equipJson:{[key:number]:any} = {};

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


    dumpPrepare(){
        //导出数据的预处理 *写入本地之前调用*
    }

    reloadPrepare(){
        //加载数据的预处理 *读取本地之后调用*
    }
};

export function getEquipProxy(): EquipProxy {
    return EquipProxy.instance;
}