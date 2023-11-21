---
title: android 几种弹框样式 自定义Dialog PopupWindow的使用
date: 2022-12-20
tags:
 - android
categories: 
 - android
sticky: 
   true
---

 

1.弹框的波浪线是动态的 和小度弹框样式相似 用到PopWindow 和自定义View

.![](https://raw.githubusercontent.com/shug666/image/main/images/20190704111153567.jpg)

2.这个弹框是动态的 用于网络加载时候  用到自定义Dialog

![](https://raw.githubusercontent.com/shug666/image/main/images/20190704111459679.png)

3.这就是一简单通用的弹框样式

![](https://raw.githubusercontent.com/shug666/image/main/images/20190704112407676.png)

**第一种弹框实现方式：**
--------------

```java
private void showPopupWindow() {
    View contentView = LayoutInflater.from(MainActivity.this).inflate(R.layout.popuplayout, null);
    mPopWindow = new PopupWindow(contentView,
            ViewGroup.LayoutParams.MATCH\_PARENT, ViewGroup.LayoutParams.WRAP\_CONTENT, true);
    mPopWindow.setFocusable(true);
    mPopWindow.setOutsideTouchable(true);
    mPopWindow.setContentView(contentView);
    TextView tv\_more\_skill = contentView.findViewById(R.id.tv\_more\_skill);
    View rootview = LayoutInflater.from(MainActivity.this).inflate(R.layout.activity\_main, null);
    mPopWindow.showAtLocation(rootview, Gravity.BOTTOM, 0, 0);
}
```

**xml布局 popuplayout**

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout\_width="match\_parent"
    android:layout\_height="wrap\_content"
    android:background="#00000000">

    <RelativeLayout
        android:layout\_width="match\_parent"
        android:layout\_height="wrap\_content"
        android:layout\_marginLeft="16dp"
        android:layout\_marginRight="16dp"
        android:background="@drawable/yuyin\_pop\_shape">

        <ScrollView
            android:layout\_width="match\_parent"
            android:layout\_height="wrap\_content">

            <RelativeLayout
                android:layout\_width="match\_parent"
                android:layout\_height="wrap\_content">

                <com.tsq.junbanpt.aiui.util.VolumeWaveView
                    android:layout\_width="match\_parent"
                    android:layout\_height="120dp"
                    android:layout\_alignParentBottom="true" />

                <TextView
                    android:id="@+id/tv\_more\_skill"
                    android:layout\_width="wrap\_content"
                    android:layout\_height="wrap\_content"
                    android:layout\_marginLeft="16dp"
                    android:layout\_marginTop="15dp"
                    android:text="请说出要搜索小区的名字..."
                    android:textColor="@color/RGB\_FFFFFF"
                    android:textSize="18sp" />

            </RelativeLayout>
        </ScrollView>

    </RelativeLayout>

</RelativeLayout>
```

**自定义View  VolumeWaveView** 

```java
import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Shader;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.View;
import android.view.animation.DecelerateInterpolator;

import java.util.Random;
public class VolumeWaveView extends View {
    private static final String TAG = "VolumeWaveView";
    private static final int HEIGHT = 360;//整个控件的高度

    private static final int HEIGHT1 = 60;//第一层曲线的高度
    private static final int HEIGHT2 = 40;//第二层曲线的高度
    private static final int HEIGHT3 = 50;//第三层曲线的高度

    private int h1 = 0,h2 = 0, h3 = 0,h4 = 0,h5 = 0;

    private int range = 0;//波动的幅度,你可以动态改变这个值，比如麦克风录入的音量的高低

    private Path path;
    private Paint paint1,paint2,paint3,paint4;

    private LinearGradient linearGradient1,linearGradient2,linearGradient3,linearGradient4;//四种渐变色

    private ValueAnimator animator1,animator2,animator3,animator4,animator5;//五种动画


    public VolumeWaveView(Context context) {
        this(context,null);
    }

    public VolumeWaveView(Context context, @Nullable AttributeSet attrs) {
        this(context,attrs,0);
    }

    public VolumeWaveView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs,defStyleAttr);
        initPaint();
        startAnimation();
    }

    /\*\*
     \* 初始化画笔
     \*/
    private void initPaint(){
        path = new Path();

        paint1 = new Paint();
        paint1.setStyle(Paint.Style.FILL);
        paint1.setAntiAlias(true);//抗锯齿
        //渐变色1
        linearGradient1 = new LinearGradient(0, 0, 0, HEIGHT1,
                Color.parseColor("#e652a6d2"), Color.parseColor("#e652d5a1"), Shader.TileMode.MIRROR);
        paint1.setShader(linearGradient1);

        paint2 = new Paint();
        paint2.setAntiAlias(true);//抗锯齿
        paint2.setStyle(Paint.Style.FILL);
        //渐变色2
        linearGradient2 = new LinearGradient(0, 0, 0, HEIGHT2,
                Color.parseColor("#e68952d5"), Color.parseColor("#e6525dd5"), Shader.TileMode.MIRROR);
        paint2.setShader(linearGradient2);


        paint3 = new Paint();
        paint3.setAntiAlias(true);//抗锯齿
        paint3.setStyle(Paint.Style.FILL);
        //渐变色3
        linearGradient3 = new LinearGradient(0, 0, 0, HEIGHT3,
                Color.parseColor("#e66852d5"), Color.parseColor("#e651b9d2"), Shader.TileMode.MIRROR);
        paint3.setShader(linearGradient3);


        paint4 = new Paint();
        paint4.setAntiAlias(true);//抗锯齿
        paint4.setStyle(Paint.Style.FILL);
        //渐变色4
        linearGradient4 = new LinearGradient(0, 0, 0, HEIGHT2,
                Color.parseColor("#e6d5527e"), Color.parseColor("#e6bf52d5"), Shader.TileMode.MIRROR);
        paint4.setShader(linearGradient4);

    }


    /\*\*
     \* draw方法中不要创建大量对象，尽量复用对象
     \* @param canvas
     \*/
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        drawLayer3(canvas);
        drawLayer2(canvas);
        drawLayer1(canvas);

    }

    /\*\*
     \* 绘制第一层
     \* @param canvas
     \*/
    private void drawLayer1(Canvas canvas){
        drawCurve(path,canvas,paint1,getWidth()/5,getWidth()/3,h1);
        drawCurve(path,canvas,paint1,getWidth()/3+getWidth()/5,getWidth()/3,h2);
    }

    /\*\*
     \* 绘制第二层
     \* @param canvas
     \*/
    private void drawLayer2(Canvas canvas){
        drawCurve(path,canvas,paint2,0,getWidth()/2,h3);
        drawCurve(path,canvas,paint4,getWidth()/2-10,getWidth()/2,h4);

    }

    /\*\*
     \* 绘制第三层
     \* @param canvas
     \*/
    private void drawLayer3(Canvas canvas){
        drawCurve(path,canvas,paint3,getWidth()/4,getWidth()/2,h5);
    }


    /\*\*
     \* 画贝塞尔曲线
     \* @param path
     \* @param canvas
     \* @param x 横向起点的位置(用于摆放曲线的左右的位置)
     \* @param width 曲线的整个宽度
     \* @param height 曲线的高度
     \*/
    private void drawCurve(Path path,Canvas canvas,Paint paint,int x,int width,int height){
        path.reset();
        /\*因为这个弧形（类似一个山峰的形状）
         \* 其实就是三个贝塞尔曲线组成；
         \* 而每个贝塞尔曲线需要三个点，三个点连接起来也就是两部分构成；
         \* 所以，这三个贝塞尔曲线就是由六部分组成了（A，B，C，D，E，F，G），
         \* 所以这里就平均分一下，建议用笔在纸上画一下，就晓得了\*\*/
        int subWidth = width/6;//每小部分的宽度
        path.moveTo(x,HEIGHT);//起点 A
        path.quadTo(x+subWidth,HEIGHT-height,x+subWidth\*2,HEIGHT-height\*2);//B - C

        path.lineTo(x+subWidth\*2,HEIGHT-height\*2);//C
        path.quadTo(x+subWidth\*3,HEIGHT-height\*3,x+subWidth\*4,HEIGHT-height\*2);//D - E

        path.lineTo(x+subWidth\*4,HEIGHT-height\*2);// E
        path.quadTo(x+subWidth\*5,HEIGHT-height,x+subWidth\*6,HEIGHT);//F - G

        canvas.drawPath(path,paint);
    }

    /\*\*
     \* 添加属性动画,每一个动画的变化范围和周期都不一样，这样错开的效果才好看点
     \*/
    public void startAnimation() {
        Random random = new Random();
        range = random.nextInt(100)%(100-10+1) + 10;//波动的幅度，模拟动态音量输入，你可以自己设置

        animator1 = ValueAnimator.ofInt(0,HEIGHT1,0);
        animator1.setDuration(1400);
        animator1.setInterpolator(new DecelerateInterpolator());
        //无限循环
        animator1.setRepeatCount(ValueAnimator.INFINITE);
        animator1.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {

            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                h1 = (int) animation.getAnimatedValue();
                invalidate();

            }
        });
        animator1.start();

        animator2 = ValueAnimator.ofInt(0,HEIGHT1,0);
        animator2.setDuration(1700);
        animator2.setInterpolator(new DecelerateInterpolator());
        //无限循环
        animator2.setRepeatCount(ValueAnimator.INFINITE);
        animator2.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {

            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                h2 = (int) animation.getAnimatedValue();
                invalidate();

            }
        });
        animator2.start();



        animator3 = ValueAnimator.ofInt(0,HEIGHT2,0);
        animator3.setDuration(1600);
        animator3.setInterpolator(new DecelerateInterpolator());
        //无限循环
        animator3.setRepeatCount(ValueAnimator.INFINITE);
        animator3.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {

            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                h3 = (int) animation.getAnimatedValue();
                invalidate();

            }
        });
        animator3.start();


        animator4 = ValueAnimator.ofInt(0,HEIGHT2,0);
        animator4.setDuration(1300);
        animator4.setInterpolator(new DecelerateInterpolator());
        //无限循环
        animator4.setRepeatCount(ValueAnimator.INFINITE);
        animator4.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {

            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                h4 = (int) animation.getAnimatedValue();
                invalidate();

            }
        });
        animator4.start();


        animator5 = ValueAnimator.ofInt(0,HEIGHT3,0);
        animator5.setDuration(2000);
        animator5.setInterpolator(new DecelerateInterpolator());
        //无限循环
        animator5.setRepeatCount(ValueAnimator.INFINITE);
        animator5.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {

            @Override
            public void onAnimationUpdate(ValueAnimator animation) {
                h5 = (int) animation.getAnimatedValue();
                invalidate();
            }
        });
        animator5.start();
    }

    /\*\*
     \* 关闭动画
     \*/
    public void removeAnimation(){
        if (animator1 != null){
            animator1.cancel();
            animator1 = null;
        }
        if (animator2 != null){
            animator2.cancel();
            animator2 = null;
        }
        if (animator3 != null){
            animator3.cancel();
            animator3 = null;
        }
        if (animator4 != null){
            animator4.cancel();
            animator4 = null;
        }
        if (animator5 != null){
            animator5.cancel();
            animator5 = null;
        }
    }

}
```

**第二种弹框实现方式**
-------------

```
/\*\*
 \* 自定义dialog
 \*/
