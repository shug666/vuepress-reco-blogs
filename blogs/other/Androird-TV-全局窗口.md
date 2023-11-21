---
title: Androird TV 全局窗口
date: 2023-05-13
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 代码

```java
	private boolean isCountDown;
    private final Handler mHandler = new Handler();
    private WindowManager wm;
    private WindowManager.LayoutParams params;
    private View countDownView;
    private TextView tv_time;
    private static Timer countDown = null;
    private int mValue = 60;
    
    ......
    public void show() {
        wm = (WindowManager) getApplicationContext().getSystemService(WINDOW_SERVICE);
		......
        params = new WindowManager.LayoutParams();
        // 系统级别的窗口
        params.type = WindowManager.LayoutParams.TYPE_SYSTEM_ALERT
                | WindowManager.LayoutParams.TYPE_SYSTEM_OVERLAY;
        // 居中显示
        params.gravity = Gravity.CENTER;
        // 设置背景透明
        params.format = PixelFormat.TRANSPARENT;
        //拦截特殊按键，eg:power,volume
        int keyFeatures = params.keyFeatures;
        keyFeatures |= WindowManager.LayoutParams.KEY_FEATURE_POWER_PASS_TO_USER;
        keyFeatures |= WindowManager.LayoutParams.KEY_FEATURE_HOME_PASS_TO_USER;
        keyFeatures |= WindowManager.LayoutParams.KEY_FEATURE_VOLUME_PASS_TO_USER;
        keyFeatures |= WindowManager.LayoutParams.KEY_FEATURE_APP_LAUNCHER_PASS_TO_USER;
        keyFeatures |= WindowManager.LayoutParams.KEY_FEATURE_INPUT_SOURCE_PASS_TO_USER;
        if (keyFeatures != params.keyFeatures) {
            params.keyFeatures = keyFeatures;
        }
        countDownView = new View(getApplicationContext()); // 不依赖activity的生命周期
        //加载自定义的倒计时页面
        countDownView = View.inflate(getApplicationContext(),
                R.layout.countdown_weight, null);
        //设置触摸可以获得焦点
        countDownView.setFocusableInTouchMode(true);
        tv_time = (TextView) countDownView.findViewById(R.id.countdown_text);
        tv_time.setText(getStyledText(60));
        wm.addView(countDownView, params);
        //设置按键监听
        countDownView.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View view, int i, KeyEvent keyEvent) {
                Log.d(TAG, "onKey: " + keyEvent.getKeyCode());
                if (keyEvent.getAction() == KeyEvent.ACTION_UP) {
                	//按下任意按键后，移除当前的倒计时窗口及定时任务
                    if (countDownView != null) {
                        wm.removeView(countDownView);
                        countDownView = null;
                        countDown.cancel();
                        mValue = 60;
                    }
                }
                return true;
            }
        });
        // 添加倒计时功能
        countDown = new Timer();
        countDown.schedule(new TimerTask() {
            @Override
            public void run() {
                mValue--;
                mHandler.post(drawCount);
                if (mValue == 0) {
                    // 执行关机操作（这里可以使任意其他操作，根据自己的需求）
                    if (countDownView != null) {
                        wm.removeView(countDownView);
                        countDownView = null;
                        // 取消定时
                        countDown.cancel();
                        goToShutdown();
                    }
                }
            }
        }, 0, 1000);
    }
	
	//更新倒计时
	Runnable drawCount = new Runnable() {
        @Override
        public void run() {
            Log.d(TAG, "Count Down Value: " + mValue);
            tv_time.setText(getStyledText(mValue));
        }
    };

	//这里可以替换为其他内容，如果你需要用到这种类似倒计时执行指定方法的需求。
    private void goToShutdown() {
        mHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
  				//关机
            }
        }, 200);
    }

```

在上面代码中，主要有以下几点需要注意:  
 ①窗口需要设置setFocusableInTouchMode为true，允许触摸获得焦点。因为遥控器响应需要这个属性，同时添加的view不可以设置layoutParams.flags=LayoutParams.FLAG\_NOT\_FOCUSABLE，否则就完全屏蔽了按键了。满足这两个条件后，为添加的VIew设置的按键监听才可以接收到按键信息，具体怎么处理就是看需求了，我这里的需求就是移除窗口及取消定时任务。  
 ②这个倒计时窗口肯定是允许取消的，那我们这里就设置了按下任意键就需要取消这个计时，同时移除窗口。但是在电视上面有些按键是在PhoneWindowManager做过处理的，我们的窗口无法响应，所以才有了上面特殊按键拦截的部分代码。这样即使按下关机键也仅仅只是做为一个取消的按键，而不是真的去关机。

## 总结

​        通过这种方式启动的窗口，在所有的应用页面都能看的到，不会因为Activity的生命周期而受到影响。这里需要注意，高版本下Android对服务管理还是很严格的，跳转应用后有可能服务无法正常工作，而我们的窗口也会受到影响，这里需要参考自家项目如何添加白名单去实现这种全局保活窗口的效果。

 

  

本文转自 [https://blog.csdn.net/qq\_36209279/article/details/119422211](https://blog.csdn.net/qq_36209279/article/details/119422211)，如有侵权，请联系删除。