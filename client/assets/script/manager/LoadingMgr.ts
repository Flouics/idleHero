import { resources } from "cc";
import {App} from "../App";
import {BaseClass} from "../zero/BaseClass";
import { Debug }   from "../utils/Debug";
import { oops } from ".././oops/core/Oops";
import { UUID } from "../utils/UUID";
import { UIID } from "../common/config/GameUIConfig";
import { uiKit } from "../utils/UIKit";
import { UICallbacks } from ".././oops/core/gui/layer/Defines";

var global = window;
export class LoadingMgr extends BaseClass {
    play_id = 0;
    is_play = false;

    playAnimation(delay: number = 1) {
        this.is_play = true;
        this.play_id++;
        var play_id = this.play_id;
        setTimeout(() => {
            if (play_id == this.play_id) {
                let uic:UICallbacks = {
                    onAdded:() => {
                        if (this.is_play == false) {
                            this.stopAnimation();
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
        let uic:UICallbacks = {
            onAdded:() => {
                if (this.is_play == false) {
                    this.stopAnimation();
                }
            }
        }
        oops.gui.open(UIID.LoadingAm, null,uic);
    };
};
