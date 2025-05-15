---
title: 场景动画Scene的一些剖析
date: 2024-03-05
tags:
 - android
categories: 
 - android
sticky: 
   true
---

# 概念介绍

这个 Android 官方源码的注解：

> A scene represents the collection of values that various properties in the View hierarchy will have when the scene is applied. A Scene can be configured to automatically run a Transition when it is applied, which will animate the various property changes that take place during the scene change.  
> 大致的中文意思是：  
> 场景表示应用场景时视图层次结构中的各种属性，将具有的值的集合。 可以将场景配置为在应用自动运行过渡时，这将为场景更改期间发生的各种属性、更改设置动画。

**Scene** 是Android 19 引入的转换框架中一个场景 api ,帮我们友好的创建开始布局 Scene 和结束布局 Scene，有了开始 Scene 和结束 Scene，运用 Transition 框架来实现带有动画的场景切换。举个例子，从 A 布局切换到 B 布局，一般情况下处理是 View.GONE 或者 View.VISIBLE，但是这样太生硬了，没有一点过度效果。那么 Android 的 Transition 框架就可以完美的解决切换场景带来的生硬视觉感受。

其中 Scene是一个容器,就是放置你定义的布局，而真正去做场景之间切换这个动作是 Transition 框架中 TransitionManager 调用其中 go 方法或者 transitionTo 方法完成场景之间切换，而真正创建具体动画交由Transition 子类来完成,开始动画交给 Transition 来执行。

借助 Android 的过渡框架，您只需提供起始布局和结束布局，即可为界面中的各种运动添加动画效果。您可以选择所需的动画类型（例如，淡入/淡出视图或更改视图尺寸），而过渡框架会确定如何为从起始布局到结束布局的运动添加动画效果。

过渡框架包含以下功能：

*   **群组级动画**：将一个或多个动画效果应用于视图层次结构中的所有视图。
*   **内置动画**：对淡出或移动等常见效果使用预定义动画。
*   **资源文件支持**：从布局资源文件加载视图层次结构和内置动画。
*   **生命周期回调**：接收可控制动画和层次结构更改流程的回调。

