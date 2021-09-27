/**
 * Glue code for JAME
 */

import { initAudio } from "./libjame/Audio.js";
import Port, {PORT_DIRECTIONS, PORT_TYPES} from "./libjame/Port.js";
import AudioPlayerNode from "./libjame/nodes/AudioPlayerNode.js";
import AudioOutputNode from "./libjame/nodes/AudioOutputNode.js";

initAudio();

let apn = new AudioPlayerNode({
    sourceURL: "./static/test.wav",
    loop: true
});

let apn2 = new AudioPlayerNode({
    sourceURL: "./static/final.wav",
    loop: true
});

let aon = new AudioOutputNode();

apn.ports.out.aud.connect(aon.ports.in.aud);
apn2.ports.out.aud.connect(aon.ports.in.aud);

window.nodes = [aon, apn, apn2];

window.ports = {};

window.ports.start = new Port("demo_start", null, PORT_TYPES.TRIGGER, null, null, PORT_DIRECTIONS.OUT, "Start Playback");
window.ports.stop = new Port("demo_stop", null, PORT_TYPES.TRIGGER, null, null, PORT_DIRECTIONS.OUT, "Stop Playback");
window.ports.pause = new Port("demo_pause", null, PORT_TYPES.TRIGGER, null, null, PORT_DIRECTIONS.OUT, "Pause Playback");
window.ports.loop = new Port("demo_loop", null, PORT_TYPES.PARAM, null, true, PORT_DIRECTIONS.OUT, "Loop");

window.ports.start.connect(apn.ports.in.start);
window.ports.start.connect(apn2.ports.in.start);
window.ports.stop.connect(apn.ports.in.stop);
window.ports.pause.connect(apn.ports.in.pause);
window.ports.loop.connect(apn.ports.in.loop);