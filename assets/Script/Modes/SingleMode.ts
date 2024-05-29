import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("mode")
export class mode extends Component {
    @property({ type: Label })
    modeLabel: Label = null;
    start() {}

    update(deltaTime: number) {}

    setMode(i: number) {
        this.modeLabel.string = `Mode ${i}`;
    }
}
