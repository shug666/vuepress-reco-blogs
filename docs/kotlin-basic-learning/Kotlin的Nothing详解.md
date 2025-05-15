---
title: 这玩意真的有用吗？对，是的！Kotlin的Nothing详解
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

Kotlin 的 `Nothing` 类，无法创建出任何实例：

```kotlin
public class Nothing private constructor()
```

所以所有 `Nothing` 类型的变量或者函数，都找不到可用的值：

```kotlin
val nothing: Nothing = ???
fun nothing(): Nothing {
  ...
  return ???
}
```

就这么简单。但——它有啥用啊？

`Nothing` 的本质
-------------

`Nothing` 的源码很简单：

```kotlin
public class Nothing private constructor()
```

可以看到它本身虽然是 `public` 的，但它的构造函数是 `private` 的，这就导致我们没法创建它的实例；而且它不像 `Unit` 那样是个 `object`：

```kotlin
public object Unit {
  override fun toString() = "kotlin.Unit"
}
```

而是个普通的 `class`；并且在源码里 Kotlin 也没有帮我们创建它的实例。

这些条件加起来，结果就是：`Nothing` 这个类既没有、也不会有任何的实例对象。

基于这样的前提，当我们写出这个函数声明的时候：

```kotlin
fun nothing(): Nothing {

}
```

我们不可能找到一个合适的值来返回。你必须返回一个值，但却永远找不到合适的返回值。悖论了。

作用一：作为函数「永不返回」的提示
-----------------

怎么办？

不怎么办。这个悖论，就是 `Nothing` 存在的意义：它找不到任何可用的值，所以，以它为返回值类型的一定是个不会返回的函数，比如——它可以总是抛异常。  
什么意思？就是说，我这么写是可以的：

```kotlin
fun nothing() : Nothing {
  throw RuntimeException("Nothing!")
}
```

这个写法并没有返回任何结果，而是抛异常了，所以是合法的。

可能有的人会觉得有问题：抛异常就可以为所欲为吗？抛异常就可以忽略返回值了吗？——啊对，抛异常就是可以忽略返回值，而且这不是 `Nothing` 的特性，而是本来就是这样，而且你本来就知道，只是到这里的时候，你可能会忘了。  

例如这个写法：

```kotlin
fun getName() : String {
  if (nameValue != null) {
    return nameValue
  } else {
    throw NullPointerException("nameValue 不能为空！")
  }
}
```

——其实这个函数可以有更加简洁的写法：

```kotlin
fun getName() = nameValue ?: throw NullPointerException("nameValue 不能为空！")
```

不过我们为了方便讲解，就不简化了：

```kotlin
fun getName() : String {
  if (nameValue != null) {
    return nameValue
  } else {
    throw NullPointerException("nameValue 不能为空！")
  }
}
```

在这个函数里，一个 `if` 判断，`true` 就返回，`false` 就抛异常，这个写法很常见吧？它在 `else` 的这个分支，是不是就只抛异常而不返回值了？实际上 Java 和 Kotlin 的任何方法或者说函数，在抛异常的时候都是不返回值的——你都抛异常的还返回啥呀返回？是吧？

所以我如果改成这样：

```kotlin
fun getName() : String {
  throw NullPointerException("不能为空！")
}
```

其实也是可以的。只是看起来比较奇怪罢了，会让人觉得「怎么会这么写呢」？但它的写法本身是完全合法的。而且如果我把函数的名字改一下，再加个注释：

```kotlin
/**
 当遇到姓名为空的时候，请调用这个函数来抛异常
*/
fun throwOnNameNull() : String {
  throw NullPointerException("姓名不能为空！")
}
```

这就很合理了吧？不干别的，就只是抛异常。这是一种很常用的工具函数的写法，包括 Kotlin 和 Compose 的官方源码里也有这种东西。

那么我们继续来看它的返回值类型：我都不返回了，就没必要还写 `String` 了吧？那写什么？可以把它改成 `Unit`：

```kotlin
/**
 当任何变量为空的时候，请统一调用这个函数来抛异常
*/
fun throwOnNameNull() : Unit {
  throw NullPointerException("姓名不能为空！")
}
```

有问题吗？没问题。

不过，Kotlin 又进了一步，提供了一个额外的选项：你还可以把它改成 `Nothing`：

```kotlin
/**
 当任何变量为空的时候，请统一调用这个函数来抛异常
*/
fun throwOnNameNull() : Nothing {
  throw NullPointerException("姓名不能为空！")
}
```

虽然我找不到 `Nothing` 的实例，但是这个函数本来就是永远抛异常的，找不到实例也没关系。哎，这不就能用了吗？对吧？

不过，能用归能用，这么写有啥意义啊？是吧？价值在哪？——价值就在于，`Nothing` 这个返回值类型能够给使用它的开发者一个明确的提示：这是个永远不会返回的函数。这种提示本身，就会给开发提供一些方便，它能很好地避免函数的调用者对函数的误解而导致的一些问题。我们从 Java 过来的人可能第一时间不太能感受到这种东西的用处，其实你要真说它作用有多大吧，我觉得不算大，主要是很方便。它是属于「你没有的话也不觉得有什么不好的，但是有了之后就再也不想没有它」的那种小方便。就跟 120Hz 的屏幕刷新率有点像，多少带点毒。

Kotlin 的源码、Compose 的源码里都有不少这样的实践，比如 Compose 的 `noLocalProviderFor()` 函数：

```kotlin
private fun noLocalProvidedFor(name: String): Nothing {
  error("CompositionLocal $name not present")
}
```

好，这就是 Nothing 的作用之一：作为函数的返回值类型，来明确表达「这是个永不返回的函数」。

其实 `Nothing` 的「永不返回」除了抛异常之外，还有一种场景，就是无限循环：

```kotlin
fun foreverRepeat(): Nothing {
  while (true) {
    ...
  }
}
```

不过一般很少有人这么去用，大部分都是用在我刚才说的抛异常的场景，这是非常常见的一种用法，你写业务可能用不到，但是基础架构团队给全公司写框架或者对外写 SDK 的话，用到它的概率就非常大了。

作用二：作为泛型对象的临时空白填充
-----------------

另外 `Nothing` 除了「没有可用的实例」之外，还有个特性：它是所有类型共同的子类型。这其实是违反了 Kotlin 的「类不允许多重继承」的规定的，但是 Kotlin 强行扩充了规则：`Nothing` 除外，它不受这个规则的约束。虽然这违反了「类不允许多重继承」，但因为 `Nothing` 不存在实例对象，所以它的多重继承是不会带来实际的风险的。——我以前还跟人说「`Nothing` 是所有类型的子类型」这种说法是错误的，惭愧惭愧，是我说错了。

不过，这个特性又有什么作用呢？它就能让你对于任何变量的赋值，都可以在等号右边写一个 `Nothing`：

```kotlin
val nothing: Nothing = TODO()
var apple: Apple = nothing
```

这儿其实有个问题：我刚说了 `Nothing` 不会有任何的实例，对吧？那么这个右边就算能填 `Nothing` 类型的对象，可是这个对象我用谁啊？

```ko
val nothing: Nothing = ???
var apple: Apple = nothing
```

谁也没法用。

但是我如果不直接用 `Nothing`，而是把它作为泛型类型的实例化参数：

```kotlin
val emptyList: List<Nothing> = ???
var apples: List<Apple> = emptyList
```

这就可以写了。一个元素类型为`Nothing` 的 `List`，将会导致我无法找到任何的元素实例来填充进去，但是这个 `List` 本身是可以被创建的：

```kotlin
val emptyList: List<Nothing> = listOf()
var apples: List<Apple> = emptyList
```

只不过这种写法看起来好像有点废，因为它永远都只能是一个空的 `List`。但是，如果结合上我们刚说的「`Nothing` 是所有类型的子类型」这个特性，我们是不是可以把这个空的 `List` 赋值给任何的 `List` 变量？

```kotlin
val emptyList: List<Nothing> = listOf()
var apples: List<Apple> = emptyList
var users: List<User> = emptyList
var phones: List<Phone> = emptyList
var images: List<Image> = emptyList
```

这样，是不是就提供了一个通用的空 `List` 出来，让这一个对象可以用于所有 `List` 的初始化？有什么好处？既省事，又省内存，这就是好处。

这种用法不只可以用在 `List`，`Set` 和 `Map` 也都没问题：

```kotlin
val emptySet: Set<Nothing> = setOf()
var apples: Set<Apple> = emptySet
var users: Set<User> = emptySet
var phones: Set<Phone> = emptySet
var images: Set<Image> = emptySet
```
```kotlin
val emptyMap: Map<String, Nothing> = emptyMap()
var apples: Map<String, Apple> = emptyMap
var users: Map<String, User> = emptyMap
var phones: Map<String, Phone> = emptyMap
var images: Map<String, Image> = emptyMap
```

