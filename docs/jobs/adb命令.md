---
title: adb命令
date: 2022-08-23
---

## 常用命令

### 连接指定的IP地址（端口）

```shell
adb connect <host>[:<port>]
```

### 查看当前连接设备：

- 查看当前连接设备：

```sh
adb devices
```

- 如果发现多个设备：

```sh
adb -s 设备号 其他指令
```

- 断开连接

```sh
adb disconnect [<host>[:<port>]]
```

### 安装apk文件：

```sh
adb install xxx.apk
```

- 此安装方式，如果已经存在，无法安装；
  推荐使用**覆盖安装：**

```
adb install -r xxx.apk
```

### 卸载App:

```
adb uninstall com.zhy.app
```

- 如果想要保留数据，则：

```
adb uninstall -k com.zhy.app
```

### 传递文件：

- 往手机SDCard传递文件：

```sh
adb push 文件名 手机端SDCard路径

例如：adb push 帅照.jpg  /sdcard/
```

- 从手机端下载文件：

```shell
adb pull /sdcard/xxx.txt
```

### 查看日志

```sh
logcat [options] [filterspecs]
options:
	-s				设置输出日志的标签, 只显示该标签的日志;
	-f	<filename>	将日志输出到文件, 默认输出到标准输出流中;
	-r	[<kbytes>]	按照每千字节输出日志, 需要 -f 参数;
	-n	<count>		设置日志输出的最大数目, 需要 -r 参数;
	-v	<format>	设置日志的输出格式, 注意只能设置一项;
	-c				清空所有的日志缓存信息;
	-d				将缓存的日志输出到屏幕上并退出, 并且不会阻塞;
	-t	<count>		输出最近的几行日志, 输出完退出, 不阻塞;
	-g				查看日志缓冲区信息;
	-b	<buffer>	加载一个日志缓冲区, 默认是 main;
	-B				以二进制形式输出日志;
	
filterspecs:
	<tag>[:priority]  标签:日志等级, 默认的日志过滤项是 *:I ;
    V 	: 	Verbose (明细);
    D 	:	Debug (调试);
    I 	: 	Info (信息);
    W 	: 	Warn (警告);
    E 	: 	Error (错误);
    F 	: 	Fatal (严重错误);
    S 	: 	Silent(Super all output)
```

### pm命令

```
pm list packages：显示所有已经安装的apk包名
pm list packages -f：显示所有已安装的apk包名及相应的apk的路径
pm install apk名称：安装 apk  此命令需要先将文件拷贝到设备的/data/local/tmp/下再进行安装
pm install -r apk 名称：强制安装，安装过的会覆盖
pm uninstall 包名：卸载apk
pm path 包名：通过包名反查apk所在路径
pm clear com.example.packagename 注：该命令清除掉APP的缓存，还能把APP的数据给清空。
```

### am命令

命令列表：

| 命令                              | 功能                      | 实现方法                   |
| --------------------------------- | ------------------------- | -------------------------- |
| am start [options]                | 启动Activity              | startActivityAsUser        |
| am startservice                   | 启动Service               | startService               |
| am stopservice                    | 停止Service               | stopService                |
| am broadcast                      | 发送广播                  | broadcastIntent            |
| am restart                        | 重启                      | restart                    |
| am dumpheap [pid] [file]          | 进程pid的堆信息输出到file | dumpheap                   |
| am send-trim-memory [pid] [level] | 收紧进程的内存            | setProcessMemoryTrimLevel  |
| am kill [PACKAGE]                 | 杀指定后台进程            | killBackgroundProcesses    |
| am kill-all                       | 杀所有后台进程            | killAllBackgroundProcesses |
| am force-stop [PACKAGE]           | 强杀进程                  | forceStopPackage           |
| am hang                           | 系统卡住                  | hang                       |
| am monitor                        | 监控                      | MyActivityController.run   |

### Intent

Intent的参数和flags较多，为了方便，这里分为3种类型参数，常用参数，Extra参数，Flags参数

