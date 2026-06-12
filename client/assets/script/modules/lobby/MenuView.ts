import { Building }  from "../../logic/Building";
import {BaseView} from "../../zero/BaseView";
import { _decorator, Toggle} from 'cc';
import { getLobbyProxy, LobbyProxy, LOBBY_MENU_ENUM } from "./LobbyProxy";
import { getRewardProxy } from "../reward/RewardProxy";
import { UIID_Reward } from "../reward/RewardInit";
import { oops } from "../../oops/core/Oops";
import { UIID } from "../../common/config/GameUIConfig";
import { DEBUG } from "cc/env";
import { LobbyEvent } from "./LobbyEvent";
const {ccclass, property} = _decorator;

@ccclass("MenuView")
export class MenuView extends BaseView {
    _clickBuilding:Building

    tgMap:{[key:number]:Toggle} = {};
    moduleName = "lobby";
    proxy:LobbyProxy;
    
    onLoad(){
        super.onLoad()
        
        this.proxy = getLobbyProxy();

        DEBUG && (window["menuView"] = this);
        this.initView();
    }

    initView(){
        this.tgMap = {};
        this.tgMap[LOBBY_MENU_ENUM.BATTLE] = this.getNode("tgBattle").getComponent(Toggle);
        this.tgMap[LOBBY_MENU_ENUM.FRIEND] = this.getNode("tgFriend").getComponent(Toggle);
        this.tgMap[LOBBY_MENU_ENUM.GUILD] = this.getNode("tgGuild").getComponent(Toggle);
        this.tgMap[LOBBY_MENU_ENUM.GARDEN] = this.getNode("tgGarden").getComponent(Toggle);  
    }

    start(): void {
        this.switchMenu(LOBBY_MENU_ENUM.GARDEN);
    }

    onClickToggle(target:Toggle): void {
        if(target && target.isChecked == false){
            this.switchMenu(LOBBY_MENU_ENUM.COMMON);
            return;
        }
        for(let key in this.tgMap){
            let tg = this.tgMap[key];
            if (tg == target){
                this.proxy.dispatchEvent(LobbyEvent.Lobby_SwitchMenu, Number(key));
            }
        }
    }

    onClickPackage(target:Toggle){
        let value = target.isChecked ? LOBBY_MENU_ENUM.PACKAGE : LOBBY_MENU_ENUM.COMMON;
        this.proxy.dispatchEvent(LobbyEvent.Lobby_SwitchMenu, value);
    }

    onClickIdleRwd(){
        getRewardProxy().cmd.showView(UIID_Reward.IdleRewardView);
    }

    onClickSetting(){
        oops.gui.open(UIID.Setting);
    }

    switchMenu(value: number) {        
        let tg = this.tgMap[value] || this.tgMap[LOBBY_MENU_ENUM.COMMON];
        tg.isChecked = true;
        this.proxy.dispatchEvent(LobbyEvent.Lobby_SwitchMenu, value);
    }
}
