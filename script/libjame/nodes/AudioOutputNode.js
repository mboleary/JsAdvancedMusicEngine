import Node from "../Node.js";
import Port, {PORT_DIRECTIONS, PORT_TYPES, buildPortObj} from "../Port.js";
import { getAudioContext, resumeAudio } from "../Audio.js";



/**
 * Node for sending audio to the system
 */
export default class AudioOutputNode extends Node {
    constructor(params) {
        super(params);

        // Create Interface ports
        let ports = [];

        // Audio port in
        ports.push(new Port("aud", this, PORT_TYPES.AUDIO, null, null, PORT_DIRECTIONS.IN, "Audio In", (p) => this._connect(p), (p) => this._disconnect(p)));

        this.ports = buildPortObj(ports, this.id);
    }

    _connect(port) {
        if (port.control && port.control instanceof AudioNode) {
            const audioContext = getAudioContext();
            port.control.connect(audioContext.destination);
        }
    }

    _disconnect(port) {
        if (port.control && port.control instanceof AudioNode) {
            const audioContext = getAudioContext();
            port.control.disconnect(audioContext.destination);
        }
    }
}