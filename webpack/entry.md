# Webpack

## Entry points(入口起点)

1. 单个入口（简写）语法
entry: string | [string]。单入口语法是 entry: {main: string}的简写。

2. 简写语法（以及对象语法）可以传递一个文件路径数组，[string]，这将创建一个所谓的 "multi-main entry"（对象语法就是多入口的入口）。在你想要一次注入多个依赖文件，并且将它们的依赖关系绘制在一个 "chunk" 中时，这种方式就很有用。

3. 对象语法
entry: { \<entryChunkName\> string | [string] } | {}

例子：
```js
module.exports = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js',
  },
};
```

可以传递一个对象作为描述入口对象，具有如下属性：

dependOn: 当前入口所依赖的入口。它们必须在该入口被加载前被加载。

filename: 指定要输出的文件名称。

import: 启动时需加载的模块。

library: 指定 library 选项，为当前 entry 构建一个 library。

runtime: 运行时 chunk 的名字。如果设置了，就会创建一个新的运行时 chunk。在 webpack 5.43.0 之后可将其设为 false 以避免一个新的运行时 chunk。

publicPath: 当该入口的输出文件在浏览器中被引用时，为它们指定一个公共 URL 地址。

属性在设置时有一些需要注意的地方：

runtime 和 dependOn 不应在同一个入口上同时使用
```js
module.exports = {
  entry: {
    a2: './a',
    b2: {
      runtime: 'x2',
      dependOn: 'a2',
      import: './b',
    },
  },
};
```

runtime 不能指向已存在的入口名称
```js
module.exports = {
  entry: {
    a1: './a',
    b1: {
      runtime: 'a1',
      import: './b',
    },
  },
};
```

dependOn 不能是循环引用的
```js
module.exports = {
  entry: {
    a3: {
      import: './a',
      dependOn: 'b3',
    },
    b3: {
      import: './b',
      dependOn: 'a3',
    },
  },
};

```

4. 对象语法的用途

分离应用和第三方库入口，使得第三方库能打包成独立的chunk，让浏览器缓存；多页面应用程序，每个页面有一个入口。Tip：根据经验，每个 HTML 文档只使用一个入口起点

分离成多个入口时配合depenOn还可以做到代码分离和在多个chunk间共享模块：
```js
 const path = require('path');

 module.exports = {
   mode: 'development',
   entry: {
    index: {
      import: './src/index.js',
      dependOn: 'shared',
    },
    another: {
      import: './src/another-module.js',
      dependOn: 'shared',
    },
    shared: 'lodash',
   },
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
   /** 多入口  optimization: {
    runtimeChunk: 'single',
   },*/
 };
```
如果我们要在一个 HTML 页面上使用多个入口时，还需设置最好再设置optimization.runtimeChunk: 'single'。尽管可以在 webpack 中允许每个页面使用多入口，应尽可能避免使用多入口的入口：entry: { page: ['./analytics', './app'] }。如此，在使用 async 脚本标签时，会有更好的优化以及一致的执行顺序。