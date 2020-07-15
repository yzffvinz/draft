## mark

- 2020-07-12 23:18:47 [类](https://www.dartcn.com/guides/language/language-tour#类)

## 变量声明

- 推断类型：`var`，指定后不可修改类型
- 动态类型：`dynamic`，这个声明后，可认为是弱类型
- 编译时常量：`const`编译时将值替换为字面量，所以如果其右值为非编译时常量或字面量，则会报错
- 运行时常量：`final`
- 『类型』：eg.  string a = '1';

### 变量类型

- Number
  - int（Dart VM 上， 值的范围从 -2<sup>63</sup>  到 2<sup>63</sup>  - 1；使用 [JavaScript numbers,](https://stackoverflow.com/questions/2802957/number-of-bits-in-javascript-numbers/2803010#2803010) 值的范围从 -2<sup>53</sup> 到 2<sup>53</sup> - 1）
  - double
- String
  - Dart 字符串是一组 UTF-16 单元序列
  - 模板字符串：直接在字符串里面写`${expression}`或者`$expression`
  - 多行字符串`'''strings'''`
- Boolean
- List(Array)
  - length
  - 通过类似于`var list = const [1, 2, 3];`，可以声明编译时数组常量
- Map
  - 使用方式类似于js map
  - 通过类似于`var map = const { "a": 1, "b": 2 };`，可以声明编译时数组常量
- Set
  - add、addAll
  - length
  - 通过类似于`var set = const {"1", "2", "3"};`，可以声明编译时集合常量
  - 泛型`var elems = <String>{};`
- Rune(在字符串中标识Unicode字符)
  - 在 Dart 中， Rune 用来表示字符串中的 UTF-32 编码字符
- Symbol
  - 通过字面量 Symbol ，也就是标识符前面添加一个 `#` 号，来获取标识符的 Symbol 
  - Symbol 字面量是编译时常量
- Function
  - 函数也是一个对象，有自己的类型`Function`

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

## 问题

### var声明变量和dynamic的区别？

使用var声明的变量为推测类型，类型在声明后不可更改；使用dynamic声明后，变量为动态类型，可以赋值其他变量类型。



### final与const声明变量的区别？

1. 使用const声明常量在编译时就确认了值，所以其右值不可以为变量；使用final在运行时创建常量，右值可以为变量。
2. const编译时确认其右值为字面量或字面量的集合，其后代元素如有变量也需要是使用const声明的，是**深**常量（可传递的）；final是运行时，是**浅**常量（不可传递的）。样例如下：

```dart
// 其子sub为map，map的元素可被修改，这点和java还有js的const比较类似
void main() {
  var subMap = {};
  final map = {'sub': subMap};
  subMap['a'] = 1;
  print(map); // {sub: {a: 1}}
}
```

个人理解如果使用const则意味着告诉编译器，我需要在编译时计算右值（进行RHS查询）



### 创建对象new是否可以省略

简单来说，dart2.x没区别，stackoverflow相关问答

- [do you need to use the new keyword in dart](https://stackoverflow.com/questions/50091389/do-you-need-to-use-the-new-keyword-in-dart)
- [using-the-new-keyword-in-flutter](https://stackoverflow.com/questions/50668487/using-the-new-keyword-in-flutter)