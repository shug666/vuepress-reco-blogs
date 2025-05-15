---
title: ProtoLog动态打开
date: 2025-02-24
tags:
 - android
categories: 
 - android
sticky: 
   true
---

1\. ProtoLog如何动态打开
--------------------------------------------------------------------------------------------

类似源码里面的 `ProtoLog.v`，在`userdebug`版本可以动态打开

```java
ProtoLog.v(WM_DEBUG_ORIENTATION, "Orientation continue waiting for draw in %s", w);
```

具体可以参考`frameworks/base/tools/protologtool/README.md`  
如类似下面的`ProtoLog`

```java
ProtoLog.x(ProtoLogGroup.GROUP_NAME, "Format string %d %s", value1, value2);
```

将会给`ProtoLogTool`转换成

```java
if (ProtoLogImpl.isEnabled(GROUP_NAME)) {
int protoLogParam0 = value1;
String protoLogParam1 = String.valueOf(value2);
ProtoLogImpl.x(ProtoLogGroup.GROUP_NAME, 123456, 0b0100, "Format string %d %s or null", protoLogParam0, protoLogParam1);
}
```

ps:  它有两种log形式：  

**第一种写入到db中**  

举例  

`adb shell`  

`$ cmd window logging enable WM_DEBUG_ORIENTATION`  

`$ cmd window logging start`  

开始log的输出  

`=>Start logging to /data/misc/wmtrace/wm_log.pb.`  

`$ cmd window logging stop`  

停止log的输出  

`Stop logging to /data/misc/wmtrace/wm_log.pb. Waiting for log to flush. Log written to /data/misc/wmtrace/wm_log.pb.`  

**第二种输出到logcat**  

举例：  

这个是直接保存在logcat中  

`$ cmd window logging enable-text WM_DEBUG_ORIENTATION`  

使用logcat就可以直接看得到日志输出  

`$ adb logcat -b all | egrep -i Orientation`

### 重要的窗口相关打印

```shell
adb shell wm logging enable-text WM_DEBUG_RECENTS_ANIMATIONS WM_DEBUG_ADD_REMOVE WM_DEBUG_APP_TRANSITIONS WM_SHOW_TRANSACTIONS WM_DEBUG_STATES WM_DEBUG_RESIZE WM_DEBUG_WINDOW_ORGANIZER WM_DEBUG_SYNC_ENGINE WM_DEBUG_WINDOW_TRANSITIONS WM_DEBUG_CONFIGURATION WM_DEBUG_ORIENTATION WM_DEBUG_SCREEN_ON WM_DEBUG_IME WM_DEBUG_STARTING_WINDOW WM_ERROR WM_DEBUG_WALLPAPER WM_DEBUG_TASKS WM_DEBUG_WINDOW_INSETS WM_DEBUG_ANIM WM_DEBUG_DRAW WM_DEBUG_WINDOW_TRANSITIONS_MIN
```

### wmshell

**wmshell的log比较特殊，其在SystemUI进程**，如果我们直接运行`adb shell wm logging enable-text WM_SHELL_TASK_ORG`会报错，打印如下：

```shell
Loaded 749 log definitions from /system/etc/protolog.conf.json.gz
No IProtoLogGroup named WM_SHELL_TASK_ORG
Not handled, please use `adb shell dumpsys activity service SystemUIService WMShell` if you are looking for ProtoLog in WMShell
```

根据提示我们打开log  

`adb shell dumpsys activity service SystemUIService WMShell protolog enable WM_SHELL_TASK_ORG`

## 2. ams wms等日志的动态打开

------------------------------------------------------------------------------

默认源码不支持这类动态日志，需要我们自己加入代码

用反射拿到带`DEBUG_`的一些调试变量

```java
Field[] fields_am = ActivityManagerDebugConfig.class.getDeclaredFields();
Field[] fields_atm = ActivityTaskManagerDebugConfig.class.getDeclaredFields();
Field[] fields_thread = ActivityThread.class.getDeclaredFields();

Field[] fields = WindowManagerDebugConfig.class.getDeclaredFields();
Field[] fieldsPolicy = PhoneWindowManager.class.getDeclaredFields();
```

找到`DEBUG_`相关的变量，类似于`ActivityThread.DEBUG_BROADCAST`、`ActivityManagerDebugConfig.DEBUG_BROADCAST`，并将其默认值记录下来，此处是先放入`debugValue`

