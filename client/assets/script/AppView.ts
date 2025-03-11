
import {App} from "./App";
import { _decorator, Node, profiler } from 'cc';
import { Root } from "../../extensions/oops-plugin-framework/assets/core/Root";
import { DEBUG, JSB } from "cc/env";
import { ecs } from "../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { Initialize } from './initialize/Initialize';
import { UIConfigData } from "./common/config/GameUIConfig";
import { oops } from "../../extensions/oops-plugin-framework/assets/core/Oops";
import { smc } from "./common/ecs/SingletonModuleComp";
import { EcsPositionSystem } from './common/ecs/position/EcsPositionSystem';
const {ccclass, property} = _decorator;
/**
 * 全局唯一的游戏管理器,每个场景都可以持有
 * 挂在启动场景。
 */

@ccclass("AppView")
export class AppView extends Root{
   
    start () {
        if (DEBUG) profiler.showStats();
    }

    /** 加载完引擎配置文件后执行 */
    protected run() {
        App.appInit(this);
        App.onLoad();
        smc.initialize = ecs.getEntity<Initialize>(Initialize);
        if (JSB) {
            oops.gui.toast("热更新后新程序的提示");
        }
    }

    protected initGui() {
        oops.gui.init(UIConfigData);
    }

    protected async initEcsSystem() {
        oops.ecs.add(new EcsPositionSystem())
        // oops.ecs.add(new EcsAccountSystem());
        // oops.ecs.add(new EcsRoleSystem());
        // oops.ecs.add(new EcsInitializeSystem());
    }
}
