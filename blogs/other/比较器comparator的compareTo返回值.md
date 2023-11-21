---
title: Android 比较器comparator的compareTo返回值
date: 2023-05-06
tags:
 - android
categories: 
 - android
sticky: 
   true
---

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

### 总结

1.  无论是arg0-arg1，还是arg1-arg0，都只需要看大于号的情况，小于等于的情况不需要管，即大于才交换原则。
2.  arg0代表的是下标靠前的一个数，arg1代表的是下标靠后的一个数。

 

  

本文转自 [https://blog.csdn.net/qq\_26558047/article/details/113718869](https://blog.csdn.net/qq_26558047/article/details/113718869)，如有侵权，请联系删除。