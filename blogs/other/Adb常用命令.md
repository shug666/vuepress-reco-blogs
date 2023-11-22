---
title: Adb常用命令
date: 2023-11-21
tags:
 - adb
categories: 
 - adb
sticky: 
   true
---

## 1 列出当前连接的Android设备信息

```sh
adb devices # 获取当前连接的设备
adb shell getprop  # 查看android设备的参数信息
adb shell cat /proc/cpuinfo # 查看CPU架构信息
adb shell getprop ro.build.version.release # 查看系统Android版本信息
adb shell getprop ro.build.version.sdk # 查看系统API版本信息
adb shell df # 获取手机磁盘空间
adb shell dumpsys procstats # 获取当前内存使用信息
adb shell dumpsys gfxinfo # 获取当前的制图状态
```

## 2 获取设置设备屏幕分辨率

```sh
adb shell wm help # 可查看所有可用的wm指令
adb shell wm size # 获取当前分辨率
adb shell wm density # 获取当前像素密度(dpi)
adb shell wm size 720*1080 #将分辨率修改为720*1080
adb shell wm density 240 # 将dpi修改为240
adb shell wm size reset # 重置分辨率
```

## 3 文件拷贝

```sh
adb push <本地路径> <远程路径> # 从电脑上发送文件到设备 【adb push media /sdcard/ 把media文件夹整个拷贝到sd卡根目录】
adb pull <远程路径> <本地路径> # 从设备下载文件到电脑 【adb pull /system/media D:/ 把设备中的media目录整个拷贝到D盘】
```

## 4 抓取日志信息

```bash
adb logcat # 打印android的系统日志，使用ctrl+c 可停止打印
adb shell "logcat >/sdcard/log000.log"  #把日志信息保存到sd卡根目录的log000.log目录
adb logcat | grep -E "^..MyApp\|^..MyActivity" # 使用 grep 配合正则表达式进行过滤，只显示需要的输出（白名单）
adb logcat | grep -vE "^..MyApp\|^..MyActivity" # 使用 grep 配合正则表达式进行过滤，过滤不需要的输出（黑名单）
adb logcat -c && adb logcat # logcat 有缓存，如果仅需要查看当前开始的 log，需要清空之前的缓存
cat myapp.log | grep -E "^..MyApp|^..MyActivity" > newmyapp.log # 例如 log 文件为 myapp.log，要匹配 tag 为 MyApp 和 MyActivity 的输出，然后输出到 newmyapp.log

adb logcat <tag>[:priority] tag表示标签，priority输出的级别
V —— Verbose（最低，输出得最多）
D —— Debug
I —— Info
W —— Warning
E —— Error
F —— Fatal
S —— Silent（最高，啥也不输出）

日志默认级别是V，如果错误日志我们选择E就可以。
//格式1：打印默认日志数据
adb logcat
//格式2：需要打印日志详细时间的简单数据
adb logcat -v time
//格式3：需要打印级别为Error的信息
adb logcat *:E
//格式4：需要打印时间和级别是Error的信息
adb logcat -v time *:E
//格式5：将日志保存到电脑固定的位置，比如D:\log.txt
adb logcat -v time >D:\log.txt
// 开机日志的获取
adb logcat -b main -b system -b radio -b events -v time > bootLog.log
```

## 5 显示手机里所有正在运行的进程。

```sh
 adb shell ps -A | grep ** # 使用正则进行过滤
 adb shell ps -t -x,-P,-p,-c [pid|name] # 配置一些额外的参数
```

*   t显示进程下的线程列表
*   x 显示进程耗费的用户时间和系统时间，单位s
*   P 显示调度策略，通过是bg or fg ，当获取失败将会un和er比之前打印的内容多出了一列PCY，表示进程的调度等级
*   p 显示进程的优先级和nice等级
*   c 显示进程耗费的CPU时间
*   \[PID\]过滤指定进程PID，\[name\]过滤指定进程NAME

## 6 获取设备root权限，修改设备磁盘权限

```sh
adb root # 获取root权限
adb remount # 挂载系统文件系统为可读写状态，显示**remount succeeded**就代表命令执行成功；
# adb shell mount -o rw,remount /
```

## 7 屏幕操作

```sh
adb shell screencap -p /sdcard/screen.jpg # 对屏幕进行截屏
adb shell screenrecord sdcard/record.mp4 # 对屏幕进行录像
```

## 8 显示和隐藏下拉状态栏

```sh
adb shell service call statusbar 1 #显示下拉状态栏
adb shell service call statusbar 2 #隐藏下拉状态栏
```

## 9 获取设置应用的数据库数据列表

```sh
adb shell settings list global
```

## 10 安装apk文件