```
```java
public class LoadingDialog extends Dialog {

    private Context context;
    private static LoadingDialog dialog;
    private static ImageView ivProgress;
    private static TextView tvText;

    public LoadingDialog(Context context) {
        super(context);
        this.context = context;
    }

    public LoadingDialog(Context context, int themeResId) {
        super(context, themeResId);
        this.context = context;

    }

    //显示dialog的方法
    public static LoadingDialog showDialog(Context context, String msg) {
        dialog = new LoadingDialog(context, R.style.LoadDialog);//dialog样式
        dialog.setContentView(R.layout.dialog\_layout);//dialog布局文件
        tvText = dialog.findViewById(R.id.tvText);
        if (ValidationUtils.isNotEmpty(msg)) {
            tvText.setText(msg);
        }
        ivProgress = dialog.findViewById(R.id.ivProgress);
        dialog.setCanceledOnTouchOutside(false);//点击外部不允许关闭dialog
        return dialog;
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus && dialog != null) {
            startAnimation();
        } else {
            endAnimation();
        }
    }

    @Override
    public void setOnDismissListener(@Nullable OnDismissListener listener) {
        super.setOnDismissListener(listener);
        endAnimation();
    }

    private void startAnimation() {
        Animation animation = AnimationUtils.loadAnimation(context, R.anim.umcsdk\_anim\_loading);
        ivProgress.startAnimation(animation);
    }

    private void endAnimation() {
        Animation animation = AnimationUtils.loadAnimation(context, R.anim.umcsdk\_anim\_loading);
        animation.cancel();
    }
}
```
```
**style LoadDialog样式**
```
```xml
<!-- dialog样式 -->
<style name="LoadDialog" parent="@android:style/Theme.Dialog">
    <item name="android:windowFrame">@null</item>
    <item name="android:windowIsFloating">true</item>
    <item name="android:windowIsTranslucent">true</item>
    <item name="android:windowNoTitle">true</item>
    <item name="android:windowBackground">@android:color/transparent</item>
    <item name="android:backgroundDimEnabled">true</item>
    <item name="android:backgroundDimAmount">0.6</item>
