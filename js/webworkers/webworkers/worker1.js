importScripts('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');

self.onmessage = function (event) {
    console.log('WORKER1: GOT ==>', event.data);
    console.log('lodash', _.clamp(-10, -5, 5));
    self.postMessage();
}

