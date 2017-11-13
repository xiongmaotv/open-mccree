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

## License

    Copyright [2017] [Shanghai Panda Interactive Entertainment And Culture Company Limited]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.