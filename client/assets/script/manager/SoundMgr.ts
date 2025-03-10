/**
 * Created by Administrator on 2017/8/5.
 * 游戏声音单独一个类，方便后续游戏扩展。
 */

import App from "../App";
import BaseClass from "../zero/BaseClass";
import { toolKit } from "../utils/ToolKit";


var CommonSoundKeys = {
    box_destroy: 'box_destroy',
    get_buff: ['buff_0'],
    bullet_0: 'bullet_0',
    button: 'button',
    player_die: 'player_die',
    settle: 'settle',
};

export default class SoundMgr extends BaseClass {
    CommonSoundKeys = CommonSoundKeys;
    
    /**
     * 播放通用音效
     */
    playSound(name: string, isLoop: boolean = false) {
        if (Array.isArray(name)) {
            name = toolKit.getRandFromArray(name);
        }

        if (name) {
            return App.audioMgr.playEffect(name, isLoop);
        } else {
            return null;
        }
    };
};
