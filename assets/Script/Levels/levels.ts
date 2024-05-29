import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("levels")
export class levels extends Component {
    @property({ type: SpriteFrame })
    lock: SpriteFrame = null;

    @property({ type: SpriteFrame })
    greenScreen: SpriteFrame = null;

    @property({ type: Sprite })
    img: Sprite = null;
    @property({ type: Label })
    levelLabel: Label = null;
    start() {}

    update(deltaTime: number) {}

    customLevel(currLevel: number, i: number) {
        if (i < currLevel) {
            this.img.spriteFrame = this.greenScreen;
            this.levelLabel.string = (i + 1).toString();
        } else {
            this.img.spriteFrame = this.lock;
            this.levelLabel.string = "";
        }
    }
}
