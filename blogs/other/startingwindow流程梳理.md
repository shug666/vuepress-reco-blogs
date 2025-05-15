---
title: startingwindow流程梳理
date: 2025-01-23
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## startingwindow介绍

在activity真正显示之前，可能要处理大量耗时任务，如进程创建，资源加载，窗口绘制等。所以在窗口的过渡动画完成之后，可能应用还没有完成页面的绘制，我们需要一个页面来等待真正的activity显示。或者说窗口过渡的动画使用什么素材？

startingwindow的存在就是为了解决这样的问题，它是应用启动时窗口的一个过渡

### startingwindow的组成

和activity的窗口一样，Startingwindow也是又windowState和surface构成。窗口类型时`TYPE_APPLICATION_STARTING`，startingwindow类型有三种

```java
//不启动startingwindow，常见于应用内的activity切换
static final int STARTING_WINDOW_TYPE_NONE = 0;
//快照启动窗口，显示的内容为最近一次的可见内容的快照。使用场景如task从后台到前台的切换，屏幕解锁。
static final int STARTING_WINDOW_TYPE_SNAPSHOT = 1;
//闪屏启动窗口，显示的内容时空白的窗口，背景和应用的主题有关。使用场景如应用冷启动
static final int STARTING_WINDOW_TYPE_SPLASH_SCREEN = 2;
```

startingwindow的框架
---------------------------------------------------------------------------------

### 数据结构

**系统侧**

*   **Task**
    
    存放task的activityRecord的容器，也是处理activityRecord生命周期的主要参与者。startingwindow的启动流程起点就是task.startActivityLocked()  
    (注：Android12之后的版本已经没有ActivityStack这个类，ActivityStack和Task统一由Task表示,因此为task.startActivityLocked())
    
*   **ActivityRecord**
    
    系统进程中的Activity，也就是窗口容器，activity窗口和启动窗口都是它的child，因此启动窗口的添加和移除都是由ActivityRecord负责。
    
*   **WindowState**
    
    系统进程中的窗口，在窗口管理系统中时空指页面大小位置等属性的基本单元。startingwindow启动中回创建一个TYPE\_APPLICATION\_STARTING窗口类型的WindowState
    
*   **StartingData**
    
    抽象了startingwindow的数据模型，负责构造startingsurface
    
*   **SplashScreenStartingData**
    
    闪屏类型启动窗口的startingData实现，封装了闪屏类型启动窗口所需要的数据，如theme，icon，windowflags等等，这些数据来源于ActivityRecord。
    
*   **SnapshotStartingData**
    
    快照类型启动窗口的startingData实现，持有了TaskSnapshot
    
*   **StartingSurfaceController**  
    
    由TaskOrganizer.java和TaskOrganizerController.java打通从系统框架到wmshell的通路，从而与wmshell侧的StartingWindowController互交

**wmshell侧**

* **StartingWindowController** 
  startingwindow的添加和移除最终的调用都在这里

* **StartingSurfaceDrawer**  

  startingwindow的添加和移除的实现

### 代码编译

wmshell侧的代码修改`make SystemUI`编译即可  

`adb push SystemUI.apk /system_ext/priv-app/SystemUI`

### 流程简述

Startingwindow的创建时机在Activity的启动时。前面提到Activity的启动是需要一个空白页或者截图页面过渡的，所以在系统进程收到的Activity的启动请求时，根据不同的场景分配不同的启动窗口类型，绘制启动窗口  

startingwindow的移除时机在activity的绘制完成之后，当Activity完成绘制之后，Startingwindow的使命页结束了，所以移除。  
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesb61d37a9a9f782a9febe700ce83b9c55.png)

startingwindow的创建与移除主要是通过StartingWindowController的create和remove实现的。  

在Launcher启动App场景下，startingwindow的启动入口是ActivityStarter.startActivityLocked()或者Task.startActivityLocked()，移除入口是WindowManagerService.finishDrawing()  

在recents启动APP、屏幕解锁场景，startingwindow的启动和移除入口是其他通道，但内部实现一致。

### 添加流程

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesd094d577fb8e2a29ce3f62ba596e21a6.png)

### 移除流程

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesb204d2cc7f7dc2bf37e5686972f771b4.png)

startingwindow的添加
---------------------------------------------------------------------------------

### 前置流程

**1.启动或者切换到另一个界面，ATMS会执行startActivity()函数**  
关键代码：ActivityTaskManagerService.java中的startActivityAsUser方法返回值。ActivityStartController.java的obtainStarter方法，返回的ActivityStarter对象。即实际调用了ActivityStarter的execute方法

```java
 private int startActivityAsUser(IApplicationThread caller, String callingPackage,
            @Nullable String callingFeatureId, Intent intent, String resolvedType,
            IBinder resultTo, String resultWho, int requestCode, int startFlags,
            ProfilerInfo profilerInfo, Bundle bOptions, int userId, boolean validateIncomingUser) {
       ......

        // TODO: Switch to user app stacks here.
        return getActivityStartController().obtainStarter(intent, "startActivityAsUser")
                .setCaller(caller)
                .setCallingPackage(callingPackage)
                .setCallingFeatureId(callingFeatureId)
                .setResolvedType(resolvedType)
                .setResultTo(resultTo)
                .setResultWho(resultWho)
                .setRequestCode(requestCode)
                .setStartFlags(startFlags)
                .setProfilerInfo(profilerInfo)
                .setActivityOptions(bOptions)
                .setUserId(userId)
                .execute();

    }
```

