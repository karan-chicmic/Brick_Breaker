import { _decorator, Component, director, instantiate, Node, Prefab } from "cc";
import { levels } from "./levels";
import { DataSingleton } from "../Singleton/DataSingleton";
const { ccclass, property } = _decorator;

@ccclass("Addlevels")
export class Addlevels extends Component {
    @property({ type: Prefab })
    levelPrefab: Prefab = null;
    start() {
        let dataSingleton = DataSingleton.getInstance();
        let mode = dataSingleton.getData("mode");
        let currLevel = dataSingleton.getData(`mode${mode}Level`);
        for (let i = 0; i < 6; i++) {
            let levelNode = instantiate(this.levelPrefab);
            levelNode.getComponent(levels).customLevel(i, mode, currLevel);
            this.node.addChild(levelNode);
        }
    }

    update(deltaTime: number) {}

    leftClick() {
        director.loadScene("modes");
    }
    rightClick() {
        director.loadScene("main");
    }
}
