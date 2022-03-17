/**
 * Contains the Environment class which contains the root graph
 */

import {buildPortObj} from "./Port.js";

export default class Environment {
    #nodes;
    #ports;
    #portsArr;
    #groups;

    constructor() {
        this.#nodes = new Map();
        this.#edges = [];
        this.#ports = {};
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

    addNode(node, group = null) {
        if (group) {
            node.__group = group;
        } else {
            node.__group = undefined;
        }
        this.#nodes.set(node.id, node);
    }

    setNodeGroup(id, group = null) {
        // @TODO get node, remove from old group if it was added, then add to new group
    }

    removeNode(id) {
        // @TODO call node removal function
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

    removePort(id) {
        for (let i = 0; i < this.#portsArr.length; i++) {
            if (this.#portsArr[i].id === id) {
                this.#portsArr[i].disconnectAll();
                this.#portsArr.splice(i, 1);
            }
        }

        this.#ports = buildPortObj(this.#portsArr, null);
    }

    getPorts() {
        return this.#ports;
    }
};
