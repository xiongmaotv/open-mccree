# mccree-helper-utils
> Mccree 工具包.

### 安装
```sh
npm install --save mccree-helper-utils
```

### 使用
```javascript
import Utils from 'mccree-helper-utils';
```

### 接口
#### Utils.getUint(Uint8Array) 
    返回一个数字，值与输入的UInt8Array相等。

#### Utils.initMccree(mccree) 
    在模块中初始化Mccree属性。

#### Utils.extend(...objects)
    将第一个对象，根据后传入的对象进行扩展。