---
title: Log.isLoggable 正确的使用姿势
date: 2023-11-07
tags:
 - android
categories: 
 - android
sticky: 
   true
---

我们在做Android APP开发时，多多少少需要打印Log，伴随着Log的打印就有一个打印开关是否允许打印Log，本文要讲的就是这个打印开关Log.isLoggable的使用和源码解析。

### **DEBUG方法比较**

当我们在做APP开发时，需要设置调试开关打印Log，下面我列举出3种方法：

*   方法一：直接赋值

```java
public static final boolean DEBUG = true;//false
```

*   方法二：设置BuildConfig.DEBUG的值

```java
public static final boolean DEBUG = BuildConfig.DEBUG；
```

*   方法三：设置Log.isLoggable的值

```java
public static final boolean DEBUG = Log.isLoggable(TAG, Log.DEBUG)；
```

当然这里可能还有很多别的设置方法，由于个人局限就没有写了。下面我们来看看上面3种方法各自的特点：

*   方法一比较直观明了，可以清楚的知道是否允许打印Log。
    
*   方法二和编译模式绑定，如果是release版的就不会打印Log，如果是debug版的话就会打印Log。
    
*   方法三通过设置property属性来打印Log
    

从他们的特点来看我们知道，第一种和第二种方法我们至少需要编译两个版本的软件用于发布和调试。  

第三种方法我们只需要编译一个版本既可以。在我们需要查看Log的时候，通过设置property即可查看Log。下面来详细介绍下Log.isLoggable的使用。

### **Log.isLoggable的使用姿势**

*   步骤一：

MainActivity.java

```java
public static final String TAG = "Main";
public static final boolean DEBUG = Log.isLoggable(TAG, Log.DEBUG);

public void onCreate(){
    if (DEBUG){
        Log.d(TAG, "onCreate");
    }
}
```

*   步骤二：

```shell
adb shell setprop log.tag.Main D
```

或者  
修改/data/local.prop文件(该方法不一定有效，根据不同的系统，可能不会去读取local.prop文件)

```sh
log.tag.Main=D
```

注：这里的TAG要加上log.tag.做前缀

*   步骤三：

退出APP，重新进入，即可打印Log（注：这里之所以要退出APP是因为我们定义的DEBUG是全局的，所以需要重新赋值）。  

当然你们也可以设置成局部变量，这样就不需要重新进入了,这样就可以免除第三步。

### **Log.isLoggable实战**

```java
public class MainActivity extends Activity implements OnClickListener {

    //各个Log级别定义的值，级别越高值越大
    /*
        public static final int VERBOSE = 2;
        public static final int DEBUG = 3;
        public static final int INFO = 4;
        public static final int WARN = 5;
        public static final int ERROR = 6;
        public static final int ASSERT = 7;
    */

    private static final String TAG = "Hello";
    //定义全局的Log开关
    private boolean VERBOSE = Log.isLoggable(TAG, Log.VERBOSE);
    private boolean DEBUG = Log.isLoggable(TAG, Log.DEBUG);
    private boolean INFO = Log.isLoggable(TAG, Log.INFO);
    private boolean WARN = Log.isLoggable(TAG, Log.WARN);
    private boolean ERROR = Log.isLoggable(TAG, Log.ERROR);
    private boolean ASSERT = Log.isLoggable(TAG, Log.ASSERT);
    private boolean SUPPRESS = Log.isLoggable(TAG, -1);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        findViewById(R.id.id_verbose).setOnClickListener(this);
    }

    /**
     * 更新loggable值
     */
    private void update() {
        //局部的Log开关
        VERBOSE = Log.isLoggable(TAG, Log.VERBOSE);
        DEBUG = Log.isLoggable(TAG, Log.DEBUG);
        INFO = Log.isLoggable(TAG, Log.INFO);
        WARN = Log.isLoggable(TAG, Log.WARN);
        ERROR = Log.isLoggable(TAG, Log.ERROR);
        ASSERT = Log.isLoggable(TAG, Log.ASSERT);
        SUPPRESS = Log.isLoggable(TAG, -1);
    }

    @Override
    public void onClick(View v) {
        update();

        switch (v.getId()) {
        case R.id.id_verbose:
            Log.d(TAG, "------------------start------------------------");
            if (VERBOSE) {
                Log.d(TAG, "verbose log");
            }
            if (DEBUG) {
                Log.d(TAG, "debug log");
            }
            if (INFO) {
                Log.d(TAG, "info log");
            }
            if (WARN) {
                Log.d(TAG, "warn log");
            }
            if (ERROR) {
                Log.d(TAG, "error log");
            }
            if (ASSERT) {
                Log.d(TAG, "assert log");
            }
            if (SUPPRESS) {
                Log.d(TAG, "suppress log");
            }
            Log.d(TAG, "------------------end------------------------");
            break;

        default:
            break;
        }
    }
}
```

