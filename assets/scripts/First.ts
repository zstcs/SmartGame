import { _decorator, Button, Component, director } from 'cc'
const { ccclass, property } = _decorator

@ccclass('First')
export class First extends Component {
  @property({ type: Button })
  private btnStart: Button = null

  start() {}

  update(deltaTime: number) {}

  onBtnStartClick() {
    console.log('onBtnStartClick')
    director.loadScene('main')
  }
}
