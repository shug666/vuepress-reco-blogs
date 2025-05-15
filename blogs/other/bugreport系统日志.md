---
title: bugreport系统日志
date: 2025-03-03
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 1. 获取 bugreport  

在 Android 设备 上，使用 ADB 获取 bugreport：

```shell
$ adb bugreport > bugreport.zip
```

或者：

```shell
$ adb shell bugreport > bugreport.txt
```

如果是在开发者模式中抓取的Bugreport日志，可以通过下面的命令获取日志文件

```shell
$ adb pull /data/user_de/0/com.android.shell/files/bugreports/
```

如果是 Android 7.0 以上，会生成 bugreport.zip，解压后包含：  

-  bugreport.txt（完整日志）  

- FS（文件系统信息）  
- TOMBSTONES（崩溃信息）  
- ANR（应用无响应日志）

## 2. main.log（主日志）  

main.log 主要记录：系统组件 & 应用的运行状态，包含：

- 应用启动 / 退出  
- Service 启动 / 绑定 / 解绑  
- Activity 生命周期（onCreate、onResume、onDestroy）  
- 重要的系统信息 & 错误日志  

🔍 关键搜索词：

```shell
am_proc_start  # 进程启动
am_proc_died   # 进程结束
am_activity_launch_time  # Activity 启动耗时
am_crash   # APP 崩溃
am_anr   # APP ANR
```

🔍 示例：

```shell
02-05 12:45:21.123  1000  1850  1982 I am_proc_start: [0,18982,10034,com.android.settings,activity]
```

解析： com.android.settings 进程（PID=18982）启动成功。

## 3. event.log（系统事件日志）  

event.log 主要记录：系统关键事件，例如：

- 应用前后台切换  
- 屏幕解锁 / 休眠  
- WMS（窗口管理）事件  

🔍 关键搜索词：

```shell
wm_xxx #对应的代码可以通过grep抓取writeWmxxx 找出是在哪里打印的该events log
wm_task_moved  # Activity 切换
screen_toggled  # 屏幕开关
```

🔍 示例：

```shell
02-05 13:05:33.123  1000  1850  1982 I screen_toggled: 1
```

📌 解析： screen\_toggled: 1 表示 屏幕被点亮，0 表示 息屏。



🔍 示例：应用走到onresume生命周期的log  

`wm_on_resume_called: [223605563,com.tencent.mm.ui.LauncherUI,RESUME_ACTIVITY,10]`

```java
EventLogTags.writeWmOnResumeCalled(mIdent, getComponentName().getClassName(), reason);
```

🔍 示例：通知cancel的log  

`notification_canceled: [0|com.tencent.mm|40|null|10218,8,19980,19980,7720,-1,-1,NULL]`

```java
EventLogTags.writeNotificationCanceled(canceledKey, reason,
                r.getLifespanMs(now), r.getFreshnessMs(now), r.getExposureMs(now),
                rank, count, listenerName);
```

## 4. ANR（Application Not Responding）  

ANR（应用无响应） 发生在：

- 主线程阻塞（耗时任务没放到子线程）  
- 输入事件（InputDispatch）超时  
- ervice 绑定 / 解绑超时  

🔍 关键搜索词：

```shell
am_anr  # 查找所有 ANR 事件
```

🔍 示例：

```shell
02-05 14:12:45.987  1000  1850  1982 I am_anr: [12345,com.example.app,InputDispatching Timeout]
```

📌 解析：  

12345 = 进程 ID  

com.example.app = 发生 ANR 的应用  

InputDispatching Timeout = 由于 主线程卡住 导致 ANR  

### 如何分析 ANR ？ 

1. 搜索 “ANR in” 找到完整 ANR 堆栈日志  
2. 查看 “main.log” 是否有 “InputDispatch Timeout”  
3. 检查 “event.log” 看看屏幕操作记录

## 5. Crash（应用崩溃）  

Crash（崩溃） 主要由于： 

空指针异常（NullPointerException）  

数组越界（ArrayIndexOutOfBoundsException）  

ANR 之后的强制杀进程  

🔍 关键搜索词：

```shell
am_crash   # APP 崩溃
FATAL EXCEPTION  # 关键错误
```

🔍 示例：

```shell
02-05 14:39:55.321  1000  1850  1982 I am_crash: [12345,1000,com.example.app,java.lang.NullPointerException,"Attempt to invoke virtual method 'java.lang.String'"]
```

📌 解析：  

12345 = 进程 ID  

com.example.app = 崩溃的应用  

NullPointerException = 空指针异常

## 6. 如何快速定位问题？  

快速分析思路：

### 应用崩溃（Crash）  

搜 am\_crash 找到崩溃日志  

查看 FATAL EXCEPTION 详细堆栈  

### 应用卡死（ANR）  

搜 am\_anr 找到 ANR 发生时间  

搜 InputDispatching Timeout 确认是否是主线程卡住  

### 应用启动慢  

