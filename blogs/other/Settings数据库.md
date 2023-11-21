---
title: settings详解
date: 2022-09-22
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 一、 概述

在Android启动之后，我们通常需要根据自己的一些需要来设置一些符合我们使用习惯的属性。

例如:来电铃声、锁屏时间、日期格式等等。而这些属性的设置通常是有Settings为入口，通过SettingsProvider来进行的。SettingsProvider也是所有系统设置的管理者。

在M(Android5.0)版本之前，SettingsProvider中系统设置是存储在settings.db数据库中；但是在L(Android6.0)之后，SettingsProvider中系统设置改为由xml存储在data分区。

为什么要从settings.db改为xml存储？

原因：

1、这次修改涉及到了global,secure,system 三个表；并且实现方式从之前的数据库，改为异步性能更加优良的xml。

2、这次修改主要是基于性能的考量(写入一条耗时从400ms降低为10ms)，同时也能够使得保存数据的过程更加可信。

3、实际上，得保存数据的过程更加可信这一条并不是问题的关键，写入失败的情况不仅非常罕见，而且上层应用修改SettingsProvider设置都是通过

SettingsProvider来实现的。所以当上层APP下次再次启动的时候，并不知道数据写入失败。

4、改变SettingsProvider的实现方式(从db改为xml以及相应逻辑)，可以有效的防止某些恶意APP监听某些设置选项，进而频繁的进行操作。

5、每个用户都有自己的一份SettingsProvider设置xml文档。通常位于/data/system/users/userid/

6、控制APP针对SettingsProvider的写入(合法性的判断)

7、控制SettingsProvider的大小(数据量大小，占用内存大小,etc.)

其实主要原因就是因为性能、安全两个原因。

使用adb shell进入data分区中可以看到：

```sh
PS C:\Users\MAZHUANG> adb shell
xet509:/ # cd /data/system/users/0
xet509:/data/system/users/0 # ls -l
total 3108
-rw------- 1 system system   12962 2021-12-07 07:02 settings_global.xml
-rw------- 1 system system   11804 2021-12-05 14:16 settings_secure.xml
-rw------- 1 system system    6448 2021-12-04 17:54 settings_system.xml
xet509:/data/system/users/0 #
```

其中settings_global.xml 、settings_secure.xml 、settings_system.xml 、即对应/frameworks/base/core/java/android/provider/Settings.java中的三个内部类：Global、Secure、System。

也就是Settings的三种分类，分别如下：

1. Global：所有的偏好设置对系统的所有用户公开，第三方APP有读没有写的权限；
2. System：包含各种各样的用户偏好系统设置，第三方APP有读没有写的权限；
3. Secure：安全性的用户偏好系统设置，第三方APP有读没有写的权限。

可以看到它们三个都继承了BaseColumns

```java
    /**
     * System settings, containing miscellaneous system preferences.  This
     * table holds simple name/value pairs.  There are convenience
     * functions for accessing individual settings entries.
     */
    public static final class System extends NameValueTable {
        // NOTE: If you add new settings here, be sure to add them to
        // com.android.providers.settings.SettingsProtoDumpUtil#dumpProtoSystemSettingsLocked.

        private static final float DEFAULT_FONT_SCALE = 1.0f;

        /**
         * The content:// style URL for this table
         */
        public static final Uri CONTENT_URI =
            Uri.parse("content://" + AUTHORITY + "/system");

        private static final ContentProviderHolder sProviderHolder =
                new ContentProviderHolder(CONTENT_URI);

        private static final NameValueCache sNameValueCache = new NameValueCache(
                CONTENT_URI,
                CALL_METHOD_GET_SYSTEM,
                CALL_METHOD_PUT_SYSTEM,
                sProviderHolder);

        private static final HashSet<String> MOVED_TO_SECURE;
        ........
        ........
    }

    /**
     * Secure system settings, containing system preferences that applications
     * can read but are not allowed to write.  These are for preferences that
     * the user must explicitly modify through the system UI or specialized
     * APIs for those values, not modified directly by applications.
     */
    public static final class Secure extends NameValueTable {
        // NOTE: If you add new settings here, be sure to add them to
        // com.android.providers.settings.SettingsProtoDumpUtil#dumpProtoSecureSettingsLocked.

        /**
         * The content:// style URL for this table
         */
        public static final Uri CONTENT_URI =
            Uri.parse("content://" + AUTHORITY + "/secure");
        .....
        .....
    }

    /**
     * Global system settings, containing preferences that always apply identically
     * to all defined users.  Applications can read these but are not allowed to write;
     * like the "Secure" settings, these are for preferences that the user must
     * explicitly modify through the system UI or specialized APIs for those values.
     */
    public static final class Global extends NameValueTable {
        // NOTE: If you add new settings here, be sure to add them to
        // com.android.providers.settings.SettingsProtoDumpUtil#dumpProtoGlobalSettingsLocked.

        /**
         * The content:// style URL for global secure settings items.  Not public.
         */
        public static final Uri CONTENT_URI = Uri.parse("content://" + AUTHORITY + "/global");

        /**
         * Whether users are allowed to add more users or guest from lockscreen.
         * <p>
         * Type: int
         * @hide
         */
        public static final String ADD_USERS_WHEN_LOCKED = "add_users_when_locked";
        .....
        .....
    }
```

在Settings.java搜索NameValueTable可以看到：

