import { _decorator, Component, find, instantiate, Node, Prefab, resources } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Main')
export class Main extends Component {
  protected onLoad(): void {}
  start() {
    resources.load('prefabs/BallElement', (err, prefab) => {
      if (err) {
        console.error(err)
        return
      }
      const ball = instantiate(prefab) as Prefab
      const canvas = find('Canvas')
      debugger
    })
  }

  update(deltaTime: number) {}
}
