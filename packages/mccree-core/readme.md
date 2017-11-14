# mccree-core
> Mccree core.

## Install
```sh
npm install --save mccree-core
```

## Usage
```javascript
import Mccree from 'mccree-core';
```
```javascript
let mccree = new Mccree(modules, config, plugins);
```

## Extend
```javascript
class SomenameMccree extend Mccree {
  // Do something 
}
```


## Interface
### index.js
Mccree core workflow

#### destroy()
    The function to destroy mccree.

#### attachMedia(media)
    Use to attach a media profile.

#### detachMedia()
    Use to detach the the media profile.

#### attachMediaElement(media)
    Use to attach the the media element.

#### detachMediaElement()
    Use to detach the the media element.

#### load(url)
    Load the resource.
url - The resource url.

#### unload()
    Unload from the resource. Returns a promise.

#### events.js
The events of Mccree workflow 

#### media-info.js
The data structure of media informations.

#### media.js
The data structure of media profile include trucks.

#### initTracks()
    Initailize all tracks.

#### initTracks()
    Initailize all tracks.

#### initTracks()
    Reset all tracks.

#### getTrack(key)
    Get a track.
key - the key of track.

#### destoryTracks()
    Destory all tracks.
