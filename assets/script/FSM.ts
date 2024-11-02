import { Component } from 'cc';

// 状态机管理器
export class FSMManager {
    stateList: FSMState[] = [];
    currentIndex = -1;

    changeState(stateID: number) {
        if (this.currentIndex != -1) {
            this.stateList[this.currentIndex].onExit();
        }

        this.currentIndex = stateID;
        this.stateList[this.currentIndex].onEnter();
    }

    onUpdate(dt: number) {
        if (this.currentIndex != -1) {
            this.stateList[this.currentIndex].onUpdate(dt);
        }
    }
}


// 有限状态机
export class FSMState {
    stateID: number;
    component: Component;
    fsmManager: FSMManager;

    constructor(stateID: number, component: Component, fsmManager: FSMManager) {
        this.stateID = stateID;
        this.component = component;
        this.fsmManager = fsmManager;
    }

    onEnter() {}

    onExit() {}

    onUpdate(dt: number) {}
}
