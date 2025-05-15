---
title: 常见dumpsys方法与黑屏问题分析处理总结
date: 2025-01-23
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 黑屏问题介绍

黑屏问题是显示相关的综合性问题，涉及Android应用层、框架层和底层SurfaceFlinger、屏显等多个领域。下面有一些基础的判断来定位黑屏问题的归属：  

(1) 屏幕没有亮屏、背光为0则需先从power、屏显角度分析  

(2) 屏幕黑屏，但可以进行三指截屏、power键+音量下键截屏，并且截图正常显示(非黑图)，则需先从屏显角度分析  

(3) 视频类、相机类显示黑屏，需要先确认编解码、阅览显示问题  

(4) 应用界面局部性黑块，某个控件黑，确认应用的view问题

## 常见分析手段

从显示系统入手，软件架构从上到下分层，黑屏问题主要分为应用领域、窗口领域、SF&屏显&底软领域黑屏；分析黑屏问题，首先确认黑屏的是哪个界面(layer)，然后才确认造成该界面黑的原因；而分析手段主要是通过dump数据、Activity生命周期、systrace、截图的raw数据、窗口绘制状态、视频操作等。

### SurfaceFlinger

**`adb shell dumpsys SurfaceFlinger > SurfaceFlinger.txt`**  

确认当前的dump SurfaceFlinger数据对应黑屏现象的时间点  

首先，确认HWC layers合成显示的图层是否为对应黑屏时应该显示的应用图层；接着，核查是否存在焦点图层【focused】（有星号的表示有焦点图层），该图层是否对应所需的显示图层；然后，核对位置【Disp Frame (LTRB)】、大小【Source Crop (LTRB)】、旋转角度【 Frame Rate 】是否正常。  
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images99d41606feced003fc9290b79b2839e8.png)  
相关代码位置：`/frameworks/native/services/surfaceflinger/SurfaceFlinger.cpp` 中的dump相关方法，如:dumpHwcLayersMinidumpLocked、dumpAllLocked等。  

如果启动某个应用黑屏，而当前SurfaceFlinger.txt的layer不存在该应用的layer，那需要进一步确认显示buffer的数据是否正常。

从上面的SurfaceFlinger.txt dump 数据可以看出，BufferStateLayer表示当前绘图窗口，ContainerLayer是其父容器，不会有绘图buffer，父子是从上到下层次树形成；BufferStateLayer的绘图buffer是activeBuffer，该处可以看出已经完成绘图，而未完成绘图状态：**activeBuffer=\[ 0x 0: 0,Unknown/None\]**。

```shell
+ BufferStateLayer (com.example.mysystemdialog/com.example.mysystemdialog.MainActivity#117) uid=10117
  Region TransparentRegion (this=0 count=0)
  Region VisibleRegion (this=0 count=1)
    [  0,   0, 1440, 2960]
  Region SurfaceDamageRegion (this=0 count=0)
      layerStack=   0, z=        0, pos=(0,0), size=(1440,2960), crop=[  0,   0,   0,   0], cornerRadius=0.000000, isProtected=0, isTrustedOverlay=0, isOpaque=0, invalidate=0, dataspace=Default, defaultPixelFormat=RGBA_8888, backgroundBlurRadius=0, color=(0.000,0.000,0.000,1.000), flags=0x00000100, tr=[0.00, 0.00][0.00, 0.00]
      parent=9f63fd7 com.example.mysystemdialog/com.example.mysystemdialog.MainActivity#116
      zOrderRelativeOf=none
      activeBuffer=[0x0:0,Unknown/None], tr=[0.00, 0.00][0.00, 0.00] queued-frames=0 metadata={dequeueTime:97987454113, windowType:1, ownerPID:2202, ownerUID:10117}, cornerRadiusCrop=[0.00, 0.00, 0.00, 0.00],  shadowRadius=0.000, 
```

相关代码位置：`frameworks/native/libs/gui/LayerDebugInfo.cpp`  

另外我们还需要重点关注两个参数:color和flags，color的最后一个参数表示alpha，如果该参数为0，该图层也是不会显示的；flag参数在2进制状态的末位bit表示可见性，1表示不可见，0表示可见。也可以总结为flag是偶数表示图层可见，是奇数表示图层不可见。

### window -a

**`adb shell dumpsys window -a > window .txt`**  

前面dump sf.txt没有对应的layer显示，那么可以查看dump window的数据，确认对应应用的窗口显示状态。搜索Window #，找到对应的Window。  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images6e79363df1aa01f88ccb6984392a303d.png)  

