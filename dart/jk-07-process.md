# Dart如何处理信息 —— 函数、类、运算符

## 函数

### 具名参数

```dart
// 声明
// 1. 类型可以省略
[bool] isNobel({param1: bool, param2: String}) {   
}
// 调用
isNobel(param1: true, param2: 'name');
```

### 简写（类似js箭头函数）

```dart
bool isNobel(name) => name == 'lwz';
```

### 默认参数

```dart
// 位置声明
enableFlags(bold: true, hidden: false);
// 具名声明
enableFlags({bool bold = true, bool hidden = false});
```

#### 必选参数@required

```dart
// @required
const Scrollbar({Key key, @required Widget child})
```

#### 位置可选参数

```dart
String say(String from, String msg, [String device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}
```



## 类

### 构造函数

```dart
// ClassName
// ClassName.identifier。
```

### 复用三剑客

```dart
// extend 单继承

// implements 多实现

// with 可混入

```





## 运算符

### ~/

除法，返回整数

### ??、??=

```dart
// 可以类比js &&的用法，不过这里0并不是falthy，只有null才是falthy
var name = null;
var name2 = 1;
print(name ?? name2);
// ??= 当前者为null时，右值赋值给左侧
var var1 = null;
var var2 = 2;
var1 ??= var2;
print(var1); // 2
```



### as、is、is

- as：强制类型转换 `(emp as Person).name`
- is：是为对应类型`emp is Person `
- is!：否为对应类型`emp is Person `

### 其他运算符

- ()： 函数调用
- []：list access
- .：member access
- ?.





## 特色

### 级联调用

```dart
// 这个类似于java的链式调用
void main() {
  querySelector('#sample_text_id')
    ..text = 'Click me!'
    ..onClick.listen(reverseText);
}
```

### 匿名函数

```dart
// 声明方式跟js略有不同
var list = ['apples', 'bananas', 'oranges'];
list.forEach((item) {
  print('${list.indexOf(item)}: $item');
});
```

## 