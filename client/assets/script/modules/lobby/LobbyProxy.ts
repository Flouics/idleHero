
import {App} from "../../App";
import { Proxy }from "../base/Proxy";
import {LobbyCommand} from "./LobbyCommand";
/*

 */

export enum LOBBY_MENU_ENUM {
    COMMON =  0,
    BATTLE,
    MERCENARY,
    PACKAGE,
}

export class LobbyProxy extends Proxy {
    cmd:LobbyCommand;
    constructor(){       
        super();
        LobbyProxy._instance = this;
    }

    static get instance ():LobbyProxy{
        if( LobbyProxy._instance){
            return LobbyProxy._instance as LobbyProxy;
        }else{
            let instance = new LobbyProxy();
            return instance
        }
    }
    dumpPrepare(){
        //导出数据的预处理 *写入本地之前调用*
    }

    reloadPrepare(){
        //加载数据的预处理 *读取本地之后调用*
    }
};

export function getLobbyProxy(): LobbyProxy {
    return LobbyProxy._instance;
}