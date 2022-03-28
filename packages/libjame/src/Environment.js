/**
 * Contains the Environment class which contains the root graph
 */

import {buildPortObj} from "./Port.js";
import {serialize as _serialize, deserialize as _deserialize} from "./persistence/Serializer.js";

export default class Environment {
    #nodes;
    #ports;
    #portsArr;
    #groups;

    constructor() {
        this.#nodes = new Map();
        // this.#edges = [];
        this.#ports = {
            in: {}, 
            out: {}
        };
        this.#portsArr = [];
        this.#groups = {};
    }

    
    /**
     * Returns a node given an id
     * @param {String | Number} id node to get
     * @returns {Node} node
     */
    getNodeByID(id) {
        return this.#nodes.get(id);
    }

    /**
     * Adds a node to the environment
     * @param {Node} node node to add
     * @param {null | String} group group to add the node to
     */
    addNode(node, group = null) {
        if (group) {
            node.__group = group;
        } else {
            node.__group = undefined;
        }
        this.#nodes.set(node.id, node);
    }

    /**
     * @TODO Implement function
     * Changes the group of the node by ID
     * @param {*} id 
     * @param {*} group 
     */
    setNodeGroup(id, group = null) {
        // @TODO get node, remove from old group if it was added, then add to new group
    }

    /**
     * Removes a node by ID
     * @param {String | Number} id ID of node to remove
     */
    removeNode(id) {
        // @TODO call node removal function
        const node = this.#nodes.get(id);
        node.onDestroy();
        this.#nodes.delete(id);
    }

    /**
     * Adds an edge port for interfacing with nodes in the environment
     * @param {Port} port port to add
     */
    addPort(port) {
        this.#portsArr.append(port);
        const obj = buildPortObj(this.#portsArr, null);
        Object.assign(obj, this.#ports);
        this.#ports = obj;
    }

    /**
     * Removes an edge port
     * @param {String} id ID of port to remove
     */
    removePort(id) {
        for (let i = 0; i < this.#portsArr.length; i++) {
            if (this.#portsArr[i].id === id) {
                this.#portsArr[i].disconnectAll();
                this.#portsArr.splice(i, 1);
            }
        }

        this.#ports = buildPortObj(this.#portsArr, null);
    }

    /**
     * Gets the ports object
     * @returns object with ports
     */
    getPorts() {
        return this.#ports;
    }

    getNodes() {
        return this.#nodes.values();
    }

    /**
     * Serialize the state of the Environment for loading later
     * @returns {Object} the serialized state
     */
    serialize() {
        return _serialize(this.#nodes.values(), this.#ports);
    }

    /**
     * Loads a serialized state
     * @param {Object} obj state to load
     * @param {Object} options Options for loading
     */
    deserialize(json, {replaceAll = false, group = null, ...options} = {}) {
        const obj = _deserialize(json, options);
        if (replaceAll = false) {
            const nodes = this.#nodes.values();
            for (const node of nodes) {
                this.removeNode(node.id);
            }
            for (const oldPort of this.#portsArr) {
                oldPort.disconnectAll();
            }
            this.#portsArr = obj.extraPorts;
        } else {
            this.#portsArr = this.#portsArr.concat(obj.extraPorts);
        }
        for (const node of obj.nodes) {
            this.addNode(node, group);
        }
        this.#ports = buildPortObj(this.#portsArr, null);
    }
};
