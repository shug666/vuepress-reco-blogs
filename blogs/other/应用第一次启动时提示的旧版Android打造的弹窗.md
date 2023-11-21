```
title: Android 应用第一次启动时提示的旧版Android打造的弹窗
date: 2023-01-04
tags:
 - android
categories: 
 - android
sticky: 
   true
```

应用安装完成后第一次打开，出现"**此应用专为旧版Android打造，因此可能无法正常运行。请尝试检查更新或与开发者联系**"提示，出现这种错误的原因：

应用启动，startActivity时，流程会执行到realStartActivityLocked方法，代码位于ActivityStackSupervisor.java

realStartActivityLocked方法中，会调用AppWarnings.java的onStartActivity方法，如下：

```java
final boolean realStartActivityLocked(ActivityRecord r, ProcessRecord app, boolean andResume, boolean checkConfig) throws RemoteException {
    try {
        // ...
        //通过此方法弹出提示框，注释此方法即可
        mService.getAppWarningsLocked().onStartActivity(r);
        // ...
    } catch (RemoteException e) {
        // ...
    }
}
```

onStartActivity方法实现：

```java
/**
     * Called when an activity is being started.
     *
     * @param r record for the activity being started
     */
public void onStartActivity(ActivityRecord r) {
    showUnsupportedCompileSdkDialogIfNeeded(r);
    showUnsupportedDisplaySizeDialogIfNeeded(r);
    showDeprecatedTargetDialogIfNeeded(r);
}
```
