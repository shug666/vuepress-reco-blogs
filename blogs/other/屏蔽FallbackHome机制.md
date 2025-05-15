---
title: 屏蔽FallbackHome机制
date: 2024-11-23
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 1.概述

在13.0的系统产品开发中，对产品的细节化要求也是常有功能

比如在首次开机开机动画播完进入Launcher桌面时黑屏进入Launcher

有黑屏不太美观，在重启以后会在进入桌面后会显示**android正在启动**等一会进入Launcher

这就是系统FallBackHome机制，由于产品开发需要要求去掉优化掉这两个功能

## 2.核心类

**屏蔽FallbackHome机制，去掉android正在启动直接进入默认Launcher功能实现的核心类**

```java
    frameworks/base/services/core/java/com/android/server/wm/WindowManagerService.java
    frameworks/base/services/core/java/com/android/server/wm/ActivityRecord.java
```

## 3.核心功能分析和实现

**屏蔽FallbackHome机制去掉android正在启动直接进入默认Launcher功能实现的核心功能分析和实现**

在系统中启动launcher之前会先启动FallBackHome，FallBackHome是在Setting中的一个Activity（透明Activity），配置了Home属性，Settings的`android:directBootAware`为true。所有只有FallbackHome可以在direct boot模式下启动，

在FallBackHome这个activity启动完成后,他会检测系统有没有解锁并且接收系统解锁的广播.如果系统还未解锁完成,那么他会一直等待这个广播,所以界面还是会黑. 如果系统解锁完成

那么他会查找系统内的launcher,如果找到,那么会直接跳转到新launcher并且将自己finish掉. 如果没有找到,那么他会每隔500ms继续检测一次,直到找到新launcher,在这期间也是黑屏的

在android系统中，在准备播放完开机动画以后，经过一系列处理后，会在WindowManagerService.java中，等进入系统解锁阶段以后，进入到
结束开机动画等操作，然后就进入Launcher的流程，接下来就看下WindowManagerService的相关代码

### 3.1 WindowManagerService.java

**WindowManagerService.java中关于系统解锁，停止开机动画的相关操作流程分析**

Android WindowManagerService(窗口管理服务)是Android操作系统的关键组件之一,负责管理应用程序窗口的创建、显示、更新和销毁，
Activity组件在其窗口对象和视图对象创建完成之后，就会请求与WindowManagerService建立一个连接，即请求WindowManagerService为
其增加一个WindowState对象，用来描述它的窗口状态

WindowManagerService的职责 1.窗口管理：窗口的管理者，负责窗口的启动，添加和删除，窗口的大小，层级等功能

```java
void enableScreenIfNeededLocked() {
	ProtoLog.i(WM_DEBUG_BOOT, "enableScreenIfNeededLocked: mDisplayEnabled=%b "
				  + "mForceDisplayEnabled=%b mShowingBootMessages=%b mSystemBooted=%b. "
				  + "%s",
		  mDisplayEnabled, mForceDisplayEnabled, mShowingBootMessages, mSystemBooted,
		  new RuntimeException("here").fillInStackTrace());
	if (mDisplayEnabled) {
	  return;
	}
	if (!mSystemBooted && !mShowingBootMessages) {
	  return;
	}
	mH.sendEmptyMessage(H.ENABLE_SCREEN);
}
```

在屏蔽FallbackHome机制去掉android正在启动直接进入默认Launcher功能实现中，在上述的源码中分析得知，在WindowManagerService.java的上述代码可以发现，在系统准备解锁以后会调用enableScreenIfNeededLocked()来进行准备屏幕亮屏操作和发送H.ENABLE_SCREEN进行相关操作，接下来看下相关代码

```java
case ENABLE_SCREEN: {
  performEnableScreen();
  break;
}

case APP_FREEZE_TIMEOUT: {
  synchronized (mGlobalLock) {
	  ProtoLog.w(WM_ERROR, "App freeze timeout expired.");
	  mWindowsFreezingScreen = WINDOWS_FREEZING_SCREENS_TIMEOUT;
	  for (int i = mAppFreezeListeners.size() - 1; i >= 0; --i) {
		  mAppFreezeListeners.get(i).onAppFreezeTimeout();
	  }
  }
  break;
}

case CLIENT_FREEZE_TIMEOUT: {
  synchronized (mGlobalLock) {
	  if (mClientFreezingScreen) {
		  mClientFreezingScreen = false;
		  mLastFinishedFreezeSource = "client-timeout";
		  stopFreezingDisplayLocked();
	  }
  }
  break;
}
```

在屏蔽FallbackHome机制去掉android正在启动直接进入默认Launcher功能实现中，在上述的源码中分析得知，
在WindowManagerService.java的上述代码可以发现，可以看到在case ENABLE_SCREEN是调用performEnableScreen();通过在performEnableScreen()中来具体处理
关于屏幕亮屏的相关功能，然后进入Launcher后进行主屏幕进行相关的操作，接下来看performEnableScreen();的相关方法

