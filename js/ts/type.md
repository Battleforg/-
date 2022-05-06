# 类型
[README](README.md)

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

### any vs unknown

unknown类型和any类型类似，都可以表示任何值。但是unknown更安全，因为不能对一个unknown值做任何事情。
```ts
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
  // Object is of type 'unknown'.
}
```

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

### [函数进阶](function.md)

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

### [对象进阶](object.md)

## 联合类型
联合类型是一种由两个或多个类型组合而成的类型，用来表示可能是这些类型（联合的成员类型）中的任意一种类型。例如```id: number | string```表示变量id可以是number或者string类型。

在没有缩小联合类型的范围之前，TypeScript只允许代码中出现对所有成员类型都合法的操作。

可以像JavaScript时一样通过判断类型来缩小或限定联合类型的范围，之后就可以使用仅对某个或某些类型合法的操作了。

## 类型别名
通过```type yourTypeName```可以将一个类型声明为```yourTypeName```。

**注意**

别名终究还只是别名

### 接口（Interfaces）
接口是另一种定义对象类型的方式，它和类型别名声明类型类似。关键的区别在于拓展和添加新属性的方式不同：

接口可以通过```extends```拓展另一个接口，而type（类型别名）要用```&```（交集操作）。
```ts
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

const bear = getBear() 
bear.name
bear.honey
```

```ts
type Animal = {
  name: string
}

type Bear = Animal & { 
  honey: boolean 
}

const bear = getBear();
bear.name;
bear.honey;
```

重复声明接口可以往已有接口中添加新的属性，而类型声明则不行

```ts
interface Window {
  title: string
}

interface Window {
  ts: TypeScriptAPI
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```

```ts
type Window = {
  title: string
}

type Window = {
  ts: TypeScriptAPI
}

 // Error: Duplicate identifier 'Window'.
```

最后，接口只能用来声明对象类型，而不能重命名原始类型。

## 类型断言
用```as```关键字可以表示一个类型可以具体是某个类型

## 字面量类型
当用let和var声明变量时，由于变量允许变化，TypeScript只会推测出大概的类型。

const则不同，TypeScript通过唯一的值确定“字面量类型”。

```ts
const constantString = "Hello World";
// constantString的类型为：const constantString: "Hello String"
```

比较有价值的用途在函数声明中，通过将参数声明或返回值为字面量类型，可以确保输入输出为制定类型：

```ts
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}

function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}

```