---
title: adb dumpsys命令
date: 2024-08-21
tags:
 - adb
categories: 
 - adb
sticky: 
   true
---

## dumpsys 服务

基本用法

```shell
adb shell dumpsys [-t timeout] [--help | -l | --skip services | service [arguments] | -c | -h]
```

查看可与 `dumpsys` 配合使用的系统服务的完整列表，请使用以下命令：

```shell
adb shell dumpsys -l
adb shell service list
```

某些服务可能允许您传递可选参数。可以加上`-h`来查看所有的命令，解这些可选参数，如下所示：

```shell
adb shell dumpsys procstats -h
```
```shell
// 查看 com.demo.package 应用的 servicecs 启动记录
adb shell dumpsys activity services -p com.demo.package

// 查看activity启动记录 
adb shell dumpsys activity
```

官网有一些用法的说明 可见 [dumpsys命令](https://developer.android.com/studio/command-line/dumpsys.html?hl=zh-cn)

其实官网上的介绍也是比较简单，并且没有什么实际用途

所以，这里列举了大部分开发中会用到的服务

##  查看当前界面的activity

```shell
#打印顶层Activity信息
$ dumpsys activity top
#从上个命令结果中过滤出Activity相关信息
$ dumpsys activity top | grep ACTIVITY
#从上一步过滤结果中继续过滤出最后一条记录，也就是当前界面(顶层top)activity
$ dumpsys activity top | grep ACTIVITY | tail -n 1
```

## 查看当前界面的Fragment

```shell
#查看Fragment栈信息
$ dumpsys activity top | grep '#0: ' 
#查看当前界面的Fragment
$ dumpsys activity top | grep '#0: ' | tail -n 1
```

## 查看Activity任务栈

```shell
# 查看Activity任务栈
$ dumpsys activity activities
$ dumpsys activity activities | grep ActivityRecord
```

## 查看当前系统正在进行的广播

```shell
$ dumpsys | grep BroadcastRecord
```

## dumpsys SurfaceFlinger

查看屏幕静态帧信息

```shell
Static screen stats:
  < 1 frames: 0.335 s (1.5%) // 每帧的耗时情况
  < 2 frames: 2.049 s (9.1%)
	。。。。
  7+ frames: 19.625 s (87.1%)
```

查看BufferLayer（缓冲区）情况

```shell
+ BufferLayer (WindowToken{3c467fd android.os.BinderProxy@3eec54}#0)
  Region TransparentRegion (this=a2fed158 count=1)
    [  0,   0,   0,   0]
  Region VisibleRegion (this=a2fed008 count=1)
    [  0,   0,   0,   0]
  Region SurfaceDamageRegion (this=a2fed044 count=1)
    [  0,   0,   0,   0]
      layerStack=   0, z=        0, pos=(0,0), size=(2560,2560), crop=[  0,   0,  -1,  -1], finalCrop=[  0,   0,  -1,  -1], isOpaque=0, invalidate=1, dataspace=Default, defaultPixelFormat=RGBx_8888, color=(0.000,0.000,0.000,1.000), flags=0x00000000, tr=[1.00, 0.00][0.00, 1.00]
      parent=mAboveAppWindowsContainers#0  // 所属父类
      zOrderRelativeOf=none
      activeBuffer=[   0x   0:   0,Unknown/None], queued-frames=0, mRefreshPending=0, windowType=-1, appId=-1
```

Displays信息（比如屏幕分辨率）

```shell
+ DisplayDevice: Built-in Screen
   type=0, hwcId=0, layerStack=0, (1280x 720), ANativeWindow=0xa52e7808 (8:8:8:8), orient= 0 (type=00000000), flips=280, isSecure=1, powerMode=2, activeConfig=0, numLayers=2
   v:[0,0,1280,720], f:[0,0,1280,720], s:[0,0,1280,720],transform:[[1.000,0.000,-0.000][0.000,1.000,-0.000][0.000,0.000,1.000]]
   wideColorGamut=0, hdr10=0, colorMode=ColorMode::NATIVE, dataspace: Default (0)
  FramebufferSurface: dataspace: Default(0)
   
default-size=[1280x720] default-format=1 transform-hint=00 frame-counter=280 // 屏幕分辨率信息
```

其他信息

```shell
EGL implementation : 1.4 Linux-r8p0-01rel0 // EGL 版本
GLES: ARM, Mali-450 MP, OpenGL ES 2.0 3d6a80e // OpenGL 架构信息
refresh-rate              : 60.000002 fps // 刷新率
x-dpi                     : 160.156998 // x dpi
y-dpi                     : 160.421005 // y dpi
VSYNC state: disabled // 垂直同步状态
soft-vsync: disabled // 当屏幕亮着的，就是disabled，如果关闭屏幕，这里为enabled
```

## dumpsys activity

*   **dumpsys activity o**
    
    获取OOM等级信息，home进程、上一次的进程内容
    
    ```shell
    generic_x86:/ $ dumpsys activity o
      OOM levels:
        -900: SYSTEM_ADJ (   32,768K) 。。。
          
      mHomeProcess: ProcessRecord{a3cea50 18515:com.android.launcher3/u0a19}
      mPreviousProcess: ProcessRecord{3758933 23311:com.android.settings/1000}
    ```
    
*   **dumpsys activity a**
    
    从顶部到底部打印 TaskRecord（activity） 信息，包含如下内容
    
    ```shell
    * TaskRecord{9e6567 #150 A=com.android.settings U=0 StackId=1 sz=2}
      * Hist #1: ActivityRecord{e5fb34f u0 com.android.settings/.Settings$MemorySettingsActivity t150}
              packageName=com.android.settings processName=com.android.settings
              launchedFromUid=1000 launchedFromPackage=com.android.settings userId=0
              app=ProcessRecord{3758933 23311:com.android.settings/1000}
              Intent { flg=0x8000 cmp=com.android.settings/.Settings$MemorySettingsActivity (has extras) }
              frontOfTask=false task=TaskRecord{9e6567 #150 A=com.android.settings U=0 StackId=1 sz=2}
              taskAffinity=null
              realActivity=com.android.settings/.Settings$MemorySettingsActivity
              baseDir=/system/priv-app/Settings/Settings.apk
              dataDir=/data/user_de/0/com.android.settings
              state=RESUMED stopped=false delayedResume=false finishing=false
    ```
    
*   **dumpsys activity r**
    
    打印最近的TaskRecord信息，信息内容与a参数的类似
    
*   **dumpsys activity b \[PACKAGE\_NAME\]**
    
    打印指定包创建的进程信息，包含已经注册的广播接收器action信息，创建的handler
    
    ```shell
    generic_x86:/ $ dumpsys activity b com.google.android.ext.services
    ACTIVITY MANAGER BROADCAST STATE (dumpsys activity broadcasts)
    
      mBroadcastsScheduled [foreground]=false
      mBroadcastsScheduled [background]=false
      mHandler:
        Handler (com.android.server.am.ActivityManagerService$MainHandler) {32cc7bf} @ 26049725
          Looper (ActivityManager, tid 16) {ba76e8c}
            Message 0: { when=+8m0s963ms what=27 target=com.android.server.am.ActivityManagerService$MainHandler }
            Message 1: { when=+10m14s258ms callback=com.android.server.am.ActiveServices$1 target=com.android.server.am.ActivityManagerService$MainHandler }
            Message 2: { when=+23m38s921ms callback=com.android.server.AppOpsService$1 target=com.android.server.am.ActivityManagerService$MainHandler }
            (Total messages: 3, polling=true, quitting=false)
    ```
    
*   **dumpsys activity p \[PACKAGE\_NAME\]**
    
    打印指定包创建的进程信息，包含：  
    
    requiredAbi：要求的架构  
    
    lastSwapPss：内存使用情况  
    
    lastRequestedGc：上次GC请求  
    
    ```shell
    generic_x86:/ $ dumpsys activity p com.google.android.ext.services
    ACTIVITY MANAGER RUNNING PROCESSES (dumpsys activity processes)
      requiredAbi=x86 instructionSet=null
      adjSeq=18970 lruSeq=0 lastPss=4.1MB lastSwapPss=0.00 lastCachedPss=0.00 lastCachedSwapPss=0.00
      lastRequestedGc=-4h9m54s33ms lastLowMemory=-4h9m54s33ms reportLowMemory=false .....
    ```
    
*   **dumpsys activity s **
    
    打印ServiceRecord信息，包含  
    
    intent：intent信息  
    
    packageName：包名  
    
    IntentBindRecord：已绑定该服务的信息
    
    ```shell
    ServiceRecord{a4d66c6 u0 com.android.chrome/org.chromium.chrome.browser.omaha.OmahaClient}
        intent={act=org.chromium.chrome.browser.omaha.ACTION_REGISTER_REQUEST cmp=com.android.chrome/org.chromium.chrome.browser.omaha.OmahaClient}
        packageName=com.android.chrome ....
    ```
    
*   **dumpsys activity settings**
    
    打印ServiceRecord信息，包含  
    
    intent：intent信息  
    
    packageName：包名  
    
    IntentBindRecord：已绑定该服务的信息
    
    ```shell
    generic_x86:/ $ dumpsys activity settings
    TASK com.android.settings id=150
      ACTIVITY com.android.settings/.Settings$MemorySettingsActivity e5fb34f pid=23311
        Local Activity ebdaec State:
          mResumed=true mStopped=false mFinished=false .....
    ```
    
*   **dumpsys activity all**
    
    打印全部的activity，包含  
    
    生命周期状态  
    
    View Hierarchy: view的层次结构
    
    ```shell
    generic_x86:/ $ dumpsys activity all
    TASK com.example.flutter_web id=149  ...
      
        View Hierarchy:
          DecorView@6f37f9c[MainActivity]
            android.widget.LinearLayout{5370da5 V.E...... .......D 0,0-1080,1794}
              android.view.ViewStub{137457a G.E...... ......I. 0,0-0,0 #10203e8 android:id/action_mode_bar_stub}
              android.widget.FrameLayout{20ff12b V.E...... .......D 0,0-1080,1794 #1020002 android:id/content} ....
    ```
    
*   **dumpsys activity top**
    
    与all参数类似，但是只打印顶层activity的信息
    
*   **dumpsys activity starter**
    
    打印对应的启动者
    
*   **dumpsys activity lastanr**
    
    打印 ANR list信息
    

## dumpsys cpuinfo

查看CPU使用情况

```shell
CPU usage from 1251999ms to 351197ms ago (2020-02-23 17:21:02.541 to 2020-02-23 17:36:03.343):
  4.2% 20215/com.android.chrome:sandboxed_process0: 1.1% user + 3% kernel / faults: 396490 minor 1 major
   .....
6.6% TOTAL: 1.2% user + 4.9% kernel + 0% iowait + 0% irq + 0.3% softirq
```

## dumpsys diskstats

查看磁盘使用情况

```shell
Latency: 1ms [512B Data Write]
Data-Free: 1195820K / 2031440K total = 58% free
Cache-Free: 61000K / 62416K total = 97% free
System-Free: 250356K / 2031440K total = 12% free
```

## dumpsys display

屏幕物理信息

```shell
mDefaultViewport=DisplayViewport{valid=true, displayId=0, orientation=0, logicalFrame=Rect(0, 0 - 1080, 1920), physicalFrame=Rect(0, 0 - 1080, 1920), deviceWidth=1080, deviceHeight=1920}
  mExternalTouchViewport=DisplayViewport{valid=false, displayId=0, orientation=0, logicalFrame=Rect(0, 0 - 0, 0), physicalFrame=Rect(0, 0 - 0, 0), deviceWidth=0, deviceHeight=0}

mDisplayInfos=
   PhysicalDisplayInfo{1920 x 1080, 60.000004 fps, density 1.5, 159.895 x 160.421 dpi, secure true, appVsyncOffset 1000000, bufferDeadline 16666666}
```

## dumpsys ethernet

查看IP，网关（ifconfig也能查看)

