---
title: 自定义Preference讲解
date: 2024-08-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## Preference 简单介绍

*   Android Preference 是一种可以在Android应用程序中使用的预设用户界面组件，
    
    用于在应用程序中提供一致且易于使用的界面，用于设置和配置应用程序的各个部分。
    
*   Android Preference提供了几种不同类型的偏好设置，包括复选框、单选按钮、开关和滑块等。
    
    这些偏好设置可以轻松添加到应用程序的用户界面中，并可以使用Android提供的预设样式和布局进行自定义。  
    要在Android应用程序中使用Preference，您需要在应用程序的XML资源文件中定义每个偏好设置的首选项元素。
    
    每个首选项元素都具有唯一的键和显示给用户的值。
    
    当用户更改任何偏好设置时，Android会自动保存更改，并在用户下次启动应用程序时恢复它们。
    

Android SharePreference 可以保存配置文件到apk数据目录下的xml文件中。

Android Preference 和 SharePreference 的关系在于，当用户通过 Android Preference 用户界面更改设置时，这些更改会保存在 SharePreference 中。

Android Preference 使用 SharePreference 存储和检索每个设置的值。

当用户再次打开应用程序时，Android Preference 会从 SharePreference 中检索先前保存的设置值，并相应地更新用户界面。

简单的说Android的Preference就是一个组件或者一个框架，它能自动记忆某个开关按钮的状态，

比如不加任何Java代码控制的情况，写一个SwitchPreference开关，开关状态改变后后，

退出应用，下次打开应用就会显示上次应用关闭前的开关的状态。

Android Preference 对于 Android 应用程序的开发具有重要的意义，

因为它提供了一种创建一致且易于使用的设置界面的便捷方式。

通过使用 Android Preference，开发人员可以快速为应用程序

的不同设置和配置创建一个熟悉的用户界面，而无需从头开始编写自定义代码。

## AS demo代码示例

1、在Android Studio创建一个Preference项目

Android Studio -->File -->New -->new Project -->Settings Activity

创建好的项目就会有一个xml文件，这个文件专门就是放Preference布局的文件。

这个是Android Studio 创建的Settings 类型应用代码，里面就包含了一个Java文件，调试运行很方便。

并且手动添加了一个 SwitchPreference开关，在Java代码里面添加了监听事件。

具体代码如下：

### SettingsActivity.Java

```java
package com.demo.settings;

import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.View;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.preference.Preference;
import androidx.preference.PreferenceFragmentCompat;
import androidx.preference.SwitchPreference;

public class SettingsActivity extends AppCompatActivity {

    private static final String TAG = "SettingsActivity";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.settings_activity);
        if (savedInstanceState == null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.settings, new SettingsFragment())
                    .commit();
        }
    }


    public static class SettingsFragment extends PreferenceFragmentCompat {
        @Override
        public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
            setPreferencesFromResource(R.xml.root_preferences, rootKey);
            //监听switch开关的状态
            SwitchPreference  switchPreference = (SwitchPreference) findPreference("ethernet_turn_off");
            switchPreference.setOnPreferenceChangeListener(new Preference.OnPreferenceChangeListener() {
                @Override
                public boolean onPreferenceChange(Preference preference, Object newValue) {
                    boolean isCheck = (boolean) newValue;
                    Log.i(TAG, "onPreferenceChange preference = " + preference + ", isCheck = " + isCheck);
                    return true;
                }
            });
            switchPreference.setSummary("IP：XXX");//副标题，在标题下方，也可以设置空字符串
        }


    }
}
```

这里可以看到是使用了一个Preference相关的Fragment放置布局显示。

之前的layout布局要么不用，要么用来放Preference对应的的Fragment。  
其实我研究Preference 就是为了添加一个开关：SwitchPreference

### settings\_activity.xml

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <FrameLayout
        android:id="@+id/settings"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</LinearLayout>
