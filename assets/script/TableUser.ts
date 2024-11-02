import { _decorator, Component, Label, Sprite, SpriteAtlas, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TableUser')
export class TableUser extends Component {
    @property(Sprite)
    public avatarSprite: Sprite = null;

    @property(SpriteAtlas)
    public avatarSpriteAtals: SpriteAtlas = null;

    @property(Label)
    public scoreLabel: Label = null;

    @property(Label)
    public pokerCountLabel: Label = null;
    
    @property(Label)
    public UserIdLabel: Label = null;

    @property(Node)
    public PokerNode: Node = null;

    _avatar = '1';
    _userID = '';
    _score = 0;
    _pokerCount = 0;
    _pokerPosition: 'left' | 'right' = 'left';

    _player: SocketGamePlayer = {
        id: '',
        roomID: '',
        socketID: '',
        isReady: false,
        isLook: false,
        isDiscard: false,
        score: 0,
        totalScore: 0,
        pokerCount: 0
    }
    
    get userID() {
        return this._userID;
    }

    set userID(value: string) {
        this._userID = value;
        this.UserIdLabel.string = value;
    }

    get score() {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
        this.scoreLabel.string = value.toString();
    }

    get pokerLength() {
        return this._pokerCount;
    }

    set pokerLength(value: number) {
        this._pokerCount = value;
        this.pokerCountLabel.string = value.toString();
    }

    get avatar() {
        return this._avatar;
    }

    get player() {
        return this._player;
    }

    set player(player: SocketGamePlayer) {
        this._player = player;
        this.userID = player.id;
        this.score = player.score;
        this.pokerLength = player.pokerCount;
    }

    set avatar(value: string) {
        const avatarSprite = this.avatarSprite;
        const avatarSpriteAtals = this.avatarSpriteAtals;
        const spriteFrame = avatarSpriteAtals.getSpriteFrame(value);

        if (spriteFrame) {
            this._avatar = value;
            avatarSprite.spriteFrame = spriteFrame;
        }
        else {
            this._avatar = '1';
            avatarSprite.spriteFrame = avatarSpriteAtals.getSpriteFrame('1');
        }
    }

    get pokerPosition() {
        return this._pokerPosition;
    }

    set pokerPosition(type: 'left' | 'right') {
        this.PokerNode.setPosition(type === 'left' ? -50 : 50, -20);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}
