---
title: focusableInTouchMode和focusable
date: 2024-07-13
tags:
 - java
categories: 
 - java
sticky: 
   true
---

## focusable

android:focusable=”true” 表示控件可以获取焦点。  

android:focusable=”false” 表示控件不可获取焦点。

这个属性主要针对在键盘操作的情况。如果focusable属性值为true，表示可以通过键盘（虚拟键盘或物理键盘）或轨迹球将焦点移动到当前控件上。如果设置该属性为false，则无法将焦点移到当前控件

```xml
        <!-- Controls whether a view can take focus.  By default, this is "auto" which lets the
             framework determine whether a user can move focus to a view.  By setting this attribute
             to true the view is allowed to take focus. By setting it to "false" the view will not
             take focus. This value does not impact the behavior of
             directly calling {@link android.view.View#requestFocus}, which will
             always request focus regardless of this view.  It only impacts where
             focus navigation will try to move focus. -->
        <attr name="focusable" format="boolean|enum">
```

上文代码注释翻译：控制视图是否可以获得焦点。默认情况下，这是“auto”，允许框架确定用户是否可以将焦点移动到视图上。通过将此属性设置为true，允许视图获得焦点。通过将其设置为“false”，视图将不会获得焦点。这个值不会影响直接调用{@link android.view.View#requestFocus}的行为，无论如何都会请求焦点。它只影响焦点导航尝试移动焦点的位置。

## focusableInTouchMode

android:focusableInTouchMode = true，表示用户，可以通过触摸获取焦点。  

android:focusableInTouchMode = false，默认值，表示只有在焦点模式下，视图才能获取焦点。

这个属性主要针对触屏情况下的操作。如果focusableInTouchMode属性设置为true，当触摸某个控件时，会先将焦点移动到被触摸的控件上，然后需要再触摸该控件才会响应单击事件

```
        <!-- Boolean that controls whether a view can take focus while in touch mode.
             If this is true for a view, that view can gain focus when clicked on, and can keep
             focus if another view is clicked on that doesn't have this attribute set to true. -->
        <attr name="focusableInTouchMode" format="boolean" />

```

上文代码注释翻译：布尔值，控制视图在触摸模式下是否可以获得焦点。如果对于一个视图来说这是true，那么当点击它时，该视图可以获得焦点，并且如果点击另一个没有设置此属性为true的视图时，它可以保持焦点。



本文转自 [https://blog.csdn.net/m0\_51011495/article/details/135081187](https://blog.csdn.net/m0_51011495/article/details/135081187)，如有侵权，请联系删除。