```shell
onNewDhcpResults({IP address 172.19.110.23/24 Gateway 172.19.110.1  DNS servers: [ 10.254.254.254 ] Domains gz.cvte.cn DHCP server /10.22.4.10 Vendor info null lease 7200 seconds})
```

## dumpsys meminfo

查看系统各个应用内存使用情况

```shell
Total PSS by process:
     36,511K: system (pid 1929)
     3,903K: android.ext.services (pid 2881)
     .....
Total PSS by OOM adjustment:
     76,848K: Native
          4,411K: zygote (pid 1676)
          .....
Total PSS by category:
     78,104K: Native
     22,149K: Dalvik
    	......

Total RAM:   991,316K (status critical)
 Free RAM:   412,181K (   10,761K cached pss +   144,448K cached kernel +   256,972K free)
 Used RAM:   433,189K (  326,881K used pss +   106,308K kernel)
 Lost RAM:   193,772K
     ZRAM:    16,628K physical used for    74,012K in swap (  317,216K total swap)
   Tuning: 128 (large 256), oom   184,320K, restore limit    61,440K (low-ram)
```

## dumpsys overlay

查看overlay的包状态

```shell
com.android.systemui.theme.dark:0 {
    mPackageName.......: com.android.systemui.theme.dark  //overlay 的apk 包名
    mUserId............: 0
    mTargetPackageName.: com.android.systemui // 目标包名
    mBaseCodePath......: /vendor/overlay/SysuiDarkTheme/SysuiDarkThemeOverlay.apk // overlay的apk路径
    mState.............: STATE_DISABLED
    mIsEnabled.........: false 
    mIsStatic..........: false 
    mPriority..........: 1
    mCategory..........: null
  }
```

