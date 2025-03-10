import BaseUI from "../zero/BaseUI";
import BaseClass from "../zero/BaseClass";
import App from "../App";
import BaseView from "../zero/BaseView";
import { Debug }   from "../utils/Debug";
import { find, Node, Prefab, resources, instantiate, BlockInputEvents, Sprite, SpriteFrame, UITransform, Size, UIOpacity, Color} from "cc";
import UIMask from "../ui/UIMask";
import { empty, RES_WINDOW, winSize } from "../Global";
import BaseWin from "../zero/BaseWin";
import { toolKit } from "../utils/ToolKit";
import TouchUtils from "../utils/TouchUtils";


export default class WindowMgr extends BaseClass {
    creatingCB = {};
    ui = {};    
    uiWhichPlayBgMusic = null;

    create(uiName: string, cb?: Function, parent?: Node,...args: any[]) {
        var self = this;
        var ret = this.ui[uiName];
        if (ret && ret.isValid) {
            ret.active = true;
            if (parent == undefined) parent = find('Canvas');
            if (parent && ret.parent != parent) {
                ret.parent = parent;
            }

            cb(null, ret);
            return;
        }

        // 已经在加载，加入回调队列
        if (this.creatingCB.hasOwnProperty(uiName)) {
            this.creatingCB[uiName].push(cb);
            return;
        }

        // 初始化回调队列
        this.creatingCB[uiName] = [cb];

        var self = this;
        resources.load(uiName,Prefab, function (err: any, prefab: any) {
            Debug.log('[ui] end create: ', uiName, new Date());
            var cbs = self.creatingCB[uiName] || [];
            delete self.creatingCB[uiName];

            if (err) {
                Debug.error(uiName, err);
                cbs.forEach(function (cb:Function) {
                    cb(err, null);
                })
            }
            else {
                var ui = instantiate(prefab);
                ui.active = false;
                if (parent == undefined) parent = self.getUIRoot();        //解决异步场景多次进入的问题
                if (parent && parent.isValid) {
                    ui.parent = parent;
                }
                self.ui[uiName] = ui;
                ui.uiName = uiName;
                
                var baseWin = ui.getComponent(BaseWin)
                if(baseWin){                    
                    if(baseWin.isNeedBg){
                        //增加黑幕
                        var bgNode = new Node();
                        var uiTransform = bgNode.addComponent(UITransform);
                        var uiOpacity = bgNode.addComponent(UIOpacity);
                        var spt_bg = bgNode.addComponent(Sprite);
                        spt_bg.sizeMode = Sprite.SizeMode.CUSTOM;
                        resources.load("texture/common/default_sprite_splash/spriteFrame", SpriteFrame, function (err, spriteFrame) {
                            if (!err) {
                                spt_bg.spriteFrame = spriteFrame ;
                            }
                        });                    
                        bgNode.name = "_bg"
                        ui.addChild(bgNode);
                        bgNode.setSiblingIndex(0);
                        uiTransform.setContentSize(new Size(winSize.width * 2,winSize.height * 2));
    
                        var spt_bg = bgNode.getComponent(Sprite);
                        if(baseWin.index < 200){
                            spt_bg.color = new Color(0,0,0,255);
                        }else{
                            spt_bg.color = new Color(0,0,0,128);
                        }
                    }
    

                    baseWin._baseInit();
                    if (baseWin.init) {
                        baseWin.init(...args);
                    }
                }
                
                cbs.forEach(function (cb:Function) {
                    cb(null, ui);
                })
            }
        });
    };
    // 打开
    open(uiName: string, cb?: Function, parent?: Node, ...args: any[]) {
        // Debug.log('open ui: ', uiName);
        var time1 = new Date().getTime();
        var self = this;
        this.create(uiName, function (err, ui:Node) {
            if (err) {
                Debug.error('open ui failed ', uiName, err);
                return;
            }
            var time2 = new Date().getTime();
            Debug.log('open ui cost:', uiName, time2 - time1);
            if (!!ui) {
                var baseWin = ui.getComponent(BaseWin);
                var blockUI = ui.getComponent(BlockInputEvents);
                if(!blockUI){
                    ui.addComponent(BlockInputEvents);
                }
                if (!!baseWin) {
                    baseWin._show(args);         //这个不要重写
                } else {
                    ui.active = true;
                }
                self.playBgMusic();
            }

            if (!!cb) cb(ui);
        }, parent,...args);
    };

