# 对象进阶

## 可选属性
在定义对象属性的时候，可以用```?:```表示一个属性可选，需要在实现中处理属性为```undefined```的情况。

对象解构赋值并提供默认值也可以用于有可选属性的对象。需要注意的是，由于```:```在解构赋值中已经用来表示解构变量并重命名，目前TypeScript中只能在解构赋值之后标注类型。
```ts
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  //(parameter) xPos: number
  console.log("x coordinate at", xPos); 
  //(parameter) yPos: number
  console.log("y coordinate at", yPos);
  // ...
}
```

## readonly属性
```ts
interface SomeType {
  readonly prop: string;
}
```

可以像使用const标注一个变量一样，用readonly标注一个属性，这个属性在TypeScript中不可写。和const类似，如果属性是一个对象，对象的属性可能还是可以写，只是这个对象属性本身不可写。

## 拓展类型
在使用```extends```拓展interface的时候，可以进行多重拓展。

## 交集类型

可以用```&```运算符和```type```关键字声明类型别名来创造交集类型，交集类型具有```&```运算符的所有操作数类型的属性。

交集和拓展的区别主要是在类型别名和创造新类型上。

## 通用对象
利用范型和接口、类型别名，可以创造更加通用的对象类型。

```ts
interface Box<Type> {
  contents: Type;
}

let boxA: Box<string> = { contents: "hello" };
boxA.contents; // (property) Box<string>.contents: string
```
还可以很好的和函数中的范型结合起来使用：
```ts
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```

类型别名同样可以变得通用

```ts
type Box<Type> = {
  contents: Type;
};

type OrNull<Type> = Type | null;
 
type OneOrMany<Type> = Type | Type[];
 
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>; // OneOrMany<Type> | null

type OneOrManyOrNullStrings = OneOrManyOrNull<string>; // OneOrMany<string> | null
```

## Array和ReadonlyArray

```Type[]```是```Array<Type>```的简写。

和用readonly标注只读属性一样，可以用ReadonlyArray标注只读数组，一样的，这只是TypeScript层面用来提示数组是不可修改的，并没有一个构造函数叫ReadonlyArray。

```readonly Type[]```是```ReadonlyArray<Type>```的缩写

[返回](type.md#对象)