```java
int bitLocation = 0;
long debugValue = 0;

for (int i = 0; i < fields_thread.length; ++i) {
    fieldName = fields_thread[i].getName();
    if (fieldName == null) continue;
    if (fieldName.startsWith("DEBUG_") || fieldName.equals("localLOGV")) {
        try {
            fields_thread[i].setAccessible(true);
            if (fields_thread[i].getBoolean(null)) {
                debugValue = (debugValue | (1 << bitLocation));//取得原来每个调试变量DEBUG_原有值，注意long数组溢出，一般都是够的
            }
            bitLocation++;
        } catch (IllegalAccessException  e) {
            pw.println("enableAmsLog exception4:" + e);
        }
    }
}
```

调用触发，可以参考原生的 `adb shell dumpsys activity p`  

自己设置一个 `adb shell dumpsys debuglog amslog enable DEBUG_BROADCAST`进行参数识别，由于除了系统进程，部分还和app进程相关，保存设置到自定义的系统属性里面`persist.sys.debug.ams.log`

```java
for (int i = 0; i < fields_thread.length; ++i) {
    fieldName = fields_thread[i].getName();
    if (fieldName == null) continue;
    try {
        if (fieldName.startsWith("DEBUG_") || fieldName.equals("localLOGV")) {

            if (setAll || fieldName.equals(cmd)) {//cmd就是DEBUG_ABC，或者all(匹配all后设置setAll = true)
                isChange = true;
                fields_thread[i].setAccessible(true);
                fields_thread[i].setBoolean(null, isEnable);//如果传进来的参数是enable，则isEnable = true; disable，则isEnable = false
                if (isEnable) {
                    debugValue = (debugValue | (1 << bitLocation));//根据设定值改变原有调试开关
                } else {
                    debugValue = (debugValue & (~(1 << bitLocation)));
                }
                pw.println(String.format("  ActivityThread.%s = %b", fieldName, fields_thread[i].getBoolean(null)));
                if (!setAll) {
                    break;
                }
            }
            bitLocation++;
        }
    } catch (IllegalAccessException  e) {
        pw.println("enable exception:" + e);
    }
}

//将debug开关用系统属性保存起来
String debugHexValue = "0x" + Long.toHexString(debugValue);
SystemProperties.set("persist.sys.debug.ams.log", debugHexValue);
```

遍历`mLruProcesses`分发到`android`的每个进程里面去

```java
//参考伪代码
for (int i = mLruProcesses.size() - 1; i >= 0; i--) {
    ProcessRecord r = mLruProcesses.get(i);
    if (r != null && r.thread != null) {
        r.thread.updateDebugLog(key);
    }
}

//frameworks/base/core/java/android/app/ActivityThread.java
public final void updateDebugLog(int func) {
    DebugLogManager.updateDebugLog(func);
}

//新建一个DebugLogManager
public static void updateDebugLog(int func) {
    try {
        String fieldName = "";
        Field[] fields = null;
        int bitLocation = 0;
        long setDebugValue = -1;

        switch (func) {
            case FUNC_ACTIVITY_LOG:
                setDebugValue = SystemProperties.getLong("persist.sys.debug.ams.log", -1);//将上面设置的debugValue取出来

                if (setDebugValue >= 0) {
                    fields = ActivityThread.class.getDeclaredFields();
                    bitLocation = 0;
                    for (int i = 0; i < fields.length; ++i) {
                        fieldName = fields[i].getName();
                        if (fieldName == null) continue;//按照原有顺序一个个设置进去
                        if (fieldName.startsWith("DEBUG_") || fieldName.equals("localLOGV")) {
                            fields[i].setAccessible(true);
                            if ((setDebugValue & (1 << bitLocation)) == 0) {
                                fields[i].setBoolean(null, false);
                            } else {
                                fields[i].setBoolean(null, true);
                            }
                            bitLocation++;
                        }
                    }
                }
                break;
```

类似于`ActivityThread.DEBUG_BROADCAST`、`ActivityManagerDebugConfig.DEBUG_BROADCAST`的动态设置将不是问题

 

  

本文转自 [https://blog.csdn.net/yun\_hen/article/details/119895320](https://blog.csdn.net/yun_hen/article/details/119895320)，如有侵权，请联系删除。