搜 am\_proc\_start 找到进程启动时间  

搜 am\_activity\_launch\_time 查看 Activity 启动耗时  

### 系统 BUG / 设备异常  

搜 system\_server crash 找到 SystemServer 崩溃  

搜 tombstone 查找 native 崩溃（C++ 代码问题）

### Activity

Activity 是一种应用组件，一个 Activity 是用户可以执行的一项明确具体的操作。Activity 通过 ActivityManager 运行进程，因此找出指定 Activity 的所有进程停止和启动事件也有助于进行问题排查。

- 查看处于聚焦状态的 `Activity grep "am_focused_activity" bugreport-2015-10-01-18-13-48.txt`
- 查看进程启动事件 `grep "Start proc" bugreport-2015-10-01-18-13-48.txt`
- 确定设备是否发生系统颠簸，请检查在 `am_proc_died` 和 `am_proc_start` 前后的短时间内是否出现活动异常增加 `grep -e "am_proc_died" -e "am_proc_start" bugreport-2015-10-01-18-13-48.txt`

### 内存

查看历史指标

am_low_memory 条目表示最后一个缓存的进程已终止。在此之后，系统开始终止各项服务 `grep "am_low_memory" bugreport-2015-10-01-18-13-48.txt`
查看系统颠簸指标

关于系统颠簸（分页、直接回收等）的其他指标包括 kswapd、kworker 和 mmcqd 消耗的 CPU 周期。（请注意，收集错误报告可能会影响系统颠簸指标。）
广播

### 查看历史广播

历史广播是指已发送的广播，按时间逆序排列。

summary（摘要）部分用于提供最近 300 个前台广播和最近 300 个后台广播的概况。

`grep summary bugreport.txt`

detail（详情）部分包含最近 50 条前台广播和最近 50 条后台广播的完整信息，以及每个广播的接收方。其中：

具有 BroadcastRecord 条目的接收方是在运行时注册的，并且只会被发送到已在运行的进程。

具有 ResolveInfo 条目的接收方是通过清单条目注册的。ActivityManager 会为每个 ResolveInfo 启动相应进程（如果相应进程尚未在运行）。

`grep detail bugreport.txt`

## 7. 窗口添加堆栈

还有添加 ViewRootImpl：过滤，可以查看窗口添加相关的日志

可以在setView处，添加堆栈

`Slog.d(TAG, "setView: title = " + attrs.getTitle, new Exception());`

```java
02-28 12:04:07.902  1927  1927 D ViewRootImpl: setView: title=StatusBar mWindowAttributes.wallpaper=0 attrs.wallpaper=0
02-28 12:04:07.902  1927  1927 D ViewRootImpl: java.lang.Exception
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at android.view.ViewRootImpl.setView(ViewRootImpl.java:1373)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at android.view.WindowManagerGlobal.addView(WindowManagerGlobal.java:524)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at android.view.WindowManagerImpl.addView(WindowManagerImpl.java:188)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.systemui.statusbar.window.StatusBarWindowController.attach(StatusBarWindowController.java:156)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.systemui.statusbar.phone.CentralSurfacesImpl.createAndAddWindows(CentralSurfacesImpl.java:2524)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.systemui.statusbar.phone.CentralSurfacesImpl.start(CentralSurfacesImpl.java:1160)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.systemui.SystemUIApplication.startStartable(SystemUIApplication.java:386)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.systemui.SystemUIApplication.startStartable(SystemUIApplication.java:377)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.systemui.SystemUIApplication.lambda$startServicesIfNeeded$0$com-android-systemui-SystemUIApplication(SystemUIApplication.java:297)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.systemui.SystemUIApplication$$ExternalSyntheticLambda1.run(Unknown Source:8)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.systemui.SystemUIApplication.timeInitialization(SystemUIApplication.java:339)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.systemui.SystemUIApplication.startServicesIfNeeded(SystemUIApplication.java:295)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.systemui.SystemUIApplication.startServicesIfNeeded(SystemUIApplication.java:244)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.systemui.SystemUIService.onCreate(SystemUIService.java:70)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at android.app.ActivityThread.handleCreateService(ActivityThread.java:5054)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at android.app.ActivityThread.-$$Nest$mhandleCreateService(Unknown Source:0)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at android.app.ActivityThread$H.handleMessage(ActivityThread.java:2425)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at android.os.Handler.dispatchMessage(Handler.java:117)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at android.os.Looper.loopOnce(Looper.java:206)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at android.os.Looper.loop(Looper.java:295)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at android.app.ActivityThread.main(ActivityThread.java:8767)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at java.lang.reflect.Method.invoke(Native Method)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:577)
02-28 12:04:07.902  1927  1927 D ViewRootImpl: 	at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1053)
​​​
```

   

本文转自 [https://blog.csdn.net/wzkacyw/article/details/145550286](https://blog.csdn.net/wzkacyw/article/details/145550286)，如有侵权，请联系删除。