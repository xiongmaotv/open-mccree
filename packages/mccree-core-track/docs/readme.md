# mccree-core-track
> Mccree track.

## Install
```sh
npm install --save mccree-core-track
```

## Usage
```javascript
import {Track, AudioTrack, VideoTrack} from 'mccree-core-logs';
```
```javascript
let track = new Track();
let audiotrack = new AudioTrack();
let videotrack = new VideoTrack();
```

## Interface
### Track
#### reset() 
    Reset the track.

#### distroy() 
    Destroy the track.

### AudioTrack
Extends Track.

### VideoTrack
Extends Track.