class LRUCache {
    constructor(limit) {
        this.limit = limit;
        this.cache = {};
        this.keys = [];
    }

    get(key) {
        const got = this.cache[key];
        if (got !== undefined) {
            this.put(key, got);
        }
        return got;
    }

    put(key, value) {
        // 首先对数据进行擦除
        const deleted = this.delete(key);
        // 如果没位置了就要删除队首数据
        if (this.keys.length >= this.limit && !deleted) {
            this.delete(this.keys.shift());
        }
        // 数据添加至缓存
        this.keys.push(key);
        this.cache[key] = value;
    }

    size() {
        return this.keys.length;
    }

    delete(key) {
        const index = this.keys.indexOf(key);
        if (index > -1) {
            // 删除
            delete this.cache[this.keys.splice(index, 1)];
            return true;
        }
    }

    clear() {
        this.keys = [];
        this.cache = {};
    }
}



let cache = new LRUCache(2);

cache.put(1, 1);
cache.put(1, 2);
cache.put(1, 3);
console.log(cache.keys);

cache.put(2, 1);
cache.put(2, 2);
cache.put(2, 3);
console.log(cache.keys);

cache.put(3, 1);
cache.put(3, 2);
cache.put(3, 3);
console.log(cache.keys);
console.log(cache.cache);

console.log(cache.get('1'));
console.log(cache.keys);

console.log(cache.get('3'));
console.log(cache.keys);