**注意**：如何在同一 Activity 的各个布局之间打造过渡效果。如果用户在多个 Activity 之间移动，您应改为参阅[启动使用动画的 Activity](https://links.jianshu.com/go?to=https%3A%2F%2Fdeveloper.android.google.cn%2Ftraining%2Ftransitions%2Fstart-activity)。

# 基本流程

在两种布局之间添加动画效果的基本流程如下所示：

1.  为起始布局和结束布局创建一个 `[Scene](https://developer.android.google.cn/reference/android/transition/Scene)` 对象。然而，起始布局的场景通常是根据当前布局自动确定的。
2.  创建一个 `[Transition](https://developer.android.google.cn/reference/android/transition/Transition)` 对象以定义所需的动画类型。
3.  调用 `[TransitionManager.go()](https://developer.android.google.cn/reference/android/transition/TransitionManager#go(android.transition.Scene))`，然后系统会运行动画以交换布局。

图 1 中的示意图说明了布局、场景、过渡和最终动画之间的关系。

![](https://raw.githubusercontent.com/shug666/image/main/images633041-7261800152f32a14.png)

图 1. 过渡框架如何创建动画的基本图示

具体场景动画 Scene 的创建场景、应用过渡等具体介绍，可以观看 Android 官方文档：[https://developer.android.google.cn/training/transitions/](https://links.jianshu.com/go?to=https%3A%2F%2Fdeveloper.android.google.cn%2Ftraining%2Ftransitions%2F)

```java
public class Scene {

    private Context mContext;
    private int mLayoutId = -1;
    private ViewGroup mSceneRoot;
    private View mLayout; // alternative to layoutId
    private Runnable mEnterAction, mExitAction;

    /**
     * 返回由与给定 layoutId 参数关联的资源文件描述的场景。 如果已经为给定的 sceneRoot 创建了这样的场    
     * 景，则将返回相同的场景。 这种基于 layoutId 的场景的缓存允许在代码中创建的场景和由       
     * TransitionManager XML 资源文件引用的场景之间共享常见场景。
     * 
     *
     * @param sceneRoot The root of the hierarchy in which scene changes
     *                  and transitions will take place.
     * @param layoutId  The id of a standard layout resource file.
     * @param context   The context used in the process of inflating
     *                  the layout resource.
     * @return The scene for the given root and layout id
     */
    public static Scene getSceneForLayout(@NonNull ViewGroup sceneRoot, @LayoutRes int layoutId,
            @NonNull Context context) {
        SparseArray<Scene> scenes =
                (SparseArray<Scene>) sceneRoot.getTag(R.id.transition_scene_layoutid_cache);
        if (scenes == null) {
            scenes = new SparseArray<>();
            sceneRoot.setTag(R.id.transition_scene_layoutid_cache, scenes);
        }
        Scene scene = scenes.get(layoutId);
        if (scene != null) {
            return scene;
        } else {
            scene = new Scene(sceneRoot, layoutId, context);
            scenes.put(layoutId, scene);
            return scene;
        }
    }

    /**
     * 构造一个场景，但没有关于应用此场景时值将如何变化的信息。 此构造函数可能在创建场景时使用，目 
     * 的是通过设置 setEnterAction(Runnable) 和可能的 setExitAction(Runnable) 进行动态配置。
     * {@link #setExitAction(Runnable)}.
     *
     * @param sceneRoot The root of the hierarchy in which scene changes
     *                  and transitions will take place.
     */
    public Scene(@NonNull ViewGroup sceneRoot) {
        mSceneRoot = sceneRoot;
    }

    /**
     * 构造一个场景，当进入该场景时，它将从 sceneRoot 容器中移除所有子节点，并将膨胀并添加 layoutId  
     * 资源文件指定的层次结构。这个方法是隐藏的，因为基于 layoutId 的场景应该由缓存工厂方法
     *  Scene.getCurrentScene(View) 创建。
     *
     * @param sceneRoot The root of the hierarchy in which scene changes
     *                  and transitions will take place.
     * @param layoutId  The id of a resource file that defines the view
     *                  hierarchy of this scene.
     * @param context   The context used in the process of inflating
     *                  the layout resource.
     */
    private Scene(ViewGroup sceneRoot, int layoutId, Context context) {
        mContext = context;
        mSceneRoot = sceneRoot;
        mLayoutId = layoutId;
    }

    /**
     * 构造一个 Scene ，当进入该场景时，将从 sceneRoot 容器中移除所有子级，并将布局对象添加为该容器 
     * 的新子级。
     *
     * @param sceneRoot The root of the hierarchy in which scene changes
     *                  and transitions will take place.
     * @param layout    The view hierarchy of this scene, added as a child
     *                  of sceneRoot when this scene is entered.
     */
    public Scene(@NonNull ViewGroup sceneRoot, @NonNull View layout) {
        mSceneRoot = sceneRoot;
        mLayout = layout;
    }

    /**
     * 获取场景的根，它是由于该场景而受到更改影响的视图层次结构的根，并且在进入该场景时将被动画      
     * 化。
     *
     * @return The root of the view hierarchy affected by this scene.
     */
    @NonNull
    public ViewGroup getSceneRoot() {
        return mSceneRoot;
    }

    /**
     * 如果它是场景的场景根上的当前场景，则退出该场景。 进入场景时设置当前场景。 如果有一个场景，则 
      * 退出场景会运行退出动作。
     */
    public void exit() {
        if (getCurrentScene(mSceneRoot) == this) {
            if (mExitAction != null) {
                mExitAction.run();
            }
        }
    }

    /**
     * 进入此场景，这需要更改此场景指定的所有值。 这些可能是与现在将添加到场景根的布局视图组或布局 
     * 资源文件相关联的值，或者可能是由 setEnterAction(Runnable) enter action} 更改的值，或这些的组      
     * 合。 进入场景时不会运行任何过渡。 要在场景更改中获得过渡行为，请改用 TransitionManager 中的方法之一。
     */
    public void enter() {
        // Apply layout change, if any
        if (mLayoutId > 0 || mLayout != null) {
            // empty out parent container before adding to it
            getSceneRoot().removeAllViews();

            if (mLayoutId > 0) {
                LayoutInflater.from(mContext).inflate(mLayoutId, mSceneRoot);
            } else {
                mSceneRoot.addView(mLayout);
            }
        }

        // Notify next scene that it is entering. Subclasses may override to configure scene.
        if (mEnterAction != null) {
            mEnterAction.run();
        }

        setCurrentScene(mSceneRoot, this);
    }

    /**
     * 设置给定 ViewGroup 所在的场景。当前场景仅设置在场景的根 ViewGroup 上，而不是针对该层次结构  
     * 中的每个视图。 Scene 使用此信息来确定是否存在应在进入新场景之前退出的先前场景。
     *
     * @param sceneRoot The ViewGroup on which the current scene is being set
     */
    static void setCurrentScene(@NonNull ViewGroup sceneRoot, @Nullable Scene scene) {
        sceneRoot.setTag(R.id.transition_current_scene, scene);
    }

    /**
     * 获取给定 ViewGroup 上的当前场景集。 只有当 ViewGroup 是场景根时，才会在 ViewGroup 上设置场   
     * 景。
     *
     * @param sceneRoot The ViewGroup on which the current scene will be returned
     * @return The current Scene set on this ViewGroup. A value of null indicates that
     * no Scene is currently set.
     */
    @Nullable
    public static Scene getCurrentScene(@NonNull ViewGroup sceneRoot) {
        return (Scene) sceneRoot.getTag(R.id.transition_current_scene);
    }

    /**
     * 未使用布局资源或层次结构定义的场景，或者在这些层次结构更改为之后需要执行额外步骤的场景，应  
     * 设置进入动作，也可能设置退出动作。 输入动作将导致场景回调到应用程序代码中，以便在转换捕获预 
     * 更改值之后以及在应用任何其他场景更改之后执行应用程序所需的任何其他操作，例如将布局（如果      
     * 有） 添加到视图中 等级制度。 调用此方法后，将播放过渡。
     *
     * @param action The runnable whose {@link Runnable#run() run()} method will
     *               be called when this scene is entered
     * @see #setExitAction(Runnable)
     * @see Scene#Scene(ViewGroup)
     */
    public void setEnterAction(@Nullable Runnable action) {
        mEnterAction = action;
    }

    /**
     * 未使用布局资源或层次结构定义的场景，或者在这些层次结构更改为之后需要执行额外步骤的场景，应  
     * 设置进入动作，也可能设置退出动作。 退出操作将导致场景回调到应用程序代码中，以在适用的转换已   
     * 捕获更改前值之后但在应用任何其他场景更改之前执行应用程序需要执行的任何操作，例如新布局（如   
     * 果有） 添加到视图层次结构中。 调用此方法后，将进入下一个场景，如果设置了进入操作，则调用       
     * setEnterAction(Runnable)。
     *
     * @see #setEnterAction(Runnable)
     * @see Scene#Scene(ViewGroup)
     */
    public void setExitAction(@Nullable Runnable action) {
        mExitAction = action;
    }

    /**
     * 返回此场景是否由布局资源文件创建，由传递给 getSceneForLayout(ViewGroup, int, Context) 的           
     * layoutId 确定。
     */
    boolean isCreatedFromLayoutResource() {
        return (mLayoutId > 0);
    }

}


```

# 官方Demo

对场景动画 Scene 的具体代码实践，可以参考 Android 官方开发团队的 Demo：  

[https://github.com/android/animation-samples/tree/main/BasicTransition](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fandroid%2Fanimation-samples%2Ftree%2Fmain%2FBasicTransition)

场景是视图层次结构状态的封装，包括该层次结构中的视图以及这些视图具有的各种值（与布局相关的和其他的）。 场景可以直接通过布局层次结构定义，也可以通过在输入场景时动态设置场景的代码来定义。

Transition 是一种自动动画化进入新场景时发生的变化的机制。 一些转换功能是自动的。 也就是说，进入场景可能会导致动画运行，淡出消失的视图，更改边界并调整已更改的现有视图的大小，以及淡入可见的视图。 还有一些额外的过渡可以为其他属性设置动画，例如颜色变化，并且可以选择性地指定在特定场景变化期间发生。 最后，开发人员可以定义他们自己的 Transition 子类，这些子类监视特定的属性更改并在这些属性更改值时运行自定义动画。

TransitionManager 用于为特定场景更改指定自定义转换，并导致具有特定转换的场景更改发生。  
具体使用，可看如下代码示例：

```java
public class BasicTransitionFragment extends Fragment
        implements RadioGroup.OnCheckedChangeListener {

    // We transition between these Scenes
    private Scene mScene1;
    private Scene mScene2;
    private Scene mScene3;

    /** A custom TransitionManager */
    private TransitionManager mTransitionManagerForScene3;

    /** Transitions take place in this ViewGroup. We retain this for the dynamic transition on scene 4. */
    private ViewGroup mSceneRoot;

    public static BasicTransitionFragment newInstance() {
        return new BasicTransitionFragment();
    }

    public BasicTransitionFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_basic_transition, container, false);
        assert view != null;
        RadioGroup radioGroup = (RadioGroup) view.findViewById(R.id.select_scene);
        radioGroup.setOnCheckedChangeListener(this);
        mSceneRoot = (ViewGroup) view.findViewById(R.id.scene_root);

        // BEGIN_INCLUDE(instantiation_from_view)
        // A Scene can be instantiated from a live view hierarchy.
        mScene1 = new Scene(mSceneRoot, (ViewGroup) mSceneRoot.findViewById(R.id.container));
        // END_INCLUDE(instantiation_from_view)

        // BEGIN_INCLUDE(instantiation_from_resource)
        // You can also inflate a generate a Scene from a layout resource file.
        mScene2 = Scene.getSceneForLayout(mSceneRoot, R.layout.scene2, getActivity());
        // END_INCLUDE(instantiation_from_resource)

        // Another scene from a layout resource file.
        mScene3 = Scene.getSceneForLayout(mSceneRoot, R.layout.scene3, getActivity());

        // BEGIN_INCLUDE(custom_transition_manager)
        // We create a custom TransitionManager for Scene 3, in which ChangeBounds and Fade
        // take place at the same time.
        mTransitionManagerForScene3 = TransitionInflater.from(getActivity())
                .inflateTransitionManager(R.transition.scene3_transition_manager, mSceneRoot);
        // END_INCLUDE(custom_transition_manager)

        return view;
    }

    @Override
    public void onCheckedChanged(RadioGroup group, int checkedId) {
        switch (checkedId) {
            case R.id.select_scene_1: {
                // BEGIN_INCLUDE(transition_simple)
                // You can start an automatic transition with TransitionManager.go().
                TransitionManager.go(mScene1);
                // END_INCLUDE(transition_simple)
                break;
            }
            case R.id.select_scene_2: {
                TransitionManager.go(mScene2);
                break;
            }
            case R.id.select_scene_3: {
                // BEGIN_INCLUDE(transition_custom)
                // You can also start a transition with a custom TransitionManager.
                mTransitionManagerForScene3.transitionTo(mScene3);
                // END_INCLUDE(transition_custom)
                break;
            }
            case R.id.select_scene_4: {
                // BEGIN_INCLUDE(transition_dynamic)
                // Alternatively, transition can be invoked dynamically without a Scene.
                // For this, we first call TransitionManager.beginDelayedTransition().
                TransitionManager.beginDelayedTransition(mSceneRoot);
                // Then, we can just change view properties as usual.
                View square = mSceneRoot.findViewById(R.id.transition_square);
                ViewGroup.LayoutParams params = square.getLayoutParams();
                int newSize = getResources().getDimensionPixelSize(R.dimen.square_size_expanded);
                params.width = newSize;
                params.height = newSize;
                square.setLayoutParams(params);
                // END_INCLUDE(transition_dynamic)
                break;
            }
        }
    }

}

```

  

本文转自 [https://www.jianshu.com/p/970da6b96783](https://www.jianshu.com/p/970da6b96783)，如有侵权，请联系删除。