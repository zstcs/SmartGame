import { _decorator, Component, instantiate, Node, Prefab, Tween, tween, UIOpacity, Vec3 } from 'cc'
import { BallElement, BallElementEvent } from './BallElement'
const { ccclass, property } = _decorator
const BASE_RADIUS = 300
@ccclass('Main')
export class Main extends Component {
  @property({ type: Prefab, visible: true, displayName: '预制体' })
  public _ballElment: Prefab = null

  @property({ type: Node, visible: true, displayName: '添加球' })
  private addBallElement: Node = null

  private ballNodes: Node[] = []
  private isAddBalling: boolean = false

  protected onLoad(): void {
    this.addBallElement.active = false
    this.initBallElementInfos()
  }

  start() {
    this.init()
  }

  update(deltaTime: number) {}

  init() {
    this.addBallElement.active = true
    const uOpacity = this.addBallElement.getComponent(UIOpacity)
    Tween.stopAllByTarget(uOpacity)
    uOpacity.opacity = 0
    tween(uOpacity).to(0.5, { opacity: 255 }).start()

    this.addBallElement.on(Node.EventType.TOUCH_START, () => {
      this.addBall()
    })
  }

  addBall(name?:string) {
    if (this.isAddBalling) return
    this.isAddBalling = true
    const nodes = [...this.ballNodes]
    const ball = instantiate(this._ballElment)
    const radians = (Math.PI / 180) * Math.round(Math.random() * 360)
    const x = 0 + BASE_RADIUS * Math.sin(radians)
    const y = 0 + BASE_RADIUS * Math.cos(radians)
    const ballElement = this._initBallElement(ball, x, y)
    ballElement.label = name ?? String(nodes.length)
    ballElement.node.on(BallElementEvent.PlayAnimationEnd, () => {
      this.resetBallPostion()
      this.isAddBalling = false
    })
    Reflect.set(ball, '__radians__', radians)
    this.node.addChild(ball)

    const idx = nodes.findIndex((v, k) => {
      const r = Reflect.get(v, '__radians__')
      console.log('================rrrrrrrrrrrrrrrrr', r, radians)
      return r > radians
    })
    if (!~idx) {
      if (idx === 0) {
        this.ballNodes.unshift(ball)
      } else {
        this.ballNodes.splice(idx - 1, 0, ball)
      }
    } else {
      this.ballNodes.push(ball)
    }

    console.log('sssssssssssssssss', nodes, this.ballNodes)
  }

  resetBallPostion() {
    const count = this.ballNodes.length
    const points = this.getPoint(BASE_RADIUS, 0, 0, count)
    this.ballNodes.forEach((v, k) => {
      const { x, y, r } = points[k]
      const ballElement = v.getComponent(BallElement)
      //   ballElement.targetPos = new Vec3(x, y, 0)
      ballElement.move(new Vec3(x, y, 0))
    })
  }

  _initBallElement(ball: Node, x: number, y: number) {
    const ballElement = ball.getComponent(BallElement)
    ballElement.targetPos = new Vec3(x, y, 0)
    // ballElement.node.on(BallElementEvent.PlayAnimationEnd, () => {
    //   console.log('123123123123')
    // })
    return ballElement
  }
  initBallElementInfos() {
    const count = 4
    const points = this.getPoint(BASE_RADIUS, 0, 0, count)
    this.ballNodes = Array.from({ length: count }, (v, k) => {
      const ball = instantiate(this._ballElment)
      const { x, y, r } = points[k]
      const ballElement = this._initBallElement(ball, x, y)
      ballElement.label = `${k}`
      Reflect.set(ball, '__radians__', r)
      this.node.addChild(ball)
      return ball
    })
  }

  getPoint(r: number, ox: number, oy: number, count: number) {
    const radians = (Math.PI / 180) * Math.round(360 / count) // 弧度
    const points = []
    for (let i = 0; i < count; i++) {
      const r1 = radians * i
      const x = ox + r * Math.sin(r1)
      const y = oy + r * Math.cos(r1)
      points.unshift({ x, y, r: r1 }) // 为保持数据顺时针
    }
    return points
  }
}
