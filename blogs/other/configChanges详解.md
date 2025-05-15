---
title: configChanges详解
date: 2024-03-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

*   参考文章：[android:configChanges属性解析](https://blog.csdn.net/weixin_42600398/article/details/122525304)、[项目疑难杂症记录(四)：Activity被重新创建的原因分析](https://blog.csdn.net/zxd_Android/article/details/86713240)
*   如果要在android源码确认是否是configChanges导致了Activity重启，建议把ActivityThread.DEBUG\_CONFIGURATION改为true。
*   Activity无法内部消化此次配置改变时，会调用relaunchActivityLocked方法。不同的是，如果此Activity正在前台，那立即调用；在后台的，则等切到前台后再调用

## configChanges作用

- **newConfig**：新的设备配置信息  

Android程序在运行时，一些设备的配置可能会改变，如：横竖屏的切换、软键盘的弹出等。这些事件一旦发生，当前活动的Activity会重新启动，其中的过程是：在销毁之前会先调用onSaveInstanceState()方法去保存你应用中的一些数据，然后调用onDestroy()方法，最后调用onCreate()、onStart()、onResume()等方法启动一个新的Activity。

**如果想让某些配置在发生改变的时候不重启Activity，需要为Activity添加android:configChanges属性**，该属性可以设置多个值，用"|"隔开，例如：“locale|navigation|orientation。设置了android:configChanges属性后，当指定的属性发生变化时，不会去重新启动Activity，而是通知程序去调用Activity的onConfigurationChanged()方法。

简言之，在Activity中添加了android:configChanges属性，目的是当android:configChanges所设置的属性值对应的配置属性发生改变时，通知程序调用 onConfigurationChanged()函数，而不会重启Activity。

## 获取变化的configChanges

系统的配置在Configuration类中（package android.content.res;）实现了Parcelable,和Comparable`<Configuration>`

在`android/U/frameworks/base/services/core/java/com/android/server/wm/ActivityRecord.java`中调用`configurationDiffToString`方法，打印出当前变化的configChanges

```java
boolean ensureActivityConfiguration(int globalChanges, boolean preserveWindow,
            boolean ignoreVisibility, boolean isRequestedOrientationChanged) {
    ...
        ProtoLog.v(WM_DEBUG_CONFIGURATION, "Configuration changes for %s, "
                + "allChanges=%s", this, Configuration.configurationDiffToString(changes));
    ...
}
```

## configChanges设置取值

以下是根据图片中的文字文本提取的表格内容，并以表格的形式排版输出：

| 配置项                     | 说明                                                         |
| -------------------------- | ------------------------------------------------------------ |
| mcc(0x0001)                | IMS移动国家/地区代码（MCC）发生了变化-检测到了SIM并更新了MCC。 |
| mnc(0x0002)                | IMSI移动网络代码（MNC）发生了变化-检测到了SIM并更新了MNC。   |
| locale(0x0004)             | 语言区域发生了变化-用户为文本选择了新的显示语言。            |
| touchscreen(0x0008)        | 触摸屏发生了变化。（这种情况通常永远不会发生。）             |
| keyboard(0x0010)           | 键盘类型发生了变化-例如，用户插入了一个外置键盘。            |
| keyboardHidden(0x0020)     | 键盘无障碍功能发生了变化-例如，用户显示了硬件键盘。          |
| navigation(0x0040)         | 导航类型（轨迹球/方向键）发生了变化。（这种情况通常永远不会发生。） |
| screenLayout(0x0100)       | 屏幕布局发生了变化-这可能是由激活了其他显示方式所致。        |
| fontScale(0x40000000)      | 字体缩放系数发生了变化-用户选择了新的全局字号。              |
| uiMode(0x0200)             | 用户界面模式发生了变化-这可能是因用户将设备放入桌面/车载基座或夜间模式发生变化所致。请参阅UiModeManager。此项为API级别8中新增配置。 |
| orientation(0x0080)        | 屏幕方向发生了变化-用户旋转了设备。（注）如果您的应用面向API级别13或更高级别，则还应声明“screenSize”配置，因为当设备在横向与纵向之间切换时，该配置也会发生变化。 |
| screenSize(0x0400)         | 当前可用屏幕尺寸发生了变化。它表示当前可用尺寸相对于当前纵横比的变化，因此会在用户在横向与纵向之间切换时发生变化。不过，如果您的应用面向API级别12或更低级别，则Activity始终会自行处理此配置变更。此项为API级别13中新增配置。 |
| smallestScreenSize(0x0800) | 物理屏幕尺寸发生了变化。它表示与方向无关的尺寸变化，因此只有在实际物理屏幕尺寸发生变化（如切换到外部显示器）时才会变化。对此配置的变更对应于smallestwidth配置的变化。不过，如果您的应用面向API级别12或更低级别，则Activity始终会自行处理此配置变更。此项为API级别13中新增配置。 |
| layoutDirection(0x2000)    | 布局方向发生了变化。例如，从从左至右（LTR）更改为从右至左（RTL）。此项为API级别17中新增配置。 |

## 横竖屏切换

**注意：**横竖屏切换的属性是 orientation。如果 targetSdkVersion 的值大于等于13，则如下配置才会回调 onConfigurationChanged 方法：

```xml
android:configChanges="orientation|screenSize"
```

如果targetSdkVersion的值小于13，则只要配置：

```xml
android:configChanges="orientation"
```

网上有很多文章写说横竖屏切换时 onConfigurationChanged方法 没有调用，使用如下的配置：

```xml
android:configChanges="orientation|keyboard|keyboardHidden"
```

但是，其实查官方文档，只要配置 android:configChanges="orientation|screenSize" 就可以了。

## 外设键盘

**扩展：**当用户接入一个外设键盘时，默认软键盘会自动隐藏，系统自动使用外设键盘。这个过程Activity的销毁和隐藏执行了两次。并且 onConfigurationChanged() 不会调用。

但是在配置文件中设置 **android:configChanges="keyboardHidden|keyboard"**。当接入外设键盘或者拔出外设键盘时，调用的周期是先调用onConfigurationChanged()周期后销毁重建。

**在这里有一个疑点，为什么有两次的销毁重建？**

其中一次的销毁重建可以肯定是因为外设键盘的插入和拔出。当设置 android:configChanges="keyboardHidden|keyboard" 之后，就不会销毁重建，而是调用onConfigurationChanged()方法。

**但是还有一次销毁重建一直存在。**

经过测试，当接入外设键盘时，除了键盘类型的改变，触摸屏也发生了变化。因为使用外设键盘，触摸屏不能使用了。

**总结：如果是键盘类型发生了改变，则 configChanges属性 配置如下Activity才不会销毁重建，且回调 onConfigurationChanged方法：**

```xml
android:configChanges="touchscreen|keyboard|keyboardHidden"
```

**note:** 这里的外置物理键盘可以是游戏手柄、扫描枪、键盘等等。

官方文档：

> https://developer.android.com/guide/topics/manifest/activity-element.html

小楠篇

在手机APP开发的时候，一般默认会适配竖屏，游戏开发除外。但是在Android平板电脑开发中，屏幕旋转的问题比较突出，可以这样说，平板电脑的最初用意就是横屏使用的，比较方便，用户会经常旋转我们设备的屏幕。

> **屏幕旋转的适配问题以及遇到的一些坑**
>
> http://www.jianshu.com/p/19393bb08e4f

## **关于官方文档**

我们知道，在 Activity、View（ViewGroup）、Fragment、Service、Content Provider 等等在设备的配置发生变化的时候，会回调 onConfigurationChanged 的方法。实质上主要是 Activity 中收到 AMS 的通知，回调，然后把事件分发到 Window、Fragment、ActionBar 等。

下面我们可以通过 Activity的onConfigurationChanged方法 源码可以看到：

```java
public void onConfigurationChanged(Configuration newConfig) {
    mCalled = true;
    
    // 分发到Activity中的所有Fragment
    mFragments.dispatchConfigurationChanged(newConfig);
    
    // 分发到Activity的Window对象
    if (mWindow != null) {
        // Pass the configuration changed event to the window
        mWindow.onConfigurationChanged(newConfig);
    }
    
    // 分发到Activity的ActionBar
    if (mActionBar != null) {
        mActionBar.onConfigurationChanged(newConfig);
    }
}
```

这里我们讨论的是为什么当我们的界面在设备配置发生变化的时候（屏幕旋转），有时候并不会回调 onConfigurationChanged 呢？

关于Activity的官方文档有下面一句话：

![](https://raw.githubusercontent.com/shug666/image/main/images0)

也就是说，在设备配置发生变化的时候，会回调 onConfigurationChanged，但是前提条件是当你的 Activity（组件）还在运行的时候。

这就很明显了，说明一旦你的界面暂停以后就不会回调这个方法了。但是这样会导致一个问题，就是你的界面跳转到其他界面的时候（当前界面暂停），然后发生了一次屏幕旋转，再返回的时候，你的界面虽然旋转了，但是并没有回调 onConfigurationChanged 方法，并没有执行你的UI适配代码。

## **源码分析**

[跳转链接](https://mp.weixin.qq.com/s?__biz=MzA5MzI3NjE2MA==&mid=2650238917&idx=1&sn=d13fceb5aab551258c64f6aa9e03b9ff&chksm=88639eaabf1417bc470ef3c4240b6b78388959dfb2911f4e4b7e341798a42bdc33151a83dedc&scene=27)

## frameworks处理流程

```java
<aosp>/frameworks/base/services/core/java/com/android/server/wm/ActivityRecord.java
------
final class ActivityRecord extends WindowToken implements WindowManagerService.AppFreezeListener {
    boolean ensureActivityConfiguration(int globalChanges, boolean preserveWindow,
            boolean ignoreVisibility) {
        ......
        // changes类型是int，存储着此次发生的配置改变。举个例子：修改语言后，changes是0x2004。
        // shouldRelaunchLocked用于判断Activify是否可以内部消化掉changes指示的改变 
        if (shouldRelaunchLocked(changes, mTmpConfig) || forceNewConfig) {
            // 重启分支。Activify无法消化此次改变，或强制要求重启(forceNewConfig==true)
            ....
            if (mState == PAUSING) {
                ...
                // 如果Activity此时为Pause状态，先设置一个标志位
                deferRelaunchUntilPaused = true;
                preserveWindowOnDeferredRelaunch = preserveWindow;
                return true;
            } else {
                ...
                relaunchActivityLocked(preserveWindow);
            }

            // All done...  tell the caller we weren't able to keep this activity around.
            return false;
        }
        ...

    }  

    shouldRelaunchLocked用于判断app是否可以内部消化掉changes指定的改变
    private boolean shouldRelaunchLocked(int changes, Configuration changesConfig) {
        int configChanged = info.getRealConfigChanged();
        ...
        // changes存储着此次发生的配置改变。
        // configChanged存储着此个Activity在android:configChanges写的View的可视区域及裁剪可消化改变。
        return (changes&(~configChanged)) != 0;
    }
}
```

假设用户在“设置”修改了语言，像从英文改为中文，这时android会依次调用各个正运行着的Activity的ensureActivityConfiguration。一个ActivityRecord对象对应一个Activity，成员变量packageName存储着此Activity归属app的Application ID，像com.kos.launcher，成员函数ensureActivityConfiguration也就对应一个Activity的处理过程。

在ensureActivityConfiguration，首先得到此次发生的配置改变值0x2004，值存储在变量changes，然后调用shouldRelaunchLocked，判断是否能内部消化掉这次改变。shouldRelaunchLocked逻辑分两步，第一步调用info.getRealConfigChanged()读出android:configChanges写的那改变值0x00C4，值存储在configChanged，第二步用“(changes&(~configChanged)) != 0”判断此次发生的改变(changes)是否有的不在configChanged。如果有，像示例的0x2004和0x00C4，shouldRelaunchLocked返回true，表示内部没法消化掉此次改变，否则返回false。

如果内部没法消化掉，或调用者要求一定要重启(forceNewConfig==true)，那进入重启分支。在这分支，如果此app的生命周期正处于暂停状态，像运行在后台，则把deferRelaunchUntilPaused设为true。否则立即调用relaunchActivityLocked。

```java
<aosp>/frameworks/base/services/core/java/com/android/server/wm/TaskFragment.java
------
    void completePause(boolean resumeNext, ActivityRecord resuming) {
        ...

        if (prev != null) {
            ...
            if (prev.finishing) {
                ...
            } else if (prev.hasProcess()) {
                ...
                if (prev.deferRelaunchUntilPaused) {
                    ...
                    // 这里是关键，如果deferRelaunchUntilPaused为true，调用重启
                    prev.relaunchActivityLocked(prev.preserveWindowOnDeferredRelaunch);
                }
                ...
            }
            ...
        }
        ...
    }
```

当Activity从Pause到Resume状态过渡时，像从后台切到前台，一旦发现deferRelaunchUntilPaused是true，会调用relaunchActivityLocked。综上所述：**Activity无法内部消化此次配置改变时，会调用relaunchActivityLocked方法。不同的是，如果此Activity正在前台，那立即调用；在后台的，则等切到前台后再调用**。

relaunchActivityLocked执行着重启流程。内中如何转的就不分析了，最终会调用handleRelaunchActivityInner。

```java
<aosp>/frameworks/base/core/java/android/app/ActivityThread.java
------
    private void handleRelaunchActivityInner(ActivityClientRecord r, int configChanges,
            List<ResultInfo> pendingResults, List<ReferrerIntent> pendingIntents,
            PendingTransactionActions pendingActions, boolean startsNotResumed,
            Configuration overrideConfig, String reason) {
        ...
        // 销毁此个Activity
        handleDestroyActivity(r, false, configChanges, true, reason);
        ...
        // 启动此个Activity
        handleLaunchActivity(r, pendingActions, customIntent);
    }
```

## 确保配置改变不会导致重启Activity

按上面规则，只要在android:configChanges写上所有可能的配置改变，那无论配置怎么改变都不会导致该Activity重启。那这里为什么还要提这个问题呢？——我不知道如何写android:configChanges才能包含所有配置改变。

```java
<aosp>/frameworks/base/core/java/android/content/pm/ActivityInfo.java
------
public static final int CONFIG_ASSETS_PATHS = 0x80000000;
public static final int CONFIG_WINDOW_CONFIGURATION = 0x20000000;
```

在Android-12，不知道如何写android:configChanges才能包含以上这两个配置。

```java
<aosp>/frameworks/base/services/core/java/com/android/server/wm/ActivityRecord.java
------
    private boolean shouldRelaunchLocked(int changes, Configuration changesConfig) {
        ...
        if (packageName != null && packageName.equals("com.kos.launcher")) {
            return false;
        }
        return (changes&(~configChanged)) != 0;
    }
```

如果android:configChanges无法包含所有改变，但又要确保配置改变不会导致重启Activity，可以修改shouldRelaunchLocked。发现是白名单中的app时，强制返回false，即认为内部能消化掉，不必重启此Activity。

本文转自 [https://www.cswamp.com/post/176](https://www.cswamp.com/post/176)，如有侵权，请联系删除。