# 类型

## [README](README.md)

## 静态类型检查
静态类型检查系统描述了程序运行时使用的值所应该具有的形式和行为。

在TypeScript中，访问不存在的对象属性会被发现并反馈出来。

可以在声明变量的时候显式地声明变量的类型，如果没有显示声明类型，TypeScript也可以“隐式地”推测出变量的类型。

## 基础类型（primitives）
JavaScript中的基础类型：```string```、```number```、```boolean```。

**注意**

用小写单词表示类型，大写单词通常表示很少出现在代码中的这些类型的构造函数。

标识数组成员的时候，使用```number[]```这样的语法，```Array<number>```有时也可以。

## any
类型any用来表示任意类型，这个类型用来告诉TypeScript开发者能够知道这个类型实际代表的是什么。TypeScript不会检查这个类型，基本上就是变成写JavaScript了。

## 函数

当一个参数具有类型声明，传给函数的参数就会被检查。

和变量声明一样，函数返回值的类型也能够自动推测出。根据项目的规定来决定是否在函数声明的参数列表后面写上函数的返回值类型，像这样：

```ts
function getFavoriteNumber(): number {
  return 26;
}
```

### 匿名函数
TypeScript能够根据调用上下文推测出匿名函数的参数的类型，这个过程被称为“上下文类型化”

## 对象
定义一个对象类型，简单地说，就是将对象属性和属性的类型列出来。

```ts
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```
可以用```,```或```;```分隔属性，列表尾部的分隔符可选。

用```?:```表示属性为可选，访问可选属性前需要判断是否为```undefined```，或者使用JavaScript的[可选链操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining)：

```ts
//判断是否为undefined
obj.last !== undefined

// 可选链操作符
obj.last?.toUpperCase()
```