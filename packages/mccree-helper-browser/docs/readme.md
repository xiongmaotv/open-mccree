#English
## mccree-helper-brower
> a component for brower information parsing

### Install
```sh
npm install --save mccree-helper-brower
```

### Usage
```javascript
import Brower from 'mccree-helper-brower';
```
```javascript
let brower = Brower.uaMatch(window.navigator.userAgent);
```


### Interfaces

##### uaMatch()
    This function is to parse brower information.
    The return is an object, with properties:
      1.versionNumber:the integer version number of brower
      2.version:the detailed number of brower
      3.name:the name of brower
      4.platform:the platform running the brower
      
#中文
## mccree-helper-brower
> 一个解析浏览器信息的组件

### 安装
```sh
npm install --save mccree-helper-brower
```

### 使用
```javascript
import Brower from 'mccree-helper-brower';
```
```javascript
let brower = Brower.uaMatch(window.navigator.userAgent);
```


### 接口

##### uaMatch()
    This function is to parse brower information.
    The return is an object, with properties:
      1.versionNumber:the integer version number of brower
      2.version:the detailed number of brower
      3.name:the name of brower
      4.platform:the platform running the brower