## dumpsys package

*   **dumpsys package l**
    
    列举已知的lib库
    
    ```shell
    Libraries:
      android.test.base ->  (jar) /system/framework/android.test.base.jar ....
    ```
    
*   **dumpsys package f**
    
    列举设备支持的功能
    
    ```shell
    Features:
      android.software.leanback_only ......
    ```
    
*   **dumpsys package r**
    
    列举 所有的 \[activity|service|receiver|content \] intent 解析器，其中包含各个应用的入口，action对应的组件
    
    ```shell
    Activity Resolver Table: // activity 入口
      Non-Data Actions: 
           android.settings.HOME_SETTINGS:  // action 
              c25027 com.android.tv.settings/.EmptyStubActivity  // 响应该action的组件
         ....
    MIME Typed Actions:
          android.intent.action.INSTALL_PACKAGE:
            7215b10 com.android.packageinstaller/.InstallStart
           .....
    Receiver Resolver Table:  // 广播接收器
    Non-Data Actions:
          android.intent.action.LOCALE_CHANGED:
    			        1a15a84 com.android.providers.media/.MediaScannerReceiver
    ```
    
*   **dumpsys package permission \[permissionName …\]**
    
    列举所有申明该权限的应用信息，其中可以查看应用的版本信息，标签，使用的lib库和jar路径，首次安装时间，更新时间，签名信息，已经获取的权限，安装需要的权限以及overlay文件的路径
    
    ```shell
    xxxx:/ $ dumpsys package permission android.permission.VIBRATE
    Packages:
      pkg=Package{a077660 com.ecloud.eshare.server}
      codePath=/system/priv-app/eshare-service
      versionCode=20190820 minSdk=8 targetSdk=8
      versionName=v5.8.20
       ..... 
    ```
    