这里对应的Window为我自己的 应用界面，上面信息描述了该窗口的基本信息，重点需要关注mDrawState=HAS\_DRAWN，mDrawState为窗口的绘制状态，HAS\_DRAWN表示WMS已经完成该窗口的显示流程。其中，NO\_SURFACE、DRAW\_PENDING这两个状态表示应用端没有完成对应的surface申请和绘制，此类问题需要应用端查看；COMMIT\_DRAW\_PENDING、READY\_TO\_SHOW，表示应用端已经完成绘制并上报状态给WMS，则需要WMS查看显示控制流程。  

isOnScreen=true、isVisible=true这两个变量也很重要，确认当前窗口已经是可见，并显示到屏幕上；其他的，如请求宽高、frame大小、位置也可以一一确认。  

窗口流程见： [WMS窗口相关流程](https://blog.csdn.net/yimelancholy/article/details/130339779)

### activity activities

**`adb shell dumpsys activity activities > activities.txt`**  

`dumpsys activity activities`可以确认当前启动的activity显示状态。该数据，从top遍历到bottom，从Task到里面的activity，把activity的信息，包含属于哪个应用、由谁启动、通过哪个Intent等。其中，确认该acitivity的窗口是否正常绘制，主要看信息mNumInterestingWindows=1 mNumDrawnWindows=1 allDrawn=true。  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesed489196fb6f1822229c411d7caf35dc.png)![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images3b025d49c8c1b9bfcc6f6186fc288b3a.png)  
mNumInterestingWindows表示需要绘图的窗口数目，mNumDrawnWindows表示已经完成绘图的窗口数目。这里都为1表示已经完成绘图。这里里面可以看到很多信息，例如：  

Keyguard的显示状态  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images1b4b243b6a73764216b6de5e2af9a415.png)InsetsState状态  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesfea484553bb9f1d15cfdc868f8034b57.png)Display areas z order  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesb3b8d4487ae266660f283cc0b35c7963.png)

### activity containers

**`adb shell dumpsys activity containers > containers.txt`**

`dumpsys activity containers`可以确认当前窗口的层级结构的状态。

![图片.png](https://raw.githubusercontent.com/shug666/image/main/images75b3409e17c74e34dd51b97365ca0981.png)

### activity top

**`adb shell dumpsys activity top > top_activity.txt`**  

当启动应用黑屏，使用raw工具可以确认应用绘制送帧为黑色，也可以找到有问题的acitivity对比dump activity top的View Hierarchy:层级树，对比正常的是否加载。  
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images213d2b02d35281b7bbfe69195ac278f1.png)

### activity 生命周期，event.log

通过 event.log分析activity生命周期情况，确认应用的activity是否执行了onResume，focus是否切换到焦点窗口，甚至应用存在anr等情况。  

关键log：`wm_on | input_focus`

### 其他方法

[android trace和backtrace文件的抓取与查看方法](https://blog.csdn.net/yimelancholy/article/details/134646726?spm=1001.2014.3001.5502)

分析步骤
--------------------------------------------------------------------------------------------

分析方法有很多根据个人习惯分析即可

### 确认问题现象

通过录屏来观察黑屏的过程，确认问题时间点  
如果在录像过程中，有对黑屏现象截图，发现截图正常，但是屏幕是黑的，可以直接判断为屏显问题

### dump关键log

```shell
adb shell dumpsys SurfaceFlinger > ./dump/SurfaceFlinger.txt
adb shell dumpsys window -a > ./dump/window.txt
adb shell dumpsys activity activities > ./dump/activities.txt
adb shell dumpsys activity top > ./dump/top_activity.txt
adb shell dumpsys activity containers > ./dump/containers.txt
adb shell dumpsys input > ./dump/input.txt
```

### 找到问题窗口

可以通过dump的SurfaceFlinger 、window 找到问题窗口

### 分析dump信息

同样不分先后顺序，按个人习惯即可。

#### 1、SurfaceFlinger

①看SurfaceFlinger中是否有对应的图层，即是否合成显示，如果没有可以先看dump的window，见第2步  
②有图层则通过id找到对应的Layer和BufferStateLayer  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images18137e9e8b447fea773c9c5e9f8e5673.png)![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images314ec10e0d3be862613628299182b525.png)我们可以看到Layer 后有一串16进制数，同这个可以在log文件里面找到对应raw文件，使用irfanview工具，看其图层内容，如果本身就是黑屏，大概率是应用问题，见第2步、第3步可以进一步确认

游戏类的应用也类似  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesc52c2c86c0f59d94bb1d73d062d6477c.png)