ActivityStarter.java后续方法调用链  

`execute() -> executeRequest() -> startActivityUnchecked() -> startActivityInner() -> startActivityLocked()` 

startActivityInner中分两步走  

调用resumeFocusedTasksTopActivities()走Activity启动流程  

调用startActivityLocked()走启动窗口流程  

我们这里只关注启动窗口的流程

**2.系统会把activity添加到对应的task中，并调用activityRecord的showStartingWindow(),通知显示startingwindow**  

ActivityStarter.java中的startActivityLocked()调用的是Task.java中的startActivityLocked()

该方法中有一个关键变量boolean doShow = true;这个doShow指是否执行ActivityRecord.showStartingWindow方法，在某些场景下会被置为false

```java
    void startActivityLocked(ActivityRecord r, @Nullable Task topTask, boolean newTask,
            boolean isTaskSwitch, ActivityOptions options, @Nullable ActivityRecord sourceRecord) {
        	......
            boolean doShow = true;
            if (newTask) {
                // Even though this activity is starting fresh, we still need
                // to reset it to make sure we apply affinities to move any
                // existing activities from other tasks in to it.
                // If the caller has requested that the target task be
                // reset, then do so.
                if ((r.intent.getFlags() & Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED) != 0) {
                    resetTaskIfNeeded(r, r);
                    doShow = topRunningNonDelayedActivityLocked(null) == r;
                }
            } else if (options != null && options.getAnimationType()
                    == ActivityOptions.ANIM_SCENE_TRANSITION) {
                doShow = false;
            }
            if (r.mLaunchTaskBehind) {
                // Don't do a starting window for mLaunchTaskBehind. More importantly make sure we
                // tell WindowManager that r is visible even though it is at the back of the root
                // task.
                r.setVisibility(true);
                ensureActivitiesVisible(null, 0, !PRESERVE_WINDOWS);
                // Go ahead to execute app transition for this activity since the app transition
                // will not be triggered through the resume channel.
                mDisplayContent.executeAppTransition();
            } else if (SHOW_APP_STARTING_PREVIEW && doShow) {
                // Figure out if we are transitioning from another activity that is
                // "has the same starting icon" as the next one.  This allows the
                // window manager to keep the previous window it had previously
                // created, if it still had one.
                Task baseTask = r.getTask();
                if (baseTask.isEmbedded()) {
                    // If the task is embedded in a task fragment, there may have an existing
                    // starting window in the parent task. This allows the embedded activities
                    // to share the starting window and make sure that the window can have top
                    // z-order by transferring to the top activity.
                    baseTask = baseTask.getParent().asTaskFragment().getTask();
                }

                final ActivityRecord prev = baseTask.getActivity(
                        a -> a.mStartingData != null && a.showToCurrentUser());
                mWmService.mStartingSurfaceController.showStartingWindow(r, prev, newTask,
                        isTaskSwitch, sourceRecord);
            }
        ......
    }
```

调用StartingSurfaceController的showStartingWindow()  

`mWmService.mStartingSurfaceController.showStartingWindow(r, prev, newTask,isTaskSwitch, sourceRecord);`  
实际实现是在ActivityRecord中  

ActivityRecord.java#showStartingWindow()

```java
void showStartingWindow(ActivityRecord prev, boolean newTask, boolean taskSwitch,
            boolean processRunning, boolean startActivity, ActivityRecord sourceRecord,
            ActivityOptions candidateOptions) {
        if (mTaskOverlay) {
            // We don't show starting window for overlay activities.
            return;
        }
        final ActivityOptions startOptions = candidateOptions != null
                ? candidateOptions : mPendingOptions;
        if (startOptions != null
                && startOptions.getAnimationType() == ActivityOptions.ANIM_SCENE_TRANSITION) {
            // Don't show starting window when using shared element transition.
            return;
        }

        final int splashScreenTheme = startActivity ? getSplashscreenTheme(startOptions) : 0;
        final int resolvedTheme = evaluateStartingWindowTheme(prev, packageName, theme,
                splashScreenTheme);

        mSplashScreenStyleSolidColor = shouldUseSolidColorSplashScreen(sourceRecord, startActivity,
                startOptions, resolvedTheme);

        final boolean activityCreated =
                mState.ordinal() >= STARTED.ordinal() && mState.ordinal() <= STOPPED.ordinal();
        // If this activity is just created and all activities below are finish, treat this
        // scenario as warm launch.
        final boolean newSingleActivity = !newTask && !activityCreated
                && task.getActivity((r) -> !r.finishing && r != this) == null;

        final boolean scheduled = addStartingWindow(packageName, resolvedTheme,
                prev, newTask || newSingleActivity, taskSwitch, processRunning,
                allowTaskSnapshot(), activityCreated, mSplashScreenStyleSolidColor, allDrawn);
        if (DEBUG_STARTING_WINDOW_VERBOSE && scheduled) {
            Slog.d(TAG, "Scheduled starting window for " + this);
        }
    }
```

