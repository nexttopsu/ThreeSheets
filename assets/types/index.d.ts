interface Socket {
    emit: (event: string, data?: any) => this,
    on: (event: string, callback: (data: any) => void) => this,
    off: (event: string, callback: (data: any) => void) => this,
    disconnect: () => this,
    connect: () => this,
    connected: boolean,
    id: string,
}

type IoOption = {
    query?: object;
}

interface SocketGameOpen {
    id: string;
    roomID: string;
    socketID: string;
    isReady: boolean;
    isLook: boolean;
    isDiscard: boolean;
    score: number;
    totalScore: number;
    pokerCount: number;
}

interface SocketGameRoom {
    id: string;
    playerCount: number;
    playerLimit: number;
    isGameStarted: boolean;
    isFull: boolean;
    isEmpty: boolean;
    homeowner: string;
    thisRound: string;
    prevWinner: string;
    jackpot: number;
    jackpotRound: number;
    createTime: number;   
}

interface SocketGamePlayer {
    id: string;
    roomID: string;
    socketID: string;
    isReady: boolean;
    isLook: boolean;
    isDiscard: boolean;
    score: number;
    totalScore: number;
    pokerCount: number;
}

type SocketGameRoomInfo = SocketGameRoom & {
    players: SocketGamePlayer[];
}

type SocketGameBet = {
    plays: SocketGamePlayer[];
    bet: number;
    userID: string;
    jackpot: number;
    thisRound: string;
    jackpotRound: number;
}

type SocketGameContrast = {
    a: string;
    b: string;
    winner: string;
}

type SocketGamePoker = [string, string, string]


declare var io: (url: string, option?: IoOption) => Socket;
