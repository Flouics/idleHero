import {App} from "../App";
import { lang, nullfun } from "../Global";
import { toolKit } from "../utils/ToolKit";

import { _decorator,RichText,Label} from 'cc';
import { BaseUI } from "../zero/BaseUI";
const {ccclass, property} = _decorator;

@ccclass("Setting")
export class Setting extends BaseUI {
    
    onLoad () {
        super.onLoad();
    }

    onClickSave(){
        App.dumpToDb();
    }

    onClickLoad(){
        App.reloadFromDb();
    }
    
    onClickClear(){    
        toolKit.showMsgBox(lang("setting_clear_cache_1"),()=>{
            App.dbMgr.clear();
            toolKit.showTip(lang("setting_clear_cache_2"));
        },nullfun);
    }   
    
    onClickExit(){
        this.close();
        //App.exit();
    }
}
