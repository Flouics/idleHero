

import App from "../../App";
import BaseCommand from "../base/Command"
import { MercenaryProxy } from "./MercenaryProxy";

export default class MercenaryCommand extends BaseCommand{
    proxy:MercenaryProxy;

    upgrade(mercenaryId:number){
        var mercenaryData = this.proxy.getMercenaryById(mercenaryId);
        mercenaryData.level += 1;
        this.proxy.updateView("upgradeResult",mercenaryId);
    }
}
