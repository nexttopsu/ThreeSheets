import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cards')
export class Cards extends Component {
    start() {

    }

    get cards() {
        console.log('cards methods');
        return 'cards methods'
    }

    getCards() {
        return 'getCards'
    }

    update(deltaTime: number) {
        
    }
}
