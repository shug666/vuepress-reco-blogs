---
title: Android 特权白名单，特权应用，权限
date: 2023-02-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

特权应用
----

什么是特权应用？位于系统分区的`priv-app`目录下的应用就是特权应用。不同的Android版本定义的分区如下

1.  小于等于Android 8.1的版本，特权分区为`/system`。
2.  大于等于Android 9的版本，特权分区为`/system`, `/product`和`/vendor`。

例如，从Android 9开始，`/product/priv-app`目录下的应用就是特权应用。

系统的特许权限
-------

从Android 8.0开始，特权应用如果使用系统的特许权限，那么需要把这个特许权限加入到白名单中。  
那么什么是系统的特许权限? 系统的特许权限必须在frameworks/base/core/res/AndroidManifest.xml定义，并且等级为signature|privileged

```xml
<permission
    android:name="com.permission.test"
    android:protectionLevel="signature|privileged" />
```

白名单文件
-----

刚才说到，如果一个特权应用使用了系统的特许权限，那么我们要把这个特许权限加入到白名单中。

那么这个白名单文件在哪呢？如果特权应用在`/vendor`分区，那么白名单文件就必须在`/vendor/etc/permissions/`目录下。

那么这些白名单文件来自哪里呢？一般是来自`frameworks/base/data/etc/`目录，也有的是来自应用，这些应用通过`Android.mk`或`Android.bp`把白名单文件编译到指定目录。

这里以`frameworks/base/data/etc/`目录为例，在我的项目中有如下文件

```
Android.bp
com.android.carrierconfig.xml
com.android.contacts.xml
com.android.dialer.xml
com.android.documentsui.xml
com.android.emergency.xml
com.android.launcher3.xml
com.android.provision.xml
com.android.settings.intelligence.xml
com.android.settings.xml
com.android.storagemanager.xml
com.android.systemui.xml
com.android.timezone.updater.xml
framework-sysconfig.xml
hiddenapi-package-whitelist.xml
platform.xml
privapp-permissions-platform.xml
```

特权应用如果使用了系统特许权限，一般会把白名单添加到`privapp-permissions-platform.xml`文件中。当然也可以单独建立一个文件，例如`com.android.systemui.xml`就是`SystemUI`的特权白名单文件。

那么这些白名单文件如何编译到系统分区呢，这是由frameworks/base/data/etc/Android.bp决定的，部分代码如下

```xml
prebuilt_etc {
    // 配置文件的别名
    name: "privapp-permissions-platform.xml",
    // 配置文件的目录
    sub_dir: "permissions",
    // 源配置文件名
    src: "privapp-permissions-platform.xml",
}

prebuilt_etc {
    name: "privapp_whitelist_com.android.carrierconfig",
    // 配置文件添加到product分区
    product_specific: true,
    sub_dir: "permissions",
    src: "com.android.carrierconfig.xml",
    filename_from_src: true,
}

prebuilt_etc {
    name: "privapp_whitelist_com.android.settings",
	// 配置文件添加到system_ext分区
    system_ext_specific: true,
    sub_dir: "permissions",
    src: "com.android.settings.xml",
    filename_from_src: true,
}
```

第一个`prebuilt_etc`模块是把`privapp-permissions-platform.xml`默认编译到`/system`分区下的`/system/etc/permissions`目录下。

第二个`prebuilt_etc`模块，由于定义了`product_specific: true`，所以把配置文件编译到`/product`分区。

第三个`prebuilt_etc`模块，由于定义了`system_ext_specific: true`，所以把配置文件编译到`/system_ext`分区。

> 由于对Android.bp语法缺乏了解，暂时不知道如何把配置文件编译到vendor分区

为特权应用添加白名单
----------

假如现在我在`frameworks/base/core/res/AndroidManifest.xml`中定义了如下一个特权

```xml
<permission
    android:name="com.permission.test"
    android:protectionLevel="signature|privileged" />
```

然后在`SettingsProvider`的`AndroidManifest.xml`中使用了这个权限

```xml
<uses-permission android:name="com.permission.test" />
```

由于`SettingsProvider`属于特权App，并且使用了系统的特许权限，那么就要为`SettingsProvider`添加这个特权白名单。

你可以参照特权白名单文件，为应用添加白名单内容，这需要手动操作。但是如果你已经把源码编译过，那么可以通过执行`development/tools/privapp_permissions/privapp_permissions.py`这个脚本看到你需要配置的信息，例如对于上面例子，会显示如下信息

```xml
<?xml version="1.0" encoding="utf-8"?>
<permissions>
    <privapp-permissions package="com.android.providers.settings">
        <permission name="com.permission.test"/>
    </privapp-permissions>
</permissions>
```

这就是白名单内容，我们可以把这个内容放到`frameworks/base/data/etc/privapp-permissions-platform.xml`，也可以单独生成一个文件，名为`com.android.providers.settings.xml`。如果是生成单独一个文件 ，那么还需要在`Android.bp`中进行编译配置。

## 查看应用权限赋予情况

```sh
adb shell dumpsys package com.test.abc
```

备注：com.test.abc改成你的包名。

搜索“**runtime permissions**，有如下结果。 很明显可看到 位置权限，存储空间 权限没有被赋予。

输入 **`adb shell dumpsys package com.test.abc >> D:\log.txt`** 可将以上信息保存到log中。搜集这个log，方便排查下些bug原因。

本文转自 [https://zhuanlan.zhihu.com/p/165646349](https://zhuanlan.zhihu.com/p/165646349)，如有侵权，请联系删除。