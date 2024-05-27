import {
    _decorator,
    BoxCollider2D,
    Component,
    EventMouse,
    find,
    instantiate,
    Label,
    Node,
    Prefab,
    randomRangeInt,
    RigidBody2D,
    UITransform,
    Vec2,
} from "cc";
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

    @property({ type: Node })
    base: Node = null;

    @property({ type: Node })
    ball: Node = null;

    @property({ type: Node })
    lifes: Node = null;

    @property({ type: Label })
    score: Label = null;
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
        let ballCollider = this.ball.getComponent(BoxCollider2D);
        if (ballCollider) {
            console.log("ballCollider");
        }
        let nodeBoundingBox = this.node.getComponent(UITransform).getBoundingBoxToWorld();
        if (nodeBoundingBox) {
            console.log(nodeBoundingBox);
        }
        this.node.on(Node.EventType.MOUSE_MOVE, (event: EventMouse) => {
            let x = event.getUILocation().x;
            console.log("x", x);
            if (x > nodeBoundingBox.xMin && x < nodeBoundingBox.xMin + this.base.getComponent(UITransform).width / 2) {
                this.base.setWorldPosition(
                    nodeBoundingBox.xMin + this.base.getComponent(UITransform).width / 2,
                    this.base.worldPosition.y,
                    0
                );
            } else if (
                x < nodeBoundingBox.xMax &&
                x > nodeBoundingBox.xMax - this.base.getComponent(UITransform).width / 2
            ) {
                this.base.setWorldPosition(
                    nodeBoundingBox.xMax - this.base.getComponent(UITransform).width / 2,
                    this.base.worldPosition.y,
                    0
                );
            } else {
                this.base.setWorldPosition(x, this.base.worldPosition.y, 0);
            }
        });

        // let ballRigidBody = this.ball.getComponent(RigidBody2D);
        // ballRigidBody.linearVelocity = new Vec2(500, 1000);
    }

    update(deltaTime: number) {}
}
