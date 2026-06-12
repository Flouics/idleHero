import { App } from "../../App";
import { BaseUI } from "../../zero/BaseUI";

import { _decorator, Color, Node, Sprite, tween, Tween, UITransform, Vec2, Vec3, sp } from "cc";
import { STATE_ENUM } from "../../logic/stateMachine/StateMachine";
import { Debug } from "../../utils/Debug";
import { empty } from "../../Global";
import { toolKit } from "../../utils/ToolKit";
import { uiKit } from "../../utils/UIKit";
import { Live } from "../../logic/Live";
import { LogicUI } from "../../zero/LogicUI";
import { v3 } from "cc";

const { ccclass, property } = _decorator;

const SKELETAL_ANIMATION_NAME = {
    ATTACK: "attack",
    IDLE: "idle",
    MOVING: "run",
    DIE: "die",
    REVIVE: "revive",
    SKILL: "attack",
};

@ccclass("UILive")
export class UILive extends LogicUI {
    static SKELETAL_ANIMATION_NAME = SKELETAL_ANIMATION_NAME;
    _logicObj: Live = null;

    @property(Sprite)
    spt_role: Sprite = null;

    /** spine 组件（sp.Skeleton） */
    sp_role: sp.Skeleton = null;

    private _spineResPath: string = "";
    private _spineReady: boolean = false;

    lastAnimName: string = "";
    nextAnimName: string = "";

    protected _onSpineEvent?: (trackEntry: any, event: any) => void;
    protected _onSpineComplete?: (trackEntry: any) => void;

    _baseUrl = "texture/hero/";
    _moveAction: Tween<Node>;
    _beAtkedAction: Tween<Node>;
    _directAction: Tween<Node>;

    reuse(data: any) {
        this.lastAnimName = "";
        this.nextAnimName = "";
        this._spineResPath = "";
        this._spineReady = false;
        this._onSpineEvent = undefined;
        this._onSpineComplete = undefined;
        this.stopBeAtkedAction();

        if (this.sp_role?.node?.isValid) {
            this.sp_role.node.destroy();
        }
        this.sp_role = null;
    }

    /** 创建 spine 节点，并把 sp_role 挂在该节点上 */
    resetSpineRole(actorNode: Node) {
        if (!actorNode?.isValid) return;

        if (!this.sp_role?.node?.isValid) {
            const node = new Node("sp_role");
            actorNode.addChild(node);
            if (this.spt_role) this.spt_role.spriteFrame = null;
            this.spt_role.node.scale = v3(0.3,0.3,0.3)
            this.sp_role = node.addComponent(sp.Skeleton);
        }

        this.lastAnimName = "";
        this.nextAnimName = "";
    }

    /**
     * 加载 spine 资源
     * @param resPath 例如：`spine/people/t_people_1`
     */
    loadLiveSpine(resPath: string, cb?: (skeleton: sp.Skeleton | null) => void) {
        if (!this.sp_role?.node?.isValid) {
            cb?.(null);
            return;
        }
        if (empty(resPath)) {
            cb?.(null);
            return;
        }
        if (this._spineResPath === resPath && this._spineReady) {
            cb?.(this.sp_role);
            return;
        }

        this._spineResPath = resPath;
        this._spineReady = false;

        this.load(resPath, sp.SkeletonData, (err, sd) => {
            if (!this.node?.isValid) return;
            if (err) {
                cb?.(null);
                return;
            }
            if (this._spineResPath !== resPath) return;
            if (!this.sp_role?.isValid) return;

            this.sp_role.skeletonData = sd;
            this._spineReady = true;
            this.regSpineEvent();
            cb?.(this.sp_role);
        });
    }

    /** 重写：注册 spine 动画事件/完成事件，并做动画衔接 */
    regSpineEvent() {
        if (!this.sp_role || !this._spineReady) return;

        const onAnimFinished = () => {
            if (this.lastAnimName === SKELETAL_ANIMATION_NAME.MOVING) return;

            if (this.lastAnimName === SKELETAL_ANIMATION_NAME.DIE) {
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
                if (lastAnimName === SKELETAL_ANIMATION_NAME.ATTACK) {
                    this.playAnimation(SKELETAL_ANIMATION_NAME.IDLE);
                }
            }
        };

        this._onSpineEvent =
            this._onSpineEvent ||
            ((trackEntry: any, event: any) => {
                // 抛给外部：trackEntry + event
                this.node.emit("spine-event", trackEntry, event);
            });

        this._onSpineComplete =
            this._onSpineComplete ||
            ((trackEntry: any) => {
                if (trackEntry?.trackIndex === 0) onAnimFinished();
                this.node.emit("spine-complete", trackEntry);
            });

        // setXxxListener 会覆盖旧 listener，每次调用都安全
        this.sp_role.setEventListener(this._onSpineEvent);
        this.sp_role.setCompleteListener(this._onSpineComplete);
    }

