---
title: kl文件及其相关命令
date: 2022-08-20
---

<a data-fancybox title="img" href="https://raw.githubusercontent.com/shug666/image/main/images/20200724170459543.png">![img](https://raw.githubusercontent.com/shug666/image/main/images/20200724170459543.png)</a>

[参考链接](https://blog.csdn.net/weixin_43405104/article/details/107548539)

## kl文件

**kl**（**key layout**）文件是一个映射文件，是**标准linux**与**anroid键值**之间的映射文件。作用是将Linux scancode转换为Android keycode。scancode就是硬件直接扫描到的数字，而这些数字会通过这个kl文件对应到字符串，也就是keycode。设备可以拥有自己专属的kl文件。另外系统提供了一个特殊的内置常规按键布局文件，名为 Generic.kl。当找不到专属的kl时候就会用Generic.kl

Generic.kl文件在代码中的位置为

```
./framewprk/base/data/keyboards/Generic.kl
```

**kl文件**可以有很多个，但是它有一个使用优先级：

```
/system/usr/keylayout/Vendor_XXXX_Product_XXXX_Version_XXXX.kl  
/system/usr/keylayout/Vendor_XXXX_Product_XXXX.kl  
/system/usr/keylayout/DEVICE_NAME.kl  
/data/system/devices/keylayout/Vendor_XXXX_Product_XXXX_Version_XXXX.kl  
/data/system/devices/keylayout/Vendor_XXXX_Product_XXXX.kl  
/data/system/devices/keylayout/DEVICE_NAME.kl  
/system/usr/keylayout/Generic.kl  
/data/system/devices/keylayout/Generic.kl 
```

**vendor id**和**product id**。根据这两个**id**创建对应名称的**kl**文件，然后传入设备的对应目录，重启即可看到效果。

### kl文件命名含义

kl文件在源码内的目录：**\RTD2853R\kernel\android\R\frameworks\base\data\keyboards**

<a data-fancybox title="img" href="https://cdn.jsdelivr.net/gh/shug666/image/images/4273129-2d321ecfed4b958d.png">![img](https://cdn.jsdelivr.net/gh/shug666/image/images/4273129-2d321ecfed4b958d.png)</a>

目录下的**kl文件**非常多，这里以**Vendor_0b05_Product_4500.kl**为例：

**Vendor_0b05** ：表示生产商代码是**0b05**

**Product_4500** ：表示产品型号为**4500**

之后再跟输入设备的对应**id**进行匹配，就可以知道该**kl文件**所对应的设备。

### 获得输入设备和按键信息

实际开发中我们可以通过**getevent**获取到输入设备的**vendor id**，**product id**和**按键事件值**
通过串口连接后输入**getevent**

<a data-fancybox title="image-20220820113829296" href="https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220820113829296.png">![image-20220820113829296](https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220820113829296.png)</a>

以上的输出分为两个部分，上半部分代表当前设备上的输入设备，下面是点击按键后产生的输出。

可以看到遥控器按键对应的输入设备节点为 **/dev/input/event0** 。

之后通过**getevent -i /dev/input/event0**查看该设备的**vendor id**和**product id**。输出结果如下：

<a data-fancybox title="img" href="https://cdn.jsdelivr.net/gh/shug666/image/images/4273129-ce87a37852c5c5d6.png">![img](https://cdn.jsdelivr.net/gh/shug666/image/images/4273129-ce87a37852c5c5d6.png)</a>

此时我们就可以根据对应的**vendor id**和**product id**创建自己的**kl文件**，然后传入设备中验证，首先去源码对应的目录中找到对应的**kl文件**来增加按键映射，即**Vendor_0416_Product_038f.kl**文件，如果没有该文件，那么证明系统针对该设备的按键做特殊处理，之后就会根据上述所说的使用优先级去加载其他的**kl文件**。这里我们新建一个**Vendor_0416_Product_038f.kl**文件。然后根据分析的按键信息来往里面添加内容。

### 按键信息分析

<a data-fancybox title="image-20220820133509389" href="https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220820133509389.png">![image-20220820133509389](https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220820133509389.png)</a>

 我们每次按键会有四个输出，前两行为**按下**，后两行为**抬起**，**0001**指按键（也存在其他设备类型，这里我们不关心）

**0066**是对应的**十六进制按键值**，这里就是**驱动**所设置的**按键值**，可以去找驱动提供头文件查看该值所对应的**按键名称**。

末尾的部分，**00000001**为按下，**00000000**为抬起。

在驱动提供的按键值input-event-codes.h头文件中，在文件内对应按键如下:

```c
#define KEY_TESTCODE                    0x360
```

然后在我们默认的**kl文件**，即**venus_IR_input.kl**中找到**0x360对应的10进制**对应**Android**中的按键值如下：

```
key 864     TESTCODE
```

这里即将**驱动**上报的**KEY_TESTCODE**转成了**Android**的**TESTCODE**按键，**Android**对应的**按键值列表头文件**目录为：

```
/frameworks/native/include/android/keycodes.h
```

如果我们要修改**驱动层**上报的按键在**Android**所对应的按键值，那么就可以在该头文件查找对应的按键，然后在**kl文件**进行配置。

[可参考Android 按键映射kl文件编写简析](https://www.jianshu.com/p/1b0ae800b5bf)

shugan6766@gmail.com

## Android调试常用命令

### input 命令

```
input keyevent KEYCODE_TESTCODE(或403)：可以向系统发送按键事件

input text<String>：可以接收字符串的UI 控件输入字符
```

### dumpsys命令

```
dumpsys input：可以查看输入设备情况,这个命令可以查看到输入设备映射到了哪一个kl文件

KeyLayoutFile: /vendor/usr/keylayout/venus_IR_input.kl

其他--------------------------
dumpsys window w | grep \/ | grep name：获取当前apk包名；
dumpsys meminfo：显示当前进程的内存使用以及每个 adj（oom adjustment）可回收内存的情况。
dumpsys meminfo com.mstar.tv.service：显示某包的内存使用情况；
dumpsys activity：显示四大组件的一些正在运行和 历史的全局变量信息，比如stack中 的activity；
dumpsys activity top | grep activity：查看 当前界面是哪个activity；
dumpsys notification：查看当前几秒内弹出的toast，dialog具体由哪个apk弹出；
dumpsys | grep "service"：查看framework有哪些服务；
```

### getevent命令

查看输入设备/dev/input/event*是否有数据输入，查看键值，常用来调试遥控器

vendor 号和input name：**可以通过cat /proc/bus/input/devices命令查看，当然getevent -p也可以查看**

### logcat命令

```
logcat -s "tag"

logcat -v threadtime -f /data/log.txt：后台抓log，带时间戳。

//过滤TAG为ActivityManager输出级别大于等于I的日志与TAG为MyApp输出级别大于D的日志
最后的元素 *:S ,，是设置所有的标 签为”silent”，所有日志只显示有”View” and “MyApp”的，用 *:S 的另一个用处是 能够确保日志输出的时候是按照过滤器的说明限制的，也让过滤器也作为一项输出到日志中.
logcat ActivityManager:I MyApp:D *:S
 
logcat  *:W     //显示优先级为warning或更高的日志信息

//只输出程序包名为“com.rexen.zxapplication”的日志
shell "logcat | grep com.rexen.zxapplication" >D:\android-sdk\log\log.txt      
 
logcat -d //将缓冲区的log打印到屏幕并退出
 
logcat -c //清除缓冲区log（testCase运行前可以先清除一下）
 
logcat -g //打印缓冲区大小并退出
 
logcat -f /data/local/tmp/log.txt -n 10 -r 1  //输出log
```

[最后可参考](https://www.freesion.com/article/2898889036/)