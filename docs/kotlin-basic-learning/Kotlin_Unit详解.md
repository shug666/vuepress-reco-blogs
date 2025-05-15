---
title: Unit为啥还能当函数参数？面向实用的Kotlin Unit详解  
date: 2025-02-10
tags:
 - android
categories: 
 - android
sticky: 
   true
---

文案原稿
----

很多从 Java 转到 Kotlin 的人都会有一个疑惑：为什么 Kotlin 没有沿用 Java 的 `void` 关键字，而要引入这个叫 `Unit` 的新东西？

```java
// Java
public void sayHello() {
  System.out.println("Hello!");
}
```
```kotlin
// Kotlin
fun sayHello(): Unit {
  println("Hello!")
}
```

不过这个问题一般也不会维持很久，因为就算你不明白，好像……也不影响写代码。

直到这两年，大家发现 Compose 的官方示例代码里竟然有把 `Unit` 填到函数参数里的情况：

```kotlin
LaunchedEffect(Unit) {
  xxxx
  xxxxxx
  xxx
}
```

我们才觉得：「啊？还能这么写？」

`Unit` 的本质
----------

大家好，我是扔物线朱凯。

今天来讲一讲 `Unit` 这个特殊的类型。

我们在刚学 Kotlin 的时候，就知道 Java 的 `void` 关键字在 Kotlin 里没有了，取而代之的是一个叫做 `Unit` 的东西：

```java
// Java
public void sayHello() {
  System.out.println("Hello!")
}
```
```kotlin
// Kotlin
fun sayHello(): Unit {
  println("Hello!")
}
```

而这个 `Unit`，和 Java 的 `void` 其实是不一样的。比如 `Unit` 的返回值类型，我们是可以省略掉不写的：

```kotlin
// Kotlin
fun sayHello() {
  println("Hello!")
}
```

不过省略只是语法上的便利，实际上 Kotlin 还是会把它理解成 `Unit`。

`Unit` 和 Java 的 `void` 真正的区别在于，`void` 是真的表示什么都不返回，而 Kotlin 的 `Unit` 却是一个真实存在的类型：

```kotlin
public object Unit {
    override fun toString() = "kotlin.Unit"
}
```

它是一个 `object`，也就是 Kotlin 里的单例类型或者说单例对象。当一个函数的返回值类型是 `Unit` 的时候，它是需要返回一个 `Unit` 类型的对象的：

```kotlin
// Kotlin
fun sayHello() {
  println("Hello!")
  return Unit
}

```

只不过因为它是个 `object` ，所以唯一能返回的值就是 `Unit` 本身。

另外，这一行 `return` 我们也可以省略不写：

```kotlin
// Kotlin
fun sayHello() {
  println("Hello!")
}
```

因为就像返回值类型一样，这一行 `return`，Kotlin 也会帮我们自动加上：

```kotlin
// Kotlin
fun sayHello(): Unit {
  println("Hello!")
  return Unit
}
```

这两个 `Unit` 是不一样的，上面的是 `Unit` 这个类型，下面的是 `Unit` 这个单例对象，它俩长得一样但是是不同的东西。注意了，这个并不是 Kotlin 给 `Unit` 的特权，而是 `object` 本来就有的语法特性。你如果有需要，也可以用同样的格式来使用别的单例对象，是不会报错的：

```kotlin
object Rengwuxian

fun getRengwuxian(): Rengwuxian {
  return Rengwuxian
}
```

包括你也可以这样写：

```kotlin
val unit: Unit = Unit
```

也是一样的道理，等号左边是类型，等号右边是对象——当然这么写没什么实际作用啊，单例你就直接用就行了。

所以在结构上，`Unit` 并没有任何的特别之处，它就只是一个 Kotlin 的 `object` 而已。除了对于函数返回值类型和返回值的自动补充之外，Kotlin 对它没有再施加任何的魔法了。它的特殊之处，更多的是在于语义和用途的角度：它是个由官方规定出来的、用于「什么也不返回」的场景的返回值类型。但这只是它被规定的用法而已，而本质上它真就是个实实在在的类型。也就是在 Kotlin 里，并不存在真正没有返回值的函数，所有「没有返回值」的函数实质上的返回值类型都是 `Unit`，而返回值也都是 `Unit` 这个单例对象，这是 `Unit` 和 Java 的 `void` 在本质上的不同。

`Unit` 的价值所在
------------

那么接下来的问题就是：这么做的意义在哪？

意义就在于，`Unit` 去掉了无返回值的函数的特殊性，消除了有返回值和无返回值的函数的本质区别，这样很多事做起来就会更简单了。

### 例：有返回值的函数在重写时没有返回值

比如？

比如在 Java 里面，由于 `void` 并不是一种真正的类型，所以任何有返回值的方法在子类里的重写方法也都必须有返回值，而不能写成 `void`，不管你用不用泛型都是一样的：

