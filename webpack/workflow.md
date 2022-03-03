# webpack工作流程

初始化参数（从配置文件和命令行中合并参数）-》初始化compiler对象，加载插件，执行compiler对象的run方法-》通过entry确定入口-》通过loader翻译模块，递归本步骤完成整个依赖树-》compilation对象由compile对象创建，在编译阶段，模块会被加载(load)、封存(seal)、优化(optimize)、 分块(chunk)、哈希(hash)和重新创建(restore)-》输入到chunk中

期间会广播生命周期事件，插件通过生命周期钩子在回调执行自定义的逻辑。