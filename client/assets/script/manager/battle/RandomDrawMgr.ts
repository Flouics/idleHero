
import BaseClass from "../../zero/BaseClass";
import { toolKit } from "../../utils/ToolKit";
import { MapProxy , getMapProxy } from "../../modules/map/MapProxy";
import AugmentMgr, { Augment } from "./AugmentMgr";
import { MercenaryMgr } from "./MercenaryMgr";


// 角色管理器
export default class RandomDrawMgr extends BaseClass{
    augmentMgr:AugmentMgr = null;
    mercenaryMgr:MercenaryMgr = null;
    _scheduleId:number  = null;    
    proxy:MapProxy = null;
    totalCount:number = 4;
    lastDrawList:Array<Augment> = []
    
    init(){
        this.reset()
    }

    reset(){
        this.proxy = getMapProxy();
        this.augmentMgr = this.proxy.augmentMgr;
        this.mercenaryMgr = this.proxy.mercenaryMgr;
    }

    getRandomDrawList(){        
        var augmentCount = this.totalCount;
        var augmentList = this.augmentMgr.genAugmentList(augmentCount);
        var ret = [];
        var idx = 0;

        augmentList.forEach(data => {            
            ret.push(new Augment(data))
            idx += 1;
        });

        return ret;
    }

    getLastDrawList(){
        return this.lastDrawList;
    }

    onGetDrawResult(drawItem:Augment){
        this.lastDrawList = this.getRandomDrawList();
        this.proxy.updateView("updateRandomDrawList");
    }

    initRandomDrawList(){
        this.lastDrawList = this.getRandomDrawList();
        this.proxy.updateView("updateRandomDrawList");
    }
}