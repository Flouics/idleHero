import {App} from "../App";
import {BaseClass} from "../zero/BaseClass";
import { assetManager, instantiate, js, Label, macro, Node, Prefab, resources, Sprite, SpriteAtlas, SpriteFrame, sys, Texture2D, Tween, tween, UITransform, v2, v3, Vec3 } from "cc";
import { Debug }   from "./Debug";
import { empty, NodeEx } from "../Global";


class UIKit extends BaseClass {

    uiMap(root:Node,map = new Map()):Map<string,Node>{
        if (!root) return map;

        map[root.name] = root;
        var children = root.children;
        var length = children.length;
        for (var i = 0; i < length; i++) {
            var child = children[i];
            this.uiMap(child, map);
        }
        return map;
    }
    

    isValid(ui:Node){
        return ui && ui.isValid;
    }

    setScale(node:Node, scale:number){
        node.setScale(new Vec3(scale, scale, scale));
    }

    setLayerLevelByParent(parent:Node){
        var layerLevel = parent.layer;
        var children = parent.children;
        var self = this;
        children.forEach( (child) => {
            self.setLayerLevel(child,layerLevel);
        });
    }

    setLayerLevel(node:Node,layerLevel:number){
        node.layer = layerLevel;
        var children = node.children;
        var self = this;
        children.forEach( (child) => {
            self.setLayerLevel(child,layerLevel);
        });
    }

    setMercenaryImg(spt:Sprite,mercenaryId:number,cb?: Function){
        var res_url = "texture/mercenary/" + mercenaryId;
        var self = this;           
        spt.node.active = false;  
        var loadSptEx = function(spt: Sprite, res_url: string = null, cb?: Function) {
            resources.load(res_url + "/spriteFrame", SpriteFrame, function (err, spriteFrame) {
                if (!spt?.node) return; 
                spt.node.active = true;  
                if (!err && spt && spt.node) {
                    spt.spriteFrame = spriteFrame ;
                    if (!!cb) cb();
                }else{
                    Debug.log(js.formatStr("loadSptEx error,error->%s spt->%s", err,spt));
                }
            });
        };

        loadSptEx(spt,res_url,cb);
    }

    setMonsterImg(spt:Sprite,monsterId:number,cb?: Function){
        var res_url = "texture/monster/" + monsterId;
        var self = this;     
        spt.node.active = false;        
        var loadSptEx = function(spt: Sprite, res_url: string = null, cb?: Function) {
            resources.load(res_url + "/spriteFrame", SpriteFrame, function (err, spriteFrame) {
                spt.node.active = true;  
                if (!err && spt && spt.node) {
                    spt.spriteFrame = spriteFrame ;
                    if (!!cb) cb();
                }else{
                    Debug.log(js.formatStr("loadSptEx error,error->%s spt->%s", err,spt));
                }
            });
        };

        loadSptEx(spt,res_url,cb);
    }

    getDeltaAngle(angle_old:number,angle_new:number){
        var deltaAngle = angle_new - angle_old;
        if (Math.abs(deltaAngle) > 180){
            if(deltaAngle > 0){
                deltaAngle += -360;
            }else{
                deltaAngle += 360;
            }
        }
        
        return deltaAngle;
    }

    loadSpt(spt: Sprite, res_url: string = null, cb?: Function) {
        if (!res_url) return;
        spt.node.active = false;
        resources.load(res_url + "/spriteFrame", SpriteFrame, function (err, spriteFrame) {
            if (!err && spt && spt.node) {
                spt.spriteFrame = spriteFrame;
                spt.node.active = true;
                if (!!cb) cb( spriteFrame);
            }else{
                Debug.log(js.formatStr("UIKit loadSpt error,error->%s spt->%s", err,spt));
            }
        });
    };   

    loadPrefab(pb_url:string, cb?:Function){        
        resources.load(pb_url, Prefab, function (err: any, prefab: any) {
            if (err) {
                Debug.warn(pb_url, err);
            }else{
                let node = instantiate(prefab);
                if(!!cb) cb(node);
            }
        })
    }

    repeatUpDown(_node:Node,offsetY:number = 30,durationTime:number = 1.0,delayTime:number = 0){
        if(!_node){
            return;
        }
        let node = _node as NodeEx;
        node.originY = node.originY || node.position.y;
       
        Tween.stopAllByTarget(node);
        node.setPosition(node.position.x,node.originY,node.position.z);

        tween(node)
        .by(durationTime,
            {position:new Vec3(0,offsetY,0)})
        .by(durationTime,
            { position:new Vec3(0,-offsetY,0)})
        .delay(delayTime)
        .union()
        .repeatForever()
        .start();
    }
};

export var uiKit = new UIKit();
