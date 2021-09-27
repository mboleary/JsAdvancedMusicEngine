/**
 * Audio Module. Contains jmod, and some demos
 */

export default {
    name: "Audio",
    version: 0,
    init: () => {
        initAudio();
    },
    loop: () => {}
}

let audioContext = null;

export function initAudio() {
    audioContext = new AudioContext();
}

export function resumeAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

export function getAudioContext() {
    return audioContext;
}