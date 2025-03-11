
import {App} from "../../App";
import { clone } from "../../Global";
import {Item} from "../../logic/Item";
import { Proxy }from "../base/Proxy";
import {RewardCommand} from "./RewardCommand";
/*

 */
export class RewardProxy extends Proxy {
    cmd:RewardCommand;
    itemList:Item[] = []; 
    _className = "RewardProxy";  

    constructor(){       
        super();
        RewardProxy._instance = this;
    }

    static get instance ():RewardProxy{
        if( RewardProxy._instance){
            return RewardProxy._instance as RewardProxy;
        }else{
            let instance = new RewardProxy();
            return instance
        }
    }


    clearRwd(): void {
        this.itemList = [];
    }

    addRwd(items:Item[]){
        var self = this;
        items.forEach(item => {
            self.itemList.push(item);
        })
    }

    getRwd(){
        return clone(this.itemList);
    }
};

export function getRewardProxy(): RewardProxy {
    return RewardProxy.instance;
}