```java
    /**
     * Common base for tables of name/value settings.
     */
    public static class NameValueTable implements BaseColumns {
        public static final String NAME = "name";
        public static final String VALUE = "value";

        protected static boolean putString(ContentResolver resolver, Uri uri,
                String name, String value) {
            // The database will take care of replacing duplicates.
            try {
                ContentValues values = new ContentValues();
                values.put(NAME, name);
                values.put(VALUE, value);
                resolver.insert(uri, values);
                return true;
            } catch (SQLException e) {
                Log.w(TAG, "Can't set key " + name + " in " + uri, e);
                return false;
            }
        }

        public static Uri getUriFor(Uri uri, String name) {
            return Uri.withAppendedPath(uri, name);
        }
    }

```

查看**/frameworks/base/core/java/android/provider/BaseColumns.java**可以看到：

```java
package android.provider;

public interface BaseColumns
{
    /**
     * The unique ID for a row.
     * <P>Type: INTEGER (long)</P>
     */
    public static final String _ID = "_id";

    /**
     * The count of rows in a directory.
     * <P>Type: INTEGER</P>
     */
    public static final String _COUNT = "_count";
}
```

这个类只是提供了两个字段，一个是"_id"一个是"_count"，便于调用数据库时导致拼写错误，你也可以扩展它，或者自定义这么个，然后直接调用它的常量名，防止写sql语句时把列名拼错。

可以看出Settings中不论是Global、System还是Secure的数据都由键值对组成的。

## 二、与SystemProperties的不同点

SettingsProvider有点类似Android的properties系统（Android属性系统）：SystemProperties

但是SettingsProvider和SystemProperties有以下不同点：

1. 数据保存方式不同：SystemProperties的数据保存属性文件中（/system/build.prop等），开机后会被加载到system properties store；SettingsProvider的数据保存在文件/data/system/users/0/settings_***.xml和数据库settings.db中；
2. 作用范围不同：SystemProperties可以实现跨进程、跨层次调用，即底层的c/c++可以调用，java层也可以调用；SettingProvider只能能在java层（APP）使用；
3. 公开程度不同：SettingProvider有部分功能上层第三方APP可以使用（对于加了@hide标记的第三方APP仅可读，不可修改），SystemProperties上层第三方APP不可以使用。

## 三、关于Settings的修改方式：

**通过adb shell进行修改：**

```sh
PS C:\Users\MAZHUANG> adb shell
xet509:/ # settings put global audio_test_result 0   
xet509:/ # settings get global audio_test_result
0
xet509:/ # settings list system
accelerometer_rotation=0
alarm_alert=content://media/internal/audio/media/210?title=Cesium&canonical=1
alarm_alert_set=1
background_power_saving_enable=1
```

可以看出主要格式为：

adb shell settings get [ global/system/secure ] [ key ]

adb shell settings put [ global/system/secure ] [ key ] [ value ]

adb shell settings list [ global/system/secure ]

通过java代码修改：（支持常用的String、int、boolean等类型的get和put）

```java
Settings.Global.putString(mContext.getContentResolver(), "audio_test_result", value);//修改
Settings.Global.getString(mContext.getContentResolver(), "audio_test_result");//查询
```

常用的几个方法可以看Global/System/Secure中的几个方法(Global/System/Secure都有这个方法)：

具体实现都在：/frameworks/base/core/java/android/provider/Settings.java**中

```java
        /**
         * Look up a name in the database.
         * @param resolver to access the database with
         * @param name to look up in the table
         * @return the corresponding value, or null if not present
         */
        public static String getString(ContentResolver resolver, String name) {
            return getStringForUser(resolver, name, resolver.getUserId());
        }

        /**
         * Store a name/value pair into the database.
         * @param resolver to access the database with
         * @param name to store
         * @param value to associate with the name
         * @return true if the value was set, false on database errors
         */
        public static boolean putString(ContentResolver resolver, String name, String value) {
            return putStringForUser(resolver, name, value, resolver.getUserId());
        }
```

## 四、Settings中值的监听

有时需要监听Settings下面的值，这个时候可以通过ContentObserver 来监听值的变化。

1.首先自定义一个类继承ContentObserver。在onChange()方法里面再次去获取Settings的值。

```java
    private final class SettingsAudioTestObserver extends ContentObserver {
        public SettingsAudioTestObserver(Handler handler) {
            super(handler);
        }
  
        @Override
        public void onChange(boolean selfChange, android.net.Uri uri) {
            Log.d(TAG, " SettingsAudioTestObserver  onChange......" );
            int maudio = Settings.Global.getInt(mContext.getContentResolver(), Settings.Global.AUDIO_TEST_RESULT, 0);
            Log.d(TAG, " SettingsAudioTestObserver  onChanged  maudio====" + maudio);
            Log.d(TAG, " SettingsAudioTestObserver  onChanged  Integer.toString(maudio) start ====" + Integer.toString(maudio));
            
            if(maudio == 1){
                WriteFile(AUDIO_TEST_RESULT_PATH,"1");
            }else{
                WriteFile(AUDIO_TEST_RESULT_PATH,"0");
            }
            
            Log.d(TAG, " SettingsAudioTestObserver  onChanged  Integer.toString(maudio)  end ====" + Integer.toString(maudio));
        }
    }
```

2.注册监听。

```java
mHandler = new Handler(true /*async*/);
mAudiotestobserver = new SettingsAudioTestObserver(mHandler);
mContext.getContentResolver().registerContentObserver(Settings.Global.getUriFor(
    Settings.Global.AUDIO_TEST_RESULT), false, mAudiotestobserver, UserHandle.USER_ALL);
```

3.结束时候取消监听。

```java
getContentResolver().unregisterContentObserver(mAudiotestobserver);
```

## 五、Settings常用之处

系统设置中很多设置其实都是存在Settings中的System、Global、Secure中

需要用到公共数据的时候也可以采用存在Settings中这种方法

可以对Settings中某个值进行监听，执行对应的操作等…