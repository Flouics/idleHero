
import Item from "../../logic/Item";
import BaseCommand from "../base/Command"
import { getRewardProxy } from "../reward/RewardProxy";
import { PackageProxy } from "./PackageProxy";

export default class PackageCommand extends BaseCommand{
    proxy:PackageProxy;
    addRwdList(itemDataList:any[]){
        var self = this;
        itemDataList.forEach(itemData=>{
            self.proxy.addItem(itemData);
        })
    }
}
