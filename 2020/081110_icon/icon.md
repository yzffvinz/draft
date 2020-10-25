# 微信小程序使用iconfont

## unicode

1. 在全局wxss文件中添加如下代码

```css
/* 引入字体 */
@font-face {
  font-family: 'iconfont';  /* project id 1932393 */
  src: url('//at.alicdn.com/t/font_1932393_sd8mewj4q7p.eot');
  src: url('//at.alicdn.com/t/font_1932393_sd8mewj4q7p.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1932393_sd8mewj4q7p.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1932393_sd8mewj4q7p.woff') format('woff'),
  url('//at.alicdn.com/t/font_1932393_sd8mewj4q7p.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1932393_sd8mewj4q7p.svg#iconfont') format('svg');
}
/* 定义使用改class的字体 */
.iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;}
```

2. 然后在wxml中进行引用，如下：

```html
<!-- 实际发现并不好用 -->
<i class="iconfont">&#xe633;</i>
```

实际操作后发现并不好用，但是如果在普通的html中是可以的。

3. 找寻微信文档后发现，小程序是不会对*字符引用(**character reference**)*进行转义的，将会被当做普通文字输出。

   但是在`text`中发现了如下属性

   <img src="/Users/liuwenzhe01/Library/Application Support/typora-user-images/image-20200812234325855.png" alt="image-20200812234325855" style="zoom:50%;" />

   但是很可惜，下面的`Bug & Tip`明确说明了： **tip`: decode可以解析的有 ` ` `<` `>` `&` `'` ` ` `** 

   

   最终改方案不可行

## font-class

font-class是unicode使用方式的一种变种，主要是解决unicode书写不直观，语意不明确的问题，使用方式如下：

1. 对对应的图标添加相应的伪类class

   ```css
   ....
   /* + */
   .icon-eye:before {
     content: '\e633';
   }
   ```

2. 然后在wxml这样引用就好了

   ```css
   <i class="iconfont icon-eye"></i>
   ```



这个方案是可行的，可读性也比较高，因为是字体颜色也可以调整。

美中不足，不能使用彩色的图标。



## Symbol

`mini-program-iconfont-cli`

官网说明很清晰https://github.com/iconfont-cli/mini-program-iconfont-cli

`iconfont-tools`

另一个方案：https://github.com/HuaRongSAO/iconfont-tools



## 如何在百度小程序中使用



## 其他的东西

### sprite

### svg

### css绘制

### canvas





```
let start = new Date().getTime();
const durations = [];
function show(desc) {
    const dur = new Date().getTime() - start;
    durations.push(dur)
    console.log(desc, dur);
    console.log('durations', durations);
}

start = new Date().getTime();
this.showTip = true;

if (this.showTip === true) {
	show('loaded');
	this.showTip = false;
}
```

