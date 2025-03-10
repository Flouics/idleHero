
import App from "../../App";
import BaseView from "../../zero/BaseView";

import { Node, _decorator } from 'cc';
import { LobbyProxy }  from "./LobbyProxy";
import MapMainView from "../map/MapMainView";
import PlayerTopInfoView from "../player/PlayerTopInfoView";
import { getMercenaryProxy } from "../mercenary/MercenaryProxy";
import { nullfun } from "../../Global";
import { getPackageProxy } from "../package/PackageProxy";
import { getMapProxy } from "../map/MapProxy";
import { toolKit } from "../../utils/ToolKit";
const {ccclass, property} = _decorator;


@ccclass("LobbyView")
export default class LobbyView extends BaseView {
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

    menuIndex: number = 0;

    onLoad(): void {
        super.onLoad(); //BaseView继承的不要去掉这句        
        this.playerTopInfoView = toolKit.getChild(this.nd_playerTopInfo,"playerTopInfo").getComponent(PlayerTopInfoView);             
        this.menuIndex = this.proxy.MENU_ENUM.COMMON;
    }

    init() {            //预加载就调用

    }

    show() {            //显示时调用

    }
    
    hide() {            //隐藏后调用

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
        var self = this;
        this.nd_mapRoot.active = false;        
        this.nd_mercenary.active = false;
        this.nd_package.active = false;
        var MENU_ENUM = this.proxy.MENU_ENUM;

        this.menuIndex = value;
        if (this.menuIndex == MENU_ENUM.BATTLE){        
            this.nd_mapRoot.active = true;          
            getMapProxy().cmd.showView("mapMainView",function(ui){
                ui.getComponent(MapMainView).enterStage();
            },this.nd_mapRoot);

            this.playerTopInfoView.setPackageItemIdList_battle();
            return;
        }
        
        if (this.menuIndex == MENU_ENUM.COMMON){            
            this.nd_menuRoot.active = true;
            this.playerTopInfoView.setPackageItemIdList_common();
            return;
        }


        if (this.menuIndex == MENU_ENUM.MERCENARY){        
            this.playerTopInfoView.setPackageItemIdList_common();
            this.nd_mercenary.active = true;    
            getMercenaryProxy().cmd.showView("mercenaryView",nullfun,this.nd_mercenary);
            return;
        }

        if (this.menuIndex == MENU_ENUM.PACKAGE){       
            this.playerTopInfoView.setPackageItemIdList_common(); 
            this.nd_package.active = true;    
            getPackageProxy().cmd.showView("packageView",nullfun,this.nd_package);
            return;
        }
    }
}