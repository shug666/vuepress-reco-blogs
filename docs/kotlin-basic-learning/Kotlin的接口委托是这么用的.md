---
title: 类声明的右边也能写 by？Kotlin 的接口委托是这么用的
date: 2025-02-11
tags:
 - android
categories: 
 - android
sticky: 
   true
---

Kotlin 的 `by` 关键字，我们平时用得挺多的，比如用 `by lazy` 来设置属性的懒加载：

```kotlin
val lazyUser by lazy {
    User()
}
```

这种写法叫「属性委托」，也就是把属性的读写操作委托给另一个对象。  

除了这种写法，`by` 其实还能写在类声明里，在实现的接口的右边：

```kotlin
internal class IntrinsicsMeasureScope(
    intrinsicMeasureScope: IntrinsicMeasureScope,
    override val layoutDirection: LayoutDirection,
) : MeasureScope, IntrinsicMeasureScope by intrinsicMeasureScope {
```

这种写法，Kotlin 官方的叫法是 Delegation，中文叫委托，实际上它就是接口委托，功能是把类对接口的实现委托给指定的对象。  

它在概念上其实很简单，官方文档就写得清清楚楚：  

```kotlin
interface Base {
    fun printMessage()
    fun printMessageLine()
}

class BaseImpl(val x: Int) : Base {
    override fun printMessage() { print(x) }
    override fun printMessageLine() { println(x) }
}

class Derived(b: Base) : Base by b {
    override fun printMessage() { print("abc") }
}

fun main() {
    val b = BaseImpl(10)
    Derived(b).printMessage()
    Derived(b).printMessageLine()
}
```

但正是这种简单，也带来了一些迷惑：怎么括号里面外面都是它呀？  

