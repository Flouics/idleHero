/**
 * Created by Administrator on 2017/8/5.
 * 特效管理类，方便后续游戏扩展。
 */

import App from "../App";
import UIEffect from "../effect/UIEffect";
import BaseClass from "../zero/BaseClass";
import { Node, Prefab, resources,instantiate, Vec2, UITransform, Vec3} from "cc";
import { Debug }   from "../utils/Debug";

export var EFFECT_COMMON = {
    LIFE:"life"
}
class EffectData {
    root:Node = App.getUIRoot();
    x:number = 0;
    y:number = 0;
    constructor(param:any) {
        for (const key in param) {
            if(this.hasOwnProperty(key)){
                this[key] = param[key];
            }
        }
    }
}

export default class EffectMgr extends BaseClass {
    static EFFECT_COMMON = EFFECT_COMMON;
    _baseUrl:string = "";
    _prefabUrl:string = "prefab/effect/";
    /**
     * 播放通用特效
     */

    playEffectLife(param:any):void {
        this.playEffect(EFFECT_COMMON.LIFE,param)
    };

    playEffect(effectName:string,param?:any):void {
        var self = this;
        var prefabUrl = this._prefabUrl + effectName;
        this.playEffectEx(prefabUrl,param)
    };

    playEffectEx(prefabUrl:string,param?:any):void {
        var self = this;
        var effectData = new EffectData(param);
        var root = effectData.root;
        if(param.root == null){
            var nodePos = root.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(effectData.x,effectData.y,0));
            effectData.x = nodePos.x;
            effectData.y = nodePos.y;
        }
        resources.load(prefabUrl,Prefab, function (err: any, prefab: any) {
            //Debug.log('[effect] create: ', prefabUrl, new Date());
            if (err) {
                Debug.error("[effect] create error",prefabUrl, err);
            }
            else {
                var ui = instantiate(prefab);
                ui.active = true;
                var parent = effectData.root;
                if (parent && parent.isValid) {
                    ui.parent = parent;
                }     
                ui.uiName = prefabUrl;
                ui.setPosition(effectData.x,effectData.y);
                ui.getComponent(UIEffect).open(param)
            }
        });
    };
};
