# js实现"线程池"限制异步任务数量

## 一、场景

设想下面几个场景：

1.  商品列表页中，点击商品将会进入详情页。为了实现详情页秒开，在用户点击前要预请求商品信息，假设有100个商品条目。如果同时发起100个请求，可能会将带宽打满。部分设备可能还会有请求的限制，这样会阻塞原本页面的其他正常请求。
2.  一台带宽有限的机器需要对网页进行打开时长的统计，假设每天要执行几千个这样的任务，这时候如果能通过声明一个类就可以进行并发控制，那将将是比较方便的。

基本上本次要实现的就是一个类，用于满足同一时间内，仅有制定异步任务运行的一个任务的队列。

## 二、实现思路

1.  任务如何排队执行？只要在任务结束时执行回调就可以了

```js
function genTask(i) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(i);
        }, i * 1000);
    });
}
const tasks = [
    genTask.bind(null, 1),
    genTask.bind(null, 2),
    genTask.bind(null, 3),
];

function processTask() {
    const task = tasks.shift();
    const prom = typeof task === 'function' && task();
    prom instanceof Promise && prom.then(data => {
        console.log(data);
    }).finally(() => {
        processTask();
    });
}

processTask();
```

2. 多个任务排队如何并行。上面实现了单个任务的排队执行，如果是多个任务呢？其实也很简单，只要循环执行多次 processTask就可以简单满足了，这里异步并发量为3为例

```js
// ...

// processTask(); 删除
let i = 3;
while(i--) processTask();
```

3.  使用class改造。添加方法：任务通过start方法开始执行，并且可以通过addTask添加任务

```js
// 使用类改写
class FixedThreadPool {
    constructor({size, tasks}) {
        this.size = size;
        this.tasks = tasks;
    }

    start() {
        let i = this.size;
        while(i--) this.processTask();
    }

    addTask(...tasks) {
        tasks.forEach(task => {
            if (typeof task === 'function') {
                this.tasks.push(task);
            } else {
                console.error('task can only be function');
            }
        })
    }

    processTask() {
        const task = this.tasks.shift();
        const prom = typeof task === 'function' && task();
        prom instanceof Promise && prom.then(data => {
            console.log(data);
        }).finally(() => {
            this.processTask();
        });
    }
}
```

```js
// 测试一下
const tasks = [
    genTask.bind(null, 1),
    genTask.bind(null, 2),
    genTask.bind(null, 3),
];
// 并发数量为3
const pool = new FixedThreadPool({
    size: 3, // 并发数量为3
    tasks: [...tasks]
});
pool.start(); // （共计3s）1s输出1，2s输出2，3s输出3

// 并发数量为1
const pool2 = new FixedThreadPool({
    size: 1, // 并发数量为1
    tasks: [...tasks]
});
pool2.start(); // （共计6s）1s输出1，3s输出2，6s输出3
```

4. 添加任务队列的监听。分析上面的代码，当所有任务执行完时候，再添加任务，将不会继续被处理。因为当前情况下，如果不满足`prom instanceof Promise`，processTask也就停止执行了，将不会有新的回调，也不会再次触发 processTask。这里有两种思路解决：

    1. addTasks时重新执行 start方法
    2. 如果无任务，processTask中生成一个 setTimeout，检测是不是有新任务，检测是不是有新的任务。

    a方案：当执行start会重新生成 size个processTask，假设pool 仍在运行或者部分processTask 仍然在运行，这会导致运行数量超过size个。当然，可以加若干条件判断。

    b 方案：如果没有任务则执行 setTimeout，过一段时间后再执行processTask

    这里选择了b方案，因为实现起来简单，也不容易出错 ：

```js
class FixedThreadPool {
    // ...
	processTask() {
        const task = this.tasks.shift();
        const prom = typeof task === 'function' && task();

        if (prom instanceof Promise) {
            prom.then(data => {
                console.log(data);
            }).finally(() => {
                this.processTask();
            });
        }
        else { // 如果没有合适的任务，将会在500ms后再次执行
            setTimeout(() => {
                this.processTask();
            }, 500);
        }
    }
}
```

```js
// 测试一下
const pool3 = new FixedThreadPool({
    size: 3, // 并发数量为3
    tasks: [...tasks]
});
pool3.start();
setTimeout(() => {
    pool3.addTask(...tasks);
}, 5000); // 5s后任务都执行完了，再添加任务
```