![9699df7ccfb77](https://raw.githubusercontent.com/shug666/image/main/images9699df7ccfb77.png)

这种量子纠缠的结构，让人有点摸不明白：这啥意思呀？我应该怎么用、什么时候用？以及如果我看到别人写了这样的代码，应该怎么去理解？

Java 的委托模式
----------

实际上 Kotlin 的这种语法虽然比较新，但它背后的设计模式是早就有了的，叫做「委托模式」。委托模式指的是把类的一部分功能委托给一个辅助对象，比如 Android 里 `View` 这个类的点击回调功能，就是通过 `setOnClickListener()` 方法来委托给了一个 `OnClickListener` 类型的对象：

```kotlin
view.setOnClickListener {
    ...
}
```

这是一个非常典型的委托模式的案例。  

委托模式还有个变种，是把类对于接口的实现，局部地或者完全地委托给自己内部的一个成员对象。比如 Android 里有一个叫做 `ContextWrapper` 的类，它实现了 `Context` 接口，但在 `ContextWrapper` 的内部，对于这个接口的每个的实现，全都委托给了自己内部的一个 `Context` 类型的成员变量：

```java
public class ContextWrapper extends Context {
    @UnsupportedAppUsage
    Context mBase;

    ...

    public ContextWrapper(Context base) {
        mBase = base;
    }

    ...

    @Override
    public AssetManager getAssets() {
        return mBase.getAssets();
    }

    @Override
    public Resources getResources() {
        return mBase.getResources();
    }

    @Override
    public PackageManager getPackageManager() {
        return mBase.getPackageManager();
    }

    @Override
    public ContentResolver getContentResolver() {
        return mBase.getContentResolver();
    }

    @Override
    public Looper getMainLooper() {
        return mBase.getMainLooper();
    }

    @Override
    public Executor getMainExecutor() {
        return mBase.getMainExecutor();
    }

    @Override
    public Context getApplicationContext() {
        return mBase.getApplicationContext();
    }

    ...
}
```

这么啰嗦着套一层是为了什么呢？它可以让实现类不用关心接口的核心功能的具体实现，而只要关注额外的功能定制和扩展。  

什么意思？我们再举个例子，比如对于 Java 的 `List` 这个接口，我们可以用 `ArrayList` 和 `LinkedList` 这两个类对它做出不同的内部实现，去应对不同的性能需求。这种对于接口的核心功能的实现，是不需要委托模式的。而如果我想给 `List` 接口定制额外的功能，比如我想定制一个元素类型是 `User` 的 `List`，让它有各种和用户相关的功能，像「筛出高风险用户」、「按年龄重排」这样的，那么我应该继承 `ArrayList` 还是 `LinkedList` 呢？我只能两个都继承，各自实现一遍。是吧？但相比之下，一个更合适的选择就是，我去直接实现 `List` 接口，在实现类的内部设置一个 `List` 类型的成员，来让它作为核心功能的代理：

```java
public class UserList implements List<User> {
    List<User> userList;

    public UserList(List<User> userList) {
        this.userList = userList;
    }

   @Override
    public int size() {
        return userList.size();
    }

    @Override
    public boolean isEmpty() {
        return userList.isEmpty();
    }

    @Override
    public boolean contains(@Nullable Object o) {
        return userList.contains(o);
    }

    ...
}
```

然后，就可以随便给它加功能了：

```java
public class UserList implements List<User> {
    List<User> list;

    public UserList(List<User> list) {
        this.list = list;
    }

    public List<User> highRiskUsers() {
        ...
    }

    public void sortWithAge() {
        ...
    }

    @Override
    public int size() {
        return userList.size();
    }

    @Override
    public boolean isEmpty() {
        return userList.isEmpty();
    }

    @Override
    public boolean contains(@Nullable Object o) {
        return userList.contains(o);
    }

    ...
}
```

这里面的 `List` 对象具体是用 `ArrayList` 还是 `LinkedList` 或者别的实现，都无所谓，你想用哪个填哪个。也就是，我扩展出来的功能对 `ArrayList` 和 `LinkedList` 都是适用的。对吧？  

通过这种写法，我就可以对接口进行功能扩展，而不需要关心接口的核心功能是怎么实现的。很自由很方便。  

但是……这么一大长串的方法重写，多多少少有点啰嗦，是吧？那也没办法，这已经是最优解法了。  

不过！咱说的是 Java。

Kotlin 的接口委托
------------

同样的做法，你用 Kotlin 也能写：

```kotlin
class UserList(private val list: List<User>) : List<User> {
    override val size: Int get() = list.size

    override fun get(index: Int): User = list[index]

    override fun isEmpty(): Boolean = list.isEmpty()

    override fun iterator(): Iterator<User> = list.iterator()

    override fun listIterator(): ListIterator<User> = list.listIterator()

    override fun listIterator(index: Int): ListIterator<User> = list.listIterator(index)

    override fun subList(fromIndex: Int, toIndex: Int): List<User> = list.subList(fromIndex, toIndex)

    override fun lastIndexOf(element: User): Int = list.lastIndexOf(element)

    override fun indexOf(element: User): Int = list.indexOf(element)

    override fun containsAll(elements: Collection<User>): Boolean = list.containsAll(elements)

    override fun contains(element: User): Boolean = list.contains(element)
}
```

但其实 Kotlin 有更简便的写法，也就是咱刚才说的：接口委托。你只要把 `list` 参数放在接口的右边用 `by` 连接起来：

```kotlin
class UserList(private val list: List<User>) : List<User> by list {
    override val size: Int get() = list.size

    override fun get(index: Int): User = list[index]

    override fun isEmpty(): Boolean = list.isEmpty()

    override fun iterator(): Iterator<User> = list.iterator()

    override fun listIterator(): ListIterator<User> = list.listIterator()

    override fun listIterator(index: Int): ListIterator<User> = list.listIterator(index)

    override fun subList(fromIndex: Int, toIndex: Int): List<User> = list.subList(fromIndex, toIndex)

    override fun lastIndexOf(element: User): Int = list.lastIndexOf(element)

    override fun indexOf(element: User): Int = list.indexOf(element)

    override fun containsAll(elements: Collection<User>): Boolean = list.containsAll(elements)

    override fun contains(element: User): Boolean = list.contains(element)
}
```

就自动实现了这种委托。下面那一堆函数重写就都可以删掉了：

```kotlin
class UserList(list: List<User>) : List<User> by list {
  
}
```

然后你想加什么功能，正常加就可以了：

```kotlin
class UserList(list: List<User>) : List<User> by list {
    fun highRiskUsers(): List<User> {
        return ...
    }

    fun sortWithAge() {
        ...
    }
}
```

这就是 Kotlin 的委托，或者说接口委托。  

别光觉得不错啊，看完视频，该不会用还不会用，那可不行。小结一下，干嘛用的？当你想让一个类实现某个接口，但不想关心核心实现，只想给它做功能拓展，那么就用 `by` 关键字来个接口委托，让核心实现由指定对象进行插件式提供。是吧？  

当然了，对 Kotlin 来说，做功能拓展也可以用扩展函数和扩展属性，这个你可以自己选，看情况而定。  

在 Jetpack Compose 的 `LazyColumn()` 和 `LazyRow()` 组件里都用到了一个叫做 `LazyListMeasureResult�` 的类，它就是用委托来对 `MeasureResult` 这个接口进行的拓展：

```kotlin
internal class LazyListMeasureResult(
    // properties defining the scroll position:
    /** The new first visible item.*/
    val firstVisibleItem: LazyListMeasuredItem?,
    /** The new value for [LazyListState.firstVisibleItemScrollOffset].*/
    val firstVisibleItemScrollOffset: Int,
    /** True if there is some space available to continue scrolling in the forward direction.*/
    val canScrollForward: Boolean,
    /** The amount of scroll consumed during the measure pass.*/
    val consumedScroll: Float,
    /** MeasureResult defining the layout.*/
    measureResult: MeasureResult,
    /** The amount of scroll-back that happened due to reaching the end of the list. */
    val scrollBackAmount: Float,
    // properties representing the info needed for LazyListLayoutInfo:
    /** see [LazyListLayoutInfo.visibleItemsInfo] */
    override val visibleItemsInfo: List<LazyListItemInfo>,
    /** see [LazyListLayoutInfo.viewportStartOffset] */
    override val viewportStartOffset: Int,
    /** see [LazyListLayoutInfo.viewportEndOffset] */
    override val viewportEndOffset: Int,
    /** see [LazyListLayoutInfo.totalItemsCount] */
    override val totalItemsCount: Int,
    /** see [LazyListLayoutInfo.reverseLayout] */
    override val reverseLayout: Boolean,
    /** see [LazyListLayoutInfo.orientation] */
    override val orientation: Orientation,
    /** see [LazyListLayoutInfo.afterContentPadding] */
    override val afterContentPadding: Int,
    /** see [LazyListLayoutInfo.mainAxisItemSpacing] */
    override val mainAxisItemSpacing: Int
) : LazyListLayoutInfo, MeasureResult by measureResult {
    override val viewportSize: IntSize
        get() = IntSize(width, height)
    override val beforeContentPadding: Int get() = -viewportStartOffset
}
```

它没有实现 `MeasureResult` 的任何核心功能，这些核心功能全都交给了委托对象；它只是作为一个针对 `LazyList()` 的 `MeasureResult`，添加了很多额外的属性进来。  

你看，挺好用，也挺容易用的，是吧？

### 对核心功能进行定制修改

延伸一下。除了增加额外功能，接口委托也可以对接口的核心功能进行定制或者修改。比如 Kotlin 协程的源码有一个 `SubscribedSharedFlow`：

```kotlin
private class SubscribedSharedFlow<T>(
    private val sharedFlow: SharedFlow<T>,
    private val action: suspend FlowCollector<T>.() -> Unit
) : SharedFlow<T> by sharedFlow {
    override suspend fun collect(collector: FlowCollector<T>) =
        sharedFlow.collect(SubscribedFlowCollector(collector, action))
}
```

它对 `SharedFlow` 接口进行了委托，但并没有完全交给委托对象，而是重写了这个接口的 `collect()` 函数，对它进行了修改定制。——当你在实现类里重写了接口的某个函数，那么这个函数就不再交给委托对象，而是以你重写的为准。这样就很灵活，你可以按需求对接口进行局部定制。算是个延伸用法。



本文转自 [https://rengwuxian.com/delegation/](https://rengwuxian.com/delegation/)，如有侵权，请联系删除。