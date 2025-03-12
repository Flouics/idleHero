import { Building }  from "../../logic/Building";
import {BaseView} from "../../zero/BaseView";
import { _decorator, Toggle} from 'cc';
import { getLobbyProxy, LobbyProxy, LOBBY_MENU_ENUM } from "./LobbyProxy";
import { getRewardProxy } from "../reward/RewardProxy";
import { UIID_Reward } from "../reward/RewardInit";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UIID } from "../../common/config/GameUIConfig";
import { DEBUG } from "cc/env";
const {ccclass, property} = _decorator;

@ccclass("MenuView")
export class MenuView extends BaseView {
    _clickBuilding:Building

    @property(Toggle)
    tgBattle:Toggle = null;
    @property(Toggle)
    tgMercenary:Toggle = null;
    @property(Toggle)
    tgPackage:Toggle = null;
    moduleName = "lobby";
    proxy:LobbyProxy;
    
    onLoad(){
        super.onLoad()
        
        this.proxy = getLobbyProxy();

        DEBUG && (window["menuView"] = this);
    }

    start(): void {
        this.onClickBattle();
    }

    onClickBattle(){
        //this._clickBuilding = new Tower(null);
        var value = this.tgBattle.isChecked ? LOBBY_MENU_ENUM.BATTLE : LOBBY_MENU_ENUM.COMMON;
        this.proxy.updateView("switchMenu",value);
    }

    onClickMercenary(){
        var value = this.tgMercenary.isChecked ? LOBBY_MENU_ENUM.MERCENARY : LOBBY_MENU_ENUM.COMMON;
        this.proxy.updateView("switchMenu",value);
    }

    onClickPackage(){
        var value = this.tgPackage.isChecked ? LOBBY_MENU_ENUM.PACKAGE : LOBBY_MENU_ENUM.COMMON;
        this.proxy.updateView("switchMenu",value);
    }

    onClickIdleRwd(){
        getRewardProxy().cmd.showView(UIID_Reward.IdleRewardView);
    }

    touchMove(){

    }

    onClickSetting(){
        oops.gui.open(UIID.Setting);
    }

    switchMenu(value: number) {        
        this.tgBattle.isChecked = value == LOBBY_MENU_ENUM.BATTLE;
        this.tgMercenary.isChecked = value == LOBBY_MENU_ENUM.MERCENARY;
    }
}
