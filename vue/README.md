# Vue相关整理

在架构设计上，Vue.js大体上可以分为三部分：核心代码、跨平台相关与公用工具函数。

## [event](./event.md)

## [mixin](./mixin.md)

## [v-model](./vmodel.md)

## [v-slot](./slot.md)

## keep alive和动态组件

### 动态组件
使用component标签渲染一个“元组件”。依```is```的值来决定哪个组件被渲染

```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```
```currentTabComponent``` 可以包括:
1. 已注册组件的名字，或
2. 一个组件的选项对象

如果希望动态组件的实例能够在第一次创建后被缓存下来，可以用一个```<keep-alive>```将动态组件包裹起来。

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

**注意**

keep-alive要求被切换的组件都有自己的名字，无论是通过组件的name选项还是局部/全局注册。

## vm.$watch

### 参数 expOrFn
当expOrFn为函数时，Watcher不仅可以动态返回数据，还能观察expOrFn函数中使用的所有Vue.js实例上的响应式数据。原理上是通过expOrFn使用响应式数据时触发数据的getter。

由于Watcher中添加了teardown用来取消观察，getter触发时调用Dep实例的depend()首先调用当前Watcher实例的addDep。addDep在将Dep实例添加到Watcher实例的订阅列表后将Watcher实例添加到Dep实例的watcher列表中。这个过程中Dep实例和Watcher实例互相往对方的方法中传入this，也就是指向自己的引用。

## vm.$set
用来在响应式数据上设置一个属性，能够确保属性被创建后也是响应式的，并且触发视图更新。这个方法主要用来避开Vue.js不能侦测属性被添加的限制。

要点：
1. 在Array上设置成员，处理索引值等边界情况，关键是利用绑定过拦截器的splice方法设置新值。
2. key已经在target中，直接更新
3. 添加新属性，排除边界情况，target不能是Vue.js实例或Vue.js实例的根数据对象;target是不是响应式数据，如果是则要把新属性也变成响应式的。

## vm.$delete
原理和set相似：
1. 处理数组的情况，用splice
2. 处理Vue实例或Vue根数据对象的情况
3. 是不是自身属性
4. target是不是响应式数据

vm.$watch、vm.$set、vm.$delete在导出Vue构造函数之前由stateMixin方法挂载到Vue原型上的。


## Vue patch
在Vue里，patch可以理解为通过diff找出需要修改的DOM节点，然后渲染。修改DOM分为三种：
1. 新增节点，发生在第一次渲染以及vnode和oldVnode完全不是同一个节点时
2. 删除节点，以vnode为标准，不存在的节点都是需要删除的节点
3. 更新节点，vnode和oldVnode是同一个节点，需要进一步比对

**注意**  

这里的“同一个节点”，我的理解是同一个**类型**的节点，而且大部分属性都相同，也就个别属性，如子节点，文本等不同，所以需要逐一比对分析。

### 新增节点（创建节点）
创建节点-》创建元素节点-》创建子节点-》插入到指定父节点

创建节点-》创建注释节点/文本节点-》插入到指定父节点

### 删除节点
注意为了在设计框架的时候将渲染机制和特定平台（如浏览器的DOM）解耦，把删除节点的操作通过nodeOps封装，通过这个类获取平台相关的代码（如DOM中的父节点）并执行具体的删除操作。

### 更新节点
1. 新旧节点是否一样
2. 新旧节点是否是静态节点
3. 新节点是否有文本，如果有，旧节点的文本与新节点是否不同
4. 新节点没有文本，新旧节点是否有子节点，如果都有，更新子节点。
5. 只有新节点有子节点，将旧节点清空成空标签，将新节点的子节点插入旧节点
6. 新节点没有子节点，也没有文本，说明是空节点，旧节点有什么删什么。

### 更新子节点
更新子节点大概分为四种操作：更新节点，新增节点，删除节点，移动节点。通过四个变量```oldStartIndex oldEndIndex newStartIndex newEndIndex```，循环两个子节点列表。

