/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2022-11-11 17:41:53
 */

import { LayerType,UIConfig} from "../.././oops/core/gui/layer/LayerManager"

let _UIID_ENUM_INDEX = 0;
export let uuidIndex =() =>{
    _UIID_ENUM_INDEX++;
    return _UIID_ENUM_INDEX;
}
/** 界面唯一标识 */
export enum UIID {
    /** 资源加载界面 */
    Loading = uuidIndex(),
    LoadingAm = uuidIndex(),
    /** 提示弹出窗口 */
    Alert = uuidIndex() ,
    /** 确认弹出窗口 */
    Confirm = uuidIndex(),
    /** 确认弹出窗口2 */
    MsgBox = uuidIndex(),
    /** setting */
    Setting = uuidIndex(),
}
/* loadingAm: "prefab/dialog/loadingAm",
msgBox: "prefab/dialog/msgBox",
tips: "prefab/dialog/tips",
setting:"prefab/dialog/setting",
mask:"prefab/dialog/mask", */

/** 打开界面方式的配置数据 */
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "prefab/loading/loading", bundle: "resources" },
    [UIID.LoadingAm]: { layer: LayerType.Dialog, prefab: "prefab/dialog/loadingAm", bundle: "resources" },
    [UIID.Alert]: { layer: LayerType.Dialog, prefab: "prefab/dialog/alert", mask: true },
    [UIID.Confirm]: { layer: LayerType.Dialog, prefab: "prefab/dialog/confirm", mask: true },
    [UIID.MsgBox]: { layer: LayerType.Dialog, prefab: "prefab/dialog/msgBox", mask: true },
    [UIID.Setting]: { layer: LayerType.Dialog, prefab: "prefab/dialog/setting",mask: true },
}