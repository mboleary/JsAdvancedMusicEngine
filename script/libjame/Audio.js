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

    console.log("Created Audio Context:", audioContext);
}

export function resumeAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

export function getAudioContext() {
    console.log("Getting Audio Context:", audioContext);
    return audioContext;
}