```

### root\_preferences.xml

```xml
<PreferenceScreen xmlns:app="http://schemas.android.com/apk/res-auto">

    <PreferenceCategory app:title="@string/messages_header">

        <EditTextPreference
            app:key="signature"
            app:title="@string/signature_title"
            app:useSimpleSummaryProvider="true" />

        <ListPreference
            app:defaultValue="reply"
            app:entries="@array/reply_entries"
            app:entryValues="@array/reply_values"
            app:key="reply"
            app:title="@string/reply_title"
            app:useSimpleSummaryProvider="true" />

    </PreferenceCategory>

    <PreferenceCategory app:title="@string/sync_header">

        <SwitchPreferenceCompat
            app:key="sync"
            app:title="@string/sync_title" />

        <SwitchPreferenceCompat
            app:dependency="sync"
            app:key="attachment"
            app:summaryOff="@string/attachment_summary_off"
            app:summaryOn="@string/attachment_summary_on"
            app:title="@string/attachment_title" />

    </PreferenceCategory>

    <SwitchPreference
        app:key="ethernet_turn_off"
        app:title="ethernet_turn_off"
        app:summary="ethernet info"/>

</PreferenceScreen>
```

### build.gradle

```java
dependencies {
    implementation 'androidx.appcompat:appcompat:1.1.0'
    implementation 'com.google.android.material:material:1.1.0'
    implementation 'androidx.preference:preference:1.1.1' //Preference的依赖包
}
```

关键就是要依赖preference的包。

### Android.bp

Android 系统源码中Android.bp填入的包：

```makefile
    static_libs: [
        "androidx-constraintlayout_constraintlayout",
        "androidx.preference_preference", //Preference的依赖包
        ...],
```

### 示例demo效果：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesfb9b1cf0d16800866a9e4d58e6fc8f4f.gif)

上面demo代码使用到的控件简单介绍：

- PreferenceScreen：xml布局界面的根属性

- PreferenceCategory：类似layout里面的LinearLayout

- EditTextPreference ：输入框组件，只在布局文件里面定义，点击条目就可以弹框输入内容，确认后显示在点击的条目上；

- ListPreference：列表选择组件，只在布局文件里面定义，点击条目就可以弹框列表内容，确认后显示在点击的条目上；

- SwitchPreference： 提供开关按钮功能的组件

- SwitchPreferenceCompat： 提供开关按钮功能的组件，是后来随AndroidX Preference库引入的；

- SwitchPreference和SwitchPreferenceCompat用法是完全一样的，最新的Preference库也是包含SwitchPreference的；

- 对于Android新版本比如Android13，SwitchPreferenceCompat兼容性会好一点。


示例demo只是演示效果，很多其他相关的组件可以自己调试研究。

## Preference小结

*   Android的Preference是一组预设的UI组件，可以让开发者轻松地在应用程序中实现设置界面。
*   它包括各种类型的设置项，如开关、滑动条、单选按钮等。

### 主要的Preference组件：

```wiki
(1) PreferenceScreen：根节点，代表一个偏好设置的屏幕。它是其他Preference组件的容器。
(2) EditTextPreference：允许用户输入文本值的偏好设置。
(3) CheckBoxPreference（在新版中被`SwitchPreferenceCompat`替代）：提供一个开关按钮供用户开启或关闭某个设置。
(4) SwitchPreferenceCompat：与CheckBoxPreference功能类似，提供一个滑动开关供用户切换设置。
(5) ListPreference：显示一个选择列表，用户可以从中选择一个选项作为设置。
(6) MultiSelectListPreference：允许用户从列表中选择多个选项。
(7) PreferenceCategory：用于将偏好设置分组的类别标题。
(8) PreferenceFragmentCompat：一个Fragment，用于在其内部显示一个偏好设置的屏幕。
```

### 与Android Preference相关的开发内容：

```wiki
1. 使用PreferenceFragment实现设置界面：
	PreferenceFragment是Android支持库中提供的一种用于实现设置界面的Fragment。
	通过继承PreferenceFragment类并重写onCreatePreferences方法，可以轻松地创建设置界面。

2. 使用PreferenceScreen配置设置项：
   PreferenceScreen是AndroidManifest.xml文件中的一个元素，用于配置应用程序的设置项。
   通过在PreferenceScreen元素中添加不同的元素，可以实现不同类型的设置项。

3. 使用SharedPreferences存储设置数据：
   SharedPreferences是Android中提供的一种轻量级的存储方式，用于存储应用程序的设置数据。
   通过调用PreferenceFragment类中的getSharedPreferences方法，
   可以获取到SharedPreferences对象，并通过编辑器进行数据的读写操作。

