---
title: Android Overlay机制
date: 2023-07-25
tags:
 - android
categories: 
 - android
sticky: 
   true
---

Android Overlay机制
-----------------

**Android Overlay** 是一种资源替换机制，它能在不重新打包 apk 的情况下，覆盖替换 res/ 下的字符和图片等资源。

分为 静态Overlay (Static Resource Overlay) 和 运行时 Overlay (Runtime Resource Overlay) 。

两种 Overlay 方式，都需要资源 id 对应上。大白话就是要替换的资源名称一样、字符串的 id 一样。

**静态Overlay （SRO）**：发生在编译时，需要在 Aosp 源码中配置。

**运行时Overlay （RRO**）：发生在运行时，可以直接覆盖替换其他 apk 的资源而不需要其源码。

## 静态Overlay （SRO）

可以替换 string.xml 、图片、layout、anim、xml目录中的 xml 文件 。

常用场景：覆盖替换 frameworks/ 、packages/ 目录下的资源文件。如改翻译词条、图片、改默认值等。

```shell
frameworks/base/core/res/res/drawable-xxxhdpi/
frameworks/base/core/res/res/layout-xxxhdpi/
frameworks/base/core/res/res/values/
frameworks/base/packages/SettingsProvider/res/values/defaults.xml
packages/apps/Bluetooth/res/values/
```

### **🔧 主要文件结构：**

```
vendor/
└── overlay/
    ├── SystemUIOverlay/
    │   ├── Android.mk
    │   ├── AndroidManifest.xml
    │   ├── res/
    │   │   ├── values/colors.xml  # 修改颜色
    │   │   ├── drawable/ic_lock.png  # 修改图标
    │   │   ├── layout/status_bar.xml  # 修改状态栏布局
    │   └── Android.bp
```

####  **AndroidManifest.xml**

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.overlay"
    android:versionCode="1"
    android:versionName="1.0">
    
    <overlay android:targetPackage="com.android.systemui"
             android:priority="1"
             android:requiredSystemPropertyName="ro.vendor.overlay"
             android:requiredSystemPropertyValue="true"/>
</manifest>
```

**🔍 关键参数：**

- `android:targetPackage="com.android.systemui"`
- - **指定目标应用**（此处为 `SystemUI`）。
- `android:priority="1"`
- - **优先级**（数字越大，优先级越高）。
- `android:requiredSystemPropertyName="ro.vendor.overlay"`
- - **控制 Overlay 是否启用**（适用于机型适配）。

### 1.配置 overlay 目录

在 Aosp 源码下下找到 `PRODUCT_PACKAGE_OVERLAYS` 的定义，一般都配置在 device 目录下，如 device/xxx/yyy/device.mk ，

```shell
# overlay
PRODUCT_PACKAGE_OVERLAYS := \device/xxx/yyy/overlay
```

### 2.替换资源文件

在 device/xxx/yyy/overlay 下按照 frameworks 目录新建对应的文件夹，放入要替换的文件即可。

```shell
device/xxx/yyy/overlay/frameworks/
device/xxx/yyy/overlay/packages/
```

### 3.全编译验证

全编译验证即可。

运行时 Overlay (RRO)
--------------------------------------------------------

可以替换 string.xml 、图片，不能替换 layout、anim、xml 目录中的 xml 文件 。

常用场景：覆盖替换目标 apk 的翻译词条、图片资源等。

假设当前已有 Test.apk ，包名是 com.test 。我们用 运行时 Overlay 的形式替换它的 翻译词条和图片。

### 常用命令

🔧 **动态 Overlay 也是一个 APK，但不需要** `system` **分区权限**，可以直接安装：

```bash
$ adb install MyDynamicOverlay.apk
```

然后 **启用**：

```bash
$ cmd overlay enable com.example.overlay
```

🔍 **查看 Overlay 状态：**

```bash
$ cmd overlay list
```

🛠 **禁用 Overlay：**

```bash
$ cmd overlay disable com.example.overlay
```

### **Java 代码启用/禁用 Overlay**

```java
OverlayManager overlayManager = (OverlayManager) getSystemService(Context.OVERLAY_SERVICE);
overlayManager.setEnabled("com.example.overlay", true); // 启用
overlayManager.setEnabled("com.example.overlay", false); // 禁用
```

### 1.新建 xxxOverlay 目录，创建 Android.mk

新建 TestOverlay 目录，在目录下创建 Android.mk ，

写入这些内容，

```shell
LOCAL_PATH := $(call my-dir)

