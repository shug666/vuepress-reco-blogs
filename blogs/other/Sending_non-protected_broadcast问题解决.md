---
title: Sending non-protected broadcast 问题解决
date: 2024-06-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 一、问题出现的现象

发广播时，控制台报以下错误：  

2023-09-07 16:18:23.603 2069-2501 ActivityManager system\_process E

```
Sending non-protected broadcast com.fs.widget.broadcast.DIALOG_SHOW from system 12015:com.fs.settings/1000 pkg com.fs.settings
             java.lang.Throwable
             at com.android.server.am.ActivityManagerService.checkBroadcastFromSystem(ActivityManagerService.java:21659)
             at com.android.server.am.ActivityManagerService.broadcastIntentLocked(ActivityManagerService.java:22269)
             at com.android.server.am.ActivityManagerService.broadcastIntent(ActivityManagerService.java:22411)
             at android.app.IActivityManager$Stub.onTransact$broadcastIntent$(IActivityManager.java:10171)
             at android.app.IActivityManager$Stub.onTransact(IActivityManager.java:167)
             at com.android.server.am.ActivityManagerService.onTransact(ActivityManagerService.java:3368)
             at android.os.Binder.execTransact(Binder.java:749)

```

发出的广播可以被目标正常接收，功能正常运行。只是会报上面的 ERROR 级别的错误。

## 二、原因

基于android 12  

源码路径：frameworks/base/services/core/java/com/android/server/am/ActivityManagerService.java

```java
 private void checkBroadcastFromSystem(Intent intent, ProcessRecord callerApp,
            String callerPackage, int callingUid, boolean isProtectedBroadcast, List receivers) {
        if ((intent.getFlags() & Intent.FLAG_RECEIVER_FROM_SHELL) != 0) {
            // Don't yell about broadcasts sent via shell
            return;
        }

        final String action = intent.getAction();
        if (isProtectedBroadcast
                || Intent.ACTION_CLOSE_SYSTEM_DIALOGS.equals(action)
                || Intent.ACTION_DISMISS_KEYBOARD_SHORTCUTS.equals(action)
                || Intent.ACTION_MEDIA_BUTTON.equals(action)
                || Intent.ACTION_MEDIA_SCANNER_SCAN_FILE.equals(action)
                || Intent.ACTION_SHOW_KEYBOARD_SHORTCUTS.equals(action)
                || Intent.ACTION_MASTER_CLEAR.equals(action)
                || Intent.ACTION_FACTORY_RESET.equals(action)
                || AppWidgetManager.ACTION_APPWIDGET_CONFIGURE.equals(action)
                || AppWidgetManager.ACTION_APPWIDGET_UPDATE.equals(action)
                || TelephonyManager.ACTION_REQUEST_OMADM_CONFIGURATION_UPDATE.equals(action)
                || SuggestionSpan.ACTION_SUGGESTION_PICKED.equals(action)
                || AudioEffect.ACTION_OPEN_AUDIO_EFFECT_CONTROL_SESSION.equals(action)
                || AudioEffect.ACTION_CLOSE_AUDIO_EFFECT_CONTROL_SESSION.equals(action)) {
            // Broadcast is either protected, or it's a public action that
            // we've relaxed, so it's fine for system internals to send.
            return;
        }

        // This broadcast may be a problem...  but there are often system components that
        // want to send an internal broadcast to themselves, which is annoying to have to
        // explicitly list each action as a protected broadcast, so we will check for that
        // one safe case and allow it: an explicit broadcast, only being received by something
        // that has protected itself.
        if (intent.getPackage() != null || intent.getComponent() != null) {
            if (receivers == null || receivers.size() == 0) {
                // Intent is explicit and there's no receivers.
                // This happens, e.g. , when a system component sends a broadcast to
                // its own runtime receiver, and there's no manifest receivers for it,
                // because this method is called twice for each broadcast,
                // for runtime receivers and manifest receivers and the later check would find
                // no receivers.
                return;
            }
            boolean allProtected = true;
            for (int i = receivers.size()-1; i >= 0; i--) {
                Object target = receivers.get(i);
                if (target instanceof ResolveInfo) {
                    ResolveInfo ri = (ResolveInfo)target;
                    if (ri.activityInfo.exported && ri.activityInfo.permission == null) {
                        allProtected = false;
                        break;
                    }
                } else {
                    BroadcastFilter bf = (BroadcastFilter)target;
                    if (bf.requiredPermission == null) {
                        allProtected = false;
                        break;
                    }
                }
            }
            if (allProtected) {
                // All safe!
                return;
            }
        }

        // The vast majority of broadcasts sent from system internals
        // should be protected to avoid security holes, so yell loudly
        // to ensure we examine these cases.
        if (callerApp != null) {
            Log.wtf(TAG, "Sending non-protected broadcast " + action
                            + " from system " + callerApp.toShortString() + " pkg " + callerPackage,
                    new Throwable());
        } else {
            Log.wtf(TAG, "Sending non-protected broadcast " + action
                            + " from system uid " + UserHandle.formatUid(callingUid)
                            + " pkg " + callerPackage,
                    new Throwable());
        }
    }

```

