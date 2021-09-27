# Nodes

A node is a wrapper around an audio source, effect, value, or browser API. It makes use of ports to connect to other nodes

## Goals

- Make it easy to access the node type
- api for showing all connectable ports
- Abstract away the connections that need to be made

## Port Data Types

### Midi

Used for sending midi events to other nodes

### Audio

Wraps around the `.connect()` and `.disconnect()` methods from an audio node. This wouldn't need to make use of sending updates

### Param

Wraps around an [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam) instance. 

## API

### Node
- audioNode: returns the Native Audio Node
- ports[]
- name

#### Functions
- init
- onUpdate
- onDestroy

### Port
Ports can send and receive different types of data
- node: the Node Object that this port is a part of
- control: Should be the AudioParam/Function reference
- defaultValue: Default value to start with
- currentValue: Last value sent via an update (if applicable)
- type: [midi, audio, param, trigger]
- direction
- name (meant to be a pk)
- connectedTo[]: All ports that this port is connected to

#### Functions
- init
- onConnect(remotePort)
- onDisconnect(remotePort)
- onUpdate(value)
- update(value, time): Send an update (at a specified time, if applicable)

### PortGroup
This is a group of ports, also known as a bus
- ports[]: Array of ports
- name