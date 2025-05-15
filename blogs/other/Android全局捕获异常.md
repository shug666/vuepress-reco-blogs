---
title: 全局捕获异常
date: 2024-09-18
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 1.为什么抛出异常时app会退出

不细致分析了，网上随便找一下就是一堆博客，简单来说就是没有被catch的崩溃抛出时，会调用 Thread#dispatchUncaughtException(throwable) 来进行处理，而在进程初始化时，RuntimeInit#commonInit 里会注入默认杀进程的 KillApplicationHandler，如果我们没有实现自定义的 UncaughtExceptionHandler 时，dispatchUncaughtException 被调用就会走到 KillApplicationHandler 里，把当前的进程杀掉，即产生了一次用户感知的崩溃行为。

## 2.有没有办法打造一个永不崩溃的app

这个问题问出来的前提是指发生的崩溃是来自于 java 层面的未捕获的异常，c 层就是另一回事了。我们来尝试回答一下这个问题：

答：可以，至少可以做到把所有的异常都吃掉。

**问：那么怎么做呢？**

答：当某个线程发生异常时，只要不让 KillApplicationHandler 处理这个异常就行了，即只要覆盖掉默认的 UncaughtExceptionHandler 就行了噢。

**问：那当这样做的时候，比如主线程抛出一个异常被吃掉了，app还能正常运行吗？**

答：不能了，因为不做任何处理的话，当前线程的 Looper.loop()就被终止了。如果是主线程的话，此时你将会获得一个 anr。

**问：怎么才能在吃掉异常的同时，让主线程继续运行呢？**

答：当由于异常抛出，导致线程的 Looper.loop() 终止之后，接管 Looper.loop()。代码大概长下面这样：

```java
public class AppCrashHandler implements UncaughtExceptionHandler {
    @Override
    public void uncaughtException(@NonNull Thread thread, @NonNull Throwable ex) {
        while (true) {
            try {
                if (Looper.myLooper() == null) {
                    Looper.prepare();
                }
                Looper.loop();
            } catch (Exception e) {
            }
        }
    }
}
```

上面这段代码，就是我标题中被描述为 Looper 兜底框架的实现机制。但是对于一个正常的app，线上是不可能这样无脑的catch，然后 Looper.loop的，这是因为：

1. 不是所有的异常都需要被catch住，如：OOM、launcher Activity onCreate之类的。
2. 稳定性不是靠屏蔽问题，而是靠解决问题，当异常无法解决或者解决成本太高，且异常被屏蔽对用户、业务来说并没有啥实质性的影响时，可以被屏蔽，当异常抛出时已经对业务产生了破坏，但是通过保护住然后重试可以让业务恢复运作时，也可以被屏蔽，只是多了个环节，即修复异常。

**问：异常被吃掉之后会有什么影响？**

抛异常的那句代码之后的代码将不会被调用，即当前的调用栈将会中断。假如代码像下面这样，通过Looper兜底的方式去让app不崩溃，会导致 throw 异常之后的代码无法被执行到。可以简单的理解为，是对整个调用栈加了 try-catch，不过这个try-catch 是加在了 Looper.loop()上。

```java
private void testCrash() {
    int x = 0;
    if(x == 0){
        throw new IllegalArgumentException("xx");
    }
    int y = 1;
    Log.e("TEST", "y is : " + y);
}
```

**问：到底什么异常需要被吃掉呢？**

上一个回答中我们大致将需要被吃掉的异常分了两类。

**1. 异常我们无法解决或者解决成本太高**

举个例子，假如公司有使用 react native 之类的三方大框架，当业务抛出来一个如下的异常时，我们就可以认为这无法解决