4. 使用Preference.OnPreferenceClickListener监听设置项点击事件：
	通过为设置项设置OnPreferenceClickListener监听器，可以在用户点击设置项时执行相应的操作。

5. 使用Preference.OnPreferenceChangeListener监听设置项变化事件：
	通过为设置项设置OnPreferenceChangeListener监听器，可以在用户修改设置项的值时执行相应的操作。
	
   总之，Android的Preference为开发者提供了一种方便快捷的方式来实现应用程序的设置界面，
   通过组合不同的元素和监听器，可以实现丰富的设置项功能。
```

### `Preference` 标签属性及其含义

在Android开发中，`Preference` 是用于构建设置界面的一种简便方法。

它允许开发者以声明式的方式在XML文件中定义设置项，而不是手动创建UI。

每个 `Preference` 标签代表一个设置项，并且有多种属性来定义其行为和外观。

比如下面这个 PreferenceCategory 包含了很多标签属性：

```xml
<PreferenceCategory
        android:key="multi_network_header"
        android:title="@string/summary_placeholder"
        android:layout="@layout/preference_category_no_label"
        settings:allowDividerBelow="true"
        android:order="-40"
        settings:controller="com.android.settings.network.MultiNetworkHeaderController"/>
```

每个Preference 条目都有一些属性，那么这些属性的含义是什么呢？

以下是一些常见的 `Preference` 标签属性及其含义：

```
1. key: 这个属性定义了偏好设置的唯一标识符。通过这个键，你可以在代码中检索或更新偏好设置的值。
2. title: 设置项的标题，这是用户在设置界面看到的文本。
3. summary: 设置项的摘要或描述，显示在标题下方，用于提供更多关于设置项的信息。
4. defaultValue: 定义设置项的默认值。当应用第一次运行，且用户尚未更改过该设置时，将使用此默认值。
5. widgetLayout: 允许开发者为偏好设置项指定一个自定义的布局。
6. dependency: 这个属性使当前偏好设置依赖于另一个偏好设置的值。
例如，如果一个偏好设置项被禁用，直到另一个特定的偏好设置被激活/选中。
7. enabled: 控制偏好设置是否可用。默认为 true，即默认情况下是启用状态。
8. selectable: 控制偏好设置项是否可以被选中。默认为 true。
9. icon: 给设置项指定一个图标，以增加可识别性。
10. fragment: 指定当偏好设置被选中时，应该启动的Fragment的全名。这对于构建多层次的设置界面很有用。
```

上面只是一些主要标签属性，不同的组件还有不同的标签属性。

上面只是介绍了 Preference 的一些简单知识，入门是没有问题的；

但是狗歌开发的Settings会那么简单吗？

Preference相关组件除了Androidx的包定义那些类，

在Settings应用里面还用到了一些的SettingsLib包中自定义的Preference组件，如需要的请自行研究的。 



## 自定义Preference

## 原机效果图

![](https://raw.githubusercontent.com/shug666/image/main/images402aa900521069487a5efa8335303bca.png)

第一个Preference的UI布局：类似于设置模块中的RadioButtonPreference, 左边是一个标题，右侧是一个RadioButton

第二个Preference的UI布局：上面是一个导航样式图片，下面是一个文本演示，点击会跳转到另一个演示动画效果的界面

## UI布局代码

### 第一个Preference布局

 第一个Preference的 layout 布局图, 里面的颜色，字体大小属性值都可以自己去适配

```xml
<!-- 1. layout布局文件： navigation_title_preference.xml -->
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" android:layout_height="58dp"
    android:background="@drawable/navigation_preference_bg">

    <TextView
        android:id="@+id/navigation_type_title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentLeft="true"
        android:layout_marginLeft="16dp"
        android:layout_centerInParent="true"
        android:textSize="16sp"
        android:textColor="#FF000000"/>

    <RadioButton
        android:id="@android:id/checkbox"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentRight="true"
        android:layout_marginRight="30dp"
        android:layout_centerInParent="true"
        android:focusable="false"
        android:clickable="false"/>

</RelativeLayout>

