# wise端富文本格式化

做法代码见文末。

## 一、背景

小程序及h5中会多处使用富文本，因为内容生产方习惯差别大，亦或是富文本本身为爬取内容，富文本没有统一的规范。这就导致富文本这部分物料的不可控性。需要前端进行样式的清洗。



**用html-parser吗？**

-   收益
    -   有更高的操作空间吗，更可定制化
-   弊端
    -   引入包增加包体积
    -   需要自己实现富文本解析组件，成本较高
    -   样式问题不需要解决了，但是需要全量实现

基于收益与成本分析，使用html-parser并不是个好的解决方案。



## 二、难点

小程序及h5环境下也有差异，需要区分处理。

### 2.0 共通

-   行内样式污染

-   标题：标题形式不同，有的写手喜欢选择 `h1`等，有些喜欢进行字体大小、粗细来控制；多层级标题本身是个相对概念，生产者可能用 `h1`作为一级标题，可能用`h2`作为一级标题

-   缩进、空行习惯不一致

-   标签层级嵌套深，结构千差万别

-   生产者写出来pc预览，忽视wise端的展示样式

    

### 2.1 百度小程序

-   `<rich-text>`不支持标签选择器，编译后会给标签选择器添加`swan-`的前缀，例如 css 中的选择器`p`最终会转换成'`swan-p`，样式就被屏蔽了

    

### 2.2 h5

-   深层内容如何选择，这里是`vue`下使用`scss` 场景，选择器后添加`/deep/`进行处理即可



## 三、规范&折衷

与视觉协商，为了wise端用户尽快达到可阅读的标准，提出了下面的规范或是折衷：

-   同一场景字体统一大小
-   文字左对齐，不设置缩进
-   段落间一行空行
-   图片分场景处理
    -   宽度100%，高度自适应
    -   左对齐，设置max-width, max-height，保证长边可以完整的显示出来
-   去掉自带的背景色



## 四、处理方式

一处编写，覆盖全场，那一定就是`!important` 了。

### 4.1 小程序（stylus)

小程序支持的选择器有全部选择器、类选择器、伪类选择器...（除了标签可以支持个大概，具体需要进行实战测试）

#### 4.1.1 css

```stylus
 commonRichText()
    *
        // 解决行内margin padding引起多余的空白
        margin 0 !important
        padding 0 !important
        // 解决字体可能存在的换行问题
        word-break break-all !important
        // 图片最大宽度为100%，高度自适应。这部分可以根据情况替换为max-width, max-height
        width 1140px !important
        height auto !important
        // 图片的圆角
        border-radius 36px !important
        // ul ol li的标识可能会超出范围，这里保证在盒子内
        list-style-position inside !important
        // 左对齐及左去掉缩进
        text-indent 0 !important
        text-align left !important
        // 图片block不会占据更多的空间
        display block !important
        // 透明
        background-color transparent !important
        // 字体根据实际情况进行处理
        font-size 48px !important
        line-height 72px !important
    > *:not(:empty):not(:last-child) // 间距设置给了非空的、非最后一个元素的儿子元素
        margin-bottom 75px !important
```

详：

-   为什么要在`*`选择器定义这么多属性，因为小程序并不能控制富文本具体标签的操作，所以就将无副作用的属性全部放到了`*`中

#### 4.1.2 正则处理

-   假设段落是通过`<br/>`换行，还是没有间隔
-   假设元素不为空，但是里面是空格
-   假设缩进是通过空格实现的

```js
text.replace(/<br/g, '<p class="swan-br" ') // br变成了p，且添加了类 swan-br，使 dom 可操作
    .replace(/>\s+/g, '>'); // 替换了一些空格
```

```stylus
.swan-br
    margin-bottom 75px !important
```

### 4.2 h5（scss）

与小程序类似，但是h5具有更大的操作空间，可以进行标签选择。

### 4.2.1 css

```scss
.answer-rich /deep/ {
    img {
        display: block;
        width: 1140px !important;
        height: auto !important;
        border-radius: 36px !important;
    }
    > *:not(:empty):not(:last-child) {
        margin-bottom: 75px !important;
    }
    * {
        text-indent: 0 !important;
        font-size: 48px !important;
        line-height: 75px !important;
        color: #1F1F1F !important;
        text-align: left !important;
        background-color: transparent !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    .swan-br {
        margin-bottom: 75px !important;
    }
}
```

#### 4.2.1 正则处理

-   假设段落是通过`<br/>`换行，还是没有间隔
-   假设元素不为空，但是里面是空格
-   假设缩进是通过空格实现的

```js
text.replace(/<br/g, '<p class="swan-br" ') // br变成了p，且添加了类 swan-br，使 dom 可操作
    .replace(/>\s+/g, '>'); // 替换了一些空格
```

```stylus
.swan-br
    margin-bottom 75px !important
```

### 