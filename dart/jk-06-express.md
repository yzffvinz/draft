## Dart如何表达信息 —— 变量、常量、流程控制

### 课后思考题

#### Map中如何支持多种类型，如何判断dart类型

1. 使用`dynamic`或者`Object`泛型接受参数
2. 使用`is`判断类型`object.runtimeType`



### 心得

#### dart类型判断

1. 可枚举使用`is`
2. 使用`object.runtimeType`判断

### Map取其成员变量

```dart
void main() {
    var map = Map();
    map['a'] = 1;
    map.a = 2; // 这个会报错，map array支持使用[]进行访问，.号是用于访问成员变量
}
```

#### final与const声明变量的区别？

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

3. 自定义的对象如何创建编译时常量呢？

   ```dart
   // 如此即可创建一个对象常量，具体步骤下方描述
   class Point {
     final int x;
     final int y;
     const Point(this.x, this.y);
   }
   
   class Line {
     final Point a;
     final Point b;
     const Line(this.a, this.b);
   }
   
   void main() {
       const a = Point(1, 2);
       const b = Point(1, 2);
       const l1 = Line(a, b);
   }
   ```

   1. 创建对象时使用的类的构造函数必须是const（但是不必所有构造函数都需要const修饰）

      ```dart
      // 将样例中的Point添加如下内容，不影响const对象常量创建
      class Point {
        ...
        Point.x(this.x) : y = 0;
      }
      ```

   2. 类的所有成员变量必须是final，否则编译报错

   3. 使用构造函数创建对象时，传入参数必须为const修饰的常量（final也不可，会报错）

   4. 声明变量时使用const修饰该变量，否则即使声明的右值为常量，当前变量仍然可以被赋值其他对象，如下

      ```dart
   // 虽然RHS计算Line(a, b)结果为常量，但是并不影响LHS的l1为一个普普通通的变量
      var l1 = Line(a, b);
      l1 = Line(b, 1);
      ```



### 有点特色的流程控制语句

1. Switch-case

```dart
// 支持fall-through
var command = 'CLOSED';
switch (command) {
  case 'CLOSED': // Empty case falls through.
  case 'NOW_CLOSED':
    // Runs for both CLOSED and NOW_CLOSED.
    executeNowClosed();
    break;
}

// fall-through-with-label
var command = 'CLOSED';
switch (command) {
  case 'CLOSED':
    executeClosed();
    continue nowClosed;
  // Continues executing at the nowClosed label.

  nowClosed:
  case 'NOW_CLOSED':
    // Runs for both CLOSED and NOW_CLOSED.
    executeNowClosed();
    break;
}
```



### 异常捕获

```dart
// try-on-catch-e
try {
  breedMoreLlamas();
} on OutOfLlamasException {
    // on
} on Exception catch (e) {
    // on catch e
} catch (e) {
	// default catch
  print('Error: $e'); // Handle the exception first.
} finally {
    // finally
  cleanLlamaStalls(); // Then clean up.
}
```

