import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from "cc";
import { DataSingleton } from "../Singleton/DataSingleton";
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

    customLevel(i: number) {
        let dataSingleton = DataSingleton.getInstance();
        let mode = dataSingleton.getData("mode");
        let currLevel = dataSingleton.getData(`mode${mode}Level`);
        if (i < currLevel) {
            this.img.spriteFrame = this.greenScreen;
            this.levelLabel.string = (i + 1).toString();
        } else {
            this.img.spriteFrame = this.lock;
            this.levelLabel.string = "";
        }
    }
}
