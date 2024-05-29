import { _decorator, Button, Component, director, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from "cc";
import { DataSingleton } from "../Singleton/DataSingleton";
const { ccclass, property } = _decorator;

@ccclass("levels")
export class levels extends Component {
    @property({ type: SpriteFrame })
    lock: SpriteFrame = null;

    @property({ type: SpriteFrame })
    greenScreen: SpriteFrame = null;

    // @property({ type: Sprite })
    // img: Sprite = null;

    @property({ type: Button })
    btn: Button = null;
    @property({ type: Label })
    levelLabel: Label = null;
    start() {}

    update(deltaTime: number) {}
    customLevel(i: number, mode: any, currLevel: number) {
        if (i < currLevel) {
            this.btn.normalSprite = this.greenScreen;
            this.btn.pressedSprite = this.greenScreen;
            this.btn.hoverSprite = this.greenScreen;
            this.btn.disabledSprite = this.greenScreen;
            this.levelLabel.string = (i + 1).toString();
        } else {
            this.btn.normalSprite = this.lock;
            this.btn.pressedSprite = this.lock;
            this.btn.hoverSprite = this.lock;
            this.btn.disabledSprite = this.lock;
            this.levelLabel.string = "";
        }
    }

    onClick() {
        let dataSingleton = DataSingleton.getInstance();
        let mode = dataSingleton.getData("mode");
        let level = parseInt(this.levelLabel.string);
        dataSingleton.setData("mode", mode);
        dataSingleton.setData(`mode${mode}Level`, level);
        director.loadScene("main");
    }
}
