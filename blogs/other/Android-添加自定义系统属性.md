---
title: Android 添加自定义系统属性
date: 2023-08-04
tags:
 - android
categories: 
 - android
sticky: 
   true
---

/system/build.prop 是一个属性文件，在Android系统中.prop文件很重要，记录了系统的设置和改变。这个文件是如何生成的呢？

build/tools/buildinfo.sh 脚本就是专门用于生成build.prop文件，  

build/core/Makefile中使用build/tools/buildinfo.sh 脚本生成build.prop文件，所以我们要添加系统属性，主要就是在buildinfo.sh、Makefile和version\_defaults.mk中

## 新增系统属性的流程：

        1.在/build/core/version\_defaults.mk中增加字段

```makefile
TARGET_CONFIGURE := false
```

        2、然后需要在build/tools/buildinfo.sh中增加

```sh
echo "ro.product.configure=$TARGET_CONFIGURE"
```

       3.最后需要在build/core/Makefile中添加

```makefile
TARGET_CONFIGURE="$(TARGET_CONFIGURE)"
```

最后编译，编译完成后就会在 /out/target/product/system/build.prop中出现加入的ro.product.configure属性，

如果需要修改属性的值，只需要更改/build/core/version\_defaults.mk即可

 

## 可添加系统属性的文件

1、build/tools/buildinfo.sh
添加的一般都是前缀为“ro.”的只读系统属性

2、device/$(TARGET_DEVICE_DIR)/system.prop

3、在Makefile中的参数ADDITIONAL_BUILD_PROPERTIES中添加
添加的一般是特定平台或者产品的特定系统属性

4、在Makefile中的参数PRODUCT_PROPERTY_OVERRIDES中添加
添加的一般是特定平台或者产品的特定系统属性
比如device/rockchip/common/device.mk

5、system/core/rootdir/int.rc中on post-fs-data下添加
添加个人自定义的一些系统属性



本文转自 [https://blog.csdn.net/LINENG185/article/details/121560431](https://blog.csdn.net/LINENG185/article/details/121560431)，如有侵权，请联系删除。