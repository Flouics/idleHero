/*
    用于想滚动地图，又不想用ScrollView
 */
import { _decorator, CCObject, Component, EventTouch, Node, NodeEventType, UITransform, Vec2, Vec3, Widget } from 'cc';
import { Debug }   from '../utils/Debug';
import { nullfun } from '../Global';

const {ccclass, property} = _decorator;

class Item{
    node: Node;
    speedFactor: number;
    originPos: Vec3;
    constructor(node: Node, speedFactor:number) {
        this.node = node;
        this.speedFactor = speedFactor;
        this.originPos = new Vec3(this.node.position.x, this.node.position.y);
    }
    fixPos(pos:Vec2){
        var newPos = new Vec3(pos.x * this.speedFactor, pos.y * this.speedFactor);
        this.node.setPosition(this.originPos.add(newPos));
    }
}
@ccclass("ScrollWorld")
export class ScrollWorld extends Component{
    startPos:Vec2;
    endPos:Vec2;
    recordPos:Vec2;
    isTouching:boolean = false;
    isScrolling:boolean = false;       // 滚动到对应的目标位置
    speed:number = 0;
    cb:Function = null;
    itemPool:Item[] = [];
    @property
    distance_x:number;
    @property
    distance_y:number;    

    onLoad(): void {
        this.node.on(NodeEventType.TOUCH_START,this.onTouchStart.bind(this),this);
        this.node.on(NodeEventType.TOUCH_MOVE,this.onTouchMove.bind(this),this);
        this.node.on(NodeEventType.TOUCH_CANCEL,this.onTouchCancel.bind(this),this);
        this.node.on(NodeEventType.TOUCH_END,this.onTouchEnd.bind(this),this);
        this.distance_x = this.distance_x || this.node.getComponent(UITransform).width;
        this.distance_y = this.distance_y || this.node.getComponent(UITransform).height;
        this.recordPos = new Vec2(0,0);
        this.itemPool = [];
    }

    setSize(distance_x:number, distance_y:number){
        Debug.assert(distance_x && distance_y)
        this.distance_x = distance_y;
        this.distance_y = distance_y;
    }

    addItem(item:Node,speedFactor:number = 1.0){
        this.itemPool.push(new Item(item,speedFactor));
    }

    onTouchStart(event:EventTouch){
        if(this.isScrolling) return false;

        this.startPos = event.getStartLocation();
        this.isTouching = true;
        return true;
    }

    onTouchMove(event:EventTouch){
        var startPos = event.getStartLocation();
        var endPos = event.getLocation();
        var distance = endPos.subtract(startPos).length();
        if(distance > 20){
            event.propagationStopped = true;    //停止事件派发
            this.endPos = endPos;
        }
    }

    onTouchCancel(event:EventTouch){
        return this.onTouchEnd(event);
    }

    onTouchEnd(event:EventTouch){
        var startPos = event.getStartLocation();
        var endPos = event.getLocation();   
        var distance = endPos.subtract(startPos).length();
        if(distance > 10){
            event.propagationStopped = true;    //停止事件派发
            this.endPos = endPos;
        }   
        this.isTouching = false;  
    }
    scrollTo(pos:Vec2,cb:Function = nullfun){
        this.isScrolling = true;
        this.endPos = pos;
        this.cb = cb;
    }
    scrollToX(x:number,cb:Function = nullfun){
        this.isScrolling = true;
        this.endPos = new Vec2(x,this.recordPos.y);
    }
    scrollToY(y:number,cb:Function = nullfun){
        this.isScrolling = true;
        this.endPos = new Vec2(this.recordPos.x,y);
    }

    update(dt: number): void {
        //先只处理x坐标  
        if(this.isScrolling){
            var deltaX = this.endPos.x - this.recordPos.x;
            this.recordPos.x = this.recordPos.x + deltaX * 0.05 
            if(Math.abs(deltaX) > 1){
                this.isScrolling = false;
                if(this.cb){
                    this.cb();
                    this.cb = null;
                }
            }            
        }else{
            if(this.isTouching){
                var deltaX = this.endPos.x - this.startPos.x;
                this.recordPos.x = this.recordPos.x + this.speed * 0.5 + deltaX * 0.5;
                this.startPos = this.endPos;
            }else{
                this.speed = this.speed * 0.98;  // 速度递减
                if(this.speed > 0.1){
                    this.recordPos.x = this.recordPos.x + this.speed;
                }               
            }     
        }
        if(this.recordPos.x > 0){
            this.recordPos.x = 0;
        }else if(this.recordPos.x >  this.distance_x){
            this.recordPos.x = this.distance_x;
        }

        this.itemPool.forEach(item => {
            item.fixPos(this.recordPos);
        })
   
    }
}
