# flex布局
正式的名称应该是弹性盒子布局，或者Flexbox布局。

## Flexbox
也就是Flexible Box Layout模块，是CSS提供的用于布局的一套新属性。这套属性包含针对容器（弹性容器，flex container）和针对其直接子元素（弹性项，flex item）的两类属性。Flexbox可以控制弹性项的如下方面：
1. 大小，基于内容及可用空间
2. 流动方向，水平还是竖直，正向还是反向
3. 两个轴向上的对齐与分布
4. 顺序，与源代码中的顺序无关

## 主轴与辅轴
Flexbox可以针对页面中的某一区域，控制其中元素的顺序、大小、分布及对齐。这个区域内的盒子可以沿两个方向排列：默认水平排列（排成一行），也可以垂直排列（成一列）。这个排列方向称为主轴。

与主轴垂直的方向称为辅轴，区域内的盒子可以沿辅轴发生位移或伸缩。

主轴方向的尺寸为主尺寸：水平方向时的宽度或垂直布局时的高度。

如果不指定大小，Flex容器内的项目会自动收缩。

## 对齐与空间
沿主轴的排列叫排布（justification），沿辅轴的排列则叫对齐（alignment）。

指定排布的属性是justify-content，默认值flex-start，其他的值还有flex-end、center、space-between、space-around。

如果指定某一项一侧的外边距值为auto，而且在容器里那一侧还有空间，那么该外边距就会扩展占据可用空间。

控制辅轴对齐的属性是align-items，其默认值是stretch，其他还有flex-start、center、flex-end。

辅轴上对齐个别项用align-self。

### 使用Flexbox和自动外边距实现垂直并水平居中

Flex容器中是单子元素时
```css
html, body {
  height: 100%;
}

.flex-container {
  height: 100%;
  display: flex;
}

.flex-item {
  margin: auto;
}
```

如果Flex容器中有多个元素
```css
.author-meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
```

## Flexbox中的伸缩

可伸缩体现在以下三个属性：flex-basic、flex-grow、flex-shrink。使用flex属性可以将这三个属性合并简写成一个，形式为：
```
flex: flex-grow flex-shrink flex-basis
```
注意简写属性中的flex-basis必须带单位，或者加百分号。

### flex-basis
这个属性指定了弹性项在主轴方向上的初始大小，可以是长度值（如18em）、百分比（相对于容器的主轴而言），也可以是关键字auto及其他固有关键词。

如果是auto，这个项目会从对应的属性（width或height）那里获得主尺寸，如果没有设置主尺寸，那么根据其内容确定其大小。

如果是content，也是根据项目内容设置大小，但是会忽略通过width或height设置的主轴尺寸。这个关键字可能有兼容性问题。

### flex-grow
默认为0，在通过flex-basis设置了首选大小之后，如果还有剩余空间，那么按照系数决定如何伸展，“1”代表占剩余空间的一份。假如有三个项，系数分别是1，2，3，那么“1”这个项分到1/（1+2+3）份空间。

如果flex-basis的值是0，意味着项目的大小会来自按flex-grow的比例分配弹性容器。

### flex-shrink
默认为1，与flex-grow相反，如果空间不够，需要计算收缩的系数。计算系数时，每个项目先用自己的flex-shrink乘以自己的flex-basis，然后除以每一项的flex-shrink和flex-basis的乘积之和。具体来说，如果有两个弹性项
```css
.navbar li:first-child {
  flex: 1 1 800px;
}

.navbar li:last-child {
  flex: 1 1 500px;
}
```
如果一共要收缩300px，第一个子元素的计算：(800 * 1) / ((800 * 1) + (500 * 1)) * 300 = 184.6

### flex-basic、flex-grow、flex-shrink的关系
对于如何使用这三个属性，Flexbox使用两个步骤：
1. 检查flex-basic，确定假想的主尺寸。
2. 确定实际的主尺寸。如果按照假想的主尺寸把各项排布好之后，容器内还有剩余空间，那么它们可以伸展。伸展多少由flex-grow系数决定。相应地，如果容器装不下那么多项，则根据flex-shrink系数决定各项如何收缩。

## Flexbox布局
flex-direction指定了内部元素是如何在 flex 容器中布局的，定义了主轴的方向（正方向或反方向）。

请注意，值 row 和 row-reverse 受 flex 容器的方向性的影响。 如果它的 dir 属性是 ltr，row 表示从左到右定向的水平轴，而 row-reverse 表示从右到左; 如果 dir 属性是 rtl，row 表示从右到左定向的轴，而 row-reverse 表示从左到右。

```flex-wrap: wrap```允许子元素折行，配合wrap-direction可以改变折行的方向。

给弹性项设置max-width，可以限制可伸缩的范围。

align-content（默认值是stretch）对容器中多行的作用，与justify-content对主轴内容排布的作用非常相似。通过align-content可以把多行排布到flex-start（容器顶部）、flex-end（容器底部）、center（中部），还可以通过space-between和space-around让多行隔开。

## 个别排序
默认情况下，每个项目的order值都是0，即按照它们在源代码中的顺序出现。

通过Flexbox中的order值可以改变摆放项目的顺序。order值不一定要连续，而且正负值都可以。数值小的在前面。

**警告**

通过Flexbox重排次序只影响呈现的结果。按Tab键切换焦点和屏幕阅读器并不会受order属性的影响。因此HTML代码还是要按逻辑来写。


## 参考书
《精通CSS：高级Web标准解决方案》