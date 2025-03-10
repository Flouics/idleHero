import BaseUI from "../../zero/BaseUI";
import Block from "../../logic/Block";

import { _decorator, Sprite} from 'cc';
const {ccclass, property} = _decorator;

@ccclass("UIBlock")
export default class UIBlock extends BaseUI {
    @property(Sprite)
    spt_floor:Sprite = null;
    @property(Sprite)
    spt_item:Sprite = null;
    @property(Sprite)
    spt_event:Sprite = null;
    @property(Sprite)
    spt_flag:Sprite = null;

    _baseUrl = "texture/map/";
    _logicObj:Block = null;
    updateUI(){
        var self = this;
        var logicObj = this._logicObj
        if(!logicObj){
            return 
        }
        var loadBlockSpt = function(){
            let spt = self.spt_item;
            if(logicObj.checkType(Block.BLOCK_VALUE_ENUM.BLOCK) && logicObj.data_1 > 0){
                self.loadSpt(spt, "block/block_" + logicObj.data_1)
            }else{
                spt.spriteFrame = null;
            }       
        }
        this.updateDataToUI("block.type",logicObj.id,()=>{
            loadBlockSpt()           
        })

        this.updateDataToUI("block.data_1",logicObj.data_1,loadBlockSpt)

        this.updateDataToUI("block.data_2",logicObj.data_2,()=>{
            let spt = self.spt_flag;
            if(logicObj.data_2 > 0){
                self.loadSpt(spt, "block/flag_" + logicObj.data_2)
            }else{
                spt.spriteFrame = null;
            }           
        })

        this.updateDataToUI("block.event",logicObj.event,()=>{
            if(logicObj.event > 0){
                self.loadSpt(self.spt_event, "event/event_" + logicObj.event)
            }else{
                self.spt_event.spriteFrame = null;
            }           
        })
    }
}