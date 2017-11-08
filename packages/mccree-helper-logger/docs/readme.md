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
