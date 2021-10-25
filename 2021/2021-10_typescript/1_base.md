## 0 需要细化的内容

1.   Object、 object、 {}的区别
2.   可索引的类型
3.   ts构造函数怎么定义参数类型
4.   函数this指向

## 1 基础类型

### 数组

```tsx
// number[]
let listA: number[] = [1, 2, 3];
// Array<number>
let listB: Array<number> = [1, 2, 3];
```

### Tuple：元组（一个数组含多种类型）

```tsx
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```

1.   对于已知元素会正确校验类型

```tsx
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

2.   对于越界元素，会使用联合类型

```tsx
// number | string
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型

console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString

x[6] = true; // Error, 布尔不是(string | number)类型
```



### 枚举: 定义了一个键值可以双向查询的Object

默认的键值是：0，1，2...

```tsx
// 定义枚举
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

不想用默认键值

```tsx
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

定义了 key <=> value 的双向查询

```js
var Color;
(function (Color) {
    Color[Color["Red"] = 1] = "Red";
    Color[Color["Green"] = 2] = "Green";
    Color[Color["Blue"] = 4] = "Blue";
})(Color || (Color = {}));
```



### Any: 你要如何，我便是如何

实际上就是跳过了检查



### Void: 怎么都不行

一般用于函数返回，不要返回任何东西。

但是实测，可以返回`null` 和 `undefined`



### Null & undefined

默认情况下`null`和`undefined`是所有类型的子类型。 就是说你可以把 `null`和`undefined`赋值给`number`类型的变量。

然而，当你指定了`--strictNullChecks`标记，`null`和`undefined`只能赋值给`void`和它们各自



### Object & object: 广义的对象和侠义的对象

1.   `Object`可以包含除了 `null`和`undefined` 的所有内容，也可以用`{}`代替
2.   `object` 可以包含`function`、`object`、`array` 以及 基本类型的包装类

### <> 类型断言，像是泛型
1. 一个 `any`怎么合理的调用对应的方法呢
```tsx
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```



## 2 Interface

### interface: 对象的格式

1.   基本使用

```tsx
interface Person {
    firstName: string;
    lastName: string;
}
```

2.   **?:** 可选属性

```tsx
interface SquareConfig {
    color?: string;
    width?: number;
}
```

3.   **readonly** 只读属性

```tsx
interface Point {
    readonly x: number;
    readonly y: number;
}
```

4.   ReadonlyArray
	
	假设 ro 为 readyOnly
	
	- ro 不可通过 index 更新
	- ro 不可调用数组方法更新自己
	- ro 甚至不能被赋值给其他变量，比如 a = ro
	- 但是 ro 可以通过 `a = ro as number[];`

```tsx
// ro 不可改变
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!!!!!!

// 但是仍然可以通过 a 去改变整个数组，a 变了，ro 也会变
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
a[1] = 6;
console.log(a); // [1, 6, 3, 4]
console.log(ro); // [1, 6, 3, 4]
```

5.   额外的属性检查

-   对于可选属性来说，可能的拼写错误会引起报错，任何被定义外的属性都会触发拼写错误报错

```tsx
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
}

let mySquare = createSquare({ colour: "red", width: 100 });
```
- 两种解决方案

```tsx
// 1 类型强转
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

// 添加额外的属性
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

### funciton: 函数类型

1.   函数变量

```tsx
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// 变量名称不必一致，按照顺序保持一致的类型就好
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
}
```

### 可索引的类型

1.   

```tsx
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```

2.   

```tsx
interface NumberDictionary {
    [index: string]: number;
    length: number;    // 可以，length是number类型
    name: string       // 错误，`name`的类型与索引类型返回值的类型不匹配
}
```

3.   设置只读

```tsx
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // error!
```



### class: 类的处理方式

1.   用接口约束类属性

```tsx
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

2.   接口约束类方法

```tsx
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

3.   构造函数（始终觉得这种实现有点 low）

```tsx
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```



### 接口继承

```tsx
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```

### 混合类型（看起来像类型强转）

```tsx
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### 接口继承类（可继承私有属性）

```tsx
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// 错误：“Image”类型缺少“state”属性。
class Image implements SelectableControl {
    select() { }
}

class Location {

}
```

