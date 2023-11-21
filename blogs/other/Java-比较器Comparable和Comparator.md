---
title: Java 比较器Comparable和Comparator
date: 2023-04-23
tags:
 - android
categories: 
 - android
sticky: 
   true
---

Java函数式接口之Comparable
-------------------------------------------------------------------------------

**\-able接口 在Java中一般表示能力，例如Comparable 比较能力，Iterable迭代能力等等**

### 1\. Comparable接口

**Comparable接口，如其名，实现它后，实现类具有比较比较能力。在Java中是一个FunctionalInterface接口，里面包含一个compareTo方法**

这里引入源代码来分析, 具体如下：

1.  实现该接口的每个类对象会被强加一个总排序，被称之为自然排序，compareTo方法被称之为自然排序法
2.  List、Array等对象实现了该接口，可以自动排序。
3.  compareTo禁止接收null值 会抛出空指针异常，null不是任何类的实例
4.  强烈推荐自然排序和equal结果是一致的，例如 compareTo一致相当于equal方法返回true，**但未要求**
5.  compareTo 使用特定对象来比较顺序 返回 一个负数 或者 0 或者正数 来表示 小于 等于 大于
6.  compareTo必须满足交换性、传递性等特性
7.  **排序输出默认是升序**

```java
public interface Comparable<T> {
    
    /**
     * 使用特定对象来比较顺序 返回 一个负数 或者 0 或者正数 来表示 小于 等于 大于
     * 必须确保交换性 x.compareTo(y)的结果和y.compareTo(x)结果一致
     * 传递性
     * 强烈推荐 x.compareTo比较相同的话 equals值也相等
     * 一般来说 返回值 通常定义三种 -1、0或者 1 这类似一种约定 当然你负数 正数其他值也可以
     */
    public int compareTo(T o);
}
```

#### 1\. 已实现Comparable接口

1.  List集合，一般排序借助于Collections工具类

```java
public static void listSort(){
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(8);
        list.add(3);
    	//第一种排序方法
       	list.sort(null);
    	//第二种排序方法 底层使用第一种方法
        Collections.sort(list);
        System.out.println(list);
    }
```

2.  Array排序 一般排序借助于Arrays工具类

```java
//在原有基础上排序
public static void arraySort(){
        int[] arr = {1,5,3,7};
    	//第一种排序
        Arrays.sort(arr);
    	//第二种排序
    	int[] newArr = Arrays.stream(arr).sorted().toArray();
        System.out.println(Arrays.toString(arr));
    }
```

### 2\. Comparator类

Comparator,一个比较的功能类，也是一个FunctionalInterface.提供了compare方法，接受两个参数，并返回比较值，比较值的规则和Comparable一致，

也可以实现Comparable相同的比较效果

```java
//其他方法省略
@FunctionalInterface
public interface Comparator<T> {
    /**比较两个参数顺序 返回 负数 0 或 正数 分别表示 小于 等于 大于
     */
    int compare(T o1, T o2);
}
```

### 3\. Comparable和Comparator区别

Java设计了Comparable接口，那么为什么还需要设计Comparator接口呢，两者区别是什么呢。

**首先Comparable接口和Comparator接口 都能提供比较能力并返回结果。这是他们的相同点，这是设计的初衷**

不同点：

1.  Comparable 表示一种能力，一般需要对象实现其接口，使其获取比较的能力。实现后 相当于本身具有比较能力。直接调用compareTo方法
2.  Comparator 是一种工具，通过这种工具，可以将两种不具备比较的对象，区分出顺序。是借助外部工具

### 4\. Java设计方式思考

**Java中有其实还有其他类似的设计。例如Iterable和iterator.都是这样。针对相同的能力尽可能的提供更多的渠道，可以实现它，或者使用工具，最终的目的都是达到需要实现的目的。根据这种类似案例，是否以后在开发业务或工具时，也提供更多的渠道供其他调用者使用**

### 5\. 其他类似案例

Iterable和Iterator

### 6. 升序Or降序

在写比较器的时候老是纠结与到底哪个返回值是升序（从小到大），哪个返回值是降序（从大到小）。  
翻找源码，可以知道Comparator本质上是个交换（swap）

```java
for (int j=i; j>low && c.compare(dest[j-1], dest[j])>0; j--)
                    swap(dest, j, j-1);
```

上述代码的意思是，当`dest[j-1] - dest[j] > 0`时，就交换两个元素。  

这样做其实就是从小到大排序（升序)，对应我们重写compareTo方法中，arg0-arg1；并且，我们可以从源码中理解，当两者相等或者j-1小于j时，是不会有任何处理的即：  

**那么，如何从大到小（降序）进行排序呢？**

我们会在CompareTo方法中重写为arg1-arg0；明身处在j-1这个下标之后的dest\[j\]却往前了，产生了的效果就是大的放在了前面，小的放在了后面。

### 6\. 总结

1.  无论是arg0-arg1，还是arg1-arg0，都只需要看大于号的情况，小于等于的情况不需要管，即大于才交换原则。
2.  arg0代表的是下标靠前的一个数，arg1代表的是下标靠后的一个数。

本篇文章其实是FunctionalInterface函数式接口的扩展。在常用的Supplier、Consumer、Function、Predicate的FunctionalInterface以及各种类型扩展后。介绍了Comparable接口。并扩展介绍Comparable的功能含义以及Comparable和Comparator比较。

其实本篇在介绍Comparable接口功能时，列举的案例，输出结果都是都是升序的，那么你有没有想过，如果列举出倒序的结果呢，又有哪几种方式呢?

 

  

本文转自 [https://blog.csdn.net/for2018/article/details/128212226](https://blog.csdn.net/for2018/article/details/128212226)，如有侵权，请联系删除。