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
    SpriteFrame,
    Color,
    Sprite,
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
    @property({ type: Button })
    btn: Button = null;
    @property({ type: Label })
    popupLabel: Label = null;
    @property({ type: Prefab })
    heart: Prefab = null;
    ballStartPosition: math.Vec3;
    totalLifes: number;
    totalNoOfBricks = 0;
    dataSingleton: DataSingleton;
    mode: number;
    currLevel: number;
    totalNoOfLifes: number;
    BallColors = [
        { name: "First", color: new Color(64, 102, 161) },
        { name: "Second", color: new Color(149, 184, 100) },
        { name: "Third", color: new Color(174, 107, 161) },
        { name: "Fourth", color: new Color(214, 102, 76) },
        { name: "Fifth", color: new Color(230, 186, 104) },
        { name: "Sixth", color: new Color(128, 204, 150) },
        { name: "Seventh", color: new Color(70, 92, 50) },
        { name: "Eigth", color: new Color(107, 150, 89) },
        { name: "Nineth", color: new Color(255, 165, 0) },
        { name: "Tenth", color: new Color(89, 107, 130) },
    ];

    getDataByName(patterns: any[], name: string) {
        return patterns.find((pattern: { name: any }) => pattern.name === name)?.data || null;
    }
    changeBasePosition(event: { getUILocation: () => { (): any; new (): any; x: any } }) {
        let nodeBoundingBox = this.node.getComponent(UITransform).getBoundingBoxToWorld();
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
            ballRigidbody.sleep();
            ballRigidbody.allowSleep;

            this.lifes.removeChild(this.lifes.children.find(() => this.lifes.children.length - 1));
            this.totalLifes = this.totalLifes - 1;
            this.playAnimation(this.welcomeAnimation.getComponent(Animation));
            if (this.totalLifes <= 0) {
                this.gameOver("loss");
            }
        }
    }
    async handleCollision(selfCollider: Collider2D): Promise<void> {
        this.updateScore();
    }
    onExitCollision(otherCollider: Collider2D) {
        if (otherCollider.node.name === "Brick") {
            switch (this.mode) {
                case 1: {
                    this.modeOneHandler(otherCollider.node);
                    break;
                }
                case 2: {
                    this.modeTwoHandler(otherCollider.node);
                    break;
                }
                case 3: {
                    this.modeThreeHandler(otherCollider.node);
                    break;
                }
                case 4: {
                    this.modeFourHandler(otherCollider.node);
                    break;
                }
            }
        }
        if (otherCollider.node.name === "bottom wall") {
            let ballRigidbody = this.ball.getComponent(RigidBody2D);
            ballRigidbody.linearVelocity = new Vec2(0, 0);
        }
    }
    start() {
        this.dataSingleton = DataSingleton.getInstance();
        this.mode = this.dataSingleton.getData("mode");
        this.currLevel = this.dataSingleton.getData(`mode${this.mode}Level`);
        this.totalNoOfLifes = this.dataSingleton.getData("lifes");
        let jsonData = this.patternJson.json;
        let patterns = jsonData.patterns;

        const levelData = this.getDataByName(patterns, `level${this.currLevel}`);
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
        this.changeColor();
        for (let i = 0; i < noOfRows; i++) {
            let row = levelData[i];
            let rowNode = instantiate(this.row);
            rowNode.getComponent(UITransform).height = brickWidth;
            for (let num of row) {
                let brickNode = instantiate(this.brick);
                brickNode.getComponent(UITransform).width = brickWidth;
                brickNode.getComponent(UITransform).height = brickWidth;
                brickNode.getComponent(Brick).generateBrick(num, brickWidth, this.BallColors);
                rowNode.addChild(brickNode);
                this.totalNoOfBricks = this.totalNoOfBricks + 1;
            }
            let layoutComponent = rowNode.getComponent(Layout);
            this.tileArea.addChild(rowNode);
            layoutComponent.updateLayout();
            layoutComponent.enabled = false;
        }
        this.totalLifes = this.totalNoOfLifes;
        for (let i = 0; i < this.totalNoOfLifes; i++) {
            let heartNode = instantiate(this.heart);
            this.lifes.addChild(heartNode);
        }
        this.node.on(Node.EventType.TOUCH_START, this.changeBasePosition, this);
        this.node.on(Node.EventType.MOUSE_MOVE, this.changeBasePosition, this);
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
    updateScore() {
        this.score.string = (parseInt(this.score.string) + 40).toString();
    }
    moveBall() {
        const ballRigidbody = this.ball.getComponent(RigidBody2D);
        ballRigidbody.linearVelocity = new Vec2(15, 15);
    }

    gameOver(name: string) {
        this.popupFunc();
        if (name == "win") {
            this.btn.node.on(
                Button.EventType.CLICK,
                () => {
                    this.loadNextLevel();
                },
                this
            );
            this.popupLabel.string = "You Win!";
        } else {
            this.popupLabel.string = "You Loss!";
            this.btn.node.on(
                Button.EventType.CLICK,
                () => {
                    this.loadWelcomeScreen();
                },
                this
            );
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
            this.mode = this.mode + 1;
            this.currLevel = this.dataSingleton.getData(`mode${this.mode}Level`);
        }
        if (this.mode > 4) {
            this.popupFunc();
            this.popupLabel.string = "Congratulations! You have Complete Game!";
            director.loadScene("welcome");
        } else {
            this.changeData();
            director.loadScene("levels");
        }
    }
    changeData() {
        this.dataSingleton.setData("mode", this.mode);
        this.dataSingleton.setData(`mode${this.mode}Level`, this.currLevel);
    }

    checkColor(otherCollider: Node) {
        if (otherCollider.getChildByName("Brick").getComponent(Sprite).color == this.ball.getComponent(Sprite).color) {
            return true;
        } else return false;
    }
    changeColor() {
        let ballColor = this.ball.getComponent(Sprite).color;
        let availableColors = this.BallColors.filter((col) => !ballColor.equals(col.color));
        this.ball.getComponent(Sprite).color = availableColors[randomRangeInt(0, availableColors.length)].color;
    }

    modeOneHandler(otherCollider: Node) {
        otherCollider.removeFromParent();
        this.totalNoOfBricks = this.totalNoOfBricks - 1;
        if (this.totalNoOfBricks == 0) {
            this.gameOver("win");
        }
        this.changeColor();
    }
    modeTwoHandler(otherCollider: Node) {
        if (
            otherCollider.getChildByName("Brick").getComponent(Sprite).color._val ==
            this.ball.getComponent(Sprite).color._val
        ) {
            otherCollider.removeFromParent();
            this.totalNoOfBricks = this.totalNoOfBricks - 1;
            if (this.totalNoOfBricks == 0) {
                this.gameOver("win");
            }
            this.changeColor();
        } else {
            this.changeColor();
        }
    }
    modeThreeHandler(otherCollider: Node) {
        otherCollider.parent.destroy();
        this.changeColor();
        if (this.tileArea.children.length <= 1) {
            this.gameOver("win");
        }
    }
    modeFourHandler(otherCollider: Node) {
        if (
            otherCollider.getChildByName("Brick").getComponent(Sprite).color._val ==
            this.ball.getComponent(Sprite).color._val
        ) {
            this.modeThreeHandler(otherCollider);
        } else {
            this.changeColor();
        }
    }
}
