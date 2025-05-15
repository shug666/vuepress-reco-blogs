---
title: Android代码规范文档
date: 2024-08-30
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 目录

* [代码规范原则](#代码规范原则)
* [常规规范](#常规规范)
* [后台接口规范](#后台接口规范)
* [变量命名规范](#变量命名规范)
* [包名命名规范](#包名命名规范)
* [方法命名规范](#方法命名规范)
* [类文件命名规范](#类文件命名规范)
* [接口文件命名规范](#接口文件命名规范)
* [代码嵌套规范](#代码嵌套规范)
* [接口实现规范](#接口实现规范)
* [异常捕获规范](#异常捕获规范)
* [参数传递规范](#参数传递规范)
* [代码美观性要求](#代码美观性要求)
* [第三方框架使用规范](#第三方框架使用规范)
* [多模块规范](#多模块规范)
* [代码注释规范](#代码注释规范)
* [代码硬编码规范](#代码硬编码规范)
* [布局文件命名规范](#布局文件命名规范)
* [资源文件命名规范](#资源文件命名规范)
* [String ID 命名规范](#string-id-命名规范)
* [Color ID 命名规范](#color-id-命名规范)
* [Anim ID 命名规范](#anim-id-命名规范)
* [View ID 命名规范](#view-id-命名规范)
* [Style 命名规范](#style-命名规范)
* [XML 编码规范](#xml-编码规范)
* [预览属性约定](#预览属性约定)
* [资源硬编码规范](#资源硬编码规范)
* [版本名和版本码规范](#版本名和版本码规范)
* [Git 版本管理规范](#git-版本管理规范)

## 代码规范原则

* 在讲之前，我们先思考一个问题，代码规范的出现是为了什么？不就为了让我们更好地进行团队协作和项目维护吗？没错的，所以代码规范原则应该围绕这两个目标进行。

    * **特事特办**：代码规范文档只能解决 **99%** 场景下的问题，特殊情况应该要特殊处理，违背者需要给出**合理的解释**，建议在代码中直接**用注释注明**，这样可以**减少沟通成本**，否则在一般情况下应当要遵守代码规范文档上的约束。

    * **以人为本**：我们应该衡量不同写法带来的优点和缺点，然后根据当前项目的实际需求做出合适的选择或者变化。规则是人定的，不是**一成不变**的。在制定新的规则或者修改旧的规则之前应当先**参考和分析**谷歌或者知名公司的做法，然后与团队中的各个成员**沟通和协商好**。
    
    * **实事求事**：任何代码规范都应该追求在实际开发中发挥的作用或者效果，规则始终是规则，不能单纯为了制定规则而编写代码规范，而是更应该追求写法的实用性，实用性应该从**代码理解的难易程度**、**代码可维护性**、**代码可复用性**、**代码可扩展性**等方面因素综合考虑，其次是考虑**代码的视觉美观性**。

## 常规规范

* 使用 **0px** 代替 **0dp**，这样就可以在获取时避免系统进行换算，提升代码的执行效率。

* 字符串比较，应该用 `"xxx".equals(object)`，而不应该用 `object.equals("xxx")`，因为 **object** 对象可能为空，我们应该把不为空的条件放置在表达式的前面。

* 字符串类型转换，应该用 `String.valueOf(Object object)` 来代替 `object.toString()`，因为 `object` 对象可能会为空， 直接调用 `toString` 方法可能会触发 `NullPointerException`，而 `valueOf` 方法内部有做判空处理。 

* **long** 类型的常量应该以大写英文 **L** 结尾，而不应该用小写英文 **l**，因为小写英文的 **l** 会和数字 **1** 容易造成一些混淆，例如 **1l** 会被看成 **11**，而使用 **1L** 就不会出现这种情况。

* 尽量采用 **switch case** 来判断，如果不能实现则再考虑用 **if else**，因为在多条件下使用 **switch case** 语句判断会更加简洁。

* 严禁用 **switch case** 语句来判断资源 id，因为 Gradle 在 5.0 之后的版本，资源 ID 将不会以常量的形式存在，而 **switch case** 语句只能判断常量，所以不能再继续使用 **switch case** 来判断资源 ID 了。

* 不推荐用 **layout_marginLeft**，而应该用 **layout_marginStart**；不推荐用 **layout_marginRight**，而应该用 **layout_marginEnd**，原因有两个，一个是适配 Android 4.4 **反方向特性**（可在开发者选项中开启），第二个是 XML 布局中使用 **layout_marginLeft** 和 **layout_marginRight** 会有代码警告，**padding** 属性也是同理，这里不再赘述。另外有一点需要注意：严禁 **Left、Right** 属性和 **Start、End** 属性同时使用，两者只能二选一。

* 如果在 **layout_marginStart** 和 **layout_marginEnd** 的值相同的情况下，请替换使用 **layout_marginHorizontal**，而 **layout_marginTop** 和 **layout_marginBottom** 也同理，请替换使用 **layout_marginVertical**，能用一句代码能做的事不要写两句，**padding** 属性也是同理，这里不再赘述。

* **过期** 和 **高版本** 的 API 一定要做对应的兼容（包含 Java 代码和 XML 属性），如果不需要兼容处理的，需要对警告进行抑制。

* 在能满足需求的情况下，尽量用 **invisible** 来代替 **gone**，因为 **gone** 会触发当前整个 View 树进行重新测量和绘制。

* **api** 和 **implementation**，在能满足使用的情况下，优先选用 **implementation**，因为这样可以[减少一些编译时间](https://www.jianshu.com/p/8962d6ba936e)。

* **ListView** 和 **RecyclerView** 都能实现需求的前提下，优先选用 **RecyclerView**，具体原因不解释，大家应该都懂。

* **ScrollView** 和 **NestedScrollView** 都能实现需求的前提下，优先选用 **NestedScrollView**，是因为 **NestedScrollView** 和 **RecyclerView** 支持相互嵌套，而 **ScrollView** 是不支持嵌套滚动的。

* 不能在项目中创建副本文件，例如创建 `HomeActivity2.java`、`home_activity_v2.xml` 类似的副本文件，因为这样不仅会增加项目的维护难度，同时对编译速度也会造成一定的影响，正确的做法应该是在原有的文件基础上面修改，如果出现需求变更的情况，请直接使用 **Git** 或者 **SVN** 进行版本回退。

* 如果一个类不需要被继承，请直接用 **final** 进行修饰，如果一个字段在类初始化过程中已经赋值并且没有地方进行二次赋值，也应当用 **final** 修饰，如果一个字段不需要被外部访问，那么需要用 **private** 进行修饰。

* 时间间隔的计算，对于前后时间的获取，不推荐使用 `System.currentTimeMillis()` 来获取，因为用户随时可能会调整手机的日期，这样会导致计算出来的时间间隔不准确，推荐使用 `SystemClock.uptimeMillis()` 来获取，此 API 用于获取本次已开机的毫秒数，用户就算调整了手机的日期也没有任何影响；值得一提的是，**Handler** 类中的 `postDelayed` 方法也是采用这种方式实现。

* 每个小组成员应当安装[阿里巴巴代码约束插件](https://plugins.jetbrains.com/plugin/10046-alibaba-java-coding-guidelines)，并及时地对插件所提示的**代码警告**进行处理或者抑制警告。

* 应用图标应该放在 **mipmap** 目录下，其他图片资源应当放到 **drawable** 目录下，具体原因可以看[谷歌官方文档](https://developer.android.google.cn/guide/topics/resources/providing-resources)对这两个文件夹给出的介绍：

|     目录    |                         资源类型                               |
| :--------: | :-----------------------------------------------------------: |
| **drawable** | 位图文件（`.png`、`.9.png`、`.jpg`、`.gif`）或编译为以下可绘制对象资源子类型的 XML 文件：位图文件九宫格（可调整大小的位图）状态列表形状动画可绘制对象其他可绘制对象请参阅 [Drawable 资源](https://developer.android.google.cn/guide/topics/resources/drawable-resource)。 |
|  **mipmap**   | 适用于不同启动器图标密度的可绘制对象文件。如需了解有关使用 `mipmap` 文件夹管理启动器图标的详细信息，请参阅[管理项目概览](https://developer.android.google.cn/tools/projects#mipmap)。 |

## 后台接口规范

* 后台返回的 **id 值**，不要使用 **int** 或者 **long** 类型来接收，而应该用 **string** 类型来接收，因为我们不需要对这个 **id 值**进行运算，所以我们不需要关心它是什么类型的。

* 后台返回的**金额数值**应该使用 **String** 来接收，而不能用**浮点数**来接收，因为 **float** 或者 **double** 在数值比较大的情况下会容易丢失精度，并且还需要自己手动转换出想要保留的小数位，最好的方式是后台返回什么前端就展示什么，而到了运算的时候，则应该用 **BigDecimal** 类来进行转换和计算，当然金额在前端一般展示居多，运算的情况还算是比较少的。

* 我们在定义后台返回的 Bean 类时，不应当将一些我们没有使用到的字段添加到代码中，因为这样会消耗性能，因为 Gson 是通过**反射**将后台字段赋值到 Java 字段中，所以我们应当避免一些不必要的字段解析，另外臃余的字段也会给我们排查问题造成一定的阻碍。

* 如果后台给定的字段名不符合代码命名的时候，例如当遇到 `student_name` 这种命名时，我们应当使用 Gson 框架中的 **@SerializedName** 注解对字段进行映射。

* 请求的接口参数和返回字段必须要写上注释，除此之外还应该备注对应的后台接口文档地址，以便我们后续能够更好地进行维护和迭代。

* 后台返回的 Bean 类字段不能直接访问，而应该通过生成 **Get** 方法，然后使用这个 **Get** 方法来访问字段。

* 接口请求成功的提示可以不显示，但请求失败的提示需要显示给到用户，否则会加大排查问题的难度，也极有可能会把问题掩盖掉，从而导致问题遗留到线上去。

* 如果用的 Json 解析框架是 Gson，则建议进行容错处理，秉持不信任后台的原则，因为我们没有办法控制后台返回了什么数据结构，但是我们有办法保证应用不会为这个问题而导致崩溃。

## 变量命名规范

* **严禁使用中文或者中文拼音**进行重命名

* 遵循 **lowerCamelCase（驼峰式）命名风格**（单词最好控制在三个以内）

* 变量应该以作用来命名，例如：

```java
String name;
TextView nameView;
FrameLayout nameLayout;
```

```java
// 命名规范附带技巧（当布局中同个类型的控件只有一个的时候，也可以这样命名）
TextView textView;
RecyclerView recyclerView;
```

* 布尔值命名规范，无论是局部变量还是成员变量，都不应该携带 **is**，例如：

```java
// 不规范写法示例
boolean isDebug;
```

```java
// 规范写法示例
boolean debug;
```

* 常量则需要用大写，并且用下划线代替驼峰，例如：

```java
static final String REQUEST_INSTALL_PACKAGES;
```

* 有细心的同学可能会发现一个问题，Android 源码中私有字段都是以 `m` 开头，而静态字段都是以 `s` 开头，其实这种是 AOSP 的源码规范，这样的写法也算规范的，大家可以自行抉择，但是建议组内统一。

* 另外如果是在 Kotlin 类中，字段名则不能以 `m` 或者 `s` 开头，因为这样写是不规范的，因为作者翻阅了 AndroidX 的源码，发现里面写的 Kotlin 代码中的字段已经没有了 `m` 或者 `s` 开头的字段，但是 Java 代码中仍然有保留着这种写法。

## 包名命名规范

* 不允许包名中携带**英文大写**

* 包名应该以**简洁的方式**命名

* 包名要按照**模块**或者**作用**来划分

* 请不要在某一包名下放置**一些无关的类**

## 方法命名规范

* initXX：初始化相关方法，使用 **init** 为前缀标识，如初始化布局 **initView**

* isXX：方法返回值为 boolean 型的请使用 **is** 或 **check** 为前缀标识

* getXX：返回某个值的方法，使用 **get** 为前缀标识，例如 **getName**

* setXX：设置某个属性值，使用 **set** 为前缀标识，例如 **setName**

* handleXX/processXX：对数据进行处理的方法，例如 **handleMessage**

* displayXX/showXX：弹出提示框和提示信息，例如 **showDialog**

* updateXX：更新某个东西，例如 **updateData**

* saveXX：保存某个东西，例如 **saveData**

* resetXX：重置某个东西，例如 **resetData**

* clearXX：清除某个东西，例如 **clearData**

* removeXX：移除数据或者视图等，例如 **removeView**

* drawXX：绘制数据或效果相关的，使用 **draw** 前缀标识，例如 **drawText**

## 类文件命名规范

* 业务模块：请以 **模块 + 类型** 来命名，例如：

```text
HomeActivity.java

SettingFragment.java

HomeAdapter.java

AddressDialog.java
```

* 技术模块：请以类的 **作用** 来命名，例如：

```text
CrashHandler.java

GridSpaceDecoration.java

PickerLayoutManager.java
```

## 接口文件命名规范

* 如果是监听事件可以参考 **View** 的写法及命名：

```java
public class View {

    private View.OnClickListener listener;

    public void setOnClickListener(OnClickListener listener) {
        this.listener = listener;
    }

    public interface OnClickListener {

        void onClick(View v);
    }
}
```

* 如果是回调事件可以参考 **Handler** 的写法及命名：

```java
public class Handler {

    public interface Callback {

        boolean handleMessage(Message msg);
    }
}
```

* 至于接口写在内部还是外部，具体可以视实际情况而定，如果功能比较庞大，就可以考虑抽取成外部的，只作用在某个类上的，则就可以直接写成内部的。

## 代码嵌套规范

* 代码嵌套很深一直以来是一个很头疼的问题，其实它也算一种代码不规范写法的表现，那么如何写代码才能降低代码逻辑嵌套呢？

```java
// 不规范写法示例
public void test(Object a, Object b, Object c) {
    if (a != null) {
        if (b != null) {
            if (c != null) {
                System.out.println("所有对象不为空");
            } else {
                System.out.println("对象 C 为空");
            }
        } else {
            System.out.println("对象 B 为空");
        }
    } else {
        System.out.println("对象 A 为空");
    }
}
```

```java
// 规范写法示例
public void test(Object a, Object b, Object c) {
    if (a == null) {
        System.out.println("对象 A 为空");
        return;
    }

    if (b == null) {
        System.out.println("对象 B 为空");
        return;
    }

    if (c == null) {
        System.out.println("对象 C 为空");
        return;
    }

    System.out.println("所有对象不为空");
}
```

* 先让我们对比一下这两种写法，是不是觉得第一种写法可读性比较差？而第二种写法可读性比较强？

* 我们应该遵循少写 `else` ，多用 `return` 语句的原则，这样就能降低代码之间的相互嵌套，提升代码的可读性。

* 这个时候大家可能有疑问了，循环没有 `return` 语句怎么办？这个问题很简单，大家可以用 `continue` 或者 `break` 来代替，其实都是换汤不换药，这里不再赘述。

* 另外不是说存在嵌套就一定不好，还有一种情况，减少代码嵌套时需要写很多重复代码，这种就需要大家根据实际情况做选择了。

## 接口实现规范

* 一般情况下，我们会在类中这样实现接口，这样写的好处是，可以减少对象的创建，并且代码也比较美观。

```java
public final class PasswordEditText extends EditText implements View.OnTouchListener, View.OnFocusChangeListener, TextWatcher {

    public PasswordEditText(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        setOnTouchListener(this);
        setOnFocusChangeListener(this);
        addTextChangedListener(this);
    }

    @Override
    public void onFocusChange(View view, boolean hasFocus) {
        ......
    }

    @Override
    public boolean onTouch(View view, MotionEvent event) {
        ......
    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {
        ......
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {
        ......
    }

    @Override
    public void afterTextChanged(Editable s) {
        ......
    }
}
```

* 但是有两个美中不足的地方，就是在实现的接口过多时，我们很难分辨是哪个方法是哪个接口的，这个时候可以使用注释的方式来解决这个问题，加上 **@link** 还可以帮助我们快速定位接口类在项目中所在的位置；另外一个是 **implements** 修饰符换行的问题，合理的换行会使代码更加简单直观。

```java
public final class PasswordEditText extends EditText
        implements View.OnTouchListener,
        View.OnFocusChangeListener, TextWatcher {

    public PasswordEditText(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        setOnTouchListener(this);
        setOnFocusChangeListener(this);
        addTextChangedListener(this);
    }

    /**
     * {@link OnFocusChangeListener}
     */

    @Override
    public void onFocusChange(View view, boolean hasFocus) {
        ......
    }

    /**
     * {@link OnTouchListener}
     */

    @Override
    public boolean onTouch(View view, MotionEvent event) {
        ......
    }

    /**
     * {@link TextWatcher}
     */

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {
        ......
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {
        ......
    }

    @Override
    public void afterTextChanged(Editable s) {
        ......
    }
}
```

## 异常捕获规范

* 请不要使用此方式捕获异常，因为这种方式会把问题给隐藏掉，从而会加大后续排查问题的难度。

```java
try {
    Xxx.xxx();
} catch (Exception e) {}
```

* 如需捕获异常，请用以下方式进行捕获，列出具体的异常类型，并在代码中输出对应的堆栈信息。

```java
// 捕获这个异常，避免程序崩溃
try {
    // 目前发现在 Android 7.1 主线程被阻塞之后弹吐司会导致崩溃，可使用 Thread.sleep(5000) 进行复现
    // 查看源码得知 Google 已经在 Android 8.0 已经修复了此问题
    // 主线程阻塞之后 Toast 也会被阻塞，Toast 因为显示超时导致 Window Token 失效
    mHandler.handleMessage(msg);
} catch (WindowManager.BadTokenException | IllegalStateException e) {
    // android.view.WindowManager$BadTokenException：Unable to add window -- token android.os.BinderProxy is not valid; is your activity running?
    // java.lang.IllegalStateException：View android.widget.TextView has already been added to the window manager.
    e.printStackTrace();
    // 又或者上报到 Bugly 错误分析中
    // CrashReport.postCatchedException(e);
}
```

* 如果这个异常不是通过方法 throws 关键字抛出，则需要在 try 块中说明崩溃的缘由，并注明抛出的异常信息。

* 还有一个问题，有异常就一定要 `try catch` ？，这种想法其实是错的，例如我们项目用 Glide 加载图片会抛出以下异常：

```java
Caused by: java.lang.IllegalArgumentException: You cannot start a load for a destroyed activity
   at com.bumptech.glide.manager.RequestManagerRetriever.assertNotDestroyed(RequestManagerRetriever.java:348)
   at com.bumptech.glide.manager.RequestManagerRetriever.get(RequestManagerRetriever.java:148)
   at com.bumptech.glide.Glide.with(Glide.java:826)
```

* 这是因为 Activity 的销毁了而去加载图片导致的（场景：异步执行图片加载），大多人的解决方式可能是：

```java
try {
    // Activity 销毁后执行加载图片会触发 crash
    Glide.with(this)
            .load(url)
            .into(mImageView);
} catch (IllegalArgumentException e) {
    // java.lang.IllegalArgumentException: You cannot start a load for a destroyed activity
    e.printStackTrace();
}
```

* 虽然这种方式可以解决 **crash** 的问题，但是显得**不够严谨**，Glide 抛异常给外层，其实无非就想告诉调用者，调用的时机错了，正确的处理方式不是直接捕获这个异常，而是应该在外层做好逻辑判断，避免会进入出现 **crash** 的代码，正确的处理示例如下：

```java
if (isFinishing() || isDestroyed()) {
   // Glide：You cannot start a load for a destroyed activity
    return;
}
Glide.with(this)
        .load(url)
        .into(mImageView);
```

* 所以尽量不要通过捕获的方式来处理异常，除非外层真的判断不了，否则应该通过一些逻辑判断来避免进入一些会 **crash** 的代码。

## 参数传递规范

* 如果跳转的 Activity 需要传递参数，应该在目标的 Activity 中定义静态的 **start** 又或者 **newIntent** 方法。

```java
public final class WebActivity extends Activity {

    private static final String INTENT_KEY_URL = "url";

    public static void start(Context context, String url) {
        Intent intent = new Intent(context, WebActivity.class);
        intent.putExtra(INTENT_KEY_URL, url);
        context.startActivity(intent);
    }
}
```

```java
public final class WebActivity extends Activity {

    private static final String INTENT_KEY_URL = "url";

    public static Intent newIntent(Context context, String url) {
        Intent intent = new Intent(context, WebActivity.class);
        intent.putExtra(INTENT_KEY_URL, url);
        return intent;
    }
}
```

* 如果创建的 Fragment 需要传递参数，应该在目标的 Fragment 中定义静态的 **newInstance** 方法

```java
public final class WebFragment extends Fragment {

    private static final String INTENT_KEY_URL = "url";

    public static WebFragment newInstance(String url) {
        WebFragment fragment = new WebFragment();
        Bundle bundle = new Bundle();
        bundle.putString(INTENT_KEY_URL, url);
        fragment.setArguments(bundle);
        return fragment;
    }
}
```

* 如果跳转的 Activity 或者创建的 Fragment 不需要传任何参数，可以不需要定义这些静态方法。

* 另外如果一个界面需要传递的参数过多（一般 5 个以上），建议用一个对象对这些参数进行封装，然后实现 Serializable 或者 Parcelable 接口进行传递，具体写法示例：

```java
public final class VideoPlayActivity extends Activity {

    private static final String INTENT_KEY_PARAMETERS = "parameters";

    /**
     * 播放参数构建
     */
    public static final class Builder implements Parcelable {

        /** 视频源 */
        private String videoSource;
        /** 视频标题 */
        private String videoTitle;
        /** 播放进度 */
        private int playProgress;
        /** 手势开关 */
        private boolean gestureEnabled = true;
        /** 循环播放 */
        private boolean loopPlay = false;
        /** 自动播放 */
        private boolean autoPlay = true;
        /** 播放完关闭 */
        private boolean autoOver = true;

        public Builder() {}

        public Builder setVideoSource(File file) {
            this.videoSource = file.getPath();
            if (this.videoTitle == null) {
                this.videoTitle = file.getName();
            }
            return this;
        }

        public Builder setVideoSource(String url) {
            this.videoSource = url;
            return this;
        }

        public Builder setVideoTitle(String title) {
            this.videoTitle = title;
            return this;
        }

        public Builder setPlayProgress(int progress) {
            this.playProgress = progress;
            return this;
        }

        public Builder setGestureEnabled(boolean enabled) {
            this.gestureEnabled = enabled;
            return this;
        }

        public Builder setLoopPlay(boolean enabled) {
            this.loopPlay = enabled;
            return this;
        }

        public Builder setAutoPlay(boolean enabled) {
            this.autoPlay = enabled;
            return this;
        }

        public Builder setAutoOver(boolean enabled) {
            this.autoOver = enabled;
            return this;
        }

        public void start(Context context) {
            Intent intent = new Intent(context, VideoPlayActivity.class);
            intent.putExtra(INTENT_KEY_PARAMETERS, this);
            if (!(context instanceof Activity)) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            }
            context.startActivity(intent);
        }
    }
}
```

```java
new VideoPlayActivity.Builder()
        .setVideoTitle("速度与激情特别行动")
        .setVideoSource("http://xxxxx.mp4")
        .start(getAttachActivity());
```

## 代码美观性要求

* if 语句后面应该加上大括号，而不应该将判断和处理的逻辑在同一行做处理，例如：

```java
// 不规范写法示例
if (AppConfig.isDebug()) return;
```

```java
// 规范写法示例
if (AppConfig.isDebug()) {
    return;
}
```

* 大括号应当统一放在表达式后面，而不应该换行处理，例如：

```java
// 不规范写法示例
if (AppConfig.isDebug())
{
    ......
}
```

```java
// 规范写法示例
if (AppConfig.isDebug()) {
    ......
}
```

* 代码之间应当有适当的空格，空格不用多也不能少，恰到好处即可，例如：

```java
// 不规范写法示例
public static boolean isAppInstalled(Context context ,String packageName ){
    try {
      context.getPackageManager() .getApplicationInfo(packageName,0);
       return   true;
    }catch( PackageManager.NameNotFoundException e ){
        e.printStackTrace();
        return false ;
    }
}
```

```java
// 规范写法示例
public static boolean isAppInstalled(Context context, String packageName) {
    try {
        context.getPackageManager().getApplicationInfo(packageName, 0);
        return true;
    } catch (PackageManager.NameNotFoundException e) {
        e.printStackTrace();
        return false;
    }
}
```

* 适当换行有助于提升代码的可读性，在单行代码较长的情况下可以考虑适当换行，例如：

```java
// 不规范写法示例
ScaleAnimation animation = new ScaleAnimation(1.0f, 1.1f, 1.0f, 1.1f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
textView.startAnimation(animation);
```

```java
// 规范写法示例
ScaleAnimation animation = new ScaleAnimation(1.0f, 1.1f, 1.0f, 1.1f,
        Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
textView.startAnimation(animation);
```

* 链式写法不能只用一行代码，而是应当遵守一句 API 换一行的策略，例如：

```java
// 不规范写法示例
GlideApp.with(this).load(url).circleCrop().into(imageView);
```

```java
// 规范写法示例
GlideApp.with(this)
        .load(url)
        .circleCrop()
        .into(imageView);
```

* 方法参数的排序，上下文参数应当统一放在最前面，而回调监听应当统一放在最后面，例如：

```java
public void openSystemFileChooser(Activity activity, FileChooserParams params, ValueCallback<Uri[]> callback) {
    ......
}
```

* 一个类里面的内容，应该按照以下规则来排序，从上往下排序：

    1. 常量

    2. 静态变量

    3. 静态方法

    4. 类字段

    5. 构造函数

    6. 重载方法

    7. 普通方法

    8. 内部类

    9. 接口类

* 另外不同变量和方法的排序，应当根据重要程度、API 类型、执行顺序这几点来摆放，例如：

```java
// 变量排序示例
public class BaseDialog {

    public static class Builder<B extends BaseDialog.Builder<?>>

        /** 宽度和高度 */
        private int width = WindowManager.LayoutParams.WRAP_CONTENT;
        private int height = WindowManager.LayoutParams.WRAP_CONTENT;

        /** 是否能够被取消 */
        private boolean cancelable = true;
        /** 点击空白是否能够取消  前提是这个对话框可以被取消 */
        private boolean canceledOnTouchOutside = true;

        /** 背景遮盖层开关 */
        private boolean backgroundDimEnabled = true;
        /** 背景遮盖层透明度 */
        private float backgroundDimAmount = 0.5f;

        /** Dialog 创建监听 */
        private BaseDialog.OnCreateListener createListener;
        /** Dialog 显示监听 */
        private final List<BaseDialog.OnShowListener> showListeners = new ArrayList<>();
        /** Dialog 取消监听 */
        private final List<BaseDialog.OnCancelListener> cancelListeners = new ArrayList<>();
        /** Dialog 销毁监听 */
        private final List<BaseDialog.OnDismissListener> dismissListeners = new ArrayList<>();
        /** Dialog 按键监听 */
        private BaseDialog.OnKeyListener keyListener;
    }
}
```

```java
// 方法排序示例
public class BaseDialog {

    public static class Builder<B extends BaseDialog.Builder<?>>

        /**
         * 设置宽度
         */
        public B setWidth(int width) {
            ......
        }

        /**
         * 设置高度
         */
        public B setHeight(int height) {
            ......
        }

        /**
         * 是否可以取消
         */
        public B setCancelable(boolean cancelable) {
            ......
        }

        /**
         * 是否可以通过点击空白区域取消
         */
        public B setCanceledOnTouchOutside(boolean cancel) {
            ......
        }

        /**
         * 设置背景遮盖层开关
         */
        public B setBackgroundDimEnabled(boolean enabled) {
            ......
        }

        /**
         * 设置背景遮盖层的透明度（前提条件是背景遮盖层开关必须是为开启状态）
         */
        public B setBackgroundDimAmount(float dimAmount) {
            ......
        }

        /**
         * 设置创建监听
         */
        public B setOnCreateListener(BaseDialog.OnCreateListener listener) {
            ......
        }

        /**
         * 添加显示监听
         */
        public B addOnShowListener(BaseDialog.OnShowListener listener) {
            ......
        }

        /**
         * 添加取消监听
         */
        public B addOnCancelListener(BaseDialog.OnCancelListener listener) {
            ......
        }

        /**
         * 添加销毁监听
         */
        public B addOnDismissListener(BaseDialog.OnDismissListener listener) {
            ......
        }

        /**
         * 设置按键监听
         */
        public B setOnKeyListener(BaseDialog.OnKeyListener listener) {
            ......
        }
    }
}
```

* 代码美观性虽然不会干扰到业务的正常进行，但是对一个程序员来讲，是代码品质的一种追求，同时也是工匠精神的体现。

## 第三方框架使用规范

* 集成一些第三方框架或者 SDK，必须注明框架的作用及出处，以便出现问题时能够快速核查和反馈。

```groovy
// 权限请求框架：https://github.com/getActivity/XXPermissions
implementation 'com.github.getActivity:XXPermissions:16.6'
```

* 尽量不要选择功能两套相同的框架，应当引用最合适的一套框架进行开发。

* 使用第三方库必须要依赖指定的版本号，而不能使用 `latest.release` 或者  `+` 来指定依赖库最新的版本号。

* 使用第三方开源库出现问题或者 Bug 时应及时通知到开源库的作者，如果没有及时回复就根据实际情况对问题进行修复。

* 尽量避免 Copy 第三方库的技术代码到项目中，特别是在放置到项目业务模块中，因为这样会增加项目的复杂度，从而降低可维护性。

* 如果出现问题不能找到开源库的作者，如果需要修改，应当将这些代码抽取到单独的 Module 中。

* 能用框架就用成熟框架，尽量不要自己编写或者修改框架，如果有需要，要对这块进行严格测试。

## 多模块规范

* 模块命名规范：应该以简单明了的方式来命名

```text
app
base
widget
umeng
course
socket
live
shop
```

* 模块混淆配置：请不要使用 `proguardFiles` 语句，而是应该使用 `consumerProguardFiles` 语句，因为 `consumerProguardFiles` 语句会将混淆规则和资源代码一同打包到 **aar** 包中，这样做的好处在于：在项目编译时会将 aar 包中的混淆规则合并到主模块中。

```groovy
android {

    defaultConfig {
        // 模块混淆配置
        consumerProguardFiles 'proguard-xxx.pro'
    }
}
```

* 资源前缀限制：我们应该在模块中加入此限制，这样我们在模块中添加资源时，编译器如果发现资源名称前缀不符合规范，则会出现代码警告。这样做的好处在于，以某一名称作为前缀，可以有效避免在编译时引发的一些资源合并冲突。

```groovy
android {
    // 资源前缀限制
    resourcePrefix "xxx_"
}
```

* 框架版本管理：我们应该统一抽取框架的版本到 `config.gradle` 文件中：

```groovy
ext {

    android = [compileSdkVersion       : 28,
               minSdkVersion           : 19,
               targetSdkVersion        : 28,
               versionCode             : 40102,
               versionName             : "4.1.2",
    ]
    dependencies = [
            "appcompat"                    : "androidx.appcompat:appcompat:1.2.0",
            "material"                     : "com.google.android.material:material:1.2.0",
    ]
}
```

* 然后在每个模块下这样定义，这样做的好处是可以做到版本号的统一管理。

```groovy
apply from : '../config.gradle'

android {
    compileSdkVersion rootProject.ext.android["compileSdkVersion"]

    defaultConfig {
        minSdkVersion rootProject.ext.android["minSdkVersion"]
        targetSdkVersion rootProject.ext.android["targetSdkVersion"]
    }
}
dependencies {
    implementation rootProject.ext.dependencies["appcompat"]
    implementation rootProject.ext.dependencies["material"]
}
```

* 除此之外还有另外一种写法，我们可以把 `config.gradle` 修改成这样：

```groovy
android {
    compileSdkVersion 28

    defaultConfig {
        minSdkVersion 19
        targetSdkVersion 28
        versionName '4.1.2'
        versionCode 40102
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.2.0'
    implementation 'com.google.android.material:material:1.2.1'
}
```

* 然后在每个模块上添加一句引用即可，相比上一种写方法，这种方式更强大，因为它不仅可以配置版本号，还支持统一其他的配置项。

```groovy
apply from : '../config.gradle'
```

* 具体要用哪一种，可以根据实际情况而定，如果项目采用的是组件化，则可以考虑使用第一种方式，如果项目采用的是模块化，则可以考虑使用第二种方式，当然两种一起结合用也是可以的。

## 代码注释规范

* 类注释规范：**author** 是创建者（必填项）、**time** 是创建时间（必填项）、**desc** 是类的描述（必填项），**doc** 是文档地址（非必填），**github** 是开源地址（如果项目是开源的则必填，否则不填）

```java
/**
 *    author : Android 轮子哥
 *    github : https://github.com/getActivity/XXPermissions
 *    time   : 2018/06/15
 *    desc   : 权限请求实体类
 *    doc    : https://developer.android.google.cn/reference/android/Manifest.permission?hl=zh_cn
 *             https://developer.android.google.cn/guide/topics/permissions/overview?hl=zh-cn#normal-dangerous
 */
public final class Permission {
    ....
}
```

* 方法注释规范：方法注释可根据实际情况而定

```java
/**
 * 设置请求的对象
 *
 * @param activity          当前 Activity，可以传入栈顶的 Activity
 */
public static XXPermissions with(FragmentActivity activity) {
    return ....;
}
```

* 字段注释规范：根据字段的作用而定

```java
/** 请求的权限组 */
private static final String REQUEST_PERMISSIONS = "request_permissions";

/** 权限回调对象 */
private OnPermissionCallback callBack;
```

* 变量注释规范（如果 API 是比较常见并且容易理解可以不用写，如果是复杂并且羞涩难懂则需要写上）

```java
// 设置保留实例，不会因为屏幕方向或配置变化而重新创建
fragment.setRetainInstance(true);
```

* 注释什么情况下要写？什么情况下不用写？这个问题我很有感触，代码注释写多了不好，显得太啰嗦，也会增加工作量，写少了也不好，又怕别人看不懂，也害怕给自己后面留坑。我个人的建议是尽量用规范的命名来减少不必要的注释，很多时候我们只需要换位思考一下，忘记这段代码是自己写的，再问一下自己能不能一下子读懂，如果可以的话，注释就可以不用写，否则注释还是要考虑写上。

## 代码硬编码规范

* 请尽量避免使用硬编码，例如系统的一些常量值，不能直接写死，而是应该通过代码引用，例如：

```java
// 不规范写法示例
if (view.getVisibility() != 0) {
    return;
}

Intent intent = new Intent("android.settings.APPLICATION_DETAILS_SETTINGS");
startActivity(intent);
```

```java
// 规范写法示例
if (view.getVisibility() != View.VISIBLE) {
    return;
}

Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
startActivity(intent);
```

* 在项目开发中，被多次使用到的数值或者字符串也应该提取成常量来供外部引用，例如：

```java
public final class UserInfoManager {

    /** 学生 */
    public static final int TYPE_STUDENT = 0;

    /** 老师 */
    public static final int TYPE_TEACHER = 1;

    /** 家长 */
    public static final int TYPE_PATRIARCH = 2;
}
```

* 但并不代表所有的数值都需要常量化，有一些数值常量化的意义并不大，例如：

```java
ValueAnimator animator = ValueAnimator.ofInt(0, 100);
animator.setDuration(500);
animator.start();
```

* 所以衡量一个数值或者字符串是否进行常量化的标准有两点：

	* 这个数值或者字符串是否会被多次使用
	
	* 这个数值或者字符串是否具有一定的含义

## 布局文件命名规范

* 以 **模块 + 类型** 来命名，例如：

```text
home_activity.xml

setting_fragment.xml

menu_item.xml

address_dialog.xml
```

* 这样写的好处在于，由于 res 文件夹下是没有层级概念的

* 通过前缀的命名可以帮助我们更好定位到同一模块下的资源

* 例如分享对话框中，有对话框 Root 布局和 Item 布局

```text
share_dialog.xml（Root 布局）

share_item.xml（Item 布局）
```

## 资源文件命名规范

* 如果是业务模块下的资源，以 **模块 + 类型** 来命名，例如分享对话框的资源：

```text
share_link_ic.png（复制链接）

share_moment_ic.png（分享到朋友圈）

share_qq_ic.png（分享到 QQ 好友）

share_qzone_ic.png（分享到 QQ 空间）

share_wechat_ic.png（分享到微信好友）
```

* 如果和业务模块不相干的资源，以 **作用 + 类型** 来命名，例如通用的控件样式资源：

```text
button_rect_selector.xml（通用直角按钮样式）

button_round_selector.xml（通用圆角按钮样式）
```

* 这种资源有一个共同特点，它不属于哪个模块，但是在不同模块都有用到，所以不能用业务的模块名作为文件名前缀，最后附上常见类型名称对应表：

|   名称  |  类型 |
| :-----: | :----: |
|  ic |  图标 |
|  bg |  背景 |
|  selector |  选择器 |

## String ID 命名规范

* 请以 **模块 + 功能** 来命名，例如：

```xml
<!-- 主界面 -->
<string name="home_nav_index">首页</string>
<string name="home_nav_found">发现</string>
<string name="home_nav_message">消息</string>
<string name="home_nav_me">我的</string>
<string name="home_exit_hint">再按一次退出</string>

<!-- 登录界面 -->
<string name="login_register">注册</string>
<string name="login_phone_hint">请输入手机号</string>
<string name="login_password_hint">请输入密码</string>
<string name="login_forget">忘记密码？</string>
<string name="login_text">登录</string>
<string name="login_other">其他登录方式</string>

<!-- 注册界面 -->
<string name="register_title">注册</string>
<string name="register_hint">手机号仅用于登录和保护账号安全</string>
<string name="register_login">登录</string>
<string name="register_password_hint1">设置密码</string>
<string name="register_password_hint2">再次输入密码</string>
<string name="register_password_input_error">两次密码输入不一致，请重新输入</string>

<!-- 设置界面 -->
<string name="setting_title">设置</string>
<string name="setting_language_switchover">语言切换</string>
<string name="setting_language_simple">简体中文</string>
<string name="setting_language_complex">繁体中文</string>
```

* 另外有一类 String 被多个模块所引用，需要以 **common + 作用** 来命名，例如：

```xml
<string name="common_loading">加载中&#8230;</string>

<string name="common_confirm">确定</string>
<string name="common_cancel">取消</string>

<string name="common_year">年</string>
<string name="common_month">月</string>
<string name="common_day">日</string>

<string name="common_hour">时</string>
<string name="common_minute">分</string>
<string name="common_second">秒</string>
```

## Color ID 命名规范

* 请以 **模块 + 作用 + color** 来命名，例如：

```xml
<color name="logcat_level_verbose_color">#FFBBBBBB</color>
<color name="logcat_level_debug_color">#FF33B5E5</color>
<color name="logcat_level_info_color">#FF99CC00</color>
<color name="logcat_level_warn_color">#FFFFBB33</color>
<color name="logcat_level_error_color">#FFFF4444</color>
<color name="logcat_level_other_color">#FFFFFFFF</color>
```

* 另外有一类 Color 被多个模块所引用，需要以 **common + 作用 + color** 来命名，例如：

```xml
<!-- App 样式中引用的颜色 -->
<color name="common_primary_color">@color/white</color>
<color name="common_primary_dark_color">@color/black</color>
<color name="common_accent_color">#5A8DDF</color>
<color name="common_window_background_color">#F4F4F4</color>
<color name="common_text_color">#333333</color>
<color name="common_text_hint_color">@color/panda</color>

<!-- 按钮按压时的颜色 -->
<color name="common_button_pressed_color">#AA5A8DDF</color>
<!-- 按钮禁用时的颜色 -->
<color name="common_button_disable_color">#BBBBBB</color>
<!-- 分割线的颜色 -->
<color name="common_line_color">#ECECEC</color>
```

* 还有一类 Color 是行业通用的色值，需要以 **简单直接的方式** 来命名，例如：

```xml
<!-- 透明色 -->
<color name="transparent">#00000000</color>
<!-- 白色 -->
<color name="white">#FFFFFFFF</color>
<!-- 黑色 -->
<color name="black">#FF000000</color>
<!-- 灰色 -->
<color name="gray">#FF808080</color>
<!-- 红色 -->
<color name="red">#FFFF0000</color>
<!-- 金色 -->
<color name="gold">#FFFFD700</color>
<!-- 黄色 -->
<color name="yellow">#FFFFFF00</color>
<!-- 绿色 -->
<color name="green">#FF008000</color>
<!-- 蓝色 -->
<color name="blue">#FF0000FF</color>
<!-- 紫色 -->
<color name="purple">#FF800080</color>
<!-- 粉色 -->
<color name="pink">#FFFFC0CB</color>
<!-- 橙色 -->
<color name="orange">#FFFFA500</color>
```

* 在实际开发中，我们常常会遇到类似下面这种命名方式：

```xml
<name="color_FF35BF30">#FF35BF30</color>
```

* 其实这种命名方式是不规范的，因为它对 **Color ID** 的名称定义比较模糊，会容易给别人造成误导；举个例子：假设项目中有 **200** 个地方引用了这个 `color_FF35BF30` 色值，其中有 **150** 地方是你自己引用的，另外 **50** 个地方是别人引用的，但是别人不知道你那个色值是干什么的，看到你有写就直接引用了，突然有一天产品经理心情不好要改这个色值，那么你要从 **200** 地方区分 **150** 个需要修改的地方和 **50** 个不需要修改的地方。

## Anim ID 命名规范

* 应用到某个模块 **View**，例如：

```text
login_left_balloon_view.xml
login_right_balloon_view.xml
```

* 应用到全局 **Activity**，例如：

```text
left_in_activity.xml
left_out_activity.xml
```

* 应用到全局 **Dialog**，例如：

```text
bottom_in_dialog.xml
bottom_out_dialog.xml
```

## View ID 命名规范

* 应该以 **控件的缩写 + 模块名 + 作用** 来命名，例如

```text
@+id/R.id.rg_login_type

@+id/R.id.et_login_phone

@+id/R.id.et_login_sms

@+id/R.id.et_login_password

@+id/R.id.btn_login_commit
```

* View 和 Layout 控件缩写表，这里列举最常见的几个

|       名称      |  缩写   |
| :------------: | :----: |
|     TextView   |   tv   |
|     EditText   |   et   |
|      Button    |  btn   |
|    ImageView   |   iv   |
|   ImageButton  |   ib   |
|    ListView    |   lv   |
|  RecyclerView  |   rv   |
|   RadioButton  |   rb   |
|    RadioGroup  |   rg   |
|   ProgressBar  |   pb   |
|     CheckBox   |   cb   |
|   TableLayout  |   tl   |
|   ScrollView   |   sv   |
|   LinearLayout |   ll   |
| RelativeLayout |   rl   |
|   FrameLayout  |   fl   |

## Style 命名规范

* 如果只是主题相关的样式，以 **Theme** 命名结尾，控件样式则以 **Style** 命名结尾，命名要求尽量简洁，并且需要有代码注释，示例如下：

```xml
<!-- 应用主题样式 -->
<style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    .....
</style>

<!-- 全屏主题样式 -->
<style name="FullScreenTheme" parent="AppTheme">
    .....
</style>

<!-- 闪屏页主题样式 -->
<style name="SplashTheme" parent="FullScreenTheme">
    .....
</style>
```


```xml
<!-- 默认圆角按钮样式 -->
<style name="ButtonStyle" parent="Widget.AppCompat.Button.Borderless">
    .....
</style>

<!-- 不带圆角按钮样式 -->
<style name="RectButtonStyle" parent="ButtonStyle">
    .....
</style>

<!-- 默认文本框样式 -->
<style name="EditTextStyle">
    .....
</style>

<!-- 验证码按钮样式 -->
<style name="CountdownViewStyle">
    .....
</style>
```

## XML 编码规范

* 不推荐用 **dp** 作为字体单位，虽然在大部分手机上面 **dp** 和 **sp** 计算是差不多的，但是会有一部分老年用户群，例如咱们的长辈，他们通常会把手机显示的字体大小调大，这样他们才不需要带眼镜看手机，如果我们用 **dp** 作为字体单位，无论手机怎么调整字体大小，应用的字体大小都不会有任何的变化，所以这种操作显然是非常不人性化的。

```xml
<!-- 不规范写法示例 -->
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:textSize="18dp" />
```

```xml
<!-- 规范写法示例 -->
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:textSize="18sp" />
```

* 不能根据设计图给定的宽高把 **TextView** 或者 **Button** 的宽高定死，而是通过 `wrap_content` 和 `padding` 的方式来调整 View 的宽高，因为在不同手机上面字体大小不一致，在字体显示比较小的手机上面会显示正常，但是在字体显示比较大的平板上面文字上半部分极有可能会出现被裁剪的情况，所以我们不能把宽高定死，而是通过 `padding` 来调整到控件的大小。不过需要注意的是，[TextView 有自带的文字间距](https://blog.csdn.net/ccpat/article/details/45226951)，我们在拿设计图给定的 `padding`值时，需要拿设计图给定的值适当减去这一部分值（一般大概是在 **2~3dp**）。

```xml
<!-- 不规范写法示例 -->
<Button
    android:layout_width="180dp"
    android:layout_height="60dp" />
```

```xml
<!-- 规范写法示例 -->
<Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:paddingStart="80dp"
    android:paddingTop="20dp"
    android:paddingEnd="80dp"
    android:paddingBottom="20dp" />
```

* **ImageView** 的宽高任一项定义成 `match_parent` 时，另外一项不能写死大小，而是应该使用 `wrap_content`，否则很可能会因为比例不对导致图片变形，另外还需要使用 `android:adjustViewBounds="true"` 属性，否则 `ImageView` 无法根据图片的宽高来调整自己的宽高。

```xml
<!-- 不规范写法示例 -->
<ImageView
    android:layout_width="match_parent"
    android:layout_height="300dp"
    android:src="@drawable/example_bg" />
```

```xml
<!-- 规范写法示例 -->
<ImageView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:adjustViewBounds="true"
    android:src="@drawable/example_bg" />
```

* XML 节点编写应该规范，在没有子节点的情况下，应当以 `/>` 节点结尾，如果有则以 `</xxx.xxx.xxx>` 节点结尾

```xml
<!-- 不规范写法示例 -->
<androidx.recyclerview.widget.RecyclerView
    android:layout_width="match_parent"
    android:layout_height="match_parent">
</androidx.recyclerview.widget.RecyclerView>

<!-- 不规范写法示例 -->
<TextView
    android:layout_width="match_parent"
    android:layout_height="match_parent">
</TextView>
```

```xml
<!-- 规范写法示例 -->
<androidx.recyclerview.widget.RecyclerView
    android:layout_width="match_parent"
    android:layout_height="match_parent" />

<!-- 规范写法示例 -->
<TextView
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

## 预览属性约定

* 应该在布局文件根布局中定义 `tools:context` 属性，以便在布局文件中快速定位到对应的类

```xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".ui.activity.HomeActivity">

</FrameLayout>
```


```text
tools:context=".ui.activity.HomeActivity"

tools:context=".ui.fragment.SettingFragment"

tools:context=".ui.adapter.HomeAdapter"

tools:context=".ui.dialog.PersonDataDialog"
```

* 此外，tools 属性还有各种各样的用途，例如 **RecyclerView** 的 **tools** 属性

```xml
<androidx.recyclerview.widget.RecyclerView
    android:id="@+id/rv_pay_list"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:overScrollMode="never"

    tools:listitem="@layout/item_dialog_pay_password"
    tools:itemCount="9"

    tools:layoutManager="androidx.recyclerview.widget.GridLayoutManager"
    tools:spanCount="3" />
```

* 这种命名方式不止可以应用于 **RecyclerView**，还可以应用于其他 **View** 的属性，比如常用的 **TextView** 和 **ImageView**

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    tools:text="学生姓名" />

<ImageView
    android:id="@+id/iv_home_course_image"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    tools:src="@drawable/bg_home_placeholder" />
```

* 如果某个 **TextView** 显示的字符串是一成不变的，那么可以直接定义在布局文件中，如果是动态变化的，那么应该使用 `tools:text` 预览属性，而不应该使用 `android:text`，其他布局属性也同理。
	
## 资源硬编码规范

* String 硬编码规范：如果项目已经适配了多语种，则严禁写死在 Java 代码或者布局文件中，如果没有这块需求的话，也建议将 String 资源定义在 `string.xml` 文件，此项不强制要求，大家根据实际情况而定。

* Color 硬编码规范：在没有使用夜间模式的情况下，允许大部分 Color 值直接定义在布局文件中，但是如果某个色值引用得比较多（例如主题强调色、默认背景色等），需要抽取到 `color.xml` 文件中。

* Dimens 硬编码规范：允许写死在 Java 代码或者布局文件中，但是如果使用了[通配符方案](https://github.com/wildma/ScreenAdaptation)对屏幕进行适配，那么则不能直接写死。

* Style 样式规范：对于一些常用并且样式比较统一的控件，例如 **Button**、**EditText** 等，我们对这些控件的样式进行抽取到 `style.xml` 文件中来，避免属性重复定义。

## 版本名和版本码规范

* 版本名应该由三段整数组成

    * 第一段：代表大版本号，如果出现 UI 大改版，或者项目出现大重构时 +1

    * 第二段：代表需求版本号，一般双周发一次版，每个迭代周期 +1
    
    * 第三段：代表小版本号，发版之后出现 Bug，需要发版修复时 +1

```text
versionName '4.8.0'
```

* 另外版本码应当和版本名保持一定的关联性，例如：

```text
versionName '4.12.1'
versionCode 41201
```

* 这样的好处在于：版本名越高，版本码也会变大，不仅能方便记忆，还能帮助我们更好地管理和升级版本，在一定程度上能避免**高版本名低版本码**的 apk 能被**低版本名高版本码**的 apk 覆盖安装的情况。

## Git 版本管理规范

* 提交规范：在提交代码时请进行 CodeReview（可以是自己也可以是别人），并且确保代码是自测通过的才能进行提交。另外有一点需要注意：提交之前不能先 Pull 代码，这样方式可行但是不规范。

* 多分支规范：在多人协作开发中，我们应该用一个分支代表一个需求，这样做的好处是，在开发需求的过程中，一旦需求被砍，需求分支只要不合入主分支中就不会有太大的影响。另外一个需要注意的点就是分支合并的时机，时机应当在测试完毕后合入，由于分支合并有先后顺序，所以可能会导致代码在没有合并之前没有问题，在合并后出现了问题，所以我们应该约定一个封板时间（一般为上线或者灰度前两三天），在此期间对整个迭代的需求进行回归测试，不允许存在 Bug 之外的修改，例如需求变动修改，若非紧急变动，请勿轻易修改，一旦修改了，则应当将上线或者灰度的时间进行顺延，这样可以有效降低线上事故发生的概率。

* 分支管理规范：分支一多会产生一些问题，那就是怎么管理这些分支，这个问题其实要从分支名称下手，由于分支是没有层级概念的，但是在一些版本管理软件上面（例如 `Sourcetree`），可以通过给分支的名称加 `/` 来建立层级，所以我们在给分支命名的时候，要遵循这种格式的命名，那么问题来了如何建立分支的层级？

     * 如果是 `需求主分支`，请以 `版本名` + `/` + `feature-branch` 的格式来命名，例如 `v5.2.0/feature-branch`

     * 如果是 `需求功能点分支`，请以 `版本名` + `/` + `feature` + `需求名称` 的格式来命名，例如 `v5.2.0/feature-push-message`

     * 如果是 `Bug 修复分支`，请以 `版本名` + `/` + `bugfix` + `Bug 名称` 的格式来命名，例如 `v5.2.0/bugfix-launch-crash`

* 它们之间的合并顺序应当为：`需求功能点分支` 或者 `Bug 修复分支` 自测没有问题了合并到 `需求主分支`，下一个版本的 `需求主分支` 应该基于上一个版本的 `需求主分支` 的代码开分支，还有在代码灰度完成，正式上线之后，还应当给某个提交点打版本标签（俗称打版本 tag），标记这个版本的代码在此处提交点发版，方便后续追溯问题。

* 这个时候大家可能有疑问了，上个版本有 Bug，紧急发了修复版本 `5.1.1`，但是 `5.2.0`（基于 `5.1.0`）已经开始迭代了，那么 `5.1.1` 应该在什么时机合入？答：在发完 `5.1.1` 版本后应该将代码及时合入 `5.2.0` 分支，避免后续出现遗留。

* 分支依赖冲突处理：在多分支开发中，总是避免不了一种情况，那就是需求之间存在依赖关系的问题，面对这种问题最好的处理方式是：

     * 如果功能 A 依赖功能 B 的代码，而开发是同步进行的，则在分支 A 上面开发完功能 A 后，再合并一下分支 B 的功能 B 的代码，将分支 A 的功能补充完整再进行提测。

     * 如果功能 A 和功能 B 的功能之间是强依赖关系，那么比较优的解决方案是用同一个分支开发功能 A 和功能 B，当然这只是建议，最终还是要根据实际情况来判断要不要那么做。
