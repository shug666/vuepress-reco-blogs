---
title: Android App启动页面优化（白屏/黑屏） 
date: 2023-04-12
tags:
 - android
categories: 
 - android
sticky: 
   true
---

背景：android app启动页面黑屏的问题，android开发app启动时若没有做特殊处理的话，会出现一瞬间的白屏现象。  

即使你启动页界面就加载一个布局，不做其他耗时处理，貌似也会出现一瞬间的白屏问题。注意，有些地方也称黑屏，主要是看你给app设置的style样式。 


为什么存在这个问题：  

当系统启动一个APP时，zygote进程会首先创建一个新的进程去运行这个APP，但是进程的创建是需要时间的，在创建完成之前，界面是呈现假死状态，于是系统根据你的manifest文件设置的主题颜色的不同来展示一个白屏或者黑屏。而这个黑（白）屏正式的称呼应该是Preview Window，即预览窗口。  

实际上就是是activity默认的主题中的android:windowBackground为白色或者黑色导致的。  

总结来说启动顺序就是：app启动——Preview Window(也称为预览窗口)——启动页。  

解决方法：  

Android在选择展示黑屏或者白屏的时候，是根据你设定的主题而不同的，也就是说，虽然你的代码没有被执行，你的配置文件却被提前读取了，用来作为展示Preview Window界面的依据。所以，解决方案的切入口就是整个APP的manifest文件，更确切的说应该是主题配置文件。  

设置配置文件style样式中的windowBackground这个属性来显示一张背景图还有一个效果就是启动应用程序会感觉非常快，而且与加载MainActivity的contentView是异步的  

第一种解决方法：  

给当前启动页添加一个有背景的style样式：

```xml
<style name="style_splash" parent="android:Theme">
    <item name="android:windowNoTitle">true</item>
    <item name="android:windowBackground">@drawable/splash_launch_bg</item>
</style>
```

splash\_launch\_bg.xml背景drawable

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">

    <item>
        <color android:color="@color/color_f4f4f4" />
    </item>

    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_img"
            android:tileMode="disabled" />

    </item>

    <item>
        <bitmap
            android:gravity="bottom"
            android:src="@drawable/splash_txt"
            android:tileMode="disabled" />
    </item>

</layer-list>
```

给启动页设置此style

```XML
<activity
    android:name=".entry.splash.SplashActivity"
    android:launchMode="singleTop"
    android:screenOrientation="portrait"
    android:theme="@style/style_splash">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

经过处理之后App启动时就不会出现一瞬间白屏的效果,将主题设置到启动的Activity的主题中，windowBackground就是即将展示的preview window。其中splash可以是一整张图片，它也可以是一个能解析出图片资源的XML文件。  

重点：该方案注意要点  

给Preview Window设置的背景图如果不做处理，图片就会一直存在于内存中，所以，当我们进入到欢迎页的时候，不要忘了把背景图设置为空

```JAVA
@Override
protected void onCreate(@Nullable Bundle savedInstanceState) {
    //将window的背景图设置为空
    getWindow().setBackgroundDrawable(null);
    super.onCreate(savedInstanceState);
}
```

注意：这样通过样式style设置SplashActivity加载图，不能像imageView那样可以设置缩放功能，因此可以采用.9图片。  

第二种解决方法：  

禁止加载Preview Window，具体做法如下

```XML
<style name="SplashTheme" parent="@style/Theme.AppCompat.Light.NoActionBar">
    <item name="android:windowDisablePreview">true</item>
</style>
```

把此theme设定为启动的Activity的主题，即可禁止Preview Window，当然，也有人通过把preview window设置为全透明，也达成了类似的效果。个人感觉这种方法没有第一种好！

windowDisablePreview的作用：

通过设置android:windowDisablePreview属性，禁用窗口的预览动画，在SplashActivity显示之前，系统永远不会使用窗口的主题来显示它的预览，这也保证了不会出现白屏或者黑屏。但是，与设置android:windowIsTranslucent属性一样，如果在SplashActivity启动的时候，有过多复杂的操作，就会出现在手机中点击了应用程序的图标，但过n秒才会打开应用程序不好的卡顿体验效果。

这种方法缺点：  

就是点击后短暂的那几百毫秒没有反应，就好像“假死”了一样，过了一会儿才跳出我们应用程序的第一个Activity，如果你不想让你的 App 有这个短暂“假死”时间，建议使用第一种方法。

注意：注意的是有些手机标题栏和状态栏也会影响这两图层的，造成抖动效果，为了避免这种情况需要处理状态栏问题。解决方法参考：[github.com/yangchong21…](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fyangchong211%2FYCStatusBar)

此篇为app启动页白屏/黑屏解决方法，这是启动优化的开端。

参考：[https://juejin.im/post/6844903721218867207](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fpost%2F6844903721218867207)

  

本文转自 [https://www.jianshu.com/p/de7e2f0d9f20](https://www.jianshu.com/p/de7e2f0d9f20)，如有侵权，请联系删除。