# 泛型

1. **约定几种类型的一致性：我不知道a和b的类型，但是他俩必须是一样的类型**
2. **泛型在被指定类型后会进行更详细的校验**

```tsx
// 这里保证入参和出参类型一致
function identity<T>(arg: T): T {
    return arg;
}
```

使用泛型的变量取用属性要考虑所有类型

```tsx
// 因为T可能为number，所以T可能无length属性
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
// 定义成数组是可行的
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

接口：可以定义一类函数的接口，然后赋值时进行相应的约束

```tsx
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}
// 这里将在给myIdentity赋值时，约束了类型为number
let myIdentity: GenericIdentityFn<number> = identity;
```

类泛型：与接口类似

```tsx
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

约束泛型

```tsx
// 这里约束了T需要是一个具有类型为number length属性的对象
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}

// 当T被指定为x后，后续校验就知道其键值范围为a,b,c,d， 于是m的引用失败了
function getProperty(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

泛型中使用类

```tsx
// c类：被实例化应为T类型
function create<T>(c: {new(): T; }): T {
    return new c();
}
```

