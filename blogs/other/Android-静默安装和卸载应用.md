---
title: Android 静默安装和卸载应用
date: 2023-01-13
tags:
 - android
categories: 
 - android
sticky: 
   true
---

 

大家有没有发现现在的手机 只要是在自家应用市场下载安装的应用都不会弹出安装界面直接就装好了，今天我们就来实现这种功能

之前在网上查了资料好多都是很早之前的版本了 通过命令 调用系统接口 这些我都去验证了 9.0 后对权限的管理很严了 命令的方式系统已经移除了  调用系统接口 `PackageManager.installPackage()` 在9.0 也移除了 在8.0 的时候都还没有移除 有需要做兼容的可以以8.0做一个版本判断， 但是在8.0 开始就采用了新的安装方式代替，这种方式就是以会话的形式 通过会话进行通信 传输文件流给底层进行安装。之前在网上查了很多资料都无果，于是去看了源码 我们普通应用发起显示安装 都会通过Intent 这个时候就会被系统的一个应用拦截 这个就是安装界面系统源码路径 `packages/apps/PackageInstaller`  其中 InstallInstalling.java 这个类里面主要实现安装逻辑代码 我们将其中的关键代码摘要出来。

## 注册回调接口

```java
private int mSessionId = -1;
private PackageInstaller.SessionCallback mSessionCallback;
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_install_test);
    init();
}

public void init() {
    mSessionCallback = new InstallSessionCallback();
   getPackageManager().getPackageInstaller().registerSessionCallback(mSessionCallback);
}
```
```java
private class InstallSessionCallback extends PackageInstaller.SessionCallback {
    @Override
    public void onCreated(int sessionId) {
        // empty
        Log.d(TAG, "onCreated()" + sessionId);
    }

    @Override
    public void onBadgingChanged(int sessionId) {
        // empty
        Log.d(TAG, "onBadgingChanged()" + sessionId + "active");
    }

    @Override
    public void onActiveChanged(int sessionId, boolean active) {
        // empty
        Log.d(TAG, "onActiveChanged()" + sessionId + "active" + active);
    }

    @Override
    public void onProgressChanged(int sessionId, float progress) {
        Log.d(TAG, "onProgressChanged()" + sessionId);
        if (sessionId == mSessionId) {
            int progres = (int) (Integer.MAX_VALUE * progress);
            Log.d(TAG, "onProgressChanged" + progres);
        }
    }

    @Override
    public void onFinished(int sessionId, boolean success) {
        // empty, finish is handled by InstallResultReceiver
        Log.d(TAG, "onFinished()" + sessionId + "success" + success);
        if (mSessionId == sessionId) {
            if (success) {
                Log.d(TAG, "onFinished() 安装成功");
            } else {
                Log.d(TAG, "onFinished() 安装失败");
            }

        }
    }
}
```

## 实现安装的代码

