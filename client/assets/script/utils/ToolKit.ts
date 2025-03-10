import App from "../App";
import BaseClass from "../zero/BaseClass";
import MsgBox from "../common/MsgBox";
import Tips from "../common/Tips";
import { clone, lang, nullfun, RES_WINDOW } from "../Global";
import { assetManager, js, Label, macro, Node, Rect, resources, Sprite, SpriteAtlas, SpriteFrame, sys, Texture2D, UITransform, v2, v3, Vec2, Vec3 } from "cc";
import { Debug }   from "./Debug";
import CCEvent from "../zero/CCEvent";

class ToolKit extends BaseClass {   

    /**
     *获得一个范围的随机值
     * @param min：最小值 
     * @param max:最大值(包含)
     * @return integer
     *
     */
    getRand(min: number, max: number): number {
        var n = max - min;
        return min + Math.round(Math.random() * n);
    };

    arrayShuffle(array: any[]){
        var len = array.length;
        for (let i = 1; i < len; i++) {
            const j = this.getRand(0,i - 1);
            [array[i],array[j]] = [array[j],array[i]];            
        }
        return array;
    }

    /**
     *获得N个不重复的随机成员。
     * @param array
     * @return member
     *
     */
    getRandFromArray<T>(array: T[]): T {
        var len = array.length;
        var randIndex = this.getRand(0,len - 1); 
        return array[randIndex];
    };

    
    /**
     *获得N个不重复的随机成员。
     * @param array
     * @return member
     *
     */
     getRandArrayFromArray<T>(array: T[],count:number = 1): T[] {
        var len = array.length;
        var list = []
        for (var i = 0; i < len; i++) {
            list.push(i);
        }
        this.arrayShuffle(list);

        var ret = [];
        for (var i = 0; i < count; i++) {
            var randIndex = list[i];
            ret.push(array[randIndex]);
        }       
        return ret;
    };

    getRandFromMap<T>(map:Map<any,T>): T {
        let keys = new Array (map.keys());
        var key =this.getRandFromArray(keys);
        return map.get(key);
    };

    getRandArrayFromMap<T>(map:Map<any,T>,count:number = 1): T[] {
        var ret = [];
        var length = map.size;
        if(length <= count){
            map.forEach(data=>{
                ret.splice(this.getRand(0,length -1),0,data);
            })
            return ret;
        }

        var keys = map.keys();
        var list = [];
 
        for (var i = 0; i < length; i++) {
            list.push(keys.next().value);
        }

        this.arrayShuffle(list);        
        for (var i = 0; i < count; i++) {
            var key = list[i];
            ret.push(map.get(key));
        }       
        return ret;
    };

    /**
     *获得一个有权重的成员返回
     * @param weightObj 格式需要是{id:weight}
     *
     */
    getRandKeyFromWeightObj(weightObj: any[]): any {
        var weight_total = 0;
        for (var i in weightObj) {
            weight_total += weightObj[i];
        }
        var randomnum = this.getRand(1, weight_total);
        var cur_weight = 0;
        for (var key in weightObj) {
            cur_weight += weightObj[key];
            if (cur_weight > randomnum) {
                return key;
            }
        }
        return null;
    };
    /**
     *获得两点之间夹角
     * @param pos1 起点  pos2 终点
     * @return 角度
     *
     */
    get2PosAngle<T extends Vec2 | Vec3>(pos1: T , pos2: T): number {
        var rad = 90 - Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * 180 / Math.PI;
        return rad;
    };

    /**
     *获得两点之间距离
     * @param pos1 起点  pos2 终点
     * @return number
     *
     */
    get2PosDistance<T extends Vec2 | Vec3>(pos1: T, pos2: T) :any{
        var v = pos1.add(pos2);
        return v.length();
    };

    /**
     *弧度转向量
     * @param 向量
     * @return Vec2
     *
     */
    getVec2ByRadian(radian:number):Vec2{
        var x = Math.cos(radian);
        var y = Math.sin(radian);
        return new Vec2(x,y);
    }

    /**
     *向量转弧度
     * @param 弧度
     * @return Vec2
     *
     */
     getRadianByVec2(vec2:Vec2):number{
        var radian = Math.atan2(vec2.y,vec2.x);
        return radian
    }

    /**
     *角度转弧度
     * @param 弧度
     * @return Vec2
     *
     */
     getRadianByAngle(angle:number):number{
        var radian = angle * Math.PI / 180 ;
        return radian
    }

