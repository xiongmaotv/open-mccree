# Mccree Dev document

## Get Start

- clone the project
- Install [Lerna](https://github.com/lerna/lerna) global.
```
npm install --global lerna
```
- run the init shell
```
./scripts/init.sh
```

## Mccree structure and code style

### Mccree Structure

```
---- Mccree
 |-- packages
   |-- mccree-core-xxx ： Core data structure or process control.
   |-- mccree-helper-xxx ： Tools
   |-- mccree-demuxer-xxx ：Demux modules
   |-- mccree-remuxer-xxx ：Remux modules
   |-- mccree-plugin-xxx ：Plugins
   |-- mccree-loader-xxx ：Stream Loaders.
   |-- mccree-controller-xxx : Module controllers.
   |-- xxxmccree : Build version. Eg.Players
 |-- scripts：Scripts, devtool and templates
```

###  Code Style

- Modules need to import and use controllers if exist
- Test、doc is necessary for all modules.
- English version document is necessary for all modules. Chinese or other language version is optional.
- Jsdoc format comments are necessary for all classes and functions.
- No warning is allowed while excute eslint. Use .eslintrc in the project root. 

### create a module

excute newpackage.

```
./scripts/newpackage.sh
```

Select module type (no.) => Type in the module name  => Confirm => Edit package.json => wait for install node modules.


### module structure

```
----mccree-xxx-xxx
 |-- src: source code
 |-- build: after gulp
 |-- doc: docs
 |-- scripts: test script
 |-- test: test file
 |-- coverage: generate when test
 |-- node_modules
 |-- .babelrc / .npmignore / .gitignore 
 |-- package.json 
 |-- readme.md 
```

### scripts
position： ./scripts/

### lerna
[Learn more about Lerna](https://github.com/lerna/lerna) .

## How to contribute
- Read readme.md or issues to select which module you want to contribute.
- Fork the project, and get start.
- Mail to jiangyuqing@panda.tv. The email should include your own info which is include name email address and organization (for edit readme), the module info, pull request link and develop schedule.
- Code review & test：Email if you want to do the code review and test.
- Merge code：After code review and test the code will be merged into dev branch for gray test. After that, it will be merged into master. 
