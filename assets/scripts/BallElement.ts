import {
  _decorator,
  animation,
  Animation,
  AnimationClip,
  Collider2D,
  Component,
  Contact2DType,
  IPhysics2DContact,
  Label,
  Node,
  RigidBody2D,
  tween,
  Tween,
  Vec3
} from 'cc'
import { AtomItem, Nullable } from './common/Atom'

const { ccclass, property } = _decorator

export const BallElementEvent = {
  PlayAnimationEnd: 'PlayAnimationEnd',
  MovePositionEnd: 'MovePositionEnd'
}
@ccclass('BallElement')
export class BallElement extends Component {
  public targetPos: Vec3 = null

  @property({ type: Label })
  private nameLabel: Label = null

  private animation: Animation = null

  private isLoading: boolean = false

  private _playTween: Tween<Node> = null

  private _info: Nullable<AtomItem> = null

  get info() {
    return this._info
  }
  set info(value: Nullable<AtomItem>) {
    this._info = value
    if (value) {
      this.label = value.atom
    }
  }

  onLoad() {
    // this.setAnimationInfo()
    const collider2d = this.node.getComponent(Collider2D)
    collider2d.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    // collider2d.on()
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    if (this.isLoading) return
    console.log('onBeginContact', selfCollider, otherCollider)
    if (otherCollider.node.name === 'BallElement') {
      Tween.stopAllByTarget(otherCollider.node)
      otherCollider.node.emit(BallElementEvent.PlayAnimationEnd, otherCollider.node)
    }
    this._playTween?.stop()

    // this.node.emit(BallElementEvent.PlayAnimationEnd, this.node)
  }

  start() {
    // this.animation.play('bm')
    this.playAnimation()
  }

  update(deltaTime: number) {}

  playAnimation() {
    this.isLoading = true
    Tween.stopAllByTarget(this.node)
    this._playTween = tween(this.node)
      .to(0.2, { position: this.targetPos })
      .to(0.2, { scale: new Vec3(0.8, 0.8, 0.9) })
      .to(0.2, { scale: new Vec3(1, 1, 1) })
      .call(() => {
        this.node.emit(BallElementEvent.PlayAnimationEnd, this.node)
        this.isLoading = false
        this._playTween = null
      })
      .start()
  }

  move(pos: Vec3) {
    Tween.stopAllByTarget(this.node)
    this.node.getComponent(RigidBody2D).enabledContactListener = false
    tween(this.node)
      .to(0.2, { position: pos })
      .call(() => {
        this.node.emit(BallElementEvent.MovePositionEnd, this.node)
        this.node.getComponent(RigidBody2D).enabledContactListener = true
      })
      .start()
  }

  setAnimationInfo() {
    // this.animation = this.node.getComponent(AnimationComponent)
    this.animation = this.node.addComponent(Animation)

    const clip = new AnimationClip('bm')
    const track = new animation.VectorTrack()
    clip.duration = 1.0
    track.path = new animation.TrackPath().toProperty('position')
    track.componentsCount = 3

    const [x, y, z] = track.channels()

    // 关键帧
    const vec3KeyFrames = [
      [0, new Vec3(0, 0, 0)],
      [1.0, this.targetPos]
    ] as [number, Vec3][]

    x.curve.assignSorted(vec3KeyFrames.map(([time, vec3]) => [time, { value: vec3.x }]))
    y.curve.assignSorted(vec3KeyFrames.map(([time, vec3]) => [time, { value: vec3.y }]))
    z.curve.assignSorted(vec3KeyFrames.map(([time, vec3]) => [time, { value: vec3.z }]))

    clip.addTrack(track)
    this.animation.defaultClip = clip
  }

  set label(value: string) {
    this.nameLabel.string = value
  }
}
