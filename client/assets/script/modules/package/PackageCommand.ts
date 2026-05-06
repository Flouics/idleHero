
import {Item} from "../../logic/Item";
import {Command} from "../base/Command"
import { getRewardProxy } from "../reward/RewardProxy";
import { PackageProxy } from "./PackageProxy";

export class PackageCommand extends Command{
    proxy:PackageProxy;
    addRwdList(itemDataList:any[]){
        itemDataList.forEach(itemData=>{
            this.proxy.addItem(itemData);
        })
    }
}
