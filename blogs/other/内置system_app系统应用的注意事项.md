---
title: 内置system_app系统应用的注意事项
date: 2023-11-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 1 app需要拥有系统签名

如下Android.bp文件中需要配置 certificate: “platform”，表示平台签名。

```bash
android_app {
    name: "Settings",
    defaults: ["platform_app_defaults"],
    platform_apis: true,
    certificate: "platform",
```

## 2 配置android:sharedUserId

app需要在AndroidManifest.xml中配置android:sharedUserId=“android.uid.system”

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.xindawn"
    android:versionCode="1"
    android:versionName="1.0"
    android:sharedUserId="android.uid.system">

    <protected-broadcast android:name="com.vt.dlna.PARAM_DEV_UPDATE" />
```

以上两步是否成功可以通过执行**`adb shell ps -AZ| grep “xxx”`** 查看，  

**untrusted\_app**表示三方app，无系统签名  

**system\_app**表示系统app，有系统签名+配置 android:sharedUserId=“android.uid.system”。  

**platform\_app**表示平台app，有系统签名。

```bash
u:r:untrusted_app_30:s0:c56,c+ u0_a56        1765   331 14482280 93484 0                   0 S com.android.calendar
u:r:system_app:s0              system        1464   331 14633576 120228 0                  0 S system:ui
u:r:platform_app:s0:c512,c768  u0_a14        2035   331 14604764 97872 0                   0 S com.android.statementservice
```

## 3 广播需要配置成保护广播

否则不能正常发送于接收。报错如下：

```java
07-06 08:18:42.633   527  1040 E ActivityManager: Sending non-protected broadcast com.xindawn.PARAM_DEV_UPDATE from system 2335:com.xindawn/1000 pkg com.xindawn
07-06 08:18:42.633   527  1040 E ActivityManager: java.lang.Throwable
07-06 08:18:42.633   527  1040 E ActivityManager: 	at com.android.server.am.ActivityManagerService.checkBroadcastFromSystem(ActivityManagerService.java:13561)
07-06 08:18:42.633   527  1040 E ActivityManager: 	at com.android.server.am.ActivityManagerService.broadcastIntentLocked(ActivityManagerService.java:14283)
07-06 08:18:42.633   527  1040 E ActivityManager: 	at com.android.server.am.ActivityManagerService.broadcastIntentLocked(ActivityManagerService.java:13579)
07-06 08:18:42.633   527  1040 E ActivityManager: 	at com.android.server.am.ActivityManagerService.broadcastIntentWithFeature(ActivityManagerService.java:14457)
07-06 08:18:42.633   527  1040 E ActivityManager: 	at android.app.IActivityManager$Stub.onTransact(IActivityManager.java:2296)
07-06 08:18:42.633   527  1040 E ActivityManager: 	at com.android.server.am.ActivityManagerService.onTransact(ActivityManagerService.java:2628)
07-06 08:18:42.633   527  1040 E ActivityManager: 	at android.os.Binder.execTransactInternal(Binder.java:1280)
07-06 08:18:42.633   527  1040 E ActivityManager: 	at android.os.Binder.execTransact(Binder.java:1244)
```

配置方法如下：

```bash
frameworks/base/core$ git diff
diff --git a/core/res/AndroidManifest.xml b/core/res/AndroidManifest.xml
+++ b/core/res/AndroidManifest.xml
@@ -817,6 +817,8 @@
     <protected-broadcast android:name="android.service.autofill.action.DELAYED_FILL" />
     <protected-broadcast android:name="android.app.action.PROVISIONING_COMPLETED" />
     <protected-broadcast android:name="android.app.action.LOST_MODE_LOCATION_UPDATE" />
+    
+    <protected-broadcast android:name="com.vt.dlna.PARAM_DEV_UPDATE" />
```

4.遇到selinxu avc权限问题，可以通过在debug版本**adb shell setenforce 0**，暂时关闭验证。如果正常则慢慢给system\_app添加权限解决。

 

  

本文转自 [https://blog.csdn.net/qq\_17525769/article/details/131580740](https://blog.csdn.net/qq_17525769/article/details/131580740)，如有侵权，请联系删除。