import {Emitter} from "./zero/Emitter";
import {Config} from "./Config";
import {LoadingMgr} from "./manager/LoadingMgr";
import {DBMgr, LOCAL_STORAGE } from "./manager/DBMgr";
import {HttpMgr} from "./manager/HttpMgr";
import {SceneMgr} from "./manager/SceneMgr";
import {AsyncTaskMgr} from "./manager/AsyncTaskMgr";
import {PoolMgr} from "./manager/PoolMgr";
import {ModuleMgr} from "./manager/ModuleMgr";
import {TimeMgr} from "./manager/TimeMgr";
import {DataMgr} from "./manager/DataMgr";
import {LoginMgr} from "./manager/LoginMgr";
import {BaseClass} from "./zero/BaseClass";
import {AppView} from "./AppView";
import {EffectMgr} from "./manager/EffectMgr";
import { AppInit } from "./AppInit";
import { empty, GlobalInit, GlobalInitDependency} from "./Global";
import { AnimationManager, director, find, Font, Game, game, Node, resources } from "cc";
import { Debug }   from "./utils/Debug";
import {KeyWordMgr} from "./manager/KeyWordMgr";
import { getPlayerProxy } from "./modules/player/PlayerProxy";
import { jsonToObj, objToJson, serialize } from "./utils/Decorator";
import {UUID} from "./utils/UUID";
import { oops } from "../../extensions/oops-plugin-framework/assets/core/Oops";

/**
 * 全局唯一的游戏管理器,每个场景都可以持有
 * 挂在启动场景。
 */
enum EventEnum {
    EVENT_HIDE = 1
    ,EVENT_SHOW = 2
};

//全局函数
GlobalInit();

class AccountInfo {
    @serialize()
    aid:string = "";
    @serialize()
    uid:string = "";
}

export var DELAY_TASK_KEY = "delayTask_";  //加上这个key的task，同一时间执行多个任务，只会执行第一个。

//App只会有一个。
export class App extends BaseClass{

    static accountInfo = new AccountInfo();
    
    static scheduleTask:any = null;
    static eventEnum:any = EventEnum
    static emitter:Emitter = new Emitter()

    //mamager
    static config:Config;
    static loadingMgr:LoadingMgr;
    static dbMgr:DBMgr;

    static httpMgr:HttpMgr;
    static sceneMgr:SceneMgr; 
    static asyncTaskMgr:AsyncTaskMgr;
    static poolMgr:PoolMgr;
    static moduleMgr:ModuleMgr;

    static timeMgr:TimeMgr;
    static dataMgr:DataMgr;
    static loginMgr:LoginMgr;
    static effectMgr:EffectMgr;
    static keyWordMgr:KeyWordMgr;

    static ui:AppView; 
    static font:Font;
    

    // use App for initialization
    static onLoad () {
        App.onMsg();
    }

    static appInit (ui?:AppView) {
        if (ui) {
            App.ui = ui;
        }
        App.scheduleTask = {};
        //定义全局变量。        
        window["App"] = App;    
                
        App.config = new Config();
        
        App.loadingMgr = new LoadingMgr();
        App.dbMgr = new DBMgr();
        App.httpMgr = new HttpMgr();
        App.sceneMgr = new SceneMgr();
        App.asyncTaskMgr = new AsyncTaskMgr();
        App.poolMgr = new PoolMgr();
        App.moduleMgr = new ModuleMgr();
        App.timeMgr = new TimeMgr();
        App.dataMgr = new DataMgr();
        App.loginMgr = new LoginMgr();
        App.effectMgr = new EffectMgr();  
        App.keyWordMgr = new KeyWordMgr();

        //账号信息
        App.initAccount()
        
        //需要初始化的模块
        AppInit();
        
        //全局变量
        GlobalInitDependency();        

    }

    static clear(){
        App.config = new Config();
        App.font = null;
    }

    static initAccount(){
        var accountInfoJson = App.dbMgr._getJsonItem(LOCAL_STORAGE.ACCOUNT_INFO)
        if(empty(accountInfoJson)){
            App.accountInfo.aid = UUID.gen(10);
            App.accountInfo.uid = UUID.gen(8);     
            App.saveAccount();       
        }else{
            jsonToObj(App.accountInfo,accountInfoJson)
        }
    }

    static saveAccount(){
        App.dbMgr._setJsonItem(LOCAL_STORAGE.ACCOUNT_INFO,objToJson(App.accountInfo));
    }

    static onLaunchGame(){
        getPlayerProxy().checkPlayer();
    }

    static onMsg () {
        //action管理器的问题。
        game.off(Game.EVENT_SHOW);
        game.off(Game.EVENT_HIDE);
        game.on(Game.EVENT_SHOW, App.onEventShow.bind(App));
        game.on(Game.EVENT_HIDE, App.onEventHide.bind(App));
    }

    static onEventHide () {
        App.emitter.emit(App.eventEnum.EVENT_HIDE);
    }

    static onEventShow () {
        App.emitter.emit(App.eventEnum.EVENT_SHOW);
        var animationMgr = director.getSystem(AnimationManager.ID)
        if (director.getScheduler().isTargetPaused(animationMgr)) {
            director.getScheduler().resumeTarget(animationMgr);
        }
    }

    static offMsg () {
    }

    static start () {
        
    }

    static restart () {
        //有BUG先屏蔽。
        game.restart();
    }

    static exit () {
        game.end();
    }

    //简单重写就好了。
    static task (cb:Function, interval:number, key:string) {
        if (!App.ui) {
            return false
        }

        if (App.scheduleTask[key]) { 
            if(key.startsWith(DELAY_TASK_KEY)){
                return; //延时任务不需要重复执行。
            }            
            Debug.warn("scheduleTask has exist.", key);
            App.delTask(key);
        }
        App.scheduleTask[key] = cb;
        App.ui.schedule(cb, interval / 1000);
        return true
    }

    static taskOnce (cb:Function, interval:number, key:string) {
        if (!App.ui) {
            return false
        }
        App.task(function () {
            App.delTask(key)
            if (!!cb) cb();
        }, interval, key)
    }

    static delTask (key:string) {
        var func = App.scheduleTask[key];
        if (!!func) {
            this.ui.unschedule(func);
            delete App.scheduleTask[key];
        }
    }

    //单例
    static getInstance(_Class:any){
        return _Class?.instance
    }

    static getPopupRoot(){
        return oops.gui.getPopupRoot();
    }

    static getUIRoot(){
        return oops.gui.getUIRoot();
    }

    static getDialogRoot(){
        return oops.gui.getDialogRoot();
    }

    static getEffectRoot() {
        return oops.gui.effect;
    };

    //加载字体
    static initFont(cb?:Function){
        if(App.font){
            if (!!cb) {
                cb(App.font);
            }
            return;
        }
        resources.load("font/base", function (err, font) {
            App.font = font;
            if (!!cb) {
                cb(App.font);
            }
        });
    }

    static getUUID() {
        return ""
    }

    static setLang(lang:string) {
        // todo 
        //i18n.init(lang);
    }
    static dumpToDb(){       
        App.moduleMgr.dumpToDb()
        //Debug.log("保存成功")
    }

    static reloadFromDb(){
        App.moduleMgr.reloadFromDb();
        //Debug.log("加载成功")
    }
}
