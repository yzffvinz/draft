```dart
// 08-综合案例 思考题

class Meta {
  double price;
  String name;
  Meta(this.name, this.price);
}

abstract class PrintHelper {
  printInfo() => print(getInfo());
  getInfo();
}

class Item extends Meta {
  int amount;
  Item(name, price, this.amount) : super(name, price);
  Item operator+(Item item) => Item(
    '''$name $amount $price
    ${item.name} ${item.amount} ${item.price}''', price * amount + item.price, 1);
}

class ShoppingCart extends Meta with PrintHelper {
  DateTime date;
  String code;
  List<Item> bookings;
  
//   double get price {
//     return bookings.reduce((value, element) => value + element).price;
//   }
  
//   String get detail {
//     return bookings.reduce((value, element) => value + element).name;
//   }
  Item get totalInfo {
    return bookings.reduce((value, element) => value + element);
  }
  
  ShoppingCart({name}) : this.withCode(name: name, code: null);
  
  ShoppingCart.withCode({name, this.code}) : date = DateTime.now(), super(name, 0);

  getInfo() {
    Item item = totalInfo;
    return '''
    购物车信息:
    --------------------------
    用户名：$name
    优惠码：$code
    **************************
    明 细：
    ${item.name}
    **************************
    总 价: ${item.price}
    日 期: $date
    --------------------------
    
    
    
    ''';
  }
}

void main() {
  ShoppingCart(name: '张三')
    ..bookings = [Item('苹果', 100.0, 1), Item('例子', 20.0, 2)]
    ..printInfo();
  
  ShoppingCart.withCode(name: '会员张三', code: '123456')
    ..bookings = [Item('苹果', 100.0, 3), Item('例子', 20.0, 4)]
    ..printInfo();
}
```

