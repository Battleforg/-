# Redux

## Flux架构
一个Flux应用由三大部分组成：dispatcher、store和view。dispatcher负责分发事件。store负责保存数据，响应事件并更新数据。view负责订阅store中的数据，并使用这些数据渲染页面。

Flux的核心思想是中心化控制数据。view-》action creator -》action -》dispatcher-》store-》view的闭环

## Redux三大原则
1. 单一数据源
2. 状态是只读的
3. 状态修改由纯函数完成

在Redux中，不会定义store，而是定义一个reducer，根据当前应用的state进行迭代，不修改原state，而是返回新state。Redux闭环变成view-》action creator-》action-》reducer-》new state-》view。

## reducer
Redux通过reducer生成store，reducer通过previousState和action生成newState，第一次执行的时候，previousState由默认state提供。

## store
由createStore接受reducer作为参数生成，view通过store.getState()获取store中的状态并通过store.dispatch()分发action给reducer。