

import {App} from "../../App";
import {Command} from "../base/Command"
import { MercenaryProxy } from "./MercenaryProxy";

export class MercenaryCommand extends Command{
    proxy:MercenaryProxy;

    upgrade(mercenaryId:number){
        var mercenaryData = this.proxy.getMercenaryById(mercenaryId);
        mercenaryData.level += 1;
        this.proxy.updateView("upgradeResult",mercenaryId);
    }
}
