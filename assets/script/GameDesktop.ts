import { _decorator, director, Component, Label, EditBox } from 'cc';
import { getAuth } from './utils/auth';

import { Toast, Audio } from './utils';
import net from './Network';

const { ccclass, property } = _decorator;

@ccclass('GameDesktop')
export class GameDesktop extends Component {

    @property(Label)
    UserIDLabel: Label = null;

    @property(EditBox)
    RoomInputTarget: EditBox = null;

    start() {
        this.UserIDLabel.string = `ID: ${getAuth()}`;
        net.socket.on('open', this.onSocketOpen);
        net.socket.on('room', this.onSocketRoom);
        net.socket.on('error', this.onSocketError);
    }

    protected onDestroy(): void {
        net.socket.off('open', this.onSocketOpen);
        net.socket.off('room', this.onSocketRoom);
        net.socket.off('error', this.onSocketError);
    }

    onSocketRoom() {
        director.loadScene('table');
    }

    onSocketError({ type, msg }: { type: string, msg: string}) {
        Toast(`[${type.toLocaleUpperCase()}]  ${msg}`, 'warn');
    }

    onSocketOpen = (data: SocketGameOpen) => {
        if (!data.roomID) {
            this.scheduleOnce(() => {
                director.preloadScene("table");
            }, 1.5);
        }
        else {
            director.loadScene('table');
        }
    }

    public createRoom() {
        Toast('正在创建房间');
        net.socket.emit('create');
    }

    public joinRoom() {
        const value = this.RoomInputTarget.string;
        
        if (!value) {
            Toast('请输入房间号', 'warn');
            return;
        }

        if (!/\d{6}/.test(value)) {
            Toast('房间号格式不正确', 'warn');
            return;
        }

        Audio('click');
        net.socket.emit('join', value);
    }

    update(deltaTime: number) {
        
    }
}
