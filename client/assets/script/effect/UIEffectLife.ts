
import UIEffect from "./UIEffect";

import { _decorator, Color, Label, Sprite, tween, UIOpacity, UITransform, Vec3} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("UIEffectLife")
export default class UIEffectLife extends UIEffect {
    @property(Label)
    lb_content:Label = null;
    
    onLoad () {
        super.onLoad()
    }

    open (param:any) {
        this.lb_content.string = "" + param.value;
        if (param.value > 0){
            this.lb_content.color = Color.GREEN;
        }else{
            this.lb_content.color = Color.RED;
        }
        var self = this;
        tween(this.node)
        .by(0.6,
            {position:new Vec3(0,80,0)})
        .by(0.3,
            { position:new Vec3(0,80,0)},{
                onUpdate(taget:Node,ratio:number){
                    self.node.getComponent(UIOpacity).opacity = 255 - 255 * ratio;
                }
            })
        .call(() => {                
            self.close();
        }).start();
    }

    close() {
        this.node.removeFromParent();
    }
}
