# Hook

## Hook使用规则

Hook就是JavaScript函数，使用中有两个额外规则：
1. 只能在**函数最外层**调用只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。React通过hook的调用顺序确保state和对应的hook进行关联。
2. 只能在**React 的函数组件**中和**自定义的 Hook**调用 Hook。不要在其他 JavaScript 函数中调用。

## useEffect与生命周期方法
可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

useEffect告诉React在渲染之后执行一些操作，React保存传入useEffect的函数，并在执行DOM更新之后调用它。将useEffect放在函数组件内部让effect内部可以通过JavaScript的闭包机制来获取state和props。useEffect默认在每次渲染完成之后都会执行，无论是第一次渲染还是每次更新之后。可以通过设置依赖数组（useEffect的第二个参数）来告诉React改变默认行为。React保证了每次运行effect的同时，DOM都已经更新完毕。

每次重新渲染，都会生成新的effect，替换掉之前旧的。

effect中可以返回一个函数，作为可选的清除effect机制。React会在每次渲染的时候清除上一次effect，之后再执行新的effect。