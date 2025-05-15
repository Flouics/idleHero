/*
 //要求父节点不能是layout，因为排布会自己处理。
 */

import { nullfun } from "../Global";

import { _decorator,Prefab,ScrollView,Node,NodePool, Layout, UITransform, Button, Component,instantiate, CCBoolean} from 'cc';
import { Debug }   from "../utils/Debug";
const {ccclass, property} = _decorator;
 @ccclass("ListViewSimple")
 export class ListViewSimple extends Component{

    @property(Prefab) //item template to instantiate other items
    itemTemplate = null;
    @property(Node)
    itemNode = null;
    @property(ScrollView)
    scrollView = null;
    @property(Node)
    nd_itemRoot = null;
    @property(CCBoolean)
    isVert = true;

    spawnCount:number =  0;
    spacing:number =  0;
    offset:number =  200;
    isResetTop: boolean = true;
    itemFn:Function = nullfun;
    items:Node[] = [];
    updateTimer:number = 0;
    updateInterval:number = 0;
    lastContentPosY:number = 0;
    lastContentPosX:number = 0;
    totalCount:number = 0;
    data:any = null;

    // use this for initializatio
    onLoad () {
        if(!this.itemTemplate && !!this.itemNode){
            this.itemTemplate = this.itemNode;
            this.itemNode.retained()
            this.itemNode.parent = null;
        }
    };

    onDestroy() {
        if (!!this.itemNode){
            this.itemNode.release()
        }        
    }

    setData (itemFn:Function = nullfun) {
        this.itemFn = itemFn;
        this.items = [];
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0;
        this.initialize();
    };

    initialize (){
        for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
            let item = instantiate(this.itemTemplate);
            item.parent = this.nd_itemRoot;
            item.tag_index = i;
            this.items.push(item);
        }
    };

    updateContent(data:any) {
        if (!data) {
            return;
        }
        var self = this;
        this.data = data;
        this.totalCount = data.length;
        if (this.isVert) {
            this.nd_itemRoot.height = (this.itemTemplate.height + this.spacing) * this.totalCount;
        }else{
            this.nd_itemRoot.width = (this.itemTemplate.width + this.spacing) * this.totalCount;
        }
        
        if (this.isResetTop) {
            this.scrollView.scrollToTop(0.3);
        }
        this.initItems();
    };

    updateData(data:any) {
        if (!data) {
            return;
        }
        this.data = data;
        this.totalCount = data.length;
        if (this.isVert) {
            this.nd_itemRoot.height = (this.itemTemplate.height + this.spacing) * this.totalCount;
        }else{
            this.nd_itemRoot.width = (this.itemTemplate.width + this.spacing) * this.totalCount;
        }
    };

    initItems() {
        for (let i = 0; i < this.spawnCount; ++i) {
            let item = this.items[i];
            this.updateItem(item as Node, i);
        }
    };

    updateItem(item:Node, index:number) {
        var data = this.data[index];
        if (!data) {
            item.active = false;
            return;
        }
        (item as any).tag_index = index;
        var itemUITransform = item.getComponent(UITransform)
        if (this.isVert) {
            item.setPosition(0, - itemUITransform.height * (0.5 + index) - this.spacing * (index + 1));
        }else{
            item.setPosition(0, -itemUITransform.width * (0.5 + index) - this.spacing * (index + 1));
        }
        
        item.active = true;
        if (!!this.itemFn && typeof this.itemFn == 'function') {
            this.itemFn(item, data,index);
        }
    };

    getPositionInView(item:Node) { // get item position in scrollview's node space
        let worldPos = item.parent.getComponent(UITransform).convertToNodeSpaceAR(item.position);
        let viewPos = this.scrollView.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
        return viewPos;
    };

    update(dt:number) {
        if (!this.data) {
            return;
        }
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        if  (this.isVert) {
            this.updateV(dt);
        }else{
            this.updateH(dt);
        }
        
    };
    updateV(dt:number){
        if(!this.scrollView.content){
            return;
        }
        let items = this.items;
        let isDown = this.scrollView.content.position.y < this.lastContentPosY; // scrolling direction
        var buffer_top = this.scrollView.node.getComponent(UITransform).height * (1 - this.scrollView.node.anchorY) + this.offset;
        var buffer_bottom = this.scrollView.node.getComponent(UITransform).height * this.scrollView.node.anchorY + this.offset;
        var itemsHeight = (this.itemTemplate.height + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let item = items[i];
            item.active = this.data[(item as any).tag_index] != undefined;
            let viewPos = this.getPositionInView(item);
            if (isDown) {
                // if away from buffer zone and not reaching top of content
                if (viewPos.y < -buffer_bottom && item.position.y + this.scrollView.node.getComponent(UITransform).height < 0) {
                    let index = (item as any).tag_index - items.length; // update item id
                    this.updateItem(item, index);
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer_top) {
                    let index = (item as any).tag_index + items.length; // update item id
                    this.updateItem(item, index);
                }
            }
        }
        // update lastContentPosY
        this.lastContentPosY = this.scrollView.content.position.y;

    }
    updateH(dt:number){
        if(!this.scrollView.content){
            return;
        }
        let items = this.items;
        let isDown = this.scrollView.content.position.x < this.lastContentPosX; // scrolling direction
        var buffer_top = this.scrollView.node.getComponent(UITransform).width * (1 - this.scrollView.node.anchorX) + this.offset;
        var buffer_bottom = this.scrollView.node.getComponent(UITransform).width * this.scrollView.node.anchorX + this.offset;
        var itemsHeight = (this.itemTemplate.width + this.spacing) * items.length;
        for (let i = 0; i < items.length; ++i) {
            let item = items[i];
            let itemUITransform = item.getComponent(UITransform);
            item.active = this.data[(item as any).tag_index] != undefined;
            let viewPos = this.getPositionInView(item);
            if (isDown) {
                // if away from buffer zone and not reaching top of content
                if (viewPos.y < -buffer_bottom && item.position.y + this.scrollView.node.getComponent(UITransform).width < 0) {
                    let index = (item as any).tag_index - items.length; // update item id
                    this.updateItem(item, index);
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer_top) {
                    let index = (item as any).tag_index + items.length; // update item id
                    this.updateItem(item, index);
                }
            }
        }
        // update lastContentPosY
        this.lastContentPosX = this.scrollView.content.position.x;
    }
};