```java
private void performEnableScreen() {
	synchronized (mGlobalLock) {
	....

	  // Don't enable the screen until all existing windows have been drawn.
	  if (!mForceDisplayEnabled) {
		  if (mBootWaitForWindowsStartTime < 0) {
			  // First time we will start waiting for all windows to be drawn.
			  mBootWaitForWindowsStartTime = SystemClock.elapsedRealtime();
		  }
		  for (int i = mRoot.getChildCount() - 1; i >= 0; i--) {
			  if (mRoot.getChildAt(i).shouldWaitForSystemDecorWindowsOnBoot()) {
				  return;
			  }
		  }
		  long waitTime = SystemClock.elapsedRealtime() - mBootWaitForWindowsStartTime;
		  mBootWaitForWindowsStartTime = -1;
		  if (waitTime > 10) {
			  ProtoLog.i(WM_DEBUG_BOOT,
					  "performEnableScreen: Waited %dms for all windows to be drawn",
					  waitTime);
		  }
	  }
	// 修改代码开始
	  LockPatternUtils lockPatternUtils = new LockPatternUtils(mContext);
	if(lockPatternUtils.isSecure(mCurrentUserId)){

	if (!mBootAnimationStopped) {
		  Trace.asyncTraceBegin(TRACE_TAG_WINDOW_MANAGER, "Stop bootanim", 0);
		  // stop boot animation
		  // formerly we would just kill the process, but we now ask it to exit so it
		  // can choose where to stop the animation.
		  SystemProperties.set("service.bootanim.exit", "1");
		  mBootAnimationStopped = true;
	  }

	  if (!mForceDisplayEnabled && !checkBootAnimationCompleteLocked()) {
		  ProtoLog.i(WM_DEBUG_BOOT, "performEnableScreen: Waiting for anim complete");
		  return;
	  }

	  try {
		  IBinder surfaceFlinger = ServiceManager.getService("SurfaceFlinger");
		  if (surfaceFlinger != null) {
			  ProtoLog.i(WM_ERROR, "******* TELLING SURFACE FLINGER WE ARE BOOTED!");
			  Parcel data = Parcel.obtain();
			  data.writeInterfaceToken("android.ui.ISurfaceComposer");
			  surfaceFlinger.transact(IBinder.FIRST_CALL_TRANSACTION, // BOOT_FINISHED
					  data, null, 0);
			  data.recycle();
		  }
	  } catch (RemoteException ex) {
		  ProtoLog.e(WM_ERROR, "Boot completed: SurfaceFlinger is dead!");
	  }
	}
	   // 修改代码结束

	  EventLogTags.writeWmBootAnimationDone(SystemClock.uptimeMillis());
	  Trace.asyncTraceEnd(TRACE_TAG_WINDOW_MANAGER, "Stop bootanim", 0);
	  mDisplayEnabled = true;
	  ProtoLog.i(WM_DEBUG_SCREEN_ON, "******************** ENABLING SCREEN!");

	  // Enable input dispatch.
	  mInputManagerCallback.setEventDispatchingLw(mEventDispatchingEnabled);
	}

	try {
	  mActivityManager.bootAnimationComplete();
	} catch (RemoteException e) {
	}

	mPolicy.enableScreenAfterBoot();

	// Make sure the last requested orientation has been applied.
	updateRotationUnchecked(false, false);
}
```

**在屏蔽FallbackHome机制去掉android正在启动直接进入默认Launcher功能实现中，在上述的源码中分析得知**

在WindowManagerService.java的上述代码可以发现，在performEnableScreen() 中开始调用结束开机动画的方法，然后通过`SystemProperties.set("service.bootanim.exit", "1");`来设置结束开机动画的标志，但是在这时候结束，还没完全结束
会进入FallbackHome模式，会出现android正在启动，所以需要判断当前是否设置了屏幕锁屏密码相关代码然后决定是否执行这段代码，在进入Launcher启动的时候，调用结束开机动画的，在结束开机动画就可以了.

### 3.2 ActivityRecord.java

**ActivityRecord.java的关于启动Launcher后，结束开机动画的相关代码分析**

> ActivityRecord是Activity在SystemService中的实现。
>
> ActivityRecord同步着Activity的生命周期，记录了Activity的关键信息。
>
> ActivityRecord参与了窗口显示、尺寸、图层等很多在SystemService的逻辑操作，是应用在SystemService最重要的基本单元之一
>
> ActivityRecord历史栈中的一个条目,代表一个activity
>
> ActivityRecord的属性中,有一个类型为Task的task属性,它描述了当前Activity所属的任务栈

