/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-29 13:37:08
 */
import { _decorator, sys } from "cc";
import { oops } from "../../oops/core/Oops";
import { JsonUtil } from "../../oops/core/utils/JsonUtil";
import { ecs } from "../../oops/libs/ecs/ECS";
import { CCVMParentComp } from "../../oops/module/common/CCVMParentComp";
import { App } from "../../App";
import { GameEvent } from "../../common/config/GameEvent";
import { UIID } from "../../common/config/GameUIConfig";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { TableRoleJob } from "../../common/table/TableRoleJob";
import { TableRoleLevelUp } from "../../common/table/TableRoleLevelUp";
import { UIID_Lobby } from "../../modules/lobby/LobbyInit";


const { ccclass, property } = _decorator;

/** 游戏资源加载 */
@ccclass('LoadingViewComp')
@ecs.register('LoadingView', false)
export class LoadingViewComp extends CCVMParentComp {
    /** VM 组件绑定数据 */
    data: any = {
        /** 加载资源当前进度 */
        finished: 0,
        /** 加载资源最大进度 */
        total: 0,
        /** 加载资源进度比例值 */
        progress: "0",
        /** 加载流程中提示文本 */
        prompt: ""
    };

    private progress: number = 0;

    reset(): void {
        setTimeout(() => {
            // 关闭加载界面
            oops.gui.remove(UIID.Loading);

            // 打开游戏主界面（自定义逻辑）
            oops.gui.open(UIID_Lobby.LobbyView);
        }, 500);
    }

    start() {
        if (!sys.isNative) {
            this.enter();
        }
    }

    enter() {
        this.addEvent();
        this.loadRes();
        App.onLaunchGame();
    }

    private addEvent() {
        this.on(GameEvent.LoginSuccess, this.onLoginSuccess, this);
    }

    private onLoginSuccess(args: any) {
        this.ent.remove(LoadingViewComp);
    }

    /** 加载资源 */
    private async loadRes() {
        this.data.progress = 0;
        await this.loadCustom();
        this.loadGameRes();
    }

    /** 加载游戏本地JSON数据（自定义内容） */
    private loadCustom() {
        // 加载游戏本地JSON数据的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_json");

        return new Promise(async (resolve, reject) => {
            //await JsonUtil.loadAsync(TableRoleJob.TableName);
            //await JsonUtil.loadAsync(TableRoleLevelUp.TableName);
            resolve(null);
        });
    }

    /** 加载初始游戏内容资源 */
    private loadGameRes() {
        // 加载初始游戏内容资源的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_game");

        oops.res.loadDir("dialog", this.onProgressCallback.bind(this), this.onCompleteCallback.bind(this));
    }

    /** 加载进度事件 */
    private onProgressCallback(finished: number, total: number, item: any) {
        this.data.finished = finished;
        this.data.total = total;

        var progress = finished / total;
        if (progress > this.progress) {
            this.progress = progress;
            this.data.progress = (progress * 100).toFixed(2);
        }
    }

    /** 加载完成事件 */
    private onCompleteCallback() {
        // 获取用户信息的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_player");

        // 初始化帐号模块
        smc.account.connect();
    }
}