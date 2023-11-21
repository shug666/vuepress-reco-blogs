---
title: Android 在核心库libcore中打印log和单独编译
date: 2023-08-11
tags:
 - android
categories: 
 - android
sticky: 
   true
---

java核心库在android工程的\\libcore\\luni\\src\\main\\java目录下。  

在Android的java核心库中是无法使用Logcat打印的，因为Android的java层要使用Java库，即Java库是Android的Java运行的前提，所以。。。

经过调试，发现其实运用Java的Logger可以很简单的实现(或许Android已经做了处理)，在adb logcat中输出。好了，演示一下。

引入包 

```java
import java.util.logging.Logger;  
```

再定义Logger，    

```java
static Logger logger = Logger.getLogger("mytag");  
```

下面就直接使用

```java
logger.info("blala");  
```

然后在adb logcat直接输出就行了。标签是mytag

二、编译

libcore has some makefile, such as JavaLibrary.mk\\NativeCode.mk.   

LOCAL\_MODULE=libjavacore

  

本文转自 [https://blog.csdn.net/dahailantian1/article/details/78584651](https://blog.csdn.net/dahailantian1/article/details/78584651)，如有侵权，请联系删除。