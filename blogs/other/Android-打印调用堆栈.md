---
title: Android 打印调用堆栈
date: 2023-07-20
tags:
 - android
categories: 
 - android
sticky: 
   true
---

内核&驱动层
-----------------------------------------------------------------

*   添加头文件：  
    
    ```c
    #include <linux/kprobes.h>  
    #include <asm/traps.h>
    ```
    
*   添加打印函数：  
    
    ```c
    printk("Stack trace Begin:\n");
    dump_stack();
    printk("Stack trace End:\n");
    ```

## C&C++&HAL层

Android-Hal-C++打印调用栈

debuggerd是android的一个daemon进程，负责在进程出错异常时，将进程的运行时信息给dump出来供分析。
debuggerd的core dump数据，被保存在 /data/tombstone/ 目录下，共可保存10个文件，当超过10个时，会覆盖最早生产的文件。
在debug时，一般情况下，当程序出现异常时会自动将core dump信息保存起来。

当需要手动调试自己的程序并需要主动打印调用栈时，可以使用Android的callstack库。使用步骤如下：

* 在`Android.bp`的`shared_libs`中增加如下选项

  ```sh
  "libutilscallstack",
  #"libutils",
  #"libcutils",
  ```

  如果是`Android.mk`则增加如下选项

  ```sh
  LOCAL_SHARED_LIBRARIES += libutilscallstack libcutils libutils 
  ```

  ### 1、创建一个.cpp文件

  dump\_stack.cpp

  ```c++
  #include <utils/CallStack.h>
  extern "C"
  {
      void dumping_callstack(void);
  }
  void dumping_callstack(void)
  {
      android::CallStack stack("[hao22]: start_output_stream");
  }
  
  /*
  void dumping_callstack() {
     android::CallStack stack; 
    //如果这里的函数在android命名空间内，则可以改为 CallStack stack;
    stack.update();
    //输出到printf
    stack.dump(1);
    //输出到logcat
    stack.log(TAG);//TAG为日志标签，字符串类型
    //可以设置第2、3个参数
    //stack.log("Dumping Stack",ANDROID_LOG_ERROR ,"123 ");
  }
  */
  ```

  ### 2、创建一个.h文件

  ```c++
  #ifndef DUMP_STACK_H
  #define DUMP_STACK_H
  void dumping_callstack(void);
  
  #endif
  ```

  ### 3、添加到Android.mk

  将dump_stack.cpp添加到Android.mk的源文件列表LOCAL_SRC_FILES中，并确保libcutils和libutilscallstack

  在LOCAL_SHARED_LIBRARIES列表中

  **注:P版本的callstack依赖库从libutils \改到libutilscallstack\中了**
  
  ### 4、将dump_stack.h头文件添加到目标.c文件中
  
  如，我想查看audio_hw.c中start_output_stream函数的堆栈调用信息，在audio_hw.c文件中加入
  
  ```c
  #include "dump_stack.h"
  ```
  
  然后在start_output_stream函数中添加
  
  ```c
  dumping_callstack();
  ```

Java
-------------------------------------------------------------------

* 添加打印函数  

  ```java
  import android.util.Log;
  
  // Log.d(TAG, Log.getStackTraceString(new Throwable()));//TAG为日志标签，字符串类型
  Log.d(TAG, "打印内容", new Throwable());//TAG为日志标签，字符串类型
  ```



https://blog.csdn.net/u012773843/article/details/113055574

本文转自 [https://blog.csdn.net/m0\_52481422/article/details/109807366](https://blog.csdn.net/m0_52481422/article/details/109807366)，如有侵权，请联系删除。