import { director } from "cc";
import {BaseClass} from "../zero/BaseClass";
import { Debug }   from "../utils/Debug";
import {App} from "../App";

export class SceneMgr extends BaseClass {
    isLoading = false;
    static EVENT = {
        BEFORE_SCENE_PRELOADING: 'BEFORE_SCENE_PRELOADING',
        AFTER_SCENE_PRELOADING: 'AFTER_SCENE_PRELOADING',
        BEFORE_SCENE_LOADING: 'BEFORE_SCENE_LOADING',
        AFTER_SCENE_LOADING: 'AFTER_SCENE_LOADING',
        //launch不需要再发射事件，进入加载。
    };

    constructor(){
        super();
        SceneMgr._instance = this;
    }

    static get instance ():SceneMgr{
        if( SceneMgr._instance){
            return SceneMgr._instance as SceneMgr;
        }else{
            let instance = new SceneMgr();
            return instance
        }
    }


    loadScene(sceneName: string, cb?: Function) {

        // 正在加载了，请排队，或先拒绝
        if (this.isLoading) {
            Debug.error('already loading scene');
            return;
        }

        this.isLoading = true;
        Debug.log('[Scene] preScene ', director.getScene().name, ' -> nextScene ', sceneName);

        var self = this;
        function sceneAction() {
            Debug.log('endAction, start loadScene', new Date().getTime());
            // 停止当前音乐
            self.isLoading = director.loadScene(sceneName, function () {
                self.isLoading = false;
                App.loadingMgr.stopAnimation();
                Debug.log('end loadScene', sceneName, new Date().getTime());
                if (cb) {
                    cb();
                }
            });
        }
        App.loadingMgr.playAnimation(0.2);
        director.preloadScene(sceneName, function (error) {
            if (error) {
                self.isLoading = false;
                Debug.error("preloadScene error",error);
                return;
            } else {
                sceneAction();
            }
        });
    };
};

