---
title: SystemUI Launcher3模块显示最近应用列表的相关代码
date: 2023-11-18
tags:
 - android
categories: 
 - android
sticky: 
   true
---

前言
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Android12对最近应用列表做了调整，将早期同版本中原本处于SystemUI模块的最近应用列表转移到了Launcher3QuickStep应用中。  

本篇文章我们会结合源码一起来梳理一下最近应用列表的显示流程，以便更好的明白SystemUI模块是如何给Launcher3模块发送消息的。

一、SystemUI模块显示最近应用列表的相关代码
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1、在SystemUI模块调用CommandQueue的showRecentApps方法可以实现最近应用列表的显示。

> frameworks/base/packages/SystemUI/src/com/android/systemui/statusbar/CommandQueue.java

```java
public class CommandQueue extends IStatusBar.Stub implements
        CallbackController<Callbacks>,
        DisplayManager.DisplayListener {
    
    private Handler mHandler = new H(Looper.getMainLooper());

    public void showRecentApps(boolean triggeredFromAltTab) {
        synchronized (mLock) {
            mHandler.removeMessages(MSG_SHOW_RECENT_APPS);
            mHandler.obtainMessage(MSG_SHOW_RECENT_APPS, triggeredFromAltTab ? 1 : 0, 0,
                    null).sendToTarget();
        }
    }
    
}
```

showRecentApps方法会调用Handler发送类型为MSG\_SHOW\_RECENT\_APPS的消息。

2、Handler对象在接收到MSG\_SHOW\_RECENT\_APPS消息之后，会调用所有回调对象的showRecentApps方法。

```java
public class CommandQueue extends IStatusBar.Stub implements
        CallbackController<Callbacks>,
        DisplayManager.DisplayListener {
    private static final int MSG_SHOW_RECENT_APPS = 13 << MSG_SHIFT;//显示最近应用列表
    private ArrayList<Callbacks> mCallbacks = new ArrayList<>();//回调对象集合
    
    private final class H extends Handler {
        private H(Looper l) {
            super(l);
        }
        public void handleMessage(Message msg) {
            final int what = msg.what & MSG_MASK;
            switch (what) {
                case MSG_SHOW_RECENT_APPS:
                    for (int i = 0; i < mCallbacks.size(); i++) {
                        //调用左右回调对象的showRecentApps方法
                        mCallbacks.get(i).showRecentApps(msg.arg1 != 0);
                    }
                    break;
            }
        }
    }

    public interface Callbacks {
        default void showRecentApps(boolean triggeredFromAltTab) {}
    }

}
```

3、类型为Recents的SystemUI组件实现了CommandQueue.Callbacks接口，并将自身添加到了CommandQueue的监听回调对象集合中，  

这样CommandQueue的showRecentApps方法会触发Recents组件的showRecentApps方法。

> frameworks/base/packages/SystemUI/src/com/android/systemui/recents/Recents.java

```java
public class Recents extends SystemUI implements CommandQueue.Callbacks {

    private final RecentsImplementation mImpl;
    private final CommandQueue mCommandQueue;

    public Recents(Context context, RecentsImplementation impl, CommandQueue commandQueue) {
        super(context);
        mImpl = impl;
        mCommandQueue = commandQueue;
    }

    @Override
    public void start() {
        mCommandQueue.addCallback(this);
        mImpl.onStart(mContext);
    }

	//显示最近应用列表
    @Override
    public void showRecentApps(boolean triggeredFromAltTab) {
        // Ensure the device has been provisioned before allowing the user to interact with
        // recents
        if (!isUserSetup()) {
            return;
        }
        android.util.Log.d("SystemUI.Recents", "showRecentApps: triggeredFromAltTab = " + triggeredFromAltTab);
        mImpl.showRecentApps(triggeredFromAltTab);
    }
    
}
```

Recents的showRecentApps方法会进一步调用RecentsImplementation的showRecentApps方法。

4、RecentsImplementation是一个接口。

> frameworks/base/packages/SystemUI/src/com/android/systemui/recents/RecentsImplementation.java

```java
public interface RecentsImplementation {
    default void onStart(Context context) {}
    default void onBootCompleted() {}
    default void onAppTransitionFinished() {}
    default void onConfigurationChanged(Configuration newConfig) {}

    default void preloadRecentApps() {}
    default void cancelPreloadRecentApps() {}
    default void showRecentApps(boolean triggeredFromAltTab) {}
    default void hideRecentApps(boolean triggeredFromAltTab, boolean triggeredFromHomeKey) {}
    default void toggleRecentApps() {}

    default void dump(PrintWriter pw) {}
}
```