上面的代码我们已经将所有的Log开关都定义了，并设置了相应的打印信息。下面我们来看下其相关的打印日志。  
1.没有做任何操作时的Log

```java
06-05 13:37:06.436: D/Hello(2651): ------------------start------------------------
06-05 13:37:06.436: D/Hello(2651): info log
06-05 13:37:06.436: D/Hello(2651): warn log
06-05 13:37:06.436: D/Hello(2651): error log
06-05 13:37:06.436: D/Hello(2651): assert log
06-05 13:37:06.436: D/Hello(2651): ------------------end------------------------
```

2.设置adb shell setprop log.tag.Hello V

```java
06-05 13:38:49.102: D/Hello(2651): ------------------start------------------------
06-05 13:38:49.102: D/Hello(2651): verbose log
06-05 13:38:49.102: D/Hello(2651): debug log
06-05 13:38:49.102: D/Hello(2651): info log
06-05 13:38:49.102: D/Hello(2651): warn log
06-05 13:38:49.102: D/Hello(2651): error log
06-05 13:38:49.102: D/Hello(2651): assert log
06-05 13:38:49.103: D/Hello(2651): ------------------end------------------------
```

3.设置adb shell setprop log.tag.Hello D

```java
06-05 13:39:42.593: D/Hello(2651): ------------------start------------------------
06-05 13:39:42.593: D/Hello(2651): debug log
06-05 13:39:42.593: D/Hello(2651): info log
06-05 13:39:42.593: D/Hello(2651): warn log
06-05 13:39:42.593: D/Hello(2651): error log
06-05 13:39:42.593: D/Hello(2651): assert log
06-05 13:39:42.593: D/Hello(2651): ------------------end------------------------
```

4.设置adb shell setprop log.tag.Hello I

```java
06-05 13:40:21.949: D/Hello(2651): ------------------start------------------------
06-05 13:40:21.949: D/Hello(2651): info log
06-05 13:40:21.949: D/Hello(2651): warn log
06-05 13:40:21.949: D/Hello(2651): error log
06-05 13:40:21.949: D/Hello(2651): assert log
06-05 13:40:21.949: D/Hello(2651): ------------------end------------------------
```

5.设置adb shell setprop log.tag.Hello W

```java
06-05 13:41:26.370: D/Hello(2651): ------------------start------------------------
06-05 13:41:26.370: D/Hello(2651): warn log
06-05 13:41:26.370: D/Hello(2651): error log
06-05 13:41:26.370: D/Hello(2651): assert log
06-05 13:41:26.370: D/Hello(2651): ------------------end------------------------
```

6.设置adb shell setprop log.tag.Hello E

```java
06-05 13:41:58.954: D/Hello(2651): ------------------start------------------------
06-05 13:41:58.954: D/Hello(2651): error log
06-05 13:41:58.954: D/Hello(2651): assert log
06-05 13:41:58.954: D/Hello(2651): ------------------end------------------------
```

7.设置adb shell setprop log.tag.Hello A

