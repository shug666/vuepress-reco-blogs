---
title: Settings PreferenceScreen条目隐藏实现
date: 2025-04-25
tags:
 - android
categories: 
 - android
sticky: 
   true 
---

## 一、前言

Android 原生设置Settings应用很多界面都是使用xml的PreferenceScreen形式进行显示，PreferenceScreen 里面包含很多条目，如果要隐藏某个条目就要修改xml或者Java代码，  有些情况修改xml是无效的，修改Java代码才有作用。

本文简单记录一下Settings PreferenceScreen 某个条目隐藏实现。

网上百度到的像View那样隐藏item的代码肯定是不对的，这种 Preference 代码的显示和隐藏使用的是View的那套。

上面百度生成的答案是错误的参考示例。  

具体实现下面有分析讲解。

## 二、隐藏实现

已原生Android14 Settings的某个xml和相关Java文件做讲解。

### 1、xml 文件中隐藏PreferenceScreen 的某个条目

wifi设置里面的“网络偏好设置”的xml 布局：  

`Settings\res\xml\wifi_configure_settings.xml`

```xml
<PreferenceScreen
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:settings="http://schemas.android.com/apk/res-auto"
    android:title="@string/wifi_configure_settings_preference_title">

    <SwitchPreference
        android:key="enable_wifi_wakeup"
        android:title="@string/wifi_wakeup"
        android:icon="@drawable/ic_auto_wifi"
        android:summary="@string/wifi_wakeup_summary"
        settings:isPreferenceVisible="false"
        settings:controller="com.android.settings.wifi.WifiWakeupPreferenceController"/>

...
    <SwitchPreference
        android:isPreferenceVisible="false"
        android:key="ethernet_turn_off"
        android:summary="ethernet info"
        android:title="ethernet_turn_off" />

    <Preference
        android:key="install_credentials"
        settings:isPreferenceVisible="false"
        android:title="@string/wifi_install_credentials"/>

    <Preference
        android:key="wifi_direct"
        settings:isPreferenceVisible="false"
        android:title="@string/wifi_menu_p2p"
        android:fragment="com.android.settings.wifi.p2p.WifiP2pSettings" />

</PreferenceScreen>
```

上面的条目都添加了隐藏代码：

```xml
settings:isPreferenceVisible="false"
```

**但是实际上只有 ethernet\_turn\_off 和 install\_credentials 会隐藏，其他的条目设置后是没有作用的。**

所以xml中直接写隐藏实现，是不一定有用的，实际项目中需要查看Java代码中有没有对其进行控制。

查看一下Java实现代码发现要做如下修改才能隐藏相关条目：

### 2、普通Preference条目的隐藏的Java代码实现

"WLAN直连"选项：

```java
public class WifiP2pPreferenceController extends AbstractPreferenceController {
    private static final String KEY_WIFI_DIRECT = "wifi_direct";
    @Override
    public boolean isAvailable() {
        return false; //false 是不可见
    }
}
```

AbstractPreferenceController 是 androidx.preference.Preference 原生的，实现 isAvailable() 方法即可决定该条目的隐藏和显示。

### 3、SwitchPreference条目的隐藏的Java代码实现

"自动开启WLAN"选项：

```java
public class WifiWakeupPreferenceController extends TogglePreferenceController {

    private static final String KEY_ENABLE_WIFI_WAKEUP = "enable_wifi_wakeup";

    @Override
    public int getAvailabilityStatus() {
        //set visible false change by liwenzhi
        if (true) {
            return DISABLED_FOR_USER; //不可见
        }
        return AVAILABLE; //可见
    }

}
```

TogglePreferenceController 是 Settings自定义的，实现 getAvailabilityStatus() 方法即可决定该条目的隐藏和显示。

### 4、查找 Preference 对应Java代码的思路

xml 中 Preference 主要代码：

```xml
<XXXPreference
    android:key="keyName"
    .../>
```

每个 Preference 都是要定义key 的，Java代码所以Java代码中要找到这个 Preference ，就要通过这个keyName ，类似findViewById那样。

所以控制这个 Preference 的Java 代码，肯定会定义对应的keyName。

而找到这个 Preference 也是可以手动对其进行隐藏或者显示的。

```java
SwitchPreference switchPreference = (SwitchPreference) findPreference("ethernet_turn_off");
switchPreference.setVisible(false);//true是显示，false是隐藏
```

### 三、其他

#### 1、Preference 条目的隐藏的思路

（1）查看Java代码中有没有控制 Preference 的显示和隐藏

```java
1、查看对于的控制类有没有 isAvailable() 方法的实现
2、查看对应的控制类有没有 getAvailabilityStatus() 方法的实现
3、查看对应的控制类没有直接控制 setVisible 方法的调用
```

（2）如果Java代码没有控制直接在xml中修改即可

```java
settings:isPreferenceVisible="false"
```

如果需要自己属性控制隐藏显示的，那么也是只能在Java代码中控制。

简单的说就是xml修改显示隐藏不一定生效，主要还是要看Java 是否控制。

#### 2、Android Preference简单介绍

```java
PreferenceScreen和SwitchPreference 简单示例
相关demo代码示例
（1）SettingsActivity.Java
（2）layout\settings_activity.xml
（3）xml\root_preferences.xml
（4）build.gradle
（5）示例demo效果：
```

相关链接：

[https://blog.csdn.net/wenzhi20102321/article/details/136902514](https://blog.csdn.net/wenzhi20102321/article/details/136902514)

 

  

本文转自 [https://blog.csdn.net/wenzhi20102321/article/details/140360299](https://blog.csdn.net/wenzhi20102321/article/details/140360299)，如有侵权，请联系删除。