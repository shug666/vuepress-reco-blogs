---
title: Android 编译错误undefined symbol分析与解决
date: 2023-05-18
tags:
 - android
categories: 
 - android
sticky: 
   true
---

最近在Android 12上写添加新的.c接口时遇到编译报错的问题，具体报错如下：

![image-20230518210501743](https://raw.githubusercontent.com/shug666/image/main/images/image-20230518210501743.png)

## 一、尝试解决

开始没认真分析报错的原因，直接在网上找答案了。看了网上的答案，基本上都是下面的答案：

```sh
在Android.mk中添加 LOCAL_LDFLAGS := -Wl,--unresolved-symbols=ignore-all
```

然而，加上这句之后，依然还是报同样的错误，似乎他们的解决方法对这个问题不起作用。  

这个方法意思是告诉编译器 绕过这些检查，因此如果您尝试使用库中确实不存在的函数，`ld`就没有机会警告您，一般是不能随便用的。

然后来分析这个报错，它提示 `undefined symbol`。因此尝试去解决这个报错，通过引用`system/core/libutils/include`来解决，具体修改如下：

```
LOCAL_C_INCLUDES += \
    system/core/libnetutils/include \
    system/core/libutils/include \
```

然后编译之后，依然报一样的错。

**后来，将 `include $(BUILD_EXECUTABLE)` 改成 `include $(BUILD_STATIC_LIBRARY)` 之后，竟然编译过了。因此，怀疑是 build系统不让通过`LOCAL_C_INCLUDES`的形式引用。**

虽然已经包含了头文件，但由于编译器找不到要链接的库。不过，由于他们是共享库，因此在构建的时候，并不是严格要求需要拥有这些库。

从Android高版本开始，Android ndk规定了第三方可以使用的稳定的api（可以查看google官方的介绍https://developer.android.google.cn/ndk/guides/stable\_apis.html）。一般可以通过在`Android.mk`中添加以下行来包括：

```sh
LOCAL_LDLIBS := \
  --lfoo \
```

 由于使用的库不是稳定api的一部分。这本质上意味着，即使你的代码在某个特定版本的android上工作，它也可能在任何更高版本上中断，因为api可能已经更改了。

 由于这些库是共享的，ld所做的只是检查它们是否提供了您正在使用的函数。因此一种方法是提供存根库。

 存根库本质上是一个虚拟库，它定义了与“真实”事物相同的符号（函数等），但没有实现（函数只是不做任何事情就返回）。这足以让链接器感到高兴，但这些库并没有提供，它们的“真正”对应项在运行时使用。您需要获取这个库`libutils`的源代码，它们位于以下目录中：

```sh
system/core/libutils
```

因此修改成如下的形式：

```sh
LOCAL_SHARED_LIBRARIES := \
        libutils \
```

还有一种方法是：将`system/core/libutils` 目录复制到项目目录下，然后去掉代码：

然后编辑`Android.mk`，删除`BUILD_SHARED_LIBRARY`以外的所有生成目标，再编辑源代码文件，用一个简单的`return` 替换所有函数体。返回什么并不重要，只是为了能编译代码。  
另外，可能需要防止存根库包含在编译出来的bin中。

##  二、最终解决

在android.mk文件中添加`LOCAL_CFLAGS += -DDVB_STANDARD`这个语句,用于为当前模块添加预处理宏定义。

-D选项用来定义预处理宏格式为-Dname或-Dname=definition。所以这个语句定义了一个名为DVB_STANDARD的预处理宏。在C/C++源代码中,可以使用#ifdef来条件编译基于这个宏:

```c
#ifdef DVB_STANDARD
    // 编译这段代码
#endif
```

如果源代码编译时DVB_STANDARD这个宏被定义,那么#ifdef中的代码块会被编译。否则会被跳过。这通常用于:

1. 编译平台相关的代码:比如基于不同标准或协议的代码可以用预处理宏进行条件编译。

2.  编译调试用的代码:通过定义DEBUG宏可以编译额外的调试日志和断言。3.

3.  打开/关闭某些功能:通过定义/不定义 Feature_X 宏可以编译对应的功能代码。所以,这个语句的作用是为当前模块定义DVB_STANDARD预处理宏,用于条件编译与DVB标准相关的源代码。在编译这个模块的源代码时,所有#ifdef DVB_STANDARD条件编译的代码块都会被编译。如果希望禁用这部分代码,只需要去掉这行语句,那么编译时DVB_STANDARD宏不会被定义,对应的条件编译代码块会被跳过

   

本文转自 [https://blog.csdn.net/k663514387/article/details/107107350/](https://blog.csdn.net/k663514387/article/details/107107350/)，如有侵权，请联系删除。