```sh
adb install <软件名> # 这个命令将指定的apk文件安装到设备上
adb install -r <软件名> # 替换已存在的应用程序，也就是说强制安装
adb install -l <软件名> # 锁定该应用程序
adb install -t <软件名> # 允许测试包
adb install -s <软件名> # 把应用程序安装到sd卡上
adb install -d <软件名> # 允许进行将见状，也就是安装的比手机上带的版本低
adb install -g <软件名> # 为应用程序授予所有运行时的权限
```

## PM常用指令

> pm即package manager，使用pm命令可以去模拟android行为或者查询设备上的应用信息等

| 命令 | 功能 | 实现方法 |
| --- | --- | --- |
| dump | dump信息 | AM.dumpPackageStateStatic |
| clear | 清空App数据 | AMS.clearApplicationUserData |
| uninstall \[options\] | 卸载应用 | IPackageInstaller.uninstall |
| force-dex-opt | dex优化 | PMS.forceDexOpt |
| trim-caches <目标size> | 紧缩cache目标大小 | PMS.freeStorageAndNotify |
| list packages | 列举app包信息 | PMS.getInstalledPackages |
| get-install-location | 获取安装位置 | PMS.getInstallLocation |
| path | 查看App路径 | PMS.getPackageInfo |
| install \[options\] | 安装应用 | PMS.installPackageAsUser |
| hide | 隐藏应用 | PMS.setApplicationHiddenSettingAsUser |
| unhide | 显示应用 | PMS.setApplicationHiddenSettingAsUser |
| enable <包名或组件名> | 激活包名或组件 | PMS.setEnabledSetting |
| disable <包名或组件名> | 禁用包名或组件 | PMS.setEnabledSetting |
| set-install-location | 设置安装位置 | PMS.setInstallLocation |
| get-max-users | 最大用户数 | UserManager.getMaxSupportedUsers |

## 11 获取安装的应用包名信息

```sh
adb shell pm list package # 列出所有的应用的包名
adb shell pm list package -s # 列出系统应用
adb shell pm list package -3 # 列出第三方应用
adb shell pm list package -f # 列出项目包名及对应的apk名及存放位置
adb shell pm list package -i # 列出应用包名及其安装来源
adb shell pm path com.ztf.coaster # 列出对应包名的apk位置
adb shell pm dump com.ztf.coaster # 列出应用的转储信息
```

## 12 卸载apk文件

```sh
adb uninstall <软件名> # 卸载软件
adb uninstall -k <软件名> # 卸载软件 但是保留配置和缓存文件
```

*   拥有root权限：

```sh
adb root  #在终端输入该命令获得root权限。
adb remount # 重新挂载，获得对读写权限。
adb shell #进入adb命令环境。
cd /system/app # 切换到 /system/app 目录，一般系统apk都安装在这个目录。
ls # 查看目前所有已安装的系统apk。
rm -rf Browser.apk  # 卸载系统apk。此时可以从桌面看到浏览器已经别卸载了
reboot  # 重启设备，才能生效。此时已经删掉了APK,如果不重启进行安装同个APK,是没办法安装成功，已经安装的信息还存在。
```

*   没有root权限：

```sh
adb uninstall 包名		# 卸载包名所对应的软件
adb shell pm uninstall --user 0  包名 # 如果adb uninstall没有用，可以使用这个，表示删除用户空间0的应用。这跟卸载普通应用是同个方式
```

## 13 调试Android系统

```sh
adb shell setprop debug.layout true # 显示UI边界
adb shell setprop debug.hwui.overdraw show # 开启调试 GPU 过度绘制
adb shell setprop debug.hwui.overdraw false # 关闭调试 GPU 过度绘制
adb shell dumpsys package queryies # 查看设备中能直接访问的App
```

## 15 查询数据库

```sh
msm8953_64:/data/system # sqlite3 locksettings.db  # 打开数据库，获取数据库版本信息
SQLite version 3.9.2 2017-07-21 07:45:23 # 数据库版本信息
Enter ".help" for usage hints.
sqlite> .tables # 显示所有的表信息
android_metadata  locksettings
.mode column #列对齐命令
.header on #打开表头显示
sqlite> select * from locksettings; # 查询整个表的信息
1|lockscreen.disabled|0|1
2|migrated|0|true
3|migrated_user_specific|0|true
4|lockscreen.password_type_alternate|0|0
5|migrated_biometric_weak|0|true
6|migrated_lockscreen_disabled|0|true
7|lockscreen.enabledtrustagents|0|
8|lockscreen.password_salt|0|-970902998671653081
9|lockscreen.password_type|0|262144
10|lockscreen.profilechallenge|0|1
11|lockscreen.passwordhistory|0|
sqlite>
```

## 16 获取显示当前正在显示的Activity包名全路径

```sh
adb shell dumpsys activity
adb shell "dumpsys activity | grep "Activity:""
```

