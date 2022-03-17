# AudioPlayerNode

This node plays back audio from a URL.

## Params

- `sourceURL`: URL to load for playback

## Input Ports

- `loop`(Param): Controls Audio Looping
- `rate`(Param): Playback Rate
- `mute`(Param): Controls whether the audio is muted or not
- `volume`(Param): Playback Volume
- `start`(Trigger): Starts playback
- `stop`(Trigger): Stops playback
- `pause`(Trigger): Pauses playback

## Output Ports

- `aud`(Audio): Audio Output from player

## Reference

- https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio
