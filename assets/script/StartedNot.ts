import { _decorator, Component, Button, Label, Node, Color, Prefab, instantiate } from 'cc';
import { UserSeat } from './UserSeat';
import { Audio } from './utils';
import net from './Network';

const { ccclass, property } = _decorator;

@ccclass('StartedNot')
export class StartedNot extends Component {
    
    @property(UserSeat)
    userSeat: UserSeat = null;

    @property(Button)
    readyButton: Button = null;

    @property(Prefab)
    tipPrefab: Prefab = null;

    labels: Node[] = [];

    start() {

    }

    protected onDestroy(): void {
        console.log('卸载， StartedNot');
    }

    updateData(seat: SocketGameRoomInfo) {
        const userSeat = this.userSeat;
        const userID = userSeat.userID;
        const label = this.readyButton.getComponentInChildren(Label);
        const player = seat.players.find(u => u.id == userID);
        const readyAll = seat.players.every(item => item.id == seat.homeowner || item.isReady);

        // 更新视图
        this.updateView(seat.players, userSeat);

        this.readyButton.interactable = true;
        label.outlineColor = new Color('#4681FF');

        // 房主
        if (userID == seat.homeowner) {
            if (seat.playerCount <= 1 || !readyAll) {
                this.readyButton.interactable = false;
                label.outlineColor = new Color('#C9C9C9');
            }

            label.string = '开始';
            return;
        }

        label.string = player.isReady ? '取消' : '准备';
        console.log(seat.players);
    }

    updateView(players: SocketGamePlayer[], userSeat: UserSeat) {
        this.labels.forEach(item => item.destroy());
        this.labels = [];

        players.forEach(player => {
            if (player.isReady) {
                const parent = userSeat.getNodeByPlayerID(player.id);
                if (parent) {
                    const node = this.createLabelNode();
                    node.setPosition(parent.position);
                }
            }
        });
    }

    createLabelNode() {
        const node = instantiate(this.tipPrefab);
        this.node.addChild(node);
        this.labels.push(node);
        return node;
    }

    public onReadyClick() {
        Audio('click');
        net.socket.emit('ready');
    }

    update(deltaTime: number) {
        
    }
}


