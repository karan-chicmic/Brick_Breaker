import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Brick")
export class Brick extends Component {
    @property({ type: Sprite })
    brick: Sprite = null;

    @property({ type: [SpriteFrame] })
    color_img: [SpriteFrame] | [] = [];

    start() {}

    update(deltaTime: number) {}

    generateBrick(i: number, width: number) {
        // i = i % this.color_img.length;
        this.brick.getComponent(UITransform).width = width;
        this.brick.getComponent(UITransform).height = width;
        this.brick.spriteFrame = this.color_img[i];
    }
}
