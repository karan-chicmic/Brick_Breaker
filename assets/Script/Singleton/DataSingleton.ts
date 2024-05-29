import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DataSingleton")
export class DataSingleton {
    private static _instance: DataSingleton | null = null;

    private constructor() {}

    private _data: { [key: string]: any } = {};

    public static getInstance(): DataSingleton {
        if (!DataSingleton._instance) {
            DataSingleton._instance = new DataSingleton();
        }
        return DataSingleton._instance;
    }

    public setData(key: string, value: any): void {
        this._data[key] = value;
    }

    public getData(key: string): any | null {
        return this._data[key] || null;
    }

    // const dataSingleton = DataSingleton.getInstance();
    // dataSingleton.setData('score', 100);

    // const dataSingleton = DataSingleton.getInstance();
    // const score = dataSingleton.getData('score');
}
