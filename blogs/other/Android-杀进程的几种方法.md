---
title: Android 杀进程的几种方法
date: 2023-07-13
tags:
 - android
categories: 
 - android
sticky: 
   true
---

##  一，System.exit(0):

jdk提供的标准的应用终止函数。它会直接终止虚拟机的运行。参数如果非0，则说明是非正常退出。  


```java
System.exit(0);
```

##  二，Runtime.getRuntime().exit(0)：

和System.exit(0)一样，事实上，System.exit(0)的实现就是通过调用Runtime.getRuntime().exit(0)来完成的。  


```java
Runtime.getRuntime().exit(0);
```

## 三，Process.killProcess(pid)：

标准的杀进程的方式，底层调用的是Linux的kill函数，所以，会发出SIGKILL信号。  
例如，结束当前进程，可以用如下代码：

```java
Process.killProcess(Process.myPid());
```

## 四，ActivityManager.forceStopPackage(packageName):

    Android系统提供的方法，功能是强行停止app。执行后，会移除activity，应用不会重新启动；

   需要注意的是，要在AndroidManifest清单文件中进行权限的申请。

```java
ActivityManager am = (ActivityManager)mContext.getSystemService(Context.ACTIVITY_SERVICE);
am.forceStopPackage(packageName);

//需要注意的是，要在AndroidManifest清单文件中进行权限的申请：
<uses-permission android:name="android.permission.FORCE_STOP_PACKAGES"/>
```

## 五，ActivityManager.killBackgroundProcesses():

Android系统提供的方法，杀死后台进程。

```java
ActivityManager activityManager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
activityManager.killBackgroundProcesses(包名);

//需要申请权限
<uses-permission android:name="android.permission.KILL_BACKGROUND_PROCESSES"/>
```

* * *

进程被kill，一切化为无有。

  

本文转自 [https://blog.csdn.net/liranke/article/details/13772253](https://blog.csdn.net/liranke/article/details/13772253)，如有侵权，请联系删除。