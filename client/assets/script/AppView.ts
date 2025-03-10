
import App from "./App";
import BaseUI from "./zero/BaseUI";
import BaseView from "./zero/BaseView";
import SceneBase from "./zero/SceneBase";
import { _decorator, Component, director, find, Node, profiler, Widget } from 'cc';
const {ccclass, property} = _decorator;
/**
 * 全局唯一的游戏管理器,每个场景都可以持有
 * 挂在启动场景。
 */

@ccclass("AppView")
export default class AppView extends BaseView{
    @property(Node)
    public nd_effectPool: Node = null;
    @property(Node)
    public nd_uiPool: Node = null;
    
    // use this for initialization
    onLoad () {
        App.appInit(this);
        App.onLoad();

        //设置为常驻借点。
        director.addPersistRootNode(this.node);
        //关闭帧数显示。
        //profiler.hideStats();
        profiler.showStats();

        //适配相关的
        // 废弃 todo
        //cc.view.setResizeCallback(this.onViewResize.bind(this));        
    }

    start () {
        
    }

    restart () {
        director.removePersistRootNode(this.node);
    }

    exit () {
        director.removePersistRootNode(this.node);
    }

    onViewResize () {
        //遍历所有的节点。
        //this.toolKit.showTip("onViewResize");
        var root = find('Canvas');
        var scene_comp = root.getComponent(SceneBase);
        if (scene_comp && scene_comp.fitWinSize) {
            scene_comp.fitWinSize();
        }
        this.updateNodeWidget(root);
    }

    updateNodeWidget (node:Node) {
        if (!!node && node instanceof Node) {
            var widget = node.getComponent(Widget);
            if (!!widget) {
                widget.updateAlignment();
            }
            var children = node.children;
            if (!!children) {
                children.forEach(function (child:Node) {
                    this.updateNodeWidget(child);
                }.bind(this))
            }
        }
    }
}
