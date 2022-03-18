/**
 * Contains the OscillatorNode from the Web Audio API wrapped in the libjame node container
 */

import Node from "../Node.js";
import Port, {PORT_DIRECTIONS, PORT_TYPES, buildPortObj} from "../Port.js";
import { getAudioContext, resumeAudio } from "../Audio.js";
import { registerNodeType } from "../persistence/Serializer.js";

const TYPE = "OscillatorNode";

/**
 * Node for sending audio to the system
 */
export default class OscillatorNode extends Node {
    constructor(params) {
        super(params);

        this._type = TYPE;

        const ctx = getAudioContext();

        this.#osc = ctx.createOscillator();

        // Audio Output
        this._addPort({
            id: "aud",
            type: PORT_TYPES.AUDIO,
            direction: PORT_DIRECTIONS.OUT,
            control: this.#osc,
            name: "Audio Out"
        });

        // Inputs

        this._addPort({
            id: "freq",
            type: PORT_TYPES.PARAM,
            control: this.#osc.frequency,
            direction: PORT_DIRECTIONS.IN,
            name: "Frequency",
            _preventAutoConnect: true
        });
        this._addPort({
            id: "detune",
            type: PORT_TYPES.PARAM,
            control: this.#osc.detune,
            direction: PORT_DIRECTIONS.IN,
            name: "Detune",
            _preventAutoConnect: true
        });
        this._addPort({
            id: "type",
            type: PORT_TYPES.PARAM,
            direction: PORT_DIRECTIONS.IN,
            name: "Type"
        });
    }

    _onPortUpdate (paramName, value) {
        if (paramName === "type") {
            const temp = ["sine", "square", "sawtooth", "triangle"];
            let v = temp[0];
            if (value >= 0 && value < temp.length) {
                v = temp[value];
            }
            this.#osc.type = v;
        }
    }
}

registerNodeType(OscillatorNode, TYPE);
