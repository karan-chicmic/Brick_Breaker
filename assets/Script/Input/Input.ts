import { _decorator, Component, director, EditBoxComponent, Label, Node } from "cc";
import { DataSingleton } from "../Singleton/DataSingleton";
const { ccclass, property } = _decorator;

@ccclass("Input")
export class Input extends Component {
    @property({ type: EditBoxComponent })
    nameEditBox: EditBoxComponent = null;
    @property({ type: EditBoxComponent })
    lifeEditBox: EditBoxComponent = null;
    @property({ type: Label })
    error: Label = null;
    start() {}

    onClick() {
        let lifes = parseInt(this.lifeEditBox.string);
        if (this.nameEditBox.string == "" || this.lifeEditBox.string == "") {
            this.error.string = "Please enter both fields";
        } else if (lifes > 10) {
            this.error.string = "Lives should be in range 0 to 10";
        } else {
            const dataSingleton = DataSingleton.getInstance();
            dataSingleton.setData("mode1Level", 1);
            dataSingleton.setData("mode2Level", 1);
            dataSingleton.setData("mode3Level", 1);
            dataSingleton.setData("mode4Level", 1);
            dataSingleton.setData("name", this.nameEditBox.string);
            dataSingleton.setData("lifes", this.lifeEditBox.string);
            director.loadScene("modes");
        }
    }
}
