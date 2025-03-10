import App from "../App";
import { lang, nullfun } from "../Global";
import { toolKit } from "../utils/ToolKit";
import BaseWin from "../zero/BaseWin";

import { _decorator,RichText,Label} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("Setting")
export default class Setting extends BaseWin {
    
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
