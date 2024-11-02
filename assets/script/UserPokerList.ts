import { _decorator, Component, Node, Prefab, instantiate, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;
import { Poker } from './Poker';
import { UserSeat } from './UserSeat';

@ccclass('UserPokerList')
export class UserPokerList extends Component {
    @property(Node)
    dealerNode: Node = null;

    @property(Prefab)
    pokerPrefab: Prefab = null;

    @property(Node)
    pokerPosNode: Node = null;

    @property(UserSeat)
    userSeat: UserSeat = null;

    offset = 45;
    selfNodes: Node[] = [];
    otherNodes: Node[] = [];

    start() {
        this.node.setSiblingIndex(99);
    }

    updatePoker(data: SocketGamePoker) {
        const dealerPosition = this.dealerNode.position;
        const parent = this.pokerPosNode;
        const newList: Node[] = [];
        const isUserPoker = this.selfNodes.length > 0;

        console.log('dealerPosition', dealerPosition);

        if (isUserPoker) {
            this.selfNodes.forEach(node => node.destroy());
            this.selfNodes = [];
        }

        for(let i=0; i< data.length; i++) {
            const node = instantiate(this.pokerPrefab);
            const x = parent.position.x + i * this.offset;
            const y = parent.position.y;

            node.getComponent(Poker).setPoker(data[i]);
            node.setPosition(dealerPosition);

            if (!isUserPoker) {
                node.scale = new Vec3(0, 0);
                tween(node).delay(i * 0.3).to(0.3, {
                    scale: new Vec3(0.5, 0.5),
                    position: new Vec3(x, y)
                }).start();
            }
            else {
                node.setScale(0.5, 0.5);
                node.setPosition(x, y);
            }

            newList.push(node);
            node.parent = this.node;
        }

        this.selfNodes = newList;
    }

    $onDestroy() {
        this.selfNodes.forEach(node => node.destroy());
        this.otherNodes.forEach(node => node.destroy());
        this.selfNodes = [];
        this.otherNodes = [];
    }

    protected onDestroy(): void {
        this.$onDestroy();
    }

    updateOtherPoker(id: string, list: SocketGamePoker) {
        console.log('更新其他人的手牌', id, list);
        this.otherNodes.forEach(node => node.destroy());
        this.otherNodes = [];

        const parent = this.userSeat.getNodeByPlayerID(id);
        list.forEach((val, i) => {
            const node = instantiate(this.pokerPrefab);
            node.setScale(0.3, 0.3);
            node.getComponent(Poker).setPoker(val);

            node.setPosition(parent.position.x + i * 24, parent.position.y - 40);
            node.parent = this.node;
            this.otherNodes.push(node);
        });
    }

    update(deltaTime: number) {
        
    }
}