#### 常用参数

```xml
-a <ACTION>: 指定Intent action， 实现原理Intent.setAction()；
-n <COMPONENT>: 指定组件名，格式为{包名}/.{主Activity名}，实现原理Intent.setComponent(）；
-d <DATA_URI>: 指定Intent data URI
-t <MIME_TYPE>: 指定Intent MIME Type
-c <CATEGORY> [-c <CATEGORY>] ...]:指定Intent category，实现原理Intent.addCategory()
-p <PACKAGE>: 指定包名，实现原理Intent.setPackage();
-f <FLAGS>: 添加flags，实现原理Intent.setFlags(int )，紧接着的参数必须是int型；
```

实例

```shell
am start -a android.intent.action.VIEW
am start -n mobi.infolife.ezweather.locker.locker_2/.LockerActivity
am start -d content://contacts/people/1
am start -t image/png
am start -c android.intent.category.APP_CONTACTS
```

#### Extra参数

**(1). 基本类型**

| 参数 | -e/-es | -esn     | -ez     | -ei  | -el  | -ef   | -eu  |
| ---- | ------ | -------- | ------- | ---- | ---- | ----- | ---- |
| 类型 | String | (String) | boolean | int  | long | float | uri  |

参数es是Extra String首字母简称，实例：

```bash
am start -n com.cnr.tlive/.MainActivity -es test
```

**(2). 数组类型**

|   参数   |   -esa   | -eia  |  -ela  |  -efa   |
| :------: | :------: | :---: | :----: | :-----: |
| 数组类型 | String[] | int[] | long[] | float[] |

参数eia，是Extra int array首字母简称，多个value值之间以逗号隔开，实例：

```undefined
am start -n com.cnr.tlive/com.cnr.tlive.activity.MainActivity -ela day 1,2,3,4,5
```

**(3). ArrayList类型**

| 参数     | -esal  | -eial | -elal | -efal |
| -------- | ------ | ----- | ----- | ----- |
| List类型 | String | int   | long  | float |

参数efal，是Extra float Array List首字母简称，多个value值之间以逗号隔开，实例：

```sh
am start -n com.cnr.tlive.activity.MainActivity -efal nums 1.2,2.2
```

```sh
am start 包名/完整Activity路径
如果启动带有参数，则使用**-e**标签，比如有一个SecondActivity，需要传入一个agrus_name参数，如：
am start com.example.crime/com.example.crime.SecondActivity -e argus_name QiuShui

am start -a android.intent.action.VIEW -d http://www.baidu.com：打开百度网页

am boardcast -a com.smz.myboardcast	发送一个广播（-a表示动作）
am broadcast -a "broadcastactionfilter" -e name zhy  带参

am startservice com.ctv.newfactorytest/.FactoryTestService：启动一个服务
```

> - 启动带的参数一般是Key-value形式，这里的key是argus_name,Value是QiuShui.
> - 除了默认启动的activity外，打开其他的activity时，需要在清单文件中添加**android:exported="true"属性。**
>- 要启动一个隐式的Intent，也就是说需要传入action等参数，在ADB调试桥中可以得知Intent的参数规范，比如**-a**表示**action**,**-c**表示**category**,**-d**表示**data_uri**, **-e**表示添加额外Key-Value信息。

**service list**来查看dumpsys能提供查询信息的服务

dumpsys window w | grep name：查看当前Activity;

使用dumpsys package 包名    查看指定包的信息，其中就有包名和完整Activity路径

### setprop、getprop命令

设置、获取系统property变量值

```sh
adb shell getprop		获取所有系统属性
adb shell getprop ro.product.board
adb shell setprop dalvik.vm.heapgrowthlimit 128m
```

### settings命令

使用这个命令可以对settings数据库进行增删改查，其中**“namespace”**是system、secure或者global其中之一。

