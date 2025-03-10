import { LobbyProxy }  from "./LobbyProxy";
import LobbyCommand from "./LobbyCommand";
import Init from "../base/Init";

export default class LobbyInit extends Init {
    proxy:LobbyProxy;
    cmd:LobbyCommand;
    moduleName:string = "lobby";
    init(){
        this.moduleName = "lobby";
        this.proxy = LobbyProxy.getInstance(LobbyProxy);
        this.cmd = new LobbyCommand();       
    }

    onMsg(){
        //监听服务端消息   
    }
}

