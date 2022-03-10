# Js Advanced Music Engine

A library for dynamically playing music.

This library wraps around the browser-based Audio APIs in order to provide a robust Node-based approach to audio in frontend JavaScript. It's built to run in a browser and also to be framework-agnostic and flexible enough to work in whatever scenario you need it for. As-is, it can run in [the Js Game Engine](https://github.com/mboleary/JsGameEngine) using the `jmod` provided in the Audio class.

## Demo

There's an included demo to showcase what you can do with the library. Here's what you'll need to do to run it:

1. run a [Simple HTTP Server](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server) in the `demo` directory.

2. Open a web browser and navigate to `localhost:<port_number>`, and you should see a minimal web page with the header "Js Advanced Music Engine Test".

3. Open the Developer Tools / Inspect Element by pressing <kbd>F12</kbd>.

4. Go to the __Console__ Tab

5. To start the audio playback, type in:

```js
window.ports.start.update()
```

This will trigger one of the ports located in the `window.ports` global variable to start the playback as it's connected to the `AudioPlaybackNode`.

Similarly, you can run any of the following:

```js
window.ports.start.update();
window.ports.stop.update();
window.ports.pause.update();
window.ports.loop.update(true);
window.ports.freq.update(440);
```

## Known uses of this library

Here is a list of websites or applications that use this library. If you decide to use it somewhere, open up a PR and add it to the list in this file.

- [BOrk - The Browser Orchestra](https://github.com/mboleary/BOrk)
    - [Demo at ](https://bork.deadcomputersociety.com/)