```kotlin
public abstract class Maker {
  public abstract Object make();
}

public class AppleMaker extends Maker {
  // 合法
  @Override
  public Apple make() {
    return new Apple();
  }
}

public class NewWorldMaker extends Maker {
  // 非法
  @Override
  public void make() {
    world.refresh();
  }
}
```

![](https://raw.githubusercontent.com/shug666/image/main/images0c50c2a1f3bd2.jpg)

```kotlin
public abstract class Maker<T> {
  public abstract T make();
}

public class AppleMaker extends Maker<Apple> {
  // 合法
  Override
  public Apple make() {
    return new Apple();
  }
}

public class NewWorldMaker extends Maker<void> {
  // 非法
  Override
  public void make() {
    world.refresh();
  }
}
```

![](https://raw.githubusercontent.com/shug666/image/main/imagesdcb2ba053445b.jpg)

你只能去写一行 `return null` 来手动实现接近于「什么都不返回」的效果：

```java
public class NewWorldMaker extends Maker {
  @Override
  public Object make() {
    world.refresh();
    return null;
  }
}
```

![](https://raw.githubusercontent.com/shug666/image/main/imagese4df0a679b4dd.jpg)

而且如果你用的是泛型，可能还需要用一个专门的虚假类型来让效果达到完美：

```java
public class NewWorldMaker extends Maker<Void> {
  @Override
  public Void make() {
    world.refresh();
    return null;
  }
}
```

![](https://raw.githubusercontent.com/shug666/image/main/images563198558e7af.jpg)  

而在 Kotlin 里，`Unit` 是一种真实存在的类型，所以直接写就行了：

```kotlin
abstract class Maker {
  abstract fun make(): Any
}

class AppleMaker : Maker() {
  override fun make(): Apple {
    return Apple()
  }
}

class NewWorldMaker : Maker() {
  override fun make() {
    world.refresh()
  }
}

```
```kotlin
abstract class Maker<T> {
  abstract fun make(): T
}

class AppleMaker : Maker<Apple>() {
  override fun make(): Apple {
    return Apple()
  }
}

class NewWorldMaker : Maker<Unit>() {
  override fun make() {
    world.refresh()
  }
}
```

这就是 `Unit` 的去特殊性——或者说通用性——所给我们带来的便利。

### 例：函数类型的函数参数

同样的，这种去特殊性对于 Kotlin 的函数式编程也提供了方便。一个函数的函数类型的参数，在函数调用的时候填入的实参，只要符合声明里面的返回值类型，它是可以有返回值，也可以没有返回值的：

```kotlin
fun runTask(task: () -> Any) {
  when (val result = task()) {
    Unit -> println("result is Unit")
    String -> println("result is a String: $result")
    else -> println("result is an unknown type")
  }
}

...

runTask { } // () -> Unit
runTask { println("完成！") } // () -> String
runTask { 1 } // () -> Int
```

Java 不支持把方法当做对象来传递，所以我们没法跟 Java 做对比；但如果 Kotlin 不是像现在这样用了 `Unit`，而是照抄了 Java 的 `void` 关键字，我们就肯定没办法这样写。  

### 小结：去特殊化

这就是我刚才所说的，对于无返回值的函数的「去特殊化」，是 `Unit` 最核心的价值。它相当于是对 Java 的 `void` 进行了缺陷的修复，让本来有的问题现在没有了。而对于实际开发，它的作用是属于润物细无声的，你不需要懂我说的这一大堆东西，也不影响你享受 `Unit` 的这些好处。

…………

那我出这期视频干嘛？

——开个玩笑。了解各种魔法背后的实质，对于我们掌握和正确地使用一门语言是很有必要的。

延伸：当做纯粹的单例对象来使用
---------------

比如，知道 `Unit` 是什么之后，你就能理解为什么它能作为函数的参数去被使用。

Compose 里的协程函数 `LaunchedEffect()` 要求我们填入至少一个 `key` 参数，来让协程在界面状态变化时可以自动重启：

```kotlin
LaunchedEffect(key) {
  xxxx
  xxxxxx
  xxx
}
```

而如果我们没有自动重启的需求，就可以在参数里填上一个 `Unit`：

```kotlin
LaunchedEffect(Unit) {
  xxxx
  xxxxxx
  xxx
}
```

因为 `Unit` 是不变的，所以把它填进参数里，这个协程就不会自动重启了。这招用着非常方便，Compose 的官方示例里也有这样的代码。不过这个和 `Unit` 自身的定位已经无关了，而仅仅是在使用它「单例」的性质。实际上，你在括号里把它换成任何的常量，效果都是完全一样的，比如 `true`、比如 `false`、比如 `1`、比如 `0`、比如 `你好`，都是可以的。所以如果你什么时候想「随便拿个对象过来」，或者「随便拿个单例对象过来」，也可以使用 `Unit`，它和你自己创建一个 `object` 然后去使用，效果是一样的。



本文转自 [https://rengwuxian.com/kotlin-unit/](https://rengwuxian.com/kotlin-unit/)，如有侵权，请联系删除。