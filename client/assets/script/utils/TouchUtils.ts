


import { _decorator, Size, Vec2,Component, UITransform, view, Node, Event, EventTouch, NodeEventType, js} from 'cc';
import { Debug }   from './Debug';
const {ccclass, property} = _decorator;

export let TouchUtilsEvent =  {
    click:"TouchUtilsEvent.click"
}

@ccclass("TouchUtils")
export class TouchUtils extends Component {
    _touchStartPos: Vec2 = null;
    _touchId:any = null;    //用于处理多点触摸的
    _deltaPos: Vec2 = Vec2.ZERO.clone();
    _speed: Vec2 = new Vec2(1, 1);
    _lastTouchEventTime: number = 0;
    _touchSize:Size = Size.ZERO.clone();
    _viewSize:Size = Size.ZERO.clone();
    _x_min:number = 0;
    _x_max:number = 0;
    _y_min:number = 0;
    _y_max:number = 0;
    onLoad() {
        //this.init();
    }
    init(touchSize?: Size) {
        this.setSize(touchSize);
        this.addListener();
    }
    setSize(touchSize?:Size){
        if (!touchSize) {
            touchSize = this.node.getComponent(UITransform).contentSize;
        }else{
            this.node.getComponent(UITransform).contentSize = touchSize;
        }
        this._touchSize.width = touchSize.width;
        this._touchSize.height = touchSize.height;
        this._viewSize = this.node.parent?.getComponent(UITransform)?.contentSize;
        this._x_min = -this._touchSize.width/2 + this._viewSize.width/2;
        this._x_max = this._touchSize.width/2 - this._viewSize.width/2;
        this._y_min = -this._touchSize.height/2 + this._viewSize.height/2;
        this._y_max =  this._touchSize.height/2 - this._viewSize.height/2;
    }
    addListener() {
        this.node.on(NodeEventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(NodeEventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        if(this._touchId){
            return;
        }
        this._touchStartPos = event.getLocation();   
        this._touchId = event.getID();
        this._lastTouchEventTime = new Date().getTime();
    }

    onTouchMove(event: EventTouch) {
        if(this._touchId != event.getID()){
            return
        }
        
        var nowTimeStamp = new Date().getTime();
        var dt = (nowTimeStamp - this._lastTouchEventTime)/1000;        
        if(this.calcSpeed(event, dt)){
            this._lastTouchEventTime = nowTimeStamp;
        }   
    }
    onTouchEnd(event: EventTouch) {
        if(this._touchId != event.getID()){
            return
        }
        var nowTimeStamp = new Date().getTime();
        var touchEndPos = event.getLocation();
        var deltaPos = touchEndPos.add(this._touchStartPos.negative());
        if(deltaPos.length() < 20 ){
            this.node.emit(TouchUtilsEvent.click,event);
        }else{
            var dt = (nowTimeStamp - this._lastTouchEventTime)/1000;
            if(this.calcSpeed(event, dt)){
                this._lastTouchEventTime = nowTimeStamp;
            }            
        }
        
    }
    calcSpeed(event: EventTouch, dt: number) {
        if(dt == 0){
            return false;
        }
        var deltaPos = event.getDelta();
        if(deltaPos.length() < 10 ){
            return false; // 防止抖动
        }
        var deltaSpeed = deltaPos.multiplyScalar(1/dt);
        this._speed.x = this._speed.x * 0.5 + deltaSpeed.x * 0.5;
        this._speed.y = this._speed.y * 0.5 + deltaSpeed.y * 0.5;
        return true;
    }

    update(dt: number) {
        if(Math.abs(this._speed.x) < 0.1 && Math.abs(this._speed.y) < 0.1){
            return;
        }
        var deltaPos = this._speed.multiplyScalar(dt);        
        this.updateNodePosition(deltaPos);
        this._speed = this._speed.multiplyScalar(0.95);
    }

    updateNodePosition(deltaPos:Vec2 = Vec2.ZERO.clone()){
        var x = this.node.position.x + deltaPos.x;
        var y = this.node.position.y + deltaPos.y;

        if (x < this._x_min){
            x =  this._x_min;
            this._speed.x = 0;
        }
        if (x > this._x_max){
            x =  this._x_max;
            this._speed.x = 0;
        }
        if (y < this._y_min){
            y =  this._y_min;
            this._speed.y = 0;
        }
        if (y > this._y_max){
            y =  this._y_max;
            this._speed.y = 0;
        }
        
        this.node.setPosition(x, y);
    }

};