---
title: android系统中增加编译自定义模块及不加入编译的模块 
date: 2023-09-28
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 1 .使其他的模块不加入编译

关于android.mk中的LOCAL\_OVERRIDES\_PACKAGES需要说明一下，此变量可以使其他的模块不加入编译，

**如: 源码中DeskClock的android.mk有**

```makefile
LOCAL_OVERRIDES_PACKAGES := AlarmClock
```

**使 AlarmClock不会加入到编译系统中，不会生成 AlarmClock.apk。**

## 2.新增模块

增加了一个新的目录/rk3288\_pad/packages/apps/SoundRecorder

在此目录下mm命令可以编译出SoundRecorder.apk，但是直接make不会编译此apk.

**解决方法：**

在下面两个任意文件中修改PRODUCT\_PACKAGES加入新增模块名称即可。

**根据实际项目决定**

build/target/product/core.mk

device/XXXX/device.mk 

```makefile
PRODUCT_PACKAGES := \
```

本文转自 [https://www.cnblogs.com/liulaolaiu/p/11744559.html](https://www.cnblogs.com/liulaolaiu/p/11744559.html)，如有侵权，请联系删除。