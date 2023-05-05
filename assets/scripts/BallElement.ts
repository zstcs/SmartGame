import { _decorator, animation, Animation, AnimationClip, Component, Label, Node, tween, Tween, Vec3 } from 'cc'

const { ccclass, property } = _decorator

export const BallElementEvent = {
  PlayAnimationEnd: 'PlayAnimationEnd'
}
@ccclass('BallElement')
export class BallElement extends Component {
  public targetPos: Vec3 = null

  @property({ type: Label })
  private nameLabel: Label = null

  private animation: Animation = null

  onLoad() {
    // this.setAnimationInfo()
  }

  start() {
    // this.animation.play('bm')
    this.playAnimation()
  }

  update(deltaTime: number) {}

  playAnimation() {
    Tween.stopAllByTarget(this.node)
    tween(this.node)
      .to(0.2, { position: this.targetPos })
      .to(0.2, { scale: new Vec3(0.8, 0.8, 0.9) })
      .to(0.2, { scale: new Vec3(1, 1, 1) })
      .call(() => {
        this.node.emit('PlayAnimationEnd')
      })
      .start()
  }

  move(pos: Vec3) {
    Tween.stopAllByTarget(this.node)
    tween(this.node).to(0.2, { position: pos }).start()
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
