import { _decorator, Component, instantiate, Label, Node, Prefab } from "cc";
import { mode } from "./SingleMode";
import { DataSingleton } from "../Singleton/DataSingleton";
const { ccclass, property } = _decorator;

@ccclass("Modes")
export class Modes extends Component {
    @property({ type: Prefab })
    modePrefab: Prefab = null;
    @property({ type: Label })
    msg: Label = null;

    start() {
        for (let i = 1; i < 5; i++) {
            let modeNode = instantiate(this.modePrefab);
            modeNode.getComponent(mode).setMode(i);
            this.node.addChild(modeNode);
        }
        const dataSingleton = DataSingleton.getInstance();
        const name = dataSingleton.getData("name");
        this.msg.string = `${name} Select your game mode`;
    }

    update(deltaTime: number) {}
}
