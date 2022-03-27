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
作用是将回调延迟到下一次DOM更新周期之后执行。

nextTick默认将回调添加到微任务中，特殊情况下才会降级为宏任务。

由于nextTick内部维护一个回调函数列表，新添加的回调都会进入这个列表，因此需要注意回调的添加顺序决定执行顺序。由于更新DOM的回调也是通过nextTick添加到微任务中，更新DOM和其他通过nextTick添加的回调在同一个列表中，因此要在修改数据之后使用nextTick（微任务模式下）。使用宏任务的回调无需担心这个限制，因此默认条件下，宏任务回调会固定在微任务的DOM更新之后再执行。

nextTick判断是否为第一次添加回调，是的话向任务队列添加一个缓冲函数。缓冲函数依次执行列表中的回调函数。

在支持Promise的环境下，如果没有提供回调，nextTick返回一个Promise。实现上，在符合条件时返回一个Promise，在nextTick的回调列表添加一个函数，执行之后通过设置好的内部_resolve变量控制Promise变为resolved从而执行then里面的代码。

---

### 降级为宏任务
可以分为主动降级和自动降级。

先说自动降级，在代码检测到不支持Promise的使用自动使用宏任务，使用宏任务之后，优先使用setImmediate，备选依次为MessageChannel，setTimeout。

主动降级使用withMacroTask方法和标志变量useMacroTask。被withMacroTask包裹的方法在执行过程中会把nextTick设置成使用宏任务，如果期间nextTick发生第一次添加回调的情况，就会把缓冲函数添加到宏任务。在这之间的DOM更新和nextTick都会在宏任务中，之后重置为微任务模式。


## vm.$mount
如果Vue实例在实例化的时候没有收到el选项，则处于“未挂载”的状态，没有关联的DOM元素，这时可以使用vm.$mount手动挂载一个未挂载的实例。如果没有提供参数给vm.$mount，模版将会被渲染成文档之外的元素，并且必须使用原生DOM的API把它插入到文档中。

在不同构建版本下的vm.$mount功能不同。运行时版本将实例渲染到指定的DOM元素上，完整版除了包含运行时版本，还包含了将模版编译成渲染函数的步骤。

### 要点
1. 利用所谓“函数劫持”，也就是先将不带编译模版的原始功能保存在一个变量，待编译完成后再使用，然后创建一个新方法覆盖原始方法，并在新方法内完成编译操作以及调用原始功能。
2. 通过el选项获取DOM元素。
3. 判断vm.$options中是否存在渲染函数，只有不存在时才会编译模版
4. 需要编译模版时，先获取模版，然后通过编译生成渲染函数，并设置到vm.$options.render上。
5. 原始功能仅仅包含将实例挂载，也就是渲染到指定DOM上的部分。首先检查渲染函数，如果没有渲染函数，则将指定DOM节点渲染成注释节点，并在开发模式下给出控制台警告。
6. 触发beforeMount钩子
7. 创建组件的Watcher用来持续性渲染组件。
8. 通过vm._render调用渲染函数生成一份vnode树，然后vm._update对新vnode和旧vnode对比并更新DOM节点。
9. 利用Watcher可以跟踪函数调用中使用的所有响应式数据这一特性，持续跟踪生成vnode和渲染过程中模版使用到的响应式数据，直到组件销毁。
10. 挂载完毕后触发mounted钩子。

## 全局API
全局API是挂载到Vue构造函数上，这些方法的this是Vue构造函数本身
### Vue.extend
data选项必须是一个返回数据**对象**的**函数**。
要点：
1. 使用缓存策略，反复调用Vue.extend应该返回同一个结果。
2. 检查name选项
3. 将父类继承到子类中，合并父类和子类的选项
4. 初始化props、computed、以及其他属性
5. 缓存子类构造函数

总体来讲，其实就是创建了一个Sub函数并继承了父级。如果直接使用Vue.extend，则Sub继承于Vue构造函数

## 生命周期
Vue实例的生命周期可以分为四个阶段：初始化阶段、模版编译阶段、挂载阶段、卸载阶段。

初始化阶段从new Vue()到created钩子，主要是初始化一些属性、事件以及响应式数据。

模版编译阶段从created钩子函数到beforeMount钩子函数，主要是将模版编译成渲染函数，只存在于完整版。运行时版本会跳过这个阶段，直接进入挂载阶段。

挂载阶段从beforeMount到mounted，Vue实例将会被渲染到DOM元素，渲染过程中还会开始组件的Watcher来持续跟踪依赖的变化。当数据发生变化时，Watcher通知虚拟DOM重新渲染视图，渲染前触发beforeUpdate钩子，渲染完成后触发updated

卸载阶段从调用vm.$destroy后开始，组件开始删除和父组件之间的联系，取消实例上的所有依赖的跟踪，移除所有事件监听器。

## _init方法
初始化阶段主要在这里完成，包括设置属性等以及触发beforeCreate和created。

