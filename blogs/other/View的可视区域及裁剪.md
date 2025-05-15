---
title: View的可视区域及裁剪
date: 2024-03-11
tags:
 - android
categories: 
 - android
sticky: 
   true
---

# 获取View的可视区域

- `getGlobalVisibleRect(rect);`，是以屏幕左上角为参考系，判断`view`有一部分在屏幕中，返回`true`（没有被父`View`遮挡）。反之，如果它全部被父`View`遮挡住或者本身就是不可见的，返回`false`。
- `getLocalVisibleRect(rect);`，当`View`可见时，以自身`View`左上角为参考系，坐标系的原点为`View`自己的坐标原点。当`View`不可见时，以父控件左上角为参考系，坐标系的原点为`View`的父控件的坐标原点。

**判断View1是否在某个View2可视区域内**

当使用`getLocalVisibleRect(rect)`时，当View不在可视区域内时：
在顶部，`Rect.top <0`
在底部，`Rect.bottom>View2.getHeight`
所以

```java
public boolean isCover(Activity activity, View view1, View view2) {
    Rect rect = new Rect();
    view1.getLocalVisibleRect(rect);
    return !(rect.top < 0 || rect.bottom > view2.getHeight());
}package com.app.motiongear.clipboundsmotion;

import android.graphics.Outline;
import android.graphics.Rect;
import android.view.View;
import android.view.ViewOutlineProvider;

/**
 * Created by ubuntu on 15-11-13.
 */
public class CustomOutlineProvider extends ViewOutlineProvider {

    @Override
    public void getOutline(View view, Outline outline) {
        Rect rect = new Rect();
        view.getGlobalVisibleRect(rect);
        int leftMargin =100;
        int topMargin = 100;
        Rect selfRect = new Rect(leftMargin, topMargin,
                rect.right - rect.left - leftMargin, rect.bottom - rect.top - topMargin);
        outline.setRoundRect(selfRect, 30);
    }
}
```

**判断View可视区域占其自身百分比（当view1开始可视后调用，否则一直都是100%)**

```java
public int getVisibilePercent(Activity activity, View view1) {
    Rect rect = new Rect();
    view1.getLocalVisibleRect(rect);
    Log.e("测试", "rect.height = " + rect.height() + " view1.height = " + view1.getHeight());
    int a = rect.height() * 100 / view1.getHeight();
    Log.e("测试", a.toString());
    return a;
}
```

**判断View是否显示出现在屏幕上**

```java
public boolean isCoverScreen_LocalVisibleRect(View view1) {
    int screenWidth = CFUtil.getScreenWidth(); // 获取屏幕宽度
    int screenHeight = CFUtil.getScreenHeight(); // 获取屏幕高度
    Rect rect = new Rect();
    view1.getLocalVisibleRect(rect);
    return !(rect.top < 0 ||  getGlobalVisibleRect(Rect rect):获取当前view的可视区域，坐标系使用的Root View的也就是DecorView的坐标系，这点需要注意，不是View自身的坐标系。

  setClipBounds(Rect rect),直接指定当前view的可视区域，当前的Rect使用的view的自身的坐标系。

  setOutlineProvider()，设置当前View的Outline。

  setClipToOutlines()，截取当前的可视区域到Outline，如果设置setClipBounds()方法，这个方法就失效了。 rect.bottom > screenHeight);
}
```

# View进行裁剪的方法

在android中有时候要求只显示view的部分区域，这个时候就需要对当前的view进行剪裁的操作。在android中剪裁当前的view的有两种方法：一种是直接截取view，第二种是通过Outline设置。涉及到的类方法如下：

1.   getGlobalVisibleRect(Rect rect):获取当前view的可视区域，坐标系使用的Root View的也就是DecorView的坐标系，这点需要注意，不是View自身的坐标系。

2.   setClipBounds(Rect rect),直接指定当前view的可视区域，当前的Rect使用的view的自身的坐标系。

3.   setOutlineProvider()，设置当前View的Outline。

4.   setClipToOutlines()，截取当前的可视区域到Outline，如果设置setClipBounds()方法，这个方法就失效了。

下面通过一个简单的例子来说明一下这几个方法的使用：

MainActivity.java

```java
package com.app.motiongear.clipboundsmotion;

import android.graphics.Rect;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    Button mRectBtn, mBoundBtn;
    ImageView mImageView;
    Rect originRect = new Rect();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mRectBtn = (Button) this.findViewById(R.id.btn1);
        mBoundBtn = (Button) this.findViewById(R.id.btn2);
        mImageView = (ImageView) this.findViewById(R.id.imageview);
        mRectBtn.setOnClickListener(this);
        mBoundBtn.setOnClickListener(this);
        mImageView.setOutlineProvider(new CustomOutlineProvider());
    }


    @Override
    public void onClick(View v) {
        if (v == mRectBtn) {
            //getGlobalVisibleRect()相对与父布局的rect
            mImageView.getGlobalVisibleRect(originRect);
            int centerX = (originRect.right - originRect.left) / 2;
            int centerY = (originRect.bottom - originRect.top) / 2;
            //设置View的显示区域，坐标是自身
            Rect tmp = new Rect(centerX - 150, centerY - 150, centerX + 150, centerY + 150);
            mImageView.setClipBounds(tmp);
        }
        if (v == mBoundBtn) {
            //通过Outline设置
            if(!mImageView.getClipToOutline()){
                mImageView.setClipToOutline(true);
            }else{
                mImageView.setClipToOutline(false);
            }

        }
    }
}
```

CustomOutlineProvider.java

```java
package com.app.motiongear.clipboundsmotion;

import android.graphics.Outline;
import android.graphics.Rect;
import android.view.View;
import android.view.ViewOutlineProvider;

/**
 * Created by ubuntu on 15-11-13.
 */
public class CustomOutlineProvider extends ViewOutlineProvider {

    @Override
    public void getOutline(View view, Outline outline) {
        Rect rect = new Rect();
        view.getGlobalVisibleRect(rect);
        int leftMargin =100;
        int topMargin = 100;
        Rect selfRect = new Rect(leftMargin, topMargin,
                rect.right - rect.left - leftMargin, rect.bottom - rect.top - topMargin);
        outline.setRoundRect(selfRect, 30);
    }
}
```

# 总结

`getGlobalVisibleRect(rect)` 简单来说就是目标`view`在父`view`的映射，然后从屏幕左上角开始计算，保存到`rect`中，注意是父`view`，而不是屏幕，因为demo的父`view`(`RelativeLayout`)和屏幕宽高是一样的。

`getLocalVisibleRect(rect)`只要这个`View`的左上角在屏幕中，它的`LocalVisibleRect`的左上角坐标就一定是(0,0)，如果`View`的右下角在屏幕中，它的`LocalVisibleRect`右下角坐标就一定是(`view.getWidth()`, `view.getHeight()`)。
如果不在屏幕中，他的`Rect`数值就跟`getGlobalVisibleRect(rect)`是一样的。

本文转自 [https://www.cnblogs.com/summerpxy/p/4962761.html](https://www.cnblogs.com/summerpxy/p/4962761.html)，https://blog.csdn.net/chennai1101/article/details/134511170如有侵权，请联系删除。

