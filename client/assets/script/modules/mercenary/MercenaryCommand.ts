

import {App} from "../../App";
import {Command} from "../base/Command"
import { getEquipProxy } from "../equip/EquipProxy";
import { MercenaryProxy } from "./MercenaryProxy";
import { MercenaryEvent } from "./MercenaryEvent";

export class MercenaryCommand extends Command{
    proxy:MercenaryProxy;

    upgrade(mercenaryId:number){
        var mercenaryData = this.proxy.getMercenaryById(mercenaryId);
        mercenaryData.upgrade() && this.proxy.dispatchEvent(MercenaryEvent.Mercenary_UpgradeResult, mercenaryId);
    }

    setUseEquip(pos:number,equipIdx:number){
        getEquipProxy().setUseEquip(pos,equipIdx);
    }
}
