# DOM事件流 vs 调用HTMLElement.click方法 在触发事件回调的区别

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

点击按钮调用inner.click()，不管调用前的输出：```click```,```click```,```promise```,```mutate```,```promise```,```timeout```,```timeout```

### 输出1
正常DOM事件流中事件回调是触发一个回调就将这个加入任务队列，处理完后清空执行上下文，这是触发微任务执行。之前我和这老哥一样，都以为微任务是在任务结束前执行。实际上参考HTML规范的说明，在任务结束后，执行一个微任务检查点([规范](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model))。如果这时执行上下文的栈恰好是空的，那么执行回调也会[触发微任务检查点](https://html.spec.whatwg.org/multipage/webappapis.html#incumbent)，相似的描述在事件循环[章节](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint)。检查点有标志机制防止多次触发检查点带来的混乱。

在微任务检查点会执行微任务队列中的微任务直到队列空，所以是```click```,```promise```,```mutate```的顺序。

这里面有个问题，为什么inner的回调执行完并清空执行栈了才开始执行outer的回调？
暂时先放两种猜想在这：一种可能是冒泡中事件回调是一层一层执行的，也就是先将inner回调加入队列，执行，冒泡到outer，加入队列，再执行这样。另外一种就是有些资料，比如[mdn](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop#%E6%B7%BB%E5%8A%A0%E6%B6%88%E6%81%AF)，说两个事件回调都按顺序加入队列，但是每个任务执行完，清空执行栈，执行微任务，之后才会在下一次事件循环执行下一个任务。

