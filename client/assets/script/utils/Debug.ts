import { assert, error, log, warn, __private } from "cc";

export class Debug {
    static tryObject(obj: any, errorString?: string) {
        try {
            if (!obj){
                throw new Error(errorString);
            }
        } catch (error) {
            throw new Error(errorString + "\n" + error)
        }
    }

    static dump(...args: any[]){
        log("===================  dump  =====================");
        log(args);
        log("================================================")
    }

    static warn(...args: any[]){
        warn(...args);
    }

    static log(...args: any[]){
        log(...args);
    }

    static error(...args: any[]){
        error(...args);
    }
    static assert(condition: boolean, message?: string,...args: __private._cocos_core_platform_debug__StringSubstitution[]){
        return assert(condition,message,...args);
    }
}