
import {Command} from "../base/Command"
import { TimeProxy } from "./TimeProxy";

export class TimeCommand extends Command{
    proxy:TimeProxy;
    constructor(){
        super();
        TimeCommand._instance = this;
    }
    
}
