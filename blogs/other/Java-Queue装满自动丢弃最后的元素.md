---
title: Java Queue 装满自动丢弃最后的元素
date: 2023-10-23
tags:
 - java
categories: 
 - java
sticky: 
   true
---

## Java Queue 装满自动丢弃最后的元素

在Java编程中，Queue（队列）是一种常用的数据结构，用于存储和管理一系列元素。它遵循先进先出（FIFO）原则，即最先进入队列的元素也将最先被取出。

在某些情况下，我们可能需要限制队列的大小并在队列已满时自动丢弃最后的元素。这种功能在处理实时数据流、消息队列等场景中非常有用。

本文将介绍如何使用Java中的Queue实现装满自动丢弃最后的功能，并提供相应的代码示例。

### 基本概念

在开始之前，让我们先了解一些基本概念。

1. 队列（Queue）

队列是一种线性数据结构，可用于存储一系列元素。它遵循先进先出（FIFO）原则，即最先进入队列的元素也将最先被取出。

在Java中，Queue接口定义了队列的基本操作，如插入、删除和查询等。常见的Queue实现类有LinkedList和ArrayDeque等。

2. 容量（Capacity）

队列的容量表示队列可以存储的元素个数。当队列已满时，如果我们尝试向队列中插入新的元素，就需要进行一些处理。

3. 自动丢弃（Automatic Discard）

自动丢弃的意思是，在队列已满的情况下，如果我们尝试向队列中插入新的元素，最后一个元素将被自动丢弃。

## 实现自动丢弃功能的Queue

要实现队列装满自动丢弃最后的元素功能，我们可以通过继承现有的Queue实现类并覆盖相关方法来实现。

以下是一个示例代码，展示了如何实现一个装满自动丢弃最后元素的队列：

```java
import java.util.LinkedList;

public class AutoDiscardQueue<E> extends LinkedList<E> {

    private int capacity;

    public AutoDiscardQueue(int capacity) {
        this.capacity = capacity;
    }

    @Override
    public boolean offer(E e) {
        if (size() >= capacity) {
            // 如果队列已满，则移除最先入队的元素
            poll();
        }
        return super.offer(e);
    }
}
```

在上面的代码中，我们创建了一个`AutoDiscardQueue`类，它继承自`LinkedList`。我们还定义了一个私有成员变量`capacity`，用于表示队列的容量。

覆盖了`offer`方法，该方法用于向队列中插入元素。在方法内部，我们首先检查队列的大小是否已达到容量。如果是，则调用`poll`方法移除队列中的第一个元素，以保证队列始终保持在容量范围内。然后，我们调用`super.offer(e)`方法将新的元素插入队列。

## 使用自动丢弃队列

下面我们来介绍如何使用刚刚实现的自动丢弃队列。

首先，我们需要创建一个自动丢弃队列的实例，并指定队列的容量。例如，我们可以创建一个容量为10的队列：

```java
AutoDiscardQueue<Integer> queue = new AutoDiscardQueue<>(10);
```

然后，我们可以像使用普通的队列一样使用这个自动丢弃队列。例如，我们可以使用`offer`方法向队列中插入元素：

```java
queue.offer(1);
queue.offer(2);
queue.offer(3);
```

如果我们尝试向队列中插入超过容量的元素，最后一个元素将被自动丢弃：

```java
queue.offer(4);
```

在上面的代码中，当我们尝试插入元素4时，由于队列已满，最先入队的元素1将被自动丢弃。



本文转自 [https://blog.51cto.com/u\_16213415/7285414](https://blog.51cto.com/u_16213415/7285414)，如有侵权，请联系删除。