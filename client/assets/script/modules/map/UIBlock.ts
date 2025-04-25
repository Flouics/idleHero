import {BaseUI} from "../../zero/BaseUI";
import {Block, BLOCK_VALUE_ENUM} from "../../logic/Block";

import { _decorator, Sprite} from 'cc';
import { Label } from "cc";
import { getMapProxy } from "./MapProxy";
const {ccclass, property} = _decorator;

@ccclass("UIBlock")
export class UIBlock extends BaseUI {
    @property(Sprite)
    spt_floor:Sprite = null;
    @property(Sprite)
    spt_item:Sprite = null;
    @property(Sprite)
    spt_event:Sprite = null;
    @property(Sprite)
    spt_flag:Sprite = null;
    @property(Label)
    lb_desc:Label = null;

    _baseUrl = "texture/map/";
    _logicObj:Block = null;

    loadBlockSpt(){
        var logicObj = this._logicObj
        if(!logicObj){
            return 
        }
        let spt = this.spt_item;
        if(logicObj.checkType(BLOCK_VALUE_ENUM.BLOCK) && logicObj.data_1 > 0){
            this.loadSpt(spt, "block/block_" + logicObj.data_1)
        }else if(logicObj.checkType(BLOCK_VALUE_ENUM.MONSTER_ENTRY)){
            this.loadSpt(spt, "block/entry_1")
        }else{
            this.loadSptEmpty(spt);
        }     
    }

    loadFlagSpt(){
        var logicObj = this._logicObj
        if(!logicObj){
            return 
        }
        let spt = this.spt_flag;
        if(logicObj.data_2 > 0){
            this.loadSpt(spt, "block/flag_" + logicObj.data_2)
        }else{
            this.loadSptEmpty(spt);
        }       
    }

    loadEventSpt(){
        var logicObj = this._logicObj
        if(!logicObj){
            return 
        }
        if(logicObj.event > 0){
            this.loadSpt(this.spt_event, "event/event_" + logicObj.event)
        }else{
            this.loadSptEmpty(this.spt_event);
        }            
    }
    updateUI(){
        var logicObj = this._logicObj
        if(!logicObj){
            return 
        }
        this.updateDataToUI("block.type_data_1"
                        ,{id:logicObj.id,data_1:logicObj.data_1}
                        ,this.loadBlockSpt.bind(this));
        this.updateDataToUI("block.data_2",logicObj.data_2,this.loadFlagSpt.bind(this));
        this.updateDataToUI("block.event",logicObj.event,this.loadEventSpt.bind(this));
        let cost = getMapProxy().digBlockCost;
        this.updateDataToUI("block.digCost",cost,() => {
            this.lb_desc.string = cost.toString();
        })
    }
}