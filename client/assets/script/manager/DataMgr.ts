import { js, resources } from "cc";
import App from "../App";
import BaseClass from "../zero/BaseClass";
import { clone, empty } from "../Global";
import { Debug }   from "../utils/Debug";
import { toolKit } from "../utils/ToolKit";

/**
 * Created by Administrator on 2017/8/17.
 */
var global = window;
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

export default class DataMgr extends BaseClass {
    hasLoad: boolean = false;
    curLoad: number = 0;
    dataPool:{[key:string]:Data} = {}
    fileKeyMap:{[key:string]:string} = {};
    loadTexts = [];

    callback: Function;
    tag: any;
    maxLoad: number;
    init() {

    }

    tryLoadAllTable(cb: Function, tag?: any) {
        if (!!this.hasLoad) {
            return true;
        }
        this.hasLoad = true;
        this.curLoad = 0;
        this.callback = cb;
        this.tag = tag;
        this.maxLoad = this.loadTexts.length;

        var self = this;
        resources.load('data/fileKey', function (err: any, textAsset: any) {
            if (!err) {
                try {        
                    let mapData = textAsset.json       
                    self.fileKeyMap = mapData;   
                    for (var i = 0; i < self.maxLoad; ++i) {
                        self.loadTable(self.loadTexts[i]);
                    }
                    self.loadFileKeyTables();                                          
                } catch (error) {
                    Debug.error("data load failed by name->fileKey.json",error)
                }                
            }
        });
    }

    loadFileKeyTables(){
        var self = this;
        var mapData = self.fileKeyMap;
        for (const key in mapData) {
            if (Object.prototype.hasOwnProperty.call(mapData, key)) {
                const element = mapData[key];
                self.loadTable(element);       
                this.maxLoad += 1;             
            }
        }           
    }

    loadTable(keyName: string) {
        var self = this;
        if (self.dataPool[keyName]) {
            self.onLoadTable(keyName);
            return;
        }
        var fileName = self.fileKeyMap[keyName]
        if (empty(fileName)) {            
            Debug.warn(js.formatStr("cannot find table key: %s",keyName));
            return;
        }
        resources.load('data/' + fileName, function (err: any, textAsset: any) {
            if (!err) {
                try {
                    let mapData = textAsset.json
                    for (const key in mapData) {
                        if (Object.prototype.hasOwnProperty.call(mapData, key)) {
                            const element = mapData[key];
                            self.dataPool[key] = new Data(element);
                        }
                    }
                    self.onLoadTable(keyName);
                } catch (error) {
                    Debug.error("data load failed by name->",keyName,error);
                }                
            }else{
                Debug.error("file load failed by name->",fileName,err);
            }
        });
    };

    onLoadTable(keyName: string) {
        this.curLoad += 1;
        if (this.curLoad == this.maxLoad) {
            for (const key in this.dataPool) {
                const element = this.dataPool[key];
                this.parseDataText(element);
            }
            if (this.callback) {
                this.callback(this.tag);
            }
        }
    };

    // 处理含有匹配表达式的字符
    parseDataText(data:Data){
        var keyList = ["name","desc"];
        var map = data.all();
        var reg = /\{.*?\}/g;   //匹配{}
        var self = this;
        var replaceRule = function(matachStr:string){
            var char = matachStr.slice(1,2);    //char提取
            const str = matachStr.slice(2,-1); //去掉匹配的字符如{},并去掉char
            var ret = "unmatch" + matachStr;
            switch (char) {
                case "s":
                    var conf = self.findById("skill",parseInt(str));
                    ret = conf?.name || "";
                    break;
                case "m":
                    var conf = self.findById("mercenary",parseInt(str));
                    ret = conf?.name || "";
                    break;                      
                case "i":
                    var conf = self.findById("item",parseInt(str));
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

    // 废弃不用，异步太麻烦了。
    async parseData (keyName: string){
        var self = this;
        return new Promise((resolve, reject) => {
            var fileName = self.fileKeyMap[keyName]
            resources.load('data/' + fileName, function (err: any, textAsset: any) {
                if (!err) {
                    try {
                        let mapData = textAsset.json
                        for (const key in mapData) {
                            if (Object.prototype.hasOwnProperty.call(mapData, key)) {
                                const element = mapData[key];
                                self.dataPool[key] = new Data(element);
                            }
                        }
                        self.onLoadTable(keyName);
                        resolve(self.dataPool[keyName])
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
