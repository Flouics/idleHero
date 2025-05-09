import { RewardProxy }  from "./RewardProxy";
import {RewardCommand} from "./RewardCommand";
import {Init} from "../base/Init";
import { LayerType,UIConfig} from "../../oops/core/gui/layer/LayerManager"
import { UUID } from "../../utils/UUID";

export enum UIID_Reward {
    /** 资源加载界面 */
    RewardView = UUID.UIID_INDEX,
    IdleRewardView = UUID.UIID_INDEX,
}

/** 打开界面方式的配置数据 */
let getUIConfigData = () => {
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
    return UIConfigData;
}


export class RewardInit extends Init {
    proxy:RewardProxy;
    cmd:RewardCommand;

    init(){
        this.moduleName = "reward";
        this.proxy = new RewardProxy();
        this.cmd = new RewardCommand();
        this.UIConfigData = getUIConfigData();       
    }

    onMsg(){
        //监听服务端消息   
    }
}