</style>
```

**xml 布局dialog\_layout**

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout\_width="match\_parent"
    android:layout\_height="match\_parent">

    <LinearLayout
        android:layout\_width="wrap\_content"
        android:layout\_height="wrap\_content"
        android:layout\_centerHorizontal="true"
        android:layout\_centerVertical="true"
        android:background="@drawable/sy\_sdk\_shap\_bg"
        android:gravity="center\_horizontal"
        android:orientation="vertical"
        android:padding="15dp">

        <RelativeLayout
            android:layout\_width="wrap\_content"
            android:layout\_height="wrap\_content"
            android:layout\_gravity="center">

            <ImageView
                android:id="@+id/ivProgress"
                android:layout\_width="50dp"
                android:layout\_height="50dp"
                android:layout\_centerInParent="true"
                android:background="@mipmap/loading\_progress" />
        </RelativeLayout>

        <TextView
            android:id="@+id/tvText"
            android:layout\_width="wrap\_content"
            android:layout\_height="wrap\_content"
            android:layout\_marginTop="5dp"
            android:text="网络加载中..."
            android:textSize="16dp" />
    </LinearLayout>
</RelativeLayout>

```

**drawable 背景sy\_sdk\_shap\_bg**

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" >

    <!-- 填充 -->
    <solid android:color="#FFFFFF" /> <!-- 定义填充的颜色值 -->

    <!-- 圆角 -->
    <corners
        android:bottomLeftRadius="5dp"
        android:bottomRightRadius="5dp"
        android:topLeftRadius="5dp"
        android:topRightRadius="5dp" /> <!-- 设置四个角的半径 -->
