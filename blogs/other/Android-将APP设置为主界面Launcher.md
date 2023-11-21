---
title: Android 将APP设置为主界面Launcher
date: 2023-02-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

1、给APP设置HOME属性
--------------------------------------------------------------------------

将自己开发的APP设置为主界面Launcher，需要添加如下属性：

```xml
<category android:name="android.intent.category.HOME" />
```

```xml
<application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
                <category android:name="android.intent.category.HOME" />
            </intent-filter>
        </activity>
```

2、给APP设置system属性
----------------------------------------------------------------------------

设置app system的属性：

```xml
android:sharedUserId="android.uid.system"
```

3、给APP签名
--------------------------------------------------------------------

为了设置system属性，就需要对app进行签名：  
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/357f8c8a3f394329b9081fcd8b07d42c.png)  

编译app并安装到开发板，重新启动开发板，在进入桌面的阶段，会让我们选择要启动的Launcher：默认的Launcher3和我们添加的Launcher。

## 4、内置APK

**这里以HiTvLauncher为例，然后将需要内置apk放入到其中，并写好配置文件**

```xml
LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE_TAGS := optional

src_dirs :=app/src/main/java/
LOCAL_SRC_FILES := $(call all-java-files-under, $(src_dirs))

source_dir:=app/src/main/
LOCAL_RESOURCE_DIR := $(LOCAL_PATH)/$(source_dir)/res
LOCAL_FULL_MANIFEST_FILE := $(LOCAL_PATH)/$(source_dir)/AndroidManifest.xml

$(warning $(SUPPORT_OVERSEAAPP))
LOCAL_PRIVATE_PLATFORM_APIS := true

LOCAL_PACKAGE_NAME := HiTvLauncher

LOCAL_JAVA_LIBRARIES := HitvManager HitvShare HiDtvShare

LOCAL_USES_LIBRARIES := HitvManager HiDtvShare HitvShare

LOCAL_CERTIFICATE := platform
LOCAL_JNI_SHARED_LIBRARIES := libhitvclient

LOCAL_PRIVATE_PLATFORM_APIS := true

LOCAL_OVERRIDES_PACKAGES := platform

LOCAL_PROGUARD_ENABLED := disabled
LOCAL_OVERRIDES_PACKAGES := Home Launcher3 Launcher3QuickStep

LOCAL_MULTILIB := 32

include $(BUILD_PACKAGE)
```

以智象luncher为例

```
LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)
LOCAL_MODULE := Whale_RCA

LOCAL_REQUIRED_MODULES := \
    LAUNCHER_WHALE \
    Store_RCA_Whale \

include $(BUILD_PHONY_PACKAGE)

include $(CLEAR_VARS)
LOCAL_MODULE_TAGS := optional

LOCAL_MODULE := LAUNCHER_WHALE
LOCAL_BUILT_MODULE_STEM := LAUNCHER_WHALE.apk
LOCAL_SRC_FILES := LAUNCHER_WHALE.apk
LOCAL_MODULE_CLASS := APPS
LOCAL_MODULE_SUFFIX := $(COMMON_ANDROID_PACKAGE_SUFFIX)
LOCAL_REQUIRED_MODULES += whiteList.conf
LOCAL_CERTIFICATE := platform
LOCAL_OVERRIDES_PACKAGES := Home Launcher3
include $(BUILD_PREBUILT)

include $(CLEAR_VARS)
LOCAL_MODULE_TAGS := optional

LOCAL_MODULE := Store_RCA_Whale
LOCAL_BUILT_MODULE_STEM := Store_RCA_Whale.apk
LOCAL_SRC_FILES := Store_RCA_Whale.apk
LOCAL_MODULE_CLASS := APPS

LOCAL_MODULE_SUFFIX := $(COMMON_ANDROID_PACKAGE_SUFFIX)
LOCAL_CERTIFICATE := platform
include $(BUILD_PREBUILT)

include $(call all-makefiles-under, $(LOCAL_PATH))
```

5、去掉原有的Launcher3
----------------------------------------------------------------------------

Android10.0默认的主界面程序是谷歌开发的Launcher3，现在有了关闭主界面程序的需求。我们的思路比较简单：去掉Launcher3编译生成的apk。  
禁掉Launcher3源码的编译，在源码中去掉Launcher3的编译文件：

```
mv packages/apps/Launcher3/Android.mk packages/apps/Launcher3/Android.mk.txt
mv packages/apps/Launcher3/SecondaryDisplayLauncher/Android.mk packages/apps/Launcher3/SecondaryDisplayLauncher/Android.mk.txt
```

删除Launcher3的历史编译结果：

```
find ./out/ -name "Launcher3*" | xargs rm -rf
```

重新编译测试，Launcher3主界面程序已经不再启动。

 

  

本文转自 [https://blog.csdn.net/scottmvp/article/details/123394929](https://blog.csdn.net/scottmvp/article/details/123394929)，如有侵权，请联系删除。