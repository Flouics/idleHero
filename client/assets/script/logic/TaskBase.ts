import { Vec2 } from "cc";
import {BaseClass} from "../zero/BaseClass";
var TASK_VALUE_ENUM = {
    IDLE:0,
    DIG:1,
    BUILD:2,
    CARRY:4,
}

export class TaskBase extends BaseClass {
    static TASK_VALUE_ENUM = TASK_VALUE_ENUM;     //属性枚举
    id = 0;
    priority:number = 1;
    index:number = 0;
    static _idIndex = 1;
    type:number = 0;
    tilePos:Vec2 = new Vec2(0,0);
}