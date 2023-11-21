---
title: Android include,ViewStub和Merge的使用
date: 2023-02-27
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## include的用法以及注意点

在开发Android布局时，我们常将一些通用的视图提取到一个单独的layout文件中，然后使用`<include>`标签在需要使用的其他layout布局文件中加载进来，比如我们自己App导航栏等。这样，便于对相同视图内容进行统一的控制管理，提高布局重用性。

下面我们以大部分项目中都有的头部导航栏为例，说明一下include的使用，比如我们项目自己统一头部导航栏，抽取布局如下：

```xml
<!--titlebar.xml-->
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >

     <Button
        android:id="@+id/back"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentLeft="true"
        android:layout_centerVertical="true"
        android:text="返回按钮" />

    <TextView
        android:id="@+id/title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:text="提示文字"
        android:textSize="20sp" />

    <Button
        android:id="@+id/close"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentRight="true"
        android:layout_centerVertical="true"
        android:text="关闭按钮" />

</RelativeLayout>
```

很简单，就是左右各一个按钮，中间是一个提示文字。使用也比较简单，如下：

```xml

<!--activity_main.xml-->
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context="${relativePackage}.${activityClass}" >

    <include
        android:layout_width="match_parent"
        android:layout_height="40dp"
        layout="@layout/titlebar" />

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerHorizontal="true"
        android:layout_centerVertical="true"
        android:onClick="click"
        android:text="点我。。。" />

</RelativeLayout>
```

include标签使用还是很简单的，主要通过layout属性声明要引入的布局即可。

**include标签使用注意点：**

> 1，`<include>`标签当中，可以重写所有layout属性的，如上面include中指定的layout属性将会覆盖掉titlebar中指定的layout属性。而非layout属性则无法在`<include>`标签当中进行覆写。另外需要注意的是，如果我们想要在`<include>`标签当中覆写layout属性，必须要将layout_width和layout_height这两个属性也进行覆写，否则覆写效果将不会生效
>
> 2，一个xml布局文件有多个include标签需要设置ID,才能找到相应子View的控件,否则只能找到第一个include的layout布局,以及该布局的控件。
>
> 3，如果我们给include所加载的layout布局的根容器设置了id属性，也在include标签中设置了id属性，同时需要在代码中获取根容器的控件对象
>
> 时，最好将这两个id设置相同的名称！否则，可能获取不到根容器对象，即为null。

## ViewStub的使用

### 简介

> `ViewStub` 是一种没有任何维度的轻量型视图，它不会绘制任何内容或参与布局。

*   ViewStub是一种没有大小，不占用布局的View。
*   直到当调用 `inflate()` 方法或者可见性变为VISIBLE时，才会将指定的布局加载到父布局中。
*   ViewStub加载完指定布局之后会被移除，不再占用空间。（所以 `inflate()` 方法只能调用一次 ）

因为这些特性ViewStub可以用来懒加载布局，优化UI性能。

### 使用

**布局**

在布局中添加ViewStub标签并通过layout属性指定要替换的布局。

```xml
<ViewStub
      android:id="@+id/visible_view_stub"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:layout="@layout/layout_view_stub_content" />
```

**代码**

在需要展示布局的地方调用 `inflate()` 方法或者将ViewStub的可见性设置为VISIBLE。

```java
private View viewStubContentView = null;

visibleViewStub.setVisibility(View.VISIBLE);

if(viewStubContentView == null){
    viewStubContentView = inflateViewStub.inflate();
}
```

**注意** ：`inflate()` 方法只能调用一次，重复调用被抛出`IllegalStateException`异常。

`inflate()` 方法会返回替换的布局的根View而设置VISIBLE不会返回，如果需要获取替换布局的实例，如：需要为替换的布局设置监听事件，这是需要使用`inflate()` 方法而不是VISIBLE。

### ViewStub源码分析

针对我们前面说的ViewStub的几个特点，我们来分析下源码是如何实现的。分析源码可以学习别人优秀的代码设计，也可以为我们日后类似需求的实现提供借鉴。

#### ViewSutb没有大小，不占用布局

ViewStub在构造方法中设置了控件可见性为GONE并且指定不进行绘制。

```java
public ViewStub(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
    super(context);
    final TypedArray a = context.obtainStyledAttributes(attrs,
            R.styleable.ViewStub, defStyleAttr, defStyleRes);
    mInflatedId = a.getResourceId(R.styleable.ViewStub_inflatedId, NO_ID);
    mLayoutResource = a.getResourceId(R.styleable.ViewStub_layout, 0);
    mID = a.getResourceId(R.styleable.ViewStub_id, NO_ID);
    a.recycle();
    //设置不可见
    setVisibility(GONE);
    //指定不进行绘制
    setWillNotDraw(true);
}
```

