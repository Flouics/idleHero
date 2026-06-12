
import { Proxy }from "../base/Proxy";
import {TemplateCommand} from "./TemplateCommand";
import { serialize } from "../../utils/Decorator";
import { App } from "../../App";
/*

 */
export class TemplateProxy extends Proxy {
    cmd:TemplateCommand;
    _className = "TemplateProxy";       //防止js被压缩后的问题。

    constructor(){       
        super();
        TemplateProxy._instance = this;
    }

    static get instance ():TemplateProxy{
        return App.getInstance(TemplateProxy);
    }


    dumpPrepare(){
        //导出数据的预处理 *写入本地之前调用*
    }

    reloadPrepare(){
        //加载数据的预处理 *读取本地之后调用*
    }
};

export function getTemplateProxy(): TemplateProxy {
    return TemplateProxy.instance;
}