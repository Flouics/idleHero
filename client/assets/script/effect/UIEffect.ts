
import BaseUI from "../zero/BaseUI";

import { _decorator,RichText,Label} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("UIEffect")
export default class UIEffect extends BaseUI {
    
    onLoad () {
        super.onLoad()
    }

    open(param:any){

    }
    
    close() {
        this.node.removeFromParent();
    }
}
