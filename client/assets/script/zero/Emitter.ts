import { nullfun } from "../Global";
import { Debug }   from "../utils/Debug";

/**
 * Expose `Emitter`.
 */
class EventCallBack {
    tag:string|Function = ""
    name:string = ""
    cb:Function ;
    errorCb:Function ;
    constructor(tag:string,cb:Function = nullfun,errorCb:Function = nullfun){
        this.tag = tag;
        this.cb = cb;
        this.errorCb = errorCb;
        this.name = cb.toString();
    }
}
export class Emitter {
    _callbacks = {}

    clear() {
        this._callbacks = {};
    }

    /**
     * 监听“event”事件，回调函数存储在this._callbacks 里
     * Listen on the given `event` with `cb`. when occurred error, call errcb.
     *
     * @param {String} event
     * @param {Function} cb
     * @param {Function} errcb
     * @api public
     */
    on(event: string, tag: string|Function, cb?:Function, errcb?: Function) {
        if (tag instanceof Function) {//如果参数只有两个（event，fn）
            errcb = cb;
            cb = tag;
            tag = cb.toString();
        }
        var evcb = new EventCallBack(tag,cb,errcb);
        (this._callbacks[event] = this._callbacks[event] || new Array())
            .push(evcb);
    };


    /**
    * 监听“event”事件，回调函数存储在this._callbacks 里，但是只触发一次
    * Adds an `event` listener that will be invoked a single
    * time then automatically removed.
    *
    * @param {String} event
    * @param {Function} cb
    * @api public
    */
    once(event:string, cb:Function = nullfun) {
        var self = this;
        function on() {
            self.off(event, on);
            cb.apply(this, arguments);
        }
        this.on(event, cb.toString(),on);
    };

    /**
    *  按照条件清空注册事件
    * Remove the given callback for `event` or all
    * registered callbacks.
    *
    * @param {String} event
    * @param {Function} cb
    * @api public
    */
    off (event:string = "", tag?:string | Function , cb?:Function) {
        this._callbacks = this._callbacks || {};

        // 【如果参数数量为0】 清空所有事件
        if (event == "") {
            return;
        }

        // specific event
        var callbacks = this._callbacks[event];
        if (!callbacks) return ;

        // 【如果参数数量为1】 清除指定的event对应的事件
        if (tag == undefined && cb == undefined) {
            delete this._callbacks[event];
            return this;
        }

        // 【如果参数数量为2】 清除指定的tag、fn对应的事件
        if (cb != undefined) {
            cb = tag as Function;
            tag = cb.toString();
        }

        var evcb:EventCallBack;
        for (var i = 0; i < callbacks.length; i++) {
            evcb = callbacks[i];
            if (evcb.tag === tag ||evcb.cb === cb ) {
                callbacks.splice(i, 1);
                break;
            }
        }
    };

    /**
    * 触发对应的注册事件
    * Emit `event` with the given args.
    *
    * @param {String} event
    * @param {Mixed} ...
    * @return {Emitter}
    */

    emit (event:string,...args:any[] ) {        
        var callbacks = this._callbacks[event];
        //var time1 = new Date();
        if (callbacks) {
            callbacks = callbacks.slice(0);
            //Debug.log('callbacks', callbacks.length);
            for (var i = 0, len = callbacks.length; i < len; ++i) {
                try {
                    callbacks[i].cb.apply(this, args);//在this的环境下运行函数： callback[i]（args）
                } catch (e) {
                    var callback = callbacks[i];
                    var name = 'null';
                    if (callback) name = callback.name;
                    Debug.error("Emitter call back error", event, name,e);
                }
            }
            //Debug.log('callbacks cost time', new Date() - time1);
        }

        return this;
    };

    /**
    * handle error with the given args.
    *
    * @param {String} event
    * @param {Mixed} ...
    * @return {Emitter}
    */

    error (event:string,data:any = null) {
        this._callbacks = this._callbacks || {};
        var callbacks = this._callbacks[event];

        if (!data || data.code === undefined) {
            return this;
        }

        if (!callbacks) {
            return this;
        }
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
            if (callbacks[i].errcb) {
                callbacks[i].errcb(data);
            } else {
                Debug.log('emitter error', data);
            }
        }

        return this;
    };

    /**
    *  按条件返回注册事件的回调函数
    * Return array of callbacks for `event`.
    *
    * @param {String} event
    * @return {Array}
    * @api public
    */

    getListeners = function (event:string) :EventCallBack[]{
        this._callbacks = this._callbacks || {};
        return this._callbacks[event] || [EventCallBack];
    };

    /**
    *  检查是否有注册对应的事件回调函数
    * Check if this emitter has `event` handlers.
    *
    * @param {String} event
    * @return {Boolean}
    * @api public
    */

    hasListeners(event:string) {
        return this.getListeners(event).length > 0;
    };
};

