---
title: Android Recovery模式下cache分区开机后文件被删除
date: 2023-08-18
tags:
 - android
categories: 
 - android
sticky: 
   true
---

 在一次需求的实现过程中需要在remcovery模式下，在/cache/recovery/目录下创建一个日志文件用于记录相关的日志信息，以便于在开机后读取这些日志信息，再根据日志信息做出相应的处理，但是奇怪的是每当开机完成该文件不被系统自动删除，而系统中原有的日志文件（如升级log---last\_log\_r）等却依然保留，因此在全局中搜索关键字”/cache/recovery/“发现了这其中的原因。

也就是说系统会在系统启动完成后删除/cache/recovery/目录下不是以”last\_"为前缀的文件，那么具体是如何实现的呢，我们一起来看一下。

首先在framework层有一个BootReceiver这样一个类，用于处理系统启动完成后的善后工作，例如删除旧的无关的日志信息等。

第一步：在framework/base/core/res下的清单文件AndroidManifest.xml中注册广播接收器BootReceiver，用于接收系统启动完成的广播如下：

```xml
        <receiver android:name="com.android.server.BootReceiver"
                android:primaryUserOnly="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>
```

第二步：当系统启动完成后，这个广播接收器会接收到系统启动完成的广播之后在onReceive下执行logBootEvents函数，并执行RecoverySystem下的handleAftermath（）函数，最终删除在/cache/recovery下不是以last\_为前缀的文件。具体函数如下：

```java
    /**
     * Called after booting to process and remove recovery-related files.
     * @return the log file from recovery, or null if none was found.
     *
     * @hide
     */
    public static String handleAftermath() {
        // Record the tail of the LOG_FILE
        Log.d(TAG,"Entering the handleAftermath method");
        String log = null;
        try {
            log = FileUtils.readTextFile(LOG_FILE, -LOG_FILE_MAX_LENGTH, "...\n");
        } catch (FileNotFoundException e) {
            Log.i(TAG, "No recovery log file");
        } catch (IOException e) {
            Log.e(TAG, "Error reading recovery log", e);
        }

        // Delete everything in RECOVERY_DIR except those beginning
        // with LAST_PREFIX
        String[] names = RECOVERY_DIR.list();
        for (int i = 0; names != null && i < names.length; i++) {
            if (names[i].startsWith(LAST_PREFIX)) continue;
            File f = new File(RECOVERY_DIR, names[i]);
            if (!f.delete()) {
                Log.e(TAG, "Can't delete: " + f);
            } else {
                Log.i(TAG, "Deleted: " + f);
            }
        }

        return log;
    }
```
注：如果我们需要在/cache/recovery/目录下保存文件，我们可以以"last\_"为前缀进行命名也可以在RecoverySystem中修改相关的逻辑。  




本文转自 [https://bill-huang.blog.csdn.net/article/details/44338479?spm=1001.2101.3001.6650.1&utm\_medium=distribute.pc\_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-44338479-blog-39153123.235%5Ev38%5Epc\_relevant\_anti\_vip\_base&depth\_1-utm\_source=distribute.pc\_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-44338479-blog-39153123.235%5Ev38%5Epc\_relevant\_anti\_vip\_base&utm\_relevant\_index=2](https://bill-huang.blog.csdn.net/article/details/44338479?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-44338479-blog-39153123.235%5Ev38%5Epc_relevant_anti_vip_base&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-44338479-blog-39153123.235%5Ev38%5Epc_relevant_anti_vip_base&utm_relevant_index=2)，如有侵权，请联系删除。