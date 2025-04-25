import { Enum } from "cc";
import {App} from "./App";
import {PackageInit} from "./modules/package/PackageInit";
import {PlayerInit} from "./modules/player/PlayerInit";
import {TimeInit} from "./modules/time/TimeInit";
import {MapInit} from "./modules/map/MapInit";
import {MercenaryInit} from "./modules/mercenary/MercenaryInit";
import {RewardInit} from "./modules/reward/RewardInit";
import {LobbyInit} from "./modules/lobby/LobbyInit";
import { EquipInit } from "./modules/equip/EquipInit";

export function appInit(){
    
    App.initFont();

    //配表记载
    App.dataMgr.loadTexts = [
        'config'
        , 'base'
    ]    
}

export function modeuleInit(){
    //需要初始化的模块
    var moduleMgr = App.moduleMgr
    moduleMgr.init();
    moduleMgr.load("lobby",new LobbyInit());
    moduleMgr.load("player",new PlayerInit());
    moduleMgr.load("package",new PackageInit());
    moduleMgr.load("time",new TimeInit());
    moduleMgr.load("map",new MapInit());
    moduleMgr.load("mercenary",new MercenaryInit());
    moduleMgr.load("reward",new RewardInit());
    //moduleMgr.load("equip",new EquipInit());
    
    App.httpMgr.init();
    App.poolMgr.init();
}