package_name := com.zeasn.ru_toptech
customer_overlay := vendor/toptech/.build/overlay
include $(CLEAR_VARS)

LOCAL_IS_RUNTIME_RESOURCE_OVERLAY := true
LOCAL_PACKAGE_NAME := $(package_name).overlay
LOCAL_CERTIFICATE := platform
LOCAL_MODULE_PATH := $(TARGET_OUT_VENDOR)/overlay
LOCAL_RESOURCE_DIR :=
ifeq ($(shell test -e $(customer_overlay)/$(package_name)/res && echo yes),yes)
LOCAL_RESOURCE_DIR += $(customer_overlay)/$(package_name)/res
endif
LOCAL_RESOURCE_DIR += $(LOCAL_PATH)/res
LOCAL_AAPT_INCLUDE_ALL_RESOURCES := true
LOCAL_SDK_VERSION := system_current
LOCAL_AAPT_FLAGS += --auto-add-overlay
include $(BUILD_PACKAGE)
```

LOCAL\_CERTIFICATE 可以写 shared 、platform ，取决于对签名的要求。

LOCAL\_MODULE\_PATH := $(TARGET\_OUT\_VENDOR)/overlay ，说明编译后生成的 apk 路径在 vendor/overlay/com.zeasn.ru_toptech.overlay.apk 。这个路径可以根据不同方案进行调整。

### 2.创建 AndroidManifest.xml

创建 AndroidManifest.xml ，写入

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.zeasn.ru_toptech.overlay"
    android:versionCode="1"
    android:versionName="1.0" >

    <overlay
        android:priority="1"
        android:targetPackage="com.zeasn.ru_toptech"
        android:isStatic="true" />

</manifest>
```

package=“com.zeasn.ru_toptech.overlay” 是后面编译生成的 TestOverlay.apk 的包名。

targetPackage 是目标 apk 的包名。

### 3.放入资源文件

创建 xxxOverlay/res/ 目录，放入对应的文件即可，目录机构如 apk 源码目录结构是一样的。

```sh
xxxOverlay/res/values/strings.xml
xxxOverlay/res/values-fa/strings.xml
xxxOverlay/res/drawable-hdpi/pic1.png
xxxOverlay/res/mipmap-hdpi/mip1.png
```

需要留意，即使只是想替换 values-fa/strings.xml 里的字符串，values/strings.xml 里也要加上对应的字符串，要不然会替换不成功。

### 4.编译

修改 device/xxx/yyy/device.mk ，把 xxxOverlay 加入编译，

```sh
PRODUCT_PACKAGES += \FileManagerOverlay \
```

单编得到 xxxOverlay.apk , push 到机器上验证即可。

## **静态 Overlay vs 动态 Overlay 对比**

| 对比项                    | 静态 Overlay                          | 动态 Overlay                       |
| ------------------------- | ------------------------------------- | ---------------------------------- |
| **是否支持运行时修改**    | ❌ 需要重启                            | ✅ 运行时可切换                     |
| **是否需要 /system 权限** | ✅ 需要                                | ❌ 不需要                           |
| **适用场景**              | ROM 级别修改（如 SystemUI、Settings） | 运行时修改（如深色模式、主题切换） |
| **生效方式**              | 编译时决定                            | 运行时决定                         |

## 总结

1. **静态 Overlay** 适合 **修改 SystemUI、Settings 等系统级资源**，需要 **AOSP 编译支持**。
2. **动态 Overlay** 适合 **运行时切换主题/样式**，无需重启，直接 `cmd overlay` 控制。
3. **厂商 ROM 适配** 通常结合 **静态 Overlay**（用于 ROM 定制）+ **动态 Overlay**（用于个性化切换）。
4. **OverlayManager API** 可以在代码中 **动态切换 Overlay**，实现 UI 适配方案。
