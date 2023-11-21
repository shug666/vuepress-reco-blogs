---
title: Android Settings数据库读写操作和数据监听变化原理分析
date: 2023-02-13
tags:
 - android
categories: 
 - android
sticky: 
   true
---

 

在Android系统当中，系统设置保存着全局性、系统级别的用户编好设置，比如像飞行模式开关、是否开启手机静音模式时震动、屏幕休眠时长等状态值。这些用户偏好的设置很多就保存在SettingsProvider中，在Android 6.0及以后版本，SettingsProvider被重构，Android从性能、安全等方面考虑，把SettingsProvider中原本保存在settings.db中的数据，目前全部保存在XML文件中。并且对SettingsProvider对数据进行了分类，分别是Global、System、Secure三种类型：

1、三种类型的Settings数据
=================

Global：所有的偏好设置对系统的所有用户公开，第三方APP有读没有写的权限；

数据保存的位置为：

```java
/data/system/users/0/settings_global.xml

//通过adb命令可以查看global类型的数据
//比如查看系统设置是否自动确定时间的开关
adb shell settings get global auto_time
1

//通过adb命令也可以修改global类型的数据
//比如修改系统设置自动确定时间的开关
adb shell settings put global auto_time 0
```

System：包含各种各样的用户偏好系统设置，第三方APP有读没有写的权限；

数据保存的位置为：

```java
/data/system/users/0/settings_system.xml

//通过adb命令可以查看system类型的数据
//比如查看系统设置字体大小的比例值
adb shell settings get system font_scale
1.0

//通过adb命令也可以修改system类型的数据
//比如修改系统字体大小的比例值
adb shell settings put system font_scale 1.5f
```

Secure：安全性的用户偏好系统设置，第三方APP有读没有写的权限；

数据保存的位置为：

```java
/data/system/users/0/settings_secure.xml


//通过adb命令可以查看secure类型的数据
//比如查看系统的Android id
adb shell settings get secure android_id
265b29c6eed6e790

//通过adb命令也可以修改secure类型的数据
//同样的修改一个secure类型的数据，对应的修改键值名称就可以了
adb shell settings put secure key_name key_value
```

上面主要介绍了三种类型settings数据库的保存位置以及adb命令读写的方法。

2、新增自定义设置字段以及监听它的数据库变化
======================

```java
//首先我们先定义一个数据库的键值Key
//比如我们定义一个保存设备uuid的键值为"device_uuid"
private static final String KEY_DEVICE_UUID = "device_uuid";

//保存设备的uuid
Settings.Secure.putString(getContentResolver(), LinspirerToolConstant.KEY_DEVICE_UUID, uuid)

//读取设备的uuid
String uuid = Settings.Secure.getString(getContentResolver(), LinspirerToolConstant.KEY_DEVICE_UUID );
```

那么对于上面保存的设备uuid，如果发生了变化，我们该怎么及时知道呢？

第一步，我们要想知道某个数据的变化，需要先对这个数据库的字段键值设置监听：

```java
//获取ContentResolver对象
ContentResolver contentResolver = getContentResolver();
//注册监听对应的数据库字段Key
contentResolver.registerContentObserver(Settings.Secure.getUriFor(LinspirerToolConstant.KEY_SHEEPMIE_UUID),true,new SettingsObserver(null));
```

接着，自定义自己的ContentObserver类，实现数据变化的回调方法：

```java
private final class SettingsObserver extends ContentObserver {

        /**
         * Creates a content observer.
         * @param handler The handler to run {@link #onChange} on, or null if none.
         */
        public SettingsObserver(Handler handler) {
            super(handler);
        }

        @Override
        public void onChange(boolean selfChange) {
            try {
                String uuid = Settings.Secure.getString(getContentResolver(), KEY_DEVICE_UUID);
                Log.w(" -- SettingsObserver is onChange and uuid == " + uuid);
            } catch (Throwable e) {
                e.printStackTrace();
            }
        }
    }
```

通过上面注册监听ContentObserver对象的方式，每当监听的数据库键值变化时，都可以实时的处理跟数据变化相关的业务逻辑了。

3、监听实现的原理过程
===========

像上面保存的设备UUID，直接使用Settings.Secure.putString()方法，它在Android Framework中的具体类路径以及方法逻辑如下：

