import { _decorator, Color, Component, Node, randomRangeInt, Sprite, SpriteFrame, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Brick")
export class Brick extends Component {
    @property({ type: Sprite })
    brick: Sprite = null;

    @property({ type: [SpriteFrame] })
    color_img: [SpriteFrame] | [] = [];

    // BallColors = [
    //     { name: "First", color: new Color(64, 102, 161) },
    //     { name: "Second", color: new Color(149, 184, 100) },
    //     { name: "Third", color: new Color(174, 107, 161) },
    //     { name: "Fourth", color: new Color(214, 102, 76) },
    //     { name: "Fifth", color: new Color(230, 186, 104) },
    //     { name: "Sixth", color: new Color(128, 204, 150) },
    //     { name: "Seventh", color: new Color(70, 92, 50) },
    //     { name: "Eigth", color: new Color(107, 150, 89) },
    //     { name: "Nineth", color: new Color(255, 165, 0) },
    //     { name: "Tenth", color: new Color(89, 107, 130) },
    // ];

    start() {}

    update(deltaTime: number) {}

    generateBrick(i: number, width: number) {
        // i = i % this.color_img.length;
        this.brick.getComponent(UITransform).width = width;
        this.brick.getComponent(UITransform).height = width;
        this.brick.spriteFrame = this.color_img[i];
        // this.brick.color = this.BallColors[i].color;
    }

    // changeColor() {
    //     let ballColor = this.brick.color;
    //     let availableColors = this.BallColors.filter((c) => !ballColor.equals(c.color));
    //     ballColor = availableColors[randomRangeInt(0, availableColors.length)].color;
    // }
}
