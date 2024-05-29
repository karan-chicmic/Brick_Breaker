import { _decorator, Button, Component, director, instantiate, Label, Node, Prefab, SpriteFrame } from "cc";
import { levels } from "../Levels/levels";
const { ccclass, property } = _decorator;

@ccclass("Welcome")
export class Welcome extends Component {
    // @property({ type: Number })
    // currLevel: number = 0;
    // @property({ type: Prefab })
    // levelPrefab: Prefab = null;
    // @property({ type: Node })
    // levels: Node = null;

    // @property({ type: Node })
    // levelsNode: Node = null;

    // @property({ type: SpriteFrame })
    // lock: SpriteFrame = null;

    // @property({ type: SpriteFrame })
    // greenScreen: SpriteFrame = null;

    start() {}

    update(deltaTime: number) {}
    onClick() {
        director.loadScene("Input");
        // console.log("on click called");

        // for (let i = 0; i < 6; i++) {
        //     let levelNode = instantiate(this.levelPrefab);
        //     levelNode.getComponent(levels).customLevel(this.currLevel, i);
        //     this.levels.addChild(levelNode);
        // }

        // this.node.parent.active = false;
        // this.levelsNode.active = true;
    }

    // onBackButton() {
    //     this.levels.removeAllChildren();
    //     this.levelsNode.active = false;
    //     this.node.parent.active = true;
    // }
    // onNextButton() {
    //     director.loadScene("main");
    // }
}
