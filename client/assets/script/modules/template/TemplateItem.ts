
import { _decorator } from 'cc';
import { BaseUI } from "../../zero/BaseUI";
const {ccclass, property} = _decorator;

@ccclass("TemplateItem")
export class TemplateItem extends BaseUI {
    data:any = null;
    onLoad() {
        super.onLoad();
    }
    setData(data:any) {            
        this.data = data;
    }
}