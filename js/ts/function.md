# TypeScript函数进阶

## 函数类型表达式
最简单的描述函数类型的方式是函数类型表达式，看起来就像箭头函数：

```ts
fn: (a: string) => void
```

注意参数名是必须要写的，参数名不一样要和实际定义时的参数名一致。用type关键字还可以为一个函数类型建立别名。

## 范型函数
```ts
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

有时候输入和输出的类型需要对应起来，通过范型可以做到。

### 写出好范型函数的建议
1. 尽量不要用extends无意义的约束一个范型
2. 越少范型越好
3. 范型通常用来关联多个值的类型，如果只有一个值使用到了范型，重新考虑是否需要使用范型

## Function Overloads（重载）
在TypeScript中，可以通过重复写几个函数签名，然后接着写一个函数体来完成一个重载签名，也就是一个函数能够拥有多种调用方式。
```ts
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
// No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```

**注：**

overload在字典里查出来是超载、过载，在计算机编程术语则是重载，像Java中就有重载。指的是定义一些名称相同，参数不同的方法，根据参数的不同样式，选择合适的方法执行。和覆盖/覆写（override）的区别：覆盖是在子类型中用同样的方法签名，输入输出都一样，覆盖父类型中的同名方法，达到调用时实际使用的是子类型方法的目的或者现象。

### 重载签名和实现签名
具有函数体的签名叫做实现签名，它是不可调用（或者叫外界不可见）的。只有重载签名可以被调用，实现签名负责提供函数实现。

同时，实现签名需要同时兼容所有重载签名，也就是输入输出。

### 一些好建议
优先使用联合类型，然后才是函数重载。

## 返回void类型
有两种情况需要区别一下。

如果函数表达式通过上下文类型推出这个函数具有返回void的类型，即使实现的时候函数返回其他类型的值，这个值会被忽略。这种行为可以兼容一些标准内置函数如```Array.prototype.forEach```，即使forEach期待接受的函数具有返回void的类型，还是可以传入一个返回其他类型的函数，例如：

```ts
const src = [1, 2, 3];
const dst = [0];
 
src.forEach((el) => dst.push(el));
```
这个例子，push返回一个number。

另外一种情况，如果显式地声明了一个函数返回void，那么函数的实现不能返回其他类型的值：
```ts
function f2(): void {
  // @ts-expect-error
  return true;
}
 
const f3 = function (): void {
  // @ts-expect-error
  return true;
};
```

[返回](type.md#函数)