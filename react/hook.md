# Hook

## Hook使用规则

Hook就是JavaScript函数，使用中有两个额外规则：
1. 只能在**函数最外层**调用只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
2. 只能在**React 的函数组件**中和**自定义的 Hook**调用 Hook。不要在其他 JavaScript 函数中调用。