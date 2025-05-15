---
title: Power键灭屏流程
date: 2025-01-20
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 1.整体框架介绍  

  ![](https://raw.githubusercontent.com/shug666/image/main/images640.png)

*   电源键亮灭屏流程从框架上分硬件层，驱动层，Java框架层和Natvie服务层；
*   整个流程分为两部分，一部分是电源按键事件传递流程，一部分是亮灭屏处理流程；
*   中间通过一个策略类来衔接，决定按键动作是做亮屏还是灭屏动作。

## 2.电源键传递流程

### 内核空间电源键传递流程

![](https://raw.githubusercontent.com/shug666/image/main/images250120-02.png)

各层的介绍如下：

*   设备驱动层：将底层的硬件输入转化为统一事件形式，向核心层传递；
*   核心层：为驱动层提供输入设备注册与操作接口，通知事件处理层对事件进行处理；
*   事件处理层：主要是和用户空间交互，提供设备节点来给用户空间访问；
*   用户空间: 从事件处理层获得事件，进行进一步的事件分发和业务处理。

![](https://raw.githubusercontent.com/shug666/image/main/imagesscreenshot-20250120-161850.png)

电源键的处理流程是：

1）按键驱动初始化的时候首先通过`request_irq`进行中断的注册；

2）当电源键按下和抬起时候，发生中断，中断处理函数被执行，调用input接口`input_report_key`和`input\_sync`来进行事件的上报；

3）事件通过核心层和事件层后，到达用户空间，这样用户空间的程序就可以通过`/dev/input`节点和`getEvents`获得按键事件。

### 用户空间电源键传递流程

![](https://raw.githubusercontent.com/shug666/image/main/images250120-03.png)

## PhoneWindowManager

当power键灭屏时，会在PhoneWindowManager中处理按键事件后，调用到PMS的gotoSleep()进行灭屏处理，下面直接看看PhoneWindowManger中对Power键灭屏的处理以及和PMS的交互。

当power键灭屏时，Power事件分发从`interceptKeyBeforeDispatching->interceptKeyBeforeQueueing`开始

灭屏是按下电源键后抬起的时候触发，流程这块主要看看`interceptPowerKeyUp`，做了一些长按和多次点击判断后，正常短按点击会跑到`PhoneWindowManager#powerPress`函数方法中

**gotoSleep方法**

`powerPress`进一步调用`sleepDefaultDisplayFromPowerButton -> sleepDefaultDisplay` 方法，进而调用到PowerManagerService的gotoSleep()进行灭屏处理的

> gotoSleep方法的参数和PowerManager,PhoneWindowManager中的同名方法对应，需要注意的是第二个参数和第三个参数；
> 第二个参数：表示灭屏原因，在PowerManager中定义了一些常量值来表示；
> 第三个参数：是一个标识，用来表示是否直接进入灭屏，一般的灭屏流程，都会先进入Doze状态，然后才会进入Sleep状态，如果将flag设置为1，则将会直接进入Sleep状态

接下来直接看PhoneWindowManger中对Power键灭屏的处理以及和PMS的交互。

**堆栈：**

```java
01-16 21:07:06.214 D/shugan  (29496): sleepDefaultDisplay -> 
01-16 21:07:06.214 D/shugan  (29496): java.lang.Exception
01-16 21:07:06.214 D/shugan  (29496):   at com.android.server.policy.PhoneWindowManager.sleepDefaultDisplay(PhoneWindowManager.java:1498)
01-16 21:07:06.214 D/shugan  (29496):   at com.android.server.policy.PhoneWindowManager.sleepDefaultDisplayFromPowerButton(PhoneWindowManager.java:1492)
01-16 21:07:06.214 D/shugan  (29496):   at com.android.server.policy.PhoneWindowManager.powerPress(PhoneWindowManager.java:1277)
01-16 21:07:06.214 D/shugan  (29496):   at com.android.server.policy.PhoneWindowManager.-$$Nest$mpowerPress(PhoneWindowManager.java:0)
01-16 21:07:06.214 D/shugan  (29496):   at com.android.server.policy.PhoneWindowManager$PowerKeyRule.onPress(PhoneWindowManager.java:3021)
01-16 21:07:06.214 D/shugan  (29496):   at com.android.server.policy.SingleKeyGestureDetector$KeyHandler.handleMessage(SingleKeyGestureDetector.java:476)
```

## PowerManagerService

在goToSleep()方法中，进行权限检查后调用**goToSleepInternal**方法。

`private void goToSleepInternal(long eventTime, int reason, int flags, int uid)` 

在调用PM.goToSleep()灭屏时，在除指定flag为`PowerManager.GO_TO_SLEEP_FLAG_NO_DOZE`的情况外，都会首先进入Doze，再由Doze进入Sleep。

也就是调用的dozePowerGroupLocked方法

> 在PMS中定义了四种屏幕状态：
>
> Awake状态：表示唤醒状态
> Dream状态：表示处于屏保状态
> Doze状态：表示处于Doze状态
> Asleep状态：表示处于休眠状态

## PowerGroup

dozeLocked方法中调用setWakefulnessLocked()方法用来设置wakefulness值，同时将会调用PowerManagerServices中onWakefulnessChangedLocked相关的逻辑，从而回调到PowerManagerService.java的回调监听onWakefulnessChangedLocked方法

onWakefulnessChangedLocked方法用来设置wakefulness值，将当前wakefulness设置为Doze状态，同时将会调用Notifier中wakefulness相关的逻辑

## Notifier

PowerManagerServices的onWakefulnessChangedLocked同时将会调用Notifier中wakefulness相关的逻辑

Notifier是PMS模块中用于进行“通知”的一个组件类，比如发送亮灭屏广播就是它来负责。针对于灭屏场景

在这个方法中，首先根据wakefulness值判断了系统当前的交互状态，如果是处于Awake状态和Dream状态，则表示可交互；如果处于Doze和Asleep状态，则表示不可交互；
由于已经设置了wakefulness为DOZE状态，因此此时处于不可交互状态，接下来开始执行handleEarlyInteractiveChange()方法：
在这个方法中，将调用mPolicy.startedGoingToSleep(why)进行锁屏流程(Keyguard的绘制)。

接着**回到了PhoneWindowManager**

在这个方法中，将调用mPolicy.startedGoingToSleep(why)进行锁屏流程(Keyguard的绘制)。

回到PMS中，在处理完WakeFulnes相关方法后，最主要的方法就是**updatePowerStateLocked**了，它是整个PMS的核心，在这里我们只看其灭屏时的一些处理。

**堆栈：**

```java
01-16 21:59:22.677 D/shugan  ( 4317): onWakefulnessChangedLocked -> 
01-16 21:59:22.677 D/shugan  ( 4317): java.lang.Exception
01-16 21:59:22.677 D/shugan  ( 4317):   at com.android.server.power.PowerManagerService$PowerGroupWakefulnessChangeListener.onWakefulnessChangedLocked(PowerManagerService.java:827)
01-16 21:59:22.677 D/shugan  ( 4317):   at com.android.server.power.PowerGroup.setWakefulnessLocked(PowerGroup.java:152)
01-16 21:59:22.677 D/shugan  ( 4317):   at com.android.server.power.PowerGroup.dozeLocked(PowerGroup.java:277)
01-16 21:59:22.677 D/shugan  ( 4317):   at com.android.server.power.PowerManagerService.dozePowerGroupLocked(PowerManagerService.java:2500)
01-16 21:59:22.677 D/shugan  ( 4317):   at com.android.server.power.PowerManagerService.goToSleepInternal(PowerManagerService.java:8040)java
01-16 21:59:22.677 D/shugan  ( 4317):   at com.android.server.power.PowerManagerService.-$$Nest$mgoToSleepInternal(PowerManagerService.java:0)
01-16 21:59:22.677 D/shugan  ( 4317):   at com.android.server.power.PowerManagerService$BinderService.goToSleep(PowerManagerService.java:6933)
```

## PowerManagerService#updatePowerStateLocked

接下来我们看updatePowerStateLocked，**在`updatePowerGroupsLocked`此方法里面处理上层亮灭屏亮度调整动画的的关键动作：**

```java
01-20 10:47:48.800 D/shugan  (15767): sendUpdatePowerStateLocked -> 
01-20 10:47:48.800 D/shugan  (15767): java.lang.Exception
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.display.DisplayPowerController.sendUpdatePowerStateLocked(DisplayPowerController.java:1033)
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.display.DisplayPowerController.requestPowerState(DisplayPowerController.java:862)
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.display.DisplayManagerService$LocalService.requestPowerState(DisplayManagerService.java:5214)
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.power.PowerGroup.updateLocked(PowerGroup.java:496)
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.power.PowerManagerService.updatePowerGroupsLocked(PowerManagerService.java:4461)
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.power.PowerManagerService.updatePowerStateLocked(PowerManagerService.java:2895)
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.power.PowerManagerService.acquireWakeLockInternal(PowerManagerService.java:1851)
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.power.PowerManagerService.-$$Nest$macquireWakeLockInternal(PowerManagerService.java:0)
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.power.PowerManagerService$BinderService.acquireWakeLock(PowerManagerService.java:6741)
01-20 10:47:48.800 D/shugan  (15767):   at android.os.PowerManager$WakeLock.acquireLocked(PowerManager.java:3949)
01-20 10:47:48.800 D/shugan  (15767):   at android.os.PowerManager$WakeLock.acquire(PowerManager.java:3914)
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.dreams.DreamManagerService.startDozingInternal(DreamManagerService.java:572)
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.dreams.DreamManagerService.-$$Nest$mstartDozingInternal(DreamManagerService.java:0)
01-20 10:47:48.800 D/shugan  (15767):   at com.android.server.dreams.DreamManagerService$BinderService.startDozing(DreamManagerService.java:1110)
01-20 10:47:48.800 D/shugan  (15767):   at android.service.dreams.IDreamManager$Stub.onTransact(IDreamManager.java:307)
01-20 10:47:48.800 D/shugan  (15767):   at android.os.Binder.execTransactInternal(Binder.java:1510)
01-20 10:47:48.800 D/shugan  (15767):   at android.os.Binder.execTransact(Binder.java:1454)
```

## DisplayPowerController/DisplayPowerState

具体调用`requestPowerState -> sendUpdatePowerStateLocked -> updatePowerState -> updatePowerStateInternal`

1. `updateDisplayPowerStateLocked`调用`requestPowerState`设置`mPendingRequestLocked`变量；
2. 调用`sendUpdatePowerStateLocked`发送`MSG_UPDATE_POWER_STATE`消息，`MSG_UPDATE_POWER_STATE`的消息处理里面调用`updatePowerState`；
3. `updatePowerState -> updatePowerStateInternal`调用`animateScreenStateChange`；
4. 根据状态判断后调用`setScreenState(Display.STATE_ON) -> DisplayPowerController::setScreenState() -> DisplayPowerState::setScreenState()`，通过`scheduleScreenUpdate`启动一个`mScreenUpdateRunnable`；
5. `mScreenUpdateRunnable`里面调用`mPhotonicModulator.setState(mScreenState, brightnessState)`,
6. 赋值`mPendingBacklight`变量后通知`PhotonicModulator`线程去处理，调用到`mBlanker.requestDisplayState`；
7. `DisplayManagerService`在`initPowerManagement`初始化的时候会注册`requestDisplayState`的处理，具体处理步骤是: `requestDisplayState -> requestDisplayStateInternal->updateDisplayStateLocked`；
8. `LocalDisplayAdapter::requestDisplayStateLocked`调用背光的设置函数`setDisplayBrightness`。

除了调用背光外，上层还会调用亮度过渡动画，下面两个参数是对应的亮屏/灭屏的动画速度

![image-20250120171349358](https://raw.githubusercontent.com/shug666/image/main/imagesimage-20250120171349358.png)

## SurfaceControl

至此SurfaceControl再通过native方法通过binder通信通知surfaceflinger设置背光。

![image-20250120165604041](https://raw.githubusercontent.com/shug666/image/main/imagesimage-20250120165604041.png)

SurfaceFlinger通过调用Hal层的实现，操作内核背光节点，从而完成背光的设置。

## AI总结

### 整体框架

灭屏流程涉及多个层次，包括硬件层、驱动层、Java框架层和Native服务层。整个流程可以分为两部分：电源键事件传递流程和灭屏处理流程，两者通过策略类衔接。

### 电源键传递流程

####  1.内核空间传递流程

1. **设备驱动层**：将硬件输入转换为统一事件形式，通过`input_report_key`和`input_sync`上报事件。
2. **核心层**：提供输入设备注册与操作接口，通知事件处理层。
3. **事件处理层**：提供`/dev/input`设备节点，供用户空间访问。
4. **用户空间**：通过`getEvents`获取事件，进行分发和处理。

#### 2.用户空间传递流程

电源键事件在用户空间被捕获后，传递到`PhoneWindowManager`进行处理。

### 1.PhoneWindowManager 处理

1. **事件分发**：电源键事件在`PhoneWindowManager`中被捕获，经过`interceptKeyBeforeDispatching`和`interceptKeyBeforeQueueing`处理。
2. **短按处理**：短按电源键触发`interceptPowerKeyUp`，进一步调用`powerPress`方法。
3. **灭屏调用链**：`powerPress`调用`sleepDefaultDisplayFromPowerButton`，再调用`sleepDefaultDisplay`，最终调用PowerManagerService的`gotoSleep()`方法。

### 2.PowerManagerService 处理

1. **权限检查**：`gotoSleep()`进行权限检查。
2. **进入Doze状态**：调用`goToSleepInternal`，设置wakefulness为Doze状态。
3. **进入Sleep状态**：在Doze状态基础上，进一步进入Sleep状态。

### 3.PowerGroup 和 Wakefulness 状态

1. **设置wakefulness**：在`PowerGroup`中设置wakefulness为Doze状态。
2. **通知变化**：通过`Notifier`通知系统状态变化，包括发送灭屏广播。

### 4.DisplayPowerController 处理

1. **亮度调整动画**：在`updatePowerStateLocked`中处理屏幕亮度调整动画。
2. **背光设置**：通过`DisplayPowerState`设置背光，最终通过SurfaceControl通知SurfaceFlinger。

### 5.SurfaceFlinger 处理

1. **背光设置**：SurfaceFlinger通过Hal层操作内核背光节点，完成背光设置。

### 6.关键路径和组件

- **电源键事件传递路径**：硬件 -> 驱动 -> 内核 -> 用户空间 -> PhoneWindowManager
- **灭屏处理路径**：`PhoneWindowManager -> PowerManagerService -> PowerGroup -> DisplayPowerController -> SurfaceFlinger`
- **关键组件**：
  - PhoneWindowManager: 处理电源键事件
  - PowerManagerService: 管理电源状态，控制屏幕唤醒和休眠
  - DisplayPowerController: 控制屏幕亮度和状态
  - SurfaceFlinger: 管理显示输出，设置背光



参考链接https://mp.weixin.qq.com/s/_yY5QejF1Ds17DPStfJoqQ
