#### ellipsis

```css
// 单行
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
// 多行
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: n;
-webkit-box-orient: vertical;
```

##### 失效

- flex

```css 
// flex会使自己的子元素成为一个flex-item而非一个text node，令text-overflow: ellipsis;失效
display: flex;
```

  

