---
title: android 设置图标大小
date: 2022-12-10
tags:
 - android
categories: 
 - android
sticky: 
   true
---

在drawableLeft在布局里面是设置不了的因为没有这个参数一定要在activity里面设置

```xml
 <View
            android:layout_width="match_parent"
            android:layout_height="2dp"
			android:drawableLeft="@drawable/图片名"
            android:layout_below="@id/news_title_menuId"
            android:background="@android:color/black"></View>
```

```java
    Drawable left=getResources().getDrawable(R.drawable.图片名);
    left.setBounds(0,0,50,50);//必须设置图片的大小否则没有作用
    sendText.setCompoundDrawables(left,null ,null,null);//设置图片left这里如果是右边就放到第二个参数里面依次对应
```

