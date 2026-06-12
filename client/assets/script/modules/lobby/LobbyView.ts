
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { Node, _decorator } from 'cc';
import { LobbyProxy, LOBBY_MENU_ENUM }  from "./LobbyProxy";
import {MapMainView} from "../map/MapMainView";
import {PlayerTopInfoView} from "../player/PlayerTopInfoView";
import { UIID_Map } from "../map/MapInit";
import { UICallbacks } from "../../oops/core/gui/layer/Defines";
import { oops } from "../../oops/core/Oops";
import { MercenaryView } from "../mercenary/MercenaryView";
import { PackageView } from "../package/PackageView";
import { MenuView } from "./MenuView";
import { UIID_Mercenary } from "../mercenary/MercenaryInit";
import { UIID_Package } from "../package/PackageInit";
import { getMercenaryProxy } from "../mercenary/MercenaryProxy";
import { LobbyEvent } from "./LobbyEvent";
import { MapCommand } from "../map/MapCommand";
import { GardenView } from "../garden/GardenView";
import { UIID } from "../../common/config/GameUIConfig";
import { UIID_Garden } from "../garden/GardenInit";

const {ccclass, property} = _decorator;


@ccclass("LobbyView")
export class LobbyView extends BaseView {
    moduleName = "lobby"
    proxy:LobbyProxy;
    bgMusicName:string = ""

    @property(Node)
    nd_root: Node = null;  
    @property(Node)
    nd_menuRoot: Node = null;  //菜单
    @property(Node)
    nd_playerTopInfo:Node = null;

    playerTopInfoView:PlayerTopInfoView;
    menuView:MenuView;

    menuIndex: number = 0;
    menuViewNodeMap:{[key:number]:Node} = {};   

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句        
        this.playerTopInfoView = this.nd_playerTopInfo.getComponent(PlayerTopInfoView);             
        this.menuView = this.nd_menuRoot.getComponent(MenuView);
        this.menuIndex = LOBBY_MENU_ENUM.COMMON;

        getMercenaryProxy().updateCurMercenaryInfo();
    }

    onEnterBattle(){
        this.nd_menuRoot.active = false;
        this.nd_playerTopInfo.active = false;
    }

    onExitBattle(){
        this.nd_menuRoot.active = true;
        this.nd_playerTopInfo.active = true;
    }
    
    switchMenu(value: number) {
        if(this.menuIndex == value){
            return;
        }

        this.menuIndex = value;
        let viewNode = this.menuViewNodeMap[this.menuIndex]
    
        for(let key in this.menuViewNodeMap){
            let node = this.menuViewNodeMap[key];
            let value = Number(key);
            node && (node.active = this.menuIndex == value || value == LOBBY_MENU_ENUM.GARDEN );
        } 

        
        if (this.menuIndex == LOBBY_MENU_ENUM.BATTLE){              
            if(!viewNode?.isValid){
                let uic:UICallbacks = {
                    onCompleted:(node:Node) => {
                        node.removeFromParent();
                        node.parent = this.nd_root;
                        this.menuViewNodeMap[value] = node;
                    }
                }
                oops.gui.open(UIID_Map.MapMainView,null,uic);
            }

            this.playerTopInfoView.setPackageItemIdList_battle();
            return;
        }
        
        if (this.menuIndex == LOBBY_MENU_ENUM.COMMON){            
            this.nd_menuRoot.active = true;
            this.playerTopInfoView.setPackageItemIdList_common();
            return;
        }

        if (this.menuIndex == LOBBY_MENU_ENUM.MERCENARY){        
            this.playerTopInfoView.setPackageItemIdList_common();
            if(!viewNode?.isValid){
                let uic:UICallbacks = {
                    onCompleted:(node:Node) => {
                        node.removeFromParent();
                        node.parent = this.nd_root;
                        this.menuViewNodeMap[value] = node;
                    }
                }
                oops.gui.open(UIID_Mercenary.MercenaryView,null,uic);
            }
            return;
        }

        if (this.menuIndex == LOBBY_MENU_ENUM.PACKAGE){       
            this.playerTopInfoView.setPackageItemIdList_common(); 
            if(!viewNode?.isValid){
                let uic:UICallbacks = {
                    onCompleted:(node:Node) => {
                        node.removeFromParent();
                        node.parent = this.nd_root;
                        this.menuViewNodeMap[value] = node;
                    }
                }
                oops.gui.open(UIID_Package.PackageView,null,uic);
            }else{
                viewNode.getComponent(PackageView)?.updateItemList();
            }
            return;
        }

        if (this.menuIndex == LOBBY_MENU_ENUM.GARDEN){       
            this.playerTopInfoView.setPackageItemIdList_common(); 
            if(!viewNode?.isValid){
                let uic:UICallbacks = {
                    onCompleted:(node:Node) => {
                        node.removeFromParent();
                        node.parent = this.nd_root;
                        this.menuViewNodeMap[value] = node;
                    }
                }
                oops.gui.open(UIID_Garden.GardenView,null,uic);
            }else{
                viewNode.getComponent(GardenView)?.updateGardenInfo();
            }
            return;
        }
    }

    onMsg(): void {
        this.onAuto(LobbyEvent.Lobby_OnEnterBattle, this.onEnterBattle, this);
        this.onAuto(LobbyEvent.Lobby_OnExitBattle, this.onExitBattle, this);
        this.onAuto(LobbyEvent.Lobby_SwitchMenu, this.switchMenu, this);
    }
}
