/**
 * Metronome Node
 */

import Node from "../Node.js";
import { Task } from "libjame/src/scheduler/Runner.js";
import Port, {PORT_DIRECTIONS, PORT_TYPES, buildPortObj} from "../Port.js";
import { getAudioContext, resumeAudio } from "../Audio.js";


export default class MetroNode extends Task(Node) {
    constructor(params) {
        super(params);

        // Create Interface ports
        let ports = [];

        // Audio port in
        ports.push(new Port("tempo", this, PORT_TYPES.PARAM, null, null, PORT_DIRECTIONS.IN, "Tempo", (p) => this._connect(p), (p) => this._disconnect(p)));

        this.ports = buildPortObj(ports, this.id);
    }

    _connect(port) {
        
    }

    _disconnect(port) {
        
    }
}