关键代码：

`final int resolvedTheme = evaluateStartingWindowTheme(prev, packageName, theme,splashScreenTheme);`

这个方法调用了validateStartingWindowTheme方法，判断启动窗口的几种不添加场景

windowIsTranslucent ----透明窗口，应用设了透明属性，空Activity等(应用侧有属性配置)  
应用侧设置透明属性

```xml
<style name="APPTheme" parent="@android:style/Test">
   <item name="android:windowDisablePreview">true</item>
</style>
```

windowIsFloating ----浮窗相关场景

windowShowWallpaper ----带wallpaper属性，比如桌面，锁屏等等

windowDisableStarting ----主动禁用startingwindow，应用主动禁用启动窗口(应用侧有属性配置)  
应用侧配置禁用启动窗口

```xml
<style name="APPTheme" parent="@android:style/Test">
   <item name="android:windowDisablePreview">true</item>
</style>
```

以上四个参数任意一个为true则不添加启动窗口，这里主要针对的是冷启动的Splash Screen的添加，热启动不受窗口属性的影响

添加startingwindow的调用  

`final boolean scheduled = addStartingWindow(packageName, resolvedTheme,prev, newTask || newSingleActivity, taskSwitch, processRunning,allowTaskSnapshot(), activityCreated,mSplashScreenStyleSolidColor, allDrawn);`

以上是T的代码，S的有所不同

但最终都是让ActivityRecord把各种activity相关属性传入到了addstartingwindow，为了就是让startingwindow在显示上尽可能的和实际显示的activity相似

**3.核心方法，判断是否需要添加startingwindow已及其类型**

ActivityRecord.java#addStartingWindow

```java
boolean addStartingWindow(String pkg, int resolvedTheme, ActivityRecord from, boolean newTask,
            boolean taskSwitch, boolean processRunning, boolean allowTaskSnapshot,
            boolean activityCreated, boolean isSimple,
            boolean activityAllDrawn) {
        // If the display is frozen, we won't do anything until the actual window is
        // displayed so there is no reason to put in the starting window.
        if (!okToDisplay()) {
            return false;
        }

        if (mStartingData != null) {
            return false;
        }

        final WindowState mainWin = findMainWindow();
        if (mainWin != null && mainWin.mWinAnimator.getShown()) {
            // App already has a visible window...why would you want a starting window?
            return false;
        }

        final TaskSnapshot snapshot =
                mWmService.mTaskSnapshotController.getSnapshot(task.mTaskId, task.mUserId,
                        false /* restoreFromDisk */, false /* isLowResolution */);
        final int type = getStartingWindowType(newTask, taskSwitch, processRunning,
                allowTaskSnapshot, activityCreated, activityAllDrawn, snapshot);

        //TODO(191787740) Remove for T+
        final boolean useLegacy = type == STARTING_WINDOW_TYPE_SPLASH_SCREEN
                && mWmService.mStartingSurfaceController.isExceptionApp(packageName, mTargetSdk,
                    () -> {
                        ActivityInfo activityInfo = intent.resolveActivityInfo(
                                mAtmService.mContext.getPackageManager(),
                                PackageManager.GET_META_DATA);
                        return activityInfo != null ? activityInfo.applicationInfo : null;
                    });

        final int typeParameter = StartingSurfaceController
                .makeStartingWindowTypeParameter(newTask, taskSwitch, processRunning,
                        allowTaskSnapshot, activityCreated, isSimple, useLegacy, activityAllDrawn,
                        type, packageName, mUserId);

        if (type == STARTING_WINDOW_TYPE_SNAPSHOT) {
            if (isActivityTypeHome()) {
                // The snapshot of home is only used once because it won't be updated while screen
                // is on (see {@link TaskSnapshotController#screenTurningOff}).
                mWmService.mTaskSnapshotController.removeSnapshotCache(task.mTaskId);
                if ((mDisplayContent.mAppTransition.getTransitFlags()
                        & WindowManager.TRANSIT_FLAG_KEYGUARD_GOING_AWAY_NO_ANIMATION) == 0) {
                    // Only use snapshot of home as starting window when unlocking directly.
                    return false;
                }
            }
            return createSnapshot(snapshot, typeParameter);
        }

        // Original theme can be 0 if developer doesn't request any theme. So if resolved theme is 0
        // but original theme is not 0, means this package doesn't want a starting window.
        if (resolvedTheme == 0 && theme != 0) {
            return false;
        }

        if (from != null && transferStartingWindow(from)) {
            return true;
        }

        // There is no existing starting window, and we don't want to create a splash screen, so
        // that's it!
        if (type != STARTING_WINDOW_TYPE_SPLASH_SCREEN) {
            return false;
        }

        ProtoLog.v(WM_DEBUG_STARTING_WINDOW, "Creating SplashScreenStartingData");
        mStartingData = new SplashScreenStartingData(mWmService, resolvedTheme, typeParameter);
        scheduleAddStartingWindow();
        return true;
    }
```

通过获取startingwindow类型来添加启动窗口  

`final int type = getStartingWindowType(newTask, taskSwitch, processRunning,allowTaskSnapshot, activityCreated, activityAllDrawn, snapshot);`  

该方法用来判断startingwindow窗口的类型:splash、snapshot、none

