---
title: Android Activity启动模式与状态保存及恢复详解
date: 2023-05-06
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 一.简介

Activity是[Android组件](https://links.jianshu.com/go?to=https%3A%2F%2Fbaike.baidu.com%2Fitem%2FAndroid%25E7%25BB%2584%25E4%25BB%25B6%2F10446728)中最基本也是最为常见用的四大组件（Activity，Service服务，Content Provider内容提供者，BroadcastReceiver广播接收器）之一 .

Activity是一个应用程序[组件](https://links.jianshu.com/go?to=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E7%25BB%2584%25E4%25BB%25B6)，提供一个[屏幕](https://links.jianshu.com/go?to=https%3A%2F%2Fbaike.baidu.com%2Fitem%2F%25E5%25B1%258F%25E5%25B9%2595%2F3750314)，用户可以用来交互为了完成某项任务。

Activity中所有操作都与用户密切相关，是一个负责与**用户交互**的组件，可以通过setContentView(View)来**显示指定控件**。

在一个android应用中，一个Activity通常就是一个单独的屏幕，它上面可以显示一些控件也可以监听并处理用户的事件做出响应。Activity之间通过Intent进行通信。

关于Activity启动流程请参考之前的文章[Android activity启动流程分析](https://www.jianshu.com/p/52276d5a979c)

## 二.启动模式

activity有四种启动模式，分别为standard，singleTop，singleTask，singleInstance。如果要使用这四种启动模式，必须在manifest文件中activity标签中的launchMode属性中配置。

### a.standard

标准的默认启动模式，这种模式下activity可以被多次实例化，即在一个task中可以存在多个activity，每一个activity会处理一个intent对象，（在A中再次启动A，会存在后面的A在前面的A上面，当前task会存在两个activity的实例对象）

### b.singleTop

   如果一个singleTop模式启动的activity实例已经存在于栈顶，那么再次启动这个activity的时候，不会重新创建实例，而是重用位于栈顶的那个实例，并且会调用实例的onNewIntent()方法将Intent对象传递到这个实例中，如果实例不位于栈顶，会创建新的实例。

### c.singleTask:

   启动模式设置为singleTask，framework在启动该activity时只会把它标示为可在一个新任务中启动，至于是否在一个新任务中启动，还要受其他条件的限制，即taskAffinity属性。

   **taskAffinity**：默认情况下，一个应用中的所有activity具有相同的taskAffinity，即应用程序的包名。我们可以通过设置不同的taskAffinity属性给应用中的activity分组，也可以把不同的应用中的activity的taskAffinity设置成相同的值，当两个不同应用中的activity设置成相同的taskAffinity时，则两个activity会属于同一个TaskRecord。

   在启动一个singleTask的Activity实例时，如果系统中已经存在这样一个实例，就会将这个实例调度到任务栈的栈顶，并清除它当前所在任务中位于它上面的所有的activity；如果这个已存在的任务中不存在一个要启动的Activity的实例，则在这个任务的顶端启动一个实例；若这个任务不存在，则会启动一个新的任务，在这个新的任务中启动这个singleTask模式的Activity的一个实例。

### d.singleInstance:

   以singleInstance模式启动的Activity具有全局唯一性，即整个系统中只会存在一个这样的实例，如果在启动这样的Activiyt时，已经存在了一个实例，那么会把它所在的任务调度到前台，重用这个实例。

   以singleInstance模式启动的Activity具有独占性，即它会独自占用一个任务，被他开启的任何activity都会运行在其他任务中（官方文档上的描述为，singleInstance模式的Activity不允许其他Activity和它共存在一个任务中）。

   被singleInstance模式的Activity开启的其他activity，能够开启一个新任务，但不一定开启新的任务，也可能在已有的一个任务中开启，受条件的限制，这个条件是：当前系统中是不是已经有了一个activity B的taskAffinity属性指定的任务。

#### 三.Activity管理

   涉及到Activity启动，就不得不说一下Activity的管理，Activity是以什么方式及被什么类来进行管理的，涉及的类主要如下：

### a.ActivityRecord：

   历史栈中的一个条目，代表一个activity。ActivityRecord中的成员变量task表示其所在的TaskRecord，ActivityRecord与TaskRecord建立了联系。

### b.TaskRecord：

   内部维护一个 `ArrayList<ActivityRecord>` 用来保存ActivityRecord，TaskRecord中的mStack表示其所在的ActivityStack，TaskRecord与ActivityStack建立了联系。

### c.ActivityStack：

   内部维护了一个 `ArrayList<TaskRecord>` ，用来管理TaskRecord，ActivityStack中持有ActivityStackSupervisor对象，由ActivityStackSupervisor创建。

### d.ActivityStackSupervisor：

   负责所有ActivityStack的管理。内部管理了mHomeStack、mFocusedStack和mLastFocusedStack三个Activity栈。其中，mHomeStack管理的是Launcher相关的Activity栈；mFocusedStack管理的是当前显示在前台Activity的Activity栈；mLastFocusedStack管理的是上一次显示在前台Activity的Activity栈。

### e.ActivityThread：

   ActivityThread 运行在UI线程（主线程），App的真正入口。

### f.ApplicationThread：

   用来实现AMS和ActivityThread之间的交互。

### g.Instrumentation：

   负责调用Activity和Application生命周期。

## 四.Activity状态保存

   当一个Activity未被主动关闭，即“被动关闭”时，可能需要系统给用户提供保持一些状态的入口。

### a.调用入口

   前面说的入口就是：Activity提供了onSaveInstanceState()方法，该方法是Activity在关闭前保存状态的核心方法。

### b.调用场景

   前面提到“被动关闭”，如果是主动关闭那么就不会调用，比如：按back键、调用finish()等，那么"被动关闭"的场景有哪些呢？下面给列举一下：

| 场景 | 具体描述 |
| --- | --- |
| 从当前activity启动新activity后 | 当前activity会调用onSaveInstanceState() |
| 屏幕切换，横屏切竖屏及竖屏切横屏 | 切换时，系统会先销毁activity，切换后系统再创建新的activity， |
| 所以会调用onSaveInstanceState() |
| 按HOME键后 | 按下home键，会启动新的应用，当前activity会调用onSaveInstanceState() |
| 关闭屏幕显示 | 进入熄屏界面，当前activity会调用onSaveInstanceState() |
| 切换白天黑夜模式 | 当未配置configChange时，切换白天黑夜模式，当前activity会调用onSaveInstanceState() |

### c.调用时机

   肯定在调用onStop()前被调用，但不保证在onPause()前 / 后，一般是在onPause()后调用。

### d.使用方式

   当需要保持状态时，在onSaveInstanceState()内执行以下逻辑：

```java
@Override
protected void onSaveInstanceState(Bundle outState) {
    //调用父类方法帮助UI存储状态
    super.onSaveInstanceState(outState);
    outState.putInt(ActionUtils.SRCDISPLAY, mSrcDisplay);
    outState.putInt("Control_State", mControlState);
}
```
   当需要恢复时，在onCreate()内部执行以下逻辑：

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    //首次启动时，获取Intent内部传入的bundle
    if (savedInstanceState == null) {
        Intent intent = getIntent();
        Bundle bundle = intent.getExtras();
        mSrcDisplay = bundle.getInt(ActionUtils.SRCDISPLAY);
    //savedInstanceState不为空，说明执行了onSaveInstanceState()，直接获取对应的状态
    } else {
        mSrcDisplay = savedInstanceState.getInt(ActionUtils.SRCDISPLAY);
        mControlState = savedInstanceState.getInt("Control_State");
    }
}
```
   布局每个View默认实现：onSaveInstanceState()，即UI的任何改变都会自动的存储和在activity重新创建的时候自动的恢复(只有在为该UI提供了唯一ID后才起作用)；
   若需复写该方法从而存储额外的状态信息时，应先调用父类的onSaveInstanceState()（因为默认的onSaveInstanceState()帮助UI存储它的状态）；
   只使用该方法记录Activity的瞬间状态（UI的状态），而不是去存储持久化数据，因为onSaveInstanceState()调用时机不确定性；可使用 onPause()[一定会执行]存储持久化数据；

## 四.Activity状态恢复

### a.调用入口

   Activity提供了onRestoreInstanceState()方法，该方法是Activity在重新创建后恢复之前保存状态的核心方法。

### b.调用场景

   若被动关闭了Activity，即调用了onSaveInstanceState()，那么下次启动时会调用onRestoreInstanceState()。

### c.调用时机

   onCreate()--->onStart()--->onRestoreInstanceState()--->onResume()

### d.使用方式

```java
@Override
protected void onRestoreInstanceState(Bundle savedInstanceState) {
    super.onRestoreInstanceState(savedInstanceState);
    mSrcDisplay = savedInstanceState.getInt(ActionUtils.SRCDISPLAY);
    mControlState = savedInstanceState.getInt("Control_State");
}
```
```java
   **注意：**onSaveInstanceState（）、onRestoreInstanceState（）不一定 成对被调用
   如：当正在显示Activity A时，用户按下HOME键回到主界面，然后用户紧接着又返回到Activity A，此时Activity A一般不会因为内存的原因被系统销毁，故Activity A的onRestoreInstanceState()不会被执行；
   针对以上情况，onSaveInstanceState保持的参数可以选择在onCreate()内部进行解析使用，因为onSaveInstanceState的bundle参数会传递到onCreate方法中，可选择在onCreate()中做数据还原。
   **至此：Activity的启动模式及Activity的状态保持及恢复介绍完毕。**
```

  

本文转自 [https://www.jianshu.com/p/f7f66a5d1525](https://www.jianshu.com/p/f7f66a5d1525)，如有侵权，请联系删除。
