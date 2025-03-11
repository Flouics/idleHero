import { Building }  from "../../logic/Building";
import {BaseView} from "../../zero/BaseView";
import { _decorator, Toggle} from 'cc';
import { getLobbyProxy, LobbyProxy } from "./LobbyProxy";
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
        if(DEBUG){
            window["menuView"] = this;
        }        
    }

    start(): void {
        this.onClickBattle();
    }

    onClickBattle(){
        //this._clickBuilding = new Tower(null);
        var MENU_ENUM = this.proxy.MENU_ENUM;
        var value = this.tgBattle.isChecked ? MENU_ENUM.BATTLE : MENU_ENUM.COMMON;
        this.proxy.updateView("switchMenu",value);
    }

    onClickMercenary(){
        var MENU_ENUM = this.proxy.MENU_ENUM;
        var value = this.tgMercenary.isChecked ? MENU_ENUM.MERCENARY : MENU_ENUM.COMMON;
        this.proxy.updateView("switchMenu",value);
    }

    onClickPackage(){
        var MENU_ENUM = this.proxy.MENU_ENUM;
        var value = this.tgPackage.isChecked ? MENU_ENUM.PACKAGE : MENU_ENUM.COMMON;
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
        var MENU_ENUM = this.proxy.MENU_ENUM;
        this.tgBattle.isChecked = value == MENU_ENUM.BATTLE;
        this.tgMercenary.isChecked = value == MENU_ENUM.MERCENARY;
    }
}
