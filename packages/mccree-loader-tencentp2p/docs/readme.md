# mccree-loader-tencentp2p
> Tencent X-P2P loader.

## Install
```sh
npm install --save mccree-loader-tencentp2p
```

## Usage
```javascript
import Mccree from 'mccree-loader-tencentp2p';
```
```javascript
let controller = new QVBP2PLoader(config);
```



## Interfaces

#### Static: isSupported()
    Make sure your browser supports this loader before instantiating it

#### init()
    This function is called when loader intializing, must bind(this).

#### load(source, opt)
    Load source through x-p2p sdk.
- source: stream url
- opt: load options

#### unload(response)
    Unload this loader. Release the x-p2p SDK instance.




