import BaseClass from "../zero/BaseClass";
import { Debug }   from "../utils/Debug";
export default class AsyncTaskMgr extends BaseClass {
    tasks: Function[] = [];
    lowTasks: Function[] = [];
    taskCount: number = 0;
    maxCount: number = 4;
    timeInterval: number = 0.1;
    timeRef: any ;

    process() {
        var self = this;
        this.timeRef = setTimeout(function () {
            var task: Function|undefined;
            if (self.tasks.length < 1 || (self.taskCount > 10 && self.lowTasks.length > 0)) {
                self.taskCount = 0;
                task = self.lowTasks.shift();
            } else {
                task = self.tasks.shift();
            }
            if (!!task) {
                task();
                self.process();
            } else {
                if (self.tasks.length > 0 || self.lowTasks.length > 0) {
                    Debug.error('AsyncTaskMgr process has a error');
                    self.process();
                }
                self.timeRef = null;
            }
        }, self.timeInterval);
    };

    newAsyncTask(cb: Function, isLow: boolean = false) {
        if (!!cb) {
            if (isLow) {
                this.lowTasks.push(cb);
            } else {
                this.tasks.push(cb);
                if(this.tasks.length > 1000){
                    Debug.log("newAsyncTask: too many task in quque");
                }
            }
            if (!this.timeRef) {
                this.process();
            }
        }
    };

    destory() {
        this.tasks = [];
    };
};


