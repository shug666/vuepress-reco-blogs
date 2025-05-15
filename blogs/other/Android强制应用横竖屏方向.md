---
title: Android强制应用横竖屏方向
date: 2025-01-14
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 实现思路

`DisplayContent` 是 Android 系统中一个重要的类，它在窗口管理器（Window Manager）中扮演着关键的角色。它用于管理一个显示设备上的窗口和界面元素，并负责处理显示相关的操作。以下是

### `DisplayContent` 的主要作用：

1.  **窗口管理：** `DisplayContent` 负责管理一个显示设备上的所有窗口，包括应用窗口、系统窗口、对话框等。它维护窗口的层级、布局、尺寸和可见性等信息。
    
2.  **窗口层级：** 通过 `DisplayContent`，系统可以确定每个窗口在显示上的层级关系，即哪个窗口位于其他窗口之上或之下。
    
3.  **窗口布局和尺寸：** `DisplayContent` 确保窗口在显示上正确布局，并根据窗口的尺寸和位置将其渲染到对应的屏幕区域。
    
4.  **窗口状态管理：** 窗口的状态，例如最小化、最大化、活动、非活动等，由 `DisplayContent` 进行管理和维护。
    
5.  **窗口交互：** 通过 `DisplayContent`，系统可以响应用户与窗口的交互操作，例如拖动、缩放、点击等。
    
6.  **窗口动画：** `DisplayContent` 负责处理窗口之间的动画效果，如窗口打开、关闭、切换等动画。
    
7.  **多显示设备支持：** 在多显示设备环境下，每个显示设备都有一个对应的 `DisplayContent` 实例，用于管理该设备上的窗口和显示操作。
    
8.  **系统级界面管理：** 系统级的界面元素，如状态栏、导航栏等，也由 `DisplayContent` 进行管理。
    
9.  **界面刷新：** `DisplayContent` 负责将窗口的内容绘制到显示设备上，以实现界面的刷新和呈现。
    
10.  **显示设备属性：** 通过 `DisplayContent`，系统可以获取和管理显示设备的属性，如分辨率、方向、DPI等。


`DisplayRotation` 是 Android 系统中的一个类，它用于管理显示设备的旋转操作。在移动设备中，用户可以旋转设备以适应不同的屏幕方向，例如从竖直方向切换到水平方向。`DisplayRotation` 负责跟踪显示设备的旋转状态，并通知系统和应用程序相应的变化。以下是

### `DisplayRotation` 的主要作用：

1.  **屏幕旋转管理：** `DisplayRotation` 跟踪用户旋转设备时的操作，包括从横屏切换到竖屏或反之。它记录当前的屏幕方向以及可能的旋转偏好。
    
2.  **应用程序适应：** 应用程序可以根据设备的旋转状态调整其用户界面，以确保在不同方向下都能够正确显示和布局。`DisplayRotation` 通知应用程序关于设备旋转的信息，从而使应用能够适应不同的方向。
    
3.  **系统界面适应：** 系统级的界面元素，如状态栏和导航栏，也需要根据屏幕方向进行调整。`DisplayRotation` 负责确保这些界面元素在旋转时的正确呈现。
    
4.  **触摸事件映射：** 屏幕旋转可能会影响触摸事件的坐标映射。`DisplayRotation` 确保触摸事件在旋转时正确映射到屏幕坐标。
    
5.  **显示内容旋转：** 一些应用或界面元素可能需要以特定的方向显示其内容。`DisplayRotation` 通过通知应用程序或界面元素的旋转状态，帮助它们调整内容的显示方向。
    
6.  **用户体验：** 通过管理设备的旋转，`DisplayRotation` 提供了更好的用户体验，使用户可以根据实际需要调整屏幕方向，而不会影响应用的正常运行。
    
7.  **多显示设备支持：** 在多显示设备环境下，每个显示设备可能有不同的旋转状态。`DisplayRotation` 确保每个显示设备都可以独立进行旋转。
    

综上理解：屏幕旋转时候，窗口画面横竖屏主要是由DisplayRotation与DisplayContent来控制

## 实现步骤

### updateOrientation

**找到 DisplayContent中的`updateOrientation(boolean forceUpdate)`的函数发现`orientation = getOrientation();`**

