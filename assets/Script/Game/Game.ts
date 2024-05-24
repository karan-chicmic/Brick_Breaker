import { _decorator, Component, find, instantiate, Node, Prefab, UITransform } from "cc";
import { Brick } from "../Brick/Brick";
const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
    @property({ type: Prefab })
    brick: Prefab = null;

    @property({ type: Node })
    tileArea: Node = null;

    @property({ type: Prefab })
    row: Prefab = null;
    start() {
        let tileAreaHeight = this.tileArea.getComponent(UITransform).height;
        console.log("tile height", tileAreaHeight);
        let tileAreaWidth = this.tileArea.getComponent(UITransform).width;
        console.log("tile width", tileAreaWidth);

        let brickWidth = tileAreaWidth / 10;
        console.log("brick width", brickWidth);

        let noOfRows = Math.floor(tileAreaHeight / brickWidth);
        console.log("no of rows", noOfRows);

        for (let i = 0; i < noOfRows; i++) {
            let rowNode = instantiate(this.row);
            rowNode.getComponent(UITransform).height = brickWidth;
            for (let j = 0; j < 10; j++) {
                let brickNode = instantiate(this.brick);
                brickNode.getComponent(UITransform).width = brickWidth;
                brickNode.getComponent(UITransform).height = brickWidth;

                brickNode.getComponent(Brick).generateBrick(i, brickWidth);
                rowNode.addChild(brickNode);
            }
            this.tileArea.addChild(rowNode);
        }
    }

    update(deltaTime: number) {}
}