*   **dumpsys package preferred-xml**
    
    列举首选应用的设置，以xml的方式输出，（笔者这里没有设置，所以为空）
    
    ```shell
    xxxx:/ $ dumpsys package preferred-xml
    <?xml version='1.0' encoding='utf-8' standalone='yes' ?>
    <preferred-activities />
    ```
    
*   **dumpsys package prov**
    
    列举所有的内容提供者信息
    
    ```shell
    xxxx:/ $ dumpsys package prov
    Registered ContentProviders:
      com.android.systemui/.keyguard.KeyguardSliceProvider:
        Provider{b98064f com.android.systemui/.keyguard.KeyguardSliceProvider}
      com.android.browser/.homepages.HomeProvider:
        Provider{1c0f1dc com.android.browser/.homepages.HomeProvider}
    ```
    
*   **dumpsys package p**
    
    获取所有已经安装的apk包信息，内容展示的格式与 _dumpsys package permission_ 类似，这里就不做举例
    
*   **dumpsys package <package.name>**
    
    获取指定包的信息，可以获取到四大组件的信息，包信息（版本信息，lib库），已经请求的权限，安装需要的权限，运行时权限，shareUser信息（可以判断是否是系统应用）
    
    ```shell
    xxxx:/ # dumpsys package com.ecloud.eshare.server
    Activity Resolver Table:
      Non-Data Actions:
          android.intent.action.MAIN:
            9baa84b com.ecloud.eshare.server/.CifsClientActivity filter 6b0c11f
              Action: "android.intent.action.MAIN"
              Category: "android.intent.category.LAUNCHER"
               .....
    Shared users:
      SharedUser [android.uid.system] (db280e1):
    ```
    
