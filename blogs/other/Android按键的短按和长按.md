---
title: android 按键长按和短按及时长判断
date: 2022-10-25
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 按键长按短按

在KeyEvent中，有一个callback接口，里面有KeyDown(),onKeyUp(),onKeyLongPress()几个函数，主要通过实现这几个函数来实现我们的功能。

```java
boolean onKeyDown(int keyCode, KeyEvent event){
        if (keyCode == KeyEvent.KEYCODE_ENTER) {
            if (event.getRepeatCount() == 0) {
                event.startTracking();//只有执行了这行代码才会调用onKeyLongPress的；
                isLongPress = false;
            }
            else {
                isLongPress = true;
            }
            return true;
        }
}
```

```java
public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_ENTER){
            if (isLongPress){
                isLongPress = false;
                return true;
            }
        }
```

```java
 public boolean onKeyLongPress(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_ENTER) {
            isLongPress = true;
            Toast.makeText(this, "长按", Toast.LENGTH_SHORT).show();
            return true;
        }
    }
}
```

但是上面这种方法只适合在Activity中判断。如果应用是一个后台应用

## 按键长按短按时长

下面这个是参考CarInputService.java中的函数写的一个判断硬按键长按短按已经按了几秒的一个方法。这里面定义了按键按下去和弹上来的事件，然后在按下去的时候和弹回来时分别计时，最后算出此次按键的时间，然后多久算长按有自己决定。具体代码看下面：

```java
//定义了一个类，专门来处理按键时长
private static final class KeyPressTimer {
        private static final long LONG_PRESS_TIME_MS = 1000;
        private static final long LONG_PRESS_TIME_MS_3 = 3000;
        private static final long LONG_PRESS_TIME_MS_10 = 10000;

        private boolean mDown = false;   //判断按键状态
        private long mDuration = -1;    //长按时长

       //在KeyEvent状态变为down时调用，
        synchronized void keyDown() {
            mDown = true;
            mDuration = SystemClock.elapsedRealtime();
        }

      //在KeyEvent状态变为up时调用，然后计算
        synchronized void keyUp() {
            if (!mDown) {
                throw new IllegalStateException("key can't go up without being down");
            }
            mDuration = SystemClock.elapsedRealtime() - mDuration;
            mDown = false;
        }

//判断是否是长按
        synchronized boolean isLongPress() {
            if (mDown) {
                throw new IllegalStateException("can't query press length during key down");
            }
            return mDuration >= LONG_PRESS_TIME_MS;
        }
//判断是否长按三秒
        synchronized boolean isThreePress() {
            if (mDown) {
                throw new IllegalStateException("can't query press length during key down");
            }
            return (mDuration >= LONG_PRESS_TIME_MS_3) && (mDuration <= LONG_PRESS_TIME_MS_10);
        }
//判断是否长按十秒
        synchronized boolean isTenPress() {
            if (mDown) {
                throw new IllegalStateException("can't query press length during key down");
            }
            return mDuration >= LONG_PRESS_TIME_MS_10;
        }
}

```

针对每个需要区分长按短按的按键都需要写一个处理方法，在这个方法里调用之前写的EnterPressTimer里的方法，来判断他是长按还是短按，然后进行相应的处理。

```java
private void handleEnterKey(KeyEvent event) {
        int action = event.getAction();
        if (action == KeyEvent.ACTION_DOWN) {
            mEnterPressTimer.keyDown();
        } else if (action == KeyEvent.ACTION_UP) {
            mEnterPressTimer.keyUp();
            if (mEnterPressTimer.isTenPress()) {
            } else if (mEnterPressTimer.isThreePress()) {
            } else {
            }
        }
    }

```