```java
06-05 13:42:56.747: D/Hello(2651): ------------------start------------------------
06-05 13:42:56.748: D/Hello(2651): assert log
06-05 13:42:56.748: D/Hello(2651): ------------------end------------------------
```

8.设置adb shell setprop log.tag.Hello S

```java
06-05 13:43:46.563: D/Hello(2651): ------------------start------------------------
06-05 13:43:46.563: D/Hello(2651): ------------------end------------------------
```

通过上面的Log信息可以分析到，我们通过adb shell setprop设置相应的级别和代码中Log.isLoggable设置的级别比较，当Log.isLoggable设置的级别大于或等于setprop设置的级别时，Log开关即打开，就可以打印Log了。同时，我们设置的S级别的Log，怎么样都不会打印Log。我们没有setprop任何Log级别时，默认打印的是设置Info级别的Log，从这里我们也可以知道，在实际代码Log开关定义中，最好设置成DEBUG级别，这样就可以通过setprop来设置是否需要打印Log。

### **frameworks中的模块使用Log.isLoggable**

当APP使用Log.isLoggable并定义为全局变量时，我们可以setprop后重启app打印相关的Log。那frameworks中如果有Log.isLoggable要怎么打印呢？只需要执行下面3步即可：

```sh
adb shell setprop log.tag.<TAG> D
adb shell stop
adb shell start
```

adb shell stop会杀掉zygote进程以及所有由zygote孵化而来的子进程。adb shell start则会重启zygote进程，再由zygote进程启动其它Android核心进程。当zygote重新启动时，会重新加载framework相关资源，而此时属性已经设置。

### **总结**

通过上面的实战分析，我们在做Log开关的时候，采用Log.isLoggable的方式，最好使用DEBUG级别这样我们就可以控制Log的打印了。同时,需要注意的是setprop设置Log级别的方法是一次性的，即如果机器重启后，就不会生效了。如果要想永久生效，就可以把属性值写入prop文件中。

### **Log.isLoggable源码分析**

首先，来看看Log.java中isLoggable的实现。通过源码我们可以知道isLoggable是一个JNI方法是通过CPP实现的。但是这里也有比较详细的注释。如果英文比较好的同学可以看下英文注解，这里就不细说了，直接看CPP源码。  

frameworks/base/core/java/android/util/Log.java

```java
    /**
     * Priority constant for the println method; use Log.v.
     */
    public static final int VERBOSE = 2;

    /**
     * Priority constant for the println method; use Log.d.
     */
    public static final int DEBUG = 3;

    /**
     * Priority constant for the println method; use Log.i.
     */
    public static final int INFO = 4;

    /**
     * Priority constant for the println method; use Log.w.
     */
    public static final int WARN = 5;

    /**
     * Priority constant for the println method; use Log.e.
     */
    public static final int ERROR = 6;

    /**
     * Priority constant for the println method.
     */
    public static final int ASSERT = 7;

    /**
     * Checks to see whether or not a log for the specified tag is loggable at the specified level.
     *
     *  The default level of any tag is set to INFO. This means that any level above and including
     *  INFO will be logged. Before you make any calls to a logging method you should check to see
     *  if your tag should be logged. You can change the default level by setting a system property:
     *      'setprop log.tag.&lt;YOUR_LOG_TAG> &lt;LEVEL>'
     *  Where level is either VERBOSE, DEBUG, INFO, WARN, ERROR, ASSERT, or SUPPRESS. SUPPRESS will
     *  turn off all logging for your tag. You can also create a local.prop file that with the
     *  following in it:
     *      'log.tag.&lt;YOUR_LOG_TAG>=&lt;LEVEL>'
     *  and place that in /data/local.prop.
     *
     * @param tag The tag to check.
     * @param level The level to check.
     * @return Whether or not that this is allowed to be logged.
     * @throws IllegalArgumentException is thrown if the tag.length() > 23.
     */
    public static native boolean isLoggable(String tag, int level);
```

