import { Vec2 } from "cc";
import TaskBase from "../TaskBase";

export default class BuildTask extends TaskBase {
    constructor(x:number,y:number){
        super(BuildTask);
        this.pos = new Vec2(x,y);
        this.id = BuildTask._idIndex;
        BuildTask._idIndex += 1;
        this.type = TaskBase.TASK_VALUE_ENUM.BUILD;
    }
}