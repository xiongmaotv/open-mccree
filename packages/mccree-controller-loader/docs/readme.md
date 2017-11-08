# mccree-controller-loader
> Controller for loaders

## Install
```sh
npm install --save mccree-controller-loader
```

## Usage
```javascript
import Mccree from 'mccree-controller-loader';
```
```javascript
let controller = new LoaderController(loader);
```



## Interfaces

#### init()
    This function is called when loader intializing, must bind(this).

#### onConnected()
    This function is called when connected.

#### onLoadData(data)
    This function is called when data loaded.
- data: the server response

#### onNotfound(response) 
    This function is called when the resource is not found.
- response: the server response.

#### onForbidden(response)
    This function is called when return forbidden.
- response: the server response.

#### onUnknownError(response)
    This function is called when can not conneced.
- response: the server response.


