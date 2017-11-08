# 开发者文档

## 开始

- clone 本项目
- 全局安装[Lerna](https://github.com/lerna/lerna)
```
npm install --global lerna
```
- 在项目根目录执行初始化脚本
```
./scripts/init.sh
```
- 初始化lerna
```
lerna bootstrap
```


## Mccree 结构及代码规范

### Mccree 结构

```
---- Mccree
 |-- packages
   |-- mccree-core-xxx ： 核心数据结构、流程控制等。
   |-- mccree-helper-xxx ： 工具类等
   |-- mccree-demuxer-xxx ：Demux模块
   |-- mccree-remuxer-xxx ：Remux模块
   |-- mccree-plugin-xxx ：插件
   |-- mccree-loader-xxx ：流加载器。
   |-- mccree-controller-xxx : 模块控制器 如 loader controller 等
   |-- xxxmccree : 编译版。可直接作为内核库的版本
 |-- scripts：包括模块生成，文档生成等自动化脚本
```

###  模块编写规范

- 模块需要引用对应的controller (如果有)
- 按模块写test文档 、doc文档。
- 模块必须存在英文文档、中文及其他语言可选。
- 所有的类和方法必须遵循jsdoc方式写明注释。
- 请先通过eslint检查，不存在警告项目。使用项目根目录下的.eslintrc文件

### 模块创建

执行

```
./scripts/newpackage.sh
```

选择模块类型（填写数字） => 模块名称 => 确认创建 => 配置package.json => 等待必要模块安装


### 模块目录结构

```
----mccree-xxx-xxx
 |-- src: 源代码
 |-- build: 编译后 (gulp生成)
 |-- doc: 文档 (jsdoc生成 或 手动编写)
 |-- scripts: 自动化脚本 （创建时拷贝）
 |-- test: 测试
 |-- coverage: 测试时生成
 |-- node_modules
 |-- .babelrc / .npmignore / gitignore 
 |-- package.json 
 |-- readme.md 
```

### 模块脚本
位置： ./scripts/

### lerna
[更多关于 Lerna](https://github.com/lerna/lerna) 。

## 如何贡献
- 阅读 readme.md 及 issues，确定新开发或需要改进的模块。
- Fork项目，根据上述流程开始开发。
- 发送邮件至 jiangyuqing@panda.tv 写明作者信息（以便加入到readme里）、模块名称及说明、PR信息（如果有）、开发周期等。
- Code review & test：如果想参与code review 和 test 发送邮件或提交issue.
- Merge code：代码review和测试通过后，会将您的代码合并到 分支dev. 进行灰度测试。稳定后合并到Master。