</shape>
```
```
**mipmap 图片 loading\_progress**
```

![](https://raw.githubusercontent.com/shug666/image/main/images/2019070413370688.png)

```
**anim 动画umcsdk\_anim\_loading**
```
```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android" >

    <rotate
        android:duration="1000"
        android:fromDegrees="0"
        android:pivotX="50%"
        android:pivotY="50%"
        android:repeatCount="-1"
        android:toDegrees="359" />

</set>
```

**代码中使用：**

```java
private LoadingDialog mLoadingDialog;
```

//显示Dialog

```java
public void Dialog() {
    if (mLoadingDialog == null) {
        mLoadingDialog = LoadingDialog.showDialog(this, "");
    }
    mLoadingDialog.show();
}
//显示Dialog传入msg
public void ssDialog(String msg) {
    if (mLoadingDialog == null) {
        mLoadingDialog = LoadingDialog.showDialog(this, msg);
    }
    mLoadingDialog.show();
}
//销毁Dialog
public void hDialog() {
    if (mLoadingDialog != null) {
        mLoadingDialog.dismiss();
    }
}
```

**第三种弹框实现方式：**
--------------

**1.ShowDialog**

```java
public class ShowDialog {

    private FamilyDialog customDialog;

    public ShowDialog() {

    }
    public void show(final Context context, String message, final OnBottomClickListener onBottomClickListener) {
        customDialog = new FamilyDialog(context);
        customDialog.setMessage(message);
        customDialog.setYesOnClickListener("确定", new FamilyDialog.onYesOnClickListener() {
            @Override
            public void onYesClick() {
                if (onBottomClickListener != null) {
                    onBottomClickListener.positive();
                }
                customDialog.dismiss();
            }
        });

        customDialog.setNoOnClickListener("取消", new FamilyDialog.onNoClickListener() {
            @Override
            public void onNoClick() {
                if (onBottomClickListener != null) {
                    onBottomClickListener.negative();
                }
                customDialog.dismiss();
            }
        });
        customDialog.show();

    }
    public void show2(final Context context, String message,String confirm, final OnBottomClickListener onBottomClickListener) {
        customDialog = new FamilyDialog(context);
        customDialog.setMessage(message);
        customDialog.setYesOnClickListener(confirm, new FamilyDialog.onYesOnClickListener() {
            @Override
            public void onYesClick() {
                if (onBottomClickListener != null) {
                    onBottomClickListener.positive();
                }
                customDialog.dismiss();
            }
        });

        customDialog.setNoOnClickListener("取消", new FamilyDialog.onNoClickListener() {
            @Override
            public void onNoClick() {
                if (onBottomClickListener != null) {
                    onBottomClickListener.negative();
                }
                customDialog.dismiss();
            }
        });
        customDialog.show();

    }
    public interface OnBottomClickListener {
        void positive();

