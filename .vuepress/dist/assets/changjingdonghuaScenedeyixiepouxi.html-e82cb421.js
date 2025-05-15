import{_ as p,r as c,o,c as i,b as s,d as n,e,a as t}from"./app-e8f85126.js";const l={},u=t('<h1 id="概念介绍" tabindex="-1"><a class="header-anchor" href="#概念介绍" aria-hidden="true">#</a> 概念介绍</h1><p>这个 Android 官方源码的注解：</p><blockquote><p>A scene represents the collection of values that various properties in the View hierarchy will have when the scene is applied. A Scene can be configured to automatically run a Transition when it is applied, which will animate the various property changes that take place during the scene change.<br> 大致的中文意思是：<br> 场景表示应用场景时视图层次结构中的各种属性，将具有的值的集合。 可以将场景配置为在应用自动运行过渡时，这将为场景更改期间发生的各种属性、更改设置动画。</p></blockquote><p><strong>Scene</strong> 是Android 19 引入的转换框架中一个场景 api ,帮我们友好的创建开始布局 Scene 和结束布局 Scene，有了开始 Scene 和结束 Scene，运用 Transition 框架来实现带有动画的场景切换。举个例子，从 A 布局切换到 B 布局，一般情况下处理是 View.GONE 或者 View.VISIBLE，但是这样太生硬了，没有一点过度效果。那么 Android 的 Transition 框架就可以完美的解决切换场景带来的生硬视觉感受。</p><p>其中 Scene是一个容器,就是放置你定义的布局，而真正去做场景之间切换这个动作是 Transition 框架中 TransitionManager 调用其中 go 方法或者 transitionTo 方法完成场景之间切换，而真正创建具体动画交由Transition 子类来完成,开始动画交给 Transition 来执行。</p><p>借助 Android 的过渡框架，您只需提供起始布局和结束布局，即可为界面中的各种运动添加动画效果。您可以选择所需的动画类型（例如，淡入/淡出视图或更改视图尺寸），而过渡框架会确定如何为从起始布局到结束布局的运动添加动画效果。</p><p>过渡框架包含以下功能：</p><ul><li><strong>群组级动画</strong>：将一个或多个动画效果应用于视图层次结构中的所有视图。</li><li><strong>内置动画</strong>：对淡出或移动等常见效果使用预定义动画。</li><li><strong>资源文件支持</strong>：从布局资源文件加载视图层次结构和内置动画。</li><li><strong>生命周期回调</strong>：接收可控制动画和层次结构更改流程的回调。</li></ul>',8),r=s("strong",null,"注意",-1),d={href:"https://links.jianshu.com/go?to=https%3A%2F%2Fdeveloper.android.google.cn%2Ftraining%2Ftransitions%2Fstart-activity",target:"_blank",rel:"noopener noreferrer"},k=t('<h1 id="基本流程" tabindex="-1"><a class="header-anchor" href="#基本流程" aria-hidden="true">#</a> 基本流程</h1><p>在两种布局之间添加动画效果的基本流程如下所示：</p><ol><li>为起始布局和结束布局创建一个 <code>[Scene](https://developer.android.google.cn/reference/android/transition/Scene)</code> 对象。然而，起始布局的场景通常是根据当前布局自动确定的。</li><li>创建一个 <code>[Transition](https://developer.android.google.cn/reference/android/transition/Transition)</code> 对象以定义所需的动画类型。</li><li>调用 <code>[TransitionManager.go()](https://developer.android.google.cn/reference/android/transition/TransitionManager#go(android.transition.Scene))</code>，然后系统会运行动画以交换布局。</li></ol><p>图 1 中的示意图说明了布局、场景、过渡和最终动画之间的关系。</p><p><img src="https://raw.githubusercontent.com/shug666/image/main/images633041-7261800152f32a14.png" alt=""></p><p>图 1. 过渡框架如何创建动画的基本图示</p>',6),m={href:"https://links.jianshu.com/go?to=https%3A%2F%2Fdeveloper.android.google.cn%2Ftraining%2Ftransitions%2F",target:"_blank",rel:"noopener noreferrer"},v=t(`<div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Scene</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">Context</span> mContext<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">int</span> mLayoutId <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">ViewGroup</span> mSceneRoot<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">View</span> mLayout<span class="token punctuation">;</span> <span class="token comment">// alternative to layoutId</span>
    <span class="token keyword">private</span> <span class="token class-name">Runnable</span> mEnterAction<span class="token punctuation">,</span> mExitAction<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 返回由与给定 layoutId 参数关联的资源文件描述的场景。 如果已经为给定的 sceneRoot 创建了这样的场    
     * 景，则将返回相同的场景。 这种基于 layoutId 的场景的缓存允许在代码中创建的场景和由       
     * TransitionManager XML 资源文件引用的场景之间共享常见场景。
     * 
     *
     * <span class="token keyword">@param</span> <span class="token parameter">sceneRoot</span> The root of the hierarchy in which scene changes
     *                  and transitions will take place.
     * <span class="token keyword">@param</span> <span class="token parameter">layoutId</span>  The id of a standard layout resource file.
     * <span class="token keyword">@param</span> <span class="token parameter">context</span>   The context used in the process of inflating
     *                  the layout resource.
     * <span class="token keyword">@return</span> The scene for the given root and layout id
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Scene</span> <span class="token function">getSceneForLayout</span><span class="token punctuation">(</span><span class="token annotation punctuation">@NonNull</span> <span class="token class-name">ViewGroup</span> sceneRoot<span class="token punctuation">,</span> <span class="token annotation punctuation">@LayoutRes</span> <span class="token keyword">int</span> layoutId<span class="token punctuation">,</span>
            <span class="token annotation punctuation">@NonNull</span> <span class="token class-name">Context</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">SparseArray</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Scene</span><span class="token punctuation">&gt;</span></span> scenes <span class="token operator">=</span>
                <span class="token punctuation">(</span><span class="token class-name">SparseArray</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Scene</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">)</span> sceneRoot<span class="token punctuation">.</span><span class="token function">getTag</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>transition_scene_layoutid_cache<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>scenes <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            scenes <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SparseArray</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            sceneRoot<span class="token punctuation">.</span><span class="token function">setTag</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>transition_scene_layoutid_cache<span class="token punctuation">,</span> scenes<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">Scene</span> scene <span class="token operator">=</span> scenes<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>layoutId<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>scene <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> scene<span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            scene <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Scene</span><span class="token punctuation">(</span>sceneRoot<span class="token punctuation">,</span> layoutId<span class="token punctuation">,</span> context<span class="token punctuation">)</span><span class="token punctuation">;</span>
            scenes<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>layoutId<span class="token punctuation">,</span> scene<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> scene<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 构造一个场景，但没有关于应用此场景时值将如何变化的信息。 此构造函数可能在创建场景时使用，目 
     * 的是通过设置 setEnterAction(Runnable) 和可能的 setExitAction(Runnable) 进行动态配置。
     * <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token punctuation">#</span><span class="token function">setExitAction</span><span class="token punctuation">(</span><span class="token class-name">Runnable</span><span class="token punctuation">)</span></span><span class="token punctuation">}</span>.
     *
     * <span class="token keyword">@param</span> <span class="token parameter">sceneRoot</span> The root of the hierarchy in which scene changes
     *                  and transitions will take place.
     */</span>
    <span class="token keyword">public</span> <span class="token class-name">Scene</span><span class="token punctuation">(</span><span class="token annotation punctuation">@NonNull</span> <span class="token class-name">ViewGroup</span> sceneRoot<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        mSceneRoot <span class="token operator">=</span> sceneRoot<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 构造一个场景，当进入该场景时，它将从 sceneRoot 容器中移除所有子节点，并将膨胀并添加 layoutId  
     * 资源文件指定的层次结构。这个方法是隐藏的，因为基于 layoutId 的场景应该由缓存工厂方法
     *  Scene.getCurrentScene(View) 创建。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">sceneRoot</span> The root of the hierarchy in which scene changes
     *                  and transitions will take place.
     * <span class="token keyword">@param</span> <span class="token parameter">layoutId</span>  The id of a resource file that defines the view
     *                  hierarchy of this scene.
     * <span class="token keyword">@param</span> <span class="token parameter">context</span>   The context used in the process of inflating
     *                  the layout resource.
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">Scene</span><span class="token punctuation">(</span><span class="token class-name">ViewGroup</span> sceneRoot<span class="token punctuation">,</span> <span class="token keyword">int</span> layoutId<span class="token punctuation">,</span> <span class="token class-name">Context</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        mContext <span class="token operator">=</span> context<span class="token punctuation">;</span>
        mSceneRoot <span class="token operator">=</span> sceneRoot<span class="token punctuation">;</span>
        mLayoutId <span class="token operator">=</span> layoutId<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 构造一个 Scene ，当进入该场景时，将从 sceneRoot 容器中移除所有子级，并将布局对象添加为该容器 
     * 的新子级。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">sceneRoot</span> The root of the hierarchy in which scene changes
     *                  and transitions will take place.
     * <span class="token keyword">@param</span> <span class="token parameter">layout</span>    The view hierarchy of this scene, added as a child
     *                  of sceneRoot when this scene is entered.
     */</span>
    <span class="token keyword">public</span> <span class="token class-name">Scene</span><span class="token punctuation">(</span><span class="token annotation punctuation">@NonNull</span> <span class="token class-name">ViewGroup</span> sceneRoot<span class="token punctuation">,</span> <span class="token annotation punctuation">@NonNull</span> <span class="token class-name">View</span> layout<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        mSceneRoot <span class="token operator">=</span> sceneRoot<span class="token punctuation">;</span>
        mLayout <span class="token operator">=</span> layout<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 获取场景的根，它是由于该场景而受到更改影响的视图层次结构的根，并且在进入该场景时将被动画      
     * 化。
     *
     * <span class="token keyword">@return</span> The root of the view hierarchy affected by this scene.
     */</span>
    <span class="token annotation punctuation">@NonNull</span>
    <span class="token keyword">public</span> <span class="token class-name">ViewGroup</span> <span class="token function">getSceneRoot</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> mSceneRoot<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 如果它是场景的场景根上的当前场景，则退出该场景。 进入场景时设置当前场景。 如果有一个场景，则 
      * 退出场景会运行退出动作。
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">getCurrentScene</span><span class="token punctuation">(</span>mSceneRoot<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">this</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>mExitAction <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                mExitAction<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 进入此场景，这需要更改此场景指定的所有值。 这些可能是与现在将添加到场景根的布局视图组或布局 
     * 资源文件相关联的值，或者可能是由 setEnterAction(Runnable) enter action<span class="token punctuation">}</span> 更改的值，或这些的组      
     * 合。 进入场景时不会运行任何过渡。 要在场景更改中获得过渡行为，请改用 TransitionManager 中的方法之一。
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">enter</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// Apply layout change, if any</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>mLayoutId <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">||</span> mLayout <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// empty out parent container before adding to it</span>
            <span class="token function">getSceneRoot</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">removeAllViews</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token keyword">if</span> <span class="token punctuation">(</span>mLayoutId <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">LayoutInflater</span><span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>mContext<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">inflate</span><span class="token punctuation">(</span>mLayoutId<span class="token punctuation">,</span> mSceneRoot<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                mSceneRoot<span class="token punctuation">.</span><span class="token function">addView</span><span class="token punctuation">(</span>mLayout<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// Notify next scene that it is entering. Subclasses may override to configure scene.</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>mEnterAction <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            mEnterAction<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token function">setCurrentScene</span><span class="token punctuation">(</span>mSceneRoot<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 设置给定 ViewGroup 所在的场景。当前场景仅设置在场景的根 ViewGroup 上，而不是针对该层次结构  
     * 中的每个视图。 Scene 使用此信息来确定是否存在应在进入新场景之前退出的先前场景。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">sceneRoot</span> The ViewGroup on which the current scene is being set
     */</span>
    <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">setCurrentScene</span><span class="token punctuation">(</span><span class="token annotation punctuation">@NonNull</span> <span class="token class-name">ViewGroup</span> sceneRoot<span class="token punctuation">,</span> <span class="token annotation punctuation">@Nullable</span> <span class="token class-name">Scene</span> scene<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        sceneRoot<span class="token punctuation">.</span><span class="token function">setTag</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>transition_current_scene<span class="token punctuation">,</span> scene<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 获取给定 ViewGroup 上的当前场景集。 只有当 ViewGroup 是场景根时，才会在 ViewGroup 上设置场   
     * 景。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">sceneRoot</span> The ViewGroup on which the current scene will be returned
     * <span class="token keyword">@return</span> The current Scene set on this ViewGroup. A value of null indicates that
     * no Scene is currently set.
     */</span>
    <span class="token annotation punctuation">@Nullable</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Scene</span> <span class="token function">getCurrentScene</span><span class="token punctuation">(</span><span class="token annotation punctuation">@NonNull</span> <span class="token class-name">ViewGroup</span> sceneRoot<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">Scene</span><span class="token punctuation">)</span> sceneRoot<span class="token punctuation">.</span><span class="token function">getTag</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>transition_current_scene<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 未使用布局资源或层次结构定义的场景，或者在这些层次结构更改为之后需要执行额外步骤的场景，应  
     * 设置进入动作，也可能设置退出动作。 输入动作将导致场景回调到应用程序代码中，以便在转换捕获预 
     * 更改值之后以及在应用任何其他场景更改之后执行应用程序所需的任何其他操作，例如将布局（如果      
     * 有） 添加到视图中 等级制度。 调用此方法后，将播放过渡。
     *
     * <span class="token keyword">@param</span> <span class="token parameter">action</span> The runnable whose <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">Runnable</span><span class="token punctuation">#</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span> run()<span class="token punctuation">}</span> method will
     *               be called when this scene is entered
     * <span class="token keyword">@see</span> <span class="token reference"><span class="token punctuation">#</span><span class="token function">setExitAction</span><span class="token punctuation">(</span><span class="token class-name">Runnable</span><span class="token punctuation">)</span></span>
     * <span class="token keyword">@see</span> <span class="token reference"><span class="token class-name">Scene</span><span class="token punctuation">#</span><span class="token function">Scene</span><span class="token punctuation">(</span><span class="token class-name">ViewGroup</span><span class="token punctuation">)</span></span>
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setEnterAction</span><span class="token punctuation">(</span><span class="token annotation punctuation">@Nullable</span> <span class="token class-name">Runnable</span> action<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        mEnterAction <span class="token operator">=</span> action<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 未使用布局资源或层次结构定义的场景，或者在这些层次结构更改为之后需要执行额外步骤的场景，应  
     * 设置进入动作，也可能设置退出动作。 退出操作将导致场景回调到应用程序代码中，以在适用的转换已   
     * 捕获更改前值之后但在应用任何其他场景更改之前执行应用程序需要执行的任何操作，例如新布局（如   
     * 果有） 添加到视图层次结构中。 调用此方法后，将进入下一个场景，如果设置了进入操作，则调用       
     * setEnterAction(Runnable)。
     *
     * <span class="token keyword">@see</span> <span class="token reference"><span class="token punctuation">#</span><span class="token function">setEnterAction</span><span class="token punctuation">(</span><span class="token class-name">Runnable</span><span class="token punctuation">)</span></span>
     * <span class="token keyword">@see</span> <span class="token reference"><span class="token class-name">Scene</span><span class="token punctuation">#</span><span class="token function">Scene</span><span class="token punctuation">(</span><span class="token class-name">ViewGroup</span><span class="token punctuation">)</span></span>
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setExitAction</span><span class="token punctuation">(</span><span class="token annotation punctuation">@Nullable</span> <span class="token class-name">Runnable</span> action<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        mExitAction <span class="token operator">=</span> action<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 返回此场景是否由布局资源文件创建，由传递给 getSceneForLayout(ViewGroup, int, Context) 的           
     * layoutId 确定。
     */</span>
    <span class="token keyword">boolean</span> <span class="token function">isCreatedFromLayoutResource</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span>mLayoutId <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="官方demo" tabindex="-1"><a class="header-anchor" href="#官方demo" aria-hidden="true">#</a> 官方Demo</h1><p>对场景动画 Scene 的具体代码实践，可以参考 Android 官方开发团队的 Demo：</p>`,3),b={href:"https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fandroid%2Fanimation-samples%2Ftree%2Fmain%2FBasicTransition",target:"_blank",rel:"noopener noreferrer"},w=t(`<p>场景是视图层次结构状态的封装，包括该层次结构中的视图以及这些视图具有的各种值（与布局相关的和其他的）。 场景可以直接通过布局层次结构定义，也可以通过在输入场景时动态设置场景的代码来定义。</p><p>Transition 是一种自动动画化进入新场景时发生的变化的机制。 一些转换功能是自动的。 也就是说，进入场景可能会导致动画运行，淡出消失的视图，更改边界并调整已更改的现有视图的大小，以及淡入可见的视图。 还有一些额外的过渡可以为其他属性设置动画，例如颜色变化，并且可以选择性地指定在特定场景变化期间发生。 最后，开发人员可以定义他们自己的 Transition 子类，这些子类监视特定的属性更改并在这些属性更改值时运行自定义动画。</p><p>TransitionManager 用于为特定场景更改指定自定义转换，并导致具有特定转换的场景更改发生。<br> 具体使用，可看如下代码示例：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">BasicTransitionFragment</span> <span class="token keyword">extends</span> <span class="token class-name">Fragment</span>
        <span class="token keyword">implements</span> <span class="token class-name">RadioGroup<span class="token punctuation">.</span>OnCheckedChangeListener</span> <span class="token punctuation">{</span>

    <span class="token comment">// We transition between these Scenes</span>
    <span class="token keyword">private</span> <span class="token class-name">Scene</span> mScene1<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">Scene</span> mScene2<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">Scene</span> mScene3<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/** A custom TransitionManager */</span>
    <span class="token keyword">private</span> <span class="token class-name">TransitionManager</span> mTransitionManagerForScene3<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/** Transitions take place in this ViewGroup. We retain this for the dynamic transition on scene 4. */</span>
    <span class="token keyword">private</span> <span class="token class-name">ViewGroup</span> mSceneRoot<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">BasicTransitionFragment</span> <span class="token function">newInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">BasicTransitionFragment</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">BasicTransitionFragment</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">View</span> <span class="token function">onCreateView</span><span class="token punctuation">(</span><span class="token class-name">LayoutInflater</span> inflater<span class="token punctuation">,</span> <span class="token class-name">ViewGroup</span> container<span class="token punctuation">,</span>
                             <span class="token class-name">Bundle</span> savedInstanceState<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">View</span> view <span class="token operator">=</span> inflater<span class="token punctuation">.</span><span class="token function">inflate</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>layout<span class="token punctuation">.</span>fragment_basic_transition<span class="token punctuation">,</span> container<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">assert</span> view <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token class-name">RadioGroup</span> radioGroup <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">RadioGroup</span><span class="token punctuation">)</span> view<span class="token punctuation">.</span><span class="token function">findViewById</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>select_scene<span class="token punctuation">)</span><span class="token punctuation">;</span>
        radioGroup<span class="token punctuation">.</span><span class="token function">setOnCheckedChangeListener</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        mSceneRoot <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">ViewGroup</span><span class="token punctuation">)</span> view<span class="token punctuation">.</span><span class="token function">findViewById</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>scene_root<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// BEGIN_INCLUDE(instantiation_from_view)</span>
        <span class="token comment">// A Scene can be instantiated from a live view hierarchy.</span>
        mScene1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Scene</span><span class="token punctuation">(</span>mSceneRoot<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token class-name">ViewGroup</span><span class="token punctuation">)</span> mSceneRoot<span class="token punctuation">.</span><span class="token function">findViewById</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>container<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// END_INCLUDE(instantiation_from_view)</span>

        <span class="token comment">// BEGIN_INCLUDE(instantiation_from_resource)</span>
        <span class="token comment">// You can also inflate a generate a Scene from a layout resource file.</span>
        mScene2 <span class="token operator">=</span> <span class="token class-name">Scene</span><span class="token punctuation">.</span><span class="token function">getSceneForLayout</span><span class="token punctuation">(</span>mSceneRoot<span class="token punctuation">,</span> <span class="token class-name">R</span><span class="token punctuation">.</span>layout<span class="token punctuation">.</span>scene2<span class="token punctuation">,</span> <span class="token function">getActivity</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// END_INCLUDE(instantiation_from_resource)</span>

        <span class="token comment">// Another scene from a layout resource file.</span>
        mScene3 <span class="token operator">=</span> <span class="token class-name">Scene</span><span class="token punctuation">.</span><span class="token function">getSceneForLayout</span><span class="token punctuation">(</span>mSceneRoot<span class="token punctuation">,</span> <span class="token class-name">R</span><span class="token punctuation">.</span>layout<span class="token punctuation">.</span>scene3<span class="token punctuation">,</span> <span class="token function">getActivity</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// BEGIN_INCLUDE(custom_transition_manager)</span>
        <span class="token comment">// We create a custom TransitionManager for Scene 3, in which ChangeBounds and Fade</span>
        <span class="token comment">// take place at the same time.</span>
        mTransitionManagerForScene3 <span class="token operator">=</span> <span class="token class-name">TransitionInflater</span><span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token function">getActivity</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">inflateTransitionManager</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>transition<span class="token punctuation">.</span>scene3_transition_manager<span class="token punctuation">,</span> mSceneRoot<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// END_INCLUDE(custom_transition_manager)</span>

        <span class="token keyword">return</span> view<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onCheckedChanged</span><span class="token punctuation">(</span><span class="token class-name">RadioGroup</span> group<span class="token punctuation">,</span> <span class="token keyword">int</span> checkedId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">switch</span> <span class="token punctuation">(</span>checkedId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">case</span> <span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>select_scene_1<span class="token operator">:</span> <span class="token punctuation">{</span>
                <span class="token comment">// BEGIN_INCLUDE(transition_simple)</span>
                <span class="token comment">// You can start an automatic transition with TransitionManager.go().</span>
                <span class="token class-name">TransitionManager</span><span class="token punctuation">.</span><span class="token function">go</span><span class="token punctuation">(</span>mScene1<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token comment">// END_INCLUDE(transition_simple)</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">case</span> <span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>select_scene_2<span class="token operator">:</span> <span class="token punctuation">{</span>
                <span class="token class-name">TransitionManager</span><span class="token punctuation">.</span><span class="token function">go</span><span class="token punctuation">(</span>mScene2<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">case</span> <span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>select_scene_3<span class="token operator">:</span> <span class="token punctuation">{</span>
                <span class="token comment">// BEGIN_INCLUDE(transition_custom)</span>
                <span class="token comment">// You can also start a transition with a custom TransitionManager.</span>
                mTransitionManagerForScene3<span class="token punctuation">.</span><span class="token function">transitionTo</span><span class="token punctuation">(</span>mScene3<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token comment">// END_INCLUDE(transition_custom)</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">case</span> <span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>select_scene_4<span class="token operator">:</span> <span class="token punctuation">{</span>
                <span class="token comment">// BEGIN_INCLUDE(transition_dynamic)</span>
                <span class="token comment">// Alternatively, transition can be invoked dynamically without a Scene.</span>
                <span class="token comment">// For this, we first call TransitionManager.beginDelayedTransition().</span>
                <span class="token class-name">TransitionManager</span><span class="token punctuation">.</span><span class="token function">beginDelayedTransition</span><span class="token punctuation">(</span>mSceneRoot<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token comment">// Then, we can just change view properties as usual.</span>
                <span class="token class-name">View</span> square <span class="token operator">=</span> mSceneRoot<span class="token punctuation">.</span><span class="token function">findViewById</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>id<span class="token punctuation">.</span>transition_square<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">ViewGroup<span class="token punctuation">.</span>LayoutParams</span> params <span class="token operator">=</span> square<span class="token punctuation">.</span><span class="token function">getLayoutParams</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">int</span> newSize <span class="token operator">=</span> <span class="token function">getResources</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getDimensionPixelSize</span><span class="token punctuation">(</span><span class="token class-name">R</span><span class="token punctuation">.</span>dimen<span class="token punctuation">.</span>square_size_expanded<span class="token punctuation">)</span><span class="token punctuation">;</span>
                params<span class="token punctuation">.</span>width <span class="token operator">=</span> newSize<span class="token punctuation">;</span>
                params<span class="token punctuation">.</span>height <span class="token operator">=</span> newSize<span class="token punctuation">;</span>
                square<span class="token punctuation">.</span><span class="token function">setLayoutParams</span><span class="token punctuation">(</span>params<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token comment">// END_INCLUDE(transition_dynamic)</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),y={href:"https://www.jianshu.com/p/970da6b96783",target:"_blank",rel:"noopener noreferrer"};function h(g,f){const a=c("ExternalLinkIcon");return o(),i("div",null,[u,s("p",null,[r,n("：如何在同一 Activity 的各个布局之间打造过渡效果。如果用户在多个 Activity 之间移动，您应改为参阅"),s("a",d,[n("启动使用动画的 Activity"),e(a)]),n("。")]),k,s("p",null,[n("具体场景动画 Scene 的创建场景、应用过渡等具体介绍，可以观看 Android 官方文档："),s("a",m,[n("https://developer.android.google.cn/training/transitions/"),e(a)])]),v,s("p",null,[s("a",b,[n("https://github.com/android/animation-samples/tree/main/BasicTransition"),e(a)])]),w,s("p",null,[n("本文转自 "),s("a",y,[n("https://www.jianshu.com/p/970da6b96783"),e(a)]),n("，如有侵权，请联系删除。")])])}const _=p(l,[["render",h],["__file","changjingdonghuaScenedeyixiepouxi.html.vue"]]);export{_ as default};
