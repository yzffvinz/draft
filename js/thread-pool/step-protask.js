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
})

pool5.start();

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
})

pool6.start();

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
}, 3000);