并且重写了`onMeasure(widthMeasureSpec, heightMeasureSpec)`设置尺寸为(0,0)，并且重写了`draw(canvas)` 和`dispatchDraw(canvas)`方法，并且没有做任何绘制操作。

```java
@Override
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    //指定尺寸为0,0
    setMeasuredDimension(0, 0);
}
@Override
public void draw(Canvas canvas) {
}
@Override
protected void dispatchDraw(Canvas canvas) {
}
```

#### `setVisibility()`和`inflate()`方法

```java
//定义了一个View的弱引用
private WeakReference<View> mInflatedViewRef;

@Override
@android.view.RemotableViewMethod(asyncImpl = "setVisibilityAsync")
public void setVisibility(int visibility) {
    if (mInflatedViewRef != null) {
        //如果弱引用不为空且View不为空，调用View的setVisibility方法
        View view = mInflatedViewRef.get();
        if (view != null) {
            view.setVisibility(visibility);
        } else {
            throw new IllegalStateException("setVisibility called on un-referenced view");
        }
    } else {
        super.setVisibility(visibility);
        if (visibility == VISIBLE || visibility == INVISIBLE) {
            //弱引用为空且可见性设置为VISIBLE或者INVISIBLE，调用inflate()方法
            inflate();
        }
    }
}
```

到这里基本可以分析出弱引用持有的对象就是替换布局的View。继续往下看mInflatedViewRef是在哪里初始化的。

inflate()方法，核心方法执行具体的布局替换操作。

```java
public View inflate() {
    //获取父布局
    final ViewParent viewParent = getParent();
    if (viewParent != null && viewParent instanceof ViewGroup) {
        if (mLayoutResource != 0) {
            final ViewGroup parent = (ViewGroup) viewParent;
            //获取要替换的View对象
            final View view = inflateViewNoAdd(parent);
            //执行替换操作
            replaceSelfWithView(view, parent);
            //初始化弱引用持有View对象
            mInflatedViewRef = new WeakReference<>(view);
            if (mInflateListener != null) {
                //触发监听
                mInflateListener.onInflate(this, view);
            }
            return view;
        } else {
            throw new IllegalArgumentException("ViewStub must have a valid layoutResource");
        }
    } else {
        throw new IllegalStateException("ViewStub must have a non-null ViewGroup viewParent");
    }
}
```

inflate()方法中获取要替换的View对象并执行了替换操作，mInflatedViewRef持有的确实是替换View对象的实例。

#### ViewStub加载完指定布局之后会被移除，不再占用空间

我们继续来看`inflateViewNoAdd()` 方法和`replaceSelfWithView()`方法。

```java
private View inflateViewNoAdd(ViewGroup parent) {
    final LayoutInflater factory;
    if (mInflater != null) {
        factory = mInflater;
    } else {
        factory = LayoutInflater.from(mContext);
    }
    //动态加载View
    final View view = factory.inflate(mLayoutResource, parent, false);
    if (mInflatedId != NO_ID) {
        view.setId(mInflatedId);
    }
    return view;
}
```

`inflateViewNoAdd()` 方法比较简单，没什么好解释的。

```java
private void replaceSelfWithView(View view, ViewGroup parent) {
    final int index = parent.indexOfChild(this);
    //从父布局中移除自己
    parent.removeViewInLayout(this);
    final ViewGroup.LayoutParams layoutParams = getLayoutParams();
    if (layoutParams != null) {
        //添加替换布局
        parent.addView(view, index, layoutParams);
    } else {
        //添加替换布局
        parent.addView(view, index);
    }
}
```

`replaceSelfWithView()`执行了移除和替换两步操作。这也解释了为什么`inflate()`方法只能执行一次，因为执行`replaceSelfWithView()`自身已经被移除，再次执行`inflate()`方法获取`getParent()`会为空，从而抛出`IllegalStateException`异常。

### 使用场景

app页面中总会有一些布局是不常显示的，如一些特殊提示和页面loading等，这时可以使用ViewStub来实现懒加载的功能，优化UI性能。

### 总结

ViewStub虽然实现简单，但是源码设计巧妙。对于页面中的不常用布局使用ViewSutb懒加载有一定的优化效果。

* * *

Merge的使用
-------------------------------------------------------------------------

### 简介

