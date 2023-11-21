---
title: Android 单编framework
date: 2023-04-12
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 一 : 编译framework资源文件

如果修改android framework资源文件，需要先编译资源文件，然后再编译framework才可以正常引用，  

进入项目目录 cd xxx工程目录**`/frameworks/base/core/res/`** 执行mm 编译 framework-res.apk（原生或高通，如果只是修改了core目录下的res资源代码，到这一步就可以了！）  

### 1、生成资源的引用

编译完后**`com.android.internal.R`**中会生成资源的引用

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/d2dda8c0f9844c08979c3b31f22264e3.png)  

原因解析：

**`frameworks\\base\\core\\res\\Android.bp`**文件有以下代码，Android.bp文件描述了模块代码编译的规则，有兴趣可以去深入了解，以前是用Android.mk文件的，现在源码基本都是bp文件了

```sh
android_app { //表示编译成一个apk
    name: "framework-res",  //表示将这个apk命名为framework-res.apk
    sdk_version: "core_platform",
    certificate: "platform", 
    resource_dirs: [  //指定apk所需要的资源文件路径
        "res",  //当前res目录
    ],
    ...
```

所以说，如果我们修改了res目录下的资源文件，只要编译出framework-res.apk文件，然后push进去手机就可以了，其他jar包、so库什么的原因大致一样

如果是修改了**`/frameworks/base`**目录下的其他文件，则还需要下面的操作  

### 2、编译 framework.jar  

	在目录 frameworks/base/ 下执行mm 编译 framework.jar  
	或者 使用
	make framework-minus-apex（进行部分编译）

根据**`framework/base/`**目录下Android.bp中的提示：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/dda77758d575415e989f74fdcb56ea24.png)

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/f2914084287d4f8199879098e1157e67.png)

3、如果 **`frameworks/base/services`** 下有修改，则也要编译，在目录 **`/frameworks/base/services/java/`** 执行mm 编译services.jar  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/e10183647845435e8d833611f0793a19.png)

编译生成的文件都位于你的**`out/target/product/xxx/system/frameworks/`**目录下  

注：若不生成新的apk、jar包文件，请将旧的.apk、.jar包删除  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/45f720a2718e4826878f3ff025678c3b.png)

二 : 验证修改后的效果
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

```
adb root  

adb remount  

adb push framework-res.apk /system/framework/  

adb push framework.jar /system/framework/  

adb push secondary\_framework.jar /system/framework/ (如果存在secondary\_framework.jar,需要push)  

adb push services.jar /system/framework/ （如果service有修改，需要push，还有一些类似service模块带有单独Android.bp的模块等，这里就不一一举例） 

adb reboot 重启设备。
```

替换**`framework.jar`**同时还要**删除**这个目录下面的**`oat，arm，arm64`**三个目录(不删除会一直卡在开机动画)，最后再运行下面的命令重启zygote，这样新替换的framework.jar就生效了。

```sh
adb shell stop
adb shell start
```

三 : 总结
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

在开发过程中,尤其是framework相关开发时,有时候需要重新编译资源文件.编译顺序和注意事项如下(均在源码根目录):  

资源文件位置: **`frameworks/base/core/res`**，编译后生成的文件:**`framework-res.apk`** 另外**`com.android.internal.R`**会更新这个R.java所在目录**`/out/target/common/R/com/android/internal.`**  

编译资源后,必须重新编译framework.jar.  

如果在**`frameworks/base/core/res`**执行mm时并不重新编译,请使用mm -B  

资源文件要小写

## 四：其他模块单编介绍

**`mmm system/core/init`** 等同于 **`cd system/core/init`** 进入目录后再执行mm。  

编译系统采用的是增量编译，只会编译发生变化的目标文件。当需要重新编译所有的相关模块，则需要编译命令后增加参数-B，比如make -B \[module\_name\]，或者 mm -B \[module\_path\]。  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/59d0dfef3c4242c8822689a731530e47.png)

 

  

本文转自 [https://blog.csdn.net/z1804362542/article/details/125977277?ops\_request\_misc=%257B%2522request%255Fid%2522%253A%2522168128706916800192216921%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request\_id=168128706916800192216921&biz\_id=0&utm\_medium=distribute.pc\_search\_result.none-task-blog-2~all~sobaiduend~default-1-125977277-null-null.142^v82^insert\_down38,201^v4^add\_ask,239^v2^insert\_chatgpt&utm\_term=framework%20%E5%8D%95%E7%BC%96&spm=1018.2226.3001.4187](https://blog.csdn.net/z1804362542/article/details/125977277?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522168128706916800192216921%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=168128706916800192216921&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-1-125977277-null-null.142^v82^insert_down38,201^v4^add_ask,239^v2^insert_chatgpt&utm_term=framework%20%E5%8D%95%E7%BC%96&spm=1018.2226.3001.4187)，如有侵权，请联系删除。