5、在SystemUI模块的具体实现类是OverviewProxyRecentsImpl。

> frameworks/base/packages/SystemUI/src/com/android/systemui/recents/OverviewProxyRecentsImpl.java

```java
public class OverviewProxyRecentsImpl implements RecentsImplementation {

    private final static String TAG = "OverviewProxyRecentsImpl";
    @Nullable
    private final Lazy<Optional<StatusBar>> mStatusBarOptionalLazy;

    private Context mContext;
    private Handler mHandler;
    private TrustManager mTrustManager;
    private OverviewProxyService mOverviewProxyService;

    @SuppressWarnings("OptionalUsedAsFieldOrParameterType")
    @Inject
    public OverviewProxyRecentsImpl(Lazy<Optional<StatusBar>> statusBarOptionalLazy) {
        mStatusBarOptionalLazy = statusBarOptionalLazy;
    }

    @Override
    public void onStart(Context context) {
        mContext = context;
        mHandler = new Handler();
        mTrustManager = (TrustManager) context.getSystemService(Context.TRUST_SERVICE);
        //为OverviewProxyService赋值
        mOverviewProxyService = Dependency.get(OverviewProxyService.class);
    }

    @Override
    public void showRecentApps(boolean triggeredFromAltTab) {
        android.util.Log.d("SystemUI.OverviewProxyRecentsImpl", "showRecentApps: triggeredFromAltTab = " + triggeredFromAltTab);
        //IOverviewProxy是一个aidl，最初是调用OverviewProxyService的getProxy方法进行赋值的
        IOverviewProxy overviewProxy = mOverviewProxyService.getProxy();
        if (overviewProxy != null) {
            try {
                //继续调用onOverviewShown方法
                overviewProxy.onOverviewShown(triggeredFromAltTab);
                return;
            } catch (RemoteException e) {
                Log.e(TAG, "Failed to send overview show event to launcher.", e);
            }
        } else {
            // Do nothing
        }
    }
    
}
```

OverviewProxyRecentsImpl的showRecentApps方法会进一步调用代理者IOverviewProxy的onOverviewShown方法，IOverviewProxy是一个aidl。这里调用OverviewProxyService的getProxy方法为overviewProxy赋值。mOverviewProxyService最初是通过Dependency进行赋值的。

6、OverviewProxyService类和getProxy方法相关代码如下所示。

> frameworks/base/packages/SystemUI/src/com/android/systemui/recents/OverviewProxyService.java

```java
public class OverviewProxyService extends CurrentUserTracker implements
        CallbackController<OverviewProxyListener>, NavigationModeController.ModeChangedListener,
        Dumpable {
    
        //唤起Launcher3模块TouchInteractionService的Action
        private static final String ACTION_QUICKSTEP = "android.intent.action.QUICKSTEP_SERVICE";
        //唤起Launcher3模块TouchInteractionService的Intent
        private final Intent mQuickStepIntent;
        //远程IPC通信是实现类
        private IOverviewProxy mOverviewProxy;
        private boolean mBound;
        
        public OverviewProxyService(Context context, CommandQueue commandQueue,
                                    Lazy<NavigationBarController> navBarControllerLazy,
                                    Lazy<Optional<StatusBar>> statusBarOptionalLazy,
                                    NavigationModeController navModeController,
                                    NotificationShadeWindowController statusBarWinController, SysUiState sysUiState,
                                    Optional<Pip> pipOptional,
                                    Optional<LegacySplitScreen> legacySplitScreenOptional,
                                    Optional<SplitScreen> splitScreenOptional,
                                    Optional<OneHanded> oneHandedOptional,
                                    Optional<RecentTasks> recentTasks,
                                    Optional<StartingSurface> startingSurface,
                                    BroadcastDispatcher broadcastDispatcher,
                                    ShellTransitions shellTransitions,
                                    ScreenLifecycle screenLifecycle,
                                    SmartspaceTransitionController smartspaceTransitionController,
                                    UiEventLogger uiEventLogger,
                                    DumpManager dumpManager) {
            super(broadcastDispatcher);
            ...代码省略...
            //获取最近应用列表组件名称
            mRecentsComponentName = ComponentName.unflattenFromString(context.getString(
                    com.android.internal.R.string.config_recentsComponentName));
            //创建最近应用列表Activity的意图对象
            mQuickStepIntent = new Intent(ACTION_QUICKSTEP).setPackage(mRecentsComponentName.getPackageName());
            ...代码省略...
            startConnectionToCurrentUser();
            ...代码省略...
        }
        
        //成功绑定服务所返回的ServiceConnection对象
        private final ServiceConnection mOverviewServiceConnection = new ServiceConnection() {
            @Override
            public void onServiceConnected(ComponentName name, IBinder service) {
                ...代码省略...
                //拿到IOverviewProxy对象，为后续跨进程通信做准备
                mOverviewProxy = IOverviewProxy.Stub.asInterface(service);
                ...代码省略...
            }
            
        };
    
	    public void startConnectionToCurrentUser() {
	        if (mHandler.getLooper() != Looper.myLooper()) {
	            mHandler.post(mConnectionRunnable);
	        } else {
	            internalConnectToCurrentUser();
	        }
	    }

        private void internalConnectToCurrentUser() {
            ...代码省略...       
            Intent launcherServiceIntent = new Intent(ACTION_QUICKSTEP)
                    .setPackage(mRecentsComponentName.getPackageName());
            try {
                //绑定服务
                mBound = mContext.bindServiceAsUser(launcherServiceIntent,
                        mOverviewServiceConnection,
                        Context.BIND_AUTO_CREATE | Context.BIND_FOREGROUND_SERVICE_WHILE_AWAKE,
                        UserHandle.of(getCurrentUserId()));
            } catch (SecurityException e) {
                Log.e(TAG_OPS, "Unable to bind because of security error", e);
            }
            ...代码省略...
        }
    
        public IOverviewProxy getProxy() {
            return mOverviewProxy;
        }        
                
                
    }
```