new Vue()之后：
1. 执行初始化流程之间，在实例上挂载了$options属性。
2. initLifecycle，初始化一些内部属性
3. initEvents
4. initRender
5. 触发beforeCreate钩子
6. initInjections，在data/props之前初始化inject，让用户可以在data/props中使用inject注入的内容
7. initState，依次初始化props、methods、data、computed、watch，这样做可以让后初始化的数据使用或观察先初始化的数据。
8. initProvide，在data/props后初始化provide
9. 触发created钩子
10. 如果实例化时提供了el选项，自动开始模版编译与挂载阶段，通过vm.$mount。如果没有，停在初始化阶段，等待用户手动进入下一阶段。

## 生命周期钩子里的callHook
Vue.js通过callHook函数触发生命周期钩子。callHook只需从```vm.$options[hookName]```中获取钩子列表，依次执行回调。

用户设置的生命周期钩子通过options选项参数对象提供给Vue构造函数，经过合并之后赋值给```vm.$options[hookName]```。在合并options的过程中，所有同名的生命周期钩子会合并到一个数组，**混入对象的生命周期钩子先于自身的生命周期钩子调用**。

所有生命周期钩子的函数名：
1. beforeCreate
2. created
3. beforeMount
4. mounted
5. beforeUpdate
6. updated
7. beforeDestroy
8. destroyed
9. activated
10. deactivated
11. errorCaptured

## errorCaptured与错误处理
要点：
1. 一个globalHandleError方法，在有配置全局的config.errorHanlder时将错误传递给全局处理，还能够处理自身的报错。最后不管错误来源，都会把错误打印到控制台。
2. 通过组件的$parent，错误能够向上获取父组件，直至根组件。
3. 在沿途获取的组件上调用errorCaptured钩子函数列表，如果某个钩子函数调用出错，新错误和原错误都会通过执行globalHandleError发送给全局错误处理。
4. 如果errorCaptured的钩子函数返回false，那么错误将停止向上和向全局传递。

## 初始化methods
循环选项中的methods对象，验证每个属性之后挂载到vm上。

验证方法是否合法
1. 是否只有key，没有value，没找到方法
2. key（方法名）是否已经在props中声明过了
3. key是否使用已经存在于vm，且以$或_开头

## 初始化data
1. 获取data对象，如果data是返回对象的函数，执行data函数，验证函数返回值确实是对象。如果data本身就是对象，直接获取。完整的过程还包含错误处理以及设置默认值。最后保证将要被设置到vm上的一定是一个对象。
2. 验证data对象属性的key，非生产环境判断是否与methods有重名属性。判断是否与props有重名属性。如果data和methods有重名属性，依然会将data的这个属性设置到vm上，如果与props发生了重复，则不会设置到vm上。

### proxy方法原理
用于实现代理功能。三个参数target sourceKey key。

初始化了一个带setter和getter的属性配置对象，将对target.key的读写转换到target.sourceKey.key上。例如，操作vm.x也就是操作vm._data.x

## v-on指令
使用v-on指令可以绑定事件监听器。

用在组件时，可以监听自定义组件触发的事件。在组件的初始化事件阶段，初始化了vm._events对象，所有使用vm.$on注册的事件都保存在这里。更新组件的事件先规格化事件名，也就是处理事件修饰符，如capture、once和passive。然后通过比对新旧事件列表，找出新事件、不需要的事件和需要更新回调的事件。

普通DOM元素的事件绑定相关逻辑，在规格化和比对更新事件的逻辑和绑定组件事件是类似的。不同的地方在于，绑定在DOM元素上的事件的添加和删除操作使用的是原生的addEventListener和removeEventListener。

虚拟DOM在patch的过程中，每当一个DOM元素的创建和更新时，都会触发事件绑定相关的处理逻辑。

## 自定义指令
1. 虚拟DOM在patch中会触发不同钩子函数，跟自定义指令处理相关的有create、update和destory
2. 指令的处理逻辑监听了这些事件，回调最后都会触发在编写自定义指令时定义的bind、inserted、update、componentUpdated与unbind钩子。
3. 指令处理方法比对新旧指令列表，也就是oldDirs和newDirs，决定调用bind钩子还是update钩子。
4. 对于已经绑定过的指令，也就是oldDir中有的指令，执行update钩子，如果设置了componentUpdated，update之后还会调用componentUpdated。
5. 对于新指令，先触发bind，之后如果设置了inserted，还会触发inserted。
6. 发现不需要的指令时，解绑指令，触发unbind

自定义指令这里触发钩子函数也有一个callHook方法，只是和组件那里的callHook方法有相似的作用，也就是触发钩子函数。但是这两个callHook的参数和原理不一样。

本处的callHook先从指令对象中取出对应的钩子函数，如果钩子函数存在，执行函数，同时处理可能发生的错误

## 过滤器
在Vue中可以定义过滤器函数，然后在模版里用 ``` | ``` “管道”符号指示。模版编译的时候会把过滤器编译成使用``` | ```前的表达式为第一个参数，调用过滤器函数并对结果生成字符串的操作。

过滤器可以串联。

过滤器使用时也可以传递参数，作为第二以及之后的参数。第一个参数永远是之前操作链的结果