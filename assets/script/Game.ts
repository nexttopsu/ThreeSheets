import { _decorator, Component, director } from 'cc';
import { connect } from './Network';
import { Toast, Audio, systemEvent, getAuth } from './utils';
import { UserSeat } from './UserSeat';
import { UserPokerList } from './UserPokerList';

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Node)
    StartedNotNode: Node = null;

    @property(Node)
    StartedAlreadyNode: Node = null;

    socket: Socket;
    seat: SocketGameRoomInfo = null;

    auth = getAuth()
    userSeat: UserSeat = null;
    UserPokerList: UserPokerList = null;
    poker: string[] = [];

    start() {
        director.addPersistRootNode(this.node);
        console.log("Game start");

        systemEvent.on('UserSeat', this.userSeatInit, this);
        systemEvent.on('UserPokerList', this.userPokerInit, this);

        this.socket = connect();
        this.socket.on('open', (data: SocketGameOpen) => {
            console.log('open', data);
            if (!data.roomID) {
                // 预加载 2s
                this.scheduleOnce(() => {
                    director.preloadScene("table");
                }, 2);
            }
            else {
                Toast('正在重新连接');
                this.scheduleOnce(() => {
                    director.loadScene('table');
                }, 0.8);
            }
        })
        .on('seat', (data: SocketGameRoomInfo) => {
            console.log('seat', data);
            this.seat = data;
            if (director.getScene().name != 'table') {
                director.loadScene('table', () => {
                    this.updateInfo();
                });
                return;
            }

            this.updateInfo();
        })
        .on('info', (data: SocketGameRoom) => {
            console.log('info', data);
        })
        .on('plays', (data: SocketGamePlayer) => {
            console.log('plays', data);
            this.updateInfo();
        })
        .on('leave', () => {
            this.userSeat = null;
            this.seat = null;
            director.loadScene("main");
        })
        .on('ready', (data: SocketGamePlayer[]) => {
            console.log('ready', data);
            this.seat.players = data;
            this.updateInfo();
        })
        .on('poker', (data: SocketGamePoker) => {
            console.log('poker', data);
            this.poker = data;
            this.updatePoker();
        })
        .on('gamestart', (data: SocketGameRoomInfo) => {
            console.log('gamestart', data);
            this.seat = data;
            this.poker = [];
            this.updateInfo();
        })
        .on('gameover', (data: SocketGameRoom) => {
            console.log('gameover', data);
        })
        .on('thisround', (data: SocketGameRoom) => {
            console.log('thisround', data);
            this.seat.thisRound = data.thisRound;
            this.updateInfo();
        })
        .on('look', (data: SocketGamePlayer) => {
            console.log('look', data);
        })
        .on('discard', (data: SocketGamePlayer) => {
            console.log('discard', data);
        })
        .on('bet', (data: SocketGameBet) => {
            console.log('bet', data);
            this.seat.thisRound = data.thisRound;
            this.updateInfo();
        })
        .on('contrast', (data: SocketGameContrast) => {
            console.log('contrast', data);
        })
        .on('error', ({ type, msg }: { type: string, msg: string}) => {
            Toast(`[${type.toLocaleUpperCase()}]  ${msg}`, 'warn');
        });
    }

    userSeatInit() {
        const canvas = director.getScene().getChildByName('Canvas');
        const userSeatNode = canvas.getChildByName('UserSeat');

        this.userSeat = userSeatNode.getComponent(UserSeat);
        this.updateInfo();
    }

    userPokerInit() {
        const canvas = director.getScene().getChildByName('Canvas');
        const userPokerNode = canvas.getChildByName('UserPoker');
        this.UserPokerList = userPokerNode.getComponent(UserPokerList);
        this.updatePoker();
    }

    updateInfo() {
        this.updateSeat();
    }

    updatePlayer() {
        this.userSeat?.setPlayers('', this.seat?.players || []);
    }

    updateSeat() {
        const userSeat = this.userSeat;
        const seat = this.seat;
        if (!userSeat || !seat) return;

        userSeat.setPlayers('', seat.players);

        // userSeat.setReady(!seat.isGameStarted);
        // userSeat.updateLook();
        // userSeat.updateReady();
        // userSeat.updateThisround(seat.thisRound);
    }

    updatePoker() {
        const userPoker = this.UserPokerList;
        const seat = this.seat;
        if (!userPoker || !seat) return;

        // userPoker.setPoker(this.poker);
    }

    update(deltaTime: number) {
        
    }
}
