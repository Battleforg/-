# 函数

## [总集](./README.md)

## Function.prototype.bind()
创建一个新函数对象，新函数的this被指定为bind()的第一个参数，其余参数将作为新函数的参数，供调用时使用。如果thisArg是null或undefined，执行作用域的this会作为新函数的thisArg。

bind() 函数会创建一个新的绑定函数（bound function，BF），它包装了原函数对象。调用绑定函数通常会导致执行包装函数。
绑定函数具有以下内部属性：

1. [[TargetFunction]] - 包装的函数对象
2. [[BoundThis]] - 在调用包装函数时始终作为 this 值传递的值。
3. [[BoundArguments]] - 列表，在对包装函数做任何调用都会优先用列表元素填充参数列表。
4. [[Call]] - 执行与此对象关联的代码。通过函数调用表达式调用。内部方法的参数是一个this值和一个包含通过调用表达式传递给函数的参数的列表。

当调用绑定函数时，它调用内部方法 [[Call]]，就像这样 Call(boundThis, args)。其中，boundThis 是 [[BoundThis]]，args 是 [[BoundArguments]] 加上通过函数调用传入的参数列表，然后以boundThis作为this，args作为参数执行[[TargetFunction]]的逻辑。