```java
@VisibleForTesting
void setVisibility(boolean visible, boolean deferHidingClient) {
	final AppTransition appTransition = getDisplayContent().mAppTransition;

	....

	// If in a transition, defer commits for activities that are going invisible
	if (!visible && mAtmService.getTransitionController().inTransition()) {
	  return;
	}
	final boolean recentsAnimating = isAnimating(PARENTS, ANIMATION_TYPE_RECENTS);
	if (okToAnimate(true /* ignoreFrozen */, canTurnScreenOn())
		  && (appTransition.isTransitionSet()
		  || (recentsAnimating && !isActivityTypeHome()))) {
	  if (visible) {
		  displayContent.mOpeningApps.add(this);
		  mEnteringAnimation = true;
	  } else if (mVisible) {
		  displayContent.mClosingApps.add(this);
		  mEnteringAnimation = false;
	  }
	  if ((appTransition.getTransitFlags() & TRANSIT_FLAG_OPEN_BEHIND) != 0) {
		  // We're launchingBehind, add the launching activity to mOpeningApps.
		  final WindowState win = getDisplayContent().findFocusedWindow();
		  if (win != null) {
			  final ActivityRecord focusedActivity = win.mActivityRecord;
			  if (focusedActivity != null) {
				  ProtoLog.d(WM_DEBUG_APP_TRANSITIONS,
						  "TRANSIT_FLAG_OPEN_BEHIND,  adding %s to mOpeningApps",
						  focusedActivity);

				  // Force animation to be loaded.
				  displayContent.mOpeningApps.add(focusedActivity);
			  }
		  }
	  }
	  return;
	}

	commitVisibility(visible, true /* performLayout */);
	updateReportedVisibilityLocked();
}
```

在屏蔽FallbackHome机制去掉android正在启动直接进入默认Launcher功能实现中，在上述的源码中分析得知

在ActivityRecord.java的上述代码中可以看到在setVisibility(boolean visible, boolean deferHidingClient) 是在进入亮屏后调用的相关方法来准备进入Launcher中，接下来看下 updateReportedVisibilityLocked()相关方法

```java
/** Called when the windows associated app window container are drawn. */
private void onWindowsDrawn(long timestampNs) {
	final TransitionInfoSnapshot info = mTaskSupervisor
		  .getActivityMetricsLogger().notifyWindowsDrawn(this, timestampNs);
	final boolean validInfo = info != null;
	final int windowsDrawnDelayMs = validInfo ? info.windowsDrawnDelayMs : INVALID_DELAY;
	final @WaitResult.LaunchState int launchState =
		  validInfo ? info.getLaunchState() : WaitResult.LAUNCH_STATE_UNKNOWN;
	if (validInfo || this == getDisplayArea().topRunningActivity()) {
	  mTaskSupervisor.reportActivityLaunched(false /* timeout */, this,
			  windowsDrawnDelayMs, launchState);
	}
	finishLaunchTickingLocked();
	if (task != null) {
	  task.setHasBeenVisible(true);
	}
	mLaunchRootTask = null;
	// add core start
	if (isHomeIntent(intent) && shortComponentName != null && !shortComponentName.contains("FallbackHome")) {
	SystemProperties.set("service.bootanim.exit", "1");
	android.util.Log.e("ActivityRecord","real home....." + shortComponentName);
	LockPatternUtils mLockPatternUtils = new LockPatternUtils(mAtmService.mContext);
	if(!mLockPatternUtils.isSecure(mUserId)){

	try {
		IBinder surfaceFlinger = ServiceManager.getService("SurfaceFlinger");
		if (surfaceFlinger != null) {
			Slog.i(TAG_WM, "******* TELLING SURFACE FLINGER WE ARE BOOTED!");
			Parcel data = Parcel.obtain();
			data.writeInterfaceToken("android.ui.ISurfaceComposer");
			surfaceFlinger.transact(IBinder.FIRST_CALL_TRANSACTION, // BOOT_FINISHED
			data, null, 0);
			data.recycle();
		}
	} catch (RemoteException ex) {
	   Slog.e(TAG, "Boot completed: SurfaceFlinger is dead!");
	}
		}
	}
	// add code end
}
```

在屏蔽FallbackHome机制去掉android正在启动直接进入默认Launcher功能实现中，在上述的源码中分析得知

在ActivityRecord的源码中 , 一个ActivityRecord对应一个Activity,保存了一个Activity的所有信息,所以在进入默认Launcher页面后

会调用onWindowsDrawn(long timestampNs)进行页面的绘制情况，所以在onWindowsDrawn(long timestampNs)中可以在这里根据shortComponentName的值和判断当前是否设置了屏幕锁屏密码来退出开机动画，然后启动SurfaceFlinger等相关binder启动触摸手势等功能
