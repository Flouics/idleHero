import { RewardProxy }  from "./RewardProxy";
import RewardCommand from "./RewardCommand";
import Init from "../base/Init";

export default class RewardInit extends Init {
    proxy:RewardProxy;
    cmd:RewardCommand;
    moduleName:string = "reward";
    init(){
        this.moduleName = "reward";
        this.proxy = RewardProxy.getInstance(RewardProxy);
        this.cmd = new RewardCommand();       
    }

    onMsg(){
        //监听服务端消息   
    }
}

