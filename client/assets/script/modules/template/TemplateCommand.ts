

import {App} from "../../App";
import { UICallbacks } from "../../oops/core/gui/layer/Defines";
import {Command} from "../base/Command"
import { UIID_Template } from "./TemplateInit";
import { TemplateProxy }  from "./TemplateProxy";

export class TemplateCommand extends Command{
    proxy:TemplateProxy;

    constructor(){
        super();
        TemplateCommand._instance = this;
    }

    static get instance ():TemplateCommand{
        return App.getInstance(TemplateCommand);
    }

    enter(){
        let uic:UICallbacks = {

        }
        this.showView(UIID_Template.TemplateView,null,uic);
    }
}
