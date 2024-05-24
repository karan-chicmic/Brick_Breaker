import { _decorator, Button, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Welcome")
export class Welcome extends Component {
    start() {}

    update(deltaTime: number) {}
    onClick() {
        console.log("on click called");
        director.loadScene("main");
    }
}