```java
 private int getStartingWindowType(boolean newTask, boolean taskSwitch, boolean processRunning,
            boolean allowTaskSnapshot, boolean activityCreated, boolean activityAllDrawn,
            TaskSnapshot snapshot) {
        // A special case that a new activity is launching to an existing task which is moving to
        // front. If the launching activity is the one that started the task, it could be a
        // trampoline that will be always created and finished immediately. Then give a chance to
        // see if the snapshot is usable for the current running activity so the transition will
        // look smoother, instead of showing a splash screen on the second launch.
        if (!newTask && taskSwitch && processRunning && !activityCreated && task.intent != null
                && mActivityComponent.equals(task.intent.getComponent())) {
            final ActivityRecord topAttached = task.getActivity(ActivityRecord::attachedToProcess);
            if (topAttached != null) {
                if (topAttached.isSnapshotCompatible(snapshot)
                        // This trampoline must be the same rotation.
                        && mDisplayContent.getDisplayRotation().rotationForOrientation(mOrientation,
                                mDisplayContent.getRotation()) == snapshot.getRotation()) {
                    return STARTING_WINDOW_TYPE_SNAPSHOT;
                }
                // No usable snapshot. And a splash screen may also be weird because an existing
                // activity may be shown right after the trampoline is finished.
                return STARTING_WINDOW_TYPE_NONE;
            }
        }
        final boolean isActivityHome = isActivityTypeHome();
        if ((newTask || !processRunning || (taskSwitch && !activityCreated))
                && !isActivityHome) {
            return STARTING_WINDOW_TYPE_SPLASH_SCREEN;
        }
        if (taskSwitch) {
            if (allowTaskSnapshot) {
                if (isSnapshotCompatible(snapshot)) {
                    return STARTING_WINDOW_TYPE_SNAPSHOT;
                }
                if (!isActivityHome) {
                    return STARTING_WINDOW_TYPE_SPLASH_SCREEN;
                }
            }
            if (!activityAllDrawn && !isActivityHome) {
                return STARTING_WINDOW_TYPE_SPLASH_SCREEN;
            }
        }
        return STARTING_WINDOW_TYPE_NONE;
    }
    
	boolean isSnapshotCompatible(TaskSnapshot snapshot) {
        if (snapshot == null) {
            return false;
        }
        if (!snapshot.getTopActivityComponent().equals(mActivityComponent)) {
            // Obsoleted snapshot.
            return false;
        }
        final int rotation = mDisplayContent.rotationForActivityInDifferentOrientation(this);
        final int currentRotation = task.getWindowConfiguration().getRotation();
        final int targetRotation = rotation != ROTATION_UNDEFINED
                // The display may rotate according to the orientation of this activity.
                ? rotation
                // The activity won't change display orientation.
                : currentRotation;
        if (snapshot.getRotation() != targetRotation) {
            return false;
        }
        final Rect taskBounds = task.getBounds();
        int w = taskBounds.width();
        int h = taskBounds.height();
        final Point taskSize = snapshot.getTaskSize();
        if ((Math.abs(currentRotation - targetRotation) % 2) == 1) {
            // Flip the size if the activity will show in 90 degree difference.
            final int t = w;
            w = h;
            h = t;
        }
        // Task size might be changed with the same rotation such as on a foldable device.
        return Math.abs(((float) taskSize.x / Math.max(taskSize.y, 1))
                - ((float) w / Math.max(h, 1))) <= 0.01f;
    }
```

关键参数：newTask, taskSwitch, processRunning, allowTaskSnapshot, activityCreated, snapshot

1）newTask、进程未启动、冷启动、切换task且新创建activity时，获得type为splash screen

*   新起一个task
*   冷启动应用
*   task切换且新建activity

代码层面 Splash Screen需满足的条件  

前置条件：!isActivityTypeHome() --非Launcher桌面  

newTask --新的task  

!processRunning --进程不存在  

taskSwitch && !activityCreated --task切换 且 Activity未创建

2）切换task且允许snapshot时，尝试获取type为snapshot(判断isSnapshotCompatible是否满足，是指activity的屏幕方向和截图的屏幕方向是否一致，如果不一致自然不能使用截图作为启动窗口)

*   非splash场景、且task切换

代码层面 SnapshotStartWindow需满足的条件  

taskSwitch && allowTaskSnapshot – task切换 且 allowTaskSnapshot为true  

allowTaskSnapshot --非浮窗模式 且 newIntents为空才能满足此条件

类型讲完了，我们继续看看addStartingWindow的后续  

1）如果是snapshot类型，则执行createSnapshot，创建startingwindow窗口

```java
	if (type == STARTING_WINDOW_TYPE_SNAPSHOT) {
	
		if (isActivityTypeHome()) {
		......
		}
	
		return createSnapshot(snapshot, typeParameter);
	
	}
```
```java
private boolean createSnapshot(TaskSnapshot snapshot, int typeParams) {
        if (snapshot == null) {
            return false;
        }

        ProtoLog.v(WM_DEBUG_STARTING_WINDOW, "Creating SnapshotStartingData");
        mStartingData = new SnapshotStartingData(mWmService, snapshot, typeParams);
        if (task.forAllLeafTaskFragments(TaskFragment::isEmbedded)) {
            // Associate with the task so if this activity is resized by task fragment later, the
            // starting window can keep the same bounds as the task.
            associateStartingDataWithTask();
        }
        scheduleAddStartingWindow();
        return true;
    }
```