```java
com.facebook.react.bridge.JSApplicationIllegalArgumentException: connectAnimatedNodes: Animated node with tag (child) [30843] does not exist
    at com.facebook.react.animated.NativeAnimatedNodesManager.connectAnimatedNodes(NativeAnimatedNodesManager.java:7)
    at com.facebook.react.animated.NativeAnimatedModule$16.execute
    at com.facebook.react.animated.NativeAnimatedModule$ConcurrentOperationQueue.executeBatch(NativeAnimatedModule.java:7)
    at com.facebook.react.animated.NativeAnimatedModule$3.execute
    at com.facebook.react.uimanager.UIViewOperationQueue$UIBlockOperation.execute
    at com.facebook.react.uimanager.UIViewOperationQueue$1.run(UIViewOperationQueue.java:19)
    at com.facebook.react.uimanager.UIViewOperationQueue.flushPendingBatches(UIViewOperationQueue.java:10)
    at com.facebook.react.uimanager.UIViewOperationQueue.access$2600
    at com.facebook.react.uimanager.UIViewOperationQueue$DispatchUIFrameCallback.doFrameGuarded(UIViewOperationQueue.java:6)
    at com.facebook.react.uimanager.GuardedFrameCallback.doFrame(GuardedFrameCallback.java:1)
    at com.facebook.react.modules.core.ReactChoreographer$ReactChoreographerDispatcher.doFrame(ReactChoreographer.java:7)
    at com.facebook.react.modules.core.ChoreographerCompat$FrameCallback$1.doFrame
    at android.view.Choreographer$CallbackRecord.run(Choreographer.java:1118)
    at android.view.Choreographer.doCallbacks(Choreographer.java:926)
    at android.view.Choreographer.doFrame(Choreographer.java:854)
    at android.view.Choreographer$FrameDisplayEventReceiver.run(Choreographer.java:1105)
    at android.os.Handler.handleCallback(Handler.java:938)
    at android.os.Handler.dispatchMessage(Handler.java:99)
    at android.os.Looper.loopOnce(Looper.java:238)
    at android.os.Looper.loop(Looper.java:379)
    at android.app.ActivityThread.main(ActivityThread.java:9271)
    at java.lang.reflect.Method.invoke(Method.java)
    at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:567)
    at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1018)
```

**2. 异常被屏蔽对用户、业务来说并没有实质性影响**

\- 比如老生常谈的 Android 7.x toast的 BadTokenException 之类的系统崩溃，一呢发生概率非常低，二呢在Android 8上的修复方式也只是 try-catch 住。

\- 一些不影响业务、用户使用的三方库崩溃，比如瞎说一个，当使用 OkHttp 在请求接口时，内部切了个线程执行了个更新缓存的任务，结果里面抛出了一个 NPE 。外面没法 try-catch ，而且这个异常抛出时，顶多下次请求不走缓存，实际上没啥太大影响。

**3. 异常很严重，但是吃掉之后通过修复运行环境能够让用户所使用的业务恢复正常运行**

比如我们想要保存一张图片到磁盘上，但是磁盘满了， 抛出了一个no space left，这时候我们就可以将异常吃掉，同时清空app的磁盘缓存，并且告知用户重试，就可以成功的让用户保存图片成功。

## 3.Android 全局捕获异常

