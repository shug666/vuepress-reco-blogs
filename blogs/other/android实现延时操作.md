---
title: android 延时操作
date: 2022-10-11
tags:
 - android
categories: 
 - android
sticky: 
   true
---

在Android开发中我们可能会有延时执行某个操作的需求，例如我们启动应用的时候，一开始呈现的是一个引导页面，过了两三秒后，会自动跳转到主界面。这就是一个延时操作。
下面是实现延时执行操作的几种方法：

## 1.使用线程的休眠实现延时操作

```java
new Thread() {
    @Override
    public void run() {
        super.run();
        Thread.sleep(3000);//休眠3秒
        /**
        \* 要执行的操作
        */
    }
}.start();
```

## 2.使用TimerTask实现延时操作

```java
TimerTask task = new TimerTask() {
    @Override
    public void run() {
        /**
        *要执行的操作
        */
        }
    };
Timer timer = new Timer();
timer.schedule(task, 3000);//3秒后执行TimeTask的run方法
```



## 3.使用Handler实现延时操作

```java
Handler handler = new Handler();
handler.postDelayed(new Runnable() {
    @Override
    public void run() {
    /**
    *要执行的操作
    */
    }
}, 3000);//3秒后执行Runnable中的run方法
```

## 4.使用CountDownTimer实现延时（定时器）操作

```java
new CountDownTimer(60 * 1000, 1000) {
    @Override
    public void onFinish() {
        if (tvCode != null) {
            tvCode.setText("重新获取");
            tvCodeWr.setTextColor(Color.parseColor("#E94715"));
            tvCode.setClickable(true);
            tvCode.setEnabled(true);
        }

        cancel();
    }

    @Override
    public void onTick(long millisUntilFinished) {
        if (tvCode != null) {
            tvCode.setClickable(false);
            tvCode.setEnabled(false);
            tvCode.setText(millisUntilFinished / 1000 + "s");
            tvCode.setTextColor(Color.parseColor("#999999"));
        }
    }
}.start();
```