    playAnimation(animName: string,isLoop:boolean = true) {
        if (!this.sp_role) return;
        if (!this._spineReady) {
            this.nextAnimName = animName;
            return;
        }
        if (this.lastAnimName === animName) return;

        if (
            empty(this.lastAnimName) ||
            this.lastAnimName === SKELETAL_ANIMATION_NAME.MOVING ||
            this.lastAnimName === SKELETAL_ANIMATION_NAME.IDLE
        ) {
            const logicObj = this._logicObj;
            if (animName === SKELETAL_ANIMATION_NAME.ATTACK && logicObj?.atkSpeed) {
                this.sp_role.timeScale = 3.0 * this._logicObj.atkSpeed;
            } else {
                this.sp_role.timeScale = 1.0;
            }
            this.lastAnimName = animName;
            this.sp_role.setAnimation(0, animName, isLoop);
        } else {
            this.nextAnimName = animName;
        }
    }

    pauseAnimation() {
        if (this.sp_role) this.sp_role.paused = true;
    }

    resumeAnimation() {
        if (this.sp_role) this.sp_role.paused = false;
    }

    playAnimationByState(stateId: number) {
        return;
        if (this.lastAnimName == "") {
            Debug.log("playSkeletalAnimationByState", this._logicObj.idx, stateId);
        }

        switch (stateId) {
            case STATE_ENUM.IDLE:
                this.playAnimation(SKELETAL_ANIMATION_NAME.IDLE);
                break;
            case STATE_ENUM.ATTACK:
                this.playAnimation(SKELETAL_ANIMATION_NAME.ATTACK);
                break;
            case STATE_ENUM.MOVING:
                this.playAnimation(SKELETAL_ANIMATION_NAME.MOVING);
                break;
            case STATE_ENUM.DIE:
                this.playAnimation(SKELETAL_ANIMATION_NAME.DIE);
                break;
            case STATE_ENUM.STUN:
                this.pauseAnimation();
                break;
            default:
                this.playAnimation(SKELETAL_ANIMATION_NAME.MOVING);
                break;
        }
    }

    /** 已废弃不用 */
    moveStep(duration: number, toPos: Vec2, cb?: Function) {
        this.stopMoveAction();
        this._moveAction = tween(this.node)
            .to(duration, { position: new Vec3(toPos.x, toPos.y) })
            .call(() => {
                if (!!cb) cb();
            });
        this._moveAction.start();
        this.updateDirection(toPos);
    }

    removeTweenAction(actionTween: Tween<Node>) {
        if (actionTween) {
            actionTween.stop();
            actionTween.removeSelf();
        }
    }

    stopMoveAction() {
        this.removeTweenAction(this._moveAction);
        this._moveAction = null;
    }

    updateDirection(dirV2: Vec2) {
        // todo 方向
    }

    updatePosition() {
        if (!!this._moveAction) {
            return;
        }
        if (!this._logicObj) {
            return;
        }
        const logicObj = this._logicObj;
        this.node.setPosition(logicObj.x, logicObj.y);
    }

    onBeAtked(damage: number) {
        if (this._beAtkedAction) return;
        if (!this.spt_role?.node?.isValid) return;

        const duration = 0.5;
        this._beAtkedAction = tween(this.spt_role.node)
            .to(
                duration,
                {},
                {
                    onUpdate(tar: Node) {
                        const spt = tar.getComponent(Sprite);
                        if (spt) spt.color = Color.RED;
                    },
                }
            )
            .to(
                duration,
                {},
                {
                    onUpdate(tar: Node) {
                        const spt = tar.getComponent(Sprite);
                        if (spt) spt.color = Color.WHITE;
                    },
                }
            )
            .call(() => {
                this.stopBeAtkedAction();
            });
        this._beAtkedAction.start();

        const worldPos = this.node.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0, 0, 0));
        const param = { value: -damage, x: worldPos.x, y: worldPos.y };
        App.effectMgr.playEffectLife(param);
    }

    stopBeAtkedAction() {
        this.removeTweenAction(this._beAtkedAction);
        this._beAtkedAction = null;
    }

    playDirectAction(angle: number): void {
        if (!!this._directAction) return;
        const duration = toolKit.limitNum((0.3 * Math.abs(angle)) / 90, 0, 0.3);
        const eulerAngle = new Vec3(0, 0, angle);
        eulerAngle.z = uiKit.getDeltaAngle(this.node.eulerAngles.z, eulerAngle.z);
        this._directAction = tween(this.node)
            .to(duration, { eulerAngles: eulerAngle })
            .call(() => {
                this.stopDirectAction();
            });
        this._directAction.start();
    }

    stopDirectAction(): void {
        this._directAction = null;
    }

    updateUI() {}

    updateSiblingIndex() {
        const index = 1334 - Math.floor(this.node.position.y / 10);
        this.updateDataToUI("Live.updateSiblingIndex", index, () => {
            this.node.setSiblingIndex(index);
        });
    }

    update(dt: number) {
        this.updateUI();
        this.updatePosition();
    }
}
