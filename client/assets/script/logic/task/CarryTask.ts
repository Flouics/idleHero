import { Vec2 } from "cc";
import {TaskBase} from "../TaskBase";
import {Item} from "../Item";

export class CarryTask extends TaskBase {
    startPos:Vec2;
    endPos:Vec2;
    constructor(startPos:Vec2,endPos:Vec2,item:Item){
        super(CarryTask);
        this.startPos = startPos;
        this.endPos = endPos;
        this.id = CarryTask._idIndex;
        CarryTask._idIndex += 1;
        this.type = TaskBase.TASK_VALUE_ENUM.CARRY;
    }
}