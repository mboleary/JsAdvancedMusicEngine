/**
 * Audio Module. Contains jmod, and some demos
 */

import {runTasks} from "./scheduler/Runner.js";

export default {
    name: "Audio",
    version: 0,
    init: () => {
        initAudio();
    },
    loop: () => {
        runTasks();
    }
}

let audioContext = null;
let stopScheduler = null;

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

export function startScheduler() {
    stopScheduler = window.requestAnimationFrame(startScheduler);
    runTasks();
}
