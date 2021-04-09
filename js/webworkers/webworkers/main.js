setTimeout(() => {
    var worker1 = new Worker('./worker1.js');
    worker1.onmessage = function (event) {
        console.log('MAIN: From worker1: ', event);
    }
    worker1.onerror = ((...args) => {
        console.log(args);
    })

    var worker2 = new Worker('./worker2.js');
    worker2.onmessage = function (event) {
        console.log('MAIN: From worker2: ', event.data);
    }

    window.sendToWorker = function sendToWorker(num) {
        if (num === 1) {
            worker1.postMessage('1, I`m main');
        } else {
            worker2.postMessage('2, I`m main');
        }
    }
}, 300);