<!-- 2.drawable navigation_preference_bg -->
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="false"      android:drawable="@drawable/navi_pressed_false"/>
    <item android:state_pressed="true"  
android:drawable="@drawable/navi_pressed_true"/>
</selector>


<!-- 3. drawable  navi_pressed_false -->
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="@color/search_bar_background" />
    <corners android:radius="9dp" />
</shape>


<!-- 4. drawable  navi_pressed_true -->
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="#1a000000" />
    <corners android:radius="9dp" />
</shape>
```

### 第二个Preference布局

```xml
<!-- layout 布局文件：navigation_preference.xml -->
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" android:layout_height="155dp"
    android:background="@drawable/navigation_preference_bg">
    <RelativeLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <ImageView
            android:id="@+id/navigation_type_icon"
            android:layout_marginTop="26dp"
            android:layout_width="240dp"
            android:layout_height="70dp"
            android:layout_centerHorizontal="true"/>

        <TextView
            android:id="@+id/demonstration_effect"
            android:layout_width="90dp"
            android:layout_height="34dp"
            android:layout_below="@id/navigation_type_icon"
            android:layout_marginTop="16dp"
            android:layout_marginBottom="9dp"
            android:background="@drawable/navigation_preference_bg"
            android:gravity="center"
            android:layout_centerHorizontal="true"
            android:textColor="#268AFF"
            android:textSize="16sp"/>
    </RelativeLayout>

</RelativeLayout>
```

### 自定义属性

两个Preference需要用到的属性：自定义标题，自定义图片，自定义文本的属性，需要前期声明， 这样子可以在xml文件直接配置 preference:navigationTitle    preference:naviDrawable  preference:naviDetail 的值。

```xml
<!-- 第一个Preference的title属性 -->
<declare-styleable name="NavigationTitlePreference">
    <attr name="navigationTitle" format="string" />
</declare-styleable>

<!-- 第二个Preference的图片和文本的属性 -->
<declare-styleable name="NavigationPreference">
    <attr name="naviDrawable" format="reference" />
    <attr name="naviDetail" format="string" />
</declare-styleable>
```

## 自定义Preference 代码

### 第一个Preference

        第一个Preference类似于源生的RadioButtonPreference控件，只是布局不一样，通过继承相同的父类CheckBoxPreference，可以实现自定义的Preference，代码如下：

```java
public class NavigationTitlePreference extends CheckBoxPreference {

    //Preference的点击事件自定义接口
    public interface OnClickListener {
        void onNaviPrefernceClicked(NavigationTitlePreference emiter);
    }

    private OnClickListener mNaviTitleOnClickListener;

    public void setNaviTitleOnClickListener(OnClickListener onClickListener) {
        mNaviTitleOnClickListener = onClickListener;
    }

    private TextView mTextView;
    private String mNavigationTitle;

    public NavigationTitlePreference(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);

        TypedArray attributes = context.obtainStyledAttributes(attrs, R.styleable.NavigationTitlePreference, 0, 0);
        // if these are already set that means they were set dynamically and don't need
        // to be loaded from xml
        mNavigationTitle = (mNavigationTitle == null) ?
                attributes.getString(R.styleable.NavigationTitlePreference_navigationTitle) : mNavigationTitle;
        setLayoutResource(R.layout.navigation_title_preference);
        attributes.recycle();
    }

    public NavigationTitlePreference(Context context, AttributeSet attrs) {
        this(context, attrs, TypedArrayUtils.getAttr(context,
                androidx.preference.R.attr.preferenceStyle,
                android.R.attr.preferenceStyle));
    }

    public NavigationTitlePreference(Context context) {
        this(context, null);
    }

    @Override
    public void onBindViewHolder(PreferenceViewHolder view) {
        super.onBindViewHolder(view);
        mTextView = (TextView)view.findViewById(R.id.navigation_type_title);
        mTextView.setText(mNavigationTitle);
    }

    @Override
    protected void onClick() {
        if (null != mNaviTitleOnClickListener) {
            mNaviTitleOnClickListener.onNaviPrefernceClicked(this);
        }
    }
}
```

### 代码解读

            1. 自定义类是继承于CheckBoxPreference，它里面已经对按钮（比如 RadioButton,  SwitchButton）已经做了事件处理，我们只需要设置按钮的id为：`android:id="@android:id/checkbox"` 即可, 父类代码如下：

```java
// CheckBoxPreference.java 
@Override
    protected void onBindView(View view) {
        super.onBindView(view);

        View checkboxView = view.findViewById(com.android.internal.R.id.checkbox);
        if (checkboxView != null && checkboxView instanceof Checkable) {
            ((Checkable) checkboxView).setChecked(mChecked);
        }
        .......
    }
