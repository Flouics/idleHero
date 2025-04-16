import { RewardProxy }  from "./RewardProxy";
import {RewardCommand} from "./RewardCommand";
import {Init} from "../base/Init";
import { uuidIndex } from "../../common/config/GameUIConfig";
import { LayerType, UIConfig } from "../.././oops/core/gui/layer/LayerManager";

export enum UIID_Reward {
    /** 资源加载界面 */
    RewardView = uuidIndex(),
    IdleRewardView = uuidIndex(),
}

/** 打开界面方式的配置数据 */
var UIConfigData: { [key: number]: UIConfig } = {
    [UIID_Reward.RewardView]: 
        { 
            layer: LayerType.UI
            , prefab: "/prefab/reward/RewardView"
            , bundle: "resources" 
        },
    [UIID_Reward.IdleRewardView]: 
        { 
            layer: LayerType.UI
            , prefab: "/prefab/reward/IdleRewardView"
            , bundle: "resources" 
        },
}

export class RewardInit extends Init {
    proxy:RewardProxy;
    cmd:RewardCommand;
    moduleName:string = "reward";
    init(){
        this.moduleName = "reward";
        this.proxy = new RewardProxy();
        this.cmd = new RewardCommand();
        this.UIConfigData = UIConfigData;       
    }

    onMsg(){
        //监听服务端消息   
    }
}

