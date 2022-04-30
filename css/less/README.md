# LESS

## 变量（Variables）
@后面加变量名：```@variable```，值可以是具体的css属性值、表达式、函数运算

```less
// Variables
@link-color:        #428bca; // sea blue
@link-color-hover:  darken(@link-color, 10%);

// Usage
a,
.link {
  color: @link-color;
}
a:hover {
  color: @link-color-hover;
}
.widget {
  color: #fff;
  background: @link-color;
}
```

less经过编译可以变成css：

less：
```less
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}
```

编译为：
```css
#header {
  width: 10px;
  height: 20px;
}
```

### 变量作为插值
变量除了可以作为css属性的值被使用，还可以在选择器名、URL、import和属性名中作为插值使用。

选择器：
```less
// Variables
@my-selector: banner;

// Usage
.@{my-selector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}
```
编译为：
```css
.banner {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}
```
URLs
```less
// Variables
@images: "../img";

// Usage
body {
  color: #444;
  background: url("@{images}/white-sand.png");
}
```

Import语句
```less
// Variables
@themes: "../../src/themes";

// Usage
@import "@{themes}/tidal-wave.less";
```

属性
```less
@property: color;

.widget {
  @{property}: #0ee;
  background-@{property}: #999;
}
```

编译为：
```css
.widget {
  color: #0ee;
  background-color: #999;
}
```

### 用一个变量定义另一个变量
在Less中，可以用一个变量定义另一个变量

```less
@primary:  green;
@secondary: blue;

.section {
  @color: primary;

  .element {
    color: @@color;
  }
}
```

编译为：
```css
.section .element {
  color: green;
}
```

## 混合（Mixins）
通过混合，可以将一组属性从一个规则集包含到另一个规则集中。

假设有一个类：
```less
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```

可以在其他规则集中复用这个类：
```less
#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```
这样，```#menu a```和```.post a```可以包含```.border```拥有的属性

编译为：
```css
#menu a {
  color: #111;
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

.post a {
  color: red;
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```
混入调用需要在调用的规则集（例如类和ID选择器）后像调用函数一样使用```()```

### 不输出混入
如果不想在输出的css中包含混入规则集本身，在混入的定义处使用```()```：
```less
.my-other-mixin() {
  background: white;
}
```
```.my-other-mixin```这个类自身不会输出到css中，使用了这个类的其他规则集能在输出的css包含这个类拥有的属性。

### 混入中的选择器
在混入中用```&```表示使用混入的规则集：
```less
.my-hover-mixin() {
  &:hover {
    border: 1px solid red;
  }
}
button {
  .my-hover-mixin();
}
```

输出
```css
button:hover {
  border: 1px solid red;
}
```
注意混入中的```&```被替换成了包含混入的```button```类型选择器

### 混入的命名空间
通过命令空间可以避免不同库之间的混入和自定义的混入发生冲突：
```less
#my-library {
  .my-mixin() {
    color: black;
  }
}
// which can be used like this
.class {
  #my-library.my-mixin();
}
```

### 条件混入
通过在混入定义加入条件，控制符合条件的情况才使用混入：
```less
#namespace when (@mode = huge) {
  .mixin() { /* */ }
}

#namespace {
  .mixin() when (@mode = huge) { /* */ }
}
```

## 嵌套（Nesting）

## 运算（Operation）


## 参考资料
[less中文文档](https://less.bootcss.com/)