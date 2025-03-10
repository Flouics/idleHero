

import { tween, UIOpacity, Vec3 } from "cc";
import App from "../../App";
import BaseCommand from "../base/Command"
import { RewardProxy }  from "./RewardProxy";
import Item from "../../logic/Item";
import { clone } from "../../Global";

export default class RewardCommand extends BaseCommand{
    proxy:RewardProxy;    
    isFloating:boolean = false;
    floatItemList = [];

    addRwdList(itemDataList:any[]){
        var self = this;
        var rwdItemList = [];
        itemDataList.forEach(itemData=>{
            rwdItemList.push(new Item(itemData.id,itemData.count));
        })
        this.proxy.addRwd(rwdItemList);    
    }

    float(){        
        var self = this;
        var doFloatAction;
        var taskKey = "doFloatAction";
        self.proxy.itemList.forEach((item)=>{
            self.floatItemList.push(item)
        })
        self.proxy.clearRwd();
        doFloatAction = function (){
            var item = self.floatItemList.shift();
            if(item){
                self.isFloating = true;
                item.initUI(App.getUIRoot());
                tween(item.node)
                .by(0.5,
                    {position:new Vec3(0,160,0)})
                .by(0.3,
                    { position:new Vec3(0,160,0)},{
                        onUpdate(taget:Node,ratio:number){
                            item.node.getComponent(UIOpacity).opacity = 255 - 255 * ratio;
                        }
                    })
                .call(() => {                
                    item.ui.close();
                }).start();
                App.taskOnce(doFloatAction,500,taskKey);
            }else{
                self.isFloating = false;
            }            
        }

        if(!self.isFloating){
            doFloatAction();
        }
    }
}
