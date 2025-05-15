---
title: PAI开发配置
date: 2024-08-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 什么是PAI

PAI全名是PlayAuto Install,是Google提供给合作伙伴的一种预置apk的方式。一个自动下载安装APK到手机，并且摆放在Launcher对应位置的一个机制。

这个机制其实对于运营商定制来说非常重要，比如美国的运营商，一个运营商有很多地区很多种类的SIM卡，当插上不同地区的SIM卡，运营商定制的手机就会下载不同的APP摆放在界面不同的位置。

其实主要是要两个APK，一个预装进的Android系统中（stub.apk），一个上传到谷歌的合作伙伴服务器网站上（配置），然后在合作伙伴上进行一些配置就OK了。下面具体介绍这两个APK的制作。

 ![](https://raw.githubusercontent.com/shug666/image/main/images7889ec756ac0afb2f0bedf6b2fa13e61.png)

## PAI流程

本地编译一个PlayAutoInstallConfig.apk，签名上传到APFE服务器，APFE会验证配置信息，并提供给Play商店中。当目标设备第一次开机启动并且联网（现在不必要登录谷歌帐号），这些应用就会加入下载队列，自动下载到手机。

### 申请Google合作账号

需要明确的是，该方案是Google提供给使用GMS的合作伙伴的方案，所以必须要有Google Partner账号。通过Google Partner账号创建自己的产品，并向Google提供该产品会使用的Fingerprint。

### 配置菜单

先聊一下APFE会验证的配置信息。

需要的配置信息包括：

*   指纹（必须）
*   城市（可选）
*   运营商（可选）
*   需要下载的应用程序列表
*   应用在桌面的位置信息

后两项是编译在PlayAutoInstallConfig.apk中的，前三项是把APK上传到服务器时需要填写的。

上传服务器配置页面如下：

![](https://raw.githubusercontent.com/shug666/image/main/imagesd2ab1111eccd97634f84245c393cef65.png)

配置信息的前三项匹配项如果填写，就必须要完全匹配才能应用到手机。我遇到一个问题是配置上传后PlayAutoInstallConfig.apk会在设定精灵过程中下载到手机，但需要Play商店中下载的应用怎么都不下载。后来发现是在上传APK到服务器时运营商填的不对，导致无法下载。因为尝试填写几种运营商名称都不能正常工作，最后解决方案是只匹配指纹，不匹配城市和运营商（减少过滤项），这样手机就可以和Play商店中信息匹配，然后就可以自动下载了。

关于其余配置，参考下面表格：

![](https://raw.githubusercontent.com/shug666/image/main/images9259ba7fc191929bd3b48bf661283e56.png)

下面具体放代码：分为2个APK，一个是预装手机的APK（stub.apk）一个是放到服务器的APK（config.apk）

## MK文件

```makefile
# Android.mk
LOCAL_PATH:=$(call my-dir)

# Stub APK
include $(CLEAR_VARS)
apk_variant:=
APK_VERSION:=1
include $(LOCAL_PATH)/build_apk.mk

#wifi config apk
include $(CLEAR_VARS)
apk_variant:=wifi
APK_VERSION:=1002
include $(LOCAL_PATH)/build_apk.mk

# build_apk.mk
LOCAL_MODULE_TAGS:=optional
LOCAL_SDK_VERSION:=current

ifeq ($(apk_variant),)
LOCAL_PACKAGE_NAME:=LenovoPAl
LOCAL_RESOURCE_DIR:=$(LOCAL_PATH)/res
LOCAL_FULL_MANIFEST_FILE:=$(LOCAL PATH)/stub/AndroidManifest.xml
else
LOCAL_PACKAGE_NAME:=LenovoPAl-$(apk_variant)
LOCAL_RESOURCE_DIR:=$(LOCAL_PATH)/res-$(apk_variant)
endif

# We don't have other java source files.
LOCAL_SOURCE_FILES_ALL_GENERATED:=true
LOCAL_PROGUARD_ENABLED:=disabled
LOCAL_CERTIFICATE:=shared

LOCAL_AAPT_FLAGS+=--version-name $(APK VERSION) --version-code $(APK VERSION)
include $(BUILD_PACKAGE)
```

## 资源路径

![image-20240821105709780](https://raw.githubusercontent.com/shug666/image/main/imagesimage-20240821105709780.png)

**stub.apk**
------------

手机内必须要先预置一个符合下列条件的stub APK：

*   为一个系列的设备设置唯一的包名，其中包名前缀必须为`android.autoinstalls.config`
*   必须配置一个接收器`android.autoinstalls.config.action.PLAY_AUTO_INSTALL`，并且设置`android:exported="false"`
*   在预置的应用程序里只能有一个定义这个接收机
*   versionCode必须定义为1
*   APK必须预置在`/system /app`（不能定义成特权，即不能放`/priv-app`）
*   必须用私有key进行签名(禁止test keys 签名；不建议 platform keys进行签名)
*   不能定义权限/活动/其他接收者/内容提供者/服务

### AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="android.autoinstalls.config.Lenovo.tablet"> <!--这里的Lenovo代表厂商，tablet 代表项目，除此之外的部分不能改动
versionCode和versionName一定要一样，并且为1,在Android mk中已设置versionCode和versionName为1，因此此处可以不需要设置--> 

    <uses-sdk android:minSdkVersion="16"/> 
    
    <application
        android:label="@string/app_name"
        android:allowBackup="false">
        
        <receiver
            android:name="DummyReceiver"
            android:exported="false">
            <intent-filter>
                <action android:name="android.autoinstalls.config.action.PLAY_AUTO_INSTALL"/>
            </intent-filter>
        </receiver>
    </application>
</manifest>
```

### string.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Lenovo_PAI</string>
</resources>
```

### 编译资源

- `res/values/string.xml`
- `Stub/AndroidManifest.xml`
- `Android.mk`
- `Build_apk.mk`

**config.apk**
--------------

这个APK是我们真正配置的APK。

它和前面的APK的关系是：包名一致因为PAI机制需要本地存在一个这个包名的APK，在开机的设定精灵阶段，（如果联网）它会从服务器下载这个写有对应配置的APK到手机上，替换掉那个Stub APK。

关于PAIconfig APK的配置：

*   上传的APK（也就是我们编出来的APK）包名与指纹要和存根一致
*   APK（与stub apk）签名要一致
*   和存根配置同样的接收器
*   versionCode必须大于1000
*   APK必须包含启动布局配置的XML文件（即后面会提到的default\_layout），不然上传会失败，因为上传前会检查这个XML文件，然后会把要下载的应用程序显示出来。所以也必须要求至少定义一个需要下载的app。最多50个，建议放10~15个。（文档还要求autoinstall的应用必须在launcher上指定摆放位置）
*   界面会有文件夹，文件夹名称字符串在APK本地资源定义，支持国际化。
*   需要自动下载的APK对设备来讲必须是在Play商店中发布的，并且对该地区用户可见
*   不能定义权限/活动/其他接收者/内容提供者/服务
*   requiredPreload的意思是：是否必须安装。影响到应用是否可选择性安装
*   installByDefault的意思是：是否默认选择。影响到是否提前选择安装。这个标签的应用在未下载安装时图标会显示为灰色

### AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="android.autoinstalls.config.Lenovo.tablet">
    
    <uses-sdk android:minSdkVersion="16"/>
    
    <application
        android:label="@string/app_name"
        android:icon="@drawable/ic_launcher"
        android:hasCode="false"
        android:allowBackup="false">
        
        <receiver
            android:name="DummyReceiver"
            android:exported="false">
            <intent-filter>
                <action android:name="android.autoinstalls.config.action.PLAY_AUTO_INSTALL"/>
            </intent-filter>
        </receiver>
    </application>
</manifest>
```

### default\_layout.xml   

选择要安装的apk，把他们的包名拿到，然后在这个文件中配置

```xml
<?xml version="1.0" encoding="utf-8"?>
<workspace>
    <appwidget
        className="com.android.alarmclock.DigitalAppWidgetProvider"
        packageName="com.google.android.deskclock"
        screen="1"
        spanX="4"
        spanY="1"
        x="1"
        y="-3"/>
    <appwidget
        className="com.google.android.googlequicksearchbox.SearchWidgetProvider"
        packageName="com.google.android.googlequicksearchbox"
        screen="1"
        spanX="4"
        spanY="1"
        x="1"
        y="-2"/>
    <folder
        screen="1"
        title="@string/folder_google_title"
        x="0"
        y="3">
        <appicon
            className="com.google.android.gm.ConversationListActivityGmail"
            packageName="com.google.android.gm"/>
        <appicon
            className="com.google.android.maps.MapsActivity"
            packageName="com.google.android.apps.maps"/>
        <appicon
            className="com.google.android.apps.docs.app.NewMainProxyActivity"
            packageName="com.google.android.apps.docs"/>
        <appicon
            className="com.google.android.apps.youtube.music.activities.MusicActivity"
            packageName="com.google.android.apps.youtube.music"/>
        <appicon
            className="com.google.android.videos.GoogleTvEntryPoint"
            packageName="com.google.android.videos"/>
        <appicon
            className="com.google.android.youtube.videos.EntryPoint"
            packageName="com.google.android.videos"/>
        <appicon
            className="com.android.contacts.activities.PeopleActivity"
            packageName="com.google.android.contacts"/>
        <appicon
            className="com.google.vr.apps.ornament.app.lens.LensLauncherActivity"
            packageName="com.google.ar.lens"/>
        <appicon
            className="com.android.calculator2.Calculator"
            packageName="com.google.android.calculator"/>
        <appicon
            className="com.android.deskclock.DeskClock"
            packageName="com.google.android.deskclock"/>
        <appicon
            className="com.google.android.apps.nbu.files.home.HomeActivity"
            packageName="com.google.android.apps.nbu.files"/>
        <appicon
            className="com.google.android.keep.activities.BrowseActivity"
            packageName="com.google.android.keep"/>
        <appicon
            className="com.google.android.apps.books.app.BooksActivity"
            packageName="com.google.android.apps.books"/>
        <appicon
            className="com.google.android.gms.games.ui.destination.main.MainActivity"
            packageName="com.google.android.play.games"/>
        <appicon
            className="com.google.android.apps.youtube.kids.browse.SplashScreenActivity"
            packageName="com.google.android.apps.youtube.kids"/>
        <autoinstall
            className="com.google.android.apps.subscriptions.red.LauncherActivity"
            installByDefault="true"
            packageName="com.google.android.apps.subscriptions.red"
            requiredPreload="true"/>
        <autoinstall
            className="com.google.android.apps.docs.app.NewMainProxyActivity"
            installByDefault="true"
            packageName="com.google.android.apps.docs.editors.docs"
            requiredPreload="true"/>
        <autoinstall
            className="com.google.android.apps.docs.app.NewMainProxyActivity"
            installByDefault="true"
            packageName="com.google.android.apps.docs.editors.sheets"
            requiredPreload="true"/>
        <autoinstall
            className="com.google.android.apps.docs.app.NewMainProxyActivity"
            installByDefault="true"
            packageName="com.google.android.apps.docs.editors.slides"
            requiredPreload="true"/>
        <autoinstall
            className="com.google.android.apps.chromecast.app.DiscoveryActivity"
            installByDefault="true"
            packageName="com.google.android.apps.chromecast.app"
            requiredPreload="true"/>
    </folder>
    <appicon
        className="com.google.android.apps.tachyon.MainActivity"
        packageName="com.google.android.apps.tachyon"
        screen="1"
        x="1"
        y="3"/>
    <appicon
        className="com.google.android.youtube.app.honeycomb.Shell$HomeActivity"
        packageName="com.google.android.youtube"
        screen="1"
        x="2"
        y="3"/>
    <appicon
        className="com.netflix.mediaclient.ui.launch.UIWebViewActivity"
        packageName="com.netflix.mediaclient"
        screen="1"
        x="3"
        y="3"/>
    <appicon
        className="com.zui.notes.main.home.MainActivity"
        packageName="com.zui.notes"
        screen="1"
        x="4"
        y="3"/>
    <appicon
        className="com.tblenovo.center.SplashActivity"
        packageName="com.tblenovo.center"
        screen="1"
        x="5"
        y="3"/>
    <folder
        screen="2"
        title="@string/folder_microsoft"
        x="0"
        y="3">
        <autoinstall
            className="com.microsoft.office.officesuite.OfficeSuiteActivity"
            installByDefault="true"
            packageName="com.microsoft.office.officehubrow"
            requiredPreload="true"/>
        <autoinstall
            className="com.microsoft.office.onenote.ui.ONMSplashActivity"
            installByDefault="true"
            packageName="com.microsoft.office.onenote"
            requiredPreload="true"/>
    </folder>
    <autoinstall
        className="com.google.commerce.tapandpay.android.cardlist.CardListActivity"
        installByDefault="true"
        packageName="com.google.android.apps.walletnfcrel"
        requiredPreload="true"
        screen="2"
        x="1"
        y="3"/>
    <autoinstall
        className="com.google.apps.dots.android.app.activity.CurrentsStartActivity"
        installByDefault="true"
        packageName="com.google.android.apps.magazines"
        requiredPreload="true"
        screen="2"
        x="2"
        y="3"/>
    <autoinstall
        className="com.google.android.apps.podcasts.PodcastsActivity"
        installByDefault="true"
        packageName="com.google.android.apps.podcasts"
        requiredPreload="true"
        screen="2"
        x="3"
        y="3"/>
    <appicon
        className="com.android.calendar.AllInOneActivity"
        packageName="com.google.android.calendar"
        screen="2"
        x="4"
        y="3"/>
    <appicon
        className="com.google.android.googlequicksearchbox.SearchActivity"
        container="hotseat"
        packageName="com.google.android.googlequicksearchbox"
        rank="0"/>
    <appicon
        className="com.google.android.apps.messaging.dittosatellite.impl.DittoWebActivity"
        container="hotseat"
        packageName="com.google.android.apps.messaging"
        rank="1"/>
    <appicon
        className="com.google.android.apps.chrome.Main"
        container="hotseat"
        packageName="com.android.chrome"
        rank="2"/>
    <appicon
        className="com.google.android.apps.googleassistant.AssistantActivity"
        container="hotseat"
        packageName="com.google.android.apps.googleassistant"
        rank="3"/>
    <appicon
        className="com.android.vending.AssetBrowserActivity"
        container="hotseat"
        packageName="com.android.vending"
        rank="4"/>
    <appicon
        className="com.google.android.apps.photos.home.HomeActivity"
        container="hotseat"
        packageName="com.google.android.apps.photos"
        rank="5"/>
</workspace>
```

### auto_install.xml

```xml
/*auto_install.xml*/
<install>
    <!-- 不显示在桌面的应用 -->
    <backgroundautoinstall
    classname="com.spotify.music.main"
    packageName="com.spotify.music"
    requiredPreload="false"
    installByDefault="false"
    groupId="1"/>
    
    <!-- 分组 -->
    <autoinstallgrouplist>
    <installgroup groupId="0" type="GOOGLE" />
    <installgroup groupId="1" type="OEM" />
    <installgroup groupId="2" type="CARRIER">
    </autoinstallgrouplist>
</install>
```

## 需要提供的材料

1）Fingerprint

ro.build.fingerprint

2）CTS报告

当前带有系统集成的config apk的设备版本，跑CTS，将pass的报告取出（这里可以采用单项报告） 

3）config apk

这里的config apk是用来在线更新设备预置的stub apk

4）Other

这里是统称，包括ZeroRating/country/carrier 等 

## GooglePartner网站配置

1. 登录GooglePartner

   ![](https://raw.githubusercontent.com/shug666/image/main/imageswps2k9XNN.jpg)

2. 进入Android Device Configuration  

3.  进入产品详情页，

    Configurations栏就是创建config的地方。点击右上的create new 可以创建新的配置，创建完成后需要

    点击publish发布。

4. 创建配置 

   ![](https://raw.githubusercontent.com/shug666/image/main/imageswpsEgj8lO.jpg)

上图就是一个用来测试的config选项。

Device Configuration APK是我们上传的，在前文中创建的config.apk。

其中Configuration Name是选项的名字，Fingerprint是手机的属性，Metadata中除了Fingerprint还有

Country和Carriers，分别限定了国家和运营商，如果不知道选哪一项，可以去下面的网页查询。 

| **查询运营商**                                               |
| ------------------------------------------------------------ |
| ![](https://raw.githubusercontent.com/shug666/image/main/imageswpsjz5VRO.jpg) |

| **配置国家和运营商**                                         |
| ------------------------------------------------------------ |
| ![](https://raw.githubusercontent.com/shug666/image/main/imageswpse9yJnP.jpg) |

hardware ID栏可以选择添加hardware number 和serial number。

这里有一个Zero-Rating选项，如果选了会导致这些应用默认通过数据连接也可以下载。

 

本文转自 [https://blog.csdn.net/yangbin0513/article/details/83825951](https://blog.csdn.net/yangbin0513/article/details/83825951)，如有侵权，请联系删除。