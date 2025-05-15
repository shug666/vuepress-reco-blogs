---
title: 获取屏幕实时sensor角度
date: 2024-09-27
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 获取屏幕实时sensor角度 

这种获取方式要比直接获取屏幕横竖屏状态稳定得多，因为如果手机之前是竖屏关闭自动旋转，横屏时，获取屏幕状态还是竖屏。sensor是真实的物理角度，实现方式如下：

```java
public class MainActivity extends AppCompatActivity {
    OrientationEventListener mOrientationListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        /*ScreenOrientationListener listener = new ScreenOrientationListener(this);
        listener.enable();*/
        mOrientationListener = new OrientationEventListener(this,
                SensorManager.SENSOR_DELAY_NORMAL) {

            @Override
            public void onOrientationChanged(int orientation) {
                if (orientation == OrientationEventListener.ORIENTATION_UNKNOWN) {
                    return;  //手机平放时，检测不到有效的角度
                }
            //可以根据不同角度检测处理，这里只检测四个角度的改变
                if (orientation > 350 || orientation < 10) { //0度
                    orientation = 0;
                } else if (orientation > 80 && orientation < 100) { //90度
                    orientation = 90;
                } else if (orientation > 170 && orientation < 190) { //180度
                    orientation = 180;
                } else if (orientation > 260 && orientation < 280) { //270度
                    orientation = 270;
                } else {
                    return;
                }
                Log.d("wangrui","orientation = "+orientation);
            }
        };

        if (mOrientationListener.canDetectOrientation()) {
            mOrientationListener.enable();
        } else {
            mOrientationListener.disable();
        }
    }
}
```

 

  

本文转自 [https://blog.csdn.net/qq\_27494201/article/details/128327101](https://blog.csdn.net/qq_27494201/article/details/128327101)，如有侵权，请联系删除。