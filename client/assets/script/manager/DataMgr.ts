import { js, resources } from "cc";
import {App} from "../App";
import {BaseClass} from "../zero/BaseClass";
import { clone, empty } from "../Global";
import { Debug }   from "../utils/Debug";
import { toolKit } from "../utils/ToolKit";
import { oops } from "../oops/core/Oops";

class Data {
    map: { [key: string]: any } = {};
    list:any[] = [];
    ids: any[] = [];
    constructor(data:Object) {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const element = data[key];
                this.map[element.id] = element;
                this.list.push(element)
                this.ids.push(element.id)
            }
        }
    }

    findBy(attr: any, value: any) {
        var result = [];
        var i: any, item: any;
        for (i in this.map) {
            item = this.map[i];
            if (item[attr] == value) {
                result.push(clone(item));
            }
        }
        return result;
    };

    findById(id: number | string) {
        return clone(this.map[id]);
    };

    random() {
        var length = this.ids.length;
        var rid = this.ids[Math.floor(Math.random() * length)];
        return clone(this.map[rid]);
    };

    getFirst() {
        var rid = this.ids[0];
        return clone(this.map[rid]);
    };

    all() {
        return this.map;
    };
};

export class DataMgr extends BaseClass {
    hasLoad: boolean = false;
    curLoad: number = 0;
    dataPool:{[key:string]:Data} = {}
    fileKeyMap:{[key:string]:string} = {};
    loadTexts = [];

    callback: Function;
    tag: any;
    maxLoad: number;
    constructor(){
        super();
        DataMgr._instance = this;
    }

    static get instance ():DataMgr{
        if( DataMgr._instance){
            return DataMgr._instance as DataMgr;
        }else{
            let instance = new DataMgr();
            return instance
        }
    }
    init() {

    }

    tryLoadAllTable(cb: Function) {
        if (!!this.hasLoad) {
            cb();
            return true;
        }
        this.hasLoad = true;
        this.curLoad = 0;
        this.callback = cb;
        this.maxLoad = this.loadTexts.length;

        oops.res.load('data/fileKey', (err: any, textAsset: any) => {
            if (!err) {
                try {        
                    let mapData = textAsset.json       
                    this.fileKeyMap = mapData;
                    this.curLoad = 0;
                    this.maxLoad = this.loadTexts.length;
                    //如果this.loadTexts有值，优先加载this.loadTexts中的表，加载完就会先进入游戏了。
                    for (var i = 0; i < this.maxLoad; ++i) {
                        this.loadTableFile(this.loadTexts[i]);
                    }
                    
                    this.loadFileKeyTables();                                          
                } catch (error) {
                    Debug.error("data load failed by name->fileKey.json",error)
                }                
            }
        });
    }

    loadFileKeyTables(){
        var mapData = Object.values(toolKit.ArrayToMap(Object.values(this.fileKeyMap)));
        this.curLoad = 0;
        this.maxLoad = mapData.length;
        for (const key in mapData) {
            if (Object.prototype.hasOwnProperty.call(mapData, key)) {
                const element = mapData[key];
                this.loadTableFile(element);             
            }
        }           
    }

    loadTableFile(fileName: string) {
        oops.res.load('data/' + fileName, (err: any, textAsset: any) => {
            if (!err) {
                try {
                    let mapData = textAsset.json
                    for (const key in mapData) {
                        if (Object.prototype.hasOwnProperty.call(mapData, key)) {
                            const element = mapData[key];
                            this.dataPool[key] = new Data(element);
                            this.parseDataText(this.dataPool[key]);
                        }
                    }
                    this.onLoadTableFileCmp();
                } catch (error) {
                    Debug.error("file load failed by name->",fileName,error);
                }                
            }else{
                Debug.error("file load failed by name->",fileName,err);
            }
        });
    };

    onLoadTableFileCmp() {
        this.curLoad += 1;
        if (this.curLoad == this.maxLoad) {
            this.callback && this.callback();
            this.callback = null;
        }
    };

    // 处理含有匹配表达式的字符
    parseDataText(data:Data){
        var keyList = ["name","desc"];
        var map = data.all();
        var reg = /\{.*?\}/g;   //匹配{}
        var replaceRule = (matachStr:string) => {
            var char = matachStr.slice(1,2);    //char提取
            const str = matachStr.slice(2,-1); //去掉匹配的字符如{},并去掉char
            var ret = "unmatch" + matachStr;
            switch (char) {
                case "s":
                    var conf = this.findById("skill",parseInt(str));
                    ret = conf?.name || "";
                    break;
                case "m":
                    var conf = this.findById("mercenary",parseInt(str));
                    ret = conf?.name || "";
                    break;                      
                case "i":
                    var conf = this.findById("item",parseInt(str));
                    ret = conf?.name || "";
                    break;  
                default:
                    break;
            }
            return ret;
        }
        keyList.forEach((key)=>{
            if(map[key] && typeof map[key] == "string"){
                var result = map[key].replace(reg,replaceRule);
                map[key] = result;
            }
        })
    }

    // 废弃不用，异步其实也是promise的形式 
    async parseData (keyName: string){
        return new Promise((resolve, reject) => {
            var fileName = this.fileKeyMap[keyName]
            oops.res.load('data/' + fileName, (err: any, textAsset: any) => {
                if (!err) {
                    try {
                        let mapData = textAsset.json
                        for (const key in mapData) {
                            if (Object.prototype.hasOwnProperty.call(mapData, key)) {
                                const element = mapData[key];
                                this.dataPool[key] = new Data(element);
                                this.parseDataText(this.dataPool[key]);
                            }
                        }
                        resolve(this.dataPool[keyName])
                    } catch (error) {
                        Debug.error("data load failed by name->",keyName);
                        reject(null)
                    }                
                }else{
                    Debug.error("file load failed by name->",fileName);
                    reject(null)
                }
            });
        });
    }

    getTable(keyName: string) {
        return this.dataPool[keyName];
    };

    getTableList(keyName: string) {
        var data = this.getTable(keyName);
        return  data && data.list;
    };

    getTableMap(keyName: string) {
        var data = this.getTable(keyName);
        return  data && data.map;
    };
    
    findById(filename:string,id: number){
        var data = this.getTable(filename)
        if(data){
            return data.findById(id);
        }else{
            return null;
        }
        
    }
};
