
import {App} from "../../App";
import {BaseView} from "../../zero/BaseView";

import { Node, _decorator } from 'cc';
import { LobbyProxy, LOBBY_MENU_ENUM }  from "./LobbyProxy";
import {MapMainView} from "../map/MapMainView";
import {PlayerTopInfoView} from "../player/PlayerTopInfoView";
import { UIID_Map } from "../map/MapInit";
import { UICallbacks } from "../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { MercenaryView } from "../mercenary/MercenaryView";
import { PackageView } from "../package/PackageView";
import { MenuView } from "./MenuView";
import { UIID_Mercenary } from "../mercenary/MercenaryInit";
import { UIID_Package } from "../package/PackageInit";
const {ccclass, property} = _decorator;


@ccclass("LobbyView")
export class LobbyView extends BaseView {
    moduleName = "lobby"
    proxy:LobbyProxy;
    bgMusicName:string = ""

    @property(Node)
    nd_mapRoot: Node = null;  //基础的地图层
    @property(Node)
    nd_mercenary: Node = null;  
    @property(Node)
    nd_package: Node = null;  
    @property(Node)
    nd_menuRoot: Node = null;  //菜单
    @property(Node)
    nd_playerTopInfo:Node = null;

    playerTopInfoView:PlayerTopInfoView;
    mapMainView:MapMainView;
    mercenaryView:MercenaryView;
    packageView:PackageView;
    menuView:MenuView;

    menuIndex: number = 0;

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句        
        this.playerTopInfoView = this.nd_playerTopInfo.getComponent(PlayerTopInfoView);             
        this.menuView = this.nd_menuRoot.getComponent(MenuView);
        this.menuIndex = LOBBY_MENU_ENUM.COMMON;
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

        this.nd_mapRoot && (this.nd_mapRoot.active = false);        
        this.nd_mercenary && (this.nd_mercenary.active = false);
        this.nd_package && (this.nd_package.active = false);

        this.menuIndex = value;
        if (this.menuIndex == LOBBY_MENU_ENUM.BATTLE){                 
           this.nd_mapRoot.active = true;      
            if(!this.mapMainView){
                let uic:UICallbacks = {
                    onCompleted:(node:Node) => {
                        node.removeFromParent();
                        node.parent = this.nd_mapRoot;
                        this.mapMainView = node.getComponent(MapMainView);
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
            this.nd_mercenary.active = true;    
            if(!this.mercenaryView){
                let uic:UICallbacks = {
                    onCompleted:(node:Node) => {
                        node.removeFromParent();
                        node.parent = this.nd_mercenary;
                        this.mercenaryView = node.getComponent(MercenaryView);
                    }
                }
                oops.gui.open(UIID_Mercenary.MercenaryView,null,uic);
            }
            return;
        }

        if (this.menuIndex == LOBBY_MENU_ENUM.PACKAGE){       
            this.playerTopInfoView.setPackageItemIdList_common(); 
            this.nd_package.active = true;   
            if(!this.packageView){
                let uic:UICallbacks = {
                    onCompleted:(node:Node) => {
                        node.removeFromParent();
                        node.parent = this.nd_package;
                        this.packageView = node.getComponent(PackageView);
                    }
                }
                oops.gui.open(UIID_Package.PackageView,null,uic);
            } 
            return;
        }
    }
}