而且也不限于集合类型，只要是泛型都可以，你自定义的也行：

```kotlin
val emptyProducer: Producer<Nothing> = Producer()
var appleProducer: Producer<Apple> = emptyProducer
var userProducer: Producer<User> = emptyProducer
var phoneProducer: Producer<Phone> = emptyProducer
var imageProducer: Producer<Image> = emptyProducer
```

它的核心在于，你利用 `Nothing` 可以创建出一个通用的「空白」对象，它什么实质内容也没有，什么实质工作也做不了，但可以用来作为泛型变量的一个通用的空白占位值。这就是 `Nothing` 的第二个主要用处：作为泛型变量的通用的、空白的临时填充。多说一句：这种空白的填充一定是临时的才有意义，你如果去观察一下就会发现，这种用法通常都是赋值给 `var` 属性，而不会赋值给 `val`：

```kotlin
val emptyProducer: Producer<Nothing> = Producer()
// 没人这么写：
val appleProducer: Producer<Apple> = emptyProducer
val userProducer: Producer<User> = emptyProducer
val phoneProducer: Producer<Phone> = emptyProducer
val imageProducer: Producer<Image> = emptyProducer
```

因为赋值给 `val` 那就是永久的「空白」了，永久的空白那不叫空白，叫废柴，这个变量就没意义了。

作用三：语法的完整化
----------

另外，`Nothing` 的「是所有类型的子类型」这个特点，还帮助了 Kotlin 语法的完整化。在 Kotlin 的下层逻辑里，`throw` 这个关键字是有返回值的，它的返回值类型就是 `Nothing`。虽然说由于抛异常这件事已经跳出了程序的正常逻辑，所以 `throw` 返回不返回值、返回值类型是不是 `Nothing` 对于它本身都不重要，但它让这种写法成为了合法的：

```kotlin
val nothing: Nothing = throw RuntimeException("抛异常！")
```

并且因为 `Nothing` 是所有类型的子类型，所以我们这么写也行：

```kotlin
val nothing: String = throw RuntimeException("抛异常！")
```

看起来没用是吧？如果我再把它改改，就有用了：

```kotlin
var _name:String? = null
val name:String = _name ?: throw NullPointerException("_name 在运行时不能为空！")
```

throw 的返回值是 `Nothing`，我们就可以把它写在等号的右边，在语法层面假装成一个值来使用，但其实目的是在例外情况时抛异常。

Kotlin 里面有个 `TODO()` 函数对吧：

```kotlin
val someValue: String = TODO()
```

这种写法不会报错，并不是 IDE 或者编译器做了特殊处理，而是因为 `TODO()` 的内部是一个 `throw`：  

![](https://raw.githubusercontent.com/shug666/image/main/images07c03d49d7286.jpg) 
`TODO()` 返回的是 `Nothing`，是 `String` 的子类，怎么不能写了？完全合法！虽然 `throw` 不会真正地返回，但这让语法层面变得完全说得通了，这也是 `Nothing` 的价值所在。

除了 `throw` 之外，`return` 也是被规定为返回 `Nothing` 的一个关键字，所以我也可以这么写：

```kotlin
fun sayMyName(first: String, second: String) {
  val name = if (first == "Walter" && second == "White") {
    "Heisenberg"
  } else {
    return // 语法层面的返回值类型为 Nothing，赋值给 name
  }
  println(name)
}
```

这段代码也是可以简化的：

```kotlin
fun sayMyName(first: String, second: String) {
  if (first == "Walter" && second == "White") println("Heisenberg")
}
```

不过同样，咱不是为了讲东西么，就不简化了：

```kotlin
fun sayMyName(first: String, second: String) {
  val name = if (first == "Walter" && second == "White") {
    "Heisenberg"
  } else {
    return // 语法层面的返回值类型为 Nothing，赋值给 name
  }
  println(name)
}
```

虽然直接强行解释为「`return` 想怎么写就怎么写」也是可以的，但 Kotlin 还是扩充了规则，规定 `return` 的返回值是 `Nothing`，让代码从语法层面就能得到解释。

这就是 `Nothing` 的最后一个作用：语法层面的完整化。

  

本文转自 [https://rengwuxian.com/kotlin-nothing/](https://rengwuxian.com/kotlin-nothing/)，如有侵权，请联系删除。