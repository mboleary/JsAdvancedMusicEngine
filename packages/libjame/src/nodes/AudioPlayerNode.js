import Node from "../Node.js";
import Port, {PORT_DIRECTIONS, PORT_TYPES, buildPortObj} from "../Port.js";
import { getAudioContext, resumeAudio } from "../Audio.js";



export default class AudioPlayerNode extends Node {
    constructor(params) {
        super(params);

        this.sourceURL = params.sourceURL;
        this.playbackRate = params.defaultPlaybackRate || 1;
        this.mute = params.defaultMute || false;
        this.volume = params.defaultVolume || 1;
        this.loop = params.loop || false;

        // Track Tempo, length, and key
        this.tempo = params.tempo;
        this.keySig = params.keySig || null;
        this.timeNum = params.timeNum;
        this.timeDenom = params.timeDenom;

        // Create Audio Element
        const audioContext = getAudioContext();
        this._audio = new Audio(this.sourceURL);
        this._track = audioContext.createMediaElementSource(this._audio);

        // Create Interface ports
        let ports = [];

        // Audio ports
        ports.push(new Port("aud", this, PORT_TYPES.AUDIO, this._track, null, PORT_DIRECTIONS.OUT, "Audio Out"));

        // Param Ports In
        ports.push(new Port("loop", this, PORT_TYPES.PARAM, null, false, PORT_DIRECTIONS.IN, "Loop", null, null, (value) => this.onUpdate("loop", value)));
        ports.push(new Port("rate", this, PORT_TYPES.PARAM, null, false, PORT_DIRECTIONS.IN, "Playback Rate", null, null, (value) => this.onUpdate("playbackRate", value)));
        ports.push(new Port("mute", this, PORT_TYPES.PARAM, null, false, PORT_DIRECTIONS.IN, "Mute", null, null, (value) => this.onUpdate("mute", value)));
        ports.push(new Port("volume", this, PORT_TYPES.PARAM, null, 1, PORT_DIRECTIONS.IN, "Volume", null, null, (value) => this.onUpdate("volume", value)));

        // Param ports out
        ports.push(new Port("tempo", this, PORT_TYPES.PARAM, null, params.tempo, PORT_DIRECTIONS.OUT, "Tempo", null, null));

        // Trigger Ports In
        ports.push(new Port("start", this, PORT_TYPES.TRIGGER, () => this._play(), null, PORT_DIRECTIONS.IN, "Start playback", null, null));
        ports.push(new Port("stop", this, PORT_TYPES.TRIGGER, () => this._stop(), null, PORT_DIRECTIONS.IN, "Stop playback", null, null));
        ports.push(new Port("pause", this, PORT_TYPES.TRIGGER, () => this._pause(), null, PORT_DIRECTIONS.IN, "Pause playback", null, null));

        this.ports = buildPortObj(ports, this.id);
    }

    _play() {
        console.log("play");
        resumeAudio();
        this._audio.play();
    }

    _pause() {
        this._audio.pause();
    }

    _stop() {
        this._audio.pause();
        this._audio.currentTime = 0;
    }

    onUpdate (field, value) {
        console.log("handle update:", field, value);
        switch (field) {
            case "loop":
                this._audio.loop = value;
                break;
            case "rate":
                this._audio.playbackRate = value;
                break;
            case "mute":
                this._audio.muted = value;
                break;
            case "volume":
                this._audio.volume = value;
                break;
        }
    }
}