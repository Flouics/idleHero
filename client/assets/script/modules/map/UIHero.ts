import { _decorator, Vec2 } from "cc";
import { empty } from "../../Global";
import { Hero } from "../../logic/Hero";
import { STATE_ENUM } from "../../logic/stateMachine/StateMachine";
import { UILive } from "./UILive";

const { ccclass, property } = _decorator;

export enum UIHeroDirection {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
}

export enum UIHeroAnimState {
    IDLE = "idle",
    MOVING = "moving",
    ATTACK = "attack",
    DIG = "dig",
    BUILD = "build",
    DIE = "die",
    STUN = "stun",
}

export const UIHeroEvent = {
    SpineEvent: "UIHero:spine-event",
    SpineComplete: "UIHero:spine-complete",
} as const;

@ccclass("UIHero")
export class UIHero extends UILive {
    _baseUrl = "texture/hero/";
    _logicObj: Hero = null;

    @property({ tooltip: "resources/spine/people/t_people_<id>" })
    defaultPeopleId: number = 1;

    private _curDir: UIHeroDirection = UIHeroDirection.DOWN;
    private _curStateId: number = STATE_ENUM.IDLE;
    private _animNameResolver: ((dir: UIHeroDirection, state: UIHeroAnimState) => string) | null = null;

    reuse(data: any) {
        super.reuse(data);
        this._curDir = UIHeroDirection.LEFT;
        this._curStateId = this._logicObj?.stateMachine.state.id || STATE_ENUM.IDLE;
    }

    /** 外部可覆盖默认命名规则：默认 `${state}_${dir}` */
    setAnimNameResolver(resolver: (dir: UIHeroDirection, state: UIHeroAnimState) => string) {
        this._animNameResolver = resolver;
    }

    /** 重写：hero 用更明确的事件名对外抛出 */
    regSpineEvent() {
        if (!this.sp_role || !this.isValid) return;

        const onAnimFinished = () => {
            if (this.lastAnimName === UIHeroAnimState.MOVING) return;

            if (this.lastAnimName === UIHeroAnimState.DIE) {
                this.destory();
                return;
            }

            const lastAnimName = this.lastAnimName;
            this.lastAnimName = "";

            if (!empty(this.nextAnimName)) {
                const next = this.nextAnimName;
                this.nextAnimName = "";
                this.playAnimation(next);
            } else {
                if (lastAnimName === UIHeroAnimState.ATTACK) {
                    this.playAnimation(UIHeroAnimState.IDLE);
                }
            }
        };

        this._onSpineEvent =
            this._onSpineEvent ||
            ((trackEntry: any, event: any) => {
                this.node.emit(UIHeroEvent.SpineEvent, trackEntry, event);
            });

        this._onSpineComplete =
            this._onSpineComplete ||
            ((trackEntry: any) => {
                if (trackEntry?.trackIndex === 0) onAnimFinished();
                this.node.emit(UIHeroEvent.SpineComplete, trackEntry);
            });

        this.sp_role.setEventListener(this._onSpineEvent);
        this.sp_role.setCompleteListener(this._onSpineComplete);
    }

    private getPeopleId(): number {
        //const id = (this._logicObj?.id ?? this.defaultPeopleId) as number;
        // if (!id || id <= 0) return this.defaultPeopleId;
        return this.defaultPeopleId;
    }

    private stateIdToAnimState(stateId: number): UIHeroAnimState {
        switch (stateId) {
            case STATE_ENUM.IDLE:
                return UIHeroAnimState.IDLE;
            case STATE_ENUM.MOVING:
                return UIHeroAnimState.MOVING;
            case STATE_ENUM.ATTACK:
                return UIHeroAnimState.ATTACK;
            case STATE_ENUM.DIG:
                return UIHeroAnimState.DIG;
            case STATE_ENUM.BUILD:
                return UIHeroAnimState.BUILD;
            case STATE_ENUM.DIE:
                return UIHeroAnimState.DIE;
            case STATE_ENUM.STUN:
                return UIHeroAnimState.STUN;
            default:
                return UIHeroAnimState.IDLE;
        }
    }

    private resolveAnimName(dir: UIHeroDirection, state: UIHeroAnimState): string {
        let ret = "daiji_zheng";
        switch (state) {
            case UIHeroAnimState.MOVING:
                if( dir == UIHeroDirection.LEFT || dir == UIHeroDirection.DOWN){
                    ret = "walk_zheng"
                }else{
                    ret = "walk_bei"
                }                
                break;
            case UIHeroAnimState.DIG:
            case UIHeroAnimState.ATTACK:
            case UIHeroAnimState.BUILD:
                ret = "daji_happy"
                break;
            default:
                if( dir == UIHeroDirection.LEFT || dir == UIHeroDirection.DOWN){
                    ret = "daiji_zheng"
                }else{
                    ret = "daji_bei"
                }  
                break;
        }
        return ret;
    }

    private vec2ToDir(v: Vec2 | null | undefined): UIHeroDirection {
        if (!v) return this._curDir;
        const ax = Math.abs(v.x);
        const ay = Math.abs(v.y);
        if (ax === 0 && ay === 0) return this._curDir;
        if (ax >= ay) return v.x >= 0 ? UIHeroDirection.RIGHT : UIHeroDirection.LEFT;
        return v.y >= 0 ? UIHeroDirection.UP : UIHeroDirection.DOWN;
    }

    /** 根据方向+状态播放对应动画 */
    playByDirectionState(dir: UIHeroDirection, state: UIHeroAnimState) {
        const animName = this.resolveAnimName(dir, state);
        this._curDir = dir;
        this.playAnimation(animName);
    }

    /** 重写：根据状态机播放动画（方向来自当前 dirV2） */
    playAnimationByState(stateId: number) {
        this._curStateId = stateId;
        const state = this.stateIdToAnimState(stateId);
        this.playByDirectionState(this._curDir, state);
    }

    /** 刷新方向并按当前状态重播 */
    updateDirection(dirV2?: Vec2) {
        if (!this._logicObj) return;
        if (!this.sp_role?.node.isValid)return;
        const dir = this.vec2ToDir(dirV2 ?? this._logicObj.dirV2);
        if (dir === this._curDir) return;
        this._curDir = dir;

        if(dir == UIHeroDirection.LEFT || dir == UIHeroDirection.RIGHT){
            this.sp_role.node.scale_x = 1;
        }else{
            this.sp_role.node.scale_x = -1;
        }
    }

    updateUI() {
        const logicObj = this._logicObj;
        if (!logicObj) return;

        const peopleId = this.getPeopleId();
        this.updateDataToUI("hero.type", peopleId, () => {
            // spine 放在 role 节点下，sprite 只保留用于受击闪红等逻辑
            this.resetSpineRole(this.spt_role?.node);
            this.loadLiveSpine(`spine/people/t_people_${peopleId}`);

            this.updateDirection();
            const stateId = logicObj.stateMachine?.state?.id ?? STATE_ENUM.IDLE;
            this.playAnimationByState(stateId);
        });
    }

    update(dt: number) {
        super.update(dt);
        this.updateDirection();
        const stateId = this._logicObj?.stateMachine?.state?.id;
        if (stateId != null && stateId !== this._curStateId) {
            this.playAnimationByState(stateId);
        }
    }
}