```

           2.  Preference的点击事件自定义接口   

```java
public interface OnClickListener {  
	void onNaviPrefernceClicked(NavigationTitlePreference emiter);  
}
```

### 第二个Preference

继承Preference,  组成元素为 一张图片和一个文本，点击文本会跳转到相应的动画演示界面， 不需要图片点击事件， 不需要整个Preference的点击事件

```java
public class NavigationPreference extends Preference {
    private TextView mTextView;
    private ImageView mImageView;
    private int mNavigationDrawable;
    private String mNavigationDetail;


    public NavigationPreference(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context, attrs);
    }

    public NavigationPreference(Context context) {
        super(context);
        init(context, null);
    }

    private void init(Context context, AttributeSet attrs) {

        TypedArray attributes = context.obtainStyledAttributes(attrs, R.styleable.NavigationPreference, 0, 0);

        // if these are already set that means they were set dynamically and don't need
        // to be loaded from xml
        mNavigationDrawable = (mNavigationDrawable == 0) ?
                attributes.getResourceId(R.styleable.NavigationPreference_naviDrawable, 0) : mNavigationDrawable;

        mNavigationDetail = (mNavigationDetail == null) ?
                attributes.getString(R.styleable.NavigationPreference_naviDetail) : mNavigationDetail;

        setLayoutResource(R.layout.navigation_preference);

        attributes.recycle();
    }

    @Override
    public void onBindViewHolder(PreferenceViewHolder view) {
        super.onBindViewHolder(view);
        mTextView = (TextView)view.findViewById(R.id.demonstration_effect);
        mTextView.setText(mNavigationDetail);
        mTextView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (getIntent() != null) {
                    Context context = getContext();
                    context.startActivity(getIntent());
                }
            }
        });

        mImageView = (ImageView)view.findViewById(R.id.navigation_type_icon);
        mImageView.setImageResource(mNavigationDrawable);
        //点击整个Preference时，无响应事件的关键代码
        view.itemView.setClickable(false);
    }
}
```

### 代码解读

           1.  点击整个自定义Preference时设置为不可点击`view.itemView.setClickable(false);`无响应事件的关键代码，原理如下：

在 super.onBindViewHolder(view)中

```java
 public void onBindViewHolder(PreferenceViewHolder holder) {
        View itemView = holder.itemView;
        Integer summaryTextColor = null;
        
        //设置 itemView 的点击事件
        itemView.setOnClickListener(mClickListener);
        
        .............
}
```

当点击后，会执行父类Preference.java 中的 performClick方法时，直接return了。

```java
 protected void performClick(View view) {
        performClick();
}

 public void performClick() {
        //当设置不可点击，或者不可选择的时候，就直接return了。        

        if (!isEnabled() || !isSelectable()) {
            return;
        }

        onClick();

        if (mOnClickListener != null && mOnClickListener.onPreferenceClick(this)) {
            return;
        }

        PreferenceManager preferenceManager = getPreferenceManager();
        if (preferenceManager != null) {
            PreferenceManager.OnPreferenceTreeClickListener listener = preferenceManager
                    .getOnPreferenceTreeClickListener();
            if (listener != null && listener.onPreferenceTreeClick(this)) {
                return;
            }
        }

        if (mIntent != null) {
            Context context = getContext();
            context.startActivity(mIntent);
        }
    }
