/**
 * Generic Node class
 */

import Port, {PORT_TYPES, PORT_DIRECTIONS, buildPortObj} from "./Port.js";

let nodeIDCounter = 1;

export default class Node {
    #id; // Contains the id
    _type; // Contains the Type String used for serialization
    name; // Programmer-set name of the node
    ports; // Ports Object exposed to the world
    audioNode; // If node contains an audioNode
    #portsArr;
    constructor({id, name, ...params} = {}, defaultParamValues = {}) {
        this.#id = id || nodeIDCounter++; // Should be unique
        this._type = "Node";
        this.name = name || "";
        this.ports = {}; // Contains the Port object exposed to the world
        this.#portsArr = [];
        this.audioNode = null;
        // Stores the parameters that define the node
        const updateFunc = (...args) => this._onParamUpdate(...args);
        const p = {};
        Object.assign(p, defaultParamValues, params);
        this.params = new Proxy(p, {
            set(obj, prop, value) {
                // Call the parameter update function before actually updating
                updateFunc(obj, prop, value);
                obj[prop] = value;
                return true;
            }
        });
    }

    get id() {
        return this.#id;
    }

    get type() {
        return this._type;
    }

    /**
     * Function called when a param's value is updated
     * @param {*} params Params Object
     * @param {*} paramName 
     * @param {*} value 
     */
    _onParamUpdate (params, paramName, value) {

    }

    _onDestroy () {
        // disconnect all ports
        for (const port of this.#portsArr) {
            port.disconnectAll();
        }
    }

    getPortsArr() {
        return [].concat(this.#portsArr);
    }

    _addPort({id, type, control, defaultValue, direction, name, onConnect = null, onDisconnect = null, onUpdate = null}) {
        let handleConnect = null;
        let handleDisconnect = null;
        let handleUpdate = null;

        // Get a default function for connection, disconnection, and update callbacks
        if (direction === PORT_DIRECTIONS.IN) {
            if (type === PORT_TYPES.PARAM) {
                handleUpdate = (value) => {
                    this._onParamUpdate(id, value);
                };
            } else if (type === PORT_TYPES.AUDIO) {
                handleConnect = (port) => {
                    this._onAudioPortConnect(port);
                };
                handleDisconnect = (port) => {
                    this._onAudioPortDisconnect(port);
                }
            } else if (type === PORT_TYPES.TRIGGER) {
                handleUpdate = () => {
                    this._onParamUpdate(id, null);
                }
            } else if (type === PORT_TYPES.MIDI) {
                handleUpdate = (value) => {
                    this._onMidiPortUpdate(id, value);
                }
            }
        }

        if (onConnect) {
            handleConnect = onConnect;
        }
        if (onDisconnect) {
            handleDisconnect = onDisconnect;
        }
        if (onUpdate) {
            handleUpdate = onUpdate;
        }

        let port = new Port(id, this, type, control, defaultValue, direction, name, handleConnect, handleDisconnect, handleUpdate);

        this.#portsArr.push(port);
        this.ports = buildPortObj(this.#portsArr, this.#id);
    }

    _removePort(id, direction) {
        // Find in ports arr and delete, then rebuild port object
        for (let i = 0; i < this.#portsArr.length; i++) {
            const port = this.#portsArr[i];
            if (port && port.id === id && port.direction === direction) {
                port.disconnectAll();
                this.#portsArr.splice(i, 1);
                break;
            }
        }

        this.ports = buildPortObj(this.#portsArr, this.#id);
    }

    /**
     * Function called when an incoming port receives an update
     * @param {*} paramName 
     * @param {*} value 
     */
    _onPortUpdate (paramName, value) {

    }

    /**
     * Function called when an incoming port receives a midi message
     * @param {*} portName 
     * @param {*} message 
     */
    _onMidiPortUpdate(portName, message) {

    }

    /**
     * Function called when an audio port is connected
     * @param {*} port 
     */
    _onAudioPortConnect (port) {

    }

    /**
     * Function called when an audio port is disconnected
     * @param {*} port 
     */
    _onAudioPortDisconnect (port) {

    }

    
}