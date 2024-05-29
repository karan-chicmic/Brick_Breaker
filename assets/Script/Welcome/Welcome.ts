import { _decorator, Button, Component, director, instantiate, Label, Node, Prefab, SpriteFrame } from "cc";
import { levels } from "../Levels/levels";
const { ccclass, property } = _decorator;

@ccclass("Welcome")
export class Welcome extends Component {
    start() {}

    update(deltaTime: number) {}
    onClick() {
        director.loadScene("Input");
    }
}