```

           2.  点击文本的响应代码：

```java
@Override  
public void onClick(View v) {  
    if (getIntent() != null) {  
        Context context = getContext();  
        context.startActivity(getIntent());  
    }
}
```

这里的intent是通过 xml文件配置的intent参数，从而跳转到目标界面, 如下：

```xml
<Preference
        android:key="xxxx"
        android:title="xxxxx">
        // 举个例子 通过配置intent参数，跳转到指定的界面
        <intent android:action="android.credentials.INSTALL_AS_USER"
                android:targetPackage="com.android.certinstaller"
                android:targetClass="com.android.certinstaller.CertInstallerMain">
               <extra android:name="install_as_uid" android:value="1010" />
        </intent>
 </Preference>
```


设置界面代码
-------------

自定义的Preference代码完成后，接下来就开始写界面加载的xml文件了

布局文件：navigation\_type\_settings.xml

```java
<?xml version="1.0" encoding="utf-8"?>
<PreferenceScreen xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:preference="http://schemas.android.com/apk/res-auto"
    android:key="gesture_system_navigation_type"
    android:title="@string/system_navigation_title">

    <com.android.settings.gestures.NavigationTitlePreference
        android:key="gesture_navi"
        //自定义的title
        preference:navigationTitle="@string/system_gesture_navigation_title"/>

    <com.android.settings.gestures.NavigationPreference
        android:key="gesture_navi_drawable"
       //自定义的图片
        preference:naviDrawable="@drawable/ic_gesture_navigation"
       //自定义文本
        preference:naviDetail="@string/demonstration_effect">
        <intent
            android:action="android.intent.action.MAIN"
            android:targetPackage="com.android.settings"
            android:targetClass="com.android.settings.Settings$GestureNaviSettingsActivity"/>
    </com.android.settings.gestures.NavigationPreference>


    <com.android.settings.gestures.NavigationTitlePreference
        android:key="virtual_navi"
        preference:navigationTitle="@string/system_virtual_navigation_title"/>

    <com.android.settings.gestures.NavigationPreference
        android:key="virtual_navi_drawable"
        preference:naviDrawable="@drawable/ic_virtual_navigation"
        preference:naviDetail="@string/demonstration_effect">
        <intent
            android:action="android.intent.action.MAIN"
            android:targetPackage="com.android.settings"
            android:targetClass="com.android.settings.Settings$VirtualNaviSettingsActivity"/>
    </com.android.settings.gestures.NavigationPreference>
</PreferenceScreen>
```

界面加载菜单代码：

```java
public class NavigationTypeSettings extends SettingsPreferenceFragment implements
        NavigationTitlePreference.OnClickListener{

    private static final String KEY_GESTURE = "gesture_navi";
    private static final String KEY_VIRTUAL = "virtual_navi";

    private NavigationTitlePreference mGestureNaviPref;
    private NavigationTitlePreference mVirtualNaviPref;


    @Override
    public void onCreate(Bundle icicle) {
        super.onCreate(icicle);
        //加载界面
        addPreferencesFromResource(R.xml.navigation_type_settings);

     
        PreferenceScreen root = getPreferenceScreen();
        mGestureNaviPref = (NavigationTitlePreference)root.findPreference(KEY_GESTURE);
        mVirtualNaviPref = (NavigationTitlePreference)root.findPreference(KEY_VIRTUAL);
        //自定义Preference的监听事件
        mGestureNaviPref.setNaviTitleOnClickListener(this);
        mVirtualNaviPref.setNaviTitleOnClickListener(this);
    }

   
   //点击Preference的回调方法处理
   @Override
   public void onNaviPrefernceClicked(NavigationTitlePreference emiter) {
        ..........
   }
```

## 自定义Preference总结

        本篇文章是对自定义Preference的一个小结，只写了UI界面和点击响应事件，具体的逻辑看项目需求，只是一个抛砖引玉的Demo，设置模块已经有比较成熟的Preference控件，当有自定义的Preference的需求，根据情况继承类似的Preference去造轮子。对于UI事件的处理，本文中有响应整个Preference的事件处理，也有只需要响应其中一个子控件的事件处理，关键还是要多看和理解源码，面向对象编程继承和多态的灵活应用， 后续在工作项目中再多多总结吧。



本文转自 https://blog.csdn.net/u012514113/article/details/125233201，如有侵权，请联系删除。

本文转自 [https://blog.csdn.net/wenzhi20102321/article/details/136902514](https://blog.csdn.net/wenzhi20102321/article/details/136902514)，如有侵权，请联系删除。