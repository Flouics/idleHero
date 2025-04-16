/*
 * @Author: dgflash
 * @Date: 2022-07-22 17:06:22
 * @LastEditors: dgflash
 * @LastEditTime: 2022-09-22 14:41:58
 */

import { oops } from "../.././oops/core/Oops";
import { AsyncQueue,NextFunction} from "../.././oops/libs/collection/AsyncQueue";
import { ecs } from "../.././oops/libs/ecs/ECS";
import { App } from "../../App";
import { UIID } from "../../common/config/GameUIConfig";
import { Initialize } from "../Initialize";
import { LoadingViewComp } from "../view/LoadingViewComp";

/** 初始化游戏公共资源 */
@ecs.register('InitRes')
export class InitResComp extends ecs.Comp {
    reset() { }
}

@ecs.register('Initialize')
export class InitResSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(InitResComp);
    }

    entityEnter(e: Initialize): void {
        var queue: AsyncQueue = new AsyncQueue();

        // 加载自定义资源
        this.loadCustom(queue);
        // 加载多语言包
        this.loadLanguage(queue);
        // 加载公共资源
        this.loadCommon(queue);
        //加载配置文件
        this.loadJsonData(queue);
        //模块初始化
        this.moduleInit(queue);
        // 加载游戏内容加载进度提示界面
        this.onComplete(queue, e);

        queue.play();
    }
    private loadJsonData(queue: AsyncQueue) {
        queue.push(async (next: NextFunction, params: any, args: any) => {
            // 加载配置文件
            App.dataMgr.tryLoadAllTable(next);
        });
    }

    private moduleInit(queue: AsyncQueue) {
        queue.push(async (next: NextFunction, params: any, args: any) => {
            // 加载配置文件
           App.moduleInit(next);
        });
    }


    /** 加载自定义内容（可选） */
    private loadCustom(queue: AsyncQueue) {
        queue.push(async (next: NextFunction, params: any, args: any) => {
            // 加载多语言对应字体
            oops.res.load("language/font/" + oops.language.current, next);
        });
    }

    /** 加载化语言包（可选） */
    private loadLanguage(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            // 设置默认语言
            let lan = oops.storage.get("language");
            if (lan == null || lan == "") {
                lan = "zh";
                oops.storage.set("language", lan);
            }

            // 加载语言包资源
            oops.language.setLanguage(lan, next);
        });
    }

    /** 加载公共资源（必备） */
    private loadCommon(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            oops.res.loadDir("prefab/dialog/", next);
        });

        queue.push((next: NextFunction, params: any, args: any) => {
            oops.res.loadDir("prefab/common/", next);
        });

        queue.push((next: NextFunction, params: any, args: any) => {
            oops.res.loadDir("texture/common/", next);
        });
    }

    /** 加载完成进入游戏内容加载界面 */
    private onComplete(queue: AsyncQueue, e: Initialize) {
        queue.complete = async () => {
            var node = await oops.gui.openAsync(UIID.Loading);
            if (node) e.add(node.getComponent(LoadingViewComp) as ecs.Comp);
            e.remove(InitResComp);
        };
    }
}