frameworks/rs/rsCompatibilityLib.h

```c
#define PROPERTY_KEY_MAX 32
```

frameworks/base/core/jni/android\_util\_Log.cpp

```c++
#define LOG_NAMESPACE "log.tag."

/*
 * JNI registration.
 */
static JNINativeMethod gMethods[] = {
    /* name, signature, funcPtr */
    { "isLoggable",      "(Ljava/lang/String;I)Z", (void*) android_util_Log_isLoggable },
    { "println_native",  "(IILjava/lang/String;Ljava/lang/String;)I", (void*) android_util_Log_println_native },
};

struct levels_t {
    jint verbose;
    jint debug;
    jint info;
    jint warn;
    jint error;
    jint assert;
};
static levels_t levels;

static int toLevel(const char* value)
{
    //根据首字符的值设置相应的log级别，注意首字符要大写
    switch (value[0]) {
        case 'V': return levels.verbose;
        case 'D': return levels.debug;
        case 'I': return levels.info;
        case 'W': return levels.warn;
        case 'E': return levels.error;
        case 'A': return levels.assert;
        case 'S': return -1; // SUPPRESS
    }

    //如果都没有配备到上面的字符，就返回一个默认的info级别
    return levels.info;
}

static jboolean isLoggable(const char* tag, jint level) {
    String8 key;
    //将log.tag.<tag>连接起来成一个字符串
    key.append(LOG_NAMESPACE);
    key.append(tag);

    char buf[PROPERTY_VALUE_MAX];
    //获取这个字符串属性的值，如果没有获取到值就给其赋空值
    if (property_get(key.string(), buf, "") <= 0) {
        buf[0] = '\0';
    }

    int logLevel = toLevel(buf);
    //这个里可以看出，代码设置的级别不小于通过属性获取的级别就会返回true了。
    return logLevel >= 0 && level >= logLevel;
}

static jboolean android_util_Log_isLoggable(JNIEnv* env, jobject clazz, jstring tag, jint level)
{
    if (tag == NULL) {
        return false;
    }

    const char* chars = env->GetStringUTFChars(tag, NULL);
    if (!chars) {
        return false;
    }

    jboolean result = false;
    //判断log.tag.<tag>的长度是否大于32，如果大于32就报异常，所以我们给tag设置字符串的时候不要过长
    if ((strlen(chars)+sizeof(LOG_NAMESPACE)) > PROPERTY_KEY_MAX) {
        char buf2[200];
        snprintf(buf2, sizeof(buf2), "Log tag \"%s\" exceeds limit of %zu characters\n",
                chars, PROPERTY_KEY_MAX - sizeof(LOG_NAMESPACE));

        jniThrowException(env, "java/lang/IllegalArgumentException", buf2);
    } else {
        //真正处理逻辑的地方
        result = isLoggable(chars, level);
    }

    env->ReleaseStringUTFChars(tag, chars);
    return result;
}

int register_android_util_Log(JNIEnv* env)
{
    jclass clazz = env->FindClass("android/util/Log");

    if (clazz == NULL) {
        ALOGE("Can't find android/util/Log");
        return -1;
    }

    //通过反射获取Log.java上对应的值
    levels.verbose = env->GetStaticIntField(clazz, env->GetStaticFieldID(clazz, "VERBOSE", "I"));
    levels.debug = env->GetStaticIntField(clazz, env->GetStaticFieldID(clazz, "DEBUG", "I"));
    levels.info = env->GetStaticIntField(clazz, env->GetStaticFieldID(clazz, "INFO", "I"));
    levels.warn = env->GetStaticIntField(clazz, env->GetStaticFieldID(clazz, "WARN", "I"));
    levels.error = env->GetStaticIntField(clazz, env->GetStaticFieldID(clazz, "ERROR", "I"));
    levels.assert = env->GetStaticIntField(clazz, env->GetStaticFieldID(clazz, "ASSERT", "I"));

    return AndroidRuntime::registerNativeMethods(env, "android/util/Log", gMethods, NELEM(gMethods));
}
```

