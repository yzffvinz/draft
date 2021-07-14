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
    constructor({size, processor, callback, checkMode = false, checkInterval = 500}) {
        this.flag = false;
        this.__tasks = [];
        this.__size = size;
        this.__checkMode = checkMode;
        this.__checkInterval = checkInterval;
        this.__running = 0;

        if (typeof processor === 'function') {
            this.__processor = processor;
        }
        else {
            throw new Error('processor must be a funtion');
        }

        if (typeof callback === 'function') {
            this.__callback = callback || (() => {});
        }
        else {
            throw new Error('callback must be a funtion');
        }
    }

    start() {
        if (this.flag) {
            return;
        }
        this.flag = true;
        for (let i = 0; i < this.__size; i++) {
            this.__running++;
            this.__processTask();
        }
    }

    stop() {
        this.flag = false;
    }

    addTask(...tasks) {
        tasks.forEach(this.__addTask.bind(this));
    }

    cutInLine(...tasks) {
        tasks.reverse().forEach(task => {
            this.__addTask.call(this, task, true);
        });
    }

    async __processTask() {
        if (!this.flag) { // 这个标记用于决定是否继续运行
            return;
        }

        const task = this.__tasks.shift();
        if (!task) { // 如果没有任务就继续轮询等待任务
            if (this.__checkMode) {
                setTimeout(() => {
                    this.__processTask();
                }, this.__checkInterval);
            }
            else {
                this.__running--;
                if (this.__running === 0) {
                    this.flag = false;
                }
            }
            return;
        }

        if (!(task instanceof Task)) {
            throw new Error('Task need to be added via method addTask');
        }

        // 执行任务，处理回调
        const {processor, callback, params} = task;
        let rst = processor(params);
        if (rst instanceof Promise) {
            rst = await rst;
        }
        try {
            if (callback instanceof Promise) {
                await callback(rst);
            }
            else {
                callback(rst);
            }
        }
        catch {}

        // 继续处理任务
        this.__processTask();
    }

    __addTask(task, cutInLine = false) {
        if (cutInLine) {
            this.__tasks.unshift(this.__wrapTask(task));
        }
        else {
            this.__tasks.push(this.__wrapTask(task));
        }
    }

    __wrapTask(task) {
        if (!(task instanceof Task)) {
            task = new Task({
                params: task,
                processor: this.__processor,
                callback: this.__callback,
            });
        }
        return task;
    }
}

module.exports = exports = {
    Task,
    FixedThreadPool,
};