    /**
     *弧度转角度
     * @param 角度
     * @return Vec2
     *
     */
     getAngleByRadian(radian:number):number{
        var angle = radian * 180 / Math.PI;
        return angle
    }

    getEulerAngleByVec2(vec2:Vec2){
        var radian = this.getRadianByVec2(vec2);
        var angle = this.getAngleByRadian(radian);
        var eulerAngle = new Vec3(0,0,angle);
        return eulerAngle;
    }

    /**
     *向量旋转N角度
     * @param 向量
     * @param 角度
     * @return Vec2
     *
     */
     getVec2ByVec2Rotate(vec2:Vec2,angle:number):Vec2{
        var radian = this.getRadianByAngle(angle);
        var cos_a = Math.cos(radian);
        var sin_a = Math.sin(radian);
        var x = cos_a * vec2.x - sin_a * vec2.y;
        var y = sin_a * vec2.x + cos_a * vec2.y;
        return new Vec2(x,y);
    }

    //将向量标准化返回axxxayyy形式
    //a,用来表述符号，0 正数，1负数
    parseVec2ToNumNormalize(vec2:Vec2){
        vec2.normalize();  
        var getSignal = (value:number)=>{
            return value > 0 ? 0 : 1000;
        }
        var x = getSignal(vec2.x) + Math.floor(Math.abs(vec2.x) * 1000)
        var y = getSignal(vec2.y) + Math.floor(Math.abs(vec2.y) * 1000)
        var ret =  x * 10000 + y;
        return ret;
    }

    //将xxxyyy形式返回成标准向量
    parseNumToVec2Normalize(num:number){
        var parseSignal = (value:number)=>{
            if(value > 1){
                value = -(value - 1)
            }
            return value;
        }
        var x = parseSignal(Math.floor(num / 10000)/1000);
        var y = parseSignal((num % 10000) / 1000);
        
        return new Vec2(x,y);
    }

    /**
     *节点遍历查找
     * @param root 根节点  name 要查找的节点名
     * @return 节点
     *
     */
    getChildByName(root: Node, name: string) {
        if (!root) return null;

        var nd_find = root.getChildByName(name);
        if (nd_find) {
            return nd_find;
        }
        var children = root.children;
        var length = children.length;
        for (var i = 0; i < length; i++) {
            var child = children[i];
            var nd_find = this.getChildByName(child, name);
            if (nd_find)
                return nd_find;
        }
    };
    
    getChild(root: Node, name: string){
        return this.getChildByName(root,name);
    }

    // 判断是否是数字
    isNum(s: any) {
        if (typeof s == 'number')
            return true;
        if (typeof s != 'string')
            return false;

        if (s != null && s.length > 0) {
            var r, re;
            re = /-?\d*\.?\d*/i; //\d表示数字,*表示匹配多个数字
            r = s.match(re);
            return (r == s) ? true : false;
        }
        return false;
    };
    
    //精确到小数点N位。
    round(number: number, precision: number) {
        var inter = Math.floor(number);
        var decimal = number - inter;
        return inter + Math.round(decimal * Math.pow(10, precision)) / Math.pow(10, precision);
    };


    /*
     * 移除arrar 中val的值
     * @param arrar val 
     */
    arrayRemove(array: any[], val: number) {
        var index = array.indexOf(val);
        if (index > -1) {
            array.splice(index, 1);
        }
    };

    /*
     * 两个集合的差集
     * @param arrar removearr 
     */
    arrayMinus(_a: any[], _b: any[]) {
        var a = _a.slice(0);
        var b = _b;
        for (var i = 0; i < b.length; i++) {
            this.arrayRemove(a, b[i]);
        }
        return a;
    };

    arrayAdd(_a: any[], _b: any[]) {
        var a = _a.slice(0);
        var b = _b;
        for (var i = 0; i < b.length; i++) {
            if (a.indexOf(b[i]) == -1) {
                a.push(b[i])
            }
        }
        return a;
    };

    /**
     * 将数组按照Ｎ个进行组合分组 不过滤重复的元素。
     * @param array
     * @constructor
     */

    arrayGroup(array: any[], count_num: number) {
        function loop_get(list: any[], count: number, index: number):any[] {
            if (count < count_num) {
                var list_ret = [], ret;
                for (var k = index, len = array.length; k < len; k++) {
                    var list_slice = list.slice(0); //复制
                    list_slice.push(array[k]);
                    ret = loop_get(list_slice, count + 1, k + 1);
                    list_ret = list_ret.concat(ret);
                }
                return list_ret;
            } else {
                return list;
            }
        };
        var ret_list = [];
        for (var i = 0, len = array.length; i < len; i++) {
            if (i < len - count_num + 1) {
                ret_list = ret_list.concat(loop_get([array[i]], 1, i + 1));
            }
        }
        return ret_list;
    };

