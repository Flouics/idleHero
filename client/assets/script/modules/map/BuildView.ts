
import {App} from "../../App";
import {ListViewSimple} from "../../ui/ListViewSimple";
import {BaseUI} from "../../zero/BaseUI";
import {BaseView} from "../../zero/BaseView";

import { _decorator, Node} from 'cc';
import {CCEvent} from "../../zero/CCEvent";
const {ccclass, property} = _decorator;

@ccclass("BuildView")
export class BuildView extends BaseView {
    moduleName = "map";
    _baseUrl = "texture/map/";
    listView:ListViewSimple = null;

    onLoad(){
        super.onLoad();
        this.initBuildListView();
        this.initEvents();
    }

    initEvents(){
        this.on("UIBuildItem.onCLickBtn",()=>{         
        },this);
    }

    async initBuildListView(){
        var conf = await App.dataMgr.getTable("building")
        var data = conf.all();
        this.listView = this.node.getComponent(ListViewSimple);
        this.listView.init(this.setItem.bind(this))
        this.listView.updateContent(data);
    }

    setItem(item:Node,v:any){
        //todo
    }

}