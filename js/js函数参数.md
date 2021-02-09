# 1.发生什么事了？

原来是昨天：

被问到js函数是否支持可选参数时，没能仔细思考问题说到语言层面是不支持的。

**可选参数在JS上是支持的，不需要特殊定义，甚至js函数不能定义必选参数（当然可以代码中手动进行校验并抛出异常）**

样例：

```javascript
// 函数定义
function testOptionalFunction(arg1, arg2) {
    console.log(arg1, arg2);
}

// 函数执行
testOptionalFunction(1); // 1 undefined
```

***下面总结了下关于js函数参数的内容，还有和其他语言的对比，分析的深度比较浅。如果有问题，请指正。***



# 2.JS函数的参数

>   -   在一个作用域中，标识一个函数的标识是函数名，传入参数不同也是调用同一个函数（和java的多态表现不同）
>   -   可以在函数内通过`arguments`拿到参数的数组（实际上是类数组，本身是一个对象，和数组比较类似）
>   -   可以通过结构实现具名参数



1.  函数名称是标识，在同一作用域内，后定义会覆盖前者。下面声明方式，js不认为是声明了两个函数：

```javascript
function test() {
    console.log('test no args');
}

function test(name) {
    console.log('name:' ,name);
}
```

2.  即使不定义函数名，也可以在函数内使用arguments拿到参数

```javascript
// 定义一个函数，括号内可以不定义参数，也可以拿到参数值
function func() {
    console.log(arguments);
}

// 调用
func(1, 2, 3); // Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]

```

3.  es6中可以通过**解构**实现类似**具名参数**的功能

```javascript
// 结构
function testDestruct({name, value}) {
    console.log(name, value);
}

// 调用时传入对象
testDestruct({
    name: 'lll',
    age: 66
});
```



# 3.JS模拟多态
## code

```javascript
// 开发者可以自己写逻辑仿造多态
// 比如这里期望达到三个效果
// polyFunc(callback, name, age)
// polyFunc(callback, age)
// polyFunc(name, age)
function polyFunc(callback, name, age) {
    // 这里用到了函数内的一个变量arguments，是传入的函数参数的数组（实际上并不是真数组，是个类数组），即使在参数列表未定义的参数，只要传入了，也可以在这拿到。
    
	if (arguments.length === 3) {
        // 三个参数，且类型顺次是函数、字符串、数字
        callback();
        console.log('name:' + name, 'age:' + age);
    }

    if (arguments.length === 2) {
        // 两个参数，且类型顺次是函数、数字
        if (typeof callback === 'function' && typeof name === 'number') {
			callback();
        	console.log('age:' + name);
        } else if (typeof callback === 'string' && typeof name === 'number') {
            // 两个参数，且类型顺次是字符串、数字
            console.log('name:' + callback, 'age:' + name);
        }
    }
}


function callback() {
	console.log('callback')
}


const name = 'll';


const age = 66;


// callback
// name:ll age:66
polyFunc(callback, name, age);


// callback
// age:66
polyFunc(callback, age);


// name:ll age:66
polyFunc(name, age);
```





