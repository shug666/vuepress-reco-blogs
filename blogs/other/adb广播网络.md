---
title: adb 查看广播、网络
date: 2022-08-25
tags:
 - adb
categories: 
 - android
sticky: 
   true
---

## 如何通过adb命令查看Android系统当前发送了什么广播

```
adb shell进入shell

dumpsys | grep BroadcastRecord

从上往下，上面是系统最新接收到的action。
---------------------------------
adb shell dumpsys | findstr BroadcastRecord
```

## 查看网络使用情况

```

adb shell ifconfig //查看配置信息

adb shell dumpsys connectivity  //查看连接情况

db shell netstat //查看连接状态和地址

adb shell ip ru //查看路由策略

```

## 参考链接

Android adb查看网络连接情况https://blog.csdn.net/wenzhi20102321/article/details/122161589