        void negative();

    }
}
```

**2.FamilyDialog** 

```java
  private Button yes; //确定按钮
    private Button no; //取消按钮
//    private TextView title; //消息标题文本
    private TextView message; //消息提示文本
    private String titleStr; //从外界设置的title文本
    private String messageStr; //从外界设置的消息文本
    private String yesStr, noStr; //确定文本和取消文本的显示内容
    private Window window = null;
    private onYesOnClickListener yesOnClickListener; //确定按钮被点击了的监听器
    private onNoClickListener noOnClickListener; //取消按钮被点击了的监听器


    public FamilyDialog(@NonNull Context context) {
        super(context, R.style.CustomDialog);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.layout\_dialog\_family);
        //点击dialog以外的空白处是否隐藏
        setCanceledOnTouchOutside(false);
        //初始化界面控件
        initView();
        //初始化界面数据
        initData();
        //初始化界面控件的事件
        initEvent();
        //设置窗口显示
        windowDeploy();
    }

    /\*\*
     \* 初始化界面控件
     \*/
    private void initView() {
        yes = (Button) findViewById(R.id.yes);
        no = (Button) findViewById(R.id.no);
//        title = (TextView) findViewById(R.id.title);
        message = (TextView) findViewById(R.id.message);
    }

    /\*\*
     \* 初始化界面控件的显示数据
     \*/
    private void initData() {
//        if (TextUtils.isEmpty(titleStr)) {
//            title.setText(titleStr);
//        } else {
//            title.setText("应用提示");
//        }
        if (messageStr != null) {
            message.setText(messageStr);
        }
        if (yesStr != null) {
            yes.setText(yesStr);
        }
        if (noStr != null) {
            no.setText(noStr);
        }
    }

    /\*\*
     \* 初始化界面的确定和取消监听器
     \*/
    private void initEvent() {
        //设置确定按钮被点击后，向外界提供监听
        yes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (yesOnClickListener != null) {
                    yesOnClickListener.onYesClick();
                }
            }
        });

        //设置取消按钮被点击后，向外界提供监听
        no.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (noOnClickListener != null) {
                    noOnClickListener.onNoClick();
                }
            }
        });
    }

    private void windowDeploy() {
        window = getWindow();
        window.setGravity(Gravity.CENTER); //设置窗口显示位置
//        window.setWindowAnimations(R.style.dialogWindowAnim); //设置窗口弹出动画
    }

    /\*\*
     \* 设置确定按钮的显示内容和监听
     \*
     \* @param str
     \* @param onYesOnClickListener
     \*/
    public void setYesOnClickListener(String str, onYesOnClickListener onYesOnClickListener) {
        if (str != null) {
            yesStr = str;
        }
        this.yesOnClickListener = onYesOnClickListener;
    }

    /\*\*
     \* 设置取消按钮的显示内容和监听
     \*
     \* @param str
     \* @param onNoClickListener
     \*/
    public void setNoOnClickListener(String str, onNoClickListener onNoClickListener) {
        if (str != null) {
            noStr = str;
        }
        this.noOnClickListener = onNoClickListener;
    }

    /\*\*
     \* 从外界Activity为Dialog设置标题
     \*
     \* @param title
     \*/
    public void setTitle(String title) {
        titleStr = title;
    }

    /\*\*
     \* 从外界Activity为Dialog设置dialog的message
     \*
     \* @param message
     \*/
    public void setMessage(String message) {
        messageStr = message;
    }

    /\*\*
     \* 设置确定按钮和取消被点击的接口
     \*/
    public interface onYesOnClickListener {
        void onYesClick();
    }

    public interface onNoClickListener {
        void onNoClick();
    }
}

