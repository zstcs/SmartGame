import { _decorator, Color, Component, Node, Sprite } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Dot')
export class Dot extends Component {
  @property({ type: Node })
  private spriteSplash: Node = null

  private _color: Color = new Color('#ffffff')

  get color() {
    return this._color
  }

  set color(value: Color) {
    this._color = value
    this.spriteSplash.getComponent(Sprite).color = value
  }

  start() {}

  update(deltaTime: number) {}
}