```java
frameworks/base/core/java/android/provider/Settings.java

 //其内部类Secure 实现如下
 public static final class Secure extends NameValueTable {

        ....... 代码省略号 .......

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

        ....... 代码省略号 .......

        /** @hide */
        @UnsupportedAppUsage(maxTargetSdk = Build.VERSION_CODES.R, trackingBug = 170729553)
        public static boolean putStringForUser(@NonNull ContentResolver resolver,
                @NonNull String name, @Nullable String value, @Nullable String tag,
                boolean makeDefault, @UserIdInt int userHandle, boolean overrideableByRestore) {
            if (MOVED_TO_GLOBAL.contains(name)) {
                Log.w(TAG, "Setting " + name + " has moved from android.provider.Settings.Secure"
                        + " to android.provider.Settings.Global");
                return Global.putStringForUser(resolver, name, value,
                        tag, makeDefault, userHandle, DEFAULT_OVERRIDEABLE_BY_RESTORE);
            }
             //这个会继续向下调用
            return sNameValueCache.putStringForUser(resolver, name, value, tag,
                    makeDefault, userHandle, overrideableByRestore);
        }

}

由上面的逻辑我们知道，我们保存的Secure类型的数据是通过NameValueCache.putStringForUser()方法。那我们再来具体看下NameValueCache类中该方法的具体实现吧。
 private static class NameValueCache {
        
        @UnsupportedAppUsage
        private final ContentProviderHolder mProviderHolder;

        ..........

 private <T extends NameValueTable> NameValueCache(Uri uri, String getCommand,
                String setCommand, String deleteCommand, String listCommand, String setAllCommand,
                ContentProviderHolder providerHolder, Class<T> callerClass) {
            ........
            mProviderHolder = providerHolder;
            .........
        }

 public boolean putStringForUser(ContentResolver cr, String name, String value,
                String tag, boolean makeDefault, final int userHandle,
                boolean overrideableByRestore) {
            try {

                .........
                //通过ContentProviderHolder获取IContentProvider对象并调用call 方法将我们的Uri以及要保存的键值对传入
                IContentProvider cp = mProviderHolder.getProvider(cr);
                cp.call(cr.getAttributionSource(),
                        mProviderHolder.mUri.getAuthority(), mCallSetCommand, name, arg);
            } catch (RemoteException e) {
                Log.w(TAG, "Can't set key " + name + " in " + mUri, e);
                return false;
            }
            return true;
        }

}


```

