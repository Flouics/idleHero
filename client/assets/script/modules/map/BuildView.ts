
import App from "../../App";
import ListViewSimple from "../../ui/ListViewSimple";
import BaseUI from "../../zero/BaseUI";
import BaseView from "../../zero/BaseView";

import { _decorator, Node} from 'cc';
import CCEvent from "../../zero/CCEvent";
const {ccclass, property} = _decorator;

@ccclass("BuildView")
export default class BuildView extends BaseView {
    moduleName = "map";
    _baseUrl = "texture/map/";
    listView:ListViewSimple = null;

    onLoad(){
        super.onLoad();
        this.initBuildListView();
        this.initEvents();
    }

    initEvents(){
        this.regClickEvent("UIBuildItem.onCLickBtn",(event:CCEvent)=>{
            var data = event.detail;            
        });
    }

    async initBuildListView(){
        var conf = await App.dataMgr.getTable("building")
        var data = conf.all();
        this.listView = this.node.getComponent(ListViewSimple);
        this.listView.init(this.setItem.bind(this))
        this.listView.updateContent(data);
    }

    setItem(item:Node,v:any){
        item.getComponent(BaseUI).init()
    }

}