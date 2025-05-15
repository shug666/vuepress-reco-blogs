---
title: StatusBar状态栏显示隐藏
date: 2025-03-17
tags:
 - android
categories: 
 - android
sticky: 
   true
---

1\. 介绍
------

Android中的Statusbar包含导航栏(NavigationBar, 位于左侧、右侧或者底部)和状态栏(StatusBar, 位于顶部, 可下拉)两个部分, 位于SystemUI(frameworks/base/packages/SystemUI)模块

2\. 初始化
-------

```java
SystemServer::startOtherServices()
  SystemServer::startSystemUi("com.android.systemui.SystemUIService")
    SystemUIService::onCreate()
      /\* 
       \* 加载并启动config\_systemUIServiceComponents定义的服务列表
       \* frameworks/base/packages/SystemUI/res/values/config.xml
       \* <!-- SystemUI Services: The classes of the stuff to start. -->
       \* <string-array name="config\_systemUIServiceComponents" translatable="false">
       \*     <item>com.android.systemui.Dependency</item>
       \*     <item>com.android.systemui.statusbar.CommandQueue$CommandQueueStart</item>
       \*     ......
       \*     <item>com.android.systemui.SystemBars</item>
       \*     ......
       \*     <item>com.android.systemui.keyboard.KeyboardUI</item>
       \*     ......
       \* </string-array>
       \*/
      SystemUIApplication::startServicesIfNeeded()
        com.android.systemui.SystemBars::start()
          /\* 
           \* 启动config\_statusBarComponent定义的服务
           \* frameworks/base/packages/SystemUI/res/values/config.xml
           \* <string name="config\_statusBarComponent" translatable="false">
           \*     com.android.systemui.statusbar.phone.StatusBar
           \* </string>
           \*
           \* 在Automotive中被overlay, CarStatusBar继承自StatusBar
           \* <string name="config\_statusBarComponent" translatable="false">
           \*     com.android.systemui.statusbar.car.CarStatusBar
           \* </string>
           \*/
          SystemBars::createStatusBarFromConfig()
            CarStatusBar::start()
              StatusBar::start()
                StatusBar::createAndAddWindows()
                  StatusBar::addStatusBarWindow()
                    CarStatusBar::makeStatusBarView()
                      StatusBar::makeStatusBarView()
\----------------------------------------------------------------------------
                        +++ NavigationBar +++
----------------------------------------------------------------------------
                        WindowManagerService::hasNavigationBar()
                          /\* 
                           \* frameworks/base/core/res/res/values/config.xml
                           \* <bool name="config\_showNavigationBar">false</bool>
                           \*
                           \* 在Automotive中被overlay
                           \* <bool name="config\_showNavigationBar">true</bool>
                           \*/
                          PhoneWindowManager::hasNavigationBar()
                        CarStatusBar::createNavigationBar()
                          /\* 
                           \* frameworks/base/packages/SystemUI/res/values/config.xml
                           \* 根据如下配置决定是导航栏的位置，Automotive中会被overlay
                           \*   config\_enableBottomNavigationBar
                           \*   config\_enableLeftNavigationBar
                           \*   config\_enableRightNavigationBar
                           \* 然后通过WindowManager::addView()添加创建窗口
                           \*   WindowManager.LayoutParams.TYPE\_NAVIGATION\_BAR
                           \*   WindowManager.LayoutParams.TYPE\_NAVIGATION\_BAR\_PANEL
                           \*/
                          CarStatusBar::buildNavBarWindows()
                          CarStatusBar::buildNavBarContent()
                          CarStatusBar::attachNavBarWindows()
\----------------------------------------------------------------------------
                      +++ StatusBar +++
----------------------------------------------------------------------------
                          /\* 加载super\_status\_bar.xml实例化为状态栏的根控件 \*/
                          StatusBar::inflateStatusBarWindow()
                      /\* 
                       \* 通过WindowManager::addView()添加窗口, 类型如下
                       \*   WindowManager.LayoutParams.TYPE\_STATUS\_BAR
                       \*/
                      StatusBarWindowManager::add()
```

