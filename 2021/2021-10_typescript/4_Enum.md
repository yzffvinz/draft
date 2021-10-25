# Enum

1. enum具有反向映射能力。枚举值相同，反向查找只能查到一个键值，且是后出现的那个
2. ts会推测枚举的键值，假设该健前一位是可在编译期确认的整数的话



## 数字枚举

```tsx
// 键值递增，默认0开始，定义了就选择从对应值++
enum Map {
    a = 1,
    b,
    c = 5,
    d 
}
// parsed
var Map;
(function (Map) {
    Map[Map["a"] = 1] = "a";
    Map[Map["b"] = 2] = "b";
    Map[Map["c"] = 5] = "c";
    Map[Map["d"] = 6] = "d";
})(Map || (Map = {}));

// 数字后面的可以缺省键值，其他的不行
enum E {
    A = getSomeValue(),
    B, // error! 'A' is not constant-initialized, so 'B' needs an initializer
}
enum E {
    A = getSomeValue(),
    B = 1,
    C, // 2, it's ok
}
```



## 字符串枚举

```tsx
// 没啥特别的，不能缺省键值
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```



## 异构枚举（官方不建议）

```tsx
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```



## 联合枚举与枚举成员的类型

```tsx
// 联合枚举
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

// ts编译期推断能力
enum E {
    Foo,
    Bar,
}

function f(x: E) {
    if (x !== E.Foo || x !== E.Bar) {
        //             ~~~~~~~~~~~
        // Error! Operator '!==' cannot be applied to types 'E.Foo' and 'E.Bar'.
    }
}
```



## const枚举

去掉反向映射，降低开销

```tsx
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]

// parsed
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```



## 外部枚举

```tsx
declare enum Enum {
    A = 1,
    B,
    C = 2
}
```

