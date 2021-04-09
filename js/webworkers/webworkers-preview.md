# web woker

创建后台线程运行js脚本，这个线程是真正的系统级线程，js 、UI 渲染线程（这两个在一个线程是因为需要频繁的进行数据交互）。

创建的worker将会在另一个全局上下文中，不同于当前的window，通过self获取全局作用域。

一般可用于大量的数据处理，或者处理图片而不占用 js、UI 线程的资源。

## 1. Worker -- 专用worker

### 1.1 向下兼容

```js
if (window.Worker) {
    // ...
}
```

### 1.2 创建专用worker

```js
var myWorker = new Worker('worker.js');
```

### 1.3 发送消息

​		这里的 first 和 second 代表两个`<input>`元素

```js
// 主线程
first.onchange = function() {
  myWorker.postMessage([first.value,second.value]);
  console.log('Message posted to worker');
}

second.onchange = function() {
  myWorker.postMessage([first.value,second.value]);
  console.log('Message posted to worker');
}

// worker
self.postMessage('MESSAGE FROM WORKER');
```

### 1.4 接收消息

```js
// 主线程
myWorker.onmessage = function(e) {
  result.textContent = e.data;
  console.log('Message received from worker');
}
// worker
self.onmessage = function (event) {
    console.log('WORKER: GOT ==>', event.data);
}
```

### 1.5 销毁worker

```js
// 主线程中
myWorker.terminate();

// worker中
close();
```

### 1.6 错误处理

```js
// 主线程中
myWorker.onerror = function(e) {
  console.log(e);
  e.preventDefault(); // 阻止事件冒泡
}
```

### 1.7 subWorker（worker中引用worker或者其他库)

​		如果需要的话 worker 能够生成更多的 worker。这就是所谓的subworker，它们必须托管在同源的父页面内。而且，subworker 解析 URI 时会相对于父 worker 的地址而不是自身页面的地址。这使得 worker 更容易记录它们之间的依赖关系。

```js
importScripts();                        /* 什么都不引入 */
importScripts('foo.js');                /* 只引入 "foo.js" */
importScripts('foo.js', 'bar.js');      /* 引入两个脚本 */
// 经过测试这样的也是可以引入并且使用的，上述的同源暂时不能理解
importScripts('https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js'); /* 引入外部依赖 */
```

## 2. SharedWorker -- 共享worker

​		一个共享worker可以被多个脚本使用——即使这些脚本正在被不同的window、iframe或者worker访问。

### 2.1 声明

```js
var myWorker = new SharedWorker('worker.js');
```

### 2.2 启动

```js
// 主线程或者父线程
myWorker.port.start();  // 父级线程中的调用、
// worker线程
port.start(); // worker线程中的调用, 假设port变量代表一个端口
```

### 2.3 发送信息

```js
// 主线程
myWorker.port.postMessage([squareNumber.value,squareNumber.value]);
// worker
port.postMessage(workerResult);
```

### 2.4 接收消息

```js
// 主线程
myWorker.port.onmessage = function(e) {
  result2.textContent = e.data;
  console.log('Message received from worker');
}
// worker
onconnect = function(e) {
  var port = e.ports[0];

  port.onmessage = function(e) {
    var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
    port.postMessage(workerResult);
  }
}
```