1. 新增子节点，注意插入位置是旧子节点中所有未处理节点的前面，以获得正确的插入后顺序。循环结束后，如果newChildren中还有节点，都要新增并插入
2. 更新子节点，复用更新节点的逻辑。
3. 移动子节点，移动到所有未处理节点的前面，因为当前节点在newChildren里的位置就是未处理节点的最前面。
4. 删除子节点，循环结束后如果oldChildren中还有节点，那么都是要被删除的。

优化方式：在每轮循环前先比对新前与旧前，新后与旧后，新后与旧前，新前与旧后，节省循环。
1. 新前旧前、新后旧后位置不变，如果节点相同，只需更新节点
2. 新后旧前、新前旧后都是更新节点加移动节点，移动位置以新为准，新后移到oldChildren所有未处理节点的后面，新前移动到oldChildren所有未处理节点的前面。也就是说，已更新过的节点都不用管，只需要在未更新的区别进行移动和更新。
3. 如果子节点设置了key属性，可以通过key属性直接找到节点，也就无需使用上面的循环和优化。

## 事件相关实例方法
vm.$on、vm.$off、vm.$once、vm.$emit由eventsMixin方法挂载到Vue构造函数的原型上

### vm.$on
如果第一个参数传入的是字符串数组，则递归处理每一个事件，将其保存到vm._events的对象上，每个事件的回调用一个数组保存。

vm._events对象是在Vue构造函数初始化Vue实例的时候由_init()方法创建。

## 生命周期相关的实例方法
相关方法有四个：
1. 从lifeCycleMixin中挂载的vm.$forceUpdate和vm.$destory
2. 从renderMixin中挂载的vm.$nextTick
3. vm.$mount方法则是在跨平台的代码中挂载的

### vm.$forceUpdate
手动使Vue实例重新渲染，仅影响自身以及插入插槽内容的子组件，调用组件自身的watcher，也就是vm._watcher.update()。update方法会通知Vue实例重新渲染。

### vm.$destroy
要点
1. 判断逻辑，防止重复执行销毁
2. 调用callHook，触发beforeDestroy的钩子函数
3. 清理当前实例和父组件之间的联系，也就是把自己从父组件实例的$children中删除
4. 销毁组件上的所有watcher，包含自身的watcher，vm._watcher和vm.$watch设置的, vm._watchers（一个数组）。使用Watcher实例的teardown方法。
5. 设置变量表明已经销毁实例，在vnode树上触发解绑指令，触发destroyed钩子。
6. 移除所有事件监听器。

## vm.$nextTick
nextTick默认将回调添加到微任务中，特殊情况下才会降级为宏任务。

由于nextTick内部维护一个回调函数列表，新添加的回调都会进入这个列表，因此需要注意回调的添加顺序决定执行顺序。由于更新DOM的回调也是通过nextTick添加到微任务中，更新DOM和其他通过nextTick添加的回调在同一个列表中，因此要在修改数据之后使用nextTick（微任务模式下）。使用宏任务的回调无需担心这个限制，因此默认条件下，宏任务回调会固定在微任务的DOM更新之后再执行。

nextTick判断是否为第一次添加回调，是的话向任务队列添加一个缓冲函数。缓冲函数依次执行列表中的回调函数。

在支持Promise的环境下，如果没有提供回调，nextTick返回一个Promise。实现上，在符合条件时返回一个Promise，在nextTick的回调列表添加一个函数，执行之后通过设置好的内部_resolve变量控制Promise变为resolved从而执行then里面的代码。

### 降级为宏任务
可以分为主动降级和自动降级。

先说自动降级，在代码检测到不支持Promise的使用自动使用宏任务，使用宏任务之后，优先使用setImmediate，备选依次为MessageChannel，setTimeout。

主动降级使用withMacroTask方法和标志变量useMacroTask。被withMacroTask包裹的方法在执行过程中会把nextTick设置成使用宏任务，如果期间nextTick发生第一次添加回调的情况，就会把缓冲函数添加到宏任务。在这之间的DOM更新和nextTick都会在宏任务中，之后重置为微任务模式。
