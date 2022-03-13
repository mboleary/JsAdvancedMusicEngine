# Strong Time

This document describes how timing works within the application to support features like metronomes and syncing automation to audio sample playback, as well as timing some automation.

## Problems to solve

- Solve Async nature of JS by adding audioContext times to anything that would need to be run via function so that we can determine when/where to append it to the audio stream buffer
    - Javascript is not real-time, as all of the messages are run one-at-a-time through the call stack shared between JS as well as DOM operations, and other functions for the tab (I think these were called messages).
- Allow for writing a working metronome that's always going to be in time
    - Metronome should allow for subdivision
    - Should also allow for a time offset
- Midi messages should have an audioContext time associated with them
- Implement a node that provides a delay


## Implementation Details

To implement a synchronous environment, I'll need to use a buffer to write all strongly-timed data into.

## Reference

- https://www.geeksforgeeks.org/why-javascript-is-a-single-thread-language-that-can-be-non-blocking/