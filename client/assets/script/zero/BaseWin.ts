import App from "../App";
import { Debug }   from "../utils/Debug";
import { toolKit } from "../utils/ToolKit";
import { uiKit } from "../utils/UIKit";
import BaseUI from "./BaseUI";

import { _decorator,CCBoolean,Color,EventTouch,find,js,Node, NodeEventType, Sprite, UITransform} from 'cc';
const {ccclass, property} = _decorator;
//无需绑定proxy的在此层。

@ccclass("BaseWin")
export default class BaseWin extends BaseUI{
    @property
    isNeedBg:boolean = true;

    @property({
        tooltip: '窗口的层级；1级窗口0-99 2级100-199 以此类推'
    })

    index:number = 0;

    @property
    _hasBaseInit: boolean = false;
    _isCanClose = true

    @property({
        type: CCBoolean,
    })
    get isCanClose ():boolean{
        return this._isCanClose
    }
    set isCanClose (value:boolean) {
        var nd_close = find('btn_close', this.node);
        if (nd_close) {
            nd_close.active = false;
        }
        this._isCanClose = value;
    }
    
    uiMap:Map<string,Node> = new Map<string,Node>();

    bgMusicName:string = "";

    onLoad () {
        super.onLoad();
        this._baseInit();
    }

    _baseInit () {
        if (!!this._hasBaseInit) {
            return;
        }
        this._hasBaseInit = true;
        this.setIndex();
        this.uiMap = uiKit.uiMap(this.node);
    }

    setIndex (){
        if(this.node && this.index > 0){
            this.node.setSiblingIndex(this.index);
        }
    }       

    close () {
        App.windowMgr.closeUI(this);
    }
};
