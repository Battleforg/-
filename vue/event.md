# 事件

## [README](./README.md)

## 事件修饰符

Vue.js为v-on指令提供了事件修饰符。

.stop - 调用 event.stopPropagation()。

.prevent - 调用 event.preventDefault()。

.capture - 添加事件侦听器时使用 capture 模式。

.self - 只当事件是从侦听器绑定的元素本身触发时才触发回调。

.{keyCode | keyAlias} - 只当事件是从特定键触发时才触发回调。

.native - 监听组件根元素的原生事件。

.once - 只触发一次回调。

.left - (2.2.0) 只当点击鼠标左键时触发。

.right - (2.2.0) 只当点击鼠标右键时触发。

.middle - (2.2.0) 只当点击鼠标中键时触发。

.passive - (2.3.0) 以 { passive: true } 模式添加侦听器

**注意**

事件修饰符可以串联，方向是从左到右。

## click.self.prevent 与 click.prevent.self的区别
如果这两个事件处理器在外部元素，点击内部事件时：
1. 前者因为先判断self，所以不会阻止默认行为和调用click的事件回调
2. 后者因为点击的时候先阻止了默认行为（如跳转链接），然后判断self，如果不是点击自身，不执行事件处理回调

总结：
.self.prevent只会阻止事件在元素自身时的默认行为。从下层冒泡来事件不会受到影响，默认行为和事件回调都会触发。.prevent.self阻止在自身和子元素上的事件默认行为。[vue3.0文档改动](https://github.com/vuejs/docs/pull/1425/files)终于修改了这个之前看了几百遍都看不懂的tip。改完之后就比较符合实际表现了。个人理解，.prevent.self的prevent首先生效，阻止默认行为，影响自身和子元素，之后.self正常作用，只在事件从自身触发时才触发回调。

## 使用事件抛出一个值

vm.$emit(eventName, [...args]) 触发当前实例上的事件。

参数：eventName:String，事件名。args，附加参数，会传给监听器回调。

当在父级组件用v-on监听这个事件的时候，我们可以在监听器回调的字符串表达式中通过```$event```访问到被抛出的附加参数：

```html
v-on:input="searchText = $event"
```
或者，如果这个事件处理函数是一个方法，这个值将会作为第一个参数传入这个方法：
```html
v-on:input="someMethod"
```

```js
new Vue({
  el: '#emit-example-argument',
  methods: {
    someMethod: function (paramerters) {
      alert(paramerters)
    }
  }
})
```