*   merge既不是View也不是ViewGroup，只是一种标记。
*   merge必须在布局的根节点。
*   当merge所在布局被添加到容器中时，merge节点被合并不占用布局，merge下面的所有视图转移到容器中。

### 使用

通过一种比较常用的场景来比较下使用merge和不使用的区别。

**不使用merge**

Activity布局：

```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >

    <RelativeLayout
        android:id="@+id/title_rel"
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <include layout="@layout/layout_merge"/>
        
    </RelativeLayout>

    <RelativeLayout
        android:id="@+id/content_rel"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_below="@id/title_rel"/>
</RelativeLayout>
```

ToolBar布局：

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    xmlns:tools="http://schemas.android.com/tools" >

    <ImageView
        android:id="@+id/home_iv"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerHorizontal="true"
        android:src="@mipmap/ic_launcher"/>

    <TextView
        android:id="@+id/title_tv"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerHorizontal="true"
        android:layout_below="@id/home_iv"
        android:gravity="center_vertical"
        android:textSize="25sp"
        android:textColor="#000000"
        tools:text="测试标题"/>
</RelativeLayout>
```

实际Activity布局层级：

```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >

    <RelativeLayout
        android:id="@+id/title_rel"
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <RelativeLayout 
            android:layout_width="match_parent"
            android:layout_height="wrap_content" >

            <ImageView
                android:id="@+id/home_iv"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_centerHorizontal="true"
                android:src="@mipmap/ic_launcher"/>

            <TextView
                android:id="@+id/title_tv"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_centerHorizontal="true"
                android:layout_below="@id/home_iv"
                android:gravity="center_vertical"
                android:textSize="25sp"
                android:textColor="#000000"
                tools:text="测试标题"/>
        </RelativeLayout>

    </RelativeLayout>

    <RelativeLayout
        android:id="@+id/content_rel"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_below="@id/title_rel"/>
</RelativeLayout>
```

**使用merge进行优化：**

优化后的ToolBar布局：

```xml
<merge xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    xmlns:tools="http://schemas.android.com/tools"
    tools:parentTag="android.widget.RelativeLayout">

    <ImageView
        android:id="@+id/home_iv"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerHorizontal="true"
        android:src="@mipmap/ic_launcher"/>

    <TextView
        android:id="@+id/title_tv"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerHorizontal="true"
        android:layout_below="@id/home_iv"
        android:gravity="center_vertical"
        android:textSize="25sp"
        android:textColor="#000000"
        tools:text="测试标题"/>
</merge>
```

使用`tools:parentTag`属性可以指定父布局类型，方便在Android Studio中编写布局时进行预览。

实际Activity布局层级：

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >

    <RelativeLayout
        android:id="@+id/title_rel"
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <ImageView
            android:id="@+id/home_iv"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_centerHorizontal="true"
            android:src="@mipmap/ic_launcher"/>

        <TextView
            android:id="@+id/title_tv"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_centerHorizontal="true"
            android:layout_below="@id/home_iv"
            android:gravity="center_vertical"
            android:textSize="25sp"
            android:textColor="#000000"
            tools:text="测试标题"/>

    </RelativeLayout>

    <RelativeLayout
        android:id="@+id/content_rel"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_below="@id/title_rel"/>
</RelativeLayout>
```

可以看到使用merge之后布局层级减少了一层。

### 使用场景

上面例子可能不太合适，这么写布局容易被打。

来看一种使用频率更高的应用场景——自定义View，大家应该都实现过，比如要定义一个通用的天气控件，通常是自定义一个WeatherView 继承自RelativeLayout，然后通过inflate动态引入布局，那么布局怎么写呢？不使用merge的情况下根布局肯定是RelativeLayout，引入WeatherView之后岂不是嵌套了一层RelativeLayout。这时候就可以在布局中使用merge进行优化。

还有一种应用场景，如果Activity的根布局是FrameLayout可以使用merge进行替换，使用之后可以使Activity的布局层级减少一层。为什么会这样呢？首先我们要了解Activity页面的布局层级，最外层是PhoneWindow其下是一个DecorView下面就是TitleView和ContentView，ContentView就是我们通过SetContentView设置的Activity的布局，没错ContentView是一个FrameLayout，所以在Activity布局中使用merge可以减少层级。

### 总结

正确的使用merge可以有效的减少布局层级，提高页面渲染速度。但是merge使用限制比较多，应用场景比较少。

 

本文转自 [https://blog.csdn.net/Rookie\_xue\_IT/article/details/103735121](https://blog.csdn.net/Rookie_xue_IT/article/details/103735121)，如有侵权，请联系删除。