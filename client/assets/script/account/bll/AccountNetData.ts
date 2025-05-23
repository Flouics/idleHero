/*
 * @Author: dgflash
 * @Date: 2021-11-23 15:51:15
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-25 17:03:54
 */

import { v3 } from "cc";
import { oops } from "../../oops/core/Oops";
import { ecs } from "../../oops/libs/ecs/ECS";
import { GameEvent } from "../../common/config/GameEvent";
import { Account } from "../Account";
import { AccountModelComp } from "../model/AccountModelComp";


/** 请求玩家游戏数据 */
@ecs.register('AccountNetData')
export class AccountNetDataComp extends ecs.Comp {
    reset() { }
}

/** 请求玩家游戏数据 */
@ecs.register('Account')
export class AccountNetDataSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(AccountNetDataComp, AccountModelComp);
    }

    entityEnter(e: Account): void {
        let onComplete = {
            target: this,
            callback: (data: any) => {
                // 设置本地存储的用户标识（用于下次登录不输入帐号）
                this.setLocalStorage(data.id);

                // 创建玩家角色对象
                this.createRole(e, data);

                // 玩家登录成功事件
                oops.message.dispatchEvent(GameEvent.LoginSuccess);
            }
        }

        // 离线测试代码开始
        var data = {
            id: 1,
            name: "Oops",
            power: 10,
            agile: 10,
            physical: 10,
            lv: 1,
            jobId: 1
        }
        onComplete.callback(data);
        // 离线测试代码结束

        e.remove(AccountNetDataComp);
    }

    /** 创建角色对象（自定义逻辑） */
    private createRole(e: Account, data: any) {
       
    }

    /** 设置本地存储的用户标识 */
    private setLocalStorage(uid: string) {
        oops.storage.setUser(uid);
        oops.storage.set("account", uid);
    }
}