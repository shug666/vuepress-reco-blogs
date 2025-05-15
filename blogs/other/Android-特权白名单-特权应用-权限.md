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

## 缺少特殊权限导致无法开机

### 错误日志

系统会有如下 AndroidRuntime 日志：

```java
01-02 21:16:05.037  1766  1766 D AndroidRuntime: Shutting down VM
01-02 21:16:05.038  1766  1766 E AndroidRuntime: *** FATAL EXCEPTION IN SYSTEM PROCESS: main
01-02 21:16:05.038  1766  1766 E AndroidRuntime: java.lang.IllegalStateException: Signature|privileged permissions not in privapp-permissions allowlist: {com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.MODIFY_QUIET_MODE, com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.INTERACT_ACROSS_USERS, com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.START_FOREGROUND_SERVICES_FROM_BACKGROUND, com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.CHANGE_OVERLAY_PACKAGES, com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.READ_COMPAT_CHANGE_CONFIG, com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.LOG_COMPAT_CHANGE}
01-02 21:16:05.038  1766  1766 E AndroidRuntime:        at com.android.server.pm.permission.PermissionManagerServiceImpl.onSystemReady(PermissionManagerServiceImpl.java:4410)
01-02 21:16:05.038  1766  1766 E AndroidRuntime:        at com.android.server.pm.permission.PermissionManagerService$PermissionManagerServiceInternalImpl.onSystemReady(PermissionManagerService.java:739)
01-02 21:16:05.038  1766  1766 E AndroidRuntime:        at com.android.server.pm.PackageManagerService.systemReady(PackageManagerService.java:4094)
01-02 21:16:05.038  1766  1766 E AndroidRuntime:        at com.android.server.SystemServer.startOtherServices(SystemServer.java:2720)
01-02 21:16:05.038  1766  1766 E AndroidRuntime:        at com.android.server.SystemServer.run(SystemServer.java:941)
01-02 21:16:05.038  1766  1766 E AndroidRuntime:        at com.android.server.SystemServer.main(SystemServer.java:651)
01-02 21:16:05.038  1766  1766 E AndroidRuntime:        at java.lang.reflect.Method.invoke(Native Method)
01-02 21:16:05.038  1766  1766 E AndroidRuntime:        at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:548)
01-02 21:16:05.038  1766  1766 E AndroidRuntime:        at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:921)
01-02 21:16:06.635  1993  1993 D AndroidRuntime: >>>>>> START com.android.internal.os.ZygoteInit uid 0 <<<<<<
01-02 21:16:06.652  1992  1992 D AndroidRuntime: >>>>>> START com.android.internal.os.ZygoteInit uid 0 <<<<<<
```

这个日志会一直循环打印，因为异常后，Zygote一直在重启。

### 分析解决

从上面日志找到关键信息：

```java
allowlist: {com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.MODIFY_QUIET_MODE, 
com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.INTERACT_ACROSS_USERS, 
com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.START_FOREGROUND_SERVICES_FROM_BACKGROUND, 
com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.CHANGE_OVERLAY_PACKAGES, 
com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.READ_COMPAT_CHANGE_CONFIG, 
com.android.documentsui (/system/priv-app/DocumentsUI): android.permission.LOG_COMPAT_CHANGE}
```

所以只要配置上面几个私有权限，系统就可以正常启动的。

`frameworks/base/data/etc/privapp-permissions-platform.xml`

在末尾添加权限：

```xml
    <privapp-permissions package="com.android.documentsui">
        <permission name="android.permission.INTERACT_ACROSS_USERS"/>
        <permission name="android.permission.START_FOREGROUND_SERVICES_FROM_BACKGROUND"/>
        <permi ssion name="android.permission.CHANGE_OVERLAY_PACKAGES"/>
        <permission name="android.permission.READ_COMPAT_CHANGE_CONFIG"/>
        <permission name="android.permission.LOG_COMPAT_CHANGE"/>
    </privapp-permissions>
```

