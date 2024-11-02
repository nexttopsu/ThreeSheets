import * as cc from 'cc';
import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

// https://tairraos.github.io/Poker.JS/demo/demo.html
// https://tairraos.github.io/Poker.JS/demo/sprite.html
// Image Size: 2925 x 1500 Card Size: 225 x 300

const ValueMap = ['n','b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];

const POKER = {
    WIDTH: 225,
    HEIGHT: 300,
    COLOR: ['#FFFFFF', '#CCCCCC']
} as const;


@ccclass('Poker')
export class Poker extends Component {
    @property(Number)
    public value: number = 0;

    @property(Number)
    public design: number = 0;

    private _selected = false;

    static POKER = POKER;

    start() {
        this.init();
    }

    init() {
        const sprite = this.node.getChildByName('Sprite');
        sprite.setPosition(
            -(POKER.WIDTH/2 + this.value * POKER.WIDTH), 
            POKER.HEIGHT/2 + this.design * POKER.HEIGHT
        );
    }

    set selected(selected: boolean) {
        this._selected = selected;
        const sprite = this.node.getChildByName('Sprite');
        sprite.getComponent(cc.Sprite).color = new cc.Color(selected ? POKER.COLOR[1] : POKER.COLOR[0]);
    }

    get selected() {
        return this._selected;
    }

    setPoker(val: string) {
        const [value, design] = this.valToArray(val);  
        this.value = value;
        this.design = design;
        this.init();
    }

    valToArray(val: string): [number, number] {
        if (!this.hasPoker(val)) {
            return [3, 4];
        }

        if (val[0] == 'o') {
            return [1, 4]
        }
        if (val[0] == 'p') {
            return [0, 4]
        }

        if (!this.hasPoker(val)) {
            return [3, 4]
        }

        let [v, n] = val.split('');
        let d = Number(n);
        let i = ValueMap.indexOf(v);

        if (d < 0 || d > 4 || i == -1) {
            i = 3;
            d = 4;
        }

        return [i, d];
    }

    hasPoker(value: string) {
        return /^\w[0123]$/i.test(value)
    }

    update(deltaTime: number) {
        
    }
}
