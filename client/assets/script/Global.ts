import {App} from "./App";
import { Proxy }from "./modules/base/Proxy";
import { toolKit } from "./utils/ToolKit";
import { Debug }   from "./utils/Debug";
import { Component, Enum, game, js, Node, Size, Vec2 } from "cc";
import { l10n } from "../../extensions/localization-editor/static/assets/l10n";



//global
export type NodeEx = Node & {
    originX:number,
    originY:number,
    originPos:Vec2,
    loadIndex:number;
}
export let g_event_error_str = "";
export let empty = function(value:any){
    return toolKit.empty(value);
}
export let isValid = function(node:Node | Component){
    return node && node.isValid
}
export let deepCopy = function <T>(obj: T,map = new WeakMap()): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if(map.has(obj as Object)) {
        return map.get(obj as Object);
    }
    
    const copy: any = Array.isArray(obj) ? [] : {};
    map.set(obj as Object, copy);

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopy(obj[key], map);
        }
    }
    
    return copy;
}

export let clone = function <T>(obj: T): T {
    return deepCopy(obj);
}
export let merge = function (src: Object,dest:Object) {
    if (src === null || typeof src !== 'object') {
        Debug.warn('merge table is null or undefined');
        return src;
    }
    if(typeof src !== typeof dest){
        Debug.warn(js.formatStr('merge table Object must be equal.src is %s,dest is %s',typeof src,typeof dest));
        return src;
    }
    if(Array.isArray(src)){     // 数组的处理
        return toolKit.arrayAdd(src as any[], dest as any[]);
    }

    for (let key in dest) {
        if (dest.hasOwnProperty(key)) {
            src[key] = dest[key];
        }
    }
    
    return src;
}

export let getProxy = function (moduleName:string|object): Proxy {
    return  App.moduleMgr.getProxy(moduleName);    
}

export let nullfun = function () {};
export let checkObjKey = function(obj:object,key:any){
    return  Object.prototype.hasOwnProperty.call(obj, key)
}

export let lang = function(key:string,...args:any[]):string {
    if(key == "parseNum"){
        return toolKit.parseNum(args[1]);  
    }
    return js.formatStr(l10n.t(key), ...args);
}
export let i18n = l10n;
export let parseNum = function(num:number):string {
    return toolKit.parseNum(num);
}

export let winSize = new Size(750,1334);
export let getTimeFrame = () =>{
    return game.frameTime / 1000;
} 
export let g = 10;
export let Z_Max_2D = 10;
export let Z_Max_3D = 100;
export let Z_Max_DEFAULT = 10;

const objectIds = new WeakMap();
let idCounter = 1000000;
export let getObjRefId = function(obj:Object){
    if (!objectIds.has(obj)) {
        objectIds.set(obj, ++idCounter); // 为对象分配唯一 ID
      }
      return objectIds.get(obj);
}

//初始全局
export function GlobalInit(){
    window["empty"] = empty;
    window["deepCopy"] = deepCopy;
    window["clone"]  = deepCopy;
    window["getProxy"] = getProxy;
    window["nullfun"] = nullfun;
    window["toolKit"] = toolKit;
    window["dump"] = Debug.dump;
    window["g_event_error_str"] = g_event_error_str;
}

function initProxy(){
    window["command"] = App.moduleMgr.command;   
}

//  有依赖的全局
export function GlobalInitDependency(){
    
    initProxy();
}
