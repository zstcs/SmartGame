import { _decorator, animation, Animation, AnimationClip, Component, Node, Vec3 } from 'cc'

const { ccclass, property } = _decorator

@ccclass('BallElement')
export class BallElement extends Component {
  public targetPos: Vec3 = null
  private animation: Animation = null

  onLoad() {
    this.setAnimationInfo()
  }

  start() {
    this.animation.play('bm')
  }

  update(deltaTime: number) {}

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
}
