# 优化

## 打包优化
[构建性能](https://webpack.docschina.org/guides/build-performance/)
1. 更新webpack、Node.js、npm至最新版本
2. 将loader应用于数量最小的模块，使用`include: path.resolve(__dirname, 'src')`;
3. 每个额外的 loader/plugin 都有其启动时间。尽量少地使用工具。
4. 减小项目代码体积，使用体积更小的library，移除未引用代码
5. 使用thread-loader
6. 在webpack配置中使用cache选项
7. 开发环境可以用webpack-dev-server，通过在内存中编译来提高性能，同时避免使用生产环境才会用到的工具

## 分析打包
[参考资料](https://juejin.cn/post/6844904071736852487)
通过speed-measure-webpack-plugin 测量你的 webpack 构建期间各个阶段花费的时间。
[bundle分析](https://webpack.docschina.org/guides/code-splitting/#bundle-analysis)
有一些官方分析工具和社区工具

## 代码分离

通过把代码分离到不同的bundle中，可以按需加载或者并行加载这些文件。常用的方法有：
1. 分离出多个入口，并使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk
2. 动态导入，即import（），配合前端框架的懒加载教程使用
3. webpack 4.6.0+的preload和prefetch指令，`import(/* webpackPrefetch: true */ './path/to/LoginModal.js');`



## preload与prefetch的区别
与 prefetch 指令相比，preload 指令有许多不同之处：
1. preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
2. preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
3. preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
4. 浏览器支持程度不同。