import { resources } from "cc";
import {App} from "../App";
import {BaseClass} from "../zero/BaseClass";
import { Debug }   from "../utils/Debug";
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UUID } from "../utils/UUID";
import { UIID } from "../common/config/GameUIConfig";
import { uiKit } from "../utils/UIKit";
import { UICallbacks } from "../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines";

var global = window;
export class LoadingMgr extends BaseClass {
    play_id = 0;
    is_play = false;

    playAnimation(delay: number = 1) {
        this.is_play = true;
        this.play_id++;
        var play_id = this.play_id;
        var self = this;
        setTimeout(function () {
            if (play_id == self.play_id) {
                let uic:UICallbacks = {
                    onAdded:() => {
                        if (self.is_play == false) {
                            self.stopAnimation();
                        }
                    }
                }
                oops.gui.open(UIID.LoadingAm, null,uic);
            }
        }, delay * 1000)
    };

    stopAnimation() {
        this.is_play = false;
        oops.gui.remove(UIID.LoadingAm);
    };

    //todo
    playAnimationRes() {
        this.is_play = true;
        this.play_id++;
        var self = this;
        let uic:UICallbacks = {
            onAdded:() => {
                if (self.is_play == false) {
                    self.stopAnimation();
                }
            }
        }
        oops.gui.open(UIID.LoadingAm, null,uic);
    };

    preLoadRes(atlas_name_list: string[]) {
        if (!atlas_name_list) {
            return;
        }
        for (var i in atlas_name_list) {
            let atlas_url = atlas_name_list[i];
            App.asyncTaskMgr.newAsyncTask(function () {
                resources.load(atlas_url, function (err, res) {
                    if (!err) {
                        Debug.log('preLoadRes atlas:', atlas_url);
                    }
                });
            });
        }
    };

    preLoadPrefab(ui_name_list: string[], cb?: Function, async_num?: number) {
        if (!ui_name_list) {
            return;
        }
        if (async_num == undefined) async_num = 1;
        if (async_num == 1) {
            for (var i in ui_name_list) {
                let ui_name = ui_name_list[i];
                App.asyncTaskMgr.newAsyncTask(function () {
                    oops.res.preload(ui_name, cb);
                });
            }
        } else {
            var ui_name_list_copy = ui_name_list.slice(0);
            while (ui_name_list_copy.length > 0) {
                let ui_name_list_temp = ui_name_list_copy.splice(0, async_num);
                App.asyncTaskMgr.newAsyncTask(function () {
                    for (var i in ui_name_list_temp) {
                        let ui_name = ui_name_list_temp[i];
                        oops.res.preload(ui_name, cb);
                    }
                });
            }
        }
    };
};
