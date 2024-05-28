import {
    _decorator,
    AnimationClip,
    BoxCollider2D,
    CircleCollider2D,
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
    Animation,
    math,
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

    @property({ type: Node })
    leftWall: Node = null;
    @property({ type: Node })
    rightWall: Node = null;
    @property({ type: Node })
    topWall: Node = null;
    @property({ type: Node })
    bottomWall: Node = null;

    @property({ type: Node })
    welcomeAnimation: Node;

    tileInstanceNodes: Node[] = [];
    ballStartPosition: math.Vec3;
    start() {
        this.ballStartPosition = this.ball.getWorldPosition();
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
        let anim = this.welcomeAnimation.getComponent(Animation);
        this.playAnimation(anim);
        anim.on(Animation.EventType.FINISHED, () => {
            this.moveBall();
        });
        // this.moveBall();
        let ballCollider = this.ball.getComponent(Collider2D);

        ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        ballCollider.on(Contact2DType.END_CONTACT, this.onExitCollision, this);
        if (ballCollider) {
            console.log("ball collider");
            console.log(ballCollider);
        } else {
            console.log("no ball collider");
        }
    }

    playAnimation(anim: Animation) {
        anim.play();
    }
    async onBeginContact(contact: IPhysics2DContact, selfCollider: Collider2D, otherCollider: Collider2D) {
        console.log("on begin called");
        const ballCollider = this.ball.getComponent<Collider2D>(Collider2D);
        const ballRigidbody = this.ball.getComponent<RigidBody2D>(RigidBody2D);
        ballCollider.restitution = 1;
        console.log("self", selfCollider);
        console.log("other", otherCollider);

        if (selfCollider.node.name === "Brick") {
            await this.handleCollision(ballRigidbody, selfCollider);
            this.onExitCollision(selfCollider);
        } else if (selfCollider.node.name === "base") {
            console.log("collison with base occur");
            ballRigidbody.applyLinearImpulseToCenter(new Vec2(-50, 60), true);
        } else if (selfCollider.node.name == "left wall") {
            console.log("collison with left wall occur");
            ballRigidbody.applyLinearImpulseToCenter(new Vec2(50, 30), true);
        } else if (selfCollider.node.name == "right wall") {
            console.log("collison with right wall occur");
            ballRigidbody.applyLinearImpulseToCenter(new Vec2(-50, 30), true);
        } else if (selfCollider.node.name == "top wall") {
            console.log("collison with top wall occur");
            ballRigidbody.applyLinearImpulseToCenter(new Vec2(-10, 30), true);
        } else if (selfCollider.node.name == "bottom wall") {
            console.log("collison with bottom wall occur");
            ballRigidbody.sleep();
            ballRigidbody.allowSleep;
            this.ball.setWorldPosition(this.ballStartPosition);
            this.lifes.removeChild(this.lifes.children.find(() => this.lifes.children.length - 1));

            // this.ball.destroy();

            this.playAnimation(this.welcomeAnimation.getComponent(Animation));
            if (this.lifes.children.length === 0) {
                alert("you loss");
            }
        }
    }

    async handleCollision(ballRigidbody: RigidBody2D, selfCollider: Collider2D): Promise<void> {
        console.log("handle collision called");
        this.updateScore();
        ballRigidbody.applyLinearImpulseToCenter(new Vec2(10, -30), true);
        // Wait a bit to simulate some processing (optional)
        // await new Promise(resolve => setTimeout(resolve, 100));
    }

    onExitCollision(selfCollider: Collider2D) {
        console.log("on exit called");
        if (selfCollider.node.name === "Brick") {
            selfCollider.node.removeFromParent();
        }
    }

    updateScore() {
        this.score.string = (parseInt(this.score.string) + 40).toString();
    }
    moveBall() {
        const ballRigidbody = this.ball.getComponent(RigidBody2D);

        ballRigidbody.applyLinearImpulseToCenter(new Vec2(10, 30), true);
    }

    protected update(dt: number): void {}
}
