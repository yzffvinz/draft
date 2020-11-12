```js
// 滚动无法正确触发，使用回调，先滚动到头部，在进行查询，滚动
swan.pageScrollTo({scrollTop: 0, duration: 0, complete: () => {
  const query = swan.createSelectorQuery();
  query.select(target.detail.commentSelctor).boundingClientRect();
  query.exec(res => {
    console.log("changeTab -> res", res);
    const top = getDeepValue(res, '0.top', 0);
    if (top) {
      const toTop = top - 110;
      swan.pageScrollTo({scrollTop: toTop});
    } else {
      swan.pageScrollTo({scrollTop: 260});
    }
  });
}});
```

