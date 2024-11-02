import { _decorator, director, Component, Label, Node, Prefab, instantiate, tween, Vec3 } from 'cc';
import { getAuth } from './utils/auth';
import { StartedNot } from './StartedNot';
import { StartedAlready } from './StartedAlready';
import { UserSeat } from './UserSeat';
import { Toast, Audio } from './utils';
import net from './Network';
import { UserPokerList } from './UserPokerList';


const { ccclass, property } = _decorator;

@ccclass('GameStarted')
export class GameStarted extends Component {

    @property(Label)
    userIdLabel: Label = null;

    @property(Label)
    roomIdLabel: Label = null;

    @property(Node)
    StartedNotNode: Node = null;

    @property(Node)
    StartedAlreadyNode: Node = null;
    
    @property(UserSeat)
    userSeat: UserSeat = null;

    @property(UserPokerList)
    userPokerList: UserPokerList = null;

    @property(Node)
    thisRoundNode: Node = null;

    @property(Node)
    settlementNode: Node = null;

    seat: SocketGameRoomInfo = null;
    userID: string = '';
    roomID: string = '';

    pokerList: SocketGamePoker = null;

    isSettlement = false;

    start() {
        this.userID = getAuth();
        this.userIdLabel.string = `ID: ${this.userID}`;
        net.socket.on('seat', this.onSocketSeat);
        net.socket.on('leave', this.onSocketLeave);
        net.socket.on('ready', this.onSocketReady);
        net.socket.on('error', this.onSocketError);

        net.socket.on('gamestart', this.onGameStart);
        net.socket.on('poker', this.onGamePoker);
        net.socket.on('thisround', this.onGameThisRound);
        net.socket.on('bet', this.onGameBet);
        net.socket.on('gameover', this.onGameOver);
        net.socket.on('look', this.onGameLook);
        net.socket.on('discard', this.onGameDiscard);
        net.socket.on('contrast', this.onGameContrast);

        net.socket.emit('seat');
    }

    protected onDestroy(): void {
        net.socket.off('seat', this.onSocketSeat);
        net.socket.off('leave', this.onSocketLeave);
        net.socket.off('ready', this.onSocketReady);
        net.socket.off('error', this.onSocketError);

        net.socket.off('gamestart', this.onGameStart);
        net.socket.off('poker', this.onGamePoker);
        net.socket.off('thisround', this.onGameThisRound);
        net.socket.off('bet', this.onGameBet);
        net.socket.off('gameover', this.onGameOver);
        net.socket.off('look', this.onGameLook);
        net.socket.off('discard', this.onGameDiscard);
        net.socket.off('contrast', this.onGameContrast);
    }

    public exitRoom() {
        Audio('click');
        this.scheduleOnce(() => {
            net.socket.emit('leave');
        }, 0.1);
    }

    // 关闭结算面板
    public closeSettlementNode() {
        this.isSettlement = false;
        this.settlementNode.active = false;
        this.updateState();
    }

    updateState() {
        const data = this.seat;
        const userID = this.userID;
        const player = data.players.find(item => item.id == userID);

        if (!data.isGameStarted && !this.isSettlement) {
            this.StartedNotNode.active = true;
            this.StartedAlreadyNode.active = false;
            this.StartedNotNode.getComponent(StartedNot).updateData(data);
        }
        else if (!player.isDiscard && data.thisRound == userID && data.isGameStarted) {
            this.StartedNotNode.active = false;
            this.StartedAlreadyNode.active = true;
            this.StartedAlreadyNode.getComponent(StartedAlready).updateData(data);
        }
        else {
            this.StartedNotNode.active = false;
            this.StartedAlreadyNode.active = false;
        }


        // 结算面板
        if (this.isSettlement) {
            this.settlementNode.active = true;
        }
        else {
            this.settlementNode.active = false;
        }


        // 如果游戏已经开始 并且手里没有牌 -> 获取手牌
        if (data.isGameStarted && !this.pokerList) {
            net.socket.emit('poker');
        }

        if (data.isGameStarted) {
            const node = this.userSeat.getNodeByPlayerID(data.thisRound);
            if (node) {
                this.thisRoundNode.active = true;
                this.thisRoundNode.setPosition(node.position);
            }
        }
        else {
            this.thisRoundNode.active = false;
        }
    }

    onSocketLeave = () => {
        console.log('leave room')
        this.seat = null;
        director.loadScene("main");
    }

    onSocketSeat = (data: SocketGameRoomInfo) => {
        console.log('seat', data);
        this.seat = data;
        this.roomID = data.id;
        this.roomIdLabel.string = `房间号：${this.roomID}`;

        this.userSeat.setPlayers(this.userID, data.players);
        this.updateState();
    }

    onSocketReady = (data: SocketGamePlayer[]) => {
        console.log('ready', data);
        this.seat.players = data;
        this.updateState();
    }

    onGameStart = (data: SocketGameRoomInfo) => {
        console.log('gamestart', data);
        this.seat.isGameStarted = true;
        this.seat.thisRound = data.thisRound;
        this.isSettlement = false;
        this.updateState();
    }

    onGamePoker = (data: SocketGamePoker | { id: string, list: SocketGamePoker }) => {
        console.log('----poker', data);
        // 自己的牌
        if (Array.isArray(data)) {
            this.pokerList = data;
            this.userPokerList.updatePoker(data);
        }
        else {
            this.userPokerList.updateOtherPoker(data.id, data.list);
        }
    }

    onGameThisRound = (data: SocketGameRoom) => {
        console.log('gamethisround', data);
        this.seat.thisRound = data.thisRound;
        this.updateState();
    }

    onGameBet = (data: SocketGameBet) => {
        this.seat.thisRound = data.thisRound;
        this.updateState();
        console.log('gamebet', data);
    }

    onGameOver = (data: SocketGameRoomInfo) => {
        console.log('gameover', data);
        this.seat.isGameStarted = false;
        this.pokerList = null;
        this.userPokerList.$onDestroy();
        this.isSettlement = true;
        this.seat.players.forEach(player => {
            player.isReady = false;
        });
        this.updateState();
        // 结算 --...

    }

    onGameLook = (data: SocketGamePlayer[]) => {
        console.log('gamelook', data);
        this.seat.players = data;
        this.updateState();
    }

    onGameDiscard = (data: SocketGamePlayer[]) => {
        console.log('gamediscard', data);
        this.seat.players = data;
        this.updateState();
    }

    onGameContrast = (data: SocketGameContrast) => {
        console.log('contrast', data);
        const failUserID = data.winner == data.a ? data.b : data.a;

        const player = this.seat.players.find(item => item.id == failUserID);
        player.isDiscard = true;
        this.updateState();
    }

    onSocketError({ type, msg }: { type: string, msg: string}) {
        Toast(`[${type.toLocaleUpperCase()}]  ${msg}`, 'warn');
    }

    update(deltaTime: number) {
        
    }
}