*   **dumpsys package s**
    
    列举shared uses的信息，权限，对应的gid
    
    ```shell
    xxxx:/ # dumpsys package s
    Shared users:
      SharedUser [android.uid.system] (d6d5db):
        userId=10012
        install permissions:
          android.permission.ACCESS_CACHE_FILESYSTEM: granted=true
        User 0:
          gids=[2001, 1065, 1023, 3003, 3007, 1024]
    ```
    
*   **dumpsys package check-permission**
    
    检查对应的包是否已经获得对应的权限
    
    ```shell
    Hi3751V350:/ # dumpsys package check-permission android.permission.WRITE_EXTERNAL_STORAGE com.demo.test
      0
    Hi3751V350:/ # dumpsys package check-permission android.permission.INTERNET com.demo.test
    -1
    ```
    

## dumpsys power

可以查看电池状态

```shell
mBatteryLevel=100 // 电量
mLowPowerModeEnabled=false //是否处于省电模式
mBatteryLevelLow=false //电池是否底
```

## dumpsys procstats

可以查看应用运行时的 PSS、USS数据，包括最小值、平均值、最大值，例如查看过去一小时内存使用情况，其中数据部分是按照（最小PSS-平均PSS-最大PSS/最小USS-平均USS-最大USS）的格式显示出PSS和USS

```shell
generic_x86:/ $ dumpsys procstats --hours 1
AGGREGATED OVER LAST 1 HOURS:
  * com.android.inputmethod.latin / u0a56 / v24:
           TOTAL: 100% (17MB-14MB-17MB/14MB-14MB-14MB over 2)
          Imp Bg: 100% (17MB-14MB-17MB/14MB-14MB-14MB over 2)

Memory usage:
	...	 //	系统内存占比情况
  CchEmty: 109MB (16 samples)
  TOTAL  : 516MB
```

## dumpsys window

*   **dumpsys window l**
    
    （或者 dumpsys window lastanr）用于打印当前窗口信息 
    

```shell
WINDOW MANAGER LAST ANR (dumpsys window lastanr)
  <no ANR has occurred since boot> // 获取ANR的信息，具体log可见 /data/anr/ 路径下
```

