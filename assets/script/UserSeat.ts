import { _decorator, Component, Node, Prefab, UITransform, instantiate, EventTouch } from 'cc';
import { TableUser } from './TableUser';
import { Audio } from './utils';
import { connect } from './Network';

const { ccclass, property } = _decorator;

const GAP_SIDE = 30;
const GAP_USER = 120;
const OFFSET_SIDE = 50;
const SIZE = 60;

@ccclass('UserSeat')
export class UserSeat extends Component {
    @property(Prefab)
    userPrefab: Prefab = null;

    @property(Node)
    selfUserPosition: Node = null;

    count = 11;
    userID = '';
    list = [] as Node[];
    players: { avatar: string, node: Node, player: SocketGamePlayer }[] = [];

    start() {
        
    }

    private layout(count: number) {
        this.count = count;
        const { width, height } = this.node.getComponent(UITransform);
        const w = width / 2;
        const h = height / 2;

        const top = h - SIZE / 2 - GAP_SIDE;
        const right = w - SIZE / 2 - GAP_SIDE;
        const left = -right;

        const list = this.layoutSpaceCount(count);
        
        // 清除所有之前的节点
        this.list.forEach(node => node.destroy());
        this.list = [];

        // 创建自己的节点
        if (this.selfUserPosition) {
            const node = this.createNode();
            node.setPosition(this.selfUserPosition.position);
            this.list.push(node);
        }

        // 左边
        this.getSpaces(list[0]).forEach(y => {
            const node = this.createNode();
            node.setPosition(left, y + OFFSET_SIDE, node.position.y);
            this.list.push(node);
        });

        // 上边
        this.getSpaces(list[1], GAP_USER + 50).forEach(x => {
            const node = this.createNode();
            node.setPosition(x, top, node.position.y);
            this.list.push(node);
        });

        // 右边
        this.getSpaces(list[2]).forEach(y => {
            const node = this.createNode();
            const tableUser = node.getComponent(TableUser);
            node.setPosition(right, y + OFFSET_SIDE, node.position.y);
            tableUser.pokerPosition = 'left';
            this.list.push(node);
        });

        return this;
    }

    setPlayers(userID: string, players: SocketGamePlayer[]) {
        this.userID = userID;
        this.layout(players.length - 1);

        let list = [...players].map((player, index) => {
            return ({ player, avatar: (index + 1).toString(), node: this.list[0] });
        });

        const index = list.findIndex(val => val.player.id == this.userID);

        if (index != -1) {
            const list2 = list.splice(index);
            list = [...list2, ...list];
        }

        const [self, ...list3] = list;
        list = [self, ...list3.reverse()];

        this.players = list;

        list.forEach((item, index) => {
            const { player, avatar } = item;
            const node = this.list[index];
            item.node = node;
            if (node) {
                const user = node.getComponent(TableUser);
                user.avatar = avatar;
                user.player = player;
            }
        });
    }

    getNodeByPlayerID(id: string) {
        return this.players.find(val => val.player.id == id)?.node;
    }

    layoutSpaceCount(count: number): [number, number, number] {
        switch (count) {
            case 1:
                return [1,0,0];
            case 2:
                return [1,1,0];
            case 3:
                return [1,1,1];
            case 4:
                return [1,2,1];
            case 5:
                return [1,3,1];
            case 6:
                return [2,2,2];
            case 7:
                return [2,3,2];
            case 8:
                return [2,4,2];
            case 9:
                return [2,5,2];
            case 10:
                return [3,4,3];
            case 11:
                return [3,5,3];
            default:
                return [0, 0, 0]
        }
    }

    getSpaces(n: number, space = GAP_USER): number[] {
        if (n == 0) {
            return [];
        }
        
        if (n == 1) {
            return [0];
        }

        const s = Math.floor(n/2);
        const x = space/2;
        const l = [] as number[];
        const isOne = n%2 === 1;

        for(let i = 0; i < s; i++) {
            if (isOne) {
                l.push((i+1) * space);
            }
            else {
                l.push(x + i*space);
            }
        }

        const result = [...l.map(s => -s).reverse()];

        if (isOne) {
            result.push(0);
        }

        return [...result, ...l]
    }

    createNode() {
        const node = instantiate(this.userPrefab);
        this.node.addChild(node);
        return node
    }

    public onOperate(e: EventTouch, customData: string) {
        Audio('click');
        if (customData == 'look') {
            connect().emit('look');
        }
        else if(customData == 'discard') {
            connect().emit('discard');
        }
        else {
            const value = Number(customData) || 0;
            connect().emit('bet', value);
        }

        console.log(e, customData);
    }

    update(deltaTime: number) {
        
    }
}
