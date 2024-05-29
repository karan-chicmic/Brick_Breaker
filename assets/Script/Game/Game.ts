import {
    _decorator,
    Collider2D,
    Component,
    Contact2DType,
    EventMouse,
    instantiate,
    IPhysics2DContact,
    Label,
    Node,
    Prefab,
    RigidBody2D,
    UITransform,
    Vec2,
    Animation,
    math,
    Layout,
    director,
    BoxCollider2D,
    randomRangeInt,
    JsonAsset,
    Button,
    EventHandheld,
    EventHandler,
} from "cc";
import { Brick } from "../Brick/Brick";
import { DataSingleton } from "../Singleton/DataSingleton";
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
    @property({ type: Node })
    popup: Node = null;
    @property({ type: JsonAsset })
    patternJson: JsonAsset = null;
    // tileInstanceNodes: Node[] = [];
    @property({ type: Button })
    btn: Button = null;
    @property({ type: Label })
    popupLabel: Label = null;
    ballStartPosition: math.Vec3;
    totalLifes = 2;
    totalNoOfBricks = 0;
    dataSingleton: DataSingleton;
    mode: number;
    currLevel: number;

    protected onLoad(): void {}
    getDataByName(patterns: any[], name: string) {
        return patterns.find((pattern: { name: any }) => pattern.name === name)?.data || null;
    }

    start() {
        this.dataSingleton = DataSingleton.getInstance();
        this.mode = this.dataSingleton.getData("mode");
        this.currLevel = this.dataSingleton.getData(`mode${this.mode}Level`);
        // let currLevel = 6;
        console.log(`mode ${this.mode} level ${this.currLevel}`);

        let jsonData = this.patternJson.json;
        let patterns = jsonData.patterns;

        const levelData = this.getDataByName(patterns, `level${this.currLevel}`);
        console.log(levelData);

        // PhysicsSystem2D.instance.enable = true;

        // PhysicsSystem2D.instance.debugDrawFlags =
        //     EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape;
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onExitCollision, this);
        }
        this.ballStartPosition = this.ball.getWorldPosition();
        let tileAreaHeight = this.tileArea.getComponent(UITransform).height;
        let tileAreaWidth = this.tileArea.getComponent(UITransform).width;
        let brickWidth = tileAreaWidth / 10;
        let noOfRows = Math.floor(tileAreaHeight / brickWidth);
        // for (let i = 0; i < noOfRows; i++) {
        for (let i = 0; i < 1; i++) {
            // for (let row of levelData) {
            let row = levelData[i];
            let rowNode = instantiate(this.row);
            rowNode.getComponent(UITransform).height = brickWidth;
            // for (let j = 0; j < 10; j++) {
            for (let num of row) {
                let brickNode = instantiate(this.brick);
                brickNode.getComponent(UITransform).width = brickWidth;
                brickNode.getComponent(UITransform).height = brickWidth;
                brickNode.getComponent(Brick).generateBrick(num, brickWidth);
                rowNode.addChild(brickNode);
                this.totalNoOfBricks = this.totalNoOfBricks + 1;
                // this.tileInstanceNodes.push(brickNode);
            }
            let layoutComponent = rowNode.getComponent(Layout);
            this.tileArea.addChild(rowNode);
            layoutComponent.updateLayout();
            layoutComponent.enabled = false;
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
        anim.on(Animation.EventType.PLAY, () => {
            this.ball.setWorldPosition(this.ballStartPosition);
        });
        this.playAnimation(anim);
        anim.on(Animation.EventType.FINISHED, () => {
            this.moveBall();
        });
        let ballCollider = this.ball.getComponent(Collider2D);
        ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        ballCollider.on(Contact2DType.END_CONTACT, this.onExitCollision, this);
    }
    playAnimation(anim: Animation) {
        anim.play();
    }
    async onBeginContact(contact: IPhysics2DContact, selfCollider: Collider2D, otherCollider: Collider2D) {
        if (selfCollider.node.name === "Brick") {
            await this.handleCollision(selfCollider);
            this.onExitCollision(selfCollider);
        } else if (selfCollider.node.name === "bottom wall") {
            const ballRigidbody = this.ball.getComponent(RigidBody2D);
            const collider = this.ball.getComponent(BoxCollider2D);
            ballRigidbody.sleep();
            ballRigidbody.allowSleep;
            this.lifes.getChildByName(`ball${this.totalLifes}`).removeFromParent();
            this.totalLifes = this.totalLifes - 1;
            this.playAnimation(this.welcomeAnimation.getComponent(Animation));
            if (this.totalLifes < 0) {
                this.gameOver("loss");
            }
        }
    }
    async handleCollision(selfCollider: Collider2D): Promise<void> {
        this.updateScore();
    }
    onExitCollision(otherCollider: Collider2D) {
        if (otherCollider.node.name === "Brick") {
            otherCollider.node.removeFromParent();
            this.totalNoOfBricks = this.totalNoOfBricks - 1;
            if (this.totalNoOfBricks == 0) {
                // this.win();
                this.gameOver("win");
            }
        }
        if (otherCollider.node.name === "bottom wall") {
            let ballRigidbody = this.ball.getComponent(RigidBody2D);
            ballRigidbody.linearVelocity = new Vec2(0, 0);
        }
    }
    updateScore() {
        this.score.string = (parseInt(this.score.string) + 40).toString();
    }
    moveBall() {
        const ballRigidbody = this.ball.getComponent(RigidBody2D);
        ballRigidbody.linearVelocity = new Vec2(15, 15);
    }

    gameOver(name: string) {
        let clickEventHandler = new EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "Game";
        this.popupFunc();
        if (name == "win") {
            console.log("game over if executed");
            clickEventHandler.handler = "loadNextLevel";
            // this.btn.clickEvents = clickEventHandler
            this.btn.node.on(
                Button.EventType.CLICK,
                () => {
                    this.loadNextLevel();
                },
                this
            );
            this.popupLabel.string = "You Win!";
        } else {
            console.log("game over else executed");
            clickEventHandler.handler = "loadWelcomeScreen";
            this.popupLabel.string = "You Loss!";
            this.btn.node.on(
                Button.EventType.CLICK,
                () => {
                    this.loadWelcomeScreen();
                },
                this
            );
            // this.btn.= this.loadWelcomeScreen()
        }
    }
    popupFunc() {
        this.popup.active = true;
        let anim = this.popup.getComponent(Animation);
        anim.play();
        anim.on(Animation.EventType.FINISHED, () => {
            this.ball.removeFromParent();
            this.base.removeFromParent();
        });
    }

    loadWelcomeScreen() {
        director.loadScene("levels");
    }
    loadNextLevel() {
        this.currLevel = this.currLevel + 1;
        if (this.currLevel > 6) {
            console.log("load next level if");
            this.mode = this.mode + 1;
            this.currLevel = this.dataSingleton.getData(`mode${this.mode}Level`);
        }
        if (this.mode > 4) {
            console.log("load next level if of mode");
            this.popupFunc();
            this.popupLabel.string = "Congratulations! You have Complete Game!";
            director.loadScene("welcome");
        } else {
            console.log("load next level else");
            this.changeData();
            director.loadScene("levels");
        }
    }
    changeData() {
        this.dataSingleton.setData("mode", this.mode);
        this.dataSingleton.setData(`mode${this.mode}Level`, this.currLevel);
        console.log("Game Mode", this.dataSingleton.getData("mode"));
        console.log("Game Level", this.dataSingleton.getData(`mode${this.mode}Level`));
    }
    update() {}
}