`mStartingData = new SnapshotStartingData(mWmService, snapshot, typeParams);`  
在保存Snapshot的StartingData之后，异步添加启动窗口`scheduleAddStartingWindow()`

2）创建Splash类型的startingwindow

```java
mStartingData = new SplashScreenStartingData(mWmService, resolvedTheme, typeParameter);
scheduleAddStartingWindow();
```

同样的在保存SplashScreen的StartingData之后，异步添加启动窗口，这是为了不让启动窗口的绘制阻塞activity的启动

3）type为none，即不创建startingwindow（此场景常见于应用内的activity切换）

4.执行scheduleAddStartingWindow()函数，添加startingwindow。它会把消息mAddStartingWindow发送到android.anim线程中处理

```java
void scheduleAddStartingWindow() {
	mAddStartingWindow.run();
}
private class AddStartingWindow implements Runnable {

        @Override
        public void run() {
            // Can be accessed without holding the global lock
            final StartingData startingData;
            synchronized (mWmService.mGlobalLock) {
                // There can only be one adding request, silly caller!

                if (mStartingData == null) {
                    // Animation has been canceled... do nothing.
                    ProtoLog.v(WM_DEBUG_STARTING_WINDOW,
                            "startingData was nulled out before handling"
                                    + " mAddStartingWindow: %s", ActivityRecord.this);
                    return;
                }
                startingData = mStartingData;
            }

            ProtoLog.v(WM_DEBUG_STARTING_WINDOW, "Add starting %s: startingData=%s",
                    this, startingData);

            StartingSurfaceController.StartingSurface surface = null;
            try {
                surface = startingData.createStartingSurface(ActivityRecord.this);
            } catch (Exception e) {
                Slog.w(TAG, "Exception when adding starting window", e);
            }
            if (surface != null) {
                boolean abort = false;
                synchronized (mWmService.mGlobalLock) {
                    // If the window was successfully added, then we need to remove it.
                    if (mStartingData == null) {
                        ProtoLog.v(WM_DEBUG_STARTING_WINDOW, "Aborted starting %s: startingData=%s",
                                ActivityRecord.this, mStartingData);

                        mStartingWindow = null;
                        mStartingData = null;
                        abort = true;
                    } else {
                        mStartingSurface = surface;
                    }
                    if (!abort) {
                        ProtoLog.v(WM_DEBUG_STARTING_WINDOW,
                                "Added starting %s: startingWindow=%s startingView=%s",
                                ActivityRecord.this, mStartingWindow, mStartingSurface);
                    }
                }
                if (abort) {
                    surface.remove(false /* prepareAnimation */);
                }
            } else {
                ProtoLog.v(WM_DEBUG_STARTING_WINDOW, "Surface returned was null: %s",
                        ActivityRecord.this);
            }
        }
    }

    private final AddStartingWindow mAddStartingWindow = new AddStartingWindow();
```

mAddStartingWindow是AddStartingWindow创建的对象，其实现了Runnable接口  
创建startingwindow`surface = startingData.createStartingSurface(ActivityRecord.this);`  
如果当前是splash类型，那么会执行SplashScreenStartingData的createStartingSurface()，创建startingwindow；如果是snapshot类型，则执行SnapshotStartingData的createStartingSurface(),创建startingwindow。（startingData为SplashScreenStartingData和SnapshotStartingData父类，根据前说的获取的类型来创建相应的startingwindow）

### 创建splash类型的startingwindow

ActivityRecord.java  

AddStartingWindow复写run方法调用了  

surface = startingData.createStartingSurface(ActivityRecord.this);  

调用链  

SplashScreenStartingData.java#createStartingSurface  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesf77c3d07c10ece86593aa1f8b4e57799.png)  
StartingSurfaceController.java#createSplashScreenStartingSurface

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesb05c029f9f0e28b90075d454ec613b59.png)  
通过TaskOrganizerController.java最终调用到wmshell中的StartingWindowController.java的addStartingWindow  
**wmshell流程开始**  

StartingWindowController.java  

addStartingWindow  

StartingSurfaceDrawer.java  

**addSplashScreenStartingWindow**  

1.createContentView  

SplashscreenContentDrawer.java  

createContentView -> makeSplashScreenContentView  

2.addWindow  

调用`mWindowManagerGlobal.addView(view, params, display, null /* parentWindow */, context.getUserId());`  
窗口添加流程  

WindowManagerGlobal.java  

addView.java  

ViewRootImpl  

setView ->addToDisplayAsUser  

Session.java  

addToDisplayAsUser  

WindowManagerService.java  

addWindow  

添加启动窗口  

ActivityRecord.java  

attachStartingWindow

### 创建snapshot类型的startingwindow

ActivityRecord.java  

addstartingwindow方法中调用createSnapshot  

mStartingData = new SnapshotStartingData(mWmService, snapshot, typeParams);  

调用链  

