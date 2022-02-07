/**
 * Generic Node class
 */

let nodeIDCounter = 1;

export default class Node {
    constructor(params = {}) {
        this.id = params.id || nodeIDCounter++; // Should be unique
        this.name = "";
        this.ports = [];
        this.audioNode = null;
    }

    onUpdate (paramName, value) {

    }

    onDestroy () {

    }
}