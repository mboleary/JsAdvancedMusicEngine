/**
 * Glue code for JAME
 */

import { initAudio, getAudioContext, startScheduler } from "./node_modules/libjame/src/Audio.js";
import Port, {PORT_DIRECTIONS, PORT_TYPES} from "./node_modules/libjame/src/Port.js";
import AudioPlayerNode from "./node_modules/libjame/src/nodes/AudioPlayerNode.js";
import AudioOutputNode from "./node_modules/libjame/src/nodes/AudioOutputNode.js";
import FilterNode from "./node_modules/libjame/src/nodes/FilterNode.js";

initAudio();

let apn = new AudioPlayerNode({
    sourceURL: "./static/test.wav",
    loop: true
});

// let apn2 = new AudioPlayerNode({
//     sourceURL: "./static/final.wav",
//     loop: true
// });

let fn = new FilterNode({
    filter: 440,
});

let aon = new AudioOutputNode();

// apn.ports.out.aud.connect(aon.ports.in.aud);
apn.ports.out.aud.connect(fn.ports.in.aud);
fn.ports.out.aud.connect(aon.ports.in.aud);
// apn2.ports.out.aud.connect(aon.ports.in.aud);

window.nodes = [aon, apn, fn];

window.ports = {};

window.ports.start = new Port({
    id: "demo_start", 
    type: PORT_TYPES.TRIGGER, 
    direction: PORT_DIRECTIONS.OUT, 
    name: "Start Playback"
});
window.ports.stop = new Port({
    id: "demo_stop", 
    type: PORT_TYPES.TRIGGER, 
    direction: PORT_DIRECTIONS.OUT, 
    name: "Stop Playback"
});
window.ports.pause = new Port({
    id: "demo_pause",
    type: PORT_TYPES.TRIGGER, 
    direction: PORT_DIRECTIONS.OUT, 
    name: "Pause Playback"
});
window.ports.loop = new Port({
    id: "demo_loop", 
    type: PORT_TYPES.PARAM, 
    defaultValue: true, 
    direction: PORT_DIRECTIONS.OUT, 
    name: "Loop"
});
window.ports.freq = new Port({
    id: "demo_freq",
    type: PORT_TYPES.PARAM,
    defaultValue: 1000, 
    direction: PORT_DIRECTIONS.OUT, 
    name: "Frequency"
});

window.ports.start.connect(apn.ports.in.start);
// window.ports.start.connect(apn2.ports.in.start);
window.ports.stop.connect(apn.ports.in.stop);
window.ports.pause.connect(apn.ports.in.pause);
window.ports.loop.connect(apn.ports.in.loop);
window.ports.freq.connect(fn.ports.in.freq);

// Add HTML El to show audioContext time
const p = document.createElement("p");
document.body.appendChild(p);

setInterval(() => {
    const ac = getAudioContext();
    p.innerText = ac.currentTime;
}, 250);

// Run the loop
startScheduler();