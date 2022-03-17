/**
 * Contains the Serializer helper functions for the Environment class
 */

import Port, {PORT_DIRECTIONS} from "../Port.js";

/**
 * Function to dehydrate libjame nodes into json
 * @param {Array<Node>} nodes array of nodes 
 * @param {Object} rootPortsObj Object containing edge ports
 * @returns {Object} serialized object
 */
export function serialize(nodes, rootPortsObj = null) {
    const toRet = {
        nodes: [],
        edges: [],
        extraPorts: [], // For Edge Ports which don't have a node
        // assets: []
    };

    for (const node of nodes) {
        toRet.nodes.push({
            type: node.type,
            id: node.id,
            name: node.name,
            params: node.params
        });

        // Start from out nodes and index where they connect
        for (const key of Object.keys(node.ports.out)) {
            const port = node.ports.out[key];

            for (const conn of port.connectedTo) {
                toRet.edges.push({
                    nodeInId: conn.node && conn.node.id,
                    portInId: conn.id,
                    nodeOutId: node.id,
                    portOutId: port.id,
                });
            }
        }
    }

    if (rootPortsObj) {
        // Get output nodes of the root Ports Object
        for (const port of Object.keys(rootPortsObj.out)) {
            toRet.extraPorts.push({
                id: port.id,
                name: port.name,
                direction: port.direction,
                type: port.type
            });

            for (const conn of port.connectedTo) {
                toRet.edges.push({
                    nodeInId: conn.node && conn.node.id,
                    portInId: conn.id,
                    nodeOutId: null,
                    portOutId: port.id,
                });
            }
        }
    }

    return toRet;
}

const nodeTypes = {};

/**
 * Function used to register a node type for deserialization
 * @param {Function} constructor Node Class Constructor
 * @param {String} typeName typename to use for constructor
 */
export function registerNodeType(constructor, typeName) {
    nodeTypes[typeName] = constructor;
}

export function deserialize(json, {ignoreMissingNodeTypes = true, group = null, containerNode = false}) {
    const toRet = {
        nodes: [],
        edges: [],
        extraPorts: []
    };

    const nodesById = {};
    const extraPortsById = {
        in: {},
        out: {}
    };

    // Hydrate the nodes
    for (const node of json.nodes) {
        if (nodeTypes[node.type]) {
            const NodeConstructor = nodeTypes[node.type];
            const inst = new NodeConstructor({id: node.id, name: node.name, ...node.params});
            nodes.push(inst);
            nodesById[inst.id] = inst;
        } else if (!ignoreMissingNodeTypes) {
            throw new Error("Encountered unknown Node Type:", node.type);
        }
    }

    // Hydrate edge ports
    for (const port of json.extraPorts) {
        const p = new Port(port.id, null, port.type, null, null, port.direction, port.name);
        toRet.extraPorts.push(p);
        const d = port.direction === PORT_DIRECTIONS.IN ? "in" : "out";
        extraPortsById[port.id][d] = p;
    }

    // Connect the node ports
    for (const edge of json.edges) {
        let inPort = null, outPort = null;
        if (edge.nodeInId) {
            const inNode = nodesById[edge.nodeInId];
            if (!inNode) {
                throw new Error("Node not found while connecting incoming ports:", edge.nodeInId);
            }
            inPort = inNode.ports.in[edge.portInId];
        } else {
            // Check for the edge node
            inPort = extraPortsById.in[edge.portInId];
        }

        if (edge.nodeOutId) {
            const outNode = nodesById[edge.nodeOutId];
            if (!outNode) {
                throw new Error("Node not found while connecting outgoing ports:", edge.nodeOutId);
            }
            outPort = outNode.ports.out[edge.portOutId];
        } else {
            // Check for the edge node
            outPort = extraPortsById.out[edge.portOutId];
        }

        if (inPort && outPort) {
            inPort.connect(outPort);
        } else {
            throw new Error("Ports not found:", edge);
        }
        
    }

    return toRet;
}