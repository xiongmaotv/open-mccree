# mccree-helper-utils
> Mccree utils.

## Install
```sh
npm install --save mccree-helper-utils
```

## Usage
```javascript
import Utils from 'mccree-helper-utils';
```

## Interface
### Utils.getUint(Uint8Array) 
    returns a number which is equal to the input;

### Utils.initMccree(mccree) 
    To init the module with mccree core; This function need to .call(this);

### Utils.extend(...objects)
    The first object will be extend by the following objects.