5. 添加回调函数。上面收到结束的数据后只是 console.log(data)，实际情况下接到返回数据，需要做一些自定义的处理。这里在类里面添加了一个回调函数defaultCb，用于处理返回的结果

```js
// 
class FixedThreadPool {
    constructor({
        // ...
        defaultCb = (data) => {console.log(data)} // 添加回调函数
    }) {
        // ...
        if (typeof defaultCb === 'function') {
            this.defaultCb = defaultCb;
        } else {
            throw new Error('defaultCb can only be function');
        }
    }

   	// ...

    processTask() {
		// ...
        if (prom instanceof Promise) {
            prom.then(data => {
                // console.log(data); 
                this.defaultCb(data); // 替换为自定义的callback
            }).finally(() => {
                this.processTask();
            });
        }

        // ...
    }
}
```

```js
// 自定义回调函数
const pool4 = new FixedThreadPool({
    size: 3, // 并发数量为3
    tasks: [...tasks],
    defaultCb: (data) => {
        console.log('custom callback', data);
    }
});
pool4.start();
```

6.  创建 Task 类，可以在池子里执行各种各样的任务。任务可能会有不同的生成函数、不同的参数、不同的回调函数，这时候将每个任务升级一下，生成一个Task类，它将拥有一个processor用于执行异步任务，params作为入参，callback 作为回调函数。

```js
class Task {
    constructor({params, processor = () => {}, callback = () => {}}) {
        this.params = params;
        if (typeof processor === 'function') {
            this.processor = processor;
        }
        else {
            throw new Error('processor must be a funtion');
        }

        if (typeof callback === 'function') {
            this.callback = callback || (() => {});
        }
        else {
            throw new Error('callback must be a funtion');
        }
    }
}
```

```js
// 关于Task的升级
class FixedThreadPool {
    constructor({
        size,
        tasks
    }) {
        this.size = size;
        this.tasks = [];
        this.addTask(...tasks); // 通过addTask添加，addTask添加了任务类型的判断
    }

	// ...

    addTask(...tasks) {
        tasks.forEach(task => {
            if (task instanceof Task) { // 添加关于是否为 Task 实例的判断
                this.tasks.push(task);
            }
            else {
                console.error('expected to be instanceof Task'); // 文案也改一下
            }
        })
    }
	
    // ...
    processTask() {
        const task = this.tasks.shift();

        if (task) {
            const prom = task.processor(task.params); // promise将由自定义processor生成
            if (prom instanceof Promise) {
                prom.then(data => {
                    task.callback(data); // 自定义的callback
                }).finally(() => {
                    this.processTask();
                });
            }
        }
        else {
            setTimeout(() => {
                this.processTask();
            }, 500);
        }
    }
}

```

```js
// 测试一下
// 任务类型升级
function genTaskObj(i) {
    return new Task({
        params: i,
        processor: (params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(params);
                }, params * 1000);
            });
        },
        callback: (data) => {
            console.log(`callback for ${i}, rst is`, data);
        }
    });
}
const tasks = [
    genTaskObj(1),
    genTaskObj(2),
    genTaskObj(3),
];

// 
let pool5 = new FixedThreadPool({
    size: 3,
    tasks: [...tasks]
});

pool5.start();
```

7.  假设callback也是个异步任务呢？实际情况中，callback可能需要进行入库或者接口调用，这也是异步操作，我们希望在callback执行结束后后再进行相应的操作。如果 callback 执行后也是个异步任务（这里拿 promise 举例）这时需要将执行下一次processTask的时机，改为callback的 then 中，否则就是直接调用：

```js
class FixedThreadPool {
    // ...
    processTask() {
        const task = this.tasks.shift();

        if (task) {
            const prom = task.processor(task.params);
            if (prom instanceof Promise) {
                let cb;
                prom.then(data => {
                    cb = task.callback(data); // 得到callback的回调
                }).finally(() => {
                    if (cb instanceof Promise) { // 进行是否为异步任务的判断
                        cb.finally(() => {
                            this.processTask();
                        });
                    }
                    else {
                        this.processTask();
                    }
                });
            }
        }
        else {
            setTimeout(() => {
                this.processTask();
            }, 500);
        }
    }
}
```