在上面的代码中，我已列出了重点部分的注解，相信大部分朋友都能看懂。它最重要的部分就是static jboolean isLoggable(const char\* tag, jint level)这个函数了。这个函数里面会去获取与tag相关property的Log级别，并与代码设置的Log级别比较返回相应的true还是false。

### **property的加载源码分析**

下面重点分析下property\_get方法获取对应的属性值时，我们可以设置property值的方法。  

一种方法是adb shell setprop，这种方法灵活方便，但是生命周期有限，机器设备重启即无效。  

另一种方法就是将属性写入prop文件中，这种方法就可以永久生效。下面我们通过源码来分析下这种方法都有哪些prop文件可以写入。

bionic/libc/include/sys/\_system\_properties.h

```c
#define PROP_PATH_RAMDISK_DEFAULT  "/default.prop"
#define PROP_PATH_SYSTEM_BUILD     "/system/build.prop"
#define PROP_PATH_SYSTEM_DEFAULT   "/system/default.prop"
#define PROP_PATH_VENDOR_BUILD     "/vendor/build.prop"
#define PROP_PATH_LOCAL_OVERRIDE   "/data/local.prop"
#define PROP_PATH_FACTORY          "/factory/factory.prop"
```

Android系统在加载init.rc文件后会去解析各个prop文件。  

system/core/init/property\_service.c

```c
void load_all_props(void)
{
    //加载/system/build.prop属性文件
    load_properties_from_file(PROP_PATH_SYSTEM_BUILD, NULL);
    //加载/system/default.prop属性文件
    load_properties_from_file(PROP_PATH_SYSTEM_DEFAULT, NULL);
    //加载/vendor/build.prop属性文件
    load_properties_from_file(PROP_PATH_VENDOR_BUILD, NULL);
    //加载/factory/factory.prop属性文件
    load_properties_from_file(PROP_PATH_FACTORY, "ro.*");

    //加载/data/local.prop属性文件
    load_override_properties();

    /* Read persistent properties after all default values have been loaded. */
    load_persistent_properties();
}

static void load_override_properties() {
#ifdef ALLOW_LOCAL_PROP_OVERRIDE
    char debuggable[PROP_VALUE_MAX];
    int ret;

    ret = property_get("ro.debuggable", debuggable);
    //加载/data/local.prop属性文件有两个判断条件。1.定义了ALLOW_LOCAL_PROP_OVERRIDE，2.ro.debuggable=1
    //只有满足这两个条件才会去加载/data/local.prop属性文件
    if (ret && (strcmp(debuggable, "1") == 0)) {
        load_properties_from_file(PROP_PATH_LOCAL_OVERRIDE, NULL);
    }
#endif /* ALLOW_LOCAL_PROP_OVERRIDE */
}
```

通过上面的源码我们知道系统会去加载各个prop文件，但通常上面加载的prop文件不一定全部都有，但是/system/build.prop一定会有。同时，如果我们去改/data/local.prop文件不一定会生效，因为系统不一定会去加载这个文件。因为它有两个判断条件需要满足，当然这只是我从5.1的系统分析，不同的系统会有差别。以实际系统为准。



### **参考文章**

[Android 5.0 如何正确启用isLoggable(一)\_\_使用详解](http://blog.csdn.net/yihongyuelan/article/details/46409389)  

[Android 5.0 如何正确启用isLoggable(二)\_\_原理分析](http://blog.csdn.net/yihongyuelan/article/details/46413207)  

[深入讲解Android Property机制](https://my.oschina.net/youranhongcha/blog/389640)

 

本文转自 [https://blog.csdn.net/QQxiaoqiang1573/article/details/72870825](https://blog.csdn.net/QQxiaoqiang1573/article/details/72870825)，如有侵权，请联系删除。