    /*
     * 获得头像自适应缩放
     * @param pic大小  framsize框大小 scale 指定缩放大小
     */
    getHeadScale(picSize:any, framSize:any, scale:number) {
        var wid = picSize.width;
        var hei = picSize.height;
        if (wid > hei) {
            return (picSize.width / framSize.width) * scale;
        } else {
            return (picSize.height / framSize.height) * scale;
        }
        ;
    }

    /*
     * 格式化数字
     * @param
     */
    formatNumber(number:number, maxlen:number) {
        if (0 == number) {
            return 0;
        }
        var tempNumber:string = number.toString();
        for (var i = number.toString().length; i < maxlen; i++) {
            tempNumber = "0" + tempNumber;
        }

        return Number(tempNumber);
    };

    /*
     * 格式化昵称
     * @param
     */
    formatNick(nick:string, maxlen:number) {
        if (!nick || 0 >= nick.length) return "";

        var newNick = nick;
        var len = (maxlen) ? maxlen : 5;
        if (len < nick.length) {
            newNick = nick.substring(0, len);
            newNick = newNick + ".."
        }

        return newNick;
    };

    /*
     * 截图
     * @param 
     * 返回存储截图路径
     */
    screenShot(callBack?:Function) {
        this.createScreenShotTexture(function (texture:Texture2D) {
            if(!!callBack)  callBack()
        });
    };

    createScreenShotTexture(cb:Function) {
        //ts 报错比较多，有需要在做。
        cb()
    };

    //简单的tip提示
    showTip(content:string) {
        App.windowMgr.open(RES_WINDOW.tips, function (uiNode:Node) {
            var tip = uiNode.getComponent(Tips);
            if (tip) {
                tip.open(content);
            }
        });
    };

    showMsgBox(content:string,cb_comfirm:Function = nullfun,cb_cancel:Function=nullfun) {
        App.windowMgr.open(RES_WINDOW.msgBox,function(uiNode:Node){
            var msgBox = uiNode.getComponent(MsgBox);
            if (msgBox){
                msgBox.open(content,cb_comfirm,cb_cancel);
            }
        });
    };

    //从网络获取图片
    loadWebImg(url:string, spt:Sprite) {
        var reg = /\?/;
        var url_2 = reg.test(url) ? url + '&temp=temp.jpg' : url + '?temp=temp.jpg';
        //var url_2 = url;
        assetManager.loadRemote(url_2, function (error, texture) {
            if (!error) {
                if (typeof texture == 'object') {
                    const spriteFrame = new SpriteFrame();
                    spriteFrame.texture = texture as any;
                    spt.spriteFrame = spriteFrame;
                }
            } else {
                Debug.error("loadWebImg failed",url);
            }
        });
    };

    //获取数字
    stringToNum(s:string) {
        if (typeof s == 'number') {
            return s;
        }
        s = s.toString();
        var reg = /-?\d*\.?\d*/i;
        return Number(s.match(reg));
    };

    //获取target位于node父节点坐标系中的坐标。
    //主要用于将node在自己坐标系中，将坐标改成为target的坐标。
    getTargetPos(node:Node, target:Node) {
        if (!node || !target) {
            Debug.error('target or node is null.');
            return v2(0, 0);
        }
        if (!node.parent || !target.parent) {
            Debug.error('parent of target or node is null.');
            return v2(0, 0);
        }

        var worldSpacePos = target.parent.getComponent(UITransform).convertToNodeSpaceAR(target.getPosition());
        var nodeSpacePos = node.parent.getComponent(UITransform).convertToNodeSpaceAR(worldSpacePos);
        return nodeSpacePos;
    };

    //label上数值累加到目标值
    labelAccumulator(label:Label, formateStr:string = null, startValue:number = 0, finalValue:number = 0, delta?:number, cb?:Function) {
        if (!delta || delta == 0) {
            if (delta) {
                Debug.warn("labelAccumulator : deltadelta is 0.");
            }
            delta = 1;
        }

        if (!formateStr || formateStr === "") {
            formateStr = "%s";
        }

        if (label.accumulatorFunction) {
            label.unschedule(label.accumulatorFunction);//先取消原调度。
            label.accumulatorFunction = null;
        }

        label.accumulatorFunction = function () {
            startValue += delta;
            if ((startValue + delta) <= finalValue) {
                label.string = js.formatStr(formateStr, startValue);
            } else {
                startValue = finalValue;
                label.string = js.formatStr(formateStr, startValue);
                label.unschedule(label.accumulatorFunction);
                label.accumulatorFunction = undefined;
            }
            if (cb && typeof cb === "function") {
                cb(startValue);
            }
        };
        label.schedule(label.accumulatorFunction, 0.1, macro.REPEAT_FOREVER);
    };