```java
/**
 * 适配android9的安装方法。
 * 全部替换安装
 */
public void installApp(String apkFilePath) {
    Log.d(TAG, "installApp()------->" + apkFilePath);
    File apkFile = new File(apkFilePath);
    if (!apkFile.exists()) {
        Log.d(TAG, "文件不存在");
    }

    PackageInfo packageInfo = getPackageManager().getPackageArchiveInfo(apkFilePath, PackageManager.GET_ACTIVITIES | PackageManager.GET_SERVICES);
    if (packageInfo != null) {
        String packageName = packageInfo.packageName;
        int versionCode = packageInfo.versionCode;
        String versionName = packageInfo.versionName;
        Log.d("ApkActivity", "packageName=" + packageName + ", versionCode=" + versionCode + ", versionName=" + versionName);
    }

    PackageInstaller packageInstaller = getPackageManager().getPackageInstaller();
    PackageInstaller.SessionParams sessionParams
            = new PackageInstaller.SessionParams(PackageInstaller
            .SessionParams.MODE_FULL_INSTALL);
    Log.d(TAG, "apkFile length" + apkFile.length());
    sessionParams.setSize(apkFile.length());

    try {
        mSessionId = packageInstaller.createSession(sessionParams);
    } catch (IOException e) {
        e.printStackTrace();
    }

    Log.d(TAG, "sessionId---->" + mSessionId);
    if (mSessionId != -1) {
        boolean copySuccess = onTransfesApkFile(apkFilePath);
        Log.d(TAG, "copySuccess---->" + copySuccess);
        if (copySuccess) {
            execInstallAPP();
        }
    }
}

/**
 * 通过文件流传输apk
 *
 * @param apkFilePath
 * @return
 */
private boolean onTransfesApkFile(String apkFilePath) {
    Log.d(TAG, "---------->onTransfesApkFile()<---------------------");
    InputStream in = null;
    OutputStream out = null;
    PackageInstaller.Session session = null;
    boolean success = false;
    try {
        File apkFile = new File(apkFilePath);
        session = getPackageManager().getPackageInstaller().openSession(mSessionId);
        out = session.openWrite("base.apk", 0, apkFile.length());
        in = new FileInputStream(apkFile);
        int total = 0, c;
        byte[] buffer = new byte[1024 * 1024];
        while ((c = in.read(buffer)) != -1) {
            total += c;
            out.write(buffer, 0, c);
        }
        session.fsync(out);
        Log.d(TAG, "streamed " + total + " bytes");
        success = true;
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        if (null != session) {
            session.close();
        }
        try {
            if (null != out) {
                out.close();
            }
            if (null != in) {
                in.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
    return success;
}
/**
 * 执行安装并通知安装结果
 *
 */
private void execInstallAPP() {
    Log.d(TAG, "--------------------->execInstallAPP()<------------------");
    PackageInstaller.Session session = null;
    try {
        session = getPackageManager().getPackageInstaller().openSession(mSessionId);
        Intent intent = new Intent(this, InstallResultReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(this,
                1, intent,
                PendingIntent.FLAG_UPDATE_CURRENT);
        session.commit(pendingIntent.getIntentSender());
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        if (null != session) {
            session.close();
        }
    }
}
```

## 静默卸载的代码

```java
/**
 * 根据包名卸载应用
 *
 * @param packageName
 */
public void uninstall(String packageName) {
    Intent broadcastIntent = new Intent(this, InstallResultReceiver.class);
    PendingIntent pendingIntent = PendingIntent.getBroadcast(this, 1,
            broadcastIntent, PendingIntent.FLAG_UPDATE_CURRENT);
    PackageInstaller packageInstaller = getPackageManager().getPackageInstaller();
    packageInstaller.uninstall(packageName, pendingIntent.getIntentSender());
}
```

## 判断安装结果

**其中InstallResultReceiver 使用静态注册 要不然你用动态注册在安装过程中你的应用已经不存在了所以你会搜不到广播**

```xml
<receiver
    android:name=".receiver.InstallResultReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter>
        <action android:name="android.content.pm.extra.STATUS"/>
    </intent-filter>

</receiver>
```

```java
public class InstallResultReceiver extends BroadcastReceiver {
    private static final String TAG = "InstallResultReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        LogUtil.d(TAG, "收到安装反馈广播了");
        if (intent != null) {
            final int status = intent.getIntExtra(PackageInstaller.EXTRA_STATUS,
                    PackageInstaller.STATUS_FAILURE);
            if (status == PackageInstaller.STATUS_SUCCESS) {
                // success
                LogUtil.d(TAG, "APP Install Success!");
                InstallAPP.getInstance().sendInstallSucces();
            } else {
                String msg = intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE);
                LogUtil.e(TAG, "Install FAILURE status_massage" + msg);
                InstallAPP.getInstance().sendFailure(msg);
            }
        }
    }
```

## 添加权限

最后不要忘记添加安装权限 还有文件读写权限

```xml
<!--静默安装权限-->
<uses-permission
    android:name="android.permission.INSTALL_PACKAGES"
    tools:ignore="ProtectedPermissions" />
<!--应用卸载权限-->
<uses-permission android:name="permission.REQUEST_INSTALL_PACKAGES" />
<uses-permission
    android:name="android.permission.DELETE_PACKAGES"
    tools:ignore="ProtectedPermissions" />
```
```xml
<!--读写外部存储权限-->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<!--允许装载和卸载文件系统权限-->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

可参考示例程序完整程序Github地址：https://github.com/sparrowleung/packageInstall
