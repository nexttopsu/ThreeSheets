import * as cc from 'cc';
import { _decorator, Component, NodeEventType, director, instantiate, Prefab, tween, Vec3, Label, Sprite, UITransform} from 'cc';

import { Cards } from './Cards'

const { ccclass, property } = _decorator;


@ccclass('Button')
export class Button extends Component {

    @property(Number)
    roadLength = 50;

    @property(Prefab)
    roadNode: Prefab = null;


    count = 0;
    // this.schedule  // 计时器
    // this.unschedule // 取消计时器
    // this.scheduleOnce  // 计时器

    start() {
        console.log('node start', director);
        // this.node.addChild(this.node.getChildByName("road"));
        this.node.on(NodeEventType.TOUCH_START, (e) => {
            console.log('click', e);
            if (this.count > 0) {
                return;
            }
            this.count = 0;
            this.schedule(this.createRandomNode, 0.5);
        }, this);

        // console.log(this.node.getComponent(UITransform).contentSize);
        const cardRoot = cc.find('Canvas/cardRoot');
        const size = cardRoot.getComponent(UITransform);

        let x = cardRoot.position.x + size.width;
        let y = cardRoot.position.y;

        // console.log("cc.find('Canvas/cardRoot')", size.x, size.y)
        this.createNode(x, y);


        console.log("cc.find('Canvas/Cards')", cc.find('Canvas/Cards').getComponent(Cards).getCards())
    }

    createNode(x: number, y: number) {
        const scene = director.getScene();
        const canvas = scene.getChildByName('Canvas');

        const node = instantiate(this.roadNode);
        const position = [x, y] as const;

        node.scale = new Vec3(0, 0);
        
        // node.getChildByName('Label').

        node.getChildByName('Label').getComponent(Label).string = `${this.count}`;

        tween(node).to(0.5, {
            scale: new Vec3(1, 1)
        }).start();

        console.log('position', position);

        node.setPosition(...position);
        // this.node.addChild(node);
        canvas?.addChild(node);
    }


    createRandomNode() {
        if (this.count >= this.roadLength) {
            this.unschedule(this.createRandomNode);
            this.count = 0;
            return;
        }
        else {
            this.count++;
        }

        const scene = director.getScene();
        const canvas = scene.getChildByName('Canvas');

        const node = instantiate(this.roadNode);
        const position = [Math.floor(Math.random() * 1280) - 1280/2, Math.floor(Math.random() * 720) - 720/2] as const;

        node.scale = new Vec3(0, 0);

        // node.getChildByName('Label').

        node.getChildByName('Label').getComponent(Label).string = `${this.count}`;

        tween(node).to(0.5, {
            scale: new Vec3(1, 1)
        }).start();

        console.log('position', position);

        node.setPosition(...position);
        // this.node.addChild(node);
        canvas?.addChild(node);
    }

    update(deltaTime: number) {
        
    }
}