    //加载图集
    loadResSpriteAtlas(res_url:string, name:string, spt:Sprite, cb?:Function) {
        if (!res_url) return;
        resources.load(res_url, SpriteAtlas, function (err, atlas) {
            if (!err && spt && spt.node) {
                var spriteFrame = atlas.getSpriteFrame(name);
                spt.spriteFrame = spriteFrame
                if (!!cb) cb(err, spriteFrame);
            }
        });
    };

    //json解析
    parseJson(json_str:string) {
        var ret = null;
        try {
            ret = JSON.parse(json_str);
        } catch (e) {
            Debug.error("could not parseJson:", json_str);
        }

        return ret;
    };

    //地址解析
    getQueryString(name:string) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substring(1).match(reg);
        if (r != null) return r[2];
        return null;
    };

    //地址解析
    getURLString(url:string, name:string) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var index = url.indexOf('?');
        if (index == -1) {
            return null;
        }
        var r = url.substring(index + 1).match(reg);
        if (r != null) return r[2];
        return null;
    };

    //打开新地址。
    openUrl(url:string) {
        if (!url) return;
        return sys.openURL(url);
    };

    //剪贴板功能
    copyTextToClipboard(content:string) {
        //todo 
        return false;
    };

    empty(value:any){
        if(value == null || value == undefined){
            return true
        }
        var typeStr = typeof(value)
        if(typeStr == "string"){
            return value == ""
        }else if (typeStr == "boolean"){
            return true;
        }else if (typeStr == "object"){
            return Object.keys(value).length == 0;
        }else{
            return !value
        }
    };

    limitNum(value:number,min?:number,max?:number){
        if(min && value < min){
            value = min;
        }
        if(max && value > max){
            value = max;
        }
        return value;
    };

    /*     
    保持队列索引始终在范围内
    超出范围的，会重新修正 如-1 ,则在在队尾
    */
    queueIndex(index:number,len:number){
        var i = index % len;
        return (i + len - 1) % len  + 1
    }

    tableToMap(t:Array<any>,key:string="id",parseFunc:Function=nullfun):Map<any,any>{
        var map = new Map();
        if(this.empty(t)){
            return map;
        };
        for(var i=0;i<t.length;i++){
            let v = t[i];
            if (v instanceof Object){
                map[v[key]] = v
            }else{
                map[v] = v
            }
            parseFunc(map,v,key);
        }
        return map;
    }

    ArrayToMap(t:Array<any>,key:string="id",parseFunc:Function=nullfun):Map<any,any>{
       return this.tableToMap(t,key,parseFunc);
    }

    logBase(x:number,base:number):number {
        return x == 0 ? 0 : Math.log10(x)/Math.log10(base);
    }

    parseNum(value:number):string{
        var unitNum = 10000;      // 进制单位
        if(Math.abs(value) < unitNum){
            return "" + value;
        }
        var index = Math.floor(this.logBase(Math.abs(value),unitNum));
        var baseNum = Math.pow(unitNum,this.limitNum(index,0));
        var num:any = value / baseNum;
        var precision = 4;
        if (num == Math.floor(num)){
            num = num.toPrecision(precision)      // 整数
        }else{
            num = num.toPrecision(precision -1)   // 含有小数点
        }
        return "" + num + lang("common.unit_" + index);
    }

    cacAttr(_data:number):any{
        var ret = {value:0,percent:0}
        if (!_data){
            return ret;
        }
        var sign = _data < 0 ? -1 : 1;
        var data = Math.abs(_data);
        var value = Math.floor(data / 10) * sign;
        var type = data % 10;
        if(type == 1){
            ret.value = value;
        }else if(type == 2){
            ret.percent = value;
        }else{
            ret.value = value;
        }
        return ret;
    }
    
    loadSptEx(spt: Sprite, res_url: string = null, cb?: Function) {
        if (!res_url) return;
        resources.load(res_url + "/spriteFrame", SpriteFrame, function (err, spriteFrame) {
            if (!err && spt && spt.node) {
                spt.spriteFrame = spriteFrame ;
                if (!!cb) cb( spriteFrame);
            }else{
                Debug.log(js.formatStr("loadSptEx error,error->%s spt->%s", err,spt));
            }
            spt.node.archor
        });
    };
    
    //向量沿着某个点旋转角度
    rotateVectorByPoint(v:Vec2, p:Vec2, angle:number) {
        // 将角度转换为弧度
        const rad = (Math.PI / 180) * angle;
    
        // 步骤 1：平移到旋转中心
        const translatedX = v.x - p.x;
        const translatedY = v.y - p.y;
    
        // 步骤 2：绕原点旋转
        const rotatedX = translatedX * Math.cos(rad) - translatedY * Math.sin(rad);
        const rotatedY = translatedX * Math.sin(rad) + translatedY * Math.cos(rad);
    
        // 步骤 3：平移回原坐标系
        const finalX = rotatedX + p.x;
        const finalY = rotatedY + p.y;
    
        return new Vec2(finalX,finalY);
    }

    getRectCorners(rect:Rect, angle:number,anchorPoint:Vec2 = v2(0.5,0.5)){
            var x = rect.x;
            var y = rect.y;
            var w = rect.width;
            var h = rect.height;
             
            // 矩形四个顶点坐标
            var axis =  [
                { x: x - w * anchorPoint.x, y: y - h * anchorPoint.y}, // 左下角
                { x: x + w * (1 - anchorPoint.x), y: y - h * anchorPoint.y }, // 右下角
                { x: x - w * anchorPoint.x, y: y + h * (1 - anchorPoint.y) }, // 左上角
                { x: x + w * (1 - anchorPoint.x), y: y + h * (1 - anchorPoint.y) }  // 右上角
            ];

            //旋转
            var self = this;
            axis.forEach((v,i)=>{
                axis[i] = self.rotateVectorByPoint(v2(v.x,v.y),v2(x,y),angle);
            })

            return axis;
    }

    checkRectIntersect(rect_1:Rect,rect_2:Rect,angel_1:number,angel_2:number,anchorPoint_1?:Vec2,anchorPoint_2?:Vec2){   
        var self = this;  
        function project(points:any, axis:any) {
            // 将点投影到轴上，获得投影的最小值和最大值
            let min = points[0].x * axis.x + points[0].y * axis.y;
            let max = min;
            for (let i = 1; i < points.length; i++) {
                const proj = points[i].x * axis.x + points[i].y * axis.y;
                if (proj < min) min = proj;
                if (proj > max) max = proj;
            }
            return { min, max };
        }
        
        function overlap(proj1:any, proj2:any) {
            // 检查两个投影区间是否重叠
            return !(proj1.max < proj2.min || proj2.max < proj1.min);
        }
        
        function rectAnglesIntersect(rect_1:Rect,rect_2:Rect,angel_1:number,angel_2:number,anchorPoint_1?:Vec2,anchorPoint_2?:Vec2) {
            // 获取两个矩形的四个顶点
            const rectCorners_1 = self.getRectCorners(rect_1, angel_1,anchorPoint_1);
            const rectCorners_2 = self.getRectCorners(rect_2, angel_2,anchorPoint_2);
            
            // 定义4个分离轴（每条边的法向量）
            const axes = [
                { x: rectCorners_1[1].x - rectCorners_1[0].x, y: rectCorners_1[1].y - rectCorners_1[0].y },
                { x: rectCorners_1[3].x - rectCorners_1[0].x, y: rectCorners_1[3].y - rectCorners_1[0].y },
                { x: rectCorners_2[1].x - rectCorners_2[0].x, y: rectCorners_2[1].y - rectCorners_2[0].y },
                { x: rectCorners_2[3].x - rectCorners_2[0].x, y: rectCorners_2[3].y - rectCorners_2[0].y }
            ];
            
            // 归一化每个轴
            axes.forEach(axis => {
                const length = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
                axis.x /= length;
                axis.y /= length;
            });
            
            // 检查每个轴上的投影是否重叠
            for (let axis of axes) {
                const proj1 = project(rectCorners_1, axis);
                const proj2 = project(rectCorners_2, axis);
                if (!overlap(proj1, proj2)) {
                    return false;  // 如果发现一个轴上没有重叠，则矩形不相交
                }
            }
            return true;  // 所有轴上都有重叠，则矩形相交
        }

        return rectAnglesIntersect(rect_1,rect_2,angel_1,angel_2,anchorPoint_1,anchorPoint_2);        
    }
}



export var toolKit = new ToolKit(ToolKit);
