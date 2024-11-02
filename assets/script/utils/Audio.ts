import { resources, AudioClip, AudioSource, error } from 'cc';

export function Audio(name: 'click' | 'win' | 'toast') {
    resources.load(`audio/${name}`, AudioClip, (err, audioClip) => {
        if (err) {
            error("Failed to load audio clip:", err);
            return;
        }

        const audioEngine = new AudioSource();

        // 播放加载的音频文件
        audioEngine.clip = audioClip;
        audioEngine.play();
    });
}