```js
// 测试一下
// callback也是异步的情况
function genTaskObjWithPromCb(i) {
    return new Task({
        params: i,
        processor: (params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(params);
                }, params * 1000);
            });
        },
        callback: (data) => {
            return new Promise(resolve => {
                console.log('2s later, cb will finish', data);
                setTimeout(() => {
                    console.log(data, 'finish');
                    resolve();
                }, 2000);
            })
        }
    });
}

const tasksWithPromCb = [
    genTaskObjWithPromCb(1),
    genTaskObjWithPromCb(2),
    genTaskObjWithPromCb(3),
];

let pool6 = new FixedThreadPool({
    size: 3,
    tasks: [...tasksWithPromCb]
});

pool6.start();
```

8. 是时候给任务加个刹车了。假设当开头提到的a场景，用户点击了详情页，我们的任务池就应该停止了，此处填加stop方法。

    这里当前正在执行的任务不会被停止，但是剩下的任务将不会被执行了。

```js
// 异步池
class FixedThreadPool {
    constructor({
        size,
        tasks
    }) {
		// ...
		
        // 添加标识
        this.runningFlag = false;
        this.runningProcessorCount = 0;

		// ...
    }

    // 是否运行中判断
    isRunning() {
        return this.runningFlag || this.runningProcessorCount > 0;
    }

    start() {
        if (this.isRunning()) {
            return;
        }
		
        this.runningFlag = true;

        let i = this.size;
        while(i--) {
            this.processTask();
            this.runningProcessorCount++;
        }
    }

	// 告诉processTask，任务不需要继续执行了
    stop() {
        this.runningFlag = false;
    }

	// ...

    processTask() {
        // 如果flag被置为false，则停止执行
        if (!this.runningFlag) {
            this.runningProcessorCount--;
            console.log('stop');
            return;
        }

		// ...
    }
}
```



```js
// 测试任务停止
function genTaskObj(i) {
    return new Task({
        params: i,
        processor: (params) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(params);
                }, params * 1000);
            });
        },
        callback: (data) => {
            console.log(`callback for ${i}, rst is`, data);
        }
    });
}
const tasks7 = [
    genTaskObj(1),
    genTaskObj(2),
    genTaskObj(3),
];

let pool7 = new FixedThreadPool({
    size: 3,
    tasks: [...tasks7, ...tasks7, ...tasks7]
})

pool7.start();

setTimeout(() => {
    pool7.stop();
}, 3000); // 3s后停止
```

## 三、总结

整体代码如下：

```js
// 任务实体
class Task {
    constructor({params, processor = () => {}, callback = () => {}}) {
        this.params = params;
        if (typeof processor === 'function') {
            this.processor = processor;
        }
        else {
            throw new Error('processor must be a funtion');
        }

        if (typeof callback === 'function') {
            this.callback = callback || (() => {});
        }
        else {
            throw new Error('callback must be a funtion');
        }
    }
}

// 异步池
class FixedThreadPool {
    constructor({
        size,
        tasks
    }) {
        this.size = size;

        this.tasks = [];
        this.addTask(...tasks);

        this.runningFlag = false;
        this.runningProcessorCount = 0;
    }

    isRunning() {
        return this.runningFlag || this.runningProcessorCount > 0;
    }

    start() {
        if (this.isRunning()) {
            return;
        }

        this.runningFlag = true;

        let i = this.size;
        while(i--) {
            this.processTask();
            this.runningProcessorCount++;
        }
    }

    stop() {
        this.runningFlag = false;
    }

    addTask(...tasks) {
        tasks.forEach(task => {
            if (task instanceof Task) {
                this.tasks.push(task);
            }
            else {
                console.error('expected to be instanceof Task');
            }
        })
    }

    processTask() {
        if (!this.runningFlag) {
            this.runningProcessorCount--;
            console.log('stop');
            return;
        }

        const task = this.tasks.shift();

        if (task) {
            const prom = task.processor(task.params);
            if (prom instanceof Promise) {
                let cb;
                prom.then(data => {
                    cb = task.callback(data);
                }).finally(() => {
                    if (cb instanceof Promise) {
                        cb.finally(() => {
                            this.processTask();
                        });
                    }
                    else {
                        this.processTask();
                    }
                });
            }
        }
        else {
            setTimeout(() => {
                this.processTask();
            }, 500);
        }
    }
}
```