```java
 private boolean updateOrientation(boolean forceUpdate) {
        final int orientation = getOrientation();
        // The last orientation source is valid only after getOrientation.
        final WindowContainer orientationSource = getLastOrientationSource();
        final ActivityRecord r =
                orientationSource != null ? orientationSource.asActivityRecord() : null;
        if (r != null) {
            final Task task = r.getTask();
            if (task != null && orientation != task.mLastReportedRequestedOrientation) {
                task.mLastReportedRequestedOrientation = orientation;
                mAtmService.getTaskChangeNotificationController()
                        .notifyTaskRequestedOrientationChanged(task.mTaskId, orientation);
            }
            // Currently there is no use case from non-activity.
            if (handleTopActivityLaunchingInDifferentOrientation(r, true /* checkOpening */)) {
                // Display orientation should be deferred until the top fixed rotation is finished.
                return false;
            }
        }
        return mDisplayRotation.updateOrientation(orientation, forceUpdate);
    }
```

### getOrientation

**getOrientation该方法用于获取显示设备的方向,我们获取当前应用包名`mDisplayPolicy.mFocusedApp`，来判断截取返回的应用显示方向，`SCREEN_ORIENTATION_UNSPECIFIED=-1`代表方向未指定，允许系统根据传感器或其他因素来决定方向。**

```java
 int getOrientation() {
        mLastOrientationSource = null;
        if (!handlesOrientationChangeFromDescendant()) {
            // Return SCREEN_ORIENTATION_UNSPECIFIED so that Display respect sensor rotation
            ProtoLog.v(WM_DEBUG_ORIENTATION,
                    "Display id=%d is ignoring all orientation requests, return %d",
                    mDisplayId, SCREEN_ORIENTATION_UNSPECIFIED);
            return SCREEN_ORIENTATION_UNSPECIFIED;
        }

        if (mWmService.mDisplayFrozen) {
            if (mWmService.mPolicy.isKeyguardLocked()) {
                // Use the last orientation the while the display is frozen with the keyguard
                // locked. This could be the keyguard forced orientation or from a SHOW_WHEN_LOCKED
                // window. We don't want to check the show when locked window directly though as
                // things aren't stable while the display is frozen, for example the window could be
                // momentarily unavailable due to activity relaunch.
                ProtoLog.v(WM_DEBUG_ORIENTATION,
                        "Display id=%d is frozen while keyguard locked, return %d",
                        mDisplayId, getLastOrientation());
                return getLastOrientation();
            }
        }
        //luoming add
        String pkgName = mDisplayPolicy.mFocusedApp;
        Log.d(TAG, "getOrientation: pkgName="+pkgName);
        boolean isSnapCamera = "com.tencent.android.qqdownloader".equals(pkgName)||"com.ss.android.ugc.aweme".equals(pkgName)||"com.created.ota".equals(pkgName); //根据包名过滤某个应用
        int orientation = SCREEN_ORIENTATION_UNSPECIFIED;
        if (!isSnapCamera) {
           orientation = super.getOrientation();
        }
        //end

        if (orientation == SCREEN_ORIENTATION_UNSET) {
            // Return SCREEN_ORIENTATION_UNSPECIFIED so that Display respect sensor rotation
            ProtoLog.v(WM_DEBUG_ORIENTATION,
                    "No app or window is requesting an orientation, return %d for display id=%d",
                    SCREEN_ORIENTATION_UNSPECIFIED, mDisplayId);
            return SCREEN_ORIENTATION_UNSPECIFIED;
        }

        return orientation;
    }
```

### 以下是这些常量的解释：

SCREEN\_ORIENTATION\_UNSET：方向未设置，通常用于指示方向未被显式设置。

SCREEN\_ORIENTATION\_UNSPECIFIED：方向未指定，允许系统根据传感器或其他因素来决定方向。

SCREEN\_ORIENTATION\_LANDSCAPE：横向模式，用于表示横屏方向。

SCREEN\_ORIENTATION\_PORTRAIT：纵向模式，用于表示竖屏方向。

SCREEN\_ORIENTATION\_USER：用户首选方向，根据用户的首选设置来决定方向。

SCREEN\_ORIENTATION\_BEHIND：方向跟随上一个活动，通常用于在多个活动之间保持一致的方向。

SCREEN\_ORIENTATION\_SENSOR：根据传感器来决定方向，自动适应设备的物理方向。

其他常量（SCREEN\_ORIENTATION\_NOSENSOR、SCREEN\_ORIENTATION\_SENSOR\_LANDSCAPE 等）是对方向的不同设置，例如强制横屏或纵屏，强制使用传感器等。

这些常量可以在 Android 应用程序中用于设置活动或窗口的默认方向，以确保应用在不同方向下都能正常显示。应用程序可以在清单文件或代码中设置方向，以适应不同的使用场景。

**注意：一定要过滤应用如果全部应用都根据重感横竖屏的话，那些强制横屏的游戏也会被竖屏，但是触摸就无效了**