## 3. 保留状态栏，适配全面屏

默认情况下，应用界面不会延伸到系统状态栏、导航栏、导航条等区域，这会很丑，要想适配全面屏显示，在 Android 14 中，可以用一行代码简单实现。

```kotlin
// import androidx.activity.enableEdgeToEdg

enableEdgeToEdge()
```

## 4. 隐藏状态栏，完全全屏

适配全面屏并不会隐藏系统状态栏、导航栏、导航条，如果想实现完全全屏，老办法一般是调用 `setSystemUiVisibility()`，然而这个方法在 14 中已经弃用了，获取 `InsetsController` 的 `ViewCompat.getWindowInsetsController()` 方法也被弃用了，最新的写法是：

```kotlin
// import androidx.core.view.WindowCompat
// import androidx.core.view.WindowInsetsCompat
// import androidx.core.view.WindowInsetsControllerCompat

val windowController = WindowCompat.getInsetsController(window, window.decorView)
// 应用全屏时，用户仍然可以从屏幕顶部下拉唤出状态栏，此行代码实现当用户唤出状态栏后，自动隐藏状态栏
windowController.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
// 隐藏包括状态栏、导航栏、caption bar 在内的所有系统栏
windowController.hide(WindowInsetsCompat.Type.systemBars())
```

5. 显示和隐藏
---------

**前提：较低的Android版本**

### 5.1 应用实例

应用可以通过如下的方式隐藏状态栏和导航栏

```java
// Android < 4:
getWindow().setFlags(WindowManager.LayoutParams.FLAG\_FULLSCREEN,
                     WindowManager.LayoutParams.FLAG\_FULLSCREEN);

// 4 =< Android < 11:
int uiFlags = View.SYSTEM\_UI\_FLAG\_LAYOUT\_FULLSCREEN
            | View.SYSTEM\_UI\_FLAG\_LAYOUT\_HIDE\_NAVIGATION
            | View.SYSTEM\_UI\_FLAG\_FULLSCREEN
            | View.SYSTEM\_UI\_FLAG\_HIDE\_NAVIGATION;
getWindow().getDecorView().setSystemUiVisibility(uiFlags);

// Android >= 11
/\*
 \* systemBars包含statusBars和navigationBars
 \*/
// WindowInsetsController
controller.hide(WindowInsetsCompat.Type.systemBars())
controller.show(WindowInsetsCompat.Type.systemBars())
```

#### Flag大全及其含义

```
FLAG_ALLOW_LOCK_WHILE_SCREEN_ON：允许在屏幕开启的情况下锁定屏幕。

FLAG_ALT_FOCUSABLE_IM：当界面上有输入框时，该标志可以让输入法在弹出后覆盖输入框之上。

FLAG_DIM_BEHIND：在当前Activity之后的Activity中设置一个灰色透明遮罩层。

FLAG_FORCE_NOT_FULLSCREEN：当前Activity不全屏显示，即显示状态栏。

FLAG_FULLSCREEN：当前Activity全屏显示，即隐藏状态栏。

FLAG_HARDWARE_ACCELERATED：启用硬件加速。

FLAG_IGNORE_CHEEK_PRESSES：忽略面颊触碰。

FLAG_KEEP_SCREEN_ON：保持屏幕常亮。

FLAG_LAYOUT_INSET_DECOR：使窗口的内容布局在装饰视图之内。

FLAG_LAYOUT_IN_SCREEN：使窗口的内容布局在整个屏幕之内。

FLAG_LAYOUT_NO_LIMITS：窗口布局不受限制，可以覆盖状态栏、导航栏、装饰视图等。

FLAG_NOT_FOCUSABLE：窗口不可获得焦点。

FLAG_NOT_TOUCHABLE：窗口不可触摸。

FLAG_NOT_TOUCH_MODAL：当窗口在前面时，允许在窗口之外触摸事件传递到后面的窗口。

FLAG_SCALED：窗口内容按比例缩放。

FLAG_SECURE：窗口内容不可截屏。

FLAG_SHOW_WALLPAPER：在窗口背景中显示壁纸。

FLAG_SPLIT_TOUCH：分离触摸模式。

FLAG_WATCH_OUTSIDE_TOUCH：当窗口在前面时，允许在窗口之外触摸事件传递到后面的窗口。

FLAG_BLUR_BEHIND：在当前Activity之后的Activity中设置一个模糊透明遮罩层。

FLAG_DISMISS_KEYGUARD：解锁屏幕，需要权限。

FLAG_DITHER：启用抖动。

FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS：使窗口内容延伸到状态栏和导航栏之下。

FLAG_LAYOUT_ATTACHED_IN_DECOR：使窗口的内容布局在装饰视图之内，并显示在导航栏之上。

FLAG_LAYOUT_IN_OVERSCAN：窗口布局延伸到屏幕边缘之外，需要权限。

FLAG_LOCAL_FOCUS_MODE：窗口内部获得焦点，外部不可获得焦点。

FLAG_SHOW_WHEN_LOCKED：在锁屏状态下显示当前Activity。

FLAG_TOUCHABLE_WHEN_WAKING：在唤醒设备时，允许触摸事件传递到窗口之外。

FLAG_TRANSLUCENT_NAVIGATION：使导航栏半透明。

FLAG_TRANSLUCENT_STATUS：使状态栏半透明。

FLAG_TURN_SCREEN_ON：唤醒设备，需要权限。
```