## 三、代码分析

这个方法的目的是检查系统应用发出的广播是否有问题。

1.  如果是从 shell 发出的广播，检查通过。
2.  如果是 isProtectedBroadcast 或是 以下列表中的固定 action，检查通过。

> || Intent.ACTION\_CLOSE\_SYSTEM\_DIALOGS.equals(action)  
> || Intent.ACTION\_DISMISS\_KEYBOARD\_SHORTCUTS.equals(action)  
> || Intent.ACTION\_MEDIA\_BUTTON.equals(action)  
> || Intent.ACTION\_MEDIA\_SCANNER\_SCAN\_FILE.equals(action)  
> || Intent.ACTION\_SHOW\_KEYBOARD\_SHORTCUTS.equals(action)  
> || Intent.ACTION\_MASTER\_CLEAR.equals(action)  
> || Intent.ACTION\_FACTORY\_RESET.equals(action)  
> || AppWidgetManager.ACTION\_APPWIDGET\_CONFIGURE.equals(action)  
> || AppWidgetManager.ACTION\_APPWIDGET\_UPDATE.equals(action)  
> || TelephonyManager.ACTION\_REQUEST\_OMADM\_CONFIGURATION\_UPDATE.equals(action)  
> || SuggestionSpan.ACTION\_SUGGESTION\_PICKED.equals(action)  
> || AudioEffect.ACTION\_OPEN\_AUDIO\_EFFECT\_CONTROL\_SESSION.equals(action)  
> || AudioEffect.ACTION\_CLOSE\_AUDIO\_EFFECT\_CONTROL\_SESSION.equals(action)

3.  如果 Intent 指定了 Package 或 Component 时，若 action的目标（如receiver）是 exported的 且设置了权限，检查通过。
4.  如果目标是 BroadcastFilter 且设置了权限，检查通过。
5.  以上四条都不满足，则在日志系统中，打印出 Throwable 信息。

## 四、解决方法

### 4.1 针对 代码分析的第二条“如果是 isProtectedBroadcast 或是 以下列表中的固定 action，检查通过。”

很简单，让 `isProtectedBroadcast == true` 就ok了，需要修改 android 源码，文件路径为：

> frameworks/base/core/res/AndroidManifest.xml

```java
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="android" coreApp="true" android:sharedUserId="android.uid.system"
    android:sharedUserLabel="@string/android_system_label">
    <!-- ================================================ -->
    <!-- Special broadcasts that only the system can send -->
    <!-- ================================================ -->
    <protected-broadcast android:name="android.intent.action.SCREEN_OFF" />
    <protected-broadcast android:name="android.intent.action.SCREEN_ON" />
    <protected-broadcast android:name="android.intent.action.USER_PRESENT" />
    <protected-broadcast android:name="android.intent.action.TIME_SET" />
    <protected-broadcast android:name="android.intent.action.TIME_TICK" />
    <protected-broadcast android:name="android.intent.action.TIMEZONE_CHANGED" />
    <protected-broadcast android:name="android.intent.action.DATE_CHANGED" />
    <protected-broadcast android:name="android.intent.action.PRE_BOOT_COMPLETED" />
    <protected-broadcast android:name="android.intent.action.BOOT_COMPLETED" />
    <protected-broadcast android:name="android.intent.action.PACKAGE_INSTALL" />
    <protected-broadcast android:name="android.intent.action.PACKAGE_ADDED" />
    <protected-broadcast android:name="android.intent.action.PACKAGE_REPLACED" />
    <protected-broadcast android:name="android.intent.action.MY_PACKAGE_REPLACED" />
	......
```

依照内容，添加自己的 action ，重新编译系统，新rom上就可以正常发送，不报异常了。

### 4.2 针对 代码分析的第三条“如果 Intent 指定了 Package 或 Component 时，若 action的目标（如receiver）是 exported的 且设置了权限，检查通过。”

#### 4.2.1 Action的接收方：

定义权限：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    android:sharedUserId="android.uid.system">
	<permission android:name = "com.android.permission.MY_PERMISSION"/>
```

使用权限：(注意 exported 与 permission 必须都设置)

```xml
<receiver android:name=".receiver.ShowSettingDialogReceiver"
            android:exported="true"
            android:permission="com.android.permission.MY_PERMISSION">
```

#### 4.2.2 Action的发送方：

```java
import android.content.Intent;
Intent showSettingDialogIntent = new Intent();
showSettingDialogIntent.setAction(Component.ACTION_BLUETOOTH_DIALOG_SHOW);
showSettingDialogIntent.setPackage(Component.PACKAGE_SETTINGS);
sendBroadcast(showSettingDialogIntent, "com.android.permission.MY_PERMISSION");
```

  

本文转自 [https://blog.csdn.net/brillian\_green/article/details/132740699](https://blog.csdn.net/brillian_green/article/details/132740699)，如有侵权，请联系删除。