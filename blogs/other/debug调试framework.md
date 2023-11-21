---
title: Android开发 debug调试framework
date: 2023-02-14
tags:
 - android
categories: 
 - android
sticky: 
   true
---



　　Android系统开发有一个很麻烦的点就是想看代码调用情况的时候每次打log都要编译系统或者单编模块，费时费力特别影响效率。偶然间发现了framework也可以debug调试，所以写这篇博客记录一下。

需要注意的事项
-------

*   　**特别注意!**  debug调试的framework的代码是需要与当前系统的framework代码一致，否则会出现设置断点后置灰的问题。不要随便按Android Studio整理代码的快捷键，比如清理无效引用这种快捷功能，否则会导致行数不对，无法debug。
*   　**特别注意!** 不要在Android Studio上直接将framework拷贝进项目。因为Android Studio会改动文件的包路径，所以最好在文件夹里直接操作拷贝黏贴。
*       **特别注意！**区分好framework代码一些类的运行的进程，比如ViewRootImpl其实运行在应用进程的，并不在system\_process(系统进程)中运行。
*   　千万不要在方法上断点，否则会非常卡，这点Android studio也会提示你。尽量在方法里的变量中断点

导入Debug流程
---------

### 第一步

首先随便创建一个app工程，然后将framework代码全部放入到目录下：

![](https://raw.githubusercontent.com/shug666/image/main/images/1497956-20220822194606063-1265606513.png)

 你会发现代码都会报错，报错是正常的，什么都不需要修改，特别是不要修改类的路径。因为这些路径其实都是对应着系统中真正framework里的路径。

### 第二步

执行 adb root 命令，获得root权限

### 第三步

点击debug图标

 勾选show all processes，这样你才能看到全部应用进程包括系统进程。 然后点击system\_process，点击ok。

### 第四步 

验证debug调试，在ActivityStarter中的startActivity方法里添加断点(因为Activity创建的第一个方法就是这里调用的)。然后启动一个App

![](https://img2022.cnblogs.com/blog/1497956/202208/1497956-20220822200238829-646039895.png)

 断点成功
