import { _decorator, Component, director, Label, Node } from "cc";
import { DataSingleton } from "../Singleton/DataSingleton";
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

    onClick() {
        const dataSingleton = DataSingleton.getInstance();
        dataSingleton.setData("mode", parseInt(this.modeLabel.string.charAt(this.modeLabel.string.length - 1)));
        director.loadScene("levels");
    }
}