SnapshotStartingData.java#createStartingSurface  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images6781868baf411318d85036d45ac9dcba.png)  
StartingSurfaceController.java#createTaskSnapshotSurface  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images56b2be9d9caafcab24378fe4e97d12c3.png)  
通过TaskOrganizerController.java最终调用到wmshell中的StartingWindowController.java的addStartingWindow  

**wmshell流程开始**  

StartingWindowController.java  

addStartingWindow  

StartingSurfaceDrawer.java  

makeTaskSnapshotWindow -> create  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images67c727a22bf6b447144db8ec67acdbca.png)TaskSnapshotWindow.java  

create  

`final int res = session.addToDisplay(window, layoutParams, View.GONE, displayId, info.requestedVisibilities, tmpInputChannel, tmpInsetsState, tmpControls);`  

窗口添加流程  

Session.java  

addToDisplayAsUser  

WindowManagerService.java  

addWindow  

添加启动窗口  

ActivityRecord.java  

attachStartingWindow

### 总结

两种不同类型的启动窗口最终都会调用到StartingWindowController.java的addStartingWindow，只是传入参数不同，后面会根据类型不同调用不同的方法  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images9d3a127f4df34e28b743ae107a07b824.png)  
StartingSurfaceDrawer.java中调用不同的方法  

最终都会调用用到ActivityRecord attachStartingWindow

```java
    void attachStartingWindow(@NonNull WindowState startingWindow) {
        startingWindow.mStartingData = mStartingData;
        mStartingWindow = startingWindow;
        if (mStartingData != null && mStartingData.mAssociatedTask != null) {
            attachStartingSurfaceToAssociatedTask();
        }
    }
```

startingwindow的移除
---------------------------------------------------------------------------------

### 前置流程

1、应用界面绘制完成，ViewRootImpl的finishDrawing(),去通知wms  

ViewRootImpl.java  

reportDrawFinished -> finishDrawing  

关键代码  

`mWindowSession.finishDrawing(mWindow, mSurfaceChangedTransaction, seqId);`  

2、wms接收到应用绘制完成的消息后，调用requestTraversal()请求刷新窗口  

WindowManagerService.java  

finishDrawingWindow -> requestTraversal  

关键代码  

`mWindowPlacerLocked.requestTraversal();`  

3、窗口刷新过程中，会调用mApplySurfaceChangesTransaction  

WindowSurfacePlacer.java  

requestTraversal()->performSurfacePlacement()  

关键代码  

`mService.mAnimationHandler.post(mPerformSurfacePlacement);`

```java
    private class Traverser implements Runnable {
        @Override
        public void run() {
            synchronized (mService.mGlobalLock) {
                performSurfacePlacement();
            }
        }
    }

    private final Traverser mPerformSurfacePlacement = new Traverser();
```

performSurfacePlacement()->performSurfacePlacementLoop()  

关键代码  

`mService.mRoot.performSurfacePlacement();`  

RootWindowContainer.java  

performSurfacePlacement() -> performSurfacePlacementNoTrace() -> applySurfaceChangesTransaction()  

DisplayContent.java  

applySurfaceChangesTransaction()->commitFinishDrawingLocked()  

关键代码  

`forAllWindows(mApplySurfaceChangesTransaction, true /* traverseTopToBottom */);`

```java
private final Consumer<WindowState> mApplySurfaceChangesTransaction = w -> {
       ......

        // Moved from updateWindowsAndWallpaperLocked().
        if (w.mHasSurface) {
            // Take care of the window being ready to display.
            final boolean committed = winAnimator.commitFinishDrawingLocked();
			......
        }

       ......
    };
```

4、窗口绘制完成后，接着调用winAnimator的commitFinishDrawingLocked(),状态值mDrawState改为READY\_TO\_SHOW,准备显示  

WindowStateAnimator.java  

commitFinishDrawingLocked() -> performShowLocked()  

关键代码

```java
    boolean commitFinishDrawingLocked() {
    	......
        mDrawState = READY_TO_SHOW;
        boolean result = false;
        final ActivityRecord activity = mWin.mActivityRecord;
        if (activity == null || activity.canShowWindows()
                || mWin.mAttrs.type == TYPE_APPLICATION_STARTING) {
            result = mWin.performShowLocked();
        }
        return result;
    }
```

5、如果当前是非startingwindow类型的窗口，则调用函数onFirstWindowDrawn()，开始移除startingwindow窗口。因为这个时候主界面已经绘制完成，不在需要显示startingwindow  

WindowState.java  

performShowLocked() -> onFirstWindowDrawn()  

关键代码

```java
	boolean performShowLocked() {
		final int drawState = mWinAnimator.mDrawState;
        if ((drawState == HAS_DRAWN || drawState == READY_TO_SHOW) && mActivityRecord != null) {
            if (mAttrs.type != TYPE_APPLICATION_STARTING) {
                mActivityRecord.onFirstWindowDrawn(this);
            } else {
                mActivityRecord.onStartingWindowDrawn();
            }
        }
        ......
        mWinAnimator.mDrawState = HAS_DRAWN;
        ......
	}
```

ActivityRecord.java  

