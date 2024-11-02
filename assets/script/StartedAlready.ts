import { _decorator, Component, instantiate, Label, Node, Button, Prefab } from 'cc';
import { UserSeat } from './UserSeat';
import { Audio } from './utils';
import net from './Network';

const { ccclass, property } = _decorator;

@ccclass('StartedAlready')
export class StartedAlready extends Component {

    @property(UserSeat)
    userSeat: UserSeat = null;

    @property(Prefab)
    buttonPrefab: Prefab = null;

    @property(Node)
    posNode: Node = null;

    list = [
        { label: '看牌', value: 'look' },
        { label: '弃牌', value: 'discard' },
        { label: '跟', value: 0 },
        { label: '+1', value: 1 },
        { label: '+2', value: 2 },
        { label: '+3', value: 3 },
        { label: '+5', value: 5 },
        { label: '+10', value: 10 },
    ]

    buttons: Node[] = [];

    start() {
        
    }

    onOperate(value: number | string, data?: string) {
        Audio('click');
        if (typeof value == 'string') {
            net.socket.emit(value, data);
            return;
        }

        net.socket.emit('bet', value);
    }

    updateData(seat: SocketGameRoomInfo) {
        this.buttons.forEach(node => node.destroy());
        this.buttons = [];

        const list = this.list;
        const userSeat = this.userSeat;
        const userID = userSeat.userID;
        const player = seat.players.find(item => item.id === userID);

        const n = this.posNode || this.node;
        for(let i = 0, index = 0; i < list.length; i++) {
            const item = list[i];
            if (i == 0 && player.isLook) continue;
            const node = instantiate(this.buttonPrefab);
            node.setPosition(n.position.x + index * 120, n.position.y);

            if (typeof item.value === 'number' && !player.isLook) {
                node.getComponentInChildren(Label).string = item.label + ' /2';
            }
            else {
                node.getComponentInChildren(Label).string = item.label;
            }

            node.on(Node.EventType.TOUCH_END, () => this.onOperate(item.value));
            node.parent = this.node;
            node.setSiblingIndex(100 + i);
            this.buttons.push(node);

            index++;
        }

        if (player.isLook) {
            this.updateUserContrast(seat);
        }
    }

    updateUserContrast(seat: SocketGameRoomInfo) {
        const userSeat = this.userSeat;
        seat.players.forEach(player => {
            if (player.isLook && !player.isDiscard && player.id !== userSeat.userID) {
                const btn = instantiate(this.buttonPrefab);
                const node = userSeat.getNodeByPlayerID(player.id);
                btn.getComponentInChildren(Label).string = '比较';
                
                if (node) {
                    btn.setPosition(node.position.x + 50, node.position.y - 30);
                }

                btn.on(Node.EventType.TOUCH_END, () => this.onOperate('contrast', player.id));

                btn.parent = this.node;
                this.buttons.push(btn);
            }
        });
    }

    update(deltaTime: number) {
        
    }
}


