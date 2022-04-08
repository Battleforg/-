# CSS

## 横向滚动条
要点：
1. 设置内容宽度，width
2. white-space: nowrap防止折行
3. overflow-y: hidden, 不让出现垂直滚动条
4. ::-webkit-scrollbar可以设置滚动条样式，display：none，去掉滚动条

## BFC（块级格式化上下文）
[参考](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

举例一些可以创建块级格式化上下文的方式：
1. 根元素```<html>```
2. 浮动元素，也就是元素的float不是none
3. 绝对定位元素，元素的position为absolute或fixed
4. overflow属性不为visible，即auto、scroll、hidden
5. 弹性元素（display为flex或inline-flex元素的直接子元素）

块格式化上下文包含创建它的元素内部的所有内容。

块格式化上下文对浮动定位与清除浮动都很重要。浮动定位和清除浮动时只会应用于同一个BFC内的元素。浮动不会影响其它BFC中元素的布局，而清除浮动只能清除同一BFC中在它前面的元素的浮动。外边距折叠（Margin collapsing）也只会发生在属于同一BFC的块级元素之间。

利用BFC的特点，可以应用在：
1. 让浮动内容和周围的内容等高
2. 创建新的BFC避免两个相邻```<div>```之间的外边距合并问题

## [flex布局](flex.md)

## CSS优先级
稍微复杂的样式表中可能存在两条甚至多条规则同时选择一个元素的情况。CSS通过一种叫做层叠（cascade）的机制来解决这种冲突。层叠机制的原理是为规则赋予不同的重要性：
1. 标注为!important的用户（浏览器用户）样式
2. 标注为!important的作者（网站作者）样式
3. 作者样式
4. 用户样式
5. 浏览器（或用户代理）的默认样式

在此基础上，规则再按选择符的特殊性排序。特殊性高的选择符会覆盖特殊性低的选择符，如果两条规则的特殊性相等，则后定义的规则优先。

### 特殊性
任何选择符的特殊性都对应如下4个级别：a、b、c、d。

1. 行内样式，a为1
2. b等于ID选择符的数目
3. c等于类选择符、伪类选择符及属性选择符数目
4. d等于类型选择符和伪元素选择符的数目
5. *（通用选择符）的 特殊性为0

关于链接元素伪类的次序：```:link :vistied :hover :focus :active```。英文速记：Lord Vader Hates Furry Animals.

## 浮动
css的float属性可以是这些值：left、right、none、inline-start、inline-end。除了none表示元素不进行浮动外，设置为其他值都会导致元素浮动。

当一个元素浮动之后，它会被移出正常的文档流，然后向左或者向右平移，一直平移直到碰到了所处的容器的边框，或者碰到另外一个浮动的元素。如果包含块太窄，无法容纳所有浮动元素水平排列，则后面的浮动元素会向下移动。如果浮动元素高度不同，则后面的浮动元素在向下移动时可能会“卡”在前面的浮动元素右侧

### 清除浮动
如果浮动元素后面跟着的是常规文档流中的元素，那么这个元素的盒子就会当浮动元素不存在一样，该怎么布局就怎么布局。但是，这个元素盒子中的文本内容则会记住浮动元素的大小，并在排布时避开它，为其留出响应的空间。从技术角度来讲，就是跟在浮动元素后面的行盒子会缩短，从而为浮动元素留空，造成文本环绕浮动盒子的效果，这是浮动原本的作用。

要阻止行盒子环绕在浮动盒子外面，需要给包含行盒子的元素应用clear属性。clear属性的值有left、right、both和none，用于指定盒子的哪一边不应该紧挨着浮动盒子。

清除一个元素本质上会为所有前面的浮动元素清理出一块垂直空间。这就为使用浮动布局创造了条件，因为周围的元素可以为浮动元素腾出地方来。

清除浮动可以利用空元素加css：
```html
<div class="clear"></div>
```

```css
.clear {
  clear: both;
}
```

更好的方式是使用```:after```伪元素：
```css
.media-block:after {
  content: " ";
  display: block"
  clear: both;
}
```

## CSS画三角形
A.利用伪元素画三角，不在DOM中
```css
.info-tab {
    position: relative;
}

.info-tab::after {
    content: "";
    border: 4px solid transparent;
    border-top-color: #2c8ac2;
    position: absolute;
    top: 0;
}
```

B.使用额外元素加css画三角，在DOM中

采用的是相邻边框连接处的均分原理。将元素的宽高设为0，只设置border，把任意三条边隐藏掉（颜色设为transparent），剩下的就是一个三角形。

```css
#demo {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: transparent transparent red transparent;
}
```

## 堆叠上下文
在一个堆叠上下文内部，无论z-index值大小，都不会影响其他堆叠上下文。

堆叠上下文由特定属性和值创建，比如任何设置了position: absolute及值不是auto的z-index属性的元素，都会创建一个自己后代元素的堆叠上下文。

设置小于1的opacity值也可以触发新的堆叠上下文

## 参考书
《精通CSS：高级Web标准解决方案》