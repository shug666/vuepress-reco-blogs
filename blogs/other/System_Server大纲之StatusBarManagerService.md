---
title: System Server大纲之StatusBarManagerService
date: 2025-03-10
tags:
 - android
categories: 
 - android
sticky: 
   true
---

> 状态栏管理服务
> 
> 下拉通知面板管理服务

## 前言

StatusBar即状态栏，也就是下拉通知栏和快速设置共同组成。StatusBarManagerService也就是通知栏和快速设置的管理服务

## StatusBarManagerService启动过程

代码定义在文件`frameworks/base/services/java/com/android/server/SystemServer.java`中启动StatusBarManagerService的代码如下：

```java
if (!disableSystemUI) {
    traceBeginAndSlog("StartStatusBarManagerService");
    try {
        statusBar = new StatusBarManagerService(context, wm);
        ServiceManager.addService(Context.STATUS_BAR_SERVICE, statusBar);
    .....
    }
```

> 在文章《[Android系统之System Server大纲](http://blog.csdn.net/myfriend0/article/details/55098173) 》一文中的服务启动过程可知
>

如上面的代码，启动StatusBarManagerService是由条件disableSystemUI来控制的，如果关闭SystemUI，那么将不会启动StatusBarManagerService。StatusBar是SystemUI组成的一部分，读者对SystemUI不熟悉的可以参阅文章《 [SystemUI架构分析](http://blog.csdn.net/myfriend0/article/details/54972861)》。

StatusBarManagerService通过ServiceManager.addService()的方式启动，那么StatusBarManagerService将是实现了AIDL，本身支持Binder通信。如下：

```java
public class StatusBarManagerService extends IStatusBarService.Stub {
}
```

> 这个类定义在文件`frameworks/base/services/core/java/com/android/server/statusbar/StatusBarManagerService.java`中。

还有一点是值得注意的，在实例化StatusBarManagerService的时候，还添加了一个LocalServices，代码如下：

```java
public StatusBarManagerService(Context context, WindowManagerService windowManager) {
    mContext = context;
    mWindowManager = windowManager;

    LocalServices.addService(StatusBarManagerInternal.class, mInternalService);
}
```

> 这个方法定义在文件`frameworks/base/services/core/java/com/android/server/statusbar/StatusBarManagerService.java`中。
>

在文章《[Android系统之System Server大纲](http://blog.csdn.net/myfriend0/article/details/55098173) 》一文中有提到LocalServices的服务的特征特点，LocalServices是进程内调用的服务，那么StatusBarManagerInternal也就是在system\_process进程中使用，StatusBarManagerInternal定义如下：

```java
/**
 * Private API used by NotificationManagerService.
 */
private final StatusBarManagerInternal mInternalService = new StatusBarManagerInternal() {
}
```

> 这个变量定义在文件`frameworks/base/services/core/java/com/android/server/statusbar/StatusBarManagerService.java`中。

## StatusBarManagerService的上层接口

在文章《[Android System Server大纲之VibratorService](http://blog.csdn.net/myfriend0/article/details/55210074)》一文中有详细参数了如果去获取一个系统服务的上层接口，以及查看获取到的上层接口的本质。获取StatusBarManagerService的上层接口代码：

```java
StatusBarManager statusBarManager = (StatusBarManager) getSystemService(Context.STATUS_BAR_SERVICE);
```

getSystemService(Context.STATUS\_BAR\_SERVICE)的调用过程如下：

```java
registerService(Context.STATUS_BAR_SERVICE, StatusBarManager.class,
        new CachedServiceFetcher<StatusBarManager>() {
    @Override
    public StatusBarManager createService(ContextImpl ctx) {
        return new StatusBarManager(ctx.getOuterContext());
    }});
```

> 这个方法定义在文件`frameworks/base/core/java/android/app/SystemServiceRegistry.java`中。
>

registerService()中的第一个参数`Context.STATUS_BAR_SERVICE`刚好和StatusBarManagerService启动过程中的ServiceManager.addService()的第一参数`Context.STATUS_BAR_SERVICE`一致，所以`getSystemService(Context.STATUS_BAR_SERVICE)`所获取到的对象实例就是StatusBarManager。

## 上层接口StatusBarManager概览

> **注意**：StatusBarManager类不向外暴露，也就是说第三方APP无法使用这个类的功能。

StatusBarManager定义如下：

```java
public class StatusBarManager {
    /**
     * Collapse the notifications and settings panels.
     */
    public void collapsePanels() {
        ......
    }
    /**
     * Disable some features in the status bar.
     */
    public void disable(int what) {
        ......
    }
    /**
     * Expand the notifications panel.
     */
    public void expandNotificationsPanel() {
        ......
    }
    /**
     * Expand the settings panel.
     */
    public void expandSettingsPanel() {
        ......
    }
    /**
     * Expand the settings panel and open a subPanel, pass null to just open the settings panel.
     */
    public void expandSettingsPanel(String subPanel) {
        ......
    }
    /**
     * 移除StatusBar的icon.
     */
    public void removeIcon(String slot) {
        ......
    }
    /**
    * 设置StatusBar的icon.
    */
    public void setIcon(String slot, int iconId, int iconLevel, String contentDescription) {
        ......
        }
    }
    /**
    * 设置StatusBar的icon的可见性.
    */
    public void setIconVisibility(String slot, boolean visible) {
        ......
    }
}
```

> 这个类定义在文件`frameworks/base/core/java/android/app/StatusBarManager.java`中。
>

StatusBarManager提供的功能不多，从上面的代码的注释，基本可以了解StatusBarManager所能提供的功能。

## StatusBarManager的使用

下面以expandSettingsPanel()和setIcon()为例，阐述这两个功能的实现过程。

demo的主要代码如下：

```java
public class MainActivity extends Activity {

    private StatusBarManager mStatusBarManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //获取StatusBarManager对象实例
        mStatusBarManager = (StatusBarManager) getSystemService(Context.STATUS_BAR_SERVICE);
    }

    public void buttonClick(View v) {
        switch (v.getId()){
            case R.id.btn1:
                //展开快速设置面板
                mStatusBarManager.expandSettingsPanel();
                break;

            case R.id.btn2:
                //设置时钟图标
                mStatusBarManager.setIcon("clock", R.drawable.clock, 0, null);
                break;
            }
    }
}
```

### 深入实现过程

#### 展开面板的过程

在上文中我们已经知道，StatusBarManager是StatusBarManagerService上层接口的封装，因此，mStatusBarManager.expandSettingsPanel()实质调用的是StatusBarManagerService的expandSettingsPanel()方法，如下：

```java
public void expandSettingsPanel(String subPanel) {
    enforceExpandStatusBar();
    if (mBar != null) {
        try {
            mBar.animateExpandSettingsPanel(subPanel);
        } catch (RemoteException ex) {
        }
    }
}
```

> 这个方法定义在文件`frameworks/base/services/core/java/com/android/server/statusbar/StatusBarManagerService.java`中。
>

首先是调用了enforceExpandStatusBar()方法，该方法会检测调用者是否有展开下拉面板的权限，因此，调用者需要在Manifest文件中声明**权限android.permission.EXPAND\_STATUS\_BAR**。

接着通过mBar调用了animateExpandSettingsPanel()方法，mBar是AIDL IStatusBar的实例，mBar在手机启动的时候启动SystemUI时被实例化，mBar的实质是IStatusBar的子类CommandQueue的实例，CommandQueue定制在文件

`frameworks/base/packages/SystemUI/src/com/android/systemui/statusbar/CommandQueue.java`中。读者如果不了解这个过程，可以参阅文章《[SystemUI架构分析](http://blog.csdn.net/myfriend0/article/details/54972861) 》。animateExpandSettingsPanel()的实现如下：

```java
public void animateExpandSettingsPanel(String subPanel) {
    synchronized (mLock) {
        mHandler.removeMessages(MSG_EXPAND_SETTINGS);
        mHandler.obtainMessage(MSG_EXPAND_SETTINGS, subPanel).sendToTarget();
    }
}
```

> 这个方法定义在文件`frameworks/base/packages/SystemUI/src/com/android/systemui/statusbar/CommandQueue.java`中。
>

animateExpandSettingsPanel()只是发送了一个消息，继续跟踪如下：

```java
private final class H extends Handler {
        public void handleMessage(Message msg) {
            case MSG_EXPAND_SETTINGS:
                mCallbacks.animateExpandSettingsPanel((String) msg.obj);
                break;
        }
}
```

> 这个方法定义在文件`frameworks/base/packages/SystemUI/src/com/android/systemui/statusbar/CommandQueue.java`中。
>

在处理消息的地方通过mCallbacks又调用了animateExpandSettingsPanel()，mCallbacks实质是PhoneStatusBar的实例，读者如果不了解这个过程，可以参阅文章《[SystemUI架构分析](http://blog.csdn.net/myfriend0/article/details/54972861) 》。因此mCallbacks.animateExpandSettingsPanel()的定义如下：

```java
public void animateExpandSettingsPanel(String subPanel) {
    ......
    if (subPanel != null) {
        mQSPanel.openDetails(subPanel);
    }
    mNotificationPanel.expandWithQs();

    if (false) postStartTracing();
}
```

> 这个方法定义在文件`frameworks/base/packages/SystemUI/src/com/android/systemui/statusbar/phone/PhoneStatusBar.java`中。
>

这里调用了mNotificationPanel的expandWithQs()方法，mNotificationPanel是NotificationPanelView的实例对象，NotificationPanelView是View的间接子类，也就是通知面板。到此，本文就不再往下跟踪这个过程了，已经超出本文所要阐述的内容。

#### 设置StatusBar Icon的过程

StatusBarManager的setIcon()方法和展开面板的类似，在StatusBarManagerService中定义如下：

```java
public void setIcon(String slot, String iconPackage, int iconId, int iconLevel,
            String contentDescription) {
    enforceStatusBar();

    synchronized (mIcons) {
        StatusBarIcon icon = new StatusBarIcon(iconPackage, UserHandle.SYSTEM, iconId,
                iconLevel, 0, contentDescription);
        //Slog.d(TAG, "setIcon slot=" + slot + " index=" + index + " icon=" + icon);
        mIcons.put(slot, icon);

        if (mBar != null) {
            try {
                mBar.setIcon(slot, icon);
            } catch (RemoteException ex) {
            }
        }
    }
    }
```

> 这个方法定义在文件`frameworks/base/services/core/java/com/android/server/statusbar/StatusBarManagerService.java`中。
>

和展开面板类似，首先调用enforceStatusBar()检测调用者是否有对应的权限，这里需要检测的**权限是android.permission.STATUS\_BAR。**

接着把相关的数据封装到StatusBarIcon对象中，在某些设备中，不允许自定义Status Bar Icon，也就是说参数slot必须要配置在config.xml文件中，如下：

```xml
<string-array name="config_statusBarIcons">
        <item><xliff:g id="id">@string/status_bar_rotate</xliff:g></item>
        <item><xliff:g id="id">@string/status_bar_headset</xliff:g></item>
        ......
        <item><xliff:g id="id">@string/status_bar_data_connection</xliff:g></item>
        <item><xliff:g id="id">@string/status_bar_phone_evdo_signal</xliff:g></item>
        <item><xliff:g id="id">@string/status_bar_phone_signal</xliff:g></item>
        <item><xliff:g id="id">@string/status_bar_clock</xliff:g></item>
    </string-array>
```

> 这些数据定义在文件`frameworks/base/core/res/res/values/config.xml`中。
>

也就是说，在某些设备，参数slot的值必须匹配上面数组中的某个item的值，才能正常显示在状态栏中。继续往下看，mBar.setIcon()，和展开面板一样，mBar.setIcon()的定义如下：

```java
public void setIcon(String slot, StatusBarIcon icon) {
    mIconController.setIcon(slot, icon);
}
```

> 这个方法定义在文件`frameworks/base/packages/SystemUI/src/com/android/systemui/statusbar/phone/PhoneStatusBar.java`中。
>

这里通过mIconController继续调用了setIcon()方法。到此，本文就不再往下阐述这个过程了。

### 总结

本文介绍了StatusBarManagerService以及其上层接口StatusBarManager的使用，但是，StatusBarManager对于第三方APP却没有公开这个接口。本文以展开设置面板和设置状态栏图标为例，详细阐述了从上层接口StatusBarManager到SystemUI的过程。除StatusBarManager外，StatusBarManagerService是持有SystemUI的远程句柄mBar，所以系统还有其它需要和SystemUI“打交道”的功能，也会通过StatusBarManagerService。

 

  

本文转自 [https://blog.csdn.net/myfriend0/article/details/60758265](https://blog.csdn.net/myfriend0/article/details/60758265)，如有侵权，请联系删除。