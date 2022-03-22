# Vue相关整理

## [event](./event.md)

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


## Vue patch
在Vue里，patch可以理解为通过diff找出需要修改的DOM节点，然后渲染。修改DOM分为三种：
1. 新增节点，发生在第一次渲染以及vnode和oldVnode完全不是同一个节点时
2. 删除节点，以vnode为标准，不存在的节点都是需要删除的节点
3. 更新节点，vnode和oldVnode是同一个节点，需要进一步比对

**注**  

这里的“同一个节点”，我的理解是同一个**类型**的节点，而且大部分属性都相同，也就个别属性，如子节点，文本等不同，所以需要逐一比对分析。