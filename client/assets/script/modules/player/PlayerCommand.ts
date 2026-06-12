
import { App } from "../../App";
import {Command} from "../base/Command"
import { Proxy } from "../base/Proxy";
import { PlayerProxy } from "./PlayerProxy";

export class PlayerCommand extends Command{
    proxy: PlayerProxy;
    constructor(){
        super();
        PlayerCommand._instance = this;
    }

    static get instance ():PlayerCommand{
        return App.getInstance(PlayerCommand);
    }

}
