import Node from "../Node.js";
import Port, { PORT_DIRECTIONS, PORT_TYPES, buildPortObj } from "../Port.js";
import { getAudioContext, resumeAudio } from "../Audio.js";

import {registerNodeType} from "../persistence/Serializer.js";

const TYPE = "FilterNode";
export default class FilterNode extends Node {
    constructor(params) {
        super(params);

        this._type = TYPE;

        // Create Audio Element
        const audioContext = getAudioContext();
        this._filter = audioContext.createBiquadFilter();

        // Set the default param values
        // if (params.frequency) {
        //     this._filter.frequency.value = params.frequency;
        // }

        // Create Interface ports
        // let ports = [];

        // // Audio ports
        // ports.push(new Port("aud", this, PORT_TYPES.AUDIO, this._filter, null, PORT_DIRECTIONS.IN, "Audio In", (port) => this._connect(port), (p) => this._disconnect(p)));
        // ports.push(new Port("aud", this, PORT_TYPES.AUDIO, this._filter, null, PORT_DIRECTIONS.OUT, "Audio Out"));

        // // Param Ports In
        // ports.push(new Port("freq", this, PORT_TYPES.PARAM, this._filter.frequency, null, PORT_DIRECTIONS.IN, "Frequency"));
        // ports.push(new Port("detune", this, PORT_TYPES.PARAM, this._filter.detune, null, PORT_DIRECTIONS.IN, "Detune"));
        // ports.push(new Port("q", this, PORT_TYPES.PARAM, this._filter.Q, null, PORT_DIRECTIONS.IN, "Q"));
        // ports.push(new Port("gain", this, PORT_TYPES.PARAM, this._filter.gain, null, PORT_DIRECTIONS.IN, "Gain"));
        // ports.push(new Port("type", this, PORT_TYPES.PARAM, null, 0, PORT_DIRECTIONS.IN, "Filter type", null, null, (val) => this.onUpdate("type", value)));

        // this.ports = buildPortObj(ports, this.id);

        this._addPort({
            id: "aud", 
            type: PORT_TYPES.AUDIO, 
            control: this._filter,
            direction: PORT_DIRECTIONS.IN,
            name: "Audio In"
        });
        this._addPort({
            id: "aud", 
            type: PORT_TYPES.AUDIO, 
            control: this._filter, 
            direction: PORT_DIRECTIONS.OUT,
            name: "Audio Out"
        });

        // Param Ports In
        this._addPort({
            id: "freq",
            type: PORT_TYPES.PARAM, 
            control: this._filter.frequency, 
            direction: PORT_DIRECTIONS.IN,
            name: "Frequency"
        });
        this._addPort({
            id: "detune", 
            type: PORT_TYPES.PARAM, 
            control: this._filter.detune, 
            direction: PORT_DIRECTIONS.IN, 
            name: "Detune"
        });
        this._addPort({
            id: "q", 
            type: PORT_TYPES.PARAM, 
            control: this._filter.Q, 
            direction: PORT_DIRECTIONS.IN, 
            name: "Q"
        });
        this._addPort({
            id: "gain", 
            type: PORT_TYPES.PARAM, 
            control: this._filter.gain, 
            direction: PORT_DIRECTIONS.IN, 
            name: "Gain"
        });
        this._addPort({
            id: "type", 
            type: PORT_TYPES.PARAM, 
            control: null, 
            defaultValue: 0, 
            direction: PORT_DIRECTIONS.IN, 
            name: "Filter type"
        });
    }

    _onAudioPortConnect(port) {
        if (port.control && port.control instanceof AudioNode) {
            port.control.connect(this._filter);
        }
    }

    _onAudioPortDisconnect(port) {
        if (port.control && port.control instanceof AudioNode) {
            port.control.disconnect(this._filter);
        }
    }

    _onPortUpdate(field, value) {
        console.log("handle update:", field, value);
        if (field === "type") {
            const temp = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"];
            let v = temp[0];
            if (value >= 0 && value < temp.length) {
                v = temp[value];
            }
            this._filter.type = v;
        }
    }
}

registerNodeType(FilterNode, TYPE)