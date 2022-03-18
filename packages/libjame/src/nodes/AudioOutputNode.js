import Node from "../Node.js";
import Port, {PORT_DIRECTIONS, PORT_TYPES, buildPortObj} from "../Port.js";
import { getAudioContext, resumeAudio } from "../Audio.js";
import { registerNodeType } from "../persistence/Serializer.js";

const TYPE = "AudioOutputNode";

/**
 * Node for sending audio to the system
 */
export default class AudioOutputNode extends Node {
    constructor(params) {
        super(params);

        this._type = TYPE;

        this._addPort({
            id: "aud",
            type: PORT_TYPES.AUDIO,
            direction: PORT_DIRECTIONS.IN,
            name: "Audio In"
        });
    }

    _onAudioPortConnect(port) {
        console.log("Port connection in AudioOutputNode");
        if (port.control && port.control instanceof AudioNode) {
            const audioContext = getAudioContext();
            port.control.connect(audioContext.destination);
        }
    }

    _onAudioPortDisconnect(port) {
        if (port.control && port.control instanceof AudioNode) {
            const audioContext = getAudioContext();
            port.control.disconnect(audioContext.destination);
        }
    }
}

registerNodeType(AudioOutputNode, TYPE);
