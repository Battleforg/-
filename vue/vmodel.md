# v-model

## [README](./README.md)

v-model 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

1. text 和 textarea 元素使用 value property 和 input 事件；
2. checkbox 和 radio 使用 checked property 和 change 事件；
3. select 字段将 value 作为 prop 并将 change 作为事件。

## 在组件上使用v-model
在原生元素上使用v-model
```html
<input v-model="searchText">
```

等价于

```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

当应用于组件时，
```html
<custom-input v-model="searchText"></custom-input>
```

等价于

```html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

想这样做，需要组件：
1. 接收名为“value”的prop
2. 将组件内的一个```<input>```元素的 value attribute 绑定到一个名叫 value 的 prop 上
3. 在```<input>```元素的 input 事件被触发时，将新的值通过**自定义**的 input 事件抛出

组件的代码：
```js
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```