回车之后，成功的话就会打印出很多信息，信息列表中关键字mResumedActivity后面的就是当前正在显示的应用包名+Activity名称

```sh
mResumedActivity: ActivityRecord{6c34898 u0 应用包名/Actiivty的名称 t77}
```

## 17 Activity操作

```sh
adb shell am start 包名/.Activity (要启动的Activity) # 启动app
adb shell am start -W -n 包名/.Activity # 启动app
adb shell am start -a android.intent.action.MAIN -n --ei pid 10 --es str "helloworld"​​ # 传递key为pid数值为i整数类型0， 和key为str数值为字符串类型helloworld
adb shell am force-stop 包名 # 关闭app
adb shell pm clear 包名 #关闭app
```

## 18 Service操作

```sh
adb shell am startservice -n｛包(package)名｝/｛包名｝.{服务(service)名称}
adb shell am startservice -n com.android.traffic/com.android.traffic.maniservice
adb shell am start-foreground-service -n com.demo.screenrecorder/com.demo.screenrecorder.RecordService
```

## 19 发送广播

```sh
adb shell am broadcast -a android.intent.action.BOOT_COMPLETED # 发送系统启动完毕广播
adb shell am broadcast -a android.intent.action.MEDIA_MOUNTED # 发送外部SD卡挂载广播
adb shell am broadcast -a android.intent.action.MEDIA_UNMOUNTED # 发送外部SD卡拔出广播
adb shell am broadcast -a car.meter.share.BROADCAST # 自定义录制视频广播 
adb shell am broadcast -a com.leapmotor.share.reload.BROADCAST # 自定义途记分享广播

adb shell am broadcast -a com.android.test --es test_string "this is test string" --ei test_int 100 --ez test_boolean true
# --es 表示使用字符串类型参数  --ei 表示int类型参数  --ez 表示boolean类型参数  第一个为key，第二个为value
```

执行结果如下，则表示广播发送成功：

## 20 查看网络信息

```sh
adb shell ping -c 4 ww.baidu.com # 测试两个网络间的连接和延迟
adb shell netstat # 网络统计，用来查看网络当前状态。
tcpdump -p -vv -s 0 -w /data/data/capture.pcap # 网络抓包，将tcpdump文件push进设备（shell下）
tcpdump -i any -s 0 -w /data/data/capture.pcap # 网络抓包，将tcpdump文件push进设备（shell下）
```

## 21 监听手机事件

```sh
adb shell getevent
```

