# mccree-helper-logger
> Mccree logger.

## Install
```sh
npm install --save mccree-helper-logger
```

## Usage
```javascript
import Logger from 'mccree-helper-logger';
```
```javascript
let logger = new Logger(logger, TRUE, TRUE)
```
logger - The customer logger object.   
disable - If the logger is disabled by default
debuging - If the logger is used under a debug mode.

## Interface
### log(tag, type, message) 
    Log as [${time}][${tag}] ${type}: ${message} format

### info(tag, type, message) 
    Log information as [${time}][${tag}] ${type}: ${message} format

### warn(tag, type, message) 
    Log warning as [${time}][${tag}] ${type}: ${message} format

### debug(tag, type, message)
    Log debug message as [${time}][${tag}] ${type}: ${message} format. Do nothing when debugging mode is off

### error(tag, type, message)
    Log error as [${time}][${tag}] ${type}: ${message} format.

### Logger.isValid()
    The function returns if the customer logger is valid.

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