```

**3.xml 布局 layout\_dialog\_family**

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout\_width="match\_parent"
    android:layout\_height="match\_parent">

    <LinearLayout
        android:layout\_width="270dp"
        android:layout\_height="wrap\_content"
        android:layout\_centerInParent="true"
        android:background="@drawable/bg\_dialog\_white\_color"
        android:orientation="vertical">


        <TextView
            android:id="@+id/message"
            android:layout\_width="wrap\_content"
            android:layout\_height="wrap\_content"
            android:layout\_gravity="center"
            android:layout\_marginLeft="20dp"
            android:layout\_marginTop="36dp"
            android:layout\_marginRight="20dp"
            android:layout\_marginBottom="30dp"
            android:drawableLeft="@mipmap/icon\_notice"
            android:drawablePadding="5dp"
            android:paddingTop="5dp"
            android:paddingBottom="5dp"
            android:text="提示消息"
            android:textColor="@color/RGB\_000000"
            android:textSize="16sp" />


        <LinearLayout
            android:layout\_width="match\_parent"
            android:layout\_height="48dp"
            android:orientation="horizontal">

            <Button
                android:id="@+id/no"
                android:layout\_width="0dp"
                android:layout\_height="match\_parent"
                android:layout\_weight="1"
                android:background="@drawable/bg\_dialog\_btn\_left"
                android:gravity="center"
                android:singleLine="true"
                android:text="取消"
                android:textColor="@color/RGB\_000000"
                android:textSize="16sp" />

            <Button
                android:id="@+id/yes"
                android:layout\_width="0dp"
                android:layout\_height="match\_parent"
                android:layout\_gravity="center"
                android:layout\_weight="1"
                android:background="@drawable/bg\_dialog\_btn\_right"
                android:singleLine="true"
                android:text="确认"
                android:textColor="@color/RGB\_000000"
                android:textSize="16sp" />

        </LinearLayout>

    </LinearLayout>

</RelativeLayout>

```

**4\. bg\_dialog\_white\_color**

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <corners android:radius="10dp" />

    <solid android:color="@color/RGB\_FFFFFF" />
</shape>
```

**5\. bg\_dialog\_btn\_left**

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <corners android:bottomLeftRadius="10dp" />

    <solid android:color="@color/RGB\_EFEFF4" />
</shape>
```

**6\. bg\_dialog\_btn\_right**

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <corners android:bottomRightRadius="10dp" />

    <solid android:color="@color/primaryColor" />
</shape>
```

**7.style 样式 CustomDialog**

```xml
<!--自定义dialog背景全透明无边框theme -->
<style name="CustomDialog" parent="android:style/Theme.Dialog">
    <!--背景颜色及和透明程度-->
    <item name="android:windowBackground">@android:color/transparent</item>
    <!--是否去除标题 -->
    <item name="android:windowNoTitle">true</item>
    <!--是否去除边框-->
    <item name="android:windowFrame">@null</item>
    <!--是否浮现在activity之上-->
    <item name="android:windowIsFloating">true</item>
    <!--是否模糊-->
    <item name="android:backgroundDimEnabled">true</item>
</style>
```

**8.代码中使用**

```java
new ShowDialog().show(context, "想要写的提示语", new ShowDialog.OnBottomClickListener() {
    @Override
    public void positive() {
        //确定操作
    }

    @Override
    public void negative() {
        //取消操作
    }
});
```

