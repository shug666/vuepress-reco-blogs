---
title: 自定义View 2.1 布局基础
date: 2025-01-31
tags:
 - android
categories: 
 - android
sticky: 
---

自定义 View 最关键的有三个点：绘制、布局和触摸反馈

## 布局过程的含义

布局过程，就是程序在运行时利用布局文件的代码来计算出实际尺寸的过程。

## 布局过程的工作内容

两个阶段：测量阶段和布局阶段。

**测量阶段**：从上到下递归地调用每个 View 或者 ViewGroup 的 measure() 方法，测量他们的尺寸并计算它们的位置；  

**布局阶段**：从上到下递归地调用每个 View 或者 ViewGroup 的 layout() 方法，把测得的它们的尺寸和位置赋值给它们。

## View 或 ViewGroup 的布局过程

1.测量阶段，`measure()` 方法被父 View 调用，在 `measure()` 中做一些准备和优化工作后，调用 `onMeasure()` 来进行实际的自我测量。 `onMeasure()` 做的事，`View` 和 `ViewGroup` 不一样：

1.  **View**：`View` 在 `onMeasure()` 中会计算出自己的尺寸然后保存；
2.  **ViewGroup**：`ViewGroup` 在 `onMeasure()` 中会调用所有子 View 的 `measure()` 让它们进行自我测量，并根据子 View 计算出的期望尺寸来计算出它们的实际尺寸和位置（实际上 99.99% 的父 View 都会使用子 View 给出的期望尺寸来作为实际尺寸，原因在下期或下下期会讲到）然后保存。同时，它也会根据子 View 的尺寸和位置来计算出自己的尺寸然后保存；

2.布局阶段，`layout()` 方法被父 View 调用，在 `layout()` 中它会保存父 View 传进来的自己的位置和尺寸，并且调用 `onLayout()` 来进行实际的内部布局。`onLayout()` 做的事， `View` 和 `ViewGroup` 也不一样：

1.  **View**：由于没有子 View，所以 `View` 的 `onLayout()` 什么也不做。
2.  **ViewGroup**：`ViewGroup` 在 `onLayout()` 中会调用自己的所有子 View 的 `layout()` 方法，把它们的尺寸和位置传给它们，让它们完成自我的内部布局。

## 布局过程自定义的方式

三类：

1.  重写 `onMeasure()` 来修改已有的 `View` 的尺寸；
2.  重写 `onMeasure()` 来全新定制自定义 `View` 的尺寸；
3.  重写 `onMeasure()` 和 `onLayout()` 来全新定制自定义 `ViewGroup` 的内部布局。

## 1. 修改已有自定义View的尺寸

也就是重写 `onMeasure()` 来修改已有的 `View` 的尺寸的具体做法：

1. 重写 `onMeasure()` 方法，并在里面调用 `super.onMeasure()`，触发原有的自我测量；
2. 在 `super.onMeasure()` 的下面用 `getMeasuredWidth()` 和 `getMeasuredHeight()` 来获取到之前的测量结果，并使用自己的算法，根据测量结果计算出新的结果；
3. 调用 `setMeasuredDimension()` 来保存新的结果。

## 2. 全新定义View的尺寸

### 全新定制尺寸和修改尺寸的最重要区别

需要在计算的同时，保证计算结果满足父 View 给出的的尺寸限制

### 父 View 的尺寸限制

1.  由来：开发者的要求（布局文件中 `layout_` 打头的属性）经过父 View 处理计算后的更精确的要求；
2.  限制的分类：
    1.  `UNSPECIFIED`：不限制
    2.  `AT_MOST`：限制上限
    3.  `EXACTLY`：限制固定值

### 全新定义自定义View尺寸的方式

1.  重新 `onMeasure()`，并计算出 View 的尺寸；
2.  使用 `resolveSize()` 来让子 View 的计算结果符合父 View 的限制（当然，如果你想用自己的方式来满足父 View 的限制也行）。

## 3. 自定义定制 Layout 的内部布局

### 定制 Layout 内部布局的方式

1.  重写 `onMeasure()` 来计算内部布局
2.  重写 `onLayout()` 来摆放子 View

### 重写 onMeasure() 的三个步骤：

1.  调用每个子 View 的 `measure()` 来计算子 View 的尺寸
2.  计算子 View 的位置并保存子 View 的位置和尺寸
3.  计算自己的尺寸并用 `setMeasuredDimension()` 保存

![image-20250131213204572](https://raw.githubusercontent.com/shug666/image/main/imagesimage-20250131213204572.png)

![image-20250131213324347](https://raw.githubusercontent.com/shug666/image/main/imagesimage-20250131213324347.png)

### 计算子 View 尺寸的关键

计算子 View 的尺寸，关键在于 `measure()` 方法的两个参数——也就是子 View 的两个 `MeasureSpec` 的计算。

#### 子 View 的 MeasureSpec 的计算方式：

*   结合开发者的要求（xml 中 `layout_` 打头的属性）和自己的可用空间（自己的尺寸上限 - 已用尺寸）
*   尺寸上限根据自己的 `MeasureSpec` 中的 mode 而定
    *   EXACTLY / AT\_MOST：尺寸上限为 `MeasureSpec` 中的 `size`
    *   UNSPECIFIED：尺寸无上限

### 重写 onLayout() 的方式

在 `onLayout()` 里调用每个子 View 的 `layout()` ，让它们保存自己的位置和尺寸。

本文转自 [https://rengwuxian.com/ui-2-1/](https://rengwuxian.com/ui-2-1/)，如有侵权，请联系删除。