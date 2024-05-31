import { _decorator, Component, director, EditBoxComponent, input, Label, Node, sys } from "cc";
import { DataSingleton } from "../Singleton/DataSingleton";
const { ccclass, property } = _decorator;
let users = {
    name: "",
    mode1Level: 1,
    mode2Level: 1,
    mode3Level: 1,
    mode4Level: 1,
};
@ccclass("Input")
export class Input extends Component {
    @property({ type: EditBoxComponent })
    nameEditBox: EditBoxComponent = null;
    @property({ type: EditBoxComponent })
    lifeEditBox: EditBoxComponent = null;
    @property({ type: Label })
    error: Label = null;
    onLoad() {
        this.nameEditBox.string = sys.localStorage.getItem("lastUser") || "";
    }
    start() {}

    onClick() {
        let lifes = parseInt(this.lifeEditBox.string);
        if (this.nameEditBox.string == "" || this.lifeEditBox.string == "") {
            this.error.string = "Please enter both fields";
        } else if (lifes > 10) {
            this.error.string = "Lives should be in range 0 to 10";
        } else {
            sys.localStorage.setItem("lastUser", this.nameEditBox.string);
            this.checkIfUserExist();
        }
    }

    checkIfUserExist() {
        let user = JSON.parse(sys.localStorage.getItem(this.nameEditBox.string));
        if (user) {
            this.updateSingleton(true, user);
            director.loadScene("modes");
        } else {
            users.name = this.nameEditBox.string;
            sys.localStorage.setItem(this.nameEditBox.string, JSON.stringify(users));
            this.updateSingleton(false, user);
            director.loadScene("modes");
        }
    }

    updateSingleton(userExist: boolean, user: any) {
        let dataSingleton = DataSingleton.getInstance();
        dataSingleton.setData("lifes", this.lifeEditBox.string);
        if (!userExist) {
            dataSingleton.setData("name", this.nameEditBox.string);
        } else {
            dataSingleton.setData("mode1Level", user.mode1Level);
            dataSingleton.setData("mode2Level", user.mode2Level);
            dataSingleton.setData("mode3Level", user.mode3Level);
            dataSingleton.setData("mode4Level", user.mode4Level);
            dataSingleton.setData("name", user.name);
        }
    }
}