### 5.2 调用流程

```java
View::setSystemUiVisibility()
  ViewRootImpl::recomputeViewAttributes()
    ViewRootImpl::scheduleTraversals()
      ViewRootImpl::doTraversal()
            ViewRootImpl::performTraversals()
            ViewRootImpl::collectViewAttributes()
              View::dispatchCollectViewAttributes()
                View::performCollectViewAttributes()
              // Do Something
              View::dispatchWindowSystemUiVisiblityChanged()
            ViewRootImpl::relayoutWindow()
              IWindowSession::relayout()
                com.android.server.wm.Session::relayout()
                  WindowManagerService::relayoutWindow()
                    PhoneWindowManager::adjustWindowParamsLw()
\----------------------------------------------------------------------------
                +++ How to get here +++
----------------------------------------------------------------------------
                PhoneWindowManager::updateSystemUiVisibilityLw()
                  StatusBarManagerService::setSystemUiVisibility()
                    IStatusBar::setSystemUiVisibility()
                      CommandQueue::setSystemUiVisibility()
                        StatusBar::setSystemUiVisibility()
                          StatusBar::notifyUiVisibilityChanged()
                            WindowManagerService::statusBarVisibilityChanged()
                              PhoneWindowManager::adjustSystemUiVisibilityLw()
                              WindowManagerService::updateStatusBarVisibilityLocked()
                                InputManagerService::setSystemUiVisibility()
                                DisplayContent::updateSystemUiVisibility()
                                  ViewRootImpl::W::dispatchSystemUiVisibilityChanged()
                                    ViewRootImpl::dispatchSystemUiVisibilityChanged()
                                      ViewRootImpl::handleDispatchSystemUiVisibilityChanged()
                                        View::updateLocalSystemUiVisibility()
                                        View::dispatchSystemUiVisibilityChanged()
                                          OnSystemUiVisibilityChangeListener::onSystemUiVisibilityChange()
```

参考:  

```
<[Android 9.0 SystemUI分析](https://wuxiaolong.me/categories/SystemUI/)\>  

<[StatusBar状态栏部分功能记录](https://blog.csdn.net/lanmengfenghe/article/details/104003765)\>  

<[Android 显示、隐藏状态栏和导航栏](https://www.jianshu.com/p/e9e443271c98)\>  

<[Android SystemUI(一):图文并茂的介绍](https://cloud.tencent.com/developer/article/1155393)\>  

<[API 30新特性：WindowInsetsController](https://juejin.cn/post/6940048488071856164)\>
```

本文转自 [https://www.cnblogs.com/hzl6255/p/15027685.html](https://www.cnblogs.com/hzl6255/p/15027685.html)，如有侵权，请联系删除。