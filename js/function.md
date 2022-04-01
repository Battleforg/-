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

## 箭头函数
箭头函数不能使用arguments、super和new.target，也不能用作构造函数，没有prototype属性

## 函数声明
函数声明会在任何代码执行之前先被读取并添加到执行上下文，这个过程叫作函数声明提升。

## this
在标准函数中，this引用的是把函数当成方法调用的上下文对象，这时通常称其为this值。

在箭头函数中，this引用的是定义函数的上下文。

## call和apply
函数从原型继承了两个方法call()和apply()，这两个方法作用一样，只是传参的形式不同。第一个参数一样，是this值。apply的第二个参数可以是Array的实例，也可以是arguments对象。而call要将剩下的要传给被调用函数的参数则是逐个传递的。

到底是使用apply还是call，完全取决于怎么给要调用的函数传参更方便。

## 闭包
闭包指的是那些引用了另一个函数作用域中变量的函数，通常是在嵌套函数中实现的。这是因为内部函数的作用域链包含外部函数的作用域。

## 立即执行函数
使用IIFE可以模拟块级作用域。

在for循环中使用let初始化索引值，由于块级作用域的存在，循环会为每个循环创建独立的变量。如果把变量声明拿到for循环外部就不行了，这时等同于在for循环内使用var声明。