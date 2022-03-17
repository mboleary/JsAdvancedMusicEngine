# Environment

This document describes how the Nodes would be used. 

## Problems to solve

There are a few things we'll need to solve when using libjame:
- How to track what nodes are present, including those that are isolated
- How to track connections between nodes
- Properly adding and removing nodes
- Serialization and Deserialization to JSON (maybe more like hydration)
    - Ensure that if certain node classes aren't available, then the hydration won't fail
    - Have way to add node classes to hydration
    - Ensure that if Webpack eats the class name, it still works
    - Handle assets in a separate way from the actual node
- Allow grouping nodes and loading things using groups
    - This should allow a user to load nodes into the root surface and also unload just those nodes (this is similar to how JSGE works I think)
- Provide a robust edge to expose some ports on
    - this could be used to also provide a node group that contains several nodes and provides ports on the edge of the container node
- Updating node constructor parameters
    - some params, like IDs, should not be allowed to be changed

## Implementation Details

There are a few usecases we need to think about here. I would like to build a containing class to hold all of the nodes and provide some functionality for properly removing nodes, serializing and deserializing nodes.

This would be used in JSGE and BOrk, where I would likely only need 1 environment at a time. I would like to make BOrk capable of exporting the same type of JSON that libjame would import anywhere else, although in BOrk, I would like to allow users to upload samples from their local filesystem, so we'll need to store the assets differently from the information passed into the nodes.

I suppose someone could use more than one environment, but that shouldn't be necessary.

For loading in groups, it might be nice to enable serializing into a container node.

### Dehydration

When dehydrating the nodes, we only really need to keep the parameters passed into the node constructor, which should put the node back into the same state when instantiated with the same values.

### Hydration

When hydrating the nodes again, we'll need to find the constructor for the given node type, and reconnect the nodes