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
        Debug.log("===================  dump  =====================");
        Debug.log(args);
        Debug.log("================================================")
    }
    
    static trace(...args: any[]){
        const backLog = console.warn || warn;
        backLog(...args);
    }

    static warn(...args: any[]){
        const backLog = console.warn || warn;
        backLog("warning:",...args);
    }

    static log(...args: any[]){
        const backLog = console.log || log;
        backLog(...args);
    }

    static error(...args: any[]){
        const backLog = console.error || error;
        backLog("error:",...args);
    }
    static assert(condition: boolean, message?: string,...args: __private._cocos_core_platform_debug__StringSubstitution[]){
        const backLog = console.log || log;
        return backLog(condition,"asset:" + message,...args);
    }
}