```sh
settings list <namespace>		查看system、secure或者global表的全部值。

settings get <namespace> key	查看指定key对应的值

settings put <namespace> key	添加/修改指定key的值

settings delete <namespace> key		删除指定key
```

###  wm命令

```shell
wm size [reset|WxH|WdpxHdp]		不指定参数时是查看屏幕宽高。指定参数后即是设置（重设）屏幕宽高。

wm density [reset|DENSITY]		不指定参数时是查看屏幕密度。指定参数后即是设置（重设）密度。

wm overscan <reset|LEFT,TOP,RIGHT,BOTTOM>		设置overcan区域
```

> Overscan（过扫描）是一种独特的调整画面显示效果的方法，常见于老式电视机。它是通过裁剪画面外边缘的方式，将所需显示的内容填满整个电视屏幕，以达到全屏显示的要求。

### content命令

Content Provider增删改查:

```sqlite
在secure表中添加一条记录:
INSERT INTO secure ('name','value') VALUES('test','hello')

content insert --uri content://settings/secure --bind name:s:test --bind value:s:hello
```

```sqlite
在secure表中删除一条记录:
DELETE FROM secure WHERE name='test'

content delete --uri content://settings/secure --where "name='test'"
```

```sqlite
在secure表中更新一条记录:
UPDATE secure SET value='hello' WHERE name='test'

content update --uri content://settings/secure --bind value:s:hello --where "name='test'"
```

```sqlite
在secure表中查询
SELECT name,value FROM secure WHERE name='test' ORDER BY name DESC

content query --uri content://settings/secure --projection name:value --where "name='test'" --sort "name DESC"
```

```sh
字段类型:
	b – boolean 
	s – String
	i – int
	l – long
	f – float
	d – double
```

### sqlite3命令

```sh
.database			显示数据库信息，包括数据库所在位置
.table|.tables		显示表名称
.schema [TABLE]		查看建表语句
.header on|off		是/否显示表头
.mode csv|column|insert|line|list|tabs|tcl		改变输出格式
.quit|.exit			退出
```

### input命令

```sh
input text <TEXT>				模拟输入文本信息
input keyevent <KEYCODE|NAME>	模拟按键事件
input tap <X> <Y>				模拟点击(X,Y)
input swipe <X1> <Y1> <X2> <Y2> [TIME]		模拟滑动事件，从(X1,Y1)到(X2,Y2)（时长为TIME）
```

### 屏幕截图：

- 可以使用screencap命令来进行手机屏幕截图，例如：

```sh
adb shell screencap /sdcard/screen.png
```

### 录制视频：

可以使用screenrecord[options] filename命令来录制屏幕视频，例如：

```
adb shell screenrecord /sdcard/demo.mp4
```

adb start-server

​	打开ADB服务进程

adb kill-server

​	结束ADB服务进程

adb [-s [specific device] shell

​	进入命令行模式

## 部分问题解决

### 1.拒绝连接

当使用cmd进行连接电视的时候，可能会出现连接失败。
输入adb connect 172.16.2.253，结果连接失败，
提示由于目标计算机积极拒绝，无法连接，
解决办法，在CRT中输入命令settings put global adb_enabled 1
再进行连接，即可成功。

### 2.通过apk报名列出包的信息，然后启动Activity

```sh
pm list package #列出全部的包名,在这些包名中找出和apk相似的包 如 com.demo.hmi.onstarservices.tbox
dumpsys package com.demo.hmi.onstarservices.tbox #列出包的信息
```

其中有如下一行,可知要启动的package和activity

```sh
am start com.demo.hmi.onstarservices.tbox/.MainActivity
```

## 参考链接

[ADB常用命令及其用法大全](https://blog.csdn.net/qq_39969226/article/details/87897863?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522166113364816782184610975%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=166113364816782184610975&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-87897863-null-null.142^v42^pc_rank_34_1,185^v2^control&utm_term=adb%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4&spm=1018.2226.3001.4187)

[am,pm,dumpsys 命令用法](https://www.jianshu.com/p/2802683923e0)