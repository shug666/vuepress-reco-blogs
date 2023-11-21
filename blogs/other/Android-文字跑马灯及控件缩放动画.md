---
title: Android 文字滚动跑马灯效果及控件方法动画
date: 2023-05-06
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 控件放大的动画效果；

定义了一个runnable,在执行run()方法时,会创建一个300ms的ScaleAnimation放大/缩小动画,并启动该动画

```java
public void onFocusChange(View v, boolean hasFocus) {
    Runnable animation = new Runnable() {
        @Override
        public void run() {
            ScaleAnimation animation = null;
            float width = getMeasuredWidth();
            float height = getMeasuredHeight();
            float scaleWidth = (width + getResources().getDimensionPixelSize(R.dimen.x10) * 2) / width;
            float scaleHeight = (height + getResources().getDimensionPixelSize(R.dimen.y10) * 2) / height;
            if (hasFocus) {
                animation = new ScaleAnimation(1.0f, scaleWidth, 1.0f, scaleHeight,
                        Animation.RELATIVE_TO_SELF, 0.5f,
                        Animation.RELATIVE_TO_SELF, 0.5f);

                //textview设置文字跑马灯的效果
                animationText.setMarqueeRepeatLimit(-1);
                animationText.setSingleLine(true);
                animationText.setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
                animationText.setSelected(true);
            } else {
                animation = new ScaleAnimation(scaleWidth, 1.0f, scaleHeight, 1.0f,
                        Animation.RELATIVE_TO_SELF, 0.5f,
                        Animation.RELATIVE_TO_SELF, 0.5f);

                //textview取消设置文字跑马灯的效果
                animationText.setMarqueeRepeatLimit(0);
                animationText.setSingleLine(false);
                animationText.setEllipsize(android.text.TextUtils.TruncateAt.END);
                setSelected(false);
            }
            bringToFront();
            animation.setDuration(300);
            animation.setFillAfter(true);
            startAnimation(animation);
        }
    };
    if (isShown()) {
        animation.run();
    } else {
        post(animation);
    }
}
```

## 跑马灯的文字滚动效果

### xml布局文件中设置

```xml
android:singleLine="true"
android:ellipsize="marquee"
android:marqueeRepeatLimit="marquee_forever"
android:focusable="true"
android:focusableInTouchMode="true"/>
```

**注意：为了让文字滚动显示，必须将singleLine属性设置为true，且控件必须获取到焦点才能触发滚动效果(如果是父布局获取到焦点导致无法滚动可在代码中使用setSelected(true)方法来使其触发滚动效果)。**

### 代码中设置

```java
//重写onFocusChanged方法
@Override
protected void onFocusChanged(boolean gainFocus, int direction, Rect previouslyFocusedRect) {
    if (gainFocus) {
        setMarqueeRepeatLimit(-1);
        setSingleLine(true);
        setEllipsize(android.text.TextUtils.TruncateAt.MARQUEE);
        setSelected(true);
    } else {
        setMarqueeRepeatLimit(0);
        setSingleLine(false);
        setEllipsize(android.text.TextUtils.TruncateAt.END);
        setSelected(false);
    }
    super.onFocusChanged(gainFocus, direction, previouslyFocusedRect);
}
```

