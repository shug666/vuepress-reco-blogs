---
title: android 源码编译 单编加速
date: 2023-07-05
tags:
 - android
categories: 
 - android
sticky: 
   true
---

作为Android framework 开发程序猿，你所不知道的ninja编译工具有多强大。

原生安卓编译大概有以下几个步骤： 

```
①Soong 的自举(bootstrap);

②收集 Android.bp,生成 out/soong/build.ninja 文件;

③收集 Android.mk,生成 out/build-.ninja 与 out/combined-.ninja 文件;

④ 执行 Ninja 文件，进行编译。这个 combined-*.ninja 文件,执行入口。
在我们模块开发，模块编译的时候，使用 mm、mma 单模块编译会重复上面的步骤，
是一个漫等待过程。你不知道的是，实际上在没有改变Android.bp和Android.mk文件时，
不需要执行前三步的、只需要执行第四步，所以要是能够能直接执行第四步，
就能能够大大减少编译编译时长。
```

**重点：**

**_实际上在没有改变 Android.bp 和 Android.mk 文件时，不需要执行前三步的、只需要执行第四步，所以要是能够能直接执行第四步，就能能够大大减少编译编译时长。_**

## 创建脚本ninja-lee.sh

说明：

$ANDROID_BUILD_TOP 这个是Android源码的根目录 绝对路径：

ex: /media/filesystem/workspace/A13.C01/sprd.mocor13.androidT

```sh
ninja () {
    ninja_bin="$ANDROID_BUILD_TOP/prebuilts/build-tools/linux-x86/bin/ninja"
    #ninja_build_file="$ANDROID_BUILD_TOP/out/build-$TARGET_PRODUCT.ninja"
    ninja_build_file="$ANDROID_BUILD_TOP/out/combined-$TARGET_PRODUCT.ninja"
    if [ ! -f $ninja_build_file ]
    then
        echo "can't find ninja buildfile $ninja_build_file"
        exit -1
    fi
    if [ ! -f $ninja_bin ]
    then
        echo "can't find ninja binary $ninja_bin"
        exit -1
    fi
	echo $ninja_bin
	echo $ninja_build_file
	echo $1
    $ninja_bin -f $ninja_build_file $1
}

#usage:ninja<modulename>
ninja $*
```

  

使用如下：

ex：./ninja-lee.sh SystemUI

ex：./ninja-lee.sh Settings

  

本文转自 [https://mp.weixin.qq.com/s/JFvxK6vht3ErADqrZxcpKw](https://mp.weixin.qq.com/s/JFvxK6vht3ErADqrZxcpKw)，如有侵权，请联系删除。