var worker1 = new Worker('./worker1.js');
worker1.onmessage = function (event) {
    console.log('ANO: From worker1: ', event);
}

var worker2 = new Worker('./worker2.js');
worker2.onmessage = function (event) {
    console.log('ANO: From worker2: ', event.data);
}

function sendToWorker(num) {
    if (num === 1) {
        worker1.postMessage('1, I`m ano');
    } else {
        worker2.postMessage('2, I`m ano');
    }
}