---
title: Android AMS初始化和启动简介
date: 2023-01-13
tags:
 - android
categories: 
 - android
sticky: 
   true
---



1.Activity Manager简介
-----------------------------------------------------------------------------

`Activity Manager`是Android框架层提供的核心模块之一。如果仅从命名上理解，很容易将其视为**Activity管理器**，实际上，**Activity管理器**只是`Activity Manager`提供的众多功能之一。

`Activity Manager`提供的功能主要有以下几种:

1. 启动或杀死应用程序进程。
2. 启动并调度`Activity`生命周期。
3. 启动并调度应用程序`Service`生命周期。
4. 注册`Broadcast Receiver`，并接收和分发`Broadcast`。
5. 启动并发布`Content Provider`。
6. 调度`task`。
7. 检查、授予、收回访问URI的权限。
8. 处理应用程序crash。
9. 调整进程调度优先级及策略（调整OOM adj）。
10. 查询当前系统运行状态（包含Memory、Graphics、CPU、Database等）。

`Activity Manager`的组成主要分为以下六部分(在android 8.0以上，`ActivityManagerProxy`消失了，由`IActivityManager.aidl`代替)：

1.  `Binder`接口：由`IBinder`和`Binder`提供进程间通信的接口。
2.  服务接口：由`IInterface`和`IActivityManager`提供系统服务的接口。
3.  服务中枢：`ActivityManagerNative`继承自`Binder`并实现了`IActivityManager`，它提供了服务接口和Binder接口的相互转化功能，并在内部存储服务代理对象并提供了`getDefault`方法返回服务代理。
4.  服务代理：由`ActivityManagerProxy`实现，用于与Server端提供的系统服务进行进程间通信。
5.  Client：由`ActivityManager`封装一部分服务接口供Client调用。`ActivityManager`内部通过调用`ActivityManagerNative`的`getDefault`方法，可以得到一个`ActivityManagerProxy`对象的引用，进而通过该代理对象调用远程服务的方法。
6.  Server：由`ActivityManagerService`实现，提供Server端的系统服务。

