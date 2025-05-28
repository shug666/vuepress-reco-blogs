---
title: WMS窗口位置变化分析
date: 2025-05-24
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 背景

在悬浮窗口开发过程中，窗口往往都不是铺满整个屏幕，一般都是一个小窗口，这个时候往往会加上一个自由拖动的功能，那么大家有没有想过这个自由移动功能是如何实现的呢？原理到底是啥呢？

## 窗口位置变化dumpsys分析：

首先针窗口想过位置移动，最先想到应该是通过`dumpsys window windows`和`dumps SurfaceFlinger`来查看

 **`dumpsys window windows`**

![img](https://raw.githubusercontent.com/shug666/image/main/images843256281243152a92d22d7211d1a188397723494.png%401192w.webp)

![img](https://raw.githubusercontent.com/shug666/image/main/imagesd267527ab7e7c5819d21bda7bda4d89e397723494.png%401192w.webp)

可以看到这里的mAttrs的Y值都变大的。

**`dumpsys SurfaceFlinger`来看看情况**

![img](https://raw.githubusercontent.com/shug666/image/main/images925e71d97a94ba089935d0a4f822c448397723494.png%401192w.webp)

![img](https://raw.githubusercontent.com/shug666/image/main/imagesd0558fbb26125e4896544d21aed7d6e6397723494.png%401192w.webp)

可以看到sf的layer中也是可以看出图层是有y方向的位移

上面就得出了window移动实际就是sf的layer中matrix有位移的变化，从而可以移动窗口，本质就是对surfacecontrol进行了位移设置。

## 应用修改窗口位置代码：

![img](https://raw.githubusercontent.com/shug666/image/main/imagesb776b955131fbeeddf07052902be4b48397723494.png%401192w.webp)

可以看到主要是通过`mWindowManager.updateViewLayout`改变`WindowManager.LayoutParams` 的x,y的值

那么这个updateViewLayout又是如何体现到上面的SurfaceFlinger的Layer中呢？

## 追踪如何影响到SurfaceControl

首先可以从SurfaceControl开始打堆栈：

![img](https://raw.githubusercontent.com/shug666/image/main/images3d7ce385f2128fc959dbbf0d4498a50a397723494.png%401192w.webp)

打印如下

![img](https://raw.githubusercontent.com/shug666/image/main/images49c6d9e983fdfd2c9918d7c863158e02397723494.png%401192w.webp)

可以看出是windowstate的updateSurfacePosition触发的SurfaceControl位置变化 `frameworks/base/services/core/java/com/android/server/wm/WindowState.java`

![img](https://raw.githubusercontent.com/shug666/image/main/imagesa0a60317a73cbbe291a2c6a6dcd1ed88397723494.png%401192w.webp)

主要靠mWindowFrames.mFrame这个参数影响，那么这个mWindowFrames.mFrame又是哪里来的？ 这里就是setFrames方法

![img](https://raw.githubusercontent.com/shug666/image/main/images79051d4c4372b1605901e2ee7f0f88d5397723494.png%401192w.webp)

那么setFrames又是谁调用的呢？ 看看如下堆栈

![img](https://raw.githubusercontent.com/shug666/image/main/imagesdd9cfe49ca57728c51a6e4af2158a03f397723494.png%401192w.webp)

上面堆栈就展示的非常清楚，主要核心流程就是如下：

![img](https://raw.githubusercontent.com/shug666/image/main/imagesbf397e94d00dcba75dad0554b2f003c9397723494.png)

这里核心就是layoutWindowLw方法来计算的

![img](https://i0.hdslb.com/bfs/new_dyn/4bfd961d1c30cf934dd7b000a6485722397723494.png@1192w.webp)

layoutWindowLw核心就是如下这个计算方法

这里有attrs里面带了relayout传递来的值，在computeFrames会使用它进行计算最后影响mWindowFrames.mFrame值，computeFrames方法就不展开了，可以去frameworks/base/core/java/android/view/WindowLayout.java查看。