## 问题

动态设置display: block后，调用swan.pageScrollTo无法滚动到相应的锚点，将exec回调的res打出来后top为0。解决方案：使用定时器进行轮询，直到查找到top不为0时，再执行swan.pageScrollTo

```js
// 创建滚动函数，如果没有滚动则500ms后继续执行查询并滚动的逻辑，直到滚动到锚点的位置
function scrollTo() {
	const query = swan.createSelectorQuery();
    query.select(selector).boundingClientRect();
    query.exec(res => {
        const top = res && res[0] && res[0].top;
        if (top) {
            swan.pageScrollTo({scrollTop: top});
        } else {
            setTimeout(() => {
                scrollTo();
            }, 500);
        }
    });    
}
```

