function noop() {};

export const PORT_TYPES = Object.freeze({
    PARAM: 1,
    MIDI: 2,
    AUDIO: 3,
    TRIGGER: 4,
});

export const PORT_DIRECTIONS = Object.freeze({
    OUT: 5,
    IN: 6
});

// Organize array of ports to Object
export function buildPortObj (ports, nodeId) {
    const toRet = {in: {}, out: {}};

    for (const p of ports) {
        let d = p.direction === PORT_DIRECTIONS.IN ? "in" : "out";
        let id = p.id.replace(nodeId + "_", "");
        toRet[d][id] = p;
    }
    
    console.log(toRet);

    Object.freeze(toRet); // prevent rouge code from changing port object

    return toRet;
}

/**
 * A port is used to connect a node to another
 */
export default class Port {
    constructor(id, node, type, control, defaultValue, direction, name, onConnect = noop, onDisconnect = noop, onUpdate = noop) {
        this.name = name || id;
        this.node = node;
        if (this.node && this.node.id) {
            this.id = this.node.id + "_" + id; // Should be unique
        } else {
            this.id = id; // Should be unique
        }
        this.type = type;
        this.control = control;
        this.direction = direction;
        this.currentValue = defaultValue;
        this.connectedTo = [];
        this.onConnect = onConnect;
        this.onDisconnect = onDisconnect;
        this.onUpdate = onUpdate;
    }

    // Call this to connect the port
    connect (port) {
        console.log("port connect");
        if (port.type !== this.type) {
            throw new Error("Not same type");
        }

        if (port.direction === this.direction) {
            throw new Error("Cannot connect to the wrong direction");
        }

        // Check if we already have the port
        for (const p of this.connectedTo) {
            if (p.id === port.id) {
                throw new Error("Already connected");
            }
        }

        port._onConnect(this);
        this._onConnect(port);

        // If it's a receiving port, set the value
        console.log("Checking for update immediately:", this, port);
        if (port.direction === PORT_DIRECTIONS.IN && this.currentValue) {
            this._updateSingle(port, this.currentValue, 0);
        } else if (this.direction === PORT_DIRECTIONS.IN && port.currentValue) {
            this._updateSingle(this, port.currentValue, 0);
        }

        if (port.onConnect) {
            port.onConnect(this);
        }
    }

    // Call this to disconnect the port
    disconnect (port) {
        // Check if we already have the port
        for (let i = 0; i < this.connectedTo.length; i++) {
            if (this.connectedTo[i].id === port.id) {
                this.connectedTo.splice(i, 1);
                port._onDisconnect(this);
                break;
            }
        }

        if (port.onDisconnect) {
            port.onDisconnect();
        }
    }

    disconnectAll () {
        for (let i = 0; i < this.connectedTo.length; i++) {
            const port = this.connectedTo[i];
            port._onDisconnect(this);
            if (port.onDisconnect) {
                port.onDisconnect();
            }
        }

        this.connectedTo = [];
    }

    update (value, time = 0) {
        console.log("port update", value, time);
        if (this.direction === PORT_DIRECTIONS.OUT) {
            setTimeout(() => {
                this.currentValue = value;
            }, time);

            // Set on all connected ports
            for (const port of this.connectedTo) {
                this._updateSingle(port, value, time);
            }
        }
    }

    _updateSingle (port, value, time) {
        // port.control can be null for some param types
        console.log("Port control:", port.id, port.control);
        if (port.control) {
            if (port.control instanceof AudioNode) {
                // This is invalid because we cannot set audio data
                return;
            } else if (port.control instanceof AudioParam) {
                port.control.setValueAtTime(value, time);
            } else if (typeof port.control === "function") {
                setTimeout(() => {
                    port.control(value);
                }, time);
            }
        }

        // Set the port's internal value
        setTimeout(() => {
            port.currentValue = value;
        }, time);

        if (port.onUpdate) {
            setTimeout(() => {
                port.onUpdate(value);
            }, time);
        }
    }

    // Allows access to the audio params of connected ports
    updateAudioParam (func) {
        for (const port of this.connectedTo) {
            if (port.control instanceof AudioParam) {
                func(port.control);
            }

            if (port.onUpdate) {
                port.onUpdate();
            }
        }
    }

    isConnected () {
        return this.connectedTo.length > 0;
    }

    // Called when a port is connected
    _onConnect(port) {
        console.log("Internal port connect");
        // Check if we already have the port
        let found = false;
        for (const p of this.connectedTo) {
            if (p.id === port.id) {
                found = true;
                break;
            }
        }

        if (!found) {
            this.connectedTo.push(port);
        }

        console.log("Connected ports:", this.connectedTo);

        
    }

    // Called then a port is disconnected
    _onDisconnect(port) {
        // Check if we already have the port
        for (let i = 0; i < port.connectedTo.length; i++) {
            if (port.connectedTo[i].id === port.id) {
                port.connectedTo.splice(i, 1);
                break;
            }
        }
    }
}