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

let i = 3;
while(i--) processTask();