    // 预加载
    preload(uiName: string, cb?: Function) {
        var parent = App.ui.nd_uiPool;
        this.create(uiName, function (err, ui:Node) {
            if (err) {
                Debug.error('preload ui failed ', uiName, err);
                return;
            } else {
                if (!!cb) cb(ui);
            }
        }, parent);
    };


    // 关闭
    close(uiName: string,...args: any[]) {
        // Debug.log('close ui: ', uiName);
        var self = this;
        var ui = this.ui[uiName];
        if (!!ui) {
            console.log("关闭界面 " + uiName);
            self._close(ui,...args);
        } else {
            console.log("没找到 " + uiName);
        }
    };

    closeUI(component: any,...args: any[]) {
        var ui = component.node;
        this._close(ui, ...args);
    };

    _close(ui: Node,...args: any[]) {
        if (!(ui instanceof Node)) {
            Debug.error('close ui must use node.');
            return;
        }

        if (ui.isValid) {
            var baseUI = ui.getComponent(BaseUI);
            if (!!baseUI) {
                baseUI._hide();
                baseUI.hide(...args);
            } else {
                ui.active = false;
            }     
            this.playBgMusic();
        }
    };


    closeAll() {
        //todo
    };

    //按照窗口等级关闭窗口 1级窗口level =1
    //level =2 会关闭2级以上所有窗口。
    closeWindowByLevel(level: number) {
        var self = this;
        var ui_list = [];
        for (var name in this.ui) {
            var uiNode = this.ui[name];
            var baseUI = uiNode.getComponent(BaseWin);
            if (baseUI && baseUI.index >= level * 100) {
                ui_list.push(baseUI);
            }
        }
        ui_list.forEach(function (ui) {
            self.closeUI(ui);
        })
    };

    //关闭特定层级的窗口,除了特定窗口。
    closeWindowByZIndex(zIndex: string, exceptUI: Node) {
        var ui_list = this.getWindowByZIndex(zIndex, exceptUI);
        var self = this;
        ui_list.forEach(function (ui) {
            self.closeUI(ui);
        })
    };

    // 获取冲突的窗口
    getWindowByZIndex(zIndex: string, exceptUI: Node) {
        var self = this;
        var ui_list = [];
        for (var name in this.ui) {
            var uiNode = this.ui[name];
            var baseUI = uiNode.getComponent(BaseWin);
            if (baseUI && baseUI.node.active && baseUI.index == zIndex && baseUI != exceptUI) {
                ui_list.push(baseUI);
            }
        }
        return ui_list;
    };

    getUIRoot() {
        return App.getUIRoot();
    };

    block(sec: number) {
        this.open(RES_WINDOW.mask, function (uiNode:Node) {
            var ui = uiNode.getComponent(UIMask)
            ui.setUIMaskBlockTime(sec);
        });
    };

    playBgMusic(){
        if(!(this.uiWhichPlayBgMusic && this.uiWhichPlayBgMusic.active)){
            this.uiWhichPlayBgMusic = null;
        }        
        for (const key in this.ui) {
            const ui = this.ui[key];          
            if(ui.active && !empty(ui.bgMusicName)){
                if(this.uiWhichPlayBgMusic){
                    if (ui.index > this.uiWhichPlayBgMusic.index){
                        this.uiWhichPlayBgMusic = ui
                    }
                }else{
                    this.uiWhichPlayBgMusic = ui
                }
            }  
        }
        if(this.uiWhichPlayBgMusic){
            App.audioMgr.playMusic(this.uiWhichPlayBgMusic.bgMusicName);
        }else{
            //App.audioMgr.playMusic("bg");
        }
        
    }

    playBgMusicTask(){
        var self = this;
        App.taskOnce(function(){
            self.playBgMusic();
        },0,"delayTask_playBgMusicTask" + this.getClassName())        
    }

};