onFirstWindowDrawn -> removeStartingWindow，这里开始区分有无退出动画  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images3a6959c76e9d8ff26a179957125f3adb.png)  
如果有startingwindow退出动画则会多走transferSplashScreenIfNeeded的流程，该流程仅限于冷启动  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesc8c81150d055dd0ba05420de026e8ca9.png)  
从代码中可以看出mHandleExitSplashScreen变量决定是否有启动动画，跟踪代码可以发现，该变量的值取决于应用是否设置退出动画`splashScreen.setOnExitAnimationListener(this::onSplashScreenExit);`

### 退出动画流程（仅限冷启动）

以ActivityRecord#removeStartingWindow为起点  

ActivityRecord.java  

removeStartingWindow->transferSplashScreenIfNeeded->requestCopySplashScreen  

通过TaskOrganizerController.java最终调用到wmshell中的  

ShellTaskOrganizer.java  

copySplashScreenView  

StartingWindowController.java  

copySplashScreenView  

StartingSurfaceDrawer.java  

copySplashScreenView  

调用`ActivityTaskManager.getInstance().onSplashScreenViewCopyFinished(taskId, parcelable);`，回到system\_server进程  

ActivityTaskManagerService.java  

onSplashScreenViewCopyFinished  

ActivityRecord.java  

onCopySplashScreenFinish

```java
mAtmService.getLifecycleManager().scheduleTransaction(app.getThread(), token,
        TransferSplashScreenViewStateItem.obtain(parcelable,
                windowAnimationLeash));
```

调用到应用进程  

TransferSplashScreenViewStateItem.java  

execute  

ActivityThread.java  

handleAttachSplashScreenView->createSplashScreen->syncTransferSplashscreenViewTransaction->reportSplashscreenViewShown 

ActivityClient.java  

reportSplashScreenAttached  

ActivityClientController.java  

splashScreenAttached  

ActivityThread.java  

splashScreenAttachedLocked->onSplashScreenAttachComplete->removeStartingWindowAnimation

继续往下走，移除启动窗口

### 无退出动画流程

ActivityRecord.java  

removeStartingWindowAnimation->remove  

StartingSurfaceController.java  

remove->removeStartingWindow  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesd2eecec8788f0dd05de6a99ea10392ba.png)  

通过TaskOrganizerController.java最终调用到wmshell中的StartingWindowController.java中removeStartingWindow  

StartingWindowController.java  

removeStartingWindow  

StartingSurfaceDrawer.java  

removeStartingWindow -> removeWindowSynced  

6、在removeWindowSynced()中根据当前的startingwindow的类型，选择移除方式

### splash screen类型移除

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images582726e461f45c859d328e074b0cc26b.png)  
移除splash类型的startingwindow  

StartingSurfaceDrawer.java  

removeWindowSynced->removeWindowInner  

调用`mWindowManagerGlobal.removeView(decorView, false /* immediate */);`移除  

WindowManagerGlobal.java  

removeView

### snapshot类型移除

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesa2576e614cb78b4b804ab3c5f41a172c.png)  
移除snapshot类型的startingwindow  

StartingSurfaceDrawer.java  

removeWindowSynced->scheduleRemove  

TaskSnapshotWindow.java  

scheduleRemove->removeImmediately  

调用`mSession.remove(mWindow);`移除  

WindowManagerService.java  

removeWindow

### 总结

startingwindow有无退出渐变动画（仅限冷启动），依赖mHandleExitSplashScreen值，该值取决于应用是否设置退出动画`splashScreen.setOnExitAnimationListener(this::onSplashScreenExit);`  

两种不同的移除方式最终会从removeWindowSynced方法中选择当前的调用

startingwindow去除启动大图标
-------------------------------------------------------------------------------------

### 问题

去掉启动窗口的大图标显示，如果应用有定制则保留其启动页面

### 思路

在SplashScreen添加流程中，会通过SplashscreenContentDrawer中调用  

createContentView-> makeSplashScreenContentView创建SplashScreen图，在makeSplashScreenContentView方法中通过getWindowAttrs获取窗口属性

### 修改

添加下面这行代码  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images1c201be724bd223508f34a512d346fe9.png)通过windowSplashScreenAnimatedIcon属性，来获取当前启动页

```java
attrs.mSplashScreenIcon = safeReturnAttrDefault((def) -> typedArray.getDrawable(
					R.styleable.Window_windowSplashScreenAnimatedIcon), null);
```

如果有定制，则该属性不为空  

`attrs.mSplashScreenIcon = new ColorDrawable(Color.TRANSPARENT);`  

学习过程中遇到的问题
--------------------------------------------------------------------------

### 关于启动窗口添加AddStartingWindow中线程

在ActivityRecord.java中

