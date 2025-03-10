
import App from "../../App";
import { Proxy }from "../base/Proxy";
import LobbyCommand from "./LobbyCommand";
/*

 */

export class LobbyProxy extends Proxy {
    cmd:LobbyCommand;
    MENU_ENUM =  {
        COMMON: 0,
        BATTLE: 1,
        MERCENARY: 2,
        PACKAGE:3
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