```shell
+ Layer (SurfaceView[com.miHoYo.hkrpg/com.mihoyo.combosdk.ComboSDKActivity](BLAST)#7353) uid=10231
  Region TransparentRegion (this=0 count=0)
  Region VisibleRegion (this=0 count=1)
    [  0,   0, 3200, 1440]
  Region SurfaceDamageRegion (this=0 count=0)
      layerStack=   0, z=        0, pos=(0,0), size=(   0,   0), crop=[  0,   0,  -1,  -1], cornerRadius=0.000000, smoothness=0.000000, isProtected=0, isTrustedOverlay=0, isOpaque=1, invalidate=0, dataspace=BT709 sRGB Full range, defaultPixelFormat=RGBA_8888, backgroundBlurRadius=0, color=(-1.000,-1.000,-1.000,1.000), flags=0x00000502, tr=[0.00, 0.00][0.00, 0.00]
      parent=SurfaceView[com.miHoYo.hkrpg/com.mihoyo.combosdk.ComboSDKActivity]#7352
      zOrderRelativeOf=none
      activeBuffer=[1440x3200:268437760,RGBA_8888], tr=[0.00, 0.00][0.00, 0.00] queued-frames=0 metadata={dequeueTime:28367775301729, callingUID:10231}, cornerRadiusCrop=[0.00, 0.00, 0.00, 0.00],  shadowRadius=0.000, 
```

**Display**表示哪块屏幕active，我们看activie的**hwc layers**，带SurfaceView的图层表示应用显示的内容，常见的视频、游戏等应用都有这个图层，该图层的是否显示主要是看其BufferStateLayer中的activeBuffer、flag  

`activeBuffer=[ 0x 0: 0,Unknown/None]`表示未完成绘图状态，我们这里是`activeBuffer=[1440x3200:268437760,RGBA_8888]`表示有数据显示  

flag为偶数表示图层可见，是奇数表示图层不可见，例如这里的flags=0x00000502表示可见

#### 2、window

找到有问题的窗口查看关键的参数  

mDrawState确认窗口绘制状态  

isOnScreen、isVisible当前窗口已经是可见，并显示到屏幕上  

NO\_SURFACE、DRAW\_PENDING这两个状态表示应用端没有完成对应的surface申请和绘制，此类问题需要应用端查看；COMMIT\_DRAW\_PENDING、READY\_TO\_SHOW，表示应用端已经完成绘制并上报状态给WMS，则需要WMS查看显示控制流程。

| 窗口显示相关方法 | 工作内容解释 |
| --- | --- |
| addWindow | App向WMS请求添加窗口记录，会在WMS里新建WindowState(NO\_SURFACE) |
| relayoutWindow | App向WMS申请surface用于绘制，执行后window拥有了surface(NO\_SURFACE->DRAW\_PENDING) |
| finishDrawingWindow | App在surface上完成绘制后，通知WMS(DRAW\_PENDING->COMMIT\_DRAW\_PENDING) |
| commitFinishDrawingLocked | WMS遍历window，对于完成绘制的window(COMMIT\_DRAW\_PENDING->READY\_TO\_SHOW) |
| performShowLocked | 判断系统是否允许窗口显示isReadyForDisplay(READY\_TO\_SHOW->HAS\_DRAWN) |
| showSurfaceRobustlyLocked | 对HAS\_DRAWN状态的窗口，用SurfaceControl通知SurfaceFlinger显示出来 |

如果dump上没有显示绘制状态则可以在日志中搜索：\*_windowmanager._mDrawState__

#### 3、activity

查看窗口层级  

`adb shell dumpsys activity containers`

查看View控件  

`adb shell dumpsys activity top > top\_activity.txt`  

对比正常的dump，查看View Hierarchy:层级树是否存在异常

#### 4、生命周期

在event.log中搜索wm\_和input\_focus查看应用生命周期是否已经走到了onresume，窗口焦点是否正常（Focus entering到了焦点）

#### 5、其他异常log

例如常见的ANR，OOM等

案例
------------------------------------------------------------------------------------------

### 抖音黑屏

1.视频播放输入输出数据正常  

2.dump SurfaceFlinger 中没有抖音图层  

3.dump window 中mDrawState为NO\_SURFACE  

4.应用生命周期有走到onresume流程，当前焦点窗口为空，与前面NO\_SURFACE对的上  

5.在日志中查看是否有异常log，发现有OOM(OutOfMemoryError)

 

  

本文转自 [https://blog.csdn.net/yimelancholy/article/details/130543872?spm=1001.2014.3001.5502](https://blog.csdn.net/yimelancholy/article/details/130543872?spm=1001.2014.3001.5502)，如有侵权，请联系删除。