# DOM事件流 vs 调用HTMLElement.click方法 在触发事件回调的区别

## [总集](../README.md)

[来源：Jake Archibald - Tasks, microtasks, and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

本来是在研究事件循环的，偶然发现了一位Chrome老哥写的关于任务和微任务的文章，看了一下，稍微明白了一点任务队列和微任务队列之间的关系

结果一个副产物就是发现原来点击触发的click事件和调用[click]()方法触发事件是不一样的。先来一点html：

```html
<div class="outer">
  <div class="inner"></div>
</div>
```
完整代码看仓库，其实就是加上构成完整html文档的其他代码。比较关键的有对css和js的引用。

```js
const outer = document.querySelector('.outer');
const inner = document.querySelector('.inner');
const clickBtn = document.querySelector('.click-btn');

new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true,
});

const onClick =() => {
  console.log('click');
  
  setTimeout(() => {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function () {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

const testFireClick = () => {
  console.log('fire inner click');
  inner.click();
}

inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);
clickBtn.addEventListener('click', testFireClick);
```
js代码和老哥展示的基本一致，除了用上es2015之后的东西，老哥写那文的时候es2015才刚出的样子。另外加了一个按钮用来触发inner.click的调用。

## 有什么区别
首先点击内层元素inner的时候控制台的输出是：```click```,```promise```,```mutate```,```click```,```promise```,```mutate```,```timeout```,```timeout```

点击按钮调用inner.click()，除开调用click方法前的输出：```click```,```click```,```promise```,```mutate```,```promise```,```timeout```,```timeout```

### 输出1
之前我和这老哥一样，都以为微任务是在任务结束前执行。实际上参考HTML规范的说明，在任务结束后，执行一个微任务检查点([规范](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model))。如果这时执行上下文的栈恰好是空的，那么执行回调也会[触发微任务检查点](https://html.spec.whatwg.org/multipage/webappapis.html#incumbent)，相似的描述在事件循环[章节](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint)。检查点有标志机制防止多次触发检查点带来的混乱。

在微任务检查点会执行微任务队列中的微任务直到队列空，所以是```click```,```promise```,```mutate```的顺序。

这里面有个问题，为什么inner的回调执行完才开始执行outer的回调？下面结合输入1的执行过程来说明。

执行上下文在dom加载完后开始执行，首先执行代码中的同步部分，最后注册事件回调。事件回调这时进入任务队列，但是由于没有事件触发，所以这些回调都不是可运行的任务。时间来到点击内层元素，这时触发inner上的click事件，随着DOM事件流冒泡，inner和outer注册的回调函数依次变为可执行。执行回调时，先打印click，然后设置一个尽快执行的打印“timeout”，然后是立即resovle的promise，将一个打印“promise”的微任务加入微任务队列。随后是设置outer的属性，触发MutationObserver将一个打印“mutate”的微任务加入微任务队列。回调执行完毕。这时触发微任务检查点，依次执行在队列中的微任务，即打印“promise”、“mutate”。由此可以判断outer的回调因为冒泡已经变成可执行状态，因此，inner回调加入的timeout才会排在任务队列的后面。由此可以确定任务队列的处理。接下来outer的回调开始执行，接着同样是promise和mutate。之后进入第3第4次循环，分别执行两个timout的任务，由于这之间没有微任务，所以只有连续两个“timeout”。

#### 总结
一个任务执行完，下一个可执行的任务才会开始执行，中间必定插入微任务。任务队列的[处理模型](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)的step5，6，7表明每个任务执行完，执行微任务检查点。规范里没有直接说明13个步骤执行完后如果还有任务可执行，是不是就进入下一轮执行。个人只能从章节的第一句话“An event loop must continually run through the following steps for as long as it exists:”以及事件循环的定义推测，事件循环内有一个或多个任务队列，事件循环会不停执行13个步骤直到任务队列为空，之后window事件循环应该是执行闲置算法，worker事件循环则会销毁。看来window事件循环会等到下一个任务进入任务队列。

每次执行队列中的第一个可执行任务，将这个任务从队列中“移除”（规范中特意区别微任务队列的出队，deque，来表示任务队列是一个集合，set），完整执行一个任务的所有步骤，执行微任务检查点，执行13步骤中的余下步骤。结合步骤12和模型描述一句话，推测实际上算法实现上应该返回步骤1，构成一个循环。这里借用老哥的一句话，“Testing is one way. See when logs appear relative to promises & setTimeout, although you're relying on the implementation to be correct.The certain way, is to look up the spec.”，也就是“测试是一种方式，也就看日志，当然这得依赖正确的（浏览器）实现。更好的方式是查阅规范（或者叫标准）”。从规范中描述的算法，其实就足够得出上述结论。

### 关于输出1的题外话
实际上利用function声明中this关键字在运行时绑定到DOM对象上的特点，添加了一些代码后能说明事件回调的执行顺序。下面是代码。
```js
const outer = document.querySelector('.outer');
const inner = document.querySelector('.inner');
const clickBtn = document.querySelector('.click-btn');

new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true,
});

function onClick() {
  console.log('click', this, Date.now()); // 打印调用回调的DOM和时间
  
  setTimeout(() => {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function () {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

const testFireClick = () => {
  console.log('fire inner click');
  inner.click();
}

clickBtn.addEventListener('click', testFireClick);
outer.addEventListener('click', onClick); // 先加入outer
inner.addEventListener('click', onClick); // 再加入inner
```

注意我们先将outer的回调注册，再将inner的回调注册。那么点击内层div之后的输出是什么呢？

结论是inner的回调先调用，1ms后outer的回调调用，通过this可以区分inner和outer。也就是说，虽然outer的回调先加入任务队列，但是变为可执行任务的顺序还是事件流的冒泡顺序

### 输出2
接下来看一下输出2，明显不一样的是不是？两个click在一起，mutate也只有一个，timeout倒是和之前一样。下面逐一解释关键点。

1. 两个click挨在一起，按照老哥的解释，click()导致事件是同步发出的，所以inner回调执行完接着就执行outer回调。我做了实验，调换注册inner回调和outer回调的顺序，结果一致，说明注册顺序不影响触发顺序。“触发”依旧是冒泡模型，先inner后outer。至于click()同步发出事件。规范中原文是“element.click(), Acts as if the element was clicked”。个人理解，click方法模拟了触发click事件，并且事件回调同步进入了执行栈，我还没有在任何资料中看到关于这个现象的说明。于是两个回调依次执行。
2. 注意mutate只有一个，这是inner的回调设置outer的属性，触发一个微任务加入微任务队列。在outer回调再次执行设置outer属性时，由于MutationObserver的微任务还在队列中等待执行，因此新的微任务不会被加入队列，这里参见MutationObserver的资料。
3. 同步触发的回调执行完后，执行栈为空，触发一次微任务检查点，微任务按照入队列顺序执行“promise”、“mutate”、“promise”


## 综述
这篇文章结合click事件回调研究了任务、微任务、事件循环以及js执行栈的一些逻辑，文中大量参考一篇博文和html规范。下面以一道某大厂交付团队前端技术面试题结束本文。先看代码。

```js
function a() {
  console.log('a');

  Promise.resolve().then(function() {
    console.log('e');
  });
}

function b() {
  console.log('b');
}

function c() {
  console.log('c');
}

function d() {
  console.log('d');
  setTimeout(a, 0);
  b();
  setTimeout(c, 0);
}

d();
```

解释：

定义了一堆方法后执行方法d，首先执行输出“d”，然后将执行a做为任务加入任务队列，最快0秒后可执行，接着执行方法b，此时执行栈简单看就是\[d, b]（栈顶在尾）。执行b时输出“b”，随后b出栈。之后是将c加入任务队列，0秒后可执行。d出栈。这时栈空了，实际上触发了一次微任务检查点，由于什么微任务也没有因此无事发生。接着事件循环检查任务队列，发现第一个可执行的任务是“执行a”，取出任务。执行a，入栈，首先输出“a”，然后将立即resolve的promise的回调加入微任务队列。a方法执行完毕，出栈，栈空。面试的时候我答错了，之前我以为promise的回调会排在任务“执行c”之后。实际上，由于任务a执行完毕，触发微任务检查点，微任务开始执行，所以实际上输出“a”，执行微任务会输出“e”，之后事件循环才从任务队列中取出下一个任务，也就是“输出c”。

## 附录
在我调查任务、微任务的时候，其实偶然还发现了这样一个[页面](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#when_to_use_microtasks)。其中有这样两段代码：

```js
customElement.prototype.getData = url => {
  if (this.cache[url]) {
    this.data = this.cache[url];
    this.dispatchEvent(new Event("load"));
  } else {
    fetch(url).then(result => result.arrayBuffer()).then(data => {
      this.cache[url] = data;
      this.data = data;
      this.dispatchEvent(new Event("load"));
    });
  }
};
```

```js
element.addEventListener("load", () => console.log("Loaded data"));
console.log("Fetching data...");
element.getData();
console.log("Data fetched");
```

当data没有被缓存时，输出是
```
Fetching data
Data fetched
Loaded data
```

缓存后，输出是
```
Fetching data
Loaded data
Data fetched
```

为什么？
我们知道promise的回调是微任务，事件回调是任务。那为什么缓存后，事件回调跑同步代码前面去了？

这里的问题在于[dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)。这个方法会```同步```地调用事件回调方法，因此缓存前由微任务触发的回调排在同步代码后面，而缓存后getData方法同步地触发了事件回调的输出，使“Loaded data”先输出了。原来如此。