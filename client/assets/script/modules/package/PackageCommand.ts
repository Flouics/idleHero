
import {Item} from "../../logic/Item";
import {Command} from "../base/Command"
import { getRewardProxy } from "../reward/RewardProxy";
import { PackageProxy } from "./PackageProxy";

export class PackageCommand extends Command{
    proxy:PackageProxy;
    addRwdList(itemDataList:any[]){
        var self = this;
        itemDataList.forEach(itemData=>{
            self.proxy.addItem(itemData);
        })
    }
}