重新编译烧录，系统即可启动。

**快速验证：直接修改板卡中的`/system/etc/permissions/privapp-permissions-platform.xml`文件，后重新机器即可**

特权应用
----

什么是特权应用？位于系统分区的`priv-app`目录下的应用就是特权应用。不同的Android版本定义的分区如下

1.  小于等于Android 8.1的版本，特权分区为`/system`。
2.  大于等于Android 9的版本，特权分区为`/system`, `/product`和`/vendor`。

例如，从Android 9开始，`/product/priv-app`目录下的应用就是特权应用。

系统特殊权限
-------

从Android 8.0开始，特权应用如果使用系统的特许权限，那么需要把这个特许权限加入到白名单中。  

那么什么是系统的特许权限? 系统的特许权限必须在`frameworks/base/core/res/AndroidManifest.xml`定义，并且等级为`signature|privileged`

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

```java
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

那么这些白名单文件如何编译到系统分区呢，这是由`frameworks/base/data/etc/Android.bp`决定的，部分代码如下

```makefile
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

备注：`com.test.abc`改成你的包名。

搜索“**runtime permissions**，有如下结果。 很明显可看到 位置权限，存储空间 权限没有被赋予。

输入 **`adb shell dumpsys package com.test.abc >> D:\log.txt`** 可将以上信息保存到log中。搜集这个log，方便排查下些bug原因。

## 系统其他权限介绍

framework 定义的所有 权限都是有定义包含 protectionLevel 等级的，主要权限等级有：普通，运行时，系统签名，特殊 。

##### （1）普通权限（normal）

此类权限允许访问超出应用沙盒的数据和执行超出应用沙盒的操作。但这些数据和操作对用户隐私及对其他应用的操作带来的风险非常小。

比如，上网权限，wifi 状态监听，蓝牙，获取后台任务等待，大概有一百多个。

##### （2）运行时权限（dangerous）

运行时权限也称为危险权限，此类权限授予应用对受限数据的额外访问权限，并允许应用执行对系统和其他应用具有更严重影响的受限操作。因此需要先在应用中请求运行时权限，然后才能访问受限数据或执行受限操作。当应用请求运行时权限时，系统会显示运行时权限弹窗提示。

比如，文件读写权限，日历读取和设置权限等待，总共不到一百个。

##### （3）签名权限（signature）

当应用声明了其他应用已定义的签名权限时，如果两个应用使用同一证书进行签名，系统会在安装时向前者授予该权限。否则，系统无法向前者授予该权限。（注意：有些签名权限不适合第三方应用使用。）

该权限只需要在manifest中声明使用，同时应用和这类权限定义者拥有一样的签名系统就会默认授予应用这类权限；系统授予这类权限后应用无需像运行时权限一样动态申请。

比如，Android11 新增的文件管理权限，对wifi，热点，Camera一些特殊操作权限，比较多，大概有五百多个。

##### （4）特权权限（privileged）

特权权限与特定的应用操作相对应。只有平台和原始设备制造商 (OEM) 可以定义特权权限。此外，如果平台和 OEM 想要防止有人执行功能特别强大的操作（例如通过其他应用绘图），通常会定义特权权限。系统设置中的特殊应用访问权限页面包含一组用户可切换的操作。其中的许多操作都以特权权限的形式实现。每项特权权限都有自己的实现细节。系统会为特权权限分配“appop”保护级别。

比如本文的： 允许应用程序在所有用户之间进行交互权限，启动前台服务权限，可通过overlay形式覆盖属性权限，应用主题更改监听等等，大概有三百多个。

特权权限大部分与系统签名文件同时使用。

具体某些权限有哪些，可以看看下面的 framework 中的定义，有一些权限是网上没有介绍的，可以看看权限签名的注解也能大概知道含义。



本文转自 [https://zhuanlan.zhihu.com/p/165646349](https://zhuanlan.zhihu.com/p/165646349)，如有侵权，请联系删除。