*   **dumpsys window p**
    
    获取当前采用的政策状态，比如获取焦点的window、app

```shell
#dumpsys window命令帮助信息
$ dumpsys window -h
#查看上一次ANR信息()
$ dumpsys window l
#查看Window策略状态
$ dumpsys window p
#查看Window的动画状态
$ dumpsys window a
#查看Window的活动会话
$ dumpsys window s
#查看Window的活跃的显示内容
$ dumpsys window d
#查看Window的token列表
$ dumpsys window t
#查看Window列表
$ dumpsys window w
#获取当前活动的包名和类名
$ dumpsys window | grep  mCurrentFocus
```

## **dumpsys battery**

```shell
Current Battery Service state:
  AC powered: false #false表示没使用AC电源
  USB powered: true #true表示使用USB电源
  Wireless powered: false #false表示没使用无线电源
  Dock powered: false #false表示不能为其他设备提供电力
  Max charging current: 500000 #最大充电电流500000微安
  Max charging voltage: 4600000 #最充电电压4600000微伏
  Charge counter: 2946000
  status: 2 #2表示电池正在充电，1表示没充电
  health: 2 #2表示电池状态优秀
  present: true #true表示已安装电池
  level: 100 #电池百分比
  scale: 100 #满电量时电池百分比为100%（不确定是否正确）
  voltage: 4399 #电池电压4.399V
  temperature: 311 #电池温度为31.1摄氏度
  technology: Li-ion #电池类型为锂电池
```

- **dumpsys battery unplug 模拟断开充电**
- **dumpsys battery set ac 1  用交流充电器充电**
- **dumpsys battery set usb 1  用USB充电**
- **dumpsys battery set wireless 1  无线充电**
- **dumpsys battery set status 2 设置为电池状态** **2表示：充电状态 ，其他数字为非充电状态**
- **dumpsys battery set level 80 设置电量百分比**
- **dumpsys battery  reset  命令重置  电池电量就恢复到实际值了**

## dump代码路径