对以上代码做个简单总结：

1）为最近应用列表组件名称mRecentsComponentName赋值。

> frameworks/base/core/res/res/values/config.xml

```xml
    <string name="config_recentsComponentName" translatable="false">com.android.launcher3/com.android.quickstep.RecentsActivity</string>
```

2）创建最近应用列表Activity的意图对象mQuickStepIntent  

3）创建最近应用列表服务的意图对象launcherServiceIntent，并进行服务绑定，触发mOverviewServiceConnection的回调方法拿到IOverviewProxy对象，为后续跨进程通信做准备。  

4）重新我们在前面第5步提到的OverviewProxyRecentsImpl的showRecentApps方法，该方法最终就是调用IOverviewProxy的onOverviewShown方法进行跨进程通信告知Launcher3唤起最近应用列表的。

二、Launcher3模块显示最近应用列表的相关代码
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

梳理完了SystemUI模块和最近应用列表相关的代码，我们再来看下Launcher3模块相关的代码。

1、通过前面的分析我们可以知道SystemUI模块在创建OverviewProxyService实例对象的时候，会绑定Launcher3模块的一个服务，该服务完整声明如下所示。

> packages/apps/Launcher3/quickstep/AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
     xmlns:tools="http://schemas.android.com/tools"
     package="com.android.launcher3">
    
    <application android:backupAgent="com.android.launcher3.LauncherBackupAgent">

        <service android:name="com.android.quickstep.TouchInteractionService"
             android:permission="android.permission.STATUS_BAR_SERVICE"
             android:directBootAware="true"
             android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.QUICKSTEP_SERVICE"/>
            </intent-filter>
        </service>
        
    </application>

</manifest>
```

2、调用CommandQueue的showRecentApps方法显示最近应用列表，该方法最终调用的其实是IOverviewProxy的onOverviewShown。  
这里我们具体看一下这个aidl的具体内容。

> frameworks/base/packages/SystemUI/shared/src/com/android/systemui/shared/recents/IOverviewProxy.aidl

```java
oneway interface IOverviewProxy {

    /**
     * 显示最近应用列表
     */
    void onOverviewShown(boolean triggeredFromAltTab) = 7;

}
```

3、Launcher3模块TouchInteractionService服务的TISBinder对象实现了这个aidl。

> packages/apps/Launcher3/quickstep/src/com/android/quickstep/TouchInteractionService.java

```java
public class TouchInteractionService extends Service
        implements ProtoTraceable<LauncherTraceProto.Builder> {

    private OverviewCommandHelper mOverviewCommandHelper;
    private final TISBinder mTISBinder = new TISBinder();
    /**
     * Local IOverviewProxy implementation with some methods for local components
     */
    public class TISBinder extends IOverviewProxy.Stub {

        @BinderThread
        @Override
        public void onOverviewShown(boolean triggeredFromAltTab) {
            android.util.Log.d("Launcher3.TouchInteractionService", "onOverviewShown: triggeredFromAltTab = " + triggeredFromAltTab);
            if (triggeredFromAltTab) {
                TaskUtils.closeSystemWindowsAsync(CLOSE_SYSTEM_WINDOWS_REASON_RECENTS);
                mOverviewCommandHelper.addCommand(OverviewCommandHelper.TYPE_SHOW_NEXT_FOCUS);
            } else {
                mOverviewCommandHelper.addCommand(OverviewCommandHelper.TYPE_SHOW);
            }
        }

    }
    
    @Override
    public IBinder onBind(Intent intent) {
        Log.d(TAG, "Touch service connected: user=" + getUserId());
        return mTISBinder;
    }
}       
```

TISBinder对象的onOverviewShown方法会进一步调用OverviewCommandHelper对象的addCommand方法，传入TYPE\_SHOW。

4、OverviewCommandHelper和显示最近应用列表相关的代码如下所示。

```java
public class OverviewCommandHelper {

