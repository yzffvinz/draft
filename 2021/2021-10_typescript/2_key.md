# 接口

接口可以被`implements`

```tsx
// 定义属性
interface InterfaceA {
    label: string; // 固定属性
    color?: string; // 可选属性
    readonly x: number; // 只读属性
    [propName: string]: any; // 期望有定义以外的其他键值
}

// 定义函数类型
interface MyFunc {
    (source: string, subString: string): boolean;
}
```

# 类

类可以被 `extends`，可以被`interface`继承

```tsx
// 基础使用
class ClassA {
    static nameS: string; // 类属性：可以通过 ClassA.nameS 访问，也可以实例访问
	private name1: string; // 私有属性
    public name2: string; // 公有属性
    protected name2: string; // 保护属性，可在派生类中访问
    readonly numberOfLegs: number = 8; // 只读属性，要么构造函数初始化，要么定义时初始化
    constructor(theName: string) { this.name = theName; } // 构造函数
}

// 继承的情况
class ClassB extends ClassA {
    constructor() { super("Rhino"); }
}

// 存取器
class ClassC {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

// 抽象类
abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log('Department name: ' + this.name);
    }

    abstract printMeeting(): void; // 必须在派生类中实现
}

// 
```



# 函数

```tsx
// 完整写法
let myAdd: (baseValue: number, increment: number) => number = // 先定义类型
    function (x, y) { return x + y; }; // 再给函数赋值
// 简写
let myAdd = function(x: number, y: number): number { return x + y; };

// 剩余参数
function buildName(firstName: string, ...restOfName: string[]) { // 这里定义的是 restOfName 的类型
    return firstName + " " + restOfName.join(" ");
}

// 确认 this 指向，这里 createCardPicker 是个返回 Card 的函数，并且其中的 this 是指向一个 Deck 对象
createCardPicker(this: Deck): () => Card;

// 重载： ts可定义多个函数
function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

// this 相关
```
