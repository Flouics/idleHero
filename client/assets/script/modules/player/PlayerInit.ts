import { PlayerProxy } from "./PlayerProxy";
import PlayerCommand from "./PlayerCommand";
import Init from "../base/Init";
import App from "../../App";

export default class PlayerInit extends Init{
    proxy:PlayerProxy;
    cmd:PlayerCommand;
    moduleName:string = "player";

    init(){
        this.moduleName = "player";
        this.proxy = PlayerProxy.getInstance(PlayerProxy);
        this.proxy.init();
        this.cmd = new PlayerCommand();        
    }

    onMsg(){
        //监听服务端消息   

    }
}

