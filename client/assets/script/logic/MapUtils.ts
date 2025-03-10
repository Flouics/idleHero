import { js, Size, v2, Vec2, Vec3 } from "cc";
import { Debug }   from "../utils/Debug";

/* 
    计算地图的辅助工具，所有方法均为静态。
    // viewPos 基于mapView的地图坐标系，默认描点为(0.5,0.5)
 */
export default class MapUtils {
    static size: Size = new Size(1, 1);   //砖块的尺寸
    static sizeVec2: Vec2 = new Vec2(1, 1);
    static perDis:number = 1;
    static mapSize: Size = new Size(600, 600);   //地图的尺寸
    static margin_x: number = 10;
    static margin_y: number = 10;

    static initBlockData(size: Size) {
        MapUtils.size = size;
        MapUtils.sizeVec2 = new Vec2(size.width, size.height);
        MapUtils.perDis = size.width;
    }

    static initMapData(size: Size,margin_x?:number,margin_y?:number) {
        MapUtils.mapSize = size;
        MapUtils.margin_x = margin_x || MapUtils.margin_x;
        MapUtils.margin_y = margin_y || MapUtils.margin_y;
    }


    static getTilePosByViewPosX(viewPosX: number) {
        var x = (viewPosX % MapUtils.mapSize.width)

        if(x < -MapUtils.mapSize.width/2){
            x = x + MapUtils.mapSize.width
        }else if(x > MapUtils.mapSize.width/2){
            x = x - MapUtils.mapSize.width
        }
        x = Math.round(x / MapUtils.size.width);       
        return x;
    }

    static getTilePosByViewPosY(viewPosY: number) {
        var y = (viewPosY % MapUtils.mapSize.height)

        if(y < -MapUtils.mapSize.height/2){
            y = y + MapUtils.mapSize.height
        }else if(y > MapUtils.mapSize.height/2){
            y = y - MapUtils.mapSize.height
        }
        y = Math.round(y / MapUtils.size.height);   
        return y
    }

    
    static getTilePosByViewPos(viewPos: Vec3|Vec2) {        
        var x = MapUtils.getTilePosByViewPosX(viewPos.x);
        var y = MapUtils.getTilePosByViewPosY(viewPos.y);    
        Debug.log(js.formatStr("viewPos (x:%s,y:%s) -> tilePos (x:%s,y:%s)",viewPos.x,viewPos.y,x,y));        
        return new Vec2(x, y);
    }

    static getViewPosByTilePosX(tilePosX: number) {
        return tilePosX * this.sizeVec2.x;
    }

    static getViewPosByTilePosY(tilePosY: number) {
        return tilePosY * this.sizeVec2.y;;
    }

    static getViewPosByTilePos(tilePos: Vec2) {
        var x = MapUtils.getViewPosByTilePosX(tilePos.x);
        var y = MapUtils.getViewPosByTilePosX(tilePos.y);
        return new Vec2(x, y);
    }

    // 获取最近的坐标点
    static getNearByPos(area: Vec2[],toPos:Vec2):Vec2 {
        var shortest:Vec2 = null;
        var tempDis = 0
        area.forEach((fromPos)=>{
            if (shortest == null || MapUtils.getRouteDis(fromPos,toPos) < tempDis){
                shortest = fromPos
                tempDis = MapUtils.getRouteDis(fromPos,toPos)
            }
        })
        return shortest;
    }
    //@ 获取标准化方向向量
    static getDirNormalizeV2(fromPos: Vec2,toPos:Vec2){
        var ret = toPos.clone();
        ret = ret.subtract(fromPos).normalize();
        return ret;
    }

    static getAngle(fromPos: Vec2,toPos:Vec2){
        var ret = toPos.clone();
        var angle = ret.subtract(fromPos).angle(v2(1,0))    //和水平夹角的弧度
        return angle * 180 / Math.PI; //转成角度
    }

    // 路线上的距离
    static getRouteDis(fromPos: Vec2,toPos:Vec2){
        return Math.abs(toPos.x - fromPos.x) + Math.abs(toPos.y - fromPos.y)
    }
    //直线上的距离
    static getLineDis(fromPos: Vec2,toPos:Vec2){
        var ret = fromPos.clone();
        return ret.subtract(toPos).length();
    }

    static isNearBy(fromPos: Vec2,toPos:Vec2){
        return Math.abs(toPos.x - fromPos.x) <= 1 && Math.abs(toPos.y - fromPos.y) <= 1;
    }
    
    static getKey(pos:Vec2){
        return pos.x + "_" + pos.y;
    }
    // 获取最短路径
    static getRouteList(fromPos: Vec2, toPos: Vec2, checkFun: Function = () => { return true }) {
        var getKey = (pos: Vec2) => { return MapUtils.getKey(pos) }
        var getDis = (pos: Vec2) => { return MapUtils.getRouteDis(pos,toPos) }
        var ret: Vec2[] = []
        var dis = getDis(fromPos)
        if (checkFun(toPos) ){
            if (dis == 0){
                return ret //相同地点不用寻路
            }
        }else 
            if (dis == 1) {
            return ret //相同地点不用寻路
        }

        // A*寻路
        //四个方向
        var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        var shortestRoute: Route = null;
        var openList = []
        var closeList = []
        var filterMap = {}

        class Route {
            key: string;
            dis: number;
            disWeight: number;
            x: number;
            y: number;
            last: Route;
            step: number;
            constructor(pos: Vec2, route?: Route) {
                this.key = getKey(pos);
                this.x = pos.x;
                this.y = pos.y;
                this.last = route;
                this.step = route ? (route.step + 1) : 0;
                this.dis = getDis(pos);
                this.disWeight = getDis(pos) + this.step;
            }
        }
        var isFilter = (pos: Vec2) => { return !!filterMap[getKey(pos)] }
        var getCorners = (route: Route) => {
            var ret = []
            var temp: Vec2;
            var tempRoute: Route;
            dirs.forEach(data => {
                temp = v2(route.x + data[0], route.y + data[1]);
                if (checkFun(temp) && !isFilter(temp)) {
                    filterMap[getKey(temp)] = true;
                    tempRoute = new Route(temp, route)
                    if (shortestRoute == null || tempRoute.dis < shortestRoute.dis) {
                        shortestRoute = tempRoute
                    }
                    ret.push(tempRoute)
                }
            });
            ret.sort((a: any, b: any) => {
                return b.dis - a.dis
            })
            return ret;
        }
        var insertOpenList = (corners: Route[]) => {
            corners.forEach((route: Route) => {
                for (let i = openList.length - 1; i >= 0; i--) {
                    if (route.disWeight < openList[i].dis) {
                        return openList.splice(i - 1, 0, route)
                    }
                }
                return openList.unshift(route)
            })
        }
        var findRoute = (route: Route) => {
            var corners = getCorners(route);
            insertOpenList(corners)
            var curRoute = openList.pop()
            if (!curRoute) {
                //无路可走
                return null;
            }
            var dis = getDis(v2(curRoute.x,curRoute.y))
            if (checkFun(toPos) ){
                if (dis == 0){
                    return curRoute
                }
            }else 
                if (dis == 1) {
                return curRoute
            }
            closeList.push(curRoute);
            return findRoute(curRoute)
        }

        var route = new Route(fromPos, null)
        filterMap[getKey(fromPos)] = true;
        closeList.push(route);
        var result = findRoute(route)
        if (!result) {
            //无路可走,取最短
            result = shortestRoute
        }
        
        while (result) {
            ret.push(v2(result.x, result.y))
            result = result.last
        }
        return ret
    }
}