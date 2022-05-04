## 缩小类型范围（narrowing）

[README](README.md)

将类型从宽泛变为具体的过程被称为缩小类型范围（narrowing）。有几种方法可以缩小类型范围。

## typeof类型检查
利用typeof操作符可以检测出以下类型：string、number、bigint、boolean、symbol、undefined、object、function

注意，typeof null的结果是object

## 真值（truthiness）检查
值0、NaN、""（空字符串）、 0n（bigint版本的0）、null、undefined在逻辑运算中被转换为false，所有其他值为true。

## 相等性检查
通过switch和严格相等运算符，可以判断一个变量是不是某个类型，从而缩小类型范围。

即使是不严格相等运算符，在判断null和undefined时也会有作用

## in操作符
利用in操作符，如果一个对象类型包含某个属性，它会出现在true的分支，反之则出现在false的分支

注意可选属性，它会导致对象类型同时出现在两个分支。

## instanceof
如果一个变量用instanceof操作符判断出是某个构造函数的实例，那这个变量的类型也就缩小到了这个构造函数表示的类型。

## 通过赋值确定类型
大多数赋值操作都可以帮助TypeScript隐式地确定变量的类型，类型在声明的时候确定，后续尝试赋值其他类型的值会引起错误提示。

## 控制流分析
TypeScript也许会通过代码控制流来推测变量的类型。

## never类型
当使用类型缩小，有时会将一个集合的可能类型缩小到最后没有任何其他的可能性了。TypeScript用```never```表示一种类型不可能存在的“状态”。

never类型可以赋值给其他任何类型，而只有never类型可以赋值给never类型。也就是说，可以在switch语句中用类型缩小和never类型完成完整的类型检查：所有的可能的类型都会得到考虑。

```ts
type Shape = Circle | Square;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```
而由于添加了新类型，没有完成完备性检查会导致一个TypeScript错误：
```ts
interface Triangle {
  kind: "triangle";
  sideLength: number;
}
 
type Shape = Circle | Square | Triangle;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck;
  }
}
```