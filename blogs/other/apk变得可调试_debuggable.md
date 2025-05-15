---
title: apk 变得可调试 debuggable=true
date: 2025-03-14
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## android:debuggable的作用  

在 Android 开发中，`android:debuggable="true"` 是 AndroidManifest.xml 文件中 `<application>` 标签的一个属性，用于指定应用程序是否可以以调试模式运行。以下是它的作用和注意事项：

### 作用

1. 允许调试：
* 设置 `android:debuggable="true"` 后，应用程序可以通过调试工具（如 Android Studio 的调试器或 adb 调试）附加调试进程。
* 开发者可以实时查看变量、调用栈和其他调试信息。

3. 增强日志输出：
* 在调试模式下，应用程序可能会输出更多的日志信息，方便排查问题。

5. 启用调试专用工具：
* 一些调试工具（如 Stetho、LeakCanary）需要该属性为 `true` 才能正常工作。

### 默认行为

* 当使用 debug 构建（`buildTypes.debug`）时，`android:debuggable` 默认值为 `true`。
* 当使用 release 构建（`buildTypes.release`）时，`android:debuggable` 默认值为 `false`。

### 安全注意事项

1. 禁止在生产环境中设置为 `true`：
* 如果在发布的应用中保留 `android:debuggable="true"`，可能会暴露敏感信息（如日志、API 密钥）。
* 攻击者可以通过反向调试工具（如 Frida）轻松调试和修改应用的运行时行为。

3. 检查打包设置：
* 在发布之前，确保使用 `release` 构建并验证 `android:debuggable` 被设置为 `false`。

5. 代码审查：
* 在代码审查过程中检查是否有手动设置 `android:debuggable` 属性的情况。

## 让apk变可调试  

android 14之后改了判定机制，原来的ro.debuggable属性已经没用了，新的全局调试条件改成了ro.build.type=eng或者ro.build.type=userdebug并且persist.debug.dalvik.vm.jdwp.enabled=1

### LSPosed 插件 XAppDebug  
toggle app debuggable

https://github.com/Palatis/XAppDebug


> 我 小米 MIUI14 android13 没成功

## 关闭 selinux


```shell
XXX:/ # getenforce   //获取当前SELinux状态  
Enforcing  
XXX:/ #  setenforce 0   //临时关闭SELinux状态  
XXX:/ # getenforce   	//获取SELinux状态  
Permissive  
XXX:/ # setenforce 1   //永久开启SELinux状态  
XXX:/ # getenforce  
Enforcing  
XXX:/ #
```



