import {BaseClass} from "../zero/BaseClass";
import { Debug }   from "../utils/Debug";
export class AsyncTaskMgr extends BaseClass {
    tasks: Function[] = [];
    lowTasks: Function[] = [];
    taskCount: number = 0;
    maxCount: number = 4;
    timeInterval: number = 0.1;
    timeRef: any ;

    constructor(){
        super();
        AsyncTaskMgr._instance = this;
    }

    static get instance ():AsyncTaskMgr{
        if( AsyncTaskMgr._instance){
            return AsyncTaskMgr._instance as AsyncTaskMgr;
        }else{
            let instance = new AsyncTaskMgr();
            return instance
        }
    }

    process() {
        this.timeRef = setTimeout(() => {
            var task: Function|undefined;
            if (this.tasks.length < 1 || (this.taskCount > 10 && this.lowTasks.length > 0)) {
                this.taskCount = 0;
                task = this.lowTasks.shift();
            } else {
                task = this.tasks.shift();
            }
            if (!!task) {
                task();
                this.process();
            } else {
                if (this.tasks.length > 0 || this.lowTasks.length > 0) {
                    Debug.error('AsyncTaskMgr process has a error');
                    this.process();
                }
                this.timeRef = null;
            }
        }, this.timeInterval);
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

    destroy() {
        clearTimeout(this.timeRef);
        this.tasks = [];
    };
};


