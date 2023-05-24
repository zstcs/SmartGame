import {
  _decorator,
  Collider2D,
  Component,
  Contact2DType,
  debug,
  instantiate,
  IPhysics2DContact,
  Label,
  Node,
  PhysicsSystem2D,
  Prefab,
  Tween,
  tween,
  UIOpacity,
  Vec3
} from 'cc'
import { BallElement, BallElementEvent } from './BallElement'
import { AtomItem, Atoms } from './common/Atom'
const { ccclass, property } = _decorator
const BASE_RADIUS = 300
const ANGLE_PROP = '__angle__'
@ccclass('Main')
export class Main extends Component {
  @property({ type: Prefab, visible: true, displayName: '预制体' })
  public _ballElment: Prefab = null

  @property({ type: Node, visible: true, displayName: '添加球' })
  private addBallElement: Node = null

  @property({ type: Label, visible: true, displayName: '添加文本' })
  private addLabel: Label = null

  private ballNodes: Node[] = []
  private isAddBalling: boolean = false

  protected onLoad(): void {
    this.addBallElement.active = false
    this.initBallElementInfos()
  }

  private _currentAdd: AtomItem = null

  private _cacheAdd: Set<AtomItem> = new Set()

  set currentAdd(value: AtomItem) {
    this._currentAdd = value
    this.addLabel.string = value.atom
    this._cacheAdd.add(value)
  }

  start() {
    this.init()
  }

  update(deltaTime: number) {}

  init() {
    this._createAddBall()
    this.addLabel.string = this._currentAdd.atom
    this.addBallElement.active = true

    const uOpacity = this.addBallElement.getComponent(UIOpacity)
    Tween.stopAllByTarget(uOpacity)

    uOpacity.opacity = 0
    tween(uOpacity).to(0.5, { opacity: 255 }).start()

    this.addBallElement.on(Node.EventType.TOUCH_START, () => {
      this.addBall()
    })
  }

  addBall(name?: string) {
    if (this.isAddBalling) return
    this.isAddBalling = true
    const nodes = [...this.ballNodes]
    const ball = instantiate(this._ballElment)
    const angle = Math.round(Math.random() * 360)
    const radians = (Math.PI / 180) * angle
    const x = 0 + BASE_RADIUS * Math.sin(radians)
    const y = 0 + BASE_RADIUS * Math.cos(radians)
    const ballElement = this._initBallElement(ball, x, y)
    ballElement.info = this._currentAdd
    // ballElement.label = name ?? String(nodes.length)
    ballElement.node.once(BallElementEvent.PlayAnimationEnd, () => {
      this.resetBallPostion()
      this.isAddBalling = false
    })
    ballElement.node.once(BallElementEvent.MovePositionEnd, () => {
      // debugger
      console.log('MovePositionEnd', ballElement.label)
    })

    Reflect.set(ball, ANGLE_PROP, angle)

    const idx = nodes.findIndex((v, k) => {
      const a = Reflect.get(v, ANGLE_PROP)
      // return r === radians
      console.log('===================k:', k, a, angle)
      return a >= angle
    })

    if (~idx) {
      this.ballNodes.splice(idx, 0, ball)
    } else {
      this.ballNodes.push(ball)
    }
    this.node.addChild(ball)

    console.log('sssssssssssssssss', nodes, this.ballNodes)

    this._createAddBall()
  }

  _createAddBall() {
    const randomNum = Math.random()
    if (randomNum <= 0.75) {
      this.currentAdd = Atoms[Math.floor(Math.random() * 116)]
    } else if (randomNum <= 0.95) {
      this.currentAdd = { name: '+', atom: '+', value: '998' }
    } else {
      this.currentAdd = { name: '-', atom: '-', value: '999' }
    }
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
    const count = 5
    const points = this.getPoint(BASE_RADIUS, 0, 0, count, 10)
    this.ballNodes = Array.from({ length: count }, (v, k) => {
      const info = Atoms[Math.floor(Math.random() * 116)]
      const ball = instantiate(this._ballElment)
      const { x, y, angle } = points[k]
      const ballElement = this._initBallElement(ball, x, y)
      ballElement.label = `${k}`
      ballElement.info = info
      Reflect.set(ball, ANGLE_PROP, angle)
      this.node.addChild(ball)
      return ball
    })
  }

  getPoint(r: number, ox: number, oy: number, count: number, offset: number = 0) {
    const angle = Math.round(360 / count)
    const radians = (Math.PI / 180) * angle // 弧度
    const offsetRadians = (Math.PI / 180) * offset // 弧度
    const points = []
    for (let i = 0; i < count; i++) {
      const r1 = radians * i + offsetRadians
      const x = ox + r * Math.sin(r1)
      const y = oy + r * Math.cos(r1)
      // points.unshift({ x, y, r: r1, angle: angle * i }) // 为保持数据顺时针
      points.push({ x, y, r: r1, angle: angle * i + offset })
    }
    return points
  }
}
