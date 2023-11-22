---
title: user版本打开uart，让android log输出
date: 2023-07-04
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## user版本打开uart

### 1.开启使用串口(uart)

bootable/bootloader/lk/app/mt\_boot/mt\_boot.c

```sh
#ifdef USER_BUILD                
        sprintf(cmdline,"%s%s",cmdline," printk.disable_uart=1");
#else
        sprintf(cmdline,"%s%s",cmdline," printk.disable_uart=0 ddebug_query=\"file *mediatek* +p ; file *gpu* =_\"");
#endif
```

将上面的printk.disable\_uart=1改成printk.disable\_uart=0，然后重新编译lk, download lk 即可；或者直接download eng版本的lk。

### 2.开启Uart 的控制台(console/sh)  

system/core/rootdir/init.rc

```sh
service console /system/bin/sh
    class core
    console
    disabled
    user shell
    seclabel u:r:shell:s0

on property:ro.debuggable=1
    start console
```

注释掉on property:ro.debuggable=1，然后重新编译bootimage 即可。

如何在Uart 上抓取上层LOG  

1. Uart 上进行输入，实际就是开启了一个sh 对接起来，所以绝对不能在uart 上输入一个长命令(不可中断)，否则uart 将被卡住，不能再输入。  

2. 抓取上层log, 我们通常需要使用logcat, 但logcat 是不可中断的，将导致uart 不能再输入。  

3. 处理的方法即将logcat 转入后台执行，如下操作即可:

   ```sh
   Main log: logcat -v time &
   Radio log: logcat -v time -b radio &
   Event log: logcat -v time -b events &
   ```

   如果想关闭上层log, 直接ps 查阅前面开启的logcat process pid, 然后kill -9 pid 杀掉即可。  
   **注意一定要带“&”，否则将block 住uart输入**

## 让android log从串口kernel log输出

分析无法开机问题，如串口RX/TX连接正常，可正常输入，请参考上面第3点。  

如确认RX/TX连接正常，但不能输入，则可能是下面原因导致：

数据流控制是否正确，一般需关闭，下面为RS232的三种流控制模式介绍：  

1.  DTR/DSR：硬件上要有对应接口，软件上实现对应协议，才能实现此流控制。具体实现起来，一般好像是和RTS/CTS一直搭配使用。
2.  RTS/CTS：硬件上要有对应接口，软件上实现对应协议，才能实现此流控制。一般常见的也就是这种。但是很多开发板用secureCRT连接开发板的时候，往往都是在Uboot阶段，那时候还没有实现对应的RTS/CTS的流控制，所以此处需要取消此选择，否则，secureCRT就会去一直检测对应的RTS（Request To Send）pin脚，发现一直是无效，所以就一直没有接受到数据，就“卡”在那了。同样，你要输入数据，就是secureCRT要发送数据，所以其先发了个RTS给开发板，然后就一直检测自己的CTS是否有效，直到自己的CTS有效后，才能发送数据，而此处由于开发板上的驱动没有实现RTS/CTS，所以secureCRT就一直检测CTS，就“卡”死了，即你无法输入数据。
3.  XON/XOFF：软件上实现的流控制，硬件上无需像上面的RTS/CTS或DTR/DSR那样要增加对应的引脚。但是由于XON/XOFF分别对应的两个二进制的值，所以如果本身传输数据中包括该值，那么此软件的流控制就失效了。现在好像也很少用此种流控制了。
4.  是否打开回显

串口分析kernel log正常但adb连不上时，并且串口只能输出时，希望让android log也从串口输出，可以尝试此方法，以下是一个验证过的示例。  

原理上就是根据kernel log能够从串口输出，只要将logcat重定向到kmsg即可实现，因此各个平台的原理是一样的应该通用。（但须注意这样打印虽然能够有android log从串口输出，但串口输出量过大可能会出现丢log的情况）  

system/core/rootdir/init.rc中添加：

```sh
chmod 0660 /proc/kmsg
###############################################################
# redirect logs(LOGE, LOGI...) to linux console
###############################################################
service logcat /system/bin/logcat -f /dev/kmsg *:D
    class main
    user root
    group log
```

 

本文转自 [https://blog.csdn.net/y\_lang/article/details/46989801?spm=1001.2101.3001.6650.2&utm\_medium=distribute.pc\_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-46989801-blog-54287930.235%5Ev38%5Epc\_relevant\_anti\_vip\_base&depth\_1-utm\_source=distribute.pc\_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-46989801-blog-54287930.235%5Ev38%5Epc\_relevant\_anti\_vip\_base&utm\_relevant\_index=5](https://blog.csdn.net/y_lang/article/details/46989801?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-46989801-blog-54287930.235%5Ev38%5Epc_relevant_anti_vip_base&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-46989801-blog-54287930.235%5Ev38%5Epc_relevant_anti_vip_base&utm_relevant_index=5)，如有侵权，请联系删除。