**代码路径：``frameworks/base/core/java/android/content/Context.java`**
这个代码里面有很多serviceName

```java
    @StringDef(suffix = { "_SERVICE" }, value = {
            POWER_SERVICE,
            //@hide: POWER_STATS_SERVICE,
            WINDOW_SERVICE,
            LAYOUT_INFLATER_SERVICE,
            ACCOUNT_SERVICE,
            ACTIVITY_SERVICE,
            ALARM_SERVICE,
            NOTIFICATION_SERVICE,
            ACCESSIBILITY_SERVICE,
            CAPTIONING_SERVICE,
            KEYGUARD_SERVICE,
            LOCATION_SERVICE,
            HEALTHCONNECT_SERVICE,
            //@hide: COUNTRY_DETECTOR,
            SEARCH_SERVICE,
            SENSOR_SERVICE,
            SENSOR_PRIVACY_SERVICE,
            STORAGE_SERVICE,
            STORAGE_STATS_SERVICE,
            WALLPAPER_SERVICE,
            VIBRATOR_MANAGER_SERVICE,
            VIBRATOR_SERVICE,
            //@hide: STATUS_BAR_SERVICE,
            CONNECTIVITY_SERVICE,
            PAC_PROXY_SERVICE,
            VCN_MANAGEMENT_SERVICE,
            //@hide: IP_MEMORY_STORE_SERVICE,
            IPSEC_SERVICE,
            VPN_MANAGEMENT_SERVICE,
            TEST_NETWORK_SERVICE,
            //@hide: UPDATE_LOCK_SERVICE,
            //@hide: NETWORKMANAGEMENT_SERVICE,
            NETWORK_STATS_SERVICE,
            //@hide: NETWORK_POLICY_SERVICE,
            WIFI_SERVICE,
            WIFI_AWARE_SERVICE,
            WIFI_P2P_SERVICE,
            WIFI_SCANNING_SERVICE,
            //@hide: LOWPAN_SERVICE,
            //@hide: WIFI_RTT_SERVICE,
            //@hide: ETHERNET_SERVICE,
            WIFI_RTT_RANGING_SERVICE,
            NSD_SERVICE,
            AUDIO_SERVICE,
            AUDIO_DEVICE_VOLUME_SERVICE,
            AUTH_SERVICE,
            FINGERPRINT_SERVICE,
            //@hide: FACE_SERVICE,
            BIOMETRIC_SERVICE,
            MEDIA_ROUTER_SERVICE,
            TELEPHONY_SERVICE,
            TELEPHONY_SUBSCRIPTION_SERVICE,
            CARRIER_CONFIG_SERVICE,
            EUICC_SERVICE,
            //@hide: MMS_SERVICE,
            TELECOM_SERVICE,
            CLIPBOARD_SERVICE,
            INPUT_METHOD_SERVICE,
            TEXT_SERVICES_MANAGER_SERVICE,
            TEXT_CLASSIFICATION_SERVICE,
            APPWIDGET_SERVICE,
            //@hide: VOICE_INTERACTION_MANAGER_SERVICE,
            //@hide: BACKUP_SERVICE,
            REBOOT_READINESS_SERVICE,
            ROLLBACK_SERVICE,
            DROPBOX_SERVICE,
            //@hide: DEVICE_IDLE_CONTROLLER,
            //@hide: POWER_WHITELIST_MANAGER,
            DEVICE_POLICY_SERVICE,
            UI_MODE_SERVICE,
            DOWNLOAD_SERVICE,
            NFC_SERVICE,
            BLUETOOTH_SERVICE,
            //@hide: SIP_SERVICE,
            USB_SERVICE,
            LAUNCHER_APPS_SERVICE,
            //@hide: SERIAL_SERVICE,
            //@hide: HDMI_CONTROL_SERVICE,
            INPUT_SERVICE,
            DISPLAY_SERVICE,
            //@hide COLOR_DISPLAY_SERVICE,
            USER_SERVICE,
            RESTRICTIONS_SERVICE,
            APP_OPS_SERVICE,
            ROLE_SERVICE,
            //@hide ROLE_CONTROLLER_SERVICE,
            CAMERA_SERVICE,
            //@hide: PLATFORM_COMPAT_SERVICE,
            //@hide: PLATFORM_COMPAT_NATIVE_SERVICE,
            PRINT_SERVICE,
            CONSUMER_IR_SERVICE,
            //@hide: TRUST_SERVICE,
            TV_INTERACTIVE_APP_SERVICE,
            TV_INPUT_SERVICE,
            //@hide: TV_TUNER_RESOURCE_MGR_SERVICE,
            //@hide: NETWORK_SCORE_SERVICE,
            USAGE_STATS_SERVICE,
            MEDIA_SESSION_SERVICE,
            MEDIA_COMMUNICATION_SERVICE,
            BATTERY_SERVICE,
            JOB_SCHEDULER_SERVICE,
            //@hide: PERSISTENT_DATA_BLOCK_SERVICE,
            //@hide: OEM_LOCK_SERVICE,
            MEDIA_PROJECTION_SERVICE,
            MIDI_SERVICE,
            RADIO_SERVICE,
            HARDWARE_PROPERTIES_SERVICE,
            //@hide: SOUND_TRIGGER_SERVICE,
            SHORTCUT_SERVICE,
            //@hide: CONTEXTHUB_SERVICE,
            SYSTEM_HEALTH_SERVICE,
            //@hide: INCIDENT_SERVICE,
            //@hide: INCIDENT_COMPANION_SERVICE,
            //@hide: STATS_COMPANION_SERVICE,
            COMPANION_DEVICE_SERVICE,
            VIRTUAL_DEVICE_SERVICE,
            CROSS_PROFILE_APPS_SERVICE,
            //@hide: SYSTEM_UPDATE_SERVICE,
            //@hide: TIME_DETECTOR_SERVICE,
            //@hide: TIME_ZONE_DETECTOR_SERVICE,
            PERMISSION_SERVICE,
            LIGHTS_SERVICE,
            LOCALE_SERVICE,
            //@hide: PEOPLE_SERVICE,
            //@hide: DEVICE_STATE_SERVICE,
            //@hide: SPEECH_RECOGNITION_SERVICE,
            UWB_SERVICE,
            MEDIA_METRICS_SERVICE,
            //@hide: ATTESTATION_VERIFICATION_SERVICE,
            //@hide: SAFETY_CENTER_SERVICE,
            DISPLAY_HASH_SERVICE,
            CREDENTIAL_SERVICE,
            DEVICE_LOCK_SERVICE,
            VIRTUALIZATION_SERVICE,
            GRAMMATICAL_INFLECTION_SERVICE,

    })
