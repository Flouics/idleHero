import { AudioSource, director, Node, resources } from "cc";
import App from "../App";
import BaseClass from "../zero/BaseClass";
import { Debug }   from "../utils/Debug";

var basePath = 'music/';
var AUDIO_TYPE = '.mp3';

export default class AudioMgr extends BaseClass {
    _curMusic: any = null;
    _urls: string[] = [];
    _audioClip: any[] = [];
    settingData: any = null;
    private _audioSource: AudioSource;

    
    init() {
        let audioMgr = new Node();
        audioMgr.name = '__audioMgr__';

        //@en add to the scene.
        //@zh 添加节点到场景
        director.getScene().addChild(audioMgr);

        //@en make it as a persistent node, so it won't be destroied when scene change.
        //@zh 标记为常驻节点，这样场景切换的时候就不会被销毁了
        director.addPersistRootNode(audioMgr);

        //@en add AudioSource componrnt to play audios.
        //@zh 添加 AudioSource 组件，用于播放音频。
        this._audioSource = audioMgr.addComponent(AudioSource);

        this.settingData = this.getSettingData();
        if (this.settingData) {
            this.setMusicOpen(this.settingData.isMusicOpen == 1);
            this.setEffectOpen(this.settingData.isEffectOpen == 1);
        } else {
            this.setMusicOpen(true);
            this.setEffectOpen(true);
        }

        return this;
    };

    public get audioSource() {
        return this._audioSource;
    }

    getSettingData() {
        var ret = {
            isMusicOpen: 1,
            isEffectOpen: 1,
            musicVolume: 1,
            effectVolume: 1,
        }
        var localData = App.dbMgr._getJsonItem(App.dbMgr.LOCAL_STORAGE.AUDIO_SETTING);
        if (localData) {
            for (var key in localData) {
                if (ret.hasOwnProperty(key)) {
                    ret[key] = localData[key];
                }
            }
        }
        return ret;
    };

    saveSettingData() {
        App.dbMgr._setJsonItem(App.dbMgr.LOCAL_STORAGE.AUDIO_SETTING, this.settingData);
    };

    getUrl(_name: string) {
        var name = _name.toString()  //+ AUDIO_TYPE;
        if (this._urls[name]) {
            return this._urls[name];
        } else {
            var url = basePath + name;
            this._urls[name] = url;
            return url;
        }
    };

    getAudioClip(url: string, cb?: Function) {
        if (this._audioClip[url]) {
            if (!!cb) cb(this._audioClip[url]);
        } else {
            var self = this;
            resources.load(url, function (error, audioClip) {
                if (!!error) {
                    Debug.warn(url,'load audio failed:', error);
                    if (!!cb) cb(null);
                    return;
                }
                self._audioClip[url] = audioClip;
                if (!!cb) cb(audioClip);
            });
        }
    };

    //背景音乐。单轨
    playMusicUrl(url: string, loop: boolean = true) {
        if (this._curMusic == url) {
            return;
        }
        //todo 检查音乐是否正在播放。
        this._curMusic = url;

        if (this.settingData.isMusicOpen == 0) {
            return;
        }
        var self = this;
        this.getAudioClip(url, function (audioClip: any) {
            self._audioSource.loop = true;
            self._audioSource.clip = audioClip;
            self._audioSource.play();
        });
        return true
    };

    //背景音乐。单轨
    playMusic(name: string, loop: boolean = true) {
        var url = this.getUrl(name);
        return this.playMusicUrl(url, loop);
    };

    stopMusic() {
        this._curMusic = null;
        return this._audioSource.stop();
    };

    //开、关音乐
    setMusicOpen(isOpen: boolean) {
        var self = this;
        this.settingData.isMusicOpen = isOpen ? 1 : 0;
        if (this.settingData.isMusicOpen == 0) {
            setTimeout(function () {
                self.pauseMusic();
            }, 500);
        } else {
            self.rewindMusic();
        }
    };

    //设置音乐的音量
    setMusicVolume(volume: number) {
        return this._audioSource.volume = volume;
    };

    pauseMusic() {
        return this._audioSource.pause();
    };

    resumeMusic() {       
        return this._audioSource.play();
    };

    rewindMusic(loop: boolean = true) {
        //rewindMusic有BUG，不能循环。
        if (this._curMusic) {
            return this.playMusicUrl(this._curMusic, loop);
        }
    };

    //音效。多轨
    playEffectUrl(url: string, loop: boolean = false, cb?: Function) {
        if (this.settingData.isEffectOpen == 0) {
            return;
        }
        if (loop == undefined) loop = false;
        var self = this;
        this.getAudioClip(url, function (audioClip) {
            if(audioClip){
                self._audioSource.loop = loop;
                self._audioSource.clip = audioClip;
                self._audioSource.playOneShot(audioClip);
                if (!!cb) cb(url);
            }
        });
        return true;
    };

    playEffect(name: string, loop?: boolean, volume?: number, cb?: Function) {
        var url = this.getUrl(name);
        return this.playEffectUrl(url, loop, cb);
    };

    stopEffect(audioId?: number) {
        if (audioId == undefined) {
            return;
        }
        return this._audioSource.stop();
    };

    stopAllEffects() {
        //todo
    };

    //开、关音效
    setEffectOpen(isOpen: boolean) {
        var self = this;
        this.settingData.isEffectOpen = isOpen ? 1 : 0;
        if (this.settingData.isEffectOpen == 0) {
            self.stopAllEffects();
        }
    };

    //设置音效的音量
    setEffectsVolume(volume: number) {
        this._audioSource.volume = volume;
    };

    preload(name: string, cb: Function) {
        var url = this.getUrl(name);
        this.getAudioClip(url, cb);
    };

};