`Activity Manager`涉及的主要类如图所示(在android 8.0以上，`ActivityManagerProxy`消失了，由`IActivityManager.aidl`代替)：:  
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/2019072511125164.png)  
由以上分析可知，`Activity Manager`仍然是基于Binder通信的C/S体系结构。在该体系结构中，Server端的`ActivityManagerService`提供核心功能，这里便从`ActivityManagerService`入手分析`Activity Manager`, 代码参考AOSP 中 `API 23` ([android 6.0.1](http://androidxref.com/6.0.1_r10/))

从源码来分析：  
`IActivityManager`是对外的`IInterface`接口

```java
public interface IActivityManager extends IInterface {
    public int startActivity(IApplicationThread caller, String callingPackage, Intent intent,
            String resolvedType, IBinder resultTo, String resultWho, int requestCode, int flags,
            ProfilerInfo profilerInfo, Bundle options) throws RemoteException;
    public int startActivityAsUser(IApplicationThread caller, String callingPackage, Intent intent,
            String resolvedType, IBinder resultTo, String resultWho, int requestCode, int flags,
            ProfilerInfo profilerInfo, Bundle options, int userId) throws RemoteException;
    public int startActivityAsCaller(IApplicationThread caller, String callingPackage,
            Intent intent, String resolvedType, IBinder resultTo, String resultWho, int requestCode,
            int flags, ProfilerInfo profilerInfo, Bundle options, boolean ignoreTargetSecurity,
            int userId) throws RemoteException;
            ....

```

`ActivityManagerNative` 继承了 `IActivityManager`，但它也是个`abstract`类，它没有实现 `IActivityManager`的任何接口

```java
public abstract class ActivityManagerNative extends Binder implements IActivityManager
{
		....

```

`ActivityManagerService` 继承了 `ActivityManagerNative`,并实现了`IActivityManager`的所有接口，所以它是`IActivityManager`在**服务端**的真实实现类

```java
public final class ActivityManagerService extends ActivityManagerNative
        implements Watchdog.Monitor, BatteryStatsImpl.BatteryCallback {
        ....

```

`ActivityManagerProxy` 继承了 `IActivityManager`,并实现了`IActivityManager`的所有接口，所以它是`IActivityManager`在**客户端**的真实实现类

```java
class ActivityManagerProxy implements IActivityManager
{
		.....
}

```

`ActivityManagerNative` 通过`getDefault`方法来返回对象，如果是**服务端**，就直接返回`ActivityManagerService`对象 ，如果是**客户端**，就直接返回`ActivityManagerProxy` 对象

```java
    static public IActivityManager getDefault() {
        return gDefault.get();
    }
    --->gDefault的赋值如下:
     private static final Singleton<IActivityManager> gDefault = new Singleton<IActivityManager>() {
        protected IActivityManager create() {
            IBinder b = ServiceManager.getService("activity");
            IActivityManager am = asInterface(b);
            return am;
        }
    };
      --->asInterface定义如下:
      static public IActivityManager asInterface(IBinder obj) {
        if (obj == null) {
            return null;
        }
        IActivityManager in =
            (IActivityManager)obj.queryLocalInterface(descriptor);
        if (in != null) {
            return in;
        }

        return new ActivityManagerProxy(obj);
    }

```

可以看出，它们和aidl自动生成的类是非常相似的， 参看 [aidl自动生成类分析](https://blog.csdn.net/hgy413/article/details/95606150#231_aidl_344)

2.AMS 的启动和初始化过程
------------------------------------------------------------------------

### 2.1.AMS 所在的system进程

`ActivityManagerService`是由`system`进程启动的Java系统服务之一。启动代码位于`frameworks/base/services/java/com/android/server/SystemServer.java`中，代码如下:

```java
//  zygote的main入口
 public static void main(String[] args) {
   new SystemServer().run();
 }

```

\===> `SystemServer().run`的部分代码:

```java
 private void run() {
       <--开始!-->
            // Prepare the main looper thread (this thread).
            <--准备主线程(该线程)-->
            android.os.Process.setThreadPriority(
                android.os.Process.THREAD_PRIORITY_FOREGROUND);
            android.os.Process.setCanSelfBackground(false);
            Looper.prepareMainLooper();
            Looper.getMainLooper().setSlowLogThresholdMs(
                    SLOW_DISPATCH_THRESHOLD_MS, SLOW_DELIVERY_THRESHOLD_MS);
     
            <--初始化native服务-->
            System.loadLibrary("android_servers");
    
            <--初始化系统上下文-->
            createSystemContext();
    
            <--创建system service manager!!!-->    
            mSystemServiceManager = new SystemServiceManager(mSystemContext);
            mSystemServiceManager.setStartInfo(mRuntimeRestart,
                    mRuntimeStartElapsedTime, mRuntimeStartUptime);
            LocalServices.addService(SystemServiceManager.class, mSystemServiceManager);
            // Prepare the thread pool for init tasks that can be parallelized
            SystemServerInitThreadPool.get();

     
       <--打开系统服务-->
            <--启动引导服务-->
            <--用SystemServiceManager启动了ActivityManagerService、PowerManagerService、 PackageManagerService等服务-->
            startBootstrapServices();
    
            <--核心服务-->
            <--启动BatteryService、UsageStatsService和WebViewUpdateService-->
            startCoreServices();
    
            <--启动其他服务-->
            <--启动了WMS,CameraService、AlarmManagerService、VrManagerService等服务-->
            startOtherServices();
    
      <--Loop forever-->
        Looper.loop();
        throw new RuntimeException("Main thread loop unexpectedly exited");
    }

```

\===> `system`进程的`Context`上下文（`mSystemContext`）由`createSystemContext`创建  
`ActivityThread.systemMain`生成`ActivityThread`对象  
`ActivityThread`的构造方法就是很简单创建了一个`ResourcesManager`对象，用于管理应用程序中的资源文件，然后调用`attach`方法, 代码如下：

```java
    private void createSystemContext() {
        ActivityThread activityThread = ActivityThread.systemMain();
        mSystemContext = activityThread.getSystemContext(); // `system`进程的`Context`上下文
        mSystemContext.setTheme(android.R.style.Theme_DeviceDefault_Light_DarkActionBar);
    }
--->systemMain 函数内部实现:
    public static ActivityThread systemMain() {
        // The system process on low-memory devices do not get to use hardware
        // accelerated drawing, since this can add too much overhead to the
        // process.
        if (!ActivityManager.isHighEndGfx()) {
            HardwareRenderer.disable(true);
        } else {
            HardwareRenderer.enableForegroundTrimming();
        }
        ActivityThread thread = new ActivityThread(); // 构造ActivityThread 
        thread.attach(true); // attach方法
        return thread;
    }
 --->ActivityThread构造函数内部实现:
 ActivityThread() {
        mResourcesManager = ResourcesManager.getInstance();
    }
--->activityThread.getSystemContext函数实现:
public ContextImpl getSystemContext() {
        synchronized (this) {
            if (mSystemContext == null) {
                mSystemContext = ContextImpl.createSystemContext(this);
            }
            return mSystemContext;
        }
    }

```

分步分析：

1.  `ActivityThread.systemMain`方法内部调用了`ActivityThread`的`Attach`方法, 传进来的参数为`true`,代表该进程为系统进程,首先调用`setAppName`将系统应用的名称改为`system_process`, 然后创建了一个`Instrumentation`类，该类是一个工具类，`ActivityThread`接收到`AMS`的指令创建和调度交互都由它来执行。

然后调用`createAppContext`来创建一个该进程相关的`context`对象,传入的关键参数为系统进程的apk相关信息。  
并创建了`android.app.application`对象，并调用了`application`的`onCreate`方法。

代码如下：

```java
    private void attach(boolean system) {
        sCurrentActivityThread = this;
        mSystemThread = system;
        if (!system) {
            .......
        } else {
            // Don't set application object here -- if the system crashes,
            // we can't display an alert, we just want to die die die.
            // 修改系统进程的名称为system_process
            android.ddm.DdmHandleAppName.setAppName("system_process",
                    UserHandle.myUserId());
            try {
                mInstrumentation = new Instrumentation();
                //创建一个该进程相关的context对象
                ContextImpl context = ContextImpl.createAppContext(
                        this, getSystemContext().mPackageInfo);
                mInitialApplication = context.mPackageInfo.makeApplication(true, null);
                mInitialApplication.onCreate();
            } catch (Exception e) {
                throw new RuntimeException(
                        "Unable to instantiate Application():" + e.toString(), e);
            }
        }
      .....
    }

```

2.  `activityThread.getSystemContext`方法内部调用了`ContextImpl.createSystemContext`方法, 首先创建了一个`LoadedApk`对象，然后根据`LoadedApk`对象创建了一个`ContextImpl`对象，`LoadedApk`代表一个加载到系统中的APK。 其中保存了apk的基本信息。

代码如下：

```java
    static ContextImpl createSystemContext(ActivityThread mainThread) {
        LoadedApk packageInfo = new LoadedApk(mainThread);
        ContextImpl context = new ContextImpl(null, mainThread,
                packageInfo, null, null, false, null, null, Display.INVALID_DISPLAY);
        context.mResources.updateConfiguration(context.mResourcesManager.getConfiguration(),
                context.mResourcesManager.getDisplayMetricsLocked());
        return context;
    }
   ---->LoadedApk的构造函数，只有系统进程创建的时候可以调用：
   LoadedApk(ActivityThread activityThread) {
        mActivityThread = activityThread;
        mApplicationInfo = new ApplicationInfo();
        mApplicationInfo.packageName = "android";
        mPackageName = "android";
        mAppDir = null;
        mResDir = null;
        mSplitAppDirs = null;
        mSplitResDirs = null;
        mOverlayDirs = null;
        mSharedLibraries = null;
        mDataDir = null;
        mDataDirFile = null;
        mLibDir = null;
        mBaseClassLoader = null;
        mSecurityViolation = false;
        mIncludeCode = true;
        mRegisterPackage = false;
        mClassLoader = ClassLoader.getSystemClassLoader();
        mResources = Resources.getSystem();
    }

```

为什么函数名是`getSystemContext`呢？因为在初始化`ContextImpl`时使用了一个`LoadedApk`对象

`LoadedApk`用于保存一些和APK相关的信息（如资源文件位置、JNI库位置等）

在`getSystemContext`函数中初始化`ContextImpl`的这个`LoadedApk`所代表的package，名为"android"，也就是`framework-res.apk`，由于该APK仅供`system`进程使用，所以此处称为`getSystemContext`。

\===>总结下前面的实现：  
1.生成了一个`ActivityThread`对象，它代表应用进程的主线程  
`ActivityThread`代表主线程，它通过`mInstrumentation`指向`Instrumentation`。另外，它还保存多个`Application`对象。

2.生成了`system`进程的`Context`上下文环境即`activityThread.mSystemContext`对象  
从涉及的面来看，`Context`涉及的面最广。它通过`mResources`指向`Resources`，通过`mPackageInfo`指向`LoadedApk`，通过`mMainThread`指向`ActivityThread`，通过`mContentResolver`指向`ApplicationContentResolver`。

这些东西就构成了Android程序的运行环境。

为什么要为系统进程设置应用的运行环境呢，简单的说：就是把`system`系统进程也看做一个特殊的应用程序。这样做它就可以和普通应用进程一样使用统一的接口和系统交互了。

\===> 再次回到最开始的入口，下面开始分析`startBootstrapServices`和`startOtherServices`中`AMS`的关键调用函数：

```java
// Start services.
try {
   startBootstrapServices();
   ...
   startOtherServices();
}

```

### 2.1.AMS 初始化流程

\===>创建`AMS`的过程位于`startBootstrapServices`中，代码如下：

```java
    private ActivityManagerService mActivityManagerService;
```
```java
//startBootstrapServices() 启动引导服务，在这里实际上已经new了AMS，在new方法里，已经初始化了AMS的大部分重要的属性。AMS的Looper和各种handler也是在这里准备好的。
private void startBootstrapServices() {
    .....
        <--调用SystemServiceManager的startSErvice()方法, 传入Lifecycle.class字节码文件的参数, 
    通过反射实例化Lifecycle对象,并启动AMS(通过这个参数"ActivityManagerService.Lifecycle.class"可以看出
                              Lifecycle是AMS的一个内部类)-->
        // Activity manager runs the show.
        mActivityManagerService = mSystemServiceManager.startService(
        ActivityManagerService.Lifecycle.class).getService();
    mActivityManagerService.setSystemServiceManager(mSystemServiceManager);
    .....
        // Set up the Application instance for the system process and get started.
        mActivityManagerService.setSystemProcess();
}

```

\===>`ActivityManagerService.Lifecycle`的构造方法中很简单的构造了一个`AMS`的对象，代码如下：

```java
        public Lifecycle(Context context) {
            super(context);
            mService = new ActivityManagerService(context);
        }

```

\===>接着看`AMS`的构造过程，代码如下：

```java
    public ActivityManagerService(Context systemContext) {
        mContext = systemContext;
        mFactoryTest = FactoryTest.getMode();
        // 获得当前运行在SystemServer中的ActivityThread对象
        mSystemThread = ActivityThread.currentActivityThread();

        Slog.i(TAG, "Memory class: " + ActivityManager.staticGetMemoryClass());

		// 创建用于处理本线程消息的线程和Handler对象，消息处理Handler是MainHandler类
        mHandlerThread = new ServiceThread(TAG,
                android.os.Process.THREAD_PRIORITY_FOREGROUND, false /*allowIo*/);
        mHandlerThread.start();
        mHandler = new MainHandler(mHandlerThread.getLooper());
        mUiHandler = new UiHandler();

		// 初始化广播的队列
        mFgBroadcastQueue = new BroadcastQueue(this, mHandler,
                "foreground", BROADCAST_FG_TIMEOUT, false);
        mBgBroadcastQueue = new BroadcastQueue(this, mHandler,
                "background", BROADCAST_BG_TIMEOUT, true);
        mBroadcastQueues[0] = mFgBroadcastQueue;
        mBroadcastQueues[1] = mBgBroadcastQueue;
		
		// 初始化Service相关的容器
        mServices = new ActiveServices(this);
        // 初始化Provider相关的Map，里面保存了注册的ContentProvider
        mProviderMap = new ProviderMap(this);

        // 初始化并创建data/system/目录
        File dataDir = Environment.getDataDirectory();
        File systemDir = new File(dataDir, "system");
        systemDir.mkdirs();
        // 初始化电量统计服务相关的信息
        mBatteryStatsService = new BatteryStatsService(systemDir, mHandler);
        mBatteryStatsService.getActiveStatistics().readLocked();
        mBatteryStatsService.scheduleWriteToDisk();
        mOnBattery = DEBUG_POWER ? true
                : mBatteryStatsService.getActiveStatistics().getIsOnBattery();
        mBatteryStatsService.getActiveStatistics().setCallback(this);
		 // 初始化系统统计服务，用于统计系统的运行信息
        mProcessStats = new ProcessStatsService(this, new File(systemDir, "procstats"));

        mAppOpsService = new AppOpsService(new File(systemDir, "appops.xml"), mHandler);
		// 打开/data/system/urigrants.xml，管理URI权限（与content provid读写有关）
        mGrantFile = new AtomicFile(new File(systemDir, "urigrants.xml"));

        // User 0 is the first and only user that runs at boot.
        // 创建系统的第一个user,userID为0，该用户具有管理员权限
        mStartedUsers.put(UserHandle.USER_OWNER, new UserState(UserHandle.OWNER, true));
        mUserLru.add(UserHandle.USER_OWNER);
        updateStartedUserArrayLocked();
		// 获取opengle的版本
        GL_ES_VERSION = SystemProperties.getInt("ro.opengles.version",
            ConfigurationInfo.GL_ES_VERSION_UNDEFINED);

        mTrackingAssociations = "1".equals(SystemProperties.get("debug.track-associations"));
		 // 初始化字体语言等配置信息
        mConfiguration.setToDefaults();
        mConfiguration.setLocale(Locale.getDefault());

        mConfigurationSeq = mConfiguration.seq = 1;
        mProcessCpuTracker.init();

        mCompatModePackages = new CompatModePackages(this, systemDir, mHandler);
        // 创建intent防火墙
        mIntentFirewall = new IntentFirewall(new IntentFirewallInterface(), mHandler);
        mRecentTasks = new RecentTasks(this);
        // 初始化StackSupervisor,该类是Activity启动和调度的核心类
        mStackSupervisor = new ActivityStackSupervisor(this, mRecentTasks);
        mTaskPersister = new TaskPersister(systemDir, mStackSupervisor, mRecentTasks);
		// cpu使用监控线程
        mProcessCpuThread = new Thread("CpuTracker") {
            @Override
            public void run() {
                while (true) {
                    try {
                        try {
                            synchronized(this) {
                                final long now = SystemClock.uptimeMillis();
                                long nextCpuDelay = (mLastCpuTime.get()+MONITOR_CPU_MAX_TIME)-now;
                                long nextWriteDelay = (mLastWriteTime+BATTERY_STATS_TIME)-now;
                                //Slog.i(TAG, "Cpu delay=" + nextCpuDelay
                                //        + ", write delay=" + nextWriteDelay);
                                if (nextWriteDelay < nextCpuDelay) {
                                    nextCpuDelay = nextWriteDelay;
                                }
                                if (nextCpuDelay > 0) {
                                    mProcessCpuMutexFree.set(true);
                                    this.wait(nextCpuDelay);
                                }
                            }
                        } catch (InterruptedException e) {
                        }
                        updateCpuStatsNow();
                    } catch (Exception e) {
                        Slog.e(TAG, "Unexpected exception collecting process stats", e);
                    }
                }
            }
        };
		// 将服务加入看门狗的监控
        Watchdog.getInstance().addMonitor(this);
        Watchdog.getInstance().addThread(mHandler);
    }

```

从代码中可以看出，`AMS`的构造方法主要是在做一些初始化的操作。先保存了自己的`Context`和`ActivityThread`。`AMS`负责调度四大组件，所以会初始化`broadcast`,`service`和`contentProvider`相关的变量，接着初始化了电量统计服务，创建`intent`防火墙, 创建了系统的第一个用户，初始化了基本的配置信息，初始化cpu统计相关线程, 还创建了`Activity`调度的核心类`ActivityStackSupervisor`。

\===>再回到上面的`mSystemServiceManager.startService`方法：

```java
    public SystemService startService(String className) {
        final Class<SystemService> serviceClass;
        serviceClass = (Class<SystemService>)Class.forName(className);
        return startService(serviceClass);
    }
    -->
    /**
     * 创建并启动一个system service，class必须是com.android.server.SystemService的子类
     */
    @SuppressWarnings("unchecked")
    public <T extends SystemService> T startService(Class<T> serviceClass) {
		....
        //1. 创建service对象
        final T service;
        try {
            Constructor<T> constructor = serviceClass.getConstructor(Context.class);
            service = constructor.newInstance(mContext);
        } catch (InstantiationException ex) {
           ....
        }

        //2. 把创建的service对象注册到mServices中
        mServices.add(service);

        //3. 启动.service对象
        try {
            service.onStart();
        }
        return service;
    }

```

小结下：

1.  创建`AMS`对象，也就是前面描述的`AMS`的构造过程
2.  把创建的`AMS`对象注册到`mServices`中，方面别的进程使用`Binder`查找到这个服务，`private final ArrayList<SystemService> mServices = new ArrayList<SystemService>();`，`mServices`是一个列表，这个列表中包含了它启动的所有`SystemService`类的服务

### 2.２.AMS 启动流程

前面的`Lifecycle`的`onStart`方法最终是调用`AMS`的`start`方法：

```java
public void onStart() {
     mService.start();
}

```

\===>首先调用`Process`类的`removeAllProcessGroups`方法移除所有的进程组，然后启动`ProcessCpuThread`线程（前面`AMS`构造的)，接着发布`mBatteryStatsService`

最后把`AMS`服务自己保存到`LocalServices`供内部调用，`LocalServices`类似于`ServiceManager`，但仅供同进程使用

```java
    private void start() {
    	// 移除所有的进程组，清空所有记录
        Process.removeAllProcessGroups();
        // 启动cpu使用监控线程
        mProcessCpuThread.start();
		// 发布mBatteryStatsService
        mBatteryStatsService.publish(mContext);
        mAppOpsService.publish(mContext);
        Slog.d("AppOps", "AppOpsService published");
        LocalServices.addService(ActivityManagerInternal.class, new LocalService());
    }

```

再回顾下前面的流程：

```java
 private void startBootstrapServices() {
         .....
        // Activity manager runs the show.
        mActivityManagerService = mSystemServiceManager.startService(
                ActivityManagerService.Lifecycle.class).getService();
        mActivityManagerService.setSystemServiceManager(mSystemServiceManager);
        .....
        // Set up the Application instance for the system process and get started.
        mActivityManagerService.setSystemProcess();
    }

```

`startBootstrapServices`中的`mSystemServiceManager.startService` 内部触发了–>`AMS`构造初始化–>`AMS`启动

\===>`SystemServiceManager`是一个创建，启动，和管理其他有关`SystemService`类系统服务的管理类, `AMS`把它保存到自己的`mSystemServiceManager` 成员中，代码如下：

```java
    public void setSystemServiceManager(SystemServiceManager mgr) {
        mSystemServiceManager = mgr;
    }

```

### 2.3.AMS 的 setSystemProcess方法

\===>继续看`startBootstrapServices`中的下一个关于`AMS`流程 :`mActivityManagerService.setSystemProcess();`

```java
    public void setSystemProcess() {
        try {
        	// 将AMS自身注册到ServiceManager中
            ServiceManager.addService(Context.ACTIVITY_SERVICE, this, true);
            // 注册其他服务到ServiceMananger中
            ServiceManager.addService(ProcessStats.SERVICE_NAME, mProcessStats);
            ServiceManager.addService("meminfo", new MemBinder(this));
            ServiceManager.addService("gfxinfo", new GraphicsBinder(this));
            ServiceManager.addService("dbinfo", new DbBinder(this));
            if (MONITOR_CPU_USAGE) {
                ServiceManager.addService("cpuinfo", new CpuBinder(this));
            }
            // 注册权限服务到ServiceMananger中
            ServiceManager.addService("permission", new PermissionController(this));
            ServiceManager.addService("processinfo", new ProcessInfoService(this));

			 // 从PMS中查询包名为android的application,即framework-res的Application信息
            ApplicationInfo info = mContext.getPackageManager().getApplicationInfo(
                    "android", STOCK_PM_FLAGS);
             // 将application信息配置到开始创建的activityThread中
            mSystemThread.installSystemApplicationInfo(info, getClass().getClassLoader());

            synchronized (this) {
            	// 创建了一个ProcessRecord对象，该对象中保存着系统ongoing服务的进程信息
                ProcessRecord app = newProcessRecordLocked(info, info.processName, false, 0);
                app.persistent = true;
                app.pid = MY_PID;
                app.maxAdj = ProcessList.SYSTEM_ADJ;
                app.makeActive(mSystemThread.getApplicationThread(), mProcessStats);
                synchronized (mPidsSelfLocked) {
                	// 将系统进程的processRecord对象也添加到mPidsSelfLocked集合中，和普通应用的进程一样，接收AMS的管理调度
                    mPidsSelfLocked.put(app.pid, app);
                }
                 // 更新进程管理的调度信息
                updateLruProcessLocked(app, false, null);
                updateOomAdjLocked();
            }
        } catch (PackageManager.NameNotFoundException e) {
            throw new RuntimeException(
                    "Unable to find android system package", e);
        }
    }

```

\===>`ServiceManager.addService(Context.ACTIVITY_SERVICE, this, true);`意思就是通过`Binder`向系统服务管理`ServiceManager（SM）`注册我们的服务，这样android中的其他进程就可以通过`context`的`getSystemService`找到我们的服务了，对应常见的获取代码如下：

```java
ActivityManager manager=(ActivityManager)getSystemService(ACTIVITY_SERVICE);
```

然后又注册了权限服务等其他的系统服务。通过先前创建的`Context`，得到`PMS`服务，检索framework-res的`Application`信息，然后将它配置到系统的`ActivityThread`中。

为了能让`AMS`同样可以管理调度`system`系统进程(`AMS`所在进程)，也创建了一个关于系统进程的`ProcessRecord`对象，`ProcessRecord`对象保存一个进程的相关信息。然后将它保存到`mPidsSelfLocked`集合中方便管理

`AMS`具体是如何将检索到的framework-res的`application`信息，配置到`ActivityThread`中的，需要继续分析`ActivityThread`的`installSystemApplicationInfo`方法

```java
 // 将application信息配置到开始创建的activityThread中
 mSystemThread.installSystemApplicationInfo(info, getClass().getClassLoader());
 ---->
 final ActivityThread mSystemThread;

```

\===>这个方法中调用`ConxtextImpl`的`installSystemApplicationInfo`方法，代码如下：

```java
    public void installSystemApplicationInfo(ApplicationInfo info, ClassLoader classLoader) {
        synchronized (this) {
            getSystemContext().installSystemApplicationInfo(info, classLoader);
            // give ourselves a default profiler
            mProfiler = new Profiler();
        }
    }
    --->getSystemContext方法的内部实现：
    public ContextImpl getSystemContext() {
        synchronized (this) {
            if (mSystemContext == null) {
                mSystemContext = ContextImpl.createSystemContext(this);
            }
            return mSystemContext;
        }
    }

```

\===>最终调用了`LoadedApk`的`installSystemApplication`方法，代码如下：

```java
   void installSystemApplicationInfo(ApplicationInfo info, ClassLoader classLoader) {
        mPackageInfo.installSystemApplicationInfo(info, classLoader);
    }
    ---->mPackageInfo:
    final LoadedApk mPackageInfo;
    ---->LoadedApk.java:
    void installSystemApplicationInfo(ApplicationInfo info, ClassLoader classLoader) {
        assert info.packageName.equals("android");
        mApplicationInfo = info;
        mClassLoader = classLoader;
    }

```

将`framework-res.apk`的`application`信息保存到了`mApplication`变量中。

### 2.4.AMS 的 installSystemProviders方法

`system`进程中很多`Service`都需要向`Settings`数据库查询配置信息。为此，Android提供了一个`SettingsProvider`来帮助开发者。该`Provider`在`SettingsProvider.apk`中，`installSystemProviders`就会加载该APK并把`SettingsProvider`放到`system`进程中来运行。

此时的`system`进程已经加载了`framework-res.apk`，现在又要加载另外一个APK文件，这就是多个APK运行在同一进程的典型案例。另外，通过`installSystemProviders`函数还能见识到`ContentProvider`的安装过程。

下面就来分析`installSystemProviders`函数：

```java
    public final void installSystemProviders() {
        List<ProviderInfo> providers;
        synchronized (this) {
        	// 找到名称为”System”的进程，就是上一步创建的processRecord对象
            ProcessRecord app = mProcessNames.get("system", Process.SYSTEM_UID);
            providers = generateApplicationProvidersLocked(app);
            if (providers != null) {
                for (int i=providers.size()-1; i>=0; i--) {
                    ProviderInfo pi = (ProviderInfo)providers.get(i);
                     // 再次确认进程为system的provider,把不是该进程provider移除
                    if ((pi.applicationInfo.flags&ApplicationInfo.FLAG_SYSTEM) == 0) {
                        Slog.w(TAG, "Not installing system proc provider " + pi.name
                                + ": not system .apk");
                        providers.remove(i);
                    }
                }
            }
        }
        if (providers != null) {
             // 把provider安装到系统的ActivityThread中
            mSystemThread.installSystemProviders(providers);
        }

        mCoreSettingsObserver = new CoreSettingsObserver(this);

        //mUsageStatsService.monitorPackages();
    }

```

上面的总体逻辑是：找到名称为`system`的进程对象，就是`system`进程，然后根据进程对象去查询所有有关的`ContentProvider`，调用系统进程的主线程`ActivityThread`安装所有相关的`ContentProvider`

内部可以抽离出两个关键方法：`generateApplicationProvidersLocked` 和 `installSystemProviders`，分别分析：  
`generateApplicationProvidersLocked`：

```java
    private final List<ProviderInfo> generateApplicationProvidersLocked(ProcessRecord app) {
        List<ProviderInfo> providers = null;
        try {
        	// 调用PMS根据进程ID和进程名称来查询Provider
            ParceledListSlice<ProviderInfo> slice = AppGlobals.getPackageManager().
                queryContentProviders(app.processName, app.uid,
                        STOCK_PM_FLAGS | PackageManager.GET_URI_PERMISSION_PATTERNS);
            providers = slice != null ? slice.getList() : null;
        } catch (RemoteException ex) {
        }
        if (DEBUG_MU) Slog.v(TAG_MU,
                "generateApplicationProvidersLocked, app.info.uid = " + app.uid);
        int userId = app.userId;
        if (providers != null) {
            int N = providers.size();
            app.pubProviders.ensureCapacity(N + app.pubProviders.size());
            for (int i=0; i<N; i++) {
                ProviderInfo cpi =
                    (ProviderInfo)providers.get(i);
                boolean singleton = isSingleton(cpi.processName, cpi.applicationInfo,
                        cpi.name, cpi.flags);
                if (singleton && UserHandle.getUserId(app.uid) != UserHandle.USER_OWNER) {
                    // This is a singleton provider, but a user besides the
                    // default user is asking to initialize a process it runs
                    // in...  well, no, it doesn't actually run in this process,
                    // it runs in the process of the default user.  Get rid of it.
                    providers.remove(i);
                    N--;
                    i--;
                    continue;
                }

                ComponentName comp = new ComponentName(cpi.packageName, cpi.name);
                 //从AMS管理的contentProvider列表中查询对应的provider     
                ContentProviderRecord cpr = mProviderMap.getProviderByClass(comp, userId);
                if (cpr == null) {
                	//如果AMS的Provider列表中没有对应的Provider实例，就根据查询的provider信息，创建一个对象保存到队列中
                    cpr = new ContentProviderRecord(this, cpi, app.info, comp, singleton);
                    mProviderMap.putProviderByClass(comp, cpr);
                }
                if (DEBUG_MU) Slog.v(TAG_MU,
                        "generateApplicationProvidersLocked, cpi.uid = " + cpr.uid);
                 // 同时将provider保存到processRecord对象的pubProviders列表中
                app.pubProviders.put(cpi.name, cpr);
                if (!cpi.multiprocess || !"android".equals(cpi.packageName)) {
                    // Don't add this if it is a platform component that is marked
                    // to run in multiple processes, because this is actually
                    // part of the framework so doesn't make sense to track as a
                    // separate apk in the process.
                    app.addPackage(cpi.applicationInfo.packageName, cpi.applicationInfo.versionCode,
                            mProcessStats);
                }
                ensurePackageDexOpt(cpi.applicationInfo.packageName);
            }
        }
        return providers;
    }

```

这个方法就是从`PMS`中查询和`system`进程相关的`Provider`，也就是`SettingsProvder`，然后将它保存到`AMS`的`contentProvider`列表中，同时也将它保存到系统进程对象`ProcessRecord`的变量`pubProviders`列表中，

保存到`AMS`的`provider`列表中是因为`AMS`需要管理所有的`ContentProvder`  
保存到进程对象的`pubProviders`列表中是因为，每个`ContentProvider`都需要对应到一个进程中去, 其实也是为了方便`AMS`管理，例如该进程一旦退出，`AMS`需要把其中的`ContentProvider`信息从系统中去除

至此，`Provider`信息已经保存到`AMS`及`pubProviders`中了。但这些都仅是一些信息，并不是`ContentProvider`，因此下面要创建一个`ContentProvider`实例（即`SettingsProvider`对象）。该工作由`ActivityThread`的`installSystemProviders`函数来完成，实现代码如下：

```java

    private void installContentProviders(
            Context context, List<ProviderInfo> providers) {
        final ArrayList<IActivityManager.ContentProviderHolder> results =
            new ArrayList<IActivityManager.ContentProviderHolder>();

        for (ProviderInfo cpi : providers) {
            if (DEBUG_PROVIDER) {
                StringBuilder buf = new StringBuilder(128);
                buf.append("Pub ");
                buf.append(cpi.authority);
                buf.append(": ");
                buf.append(cpi.name);
                Log.i(TAG, buf.toString());
            }
            // 通过installProvider方法把provider封装成一个ContentProviderHolder对象，有利于进程间传输
            IActivityManager.ContentProviderHolder cph = installProvider(context, null, cpi,
                    false /*noisy*/, true /*noReleaseNeeded*/, true /*stable*/);
            if (cph != null) {
                cph.noReleaseNeeded = true;
                results.add(cph);
            }
        }

        try {
        //将上面得到的contentProviderHolder对象发布到AMS服务，getApplicationThread代表本地进程的一个binder对象，binder对象可跨进程传输，它在AMS中对应一个ProcessRecord.
            ActivityManagerNative.getDefault().publishContentProviders(
                getApplicationThread(), results);
        } catch (RemoteException ex) {
        }
    }

```

将得到的`ProviderInfo`封装成了`contentProviderHolder`对象，其实就是`Binder`对象，这样就可以进程间传输了，然后跨进程调用`AMS`服务注册`Provider`。`AMS`负责管理`ContentProvider`，只有将`ContentProvider`注册到`AMS`服务其他进程才能访问

接着看`AMS`如何通过`publishContentProviders`注册`Provider`：

```java
    public final void publishContentProviders(IApplicationThread caller,
            List<ContentProviderHolder> providers) {
        if (providers == null) {
            return;
        }

        enforceNotIsolatedCaller("publishContentProviders");
        synchronized (this) {
        	// 根据调用者的进程得到相应的processRecord对象，就是系统进程的ProcessRecord
            final ProcessRecord r = getRecordForAppLocked(caller);
            if (DEBUG_MU) Slog.v(TAG_MU, "ProcessRecord uid = " + r.uid);
            if (r == null) {
                throw new SecurityException(
                        "Unable to find app for caller " + caller
                      + " (pid=" + Binder.getCallingPid()
                      + ") when publishing content providers");
            }

            final long origId = Binder.clearCallingIdentity();

            final int N = providers.size();
            for (int i = 0; i < N; i++) {
            	// ActivityThread客户端传过来的provider src
                ContentProviderHolder src = providers.get(i);
                if (src == null || src.info == null || src.provider == null) {
                    continue;
                }
                ContentProviderRecord dst = r.pubProviders.get(src.info.name);
                if (DEBUG_MU) Slog.v(TAG_MU, "ContentProviderRecord uid = " + dst.uid);
                if (dst != null) {
                    ComponentName comp = new ComponentName(dst.info.packageName, dst.info.name);
                    // 按类将它保存在mProviderMap中
                    mProviderMap.putProviderByClass(comp, dst);
                    String names[] = dst.info.authority.split(";");
                    for (int j = 0; j < names.length; j++) {
                    	// 按authority保存在mProviderMap中
                        mProviderMap.putProviderByName(names[j], dst);
                    }

                    int launchingCount = mLaunchingProviders.size();
                    int j;
                    boolean wasInLaunchingProviders = false;
                    for (j = 0; j < launchingCount; j++) {
                        if (mLaunchingProviders.get(j) == dst) {
                            mLaunchingProviders.remove(j);
                            wasInLaunchingProviders = true;
                            j--;
                            launchingCount--;
                        }
                    }
                    if (wasInLaunchingProviders) {
                        mHandler.removeMessages(CONTENT_PROVIDER_PUBLISH_TIMEOUT_MSG, r);
                    }
                    synchronized (dst) {
                        dst.provider = src.provider;
                        dst.proc = r;
                        dst.notifyAll();
                    }
                    updateOomAdjLocked(r);
                    maybeUpdateProviderUsageStatsLocked(r, src.info.packageName,
                            src.info.authority);
                }
            }

            Binder.restoreCallingIdentity(origId);
        }
    }

```

`AMS`的注册服务就是根据参数传过来的`provider`信息，找到原先进程中`pubProviders`列表中保存的`ContentProviderRecord`，然后将它分别以`ComponentName`为`key`保存在`mProviderMap`中，和以`authority`为`key`保存在`mProviderMap`中。

即`AMS`提供了多种方案来查找一个`ContentProvider`，一种是通过`authority`来查找，一种是指明`CompomentName`来查找。

可以看出虽然`AMS`和`ActivityThread`同在`system`进程，但`installSystemProvider`方法的主要工作仍是按照普通进程IPC方式，将`SettingsProvider`注册到系统进程中。

### 2.5.AMS 的 systemReady方法

`SystemServer.java`在调用完`startBootstrapServices`后还会调用`startOtherServices`，内部调用`AMS`的`systemReady`方法。  
这个函数很长，分块分析：

```java
// 初始化Doze模式的controller
 mLocalDeviceIdleController
   = LocalServices.getService(DeviceIdleController.LocalService.class);
```

\===>装载系统的用户ID的profile，用于后面的权限检查，这个是比较重要的信息，尤其是在android多用户的情况下，根据用户的ID配置赋予不同的权限。

```java
  // 装载系统的用户ID的profile，用于后面的权限检查
   updateCurrentProfileIdsLocked();
```

\===>重置`RecentTasks`， 这部分的主要工作就是重建带有`persistent`标记的task

```java
			// 重置RecentTasks
            mRecentTasks.clear();
            mRecentTasks.addAll(mTaskPersister.restoreTasksLocked());
            mRecentTasks.cleanupLocked(UserHandle.USER_ALL);
            mTaskPersister.startPersisting();
```

\===>广播升级更新的`intent`,android系统升级的时候，系统的模块或者app也是需要开机的时候完成一些更新，例如重新整理数据等操作。  
这里我们调用了`deliverPreBootCompleted`方法发送了一个`ACTION_PRE_BOOT_COMPLETED`的消息通知这些模块。需要注意的是，这个消息只会发送给系统级别的app，并不会发送给第三方的app。

```java
            if (!mDidUpdate) {
                if (mWaitingUpdate) {
                    return;
                }
                final ArrayList<ComponentName> doneReceivers = new ArrayList<ComponentName>();
                mWaitingUpdate = deliverPreBootCompleted(new Runnable() {
                    public void run() {
                        synchronized (ActivityManagerService.this) {
                            mDidUpdate = true;
                        }
                        showBootMessage(mContext.getText(
                                R.string.android_upgrading_complete),
                                false);
                        writeLastDonePreBootReceivers(doneReceivers);
                        systemReady(goingCallback);
                    }
                }, doneReceivers, UserHandle.USER_OWNER);

                if (mWaitingUpdate) {
                    return;
                }
                mDidUpdate = true;
            }
-->deliverPreBootCompleted方法的内部实现：
 private boolean deliverPreBootCompleted(final Runnable onFinishCallback,
            ArrayList<ComponentName> doneReceivers, int userId) {
        Intent intent = new Intent(Intent.ACTION_PRE_BOOT_COMPLETED);

```

\===> 清理多余进程，除了`persistent`进程，目的就是为了准备一个干净的环境。前面提到了，android系统会发送一个`intent`消息给系统模块，通知进行相应的升级，这些模块就是有可能会在`AMS`运行之前运行的，所以就要kill掉。但是有一种进程是不会被杀死的，就是`isAllowedWhileBooting`返回true的进程，也就是`persistent`进程，因为后面我们还要启动`persistent`进程。

```java
		// 将那些在AMS之前启动的进程杀死，有的进程不能再AMS之前启动
        ArrayList<ProcessRecord> procsToKill = null;
        synchronized(mPidsSelfLocked) {
            for (int i=mPidsSelfLocked.size()-1; i>=0; i--) {
                ProcessRecord proc = mPidsSelfLocked.valueAt(i);
                if (!isAllowedWhileBooting(proc.info)){
                    if (procsToKill == null) {
                        procsToKill = new ArrayList<ProcessRecord>();
                    }
                    procsToKill.add(proc);
                }
            }
        }

        synchronized(this) {
            if (procsToKill != null) {
                for (int i=procsToKill.size()-1; i>=0; i--) {
                    ProcessRecord proc = procsToKill.get(i);
                    Slog.i(TAG, "Removing system update proc: " + proc);
                    removeProcessLocked(proc, true, false, "system update done");
                }
            }

            // Now that we have cleaned up any update processes, we
            // are ready to start launching real processes and know that
            // we won't trample on them any more.
            mProcessesReady = true;
        }
-->isAllowedWhileBooting方法的实现：
 boolean isAllowedWhileBooting(ApplicationInfo ai) { // 是否为persistent进程
        return (ai.flags&ApplicationInfo.FLAG_PERSISTENT) != 0;
    }

```

\===>

```java
        Slog.i(TAG, "System now ready");
        EventLog.writeEvent(EventLogTags.BOOT_PROGRESS_AMS_READY,
            SystemClock.uptimeMillis());
```

\===> 如果是工厂测试模式，则启动工厂测试模块,。我们的手机在生产出厂的时候，都要进行工厂测试的，在工厂模式下运行的程序需要响应`intent ACTION_FACTORY_TEST`消息。这里主要就是查找响应该消息的程序，并且放在`mTopComponent`中，如果没有找到，就发送工场测试失败的消息。

```java
        synchronized(this) {
            // Make sure we have no pre-ready processes sitting around.

            if (mFactoryTest == FactoryTest.FACTORY_TEST_LOW_LEVEL) {
                ResolveInfo ri = mContext.getPackageManager()
                        .resolveActivity(new Intent(Intent.ACTION_FACTORY_TEST),
                                STOCK_PM_FLAGS);
                CharSequence errorMsg = null;
                if (ri != null) {
                    ActivityInfo ai = ri.activityInfo;
                    ApplicationInfo app = ai.applicationInfo;
                    if ((app.flags&ApplicationInfo.FLAG_SYSTEM) != 0) {
                        mTopAction = Intent.ACTION_FACTORY_TEST;
                        mTopData = null;
                        mTopComponent = new ComponentName(app.packageName,
                                ai.name);
                    } else {
                        errorMsg = mContext.getResources().getText(
                                com.android.internal.R.string.factorytest_not_system);
                    }
                } else {
                    errorMsg = mContext.getResources().getText(
                            com.android.internal.R.string.factorytest_no_action);
                }
                if (errorMsg != null) {
                    mTopAction = null;
                    mTopData = null;
                    mTopComponent = null;
                    Message msg = Message.obtain();
                    msg.what = SHOW_FACTORY_ERROR_MSG;
                    msg.getData().putCharSequence("msg", errorMsg);
                    mUiHandler.sendMessage(msg);
                }
            }
        }

```

\===> 读取设置信息, `retrieveSettings`这里就读取一下4个设置：

1.  `DEBUG_APP`:需要调试的app名称
2.  `WAIT_FOR_DEBUGGER`:如果值为1，表示启动调试的app时需要先等待调试器，否则正常启动
3.  `ALWAYS_FINISH_ACTIVITIES`:值为1的时候，表示activity已经不再需要，系统需要立即清理他们，这个可以在setting的开发者选项中设置
4.  `DEVELOPMENT_FORCE_RTL`:值为1表示要将系统设置为从右到左的模式

`loadResourcesOnSystemReady`从资源文件中读取了几个缺省的系统配置信息

```java
  retrieveSettings();
  loadResourcesOnSystemReady();
  -------------------->
   private void retrieveSettings() {
        final ContentResolver resolver = mContext.getContentResolver();
        String debugApp = Settings.Global.getString(
            resolver, Settings.Global.DEBUG_APP);
        boolean waitForDebugger = Settings.Global.getInt(
            resolver, Settings.Global.WAIT_FOR_DEBUGGER, 0) != 0;
        boolean alwaysFinishActivities = Settings.Global.getInt(
            resolver, Settings.Global.ALWAYS_FINISH_ACTIVITIES, 0) != 0;
        boolean forceRtl = Settings.Global.getInt(
                resolver, Settings.Global.DEVELOPMENT_FORCE_RTL, 0) != 0;
        // Transfer any global setting for forcing RTL layout, into a System Property
        SystemProperties.set(Settings.Global.DEVELOPMENT_FORCE_RTL, forceRtl ? "1":"0");

        Configuration configuration = new Configuration();
        Settings.System.getConfiguration(resolver, configuration);
        if (forceRtl) {
            // This will take care of setting the correct layout direction flags
            configuration.setLayoutDirection(configuration.locale);
        }

        synchronized (this) {
            mDebugApp = mOrigDebugApp = debugApp;
            mWaitForDebugger = mOrigWaitForDebugger = waitForDebugger;
            mAlwaysFinishActivities = alwaysFinishActivities;
            // This happens before any activities are started, so we can
            // change mConfiguration in-place.
            updateConfigurationLocked(configuration, null, false, true);
            if (DEBUG_CONFIGURATION) Slog.v(TAG_CONFIGURATION,
                    "Initial config: " + mConfiguration);
        }
    }

```

\===> 打开`Uri`读取权限

```java
        synchronized (this) {
            readGrantedUriPermissionsLocked();
        }
```

\==>执行参数的callback，完成`SystemServer`的处理逻辑

```java
if (goingCallback != null) goingCallback.run();
```

\==>通知`BatteryStatsService`当前用户启动消息,`BatteryStatsService`会开始电池数据的统计分析

```java
  mBatteryStatsService.noteEvent(BatteryStats.HistoryItem.EVENT_USER_RUNNING_START,
                Integer.toString(mCurrentUserId), mCurrentUserId);
        mBatteryStatsService.noteEvent(BatteryStats.HistoryItem.EVENT_USER_FOREGROUND_START,
                Integer.toString(mCurrentUserId), mCurrentUserId);
```

\==>开始启动当前用户，为用户和系统交互做home桌面启动前的准备

```java
mSystemServiceManager.startUser(mCurrentUserId);
```

\==>启动`persistent`应用，并且启动`home launcher`

```
        synchronized (this) {
            // 如果不是工厂测试模式
            if (mFactoryTest != FactoryTest.FACTORY_TEST_LOW_LEVEL) {
                try {
                	 // 查找带有persistent标记的app
                    List apps = AppGlobals.getPackageManager().
                        getPersistentApplications(STOCK_PM_FLAGS);
                    if (apps != null) {
                        int N = apps.size();
                        int i;
                        for (i=0; i<N; i++) {
                            ApplicationInfo info
                                = (ApplicationInfo)apps.get(i);
                            if (info != null &&
                                    !info.packageName.equals("android")) {// 排除掉包名为“android”的app，因为前面已经加入过了。
                                addAppLocked(info, false, null /* ABI override */);
                            }
                        }
                    }
                } catch (RemoteException ex) {
                    // pm is in same process, this will never happen.
                }
            }

            // Start up initial activity.
            mBooting = true;
            //  启动home桌面app
            startHomeActivityLocked(mCurrentUserId, "systemReady");

            try {
                if (AppGlobals.getPackageManager().hasSystemUidErrors()) {
                    Slog.e(TAG, "UIDs on the system are inconsistent, you need to wipe your"
                            + " data partition or your device will be unstable.");
                    mUiHandler.obtainMessage(SHOW_UID_ERROR_MSG).sendToTarget();
                }
            } catch (RemoteException e) {
            }

            if (!Build.isBuildConsistent()) {
                Slog.e(TAG, "Build fingerprint is not consistent, warning user");
                mUiHandler.obtainMessage(SHOW_FINGERPRINT_ERROR_MSG).sendToTarget();
            }

            long ident = Binder.clearCallingIdentity();
            try {
               // 发送用户启动完成的消息
                Intent intent = new Intent(Intent.ACTION_USER_STARTED);
                intent.addFlags(Intent.FLAG_RECEIVER_REGISTERED_ONLY
                        | Intent.FLAG_RECEIVER_FOREGROUND);
                intent.putExtra(Intent.EXTRA_USER_HANDLE, mCurrentUserId);
                broadcastIntentLocked(null, null, intent,
                        null, null, 0, null, null, null, AppOpsManager.OP_NONE,
                        null, false, false, MY_PID, Process.SYSTEM_UID, mCurrentUserId);
                intent = new Intent(Intent.ACTION_USER_STARTING);
                intent.addFlags(Intent.FLAG_RECEIVER_REGISTERED_ONLY);
                intent.putExtra(Intent.EXTRA_USER_HANDLE, mCurrentUserId);
                broadcastIntentLocked(null, null, intent,
                        null, new IIntentReceiver.Stub() {
                            @Override
                            public void performReceive(Intent intent, int resultCode, String data,
                                    Bundle extras, boolean ordered, boolean sticky, int sendingUser)
                                    throws RemoteException {
                            }
                        }, 0, null, null,
                        new String[] {INTERACT_ACROSS_USERS}, AppOpsManager.OP_NONE,
                        null, true, false, MY_PID, Process.SYSTEM_UID, UserHandle.USER_ALL);
            } catch (Throwable t) {
                Slog.wtf(TAG, "Failed sending first user broadcasts", t);
            } finally {
                Binder.restoreCallingIdentity(ident);
            }
             // 开始恢复显示activity栈顶的界面，也就是home的主界面
            mStackSupervisor.resumeTopActivitiesLocked();
            sendUserSwitchBroadcastsLocked(-1, mCurrentUserId);
        }

```

3.ASM服务启动小结
--------------------------------------------------------------------

可以看出,`AMS`服务启动主要分为几个步骤

1. 创建了`system`进程的运行环境，包括一个`ActivityThread`主线程，一个和系统进程相关的`Context`对象。

2. 调用`AMS`的构造方法和`start`方法，对`AMS`必要的内容进行初始化。

3. 将`AMS`注册到`ServiceManager`中，同时对`system`进程也创建了一个`ProcessRecord`对象，并设置Context的`appliation`为framework-res的`application`对象, 由于`AMS`是Java世界的进程管理及调度中心，要做到对Java进程一视同仁，尽管`system`贵为系统进程，此时也不得不将其并入`AMS`的管理范围内。

4. 为`system`进程加载`SettingsProvider`。

5. 调用`systemReady`方法做系统启动完毕前最后一些扫尾工作。该函数调用完毕后，Home Activity将呈现在用户面前。

   ![](https://raw.githubusercontent.com/shug666/image/main/images/d9e4daeb88169bbdb816ca5e31b4eed0.png)

本文转自 [https://blog.csdn.net/hgy413/article/details/97245131](https://blog.csdn.net/hgy413/article/details/97245131)，如有侵权，请联系删除。