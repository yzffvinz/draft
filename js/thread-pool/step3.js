// 异步池
class FixedThreadPool {
    constructor({
        size,
        tasks,
        defaultCb = (data) => {console.log(data)}
    }) {
        this.size = size;
        this.tasks = tasks;
        if (typeof defaultCb === 'function') {
            this.defaultCb = defaultCb;
        } else {
            throw new Error('defaultCb can only be function');
        }
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

        if (prom instanceof Promise) {
            prom.then(data => {
                this.defaultCb(data);
            }).finally(() => {
                this.processTask();
            });
        }
        else {
            setTimeout(() => {
                this.processTask();
            }, 500);
        }
    }
}

// 测试数据
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


// 持续监听队列的模式
// 测试一下
const pool3 = new FixedThreadPool({
    size: 3, // 并发数量为3
    tasks: [...tasks]
});
pool3.start();
setTimeout(() => {
    console.log('addTask');
    pool3.addTask(...tasks);
}, 5000); // 5s后任务都执行完了，再添加任务

// 自定义回调函数
const pool4 = new FixedThreadPool({
    size: 3, // 并发数量为3
    tasks: [...tasks],
    defaultCb: (data) => {
        console.log('custom callback', data);
    }
});
pool4.start();