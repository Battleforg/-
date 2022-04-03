# Hook

## Hook使用规则

Hook就是JavaScript函数，使用中有两个额外规则：
1. 只能在**函数最外层**调用 Hook。不要在循环、条件判断或者子函数中调用。React通过hook的调用顺序确保state和对应的hook进行关联。
2. 只能在**React 的函数组件**中和**自定义的 Hook**调用 Hook。不要在其他 JavaScript 函数中调用。

## useEffect与生命周期方法
可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

useEffect告诉React在渲染之后执行一些操作，React保存传入useEffect的函数，并在执行DOM更新之后调用它。将useEffect放在函数组件内部让effect内部可以通过JavaScript的闭包机制来获取state和props。useEffect默认在每次渲染完成之后都会执行，无论是第一次渲染还是每次更新之后。可以通过设置依赖数组（useEffect的第二个参数）来告诉React改变默认行为。React保证了每次运行effect的同时，DOM都已经更新完毕。

每次重新渲染，都会生成新的effect，替换掉之前旧的。

effect中可以返回一个函数，作为可选的清除effect机制。React会在每次渲染的时候清除上一次effect，之后再执行新的effect。

如果第二个参数传入了一个空数组（[]），effect 内部的 props 和 state 就会一直持有其初始值。

## 自定义hook
自定义 Hook 是一种重用状态逻辑的机制(例如设置为订阅并存储当前值)，所以每次使用自定义 Hook 时，其中的所有 state 和副作用都是完全隔离的。

## useState
```js 
const [state, setState] = useState(initialState);
```

在初始渲染期间，返回的状态 (state) 与传入的第一个参数 (initialState) 值相同。setState 函数用于更新 state。它接收一个新的 state 值并将组件的一次重新渲染加入队列。在后续的重新渲染中，useState 返回的第一个值将始终是更新后最新的 state。

**注意**

React 会确保 setState 函数的标识是稳定的，并且不会在组件重新渲染时发生变化。这就是为什么可以安全地从 useEffect 或 useCallback 的依赖列表中省略 setState

### 初始state
initialState 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用：
```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});

```

## useCallback
```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);

```

返回一个 memoized 回调函数。

把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 shouldComponentUpdate）的子组件时，它将非常有用。

## useMemo
```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。
**注意**

传入 useMemo 的函数会在渲染期间执行，请不要在这个函数内部执行与渲染无关的操作。