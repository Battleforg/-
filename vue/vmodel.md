# v-model

## [README](./README.md)

v-model 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

1. text 和 textarea 元素使用 value property 和 input 事件；
2. checkbox 和 radio 使用 checked property 和 change 事件；
3. select 字段将 value 作为 prop 并将 change 作为事件。