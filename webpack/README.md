# Webpack

## Entry points(入口起点)

1. 单个入口（简写）语法
entry: string | [string]。单入口语法是 entry: {main: string}的简写。

2. 可以传递一个文件路径数组，[string]，这将创建一个所谓的 "multi-main entry"。在你想要一次注入多个依赖文件，并且将它们的依赖关系绘制在一个 "chunk" 中时，这种方式就很有用。

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

分离应用和第三方库入口，使得第三方库能打包成独立的chunk，让浏览器缓存；多页面应用程序，每个页面有一个入口