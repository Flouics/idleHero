

/*
 * @Author: dgflash
 * @Date: 2021-11-12 10:02:31
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-25 17:03:45
 */

import { ecs } from "../../oops/libs/ecs/ECS";


/** 
 * 游戏帐号数据 
 */
@ecs.register('AccountModel')
export class AccountModelComp extends ecs.Comp {
    /** 资源列表 */
    currency: any = {};
    /** 角色对象 */

    reset() {

    }
}