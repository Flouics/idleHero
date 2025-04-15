

import { Node, tween, UIOpacity, Vec3 } from "cc";
import {App} from "../../App";
import {Command} from "../base/Command"
import { RewardProxy }  from "./RewardProxy";
import {Item} from "../../logic/Item";

export class RewardCommand extends Command{
    proxy:RewardProxy;    
    isFloating:boolean = false;
    floatItemList:Array<Item> = new Array();

    addRwdList(itemDataList:any[]){
        var self = this;
        var rwdItemList = [];
        itemDataList.forEach(itemData=>{
            rwdItemList.push(new Item(itemData.id,itemData.count));
        })
        this.proxy.addRwd(rwdItemList);  
        App.dumpToDb();  
    }

    float(){        
        var self = this;
        var doFloatAction;
        var taskKey = "doFloatAction";
        self.proxy.itemList.forEach((item)=>{
            self.floatItemList.push(item)
        })
        self.proxy.clearRwd();
        App.dumpToDb();
        doFloatAction = function (){
            var item = self.floatItemList.shift();
            if(item){
                self.isFloating = true;
                item.initUI(App.getPopupRoot());
                tween(item.node)
                .by(0.8,
                    {position:new Vec3(0,160,0)})
                .by(0.4,
                    { position:new Vec3(0,160,0)},{
                        onUpdate(taget:Node,ratio:number){
                            item.node.getComponent(UIOpacity).opacity = 255 - 255 * ratio;
                        }
                    })
                .call(() => {                
                    item.destroy();
                }).start();
                App.taskOnce(doFloatAction,800,taskKey);
            }else{
                self.isFloating = false;
            }            
        }

        if(!self.isFloating){
            doFloatAction();
        }
    }
}
