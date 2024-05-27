import {
    _decorator,
    BoxCollider2D,
    Collider,
    Collider2D,
    Component,
    Contact2DType,
    EventMouse,
    instantiate,
    Intersection2D,
    IPhysics2DContact,
    Label,
    Node,
    PhysicsSystem,
    Prefab,
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

    tileInstanceNodes: Node[] = [];
    start() {
        let tileAreaHeight = this.tileArea.getComponent(UITransform).height;
        let tileAreaWidth = this.tileArea.getComponent(UITransform).width;
        let brickWidth = tileAreaWidth / 10;
        let noOfRows = Math.floor(tileAreaHeight / brickWidth);
        for (let i = 0; i < noOfRows; i++) {
            let rowNode = instantiate(this.row);
            rowNode.getComponent(UITransform).height = brickWidth;
            for (let j = 0; j < 10; j++) {
                let brickNode = instantiate(this.brick);
                brickNode.getComponent(UITransform).width = brickWidth;
                brickNode.getComponent(UITransform).height = brickWidth;
                brickNode.getComponent(Brick).generateBrick(i, brickWidth);
                rowNode.addChild(brickNode);
                this.tileInstanceNodes.push(brickNode);
            }
            this.tileArea.addChild(rowNode);
        }
        let nodeBoundingBox = this.node.getComponent(UITransform).getBoundingBoxToWorld();

        this.node.on(Node.EventType.MOUSE_MOVE, (event: EventMouse) => {
            let x = event.getUILocation().x;
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

        this.moveBall();
    }
    moveBall() {
        let ballRigidBody = this.ball.getComponent(RigidBody2D);
        if (ballRigidBody) {
            ballRigidBody.applyForceToCenter(new Vec2(480, 1000), true);
            ballRigidBody.linearDamping = 0.5;
        }
    }

    detectCollision() {
        for (let tile of this.tileInstanceNodes) {
            let tileBoundingBox = tile.getComponent(UITransform).getBoundingBoxToWorld();

            let ballBoundingBox = this.ball.getComponent(UITransform).getBoundingBoxToWorld();

            let tileBoxCollider = tile.getComponent(BoxCollider2D);
            let ballBoxCollider = this.ball.getComponent(BoxCollider2D);

            if (Intersection2D.rectRect(tileBoundingBox, ballBoundingBox)) {
                console.log("collision detected");
                tile.destroy();
            }
        }
    }
    protected update(dt: number): void {
        this.detectCollision();
    }
}
