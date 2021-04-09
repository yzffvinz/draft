self.onmessage = function (event) {
    console.log('WORKER2: GOT ==>', event.data);
    self.postMessage('Hello, Worker2 got message');
}