```java
   private class AddStartingWindow implements Runnable {

        @Override
        public void run() {
            // Can be accessed without holding the global lock
            final StartingData startingData;
            synchronized (mWmService.mGlobalLock) {
                // There can only be one adding request, silly caller!

                if (mStartingData == null) {
                    // Animation has been canceled... do nothing.
                    ProtoLog.v(WM_DEBUG_STARTING_WINDOW,
                            "startingData was nulled out before handling"
                                    + " mAddStartingWindow: %s", ActivityRecord.this);
                    return;
                }
                startingData = mStartingData;
            }

            ProtoLog.v(WM_DEBUG_STARTING_WINDOW, "Add starting %s: startingData=%s",
                    this, startingData);

            StartingSurfaceController.StartingSurface surface = null;
            try {
                surface = startingData.createStartingSurface(ActivityRecord.this);
            } catch (Exception e) {
                Slog.w(TAG, "Exception when adding starting window", e);
            }
            if (surface != null) {
                boolean abort = false;
                synchronized (mWmService.mGlobalLock) {
                    // If the window was successfully added, then we need to remove it.
                    if (mStartingData == null) {
                        ProtoLog.v(WM_DEBUG_STARTING_WINDOW, "Aborted starting %s: startingData=%s",
                                ActivityRecord.this, mStartingData);

                        mStartingWindow = null;
                        mStartingData = null;
                        abort = true;
                    } else {
                        mStartingSurface = surface;
                    }
                    if (!abort) {
                        ProtoLog.v(WM_DEBUG_STARTING_WINDOW,
                                "Added starting %s: startingWindow=%s startingView=%s",
                                ActivityRecord.this, mStartingWindow, mStartingSurface);
                    }
                }
                if (abort) {
                    surface.remove(false /* prepareAnimation */);
                }
            } else {
                ProtoLog.v(WM_DEBUG_STARTING_WINDOW, "Surface returned was null: %s",
                        ActivityRecord.this);
            }
        }
    }
```

abort参数代表什么？  

正常情况下，snapshot值，会进来这个地方，证明已经有了可以创建startingwindow中的startingView（代码中变量是startingSurface），等addWindow成功后才会为mStartingWindow 赋值  

WMS中调用attachStartingWindow  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagescfd8f26ebaf47c2419b1942b1d095f31.png)  
该方法在ActivityRecord.java中实现

```java
    void attachStartingWindow(@NonNull WindowState startingWindow) {
        startingWindow.mStartingData = mStartingData;
        mStartingWindow = startingWindow;
        if (mStartingData != null && mStartingData.mAssociatedTask != null) {
            attachStartingSurfaceToAssociatedTask();
        }
    }
```

回到前面**AddStartingWindow的run方法**中`synchronized (mWmService.mGlobalLock)`可能会出现等锁时间长的异常情况，这时如果mStartingData为空了，就代表添加启动窗口失败，它就要移除前面创建的surface对像，即`surface.remove(false /* prepareAnimation */);`

### 移除启动窗口调用差异

**splash screen**  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images791ccd25a73c5e047ab2cd8a476df5c4.png)  
**snapshot**  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesf6c1c2e3f516585fed290efee2967ce2.png)  
splash screen是通过removeView的方式移除，而snapshot是通过removeWindow方式移除

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesa0d0163c14199f8eeeefbbbbb33bebb9.png)  
从代码中可以看出splash screen是通过构建view的方式创建，所以removeView

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesbb8294408837e18b0eec8fd891e40db6.png)  
而这里可以看出snapshot是直接将截图添加到了window中，所以removeWindow

问题分析处理
----------------------------------------------------------------------

1、温启动应用时启动慢/白屏

应用保活机制影响：APP被后台查杀，发起添加startingwindow的Activity变了，对应的Activity的主题里没有启动窗口配置项，所以默认获取了系统的白屏启动窗口。  

以淘宝为例，温启动场景下淘宝的Welcome activty被重新创建了，当点击应用桌面图标打开淘宝时：Welcome不会再去创建，直接创建了TBMainActivity，新创建的这个activity没有startingwindow相关的配置，所以用了系统默认的startingwindow，因此显示了白屏。  
按照谷歌当前的业务逻辑，为温启动强制添加splash screen：个别主界面和启动页界面不一致的保活应用可能会出现温启动白屏现象。getStartingWindowType中修改  
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images54cf0720a2e5ec2e473febc2576e926e.png)  
添加判断条件如果snapshot 不为空则，把startingwindow改为空，即不显示启动窗口  
`if(snapshot != null) return STARTING_WINDOW_TYPE_NONE;`

2、startingwindow引起的定屏问题  
启动应用过程中添加了startingwindow，应用界面未绘制完成造成startingwindow未移除：  
这是因为应用启动出现了异常，可能是应用发生了ANR，或者应用的生命周期未走完。属于应用问题，需要处理。

3、屏幕解锁后低概率出现短暂黑屏  
可以dump activiy看，如果在只有一个main窗口的情况下，mNumInterestingWindows为2，正常应该是1

在ActivityRecord.updateDrawnWindowStates中判断如果是StartingWindow类型的窗口不加入interestingwindow的统计，现有的 w != mStartingWindow可能拦不住这个，有可能mStaringWindow跟w不是同一个实例，就可能导致StartingWindow类型的窗口被统计进去。这里的mStartringWindow是在启动窗口创建最后调用attachStartingWindow时赋值的。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/84b90d08238d07f37a500797f962f067.png)  
添加启动窗口类型判断`w.mAttrs.type != TYPE_APPLICATION_STARTING`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1305e960c6b5b6b573118cce7bac0529.png)  
4、wmshell crash导致黑屏  
根据堆栈打印信息，通过try/catch捕获异常即可。

 

  

本文转自 [https://blog.csdn.net/yimelancholy/article/details/130232980](https://blog.csdn.net/yimelancholy/article/details/130232980)，如有侵权，请联系删除。