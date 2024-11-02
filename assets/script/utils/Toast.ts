import { Node, Label, Color, find, tween, Vec3, UITransform } from 'cc';
import { Audio } from './Audio';

let toast: Node = null;

function hideToast() {
    toast?.destroy();
    toast = null;
}

export function Toast(message: string, type: '' | 'warn'='') {
    if (toast) hideToast()

    Audio('toast');

    const canvas = find('Canvas');
    const ui = canvas.getComponent(UITransform);
    const h = ui.height / 2 - 40;
    
    toast = new Node('Toast');
    const label = toast.addComponent(Label);

    label.string = message;
    label.fontSize = 24;
    label.enableOutline = true;
    label.outlineColor = new Color(type === 'warn' ? '#FF3646' : '#3A98FF' ); // 描边颜色
    label.outlineWidth = 2; // 描边宽度
    toast.setPosition(0, -( h + 30));
    toast.setScale(0, 0);

    canvas.addChild(toast);

    tween(toast).to(0.2, {
        position: new Vec3(0, -h),
        scale: new Vec3(1, 1)
    }).to(2, {
        position: new Vec3(0, -h)
    }).call(() => {
        tween(toast).to(0.2, {
            scale: new Vec3(0, 0),
            position: new Vec3(0, -( h + 30)),
        }).call(hideToast).start();
    }).start();

    return hideToast
}
