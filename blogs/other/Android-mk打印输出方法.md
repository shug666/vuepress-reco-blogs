---
title: Android mk打印输出方法
date: 2023-08-25
tags:
 - android
categories: 
 - android
sticky: 
   true
---

makefile文件控制整个工程的编译规则，比如指定需要生成哪些目标文件，指明生成这些目标文件依赖哪些源文件，指明生成的目标文件放在哪个文件夹下等等。而make就是一个命令工具，可以解析makefile文件中的指令的一个命令工具。

android.mk也是一样的功能，只不过它是android编译环境下的一种特殊的“makefile”文件, 它是经过了android编译系统处理的。android.mk文件最终还是要被android编译系统层层解析，转化为make命令能够读懂的格式，从而调用gcc编译器进行编译。

## 1、 在 Android.mk里打印信息：

```makefile
$(info string) #1.打印正常输入信息

$(warning string) #2.打印警告信息

$(error string) #3.打印错误信息
```

**以上三种打印方式使用的注意事项：**

1. 各个打印方式的string里都可以带上变量；

2. 如果遇到error打印，将会停止编译进程。

3. 的打印带有 warning 标志，info 打印不带有任何标志。


## 2、 举例说明各个打印函数的方法

以下以packages/apps/Music/Android.mk为例，内容如下：

```makefile
LOCAL_PATH:= $(call my-dir)

$(warning "Warning Just for Test LOCAL_PATH is $(LOCAL_PATH)")
$(info "Info Just for Test LOCAL_PATH is $(LOCAL_PATH)")
include $(CLEAR_VARS) LOCAL_MODULE_TAGS := optional
LOCAL_SRC_FILES := $(call all-java-files-under, src) \
src/com/android/music/IMediaPlaybackService.aidl
LOCAL_PACKAGE_NAME := Music
LOCAL_SDK_VERSION := current
LOCAL_CERTIFICATE := platform
LOCAL_PROGUARD_FLAG_FILES := proguard.flags

include $(BUILD_PACKAGE)

# Use the folloing include to make our test apk.

include $(call all-makefiles-under,$(LOCAL_PATH))
```

  

本文转自 [https://blog.csdn.net/weixin\_44008788/article/details/127575769](https://blog.csdn.net/weixin_44008788/article/details/127575769)，如有侵权，请联系删除。