```

我们只需要根据这些常量找到对应的名称即可，比如输入法：

```java
    /**
     * Use with {@link #getSystemService(String)} to retrieve a
     * {@link android.view.inputmethod.InputMethodManager} for accessing input
     * methods.
     *
     * @see #getSystemService(String)
     */
    public static final String INPUT_METHOD_SERVICE = "input_method";

```

我们可以看到，其实就是通过getSystemService方法中调用的字符常量，我们要dump输入法服务相关的命令就是`adb shell dumpsys input_method`

如果我们想知道这个dump的方法具体在哪，会有哪些打印，则只需通过对应Mananger找到对应的ManagerService即可。  
比如，我们这里以输入法为例，那么其对应的就是`InputMethodManagerService`，在这个里面就有对应的dump方法：  
代码路径：`frameworks/base/services/core/java/com/android/server/inputmethod/InputMethodManagerService.java`

```java
void dump(@NonNull PrintWriter pw, @NonNull String prefix) {
            final SimpleDateFormat dataFormat =
                    new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS", Locale.US);

            for (int i = 0; i < mEntries.length; ++i) {
                final Entry entry = mEntries[(i + mNextIndex) % mEntries.length];
                if (entry == null) {
                    continue;
                }
                pw.print(prefix);
                pw.println("SoftInputShowHideHistory #" + entry.mSequenceNumber + ":");

                pw.print(prefix);
                pw.println(" time=" + dataFormat.format(new Date(entry.mWallTime))
                        + " (timestamp=" + entry.mTimestamp + ")");

                pw.print(prefix);
                pw.print(" reason=" + InputMethodDebug.softInputDisplayReasonToString(
                        entry.mReason));
                pw.println(" inFullscreenMode=" + entry.mInFullscreenMode);

                pw.print(prefix);
                pw.println(" requestClient=" + entry.mClientState);

                pw.print(prefix);
                pw.println(" focusedWindowName=" + entry.mFocusedWindowName);

                pw.print(prefix);
                pw.println(" requestWindowName=" + entry.mRequestWindowName);

                pw.print(prefix);
                pw.println(" imeControlTargetName=" + entry.mImeControlTargetName);

                pw.print(prefix);
                pw.println(" imeTargetNameFromWm=" + entry.mImeTargetNameFromWm);

                pw.print(prefix);
                pw.print(" editorInfo: ");
                pw.print(" inputType=" + entry.mEditorInfo.inputType);
                pw.print(" privateImeOptions=" + entry.mEditorInfo.privateImeOptions);
                pw.println(" fieldId (viewId)=" + entry.mEditorInfo.fieldId);

                pw.print(prefix);
                pw.println(" focusedWindowSoftInputMode=" + InputMethodDebug.softInputModeToString(
                        entry.mFocusedWindowSoftInputMode));
            }
        }
    }
```







本文转自 [https://blog.csdn.net/to\_perfect/article/details/104920152](https://blog.csdn.net/to_perfect/article/details/104920152)，如有侵权，请联系删除。