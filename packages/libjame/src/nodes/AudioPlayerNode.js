import Node from "../Node.js";
import Port, {PORT_DIRECTIONS, PORT_TYPES, buildPortObj} from "../Port.js";
import { getAudioContext, resumeAudio } from "../Audio.js";

import {registerNodeType} from "../persistence/Serializer.js";

const TYPE = "AudioPlayerNode";

/**
 * Node for basic audio playback
 */

export default class AudioPlayerNode extends Node {
    constructor(params) {
        const defaults = {
            sourceURL: "",
        };
        super(params, defaults);

        this._type = TYPE;

        // Create Audio Element
        const audioContext = getAudioContext();
        this._audio = new Audio(this.params.sourceURL);
        this._track = audioContext.createMediaElementSource(this._audio);

        // Audio Port Out
        this._addPort({
            id: "aud",
            type: PORT_TYPES.AUDIO,
            control: this._track,
            direction: PORT_DIRECTIONS.OUT,
            name: "Audio Out"
        });

        // @TODO add event listeners for audio element events

        // Param Ports In
        this._addPort({id:"loop", type: PORT_TYPES.PARAM, defaultValue: false, direction: PORT_DIRECTIONS.IN, name: "Loop"});
        this._addPort({id:"rate", type: PORT_TYPES.PARAM, defaultValue: false, direction: PORT_DIRECTIONS.IN, name: "Playback Rate"});
        this._addPort({id:"mute", type: PORT_TYPES.PARAM, defaultValue: false, direction: PORT_DIRECTIONS.IN, name: "Mute"});
        this._addPort({id:"volume", type: PORT_TYPES.PARAM, defaultValue: 1, direction: PORT_DIRECTIONS.IN, name: "Volume"});

        // Trigger Ports In
        this._addPort({id:"start", type: PORT_TYPES.TRIGGER, control: () => this._play(), direction: PORT_DIRECTIONS.IN, name: "Start playback"});
        this._addPort({id:"stop", type: PORT_TYPES.TRIGGER, control: () => this._stop(), direction: PORT_DIRECTIONS.IN, name: "Stop playback"});
        this._addPort({id:"pause", type: PORT_TYPES.TRIGGER, control: () => this._pause(), direction: PORT_DIRECTIONS.IN, name: "Pause playback"});
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

    _onParamUpdate (params, field, value) {
        if (field === "sourceURL") {
            this._audio.pause();
            this._audio.url = value;
            this._audio.currentTime = 0;
        }
    }

    _onPortUpdate (field, value) {
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

registerNodeType(AudioPlayerNode, TYPE);