![点击事件](https://img-blog.csdnimg.cn/cd0b059e5cd441d69581246c9bb17f1f.png)  
其中以**003 0035**和**003 0036** 开头的两条数据0x170和0x38E就是我们需要的x和y坐标了

## 22 模拟点击

```sh
# 模拟点击[x,y]坐标
adb shell input mouse tap x y
```

## 23 模拟滑动和模拟长按

```sh
# 从（x1，y1）滑动到（x2，y2）
adb shell input swipe x1 y1 x2 y2 
```
```sh
# 因为没有专门模拟长按的动作，所以我们使用滑动来模拟长按
# 滑动初始位置与结束位置一致，且时间设置为500毫秒
adb shell input swipe 300 300 300 300 500
```

## 24 模拟输入

```sh
# 输入‘string’
adb shell input text 'string'
```

**注**：需要先定位到对应的输入框，才可输入成功

## 25 模拟按键

```sh
# 模拟back 按键
adb shell input keyevent  4
```

这里给出一个常用的keyevent code:

| 按键 | 按键Code码 | 描述 |
| --- | --- | --- |
| KEYCODE\_UNKNOWN | 0 |  |
| KEYCODE\_SOFT\_LEFT | 1 |  |
| KEYCODE\_SOFT\_RIGHT | 2 |  |
| KEYCODE\_HOME | 3 | home键 |
| KEYCODE\_BACK | 4 | back键 |
| KEYCODE\_CALL | 5 |  |
| KEYCODE\_ENDCALL | 6 |  |
| KEYCODE\_0 | 7 |  |
| KEYCODE\_1 | 8 |  |
| KEYCODE\_2 | 9 |  |
| KEYCODE\_3 | 10 |  |
| KEYCODE\_4 | 11 |  |
| KEYCODE\_5 | 12 |  |
| KEYCODE\_6 | 13 |  |
| KEYCODE\_7 | 14 |  |
| KEYCODE\_8 | 15 |  |
| KEYCODE\_9 | 16 |  |
| KEYCODE\_STAR | 17 |  |
| KEYCODE\_POUND | 18 |  |
| KEYCODE\_DPAD\_UP | 19 |  |
| KEYCODE\_DPAD\_DOWN | 20 |  |
| KEYCODE\_DPAD\_LEFT | 21 |  |
| KEYCODE\_DPAD\_RIGHT | 22 |  |
| KEYCODE\_DPAD\_CENTER | 23 |  |
| KEYCODE\_VOLUME\_UP | 24 |  |
| KEYCODE\_VOLUME\_DOWN | 25 |  |
| KEYCODE\_POWER | 26 | 电源键 |
| KEYCODE\_CAMERA | 27 |  |
| KEYCODE\_CLEAR | 28 |  |
| KEYCODE\_A | 29 |  |
| KEYCODE\_B | 30 |  |
| KEYCODE\_C | 31 |  |
| KEYCODE\_D | 32 |  |
| KEYCODE\_E | 33 |  |
| KEYCODE\_F | 34 |  |
| KEYCODE\_G | 35 |  |
| KEYCODE\_H | 36 |  |
| KEYCODE\_I | 37 |  |
| KEYCODE\_J | 38 |  |
| KEYCODE\_K | 39 |  |
| KEYCODE\_L | 40 |  |
| KEYCODE\_M | 41 |  |
| KEYCODE\_N | 42 |  |
| KEYCODE\_O | 43 |  |
| KEYCODE\_P | 44 |  |
| KEYCODE\_Q | 45 |  |
| KEYCODE\_R | 46 |  |
| KEYCODE\_S | 47 |  |
| KEYCODE\_T | 48 |  |
| KEYCODE\_U | 49 |  |
| KEYCODE\_V | 50 |  |
| KEYCODE\_W | 51 |  |
| KEYCODE\_X | 52 |  |
| KEYCODE\_Y | 53 |  |
| KEYCODE\_Z | 54 |  |
| KEYCODE\_COMMA | 55 |  |
| KEYCODE\_PERIOD | 56 |  |
| KEYCODE\_ALT\_LEFT | 57 |  |
| KEYCODE\_ALT\_RIGHT | 58 |  |
| KEYCODE\_SHIFT\_LEFT | 59 |  |
| KEYCODE\_SHIFT\_RIGHT | 60 |  |
| KEYCODE\_TAB | 61 |  |
| KEYCODE\_SPACE | 62 |  |
| KEYCODE\_SYM | 63 |  |
| KEYCODE\_EXPLORER | 64 |  |
| KEYCODE\_ENVELOPE | 65 |  |
| KEYCODE\_ENTER | 66 |  |
| KEYCODE\_DEL | 67 |  |
| KEYCODE\_GRAVE | 68 |  |
| KEYCODE\_MINUS | 69 |  |
| KEYCODE\_EQUALS | 70 |  |
| KEYCODE\_LEFT\_BRACKET | 71 |  |
| KEYCODE\_RIGHT\_BRACKET | 72 |  |
| KEYCODE\_BACKSLASH | 73 |  |
| KEYCODE\_SEMICOLON | 74 |  |
| KEYCODE\_APOSTROPHE | 75 |  |
| KEYCODE\_SLASH | 76 |  |
| KEYCODE\_AT | 77 |  |
| KEYCODE\_NUM | 78 |  |
| KEYCODE\_HEADSETHOOK | 79 |  |
| KEYCODE\_FOCUS | 80 | Camera\*focus |
| KEYCODE\_PLUS | 81 |  |
| KEYCODE\_MENU | 82 |  |
| KEYCODE\_NOTIFICATION | 83 |  |
| KEYCODE\_SEARCH | 84 |  |
| KEYCODE\_MEDIA\_PLAY\_PAUSE | 85 |  |
| KEYCODE\_MEDIA\_STOP | 86 |  |
| KEYCODE\_MEDIA\_NEXT | 87 |  |
| KEYCODE\_MEDIA\_PREVIOUS | 88 |  |
| KEYCODE\_MEDIA\_REWIND | 89 |  |
| KEYCODE\_MEDIA\_FAST\_FORWARD | 90 |  |
| KEYCODE\_MUTE | 91 |  |

## 26 adb shell input

```sh
Usage: input [<source>] <command> [<arg>...]

The sources are:
      dpad
      keyboard
      mouse
      touchpad
      gamepad
      touchnavigation
      joystick
      touchscreen
      stylus
      trackball

The commands and default sources are:
      text <string> (Default: touchscreen)
      keyevent [--longpress] <key code number or name> ... (Default: keyboard)
      tap <x> <y> (Default: touchscreen)
      swipe <x1> <y1> <x2> <y2> [duration(ms)] (Default: touchscreen)
      draganddrop <x1> <y1> <x2> <y2> [duration(ms)] (Default: touchscreen)
      press (Default: trackball)
      roll <dx> <dy> (Default: trackball)
```

 

  

本文转自 [https://blog.csdn.net/abc6368765/article/details/125220954](https://blog.csdn.net/abc6368765/article/details/125220954)，如有侵权，请联系删除。