到这里，当我们看到IContentProvider这个类以及它的call方法的时候，有没有很熟悉？![](https://img-blog.csdnimg.cn/4e7c02b5db1b48649800143718d3a76c.png)

 这样我们就很容易联想到了ContentProvider中的call方法实现，具体的逻辑，各位继续往下看。

```java
frameworks/base/core/java/android/content/ContentProvider.java
 //在ContentProvider中有这样一个内部类的实现
class Transport extends ContentProviderNative {

        ........

        volatile ContentInterface mInterface = ContentProvider.this;

        ........

        ContentProvider getContentProvider() {
            return ContentProvider.this;
        }

        ........

        @Override
        public Bundle call(@NonNull AttributionSource attributionSource, String authority,
                String method, @Nullable String arg, @Nullable Bundle extras) {
            validateIncomingAuthority(authority);
            Bundle.setDefusable(extras, true);
            traceBegin(TRACE_TAG_DATABASE, "call: ", authority);
            final AttributionSource original = setCallingAttributionSource(
                    attributionSource);
            try {
                //可以看到这里，最后还是调用了ContentProvider中自己重写的call方法
                return mInterface.call(authority, method, arg, extras);
            } catch (RemoteException e) {
                throw e.rethrowAsRuntimeException();
            } finally {
                setCallingAttributionSource(original);
                Trace.traceEnd(TRACE_TAG_DATABASE);
            }
        }
}
    @Override
    public @Nullable Bundle call(@NonNull String authority, @NonNull String method,
            @Nullable String arg, @Nullable Bundle extras) {
        return call(method, arg, extras);
    }

    //该方法就需要继承ContentProvider的子类继续重写了
    public @Nullable Bundle call(@NonNull String method, @Nullable String arg,
            @Nullable Bundle extras) {
        return null;
    }

```

 系统设置作为保存全局状态标识的入口，它所有的数据库对外的读写也是通过ContentProvider实现不同进程间共享的。也是有单独的模块来处理这部分业务逻辑的，它就是SettingsProvider，具体的项目源码路径为：

```java
 frameworks/base/packages/SettingsProvider/
```

那些在这个模块下SettingsProvider类，通过继承ContentProvider，实现对settings数据库的共享。

```java
frameworks/base/packages/SettingsProvider/src/com/android/providers/settings/SettingsProvider.java
public class SettingsProvider extends ContentProvider {

      ...........

@Override
    public boolean onCreate() {
        Settings.setInSystemServer();

        synchronized (mLock) {
            mUserManager = UserManager.get(getContext());
            ..........
            mSettingsRegistry = new SettingsRegistry();
        }
        ...........
        synchronized (mLock) {
            mSettingsRegistry.migrateAllLegacySettingsIfNeededLocked();
            mSettingsRegistry.syncSsaidTableOnStartLocked();
        }
        ............
        ServiceManager.addService("settings", new SettingsService(this));
        ServiceManager.addService("device_config", new DeviceConfigService(this));
        return true;
    }

    @Override
    public Bundle call(String method, String name, Bundle args) {
        final int requestingUserId = getRequestingUserId(args);
        switch (method) {  
            ........... 
            //获取GLOBAL类型的设置数据
            case Settings.CALL_METHOD_GET_GLOBAL: {
                Setting setting = getGlobalSetting(name);
                return packageValueForCallResult(setting, isTrackingGeneration(args));
            }
            //获取SECURE类型的设置数据
            case Settings.CALL_METHOD_GET_SECURE: {
                Setting setting = getSecureSetting(name, requestingUserId);
                return packageValueForCallResult(setting, isTrackingGeneration(args));
            }
            //获取SYSTEM类型的设置数据
            case Settings.CALL_METHOD_GET_SYSTEM: {
                Setting setting = getSystemSetting(name, requestingUserId);
                return packageValueForCallResult(setting, isTrackingGeneration(args));
            }
            //保存GLOBAL类型的设置数据
            case Settings.CALL_METHOD_PUT_GLOBAL: {
                String value = getSettingValue(args);
                String tag = getSettingTag(args);
                final boolean makeDefault = getSettingMakeDefault(args);
                final boolean overrideableByRestore = getSettingOverrideableByRestore(args);
                insertGlobalSetting(name, value, tag, makeDefault, requestingUserId, false,
                        overrideableByRestore);
                break;
            }
            //保存SECURE类型的设置数据
            case Settings.CALL_METHOD_PUT_SECURE: {
                String value = getSettingValue(args);
                String tag = getSettingTag(args);
                final boolean makeDefault = getSettingMakeDefault(args);
                final boolean overrideableByRestore = getSettingOverrideableByRestore(args);
                insertSecureSetting(name, value, tag, makeDefault, requestingUserId, false,
                        overrideableByRestore);
                break;
            }
            //保存SYSTEM类型的设置数据
            case Settings.CALL_METHOD_PUT_SYSTEM: {
                String value = getSettingValue(args);
                boolean overrideableByRestore = getSettingOverrideableByRestore(args);
                insertSystemSetting(name, value, requestingUserId, overrideableByRestore);
                break;
            }
            //删除GLOBAL类型的设置数据
            case Settings.CALL_METHOD_DELETE_GLOBAL: {
                int rows = deleteGlobalSetting(name, requestingUserId, false) ? 1 : 0;
                Bundle result = new Bundle();
                result.putInt(RESULT_ROWS_DELETED, rows);
                return result;
            }
            //删除SECURE类型的设置数据
            case Settings.CALL_METHOD_DELETE_SECURE: {
                int rows = deleteSecureSetting(name, requestingUserId, false) ? 1 : 0;
                Bundle result = new Bundle();
                result.putInt(RESULT_ROWS_DELETED, rows);
                return result;
            }
            //删除SYSTEM类型的设置数据
            case Settings.CALL_METHOD_DELETE_SYSTEM: {
                int rows = deleteSystemSetting(name, requestingUserId) ? 1 : 0;
                Bundle result = new Bundle();
                result.putInt(RESULT_ROWS_DELETED, rows);
                return result;
            }

            ...........
            default: {
                Slog.w(LOG_TAG, "call() with invalid method: " + method);
            } break;
        }

        return null;
    }
     ..........
}
```

在SettingsProvider类中的onCreate()方法中，先创建一个SettingsRegistry对象，初始化一些设置数据保存的文件路径名称等, 同时也在系统启动的时候添加注册SettingsService, 可以让设备一启动，系统设置就可以正常工作了。

```java
 final class SettingsRegistry {
        ........

        private static final String SETTINGS_FILE_GLOBAL = "settings_global.xml";
        private static final String SETTINGS_FILE_SYSTEM = "settings_system.xml";
        private static final String SETTINGS_FILE_SECURE = "settings_secure.xml";

        ........
}
```

紧接着，重点来了。最终的call()方法实现了系统设置的增删改查。

现在我们还是以保存Secure类型的数据数据为例，把call()方法中的逻辑以及向下对应的方法调用链简单展示一下哈

```java
 //去插入Secure类型的Settings数据
private boolean insertSecureSetting(String name, String value, String tag,
            boolean makeDefault, int requestingUserId, boolean forceNotify,
            boolean overrideableByRestore) {
        
        return mutateSecureSetting(name, value, tag, makeDefault, requestingUserId,
                MUTATION_OPERATION_INSERT, forceNotify, 0, overrideableByRestore);
 }

//根据保存的数据类型做一个转换操作
private boolean mutateSecureSetting(String name, String value, String tag,
            boolean makeDefault, int requestingUserId, int operation, boolean forceNotify,
            int mode, boolean overrideableByRestore) {
        // Make sure the caller can change the settings.
        enforceWritePermission(Manifest.permission.WRITE_SECURE_SETTINGS);
        ...........

        // Mutate the value.
        synchronized (mLock) {
            switch (operation) {
                case MUTATION_OPERATION_INSERT: {
                    return mSettingsRegistry.insertSettingLocked(SETTINGS_TYPE_SECURE,
                            owningUserId, name, value, tag, makeDefault,
                            callingPackage, forceNotify, CRITICAL_SECURE_SETTINGS,
                            overrideableByRestore);
                }
               ............
            }
        }
        return false;
    }
```

根据上面Secure类型判断，该类型的数据插入动作又调用了SettingsRegistry中的insertSettingLocked()方法，那我们就继续看下这个方法的具体逻辑吧。

```java
 public boolean insertSettingLocked(int type, int userId, String name, String value,
                String tag, boolean makeDefault, boolean forceNonSystemPackage, String packageName,
                boolean forceNotify, Set<String> criticalSettings, boolean overrideableByRestore) {
            ...........

            boolean success = false;
            SettingsState settingsState = peekSettingsStateLocked(key);
            if (settingsState != null) {
                 //保存传入的Settings数据
                success = settingsState.insertSettingLocked(name, value,
                        tag, makeDefault, forceNonSystemPackage, packageName, overrideableByRestore);
            }

            if (success && criticalSettings != null && criticalSettings.contains(name)) {
                settingsState.persistSyncLocked();
            }
             //如果保存成功，通知Settings数据发送变化
            if (forceNotify || success) {
                notifyForSettingsChange(key, name);
            }
            return success;
     }
```

在notifyForSettingsChange()方法中，会通过handler发送消息，告知对应的URI发生了变化。

```java
  private void notifyForSettingsChange(int key, String name) {
            // Increment the generation first, so observers always see the new value
            mGenerationRegistry.incrementGeneration(key);
            ...........
            if (isGlobalSettingsKey(key) || isConfigSettingsKey(key)) {
             ............
               
            } else {
                final int userId = getUserIdFromKey(key);
                final Uri uri = getNotificationUriFor(key, name);
                 //通知某个URI发生了变化
                mHandler.obtainMessage(MyHandler.MSG_NOTIFY_URI_CHANGED,
                        userId, 0, uri).sendToTarget();
              .............
            }

            // Always notify that our data changed
            mHandler.obtainMessage(MyHandler.MSG_NOTIFY_DATA_CHANGED).sendToTarget();
        }
```

handler中具体的实现如下：

```java
private final class MyHandler extends Handler {
            private static final int MSG_NOTIFY_URI_CHANGED = 1;
            private static final int MSG_NOTIFY_DATA_CHANGED = 2;

            public MyHandler(Looper looper) {
                super(looper);
            }

            @Override
            public void handleMessage(Message msg) {
                switch (msg.what) {
                    case MSG_NOTIFY_URI_CHANGED: {
                        final int userId = msg.arg1;
                        Uri uri = (Uri) msg.obj;
                        try {
                             //最终通知我们在ContentResolver中注册的ContentObserver观察者
                            getContext().getContentResolver().notifyChange(uri, null, true, userId);
                        } catch (SecurityException e) {
                            Slog.w(LOG_TAG, "Failed to notify for " + userId + ": " + uri, e);
                        }
                        if (DEBUG) {
                            Slog.v(LOG_TAG, "Notifying for " + userId + ": " + uri);
                        }
                    } break;

                    case MSG_NOTIFY_DATA_CHANGED: {
                        mBackupManager.dataChanged();
                        scheduleWriteFallbackFilesJob();
                    } break;
                }
            }
        }
```

这样最终就回调到了我们最初注册的SettingsObserver中重写的onChange()方法了。这样以来，对特定键值的URI做了监听，如果保存的settings值发生了变化，就可以第一时间处理对应的逻辑了。

  

本文转自 [https://blog.csdn.net/liu\_guizhou/article/details/125034986](https://blog.csdn.net/liu_guizhou/article/details/125034986)，如有侵权，请联系删除。