```java
/**
* 全局异常处理
*
* @author hy
* @date 2020/4/2
*/
public class CrashHandler implements Thread.UncaughtExceptionHandler {
    private static CrashHandler INSTANCE;
    private Context mContext;
    private Thread.UncaughtExceptionHandler mDefaultUncaughtExceptionHandler;
    // 用来存储设备信息和异常信息
    private Map<String, String> mErrorInfoMap = new LinkedHashMap<>();
    // 用于格式化日期,作为日志文件名的一部分
    private SimpleDateFormat mSimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");
    private String mDivider = "==============divider==============";
    private CrashHandler() {
    }
    
    public static CrashHandler getInstance(Context context) {
        if (INSTANCE == null) {
            INSTANCE = new CrashHandler();
            INSTANCE.mContext = context;
            INSTANCE.mDefaultUncaughtExceptionHandler = Thread.getDefaultUncaughtExceptionHandler();
            Thread.setDefaultUncaughtExceptionHandler(INSTANCE);
        }
        return INSTANCE;
    }
    
    @Override
    public void uncaughtException(Thread thread, Throwable ex) {
        if (!handleException(ex) && mDefaultUncaughtExceptionHandler != null) {
            mDefaultUncaughtExceptionHandler.uncaughtException(thread, ex);
        } else {
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                // DLog.e("error : ", e);
            }
            // 退出程序,注释下面的重启启动程序代码
            // android.os.Process.killProcess(android.os.Process.myPid());
            // System.exit(1);
            ex.printStackTrace();
            // 重新启动程序，注释上面的退出程序
            restartApp();
        }
    }
    // 异常崩溃 重新启动
    private void restartApp() {
        Intent intent = new Intent();
        intent.setClass(mContext, SplashActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mContext.startActivity(intent);
    }
    public boolean handleException(Throwable ex) {
        if (null == ex) {
            return false;
        }
        // 使用 Toast 来显示异常信息
        new Thread() {
            @Override
            public void run() {
                Looper.prepare();
                // ToastUtils.show(mContext, "出现未知错误");
                Looper.loop();
            }
        }.start();
        // 记录设备参数信息
        // collectDeviceInfo(mContext);
        // 保存日志文件
        // saveCrashInfo2File(ex);
        return true;
    }
    
    /**
    * 收集设备参数信息
    *
    * @param ctx
    */
    public void collectDeviceInfo(Context ctx) {
        try {
            PackageManager pm = ctx.getPackageManager();
            PackageInfo pi = pm.getPackageInfo(ctx.getPackageName(), PackageManager.GET_ACTIVITIES);
            if (pi != null) {
                String versionName = pi.versionName == null ? "null" : pi.versionName;
                String versionCode = pi.versionCode + "";
                mErrorInfoMap.put("versionName", versionName);
                mErrorInfoMap.put("versionCode", versionCode);
            }
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            // DLog.e(e);
        }
        mErrorInfoMap.put("=", mDivider);
        Field[] fields = Build.class.getDeclaredFields();
        for (Field field : fields) {
            try {
                field.setAccessible(true);
                mErrorInfoMap.put(field.getName(), field.get(null).toString());
                // DLog.v(field.getName() + " : " + field.get(null));
            } catch (Exception e) {
                // DLog.e("an error occured when collect crash info ", e);
            }
        }
    }
    
    /**
    * 保存错误信息到文件中
    *
    * @param ex
    * @return 返回文件名称, 便于将文件传送到服务器
    */
    private String saveCrashInfo2File(Throwable ex) {
        StringBuffer sb = new StringBuffer();
        for (Map.Entry<String, String> entry : mErrorInfoMap.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            sb.append(key + "=" + value + "\n");
        }
        Writer writer = new StringWriter();
        PrintWriter printWriter = new PrintWriter(writer);
        ex.printStackTrace(printWriter);
        Throwable cause = ex.getCause();
        while (cause != null) {
            cause.printStackTrace(printWriter);
            cause = cause.getCause();
        }
        printWriter.close();
        String result = writer.toString();
        sb.append(mDivider).append("\n");
        sb.append(result);
        try {
            long timestamp = System.currentTimeMillis();
            String time = mSimpleDateFormat.format(new Date());
            String fileName = "crash-" + time + "-" + timestamp + ".log";
            String logDir = "log";
            File path = new File(mContext.getExternalCacheDir() + File.separator + logDir + File.separator + fileName);
            if (!path.getParentFile().exists()) {
                path.getParentFile().mkdirs();
            }
            FileOutputStream fos = new FileOutputStream(path);
            fos.write(sb.toString().getBytes());
            fos.close();
            return fileName;
        } catch (Exception e) {
            // DLog.e("an error occured while writing file... ", e);
        }
        return null;
    }
}
```

在Application中使用

```java
//初始化全局异常处理，崩溃自启
CrashHandler.getInstance(this);
```

  

本文转自 [https://mp.weixin.qq.com/s/8xF9hTaelJ3lZmWGOZn9AA](https://mp.weixin.qq.com/s/8xF9hTaelJ3lZmWGOZn9AA)，如有侵权，请联系删除。