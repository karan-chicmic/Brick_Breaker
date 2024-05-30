import { _decorator, Color, Component, Node, randomRangeInt, Sprite, SpriteFrame, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Brick")
export class Brick extends Component {
    @property({ type: Sprite })
    brick: Sprite = null;

    @property({ type: [SpriteFrame] })
    color_img: [SpriteFrame] | [] = [];

    @property({ type: SpriteFrame })
    whiteImg: SpriteFrame = null;

    start() {}

    update(deltaTime: number) {}

    generateBrick(i: number, width: number, BallColors: { name: string; color: Color }[]) {
        this.brick.getComponent(UITransform).width = width;
        this.brick.getComponent(UITransform).height = width;
        this.brick.spriteFrame = this.whiteImg;
        this.brick.color = BallColors[i].color;
    }

}
