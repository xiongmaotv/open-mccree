# mccree-core-loaderbuffer
> Mccree loaderbuffer.

## Install
```sh
npm install --save mccree-helper-loaderbuffer
```

## Usage
```javascript
import LoaderBuffer from 'mccree-helper-loaderbuffer';
```
```javascript
let loaderbuffer = new LoaderBuffer(length)
```
length - Optional the buffer size 

## Interface
### push(data)
    The function to push data.
data - The data to push into the buffer

### shift(length) 
    The function to shift data.
length - The size of shift

### clear() 
    Function to clear the buffer.

### toInt(start, length) 
    Convert uint8 data to number.
start - the start postion.  
length - the length of data.  

