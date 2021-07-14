const tasks = [
    () => new Promise(resolve => {
        setTimeout(() => {resolve(0)}, 500)
    }),
    () => new Promise(resolve => {
        setTimeout(() => {resolve(1)}, 1000)
    })
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

let i = 3;
while(i--) processTask();

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

class FixedThreadPool {
    constructor({
        size,
        tasks,
        defaultProcessor = (...args) => new Promise(resolve => resolve(args)),
        defaultCb = (data) => {console.log(data)}
    }) {
        this.size = size;
        this.tasks = tasks;
        this.defaultProcessor = defaultProcessor;
        this.defaultCb = defaultCb;
        this.running = false;
        this.runningCount = 0;
    }
    
    isRunning() {
        return !(this.running || this.runningCount > 0)
    }

    start() {
        if (this.isRunning()) {
            console.error('tasks are still running!');
            return;
        }
        let i = this.size;
        while(i--) {
            this.processTask();
            this.runningCount++;
        }
        this.running = true;
    }

    stop() {
        this.running = false;
    }

    addTask(...tasks) {
        tasks.forEach(rawTask => {
            let task;
            if (typeof rawTask === 'function') {
                task = new Task({
                    processor: rawTask,
                    callback: this.defaultCb
                });
            } else if (rawTask instanceof Task) {
                task = rawTask;
            } else if (rawTask) {
                task = new Task({
                    params: rawTask,
                    processor: this.defaultProcessor,
                    callback: this.defaultCb
                });
            } else {
                console.error('task can not be null');
                return;
            }
            this.tasks.push(task);
        })
    }

    async processTask() {
        if (!this.running) {
            this.runningCount--;
            return;
        }
        const taskObj = this.tasks.shift();
        if (!(taskObj instanceof Task)) return;
        const prom = taskObj.processor(taskObj.params);
        const cbRst = null;
        if (prom instanceof Promise) {
            prom.then((...args) => {
                cbRst = taskObj.callback(...args); 
            }).finally(() => {
                if (cbRst instanceof Promise) {
                    cbRst.finally(() => {
                        this.processTask();
                    })
                } else {
                    this.processTask();
                }
            })
        } else {
            this.setTimeout(() => {
                this.processTask();
            }, 500);
        }
    }
}

const tasks = [];
let i = 10;
while(i--) {
    tasks.push(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(i);
            }, 1000);
        });
    });
}

const pool = new FixedThreadPool(({
    size: 3,
    tasks,
    defaultCb: (data) => {
        console.log(data);
    }
}));

pool.start();

