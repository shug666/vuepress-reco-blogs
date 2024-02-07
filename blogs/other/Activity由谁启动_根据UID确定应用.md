---
title: Activity由谁启动，根据UID确定应用
date: 2024-01-09
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 过滤AMS启动信息

最近在帮忙定位一个问题，涉及到某个应用自动启动了，为了确定是谁调用的，使用如下的日志进行查看（注：为了简单考虑，下面的启动者为launcher）

```shell
(pre_release|✔) % adb logcat | grep -E "ActivityManager: START" --color=always
I ActivityManager: START u0 {act=android.intent.action.MAIN
cat=[android.intent.category.HOME] flg=0x10000000 hwFlg=0x10
cmp=com.huawei.android.launcher/.unihome.UniHomeLauncher (has extras)} from uid 10070
```

我们看最后看到这个`from uid 10070`，嗯，基本定位到了是这个uid的应用启动了。

## 根据UID确认应用

### android调试时查询

1. 当启动camera的时候，ActivityManager的log如下，uid显示10138

   ```shell
   02-26 14:02:32.115 1965 2066 I ActivityManager: START u0 {act=android.media.action.STILL_IMAGE_CAMERA flg=0x14000000 cmp=com.android.camera/.Camera} from uid 10138 on display 0
   ```

2. 那么10138到底是哪个应用呢，我们可以通过拉取packages.list文件进行查看`adb pull /data/system/packages.list` 
3. 拉出packages.list文件后查看发现如下`com.android.systemui 10138 0 /data/user_de/0/com.android.systemui`

   所以是systemUI启动的camera。

### android代码里获取

1. `int callingUid = Binder.getCallingUid();`

2. `String packageName = snapshotComputer().getNameForUid(callingUid);`

   *（注：uid是应用的调用id，android的沙盒机制产生的。一般每个应用的uid不一样、也有可能一样比如都是Process.SYSTEM_UID，uid和gid可以从data/user/0/中ls-l 看到）*

## UID的生成

确定uid不能说明问题，我们至少需要确定是哪个应用，我们尝试使用下面的命令过滤进程有关数据

```shell
adb shell ps | grep 10070
没有任何数据输出
```

然而一无所获。

当然前面说了，示例的启动者是launcher，那我们过滤一下launcher

```shell
adb shell ps | grep launcher
u0_a70        2207   620 4979992 156312 0                   0 S com.huawei.android.launcher
```

我们发现了u0\_a70和10070貌似有一些关联（至少都含有70）

于是我们使用下面的命令确定id

```shell
adb shell id u0_a70
uid=10070(u0_a70) gid=10070(u0_a70) groups=10070(u0_a70), context=u:r:shell:s0
```

果然，u0\_a70和10070 是有关联的

u0\_a70 的含义  

u0 默认的手机第一个用户（可以通过设置里面的多用户新增和切换）  

a 代表app  

70 代表着第70个应用  

转换公式  

简单而言，对应的公式是这样

u0\_a70 = “u0\_” + “a” + (uid(这里是10070) – FIRST\_APPLICATION\_UID(固定值10000))

具体复杂的转换，请参考这段代码

```java
/**
     * Generate a text representation of the uid, breaking out its individual
     * components -- user, app, isolated, etc.
     * @hide
     */
    public static void formatUid(StringBuilder sb, int uid) {
        if (uid < Process.FIRST_APPLICATION_UID) {
            sb.append(uid);
        } else {
            sb.append('u');
            sb.append(getUserId(uid));
            final int appId = getAppId(uid);
            if (isIsolated(appId)) {
                if (appId > Process.FIRST_ISOLATED_UID) {
                    sb.append('i');
                    sb.append(appId - Process.FIRST_ISOLATED_UID);
                } else {
                    sb.append("ai");
                    sb.append(appId - Process.FIRST_APP_ZYGOTE_ISOLATED_UID);
                }
            } else if (appId >= Process.FIRST_APPLICATION_UID) {
                sb.append('a');
                sb.append(appId - Process.FIRST_APPLICATION_UID);
            } else {
                sb.append('s');
                sb.append(appId);
            }
        }
    }
```

部分常量

```java
   /**
     * Defines the start of a range of UIDs (and GIDs), going from this
     * number to {@link #LAST_APPLICATION_UID} that are reserved for assigning
     * to applications.
     */
    public static final int FIRST_APPLICATION_UID = 10000;
    /**
     * Last of application-specific UIDs starting at
     * {@link #FIRST_APPLICATION_UID}.
     */
    public static final int LAST_APPLICATION_UID = 19999;
    /**
     * First uid used for fully isolated sandboxed processes (with no permissions of their own)
     * @hide
     */
    @UnsupportedAppUsage
    @TestApi
    public static final int FIRST_ISOLATED_UID = 99000;
     /**
     * First uid used for fully isolated sandboxed processes spawned from an app zygote
     * @hide
     */
    @TestApi
    public static final int FIRST_APP_ZYGOTE_ISOLATED_UID = 90000;
```



本文转自 [https://www.jianshu.com/p/be03b2e1b979](https://www.jianshu.com/p/be03b2e1b979)，如有侵权，请联系删除。