    public static final int TYPE_SHOW = 1;//显示
    public static final int TYPE_SHOW_NEXT_FOCUS = 2;
    public static final int TYPE_HIDE = 3;//隐藏
    public static final int TYPE_TOGGLE = 4;//切换
    public static final int TYPE_HOME = 5;//首页

    public void addCommand(int type) {
        CommandInfo cmd = new CommandInfo(type);
        MAIN_EXECUTOR.execute(() -> addCommand(cmd));
    }

    private void addCommand(CommandInfo cmd) {
        boolean wasEmpty = mPendingCommands.isEmpty();
        mPendingCommands.add(cmd);
        if (wasEmpty) {
            executeNext();
        }
    }

    private void executeNext() {
        if (mPendingCommands.isEmpty()) {
            return;
        }
        CommandInfo cmd = mPendingCommands.get(0);
        //层层调用，最终触发executeCommand方法。
        if (executeCommand(cmd)) {
            scheduleNextTask(cmd);
        }
    }
    
    private <T extends StatefulActivity<?>> boolean executeCommand(CommandInfo cmd) {
        //获取activityInterface对象实例，这里获取的其实是LauncherActivityInterface
        BaseActivityInterface<?, T> activityInterface =
                mOverviewComponentObserver.getActivityInterface();
        RecentsView recents = activityInterface.getVisibleRecentsView();
        if (recents == null) {//如果视图为空，说明最近应用列表视图不可见
            if (cmd.type == TYPE_HIDE) {
                // already hidden
                return true;
            }
            if (cmd.type == TYPE_HOME) {
                android.util.Log.d("Launcher3.OverviewCommandHelper", "executeCommand cmd.type == TYPE_HOME");
                mService.startActivity(mOverviewComponentObserver.getHomeIntent());
                LauncherSplitScreenListener.INSTANCE.getNoCreate().notifySwipingToHome();
                return true;
            }
        } else {//如果视图不为空，说明最近应用列表视图可见
            switch (cmd.type) {
                case TYPE_SHOW:
                    // already visible
                    return true;
                case TYPE_HIDE: {
                    int currentPage = recents.getNextPage();
                    TaskView tv = (currentPage >= 0 && currentPage < recents.getTaskViewCount())
                            ? (TaskView) recents.getPageAt(currentPage)
                            : null;
                    return launchTask(recents, tv, cmd);
                }
                case TYPE_TOGGLE:
                    return launchTask(recents, getNextTask(recents), cmd);
                case TYPE_HOME:
                    android.util.Log.d("Launcher3.OverviewCommandHelper", "executeCommand TYPE_HOME");
                    recents.startHome();
                    LauncherSplitScreenListener.INSTANCE.getNoCreate().notifySwipingToHome();
                    return true;
            }
        }
        ...代码省略...
        //调用LauncherActivityInterface的getCreatedActivity方法
       final T activity = activityInterface.getCreatedActivity();
        if (activity != null) {
            InteractionJankMonitorWrapper.begin(
                    activity.getRootView(),
                    InteractionJankMonitorWrapper.CUJ_QUICK_SWITCH);
        }
        return false;
    }
    
}
```

 

  

本文转自 [https://blog.csdn.net/abc6368765/article/details/129360597?spm=1001.2101.3001.6650.2&utm\_medium=distribute.pc\_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-129360597-blog-51036772.235%5Ev38%5Epc\_relevant\_default\_base&depth\_1-utm\_source=distribute.pc\_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-129360597-blog-51036772.235%5Ev38%5Epc\_relevant\_default\_base&utm\_relevant\_index=3](https://blog.csdn.net/abc6368765/article/details/129360597?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-129360597-blog-51036772.235%5Ev38%5Epc_relevant_default_base&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-2-129360597-blog-51036772.235%5Ev38%5Epc_relevant_default_base&utm_relevant_index=3)，如有侵权，请联系删除。
