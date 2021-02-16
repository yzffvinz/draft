# 纯html+css实现一个炫酷的无限滚动动效

## 1. 先看需求

某次迭代中接到的需求是做一个无限滚动的斜滑模块，如下图所示，一定数量游戏icon源源不断的从右上方滑出，循环往复。

可以先看看下方的实现效果~

[codepen体验](https://codepen.io/yzffvinz/pen/MWbJxxN)
![成品效果](https://b.bdstatic.com/searchbox/image/cmsuploader/20210214/1613317325224232.gif)

（因为图片大小问题，只截取了一部分。实际效果是一直滚动，不会有动画复位的割裂感。）


## 2. 问题拆分

看到这个需求的时候，感觉有点复杂，icon错位排列，斜着滚动，无限滚动...

后来考虑了下，对这个问题进行了下面步骤的拆分：

1.  编写各个容器及icon等基本样式
2.  进行整体的布局（包含倾斜等）
4.  添加无限的横向滚动动画

话不多说，手撸一下代码

## 3. 开始行动

（为了方便看边界，对于一些dom添加了边框）

## 3.1 创建容器

容器是一个固定大小带圆角的区域，比较好写

```css
.box {
    height: 666px;
    width: 1182px;
    border-radius: 36px;
    border: 1px solid;
    overflow: hidden;
    text-align: center;
    font-size: 30px;
}
```

### 3.2 然后撸个icon出来

这里用下面的mock下icon~

<img src="https://b.bdstatic.com/searchbox/image/cmsuploader/20210214/1613317325173742.png" style="zoom:25%;" />

```css
.icon {
    width: 267px;
    height: 267px;
    border-radius: calc(267px * 0.23);
    background-image: conic-gradient(
        hsl(360, 100%, 50%),
        hsl(315, 100%, 50%),
        hsl(270, 100%, 50%),
        hsl(225, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(135, 100%, 50%),
        hsl(90, 100%, 50%),
        hsl(45, 100%, 50%),
        hsl(0, 100%, 50%)
    );
}
```

## 3.3 排列icon到wrapper中

我们把脖子沿逆时针方向旋转30度看到，这个排列实际上就是错落有致的摆放着两排icon。

我们按照图示静态的摆放一下：
html

```html
<div class="box">
    <div class="lean-box">
        <div class="wrapper">
            <div class="icon-pair">
                <div class="icon">1</div>
                <div class="icon">2</div>
            </div>
            <div class="icon-pair">
                <div class="icon">3</div>
                <div class="icon">4</div>
            </div>
            <div class="icon-pair">
                <div class="icon">5</div>
                <div class="icon">6</div>
            </div>
            <div class="icon-pair">
                <div class="icon">7</div>
                <div class="icon">8</div>
            </div>
        </div>
    </div>
</div>
```
css
```css
.lean-box {
    display: flex;
    transform: rotate(-30deg);
}

.wrapper {
    margin-top: 180px;
    display: flex;
    flex-wrap: nowrap;
}

.wrapper .icon:nth-child(even) {
    margin-top: 45px;
    transform: translate(155px);
}

.icon-pair {
    margin-left: 45px;
}

.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 66px;
    font-weight: bold;
}
```

![image-20210214225056621](https://b.bdstatic.com/searchbox/image/cmsuploader/20210214/1613317326778517.png)

这样看起来就很有精神了，接下来需要添加动画效果让icon 动起来

## 3.4 添加动画

这里使用的是animation，于是，编写下列代码并且添加到wrapper上：

```css
@keyframes rowup {
    from {
        transform: translateX(0%);
    }

    to {
        transform: translateX(-500px);
    }
}
.wrapper {
    margin-top: 180px;
    display: flex;
    flex-wrap: nowrap;
    animation: rowup 5s linear infinite;
}
```

这样整个wrapper就动起来了。

## 3.5 无缝的滚动

上一步做完后。动是动起来了，但是每轮结束都会恢到原位置，这样显然不是想要的结果。

凭直觉来说，考虑是右侧不断icon 添加到wrapper中，左侧滑出的无限销毁，但是这样会有下面的一些问题：

1.  创建icon的时机不好掌握
2.  性能势必会比较差
3.  （这样就要用js处理，比较繁琐）

**infinite动画结束时都会恢复原位。如果创建一个icons的副本，动画结束时让副本刚好与动画的第一帧重合，看起来就是无限滚动的了。**
看起来是这样的：
![lean-view](https://b.bdstatic.com/searchbox/image/cmsuploader/20210216/1613444383709436.gif)
其实是这样的：
![lean-hidden](https://b.bdstatic.com/searchbox/image/cmsuploader/20210216/1613444383823299.gif)

计算一下移动距离：

这里一组8个icon排两排情况，移动的宽度应该为4个 icon宽度+ 4个margin，(267 * 4) + (45 * 4)  = 1248px，这样调整下动画B就可以刚好移动到 A 了。

更新下动画：

```css
@keyframes rowup {
    from {
        transform: translateX(0%);
    }

    to {
        transform: translateX(-1248px);
    }
}
```
html 也相应更新下：
```html
<div class="box">
    <div class="lean-box">
        <div class="wrapper">
            <div class="icon-pair">
                <div class="icon">1</div>
                <div class="icon">2</div>
            </div>
            <div class="icon-pair">
                <div class="icon">3</div>
                <div class="icon">4</div>
            </div>
            <div class="icon-pair">
                <div class="icon">5</div>
                <div class="icon">6</div>
            </div>
            <div class="icon-pair">
                <div class="icon">7</div>
                <div class="icon">8</div>
            </div>
            <div class="icon-pair">
                <div class="icon">1</div>
                <div class="icon">2</div>
            </div>
            <div class="icon-pair">
                <div class="icon">3</div>
                <div class="icon">4</div>
            </div>
            <div class="icon-pair">
                <div class="icon">5</div>
                <div class="icon">6</div>
            </div>
            <div class="icon-pair">
                <div class="icon">7</div>
                <div class="icon">8</div>
            </div>
        </div>
    </div>
</div>
```

这样完成了无限的斜滚的动效

## 3.6 完善一下：一定要每次都根据内容计算动画移动距离吗？

如果每次都要根据组件个数去计算的话，确实有点low了。每次都是放置两个一模一样的icons，所以translateX的距离不需要计算，设置为-50%就好了，最终代码如下（可以在[codepen](https://codepen.io/yzffvinz/pen/MWbJxxN)上体验）：
HTML

```html
<div class="box">
    <div class="lean-box">
        <div class="wrapper">
            <div class="icon-pair">
                <div class="icon">1</div>
                <div class="icon">2</div>
            </div>
            <div class="icon-pair">
                <div class="icon">3</div>
                <div class="icon">4</div>
            </div>
            <div class="icon-pair">
                <div class="icon">5</div>
                <div class="icon">6</div>
            </div>
            <div class="icon-pair">
                <div class="icon">7</div>
                <div class="icon">8</div>
            </div>
            <div class="icon-pair">
                <div class="icon">1</div>
                <div class="icon">2</div>
            </div>
            <div class="icon-pair">
                <div class="icon">3</div>
                <div class="icon">4</div>
            </div>
            <div class="icon-pair">
                <div class="icon">5</div>
                <div class="icon">6</div>
            </div>
            <div class="icon-pair">
                <div class="icon">7</div>
                <div class="icon">8</div>
            </div>
        </div>
    </div>
</div>
```
CSS
```css
@keyframes rowup {
    from {
        transform: translateX(0%);
    }

    to {
        transform: translateX(-50%);
    }
}
.box {
    height: 666px;
    width: 1182px;
    border-radius: 36px;
    border: 1px solid;
    overflow: hidden;
    text-align: center;
    font-size: 30px;
}

.icon {
    width: 267px;
    height: 267px;
    border-radius: calc(267px * 0.23);
    background-image: conic-gradient(
        hsl(360, 100%, 50%),
        hsl(315, 100%, 50%),
        hsl(270, 100%, 50%),
        hsl(225, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(135, 100%, 50%),
        hsl(90, 100%, 50%),
        hsl(45, 100%, 50%),
        hsl(0, 100%, 50%)
    );
}

.lean-box {
    display: flex;
    transform: rotate(-30deg);
}

.wrapper {
    margin-top: 180px;
    display: flex;
    flex-wrap: nowrap;
    animation: rowup 5s linear infinite;
}

.wrapper .icon:nth-child(even) {
    margin-top: 45px;
    transform: translate(155px);
}

.icon-pair {
    margin-left: 45px;
}

.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 66px;
    font-weight: bold;
}
```
