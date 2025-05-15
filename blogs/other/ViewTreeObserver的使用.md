---
title: ViewTreeObserver的使用
date: 2024-06-18
tags:
 - android
categories: 
 - android
sticky: 
   true 
---

## 简介

`ViewTreeObserver` 是一个观察者模式的类，用于监听 View 树中的变化事件，例如 View 的大小、位置、可见性等。可以使用 `View.getViewTreeObserver()` 方法获取一个 ViewTreeObserver 对象，并使用它来监听 View 树中的变化事件。

下面是一个使用 ViewTreeObserver 监听 View 大小变化的示例代码：

```java
public class MyView extends View {

    private int width;
    private int height;

    public MyView(Context context, AttributeSet attrs) {
        super(context, attrs);
        // 获取 ViewTreeObserver 对象
        ViewTreeObserver observer = getViewTreeObserver();
        observer.addOnGlobalLayoutListener(new OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                // 当 View 布局发生变化时，更新宽度和高度值
                width = getWidth();
                height = getHeight();
                // 这里需要移除监听器，否则会多次调用 onGlobalLayout() 方法
                observer.removeOnGlobalLayoutListener(this);
            }
        });
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        // 在画布上绘制一个矩形，大小与 View 相同
        Paint paint = new Paint();
        paint.setColor(Color.RED);
        canvas.drawRect(0, 0, width, height, paint);
    }
}
```

在上述代码中，我们首先获取`ViewTreeObserver` 对象，并通过`addOnGlobalLayoutListener()`方法添加一个全局布局监听器。在监听器的回调方法中，我们更新 width 和 height 变量的值，以反映 View 布局的变化。注意，在更新完变量值之后，我们需要使用`removeOnGlobalLayoutListener()`方法手动移除监听器，以避免多次调用回调方法。

在 `onDraw()` 方法中，我们使用 width 和 height 变量的值来绘制一个矩形，以便验证 View 大小的变化。

### 在Activity 里面使用

在 Activity 中，可以使用以下代码来监听 View 的变化事件：

```java
public class MyActivity extends AppCompatActivity {

    private View myView;
    private int width;
    private int height;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        myView = findViewById(R.id.my_view);

        ViewTreeObserver observer = myView.getViewTreeObserver();
        observer.addOnGlobalLayoutListener(new OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                // 当 View 布局发生变化时，更新宽度和高度值
                width = myView.getWidth();
                height = myView.getHeight();
                // 这里需要移除监听器，否则会多次调用 onGlobalLayout() 方法
                myView.getViewTreeObserver().removeOnGlobalLayoutListener(this);
            }
        });
    }
}
```

以上代码中，我们首先获取`myView`的引用，并使用`getViewTreeObserver()`方法获取一个 `ViewTreeObserver` 对象。然后，使用 `addOnGlobalLayoutListener()` 方法添加一个全局布局监听器，当 myView 的布局发生变化时，回调`onGlobalLayout()`方法。在回调方法中，我们通过 `getWidth()` 和 `getHeight()` 方法获取 myView 的宽度和高度，并将其保存到 width 和 height 变量中。最后，我们使用 `removeOnGlobalLayoutListener()` 方法手动移除监听器，以避免多次调用回调方法。

需要注意的是，如果监听器需要在 Activity 生命周期的不同阶段进行注册和注销，请分别在 onCreate() 和 onDestroy() 或 onResume() 和 onPause() 等对应的生命周期方法中进行相应的操作。

### 在Fragment使用

在 Fragment 中，可以这样实现 ：

```java
public class MyFragment extends Fragment {

    private View myView;
    private int width;
    private int height;

    private MyGlobalLayoutListener listener;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_my, container, false);
        myView = view.findViewById(R.id.my_view);

        listener = new MyGlobalLayoutListener();
        myView.getViewTreeObserver().addOnGlobalLayoutListener(listener);
        
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (myView != null && listener != null) {
            myView.getViewTreeObserver().removeOnGlobalLayoutListener(listener);
        }
    }

    private class MyGlobalLayoutListener implements ViewTreeObserver.OnGlobalLayoutListener {
        @Override
        public void onGlobalLayout() {
            width = myView.getWidth();
            height = myView.getHeight();
            myView.getViewTreeObserver().removeOnGlobalLayoutListener(this);
        }
    }
}
```

在上述代码中，我们使用一个单独的`MyGlobalLayoutListener`类来实现 `OnGlobalLayoutListener` 接口，并将其注册到 myView 的 `ViewTreeObserver` 上。在 `MyFragment.onDestroyView()` 方法中，我们手动移除该监听器以避免内存泄漏问题。

 

  

本文转自 [https://blog.csdn.net/qq\_43358469/article/details/131231927](https://blog.csdn.net/qq_43358469/article/details/131231927)，如有侵权，请联系删除。