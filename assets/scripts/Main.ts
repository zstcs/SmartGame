import { _decorator, AnimationClip, Component, find, instantiate, Node, Prefab, resources, Vec3 } from 'cc'
import { BallElement } from './BallElement'
const { ccclass, property } = _decorator
@ccclass('Main')
export class Main extends Component {
  @property({ type: Prefab, visible: true, displayName: '预制体' })
  public _ballElment: Prefab = null
  private ballNodes: Node[] = []

  start() {
    // const count = ~~(Math.random() * 10)
    const count = 10
    const points = this.getPoint(300, 0, 0, count)
    this.ballNodes = Array.from({ length: count }, (v, k) => {
      const ball = instantiate(this._ballElment)
      const { x, y } = points[k]
      // ball.setPosition(new Vec3(points[k].x, points[k].y, 0))
      ball.getComponent(BallElement).targetPos = new Vec3(x, y, 0)
      this.node.addChild(ball)

      return ball
    })
  }

  update(deltaTime: number) {}

  getPoint(r, ox, oy, count) {
    const radians = (Math.PI / 180) * Math.round(360 / count) // 弧度
    const points = []
    for (let i = 0; i < count; i++) {
      const x = ox + r * Math.sin(radians * i)
      const y = oy + r * Math.cos(radians * i)
      points.unshift({ x, y }) // 为保持数据顺时针
    }
    return points
  }
}
