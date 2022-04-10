# Webpack 插件
loader 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

插件是由在prototype上具有apply方法的类型所实例化出来的。这个 apply 方法在安装插件时，会被 webpack compiler 调用一次。apply 方法可以接收一个 webpack compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象。

## 插件的构成
1. 一个 JavaScript 命名函数或 JavaScript 类。
2. 在插件函数的 prototype 上定义一个 apply 方法。
3. 指定一个绑定到 webpack 自身的事件钩子。
4. 处理 webpack 内部实例的特定数据。
5. 功能完成后调用 webpack 提供的回调。

通过complier绑定同步或异步回调。

## 工作原理
1. 读取配置的时候生成插件实例。
2. 初始化compiler实例并调用插件的apply方法，传入complier
3. 插件实例获取compiler实例后，根据apply的实现调用compiler.plugin

## 插件的不同类型
每一个事件钩子都预先定义为同步、异步，钩子在内部用 tap/tapAsync或tapPromise 方法调用。

当我们用tapAsync方法来绑定插件时，**必须**调用函数的最后一个参数callback指定的回调函数。

当我们用tapPromise方法来绑定插件时，**必须**返回一个pormise，异步任务完成后resolve。

webpack 插件可以按照它所注册的事件分成不同的类型。

## 用法
根据webpack 用法，对应有多种使用插件的方式。

### 配置方式
在 webpack 配置中，向 plugins 属性传入一个 new 实例。
```js
plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
```
### Node API方式

```js
const webpack = require('webpack'); // 访问 webpack 运行时(runtime)
const configuration = require('./webpack.config.js');

let compiler = webpack(configuration);

new webpack.ProgressPlugin().apply(compiler);

compiler.run(function (err, stats) {
  // ...
});

```



## 参考资料
1. [一个博客](https://blog.csdn.net/frontend_frank/article/details/106205260)
2. [webpack中文文档](https://webpack.docschina.org/contribute/writing-a-plugin/#creating-a-plugin)