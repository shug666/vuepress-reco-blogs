---
title: Launcher3 点击桌面图标启动应用动画流程
date: 2025-05-24
tags:
 - android
categories: 
 - android
sticky: 
   true
---

> 在Launcher3中，点击桌面应用图标时，会有一个从 图标位置起始到全屏的动画过程，使得应用的打开过程不是生硬的启动过程。
> 
> 这个动画具体是怎么实现的呢？本文对这个过程进行一个梳理

在Launcher中，动画大体上可以分为两类，一种是Launcher3本身的动画，对Launcher3中的UI元素进行动画；还有一类是远程窗口的动画，也就是跨进程的动画。在启动应用，从应用回到Launcher，分屏，壁纸等等场景，使用的动画就是这类远程窗口动画。这类动画都会涉及到SystemUI，其中有几个核心接口类RemoteAnimationRunnerCompat，RemoteAnimationTargetCompat，整体动画过程是一个涉及到Launcher、WM、SystemUI等多个模块的过程。下面就来介绍详细的动画流程。

**详细动画流程:**

1.  **点击与启动请求**:
    *   用户点击桌面图标 (`BubbleTextView` 或 `FolderIcon`)。
    *   `ItemClickHandler` 或 View 自身的 `onClick` 触发。
    *   构建 `Intent` 并调用 `Launcher.startActivitySafely()`。
2.  **生成 ActivityOptions (由 `QuickstepTransitionManager` 主导)**:
    
    *   `Launcher.startActivitySafely()` 调用 `Launcher.getActivityLaunchOptions()`。
    *   `Launcher.getActivityLaunchOptions()` **调用 `QuickstepTransitionManager` 实例的 `getActivityLaunchOptions(View v)` 方法**。
    *   **`QuickstepTransitionManager.getActivityLaunchOptions`**:
        *   判断启动来源（这里是从桌面图标，`isLaunchingFromRecents` 返回 `false`）。
        *   创建一个 `AppLaunchAnimationRunner` (实现了 `RemoteAnimationFactory` 接口) 实例，并传入一个 `RunnableList` 用于动画结束后的回调。
        *   创建一个 `LauncherAnimationRunner` (实现了 `RemoteAnimationRunnerCompat` 接口)，包装 `AppLaunchAnimationRunner`。
        *   使用 `ActivityOptions.makeRemoteAnimation(...)` 创建 `ActivityOptions`，将 `LauncherAnimationRunner` 注册给系统，并指定动画预估时长 (`APP_LAUNCH_DURATION`) 和状态栏动画延迟 (`statusBarTransitionDelay`)。
        *   返回包含这些 `ActivityOptions` 的 `ActivityOptionsWrapper`。
    *   这个过程的核心是告诉系统：“启动这个应用，但请把动画控制权通过远程动画回调交给我 (Launcher)”。
3.  **系统准备与回调**:
    
    *   ActivityTaskManagerService 处理启动请求，准备应用进程和窗口。
    *   WindowManager 在应用窗口就绪后，通过 Binder 回调在步骤 2 中注册的 `LauncherAnimationRunner`，最终调用到 `AppLaunchAnimationRunner.onCreateAnimation` 方法，并传递 `RemoteAnimationTarget` 数组。
4.  **Launcher 执行动画 (`QuickstepTransitionManager.AppLaunchAnimationRunner.onCreateAnimation`)**:
    
    *   **接收 Targets:** `onCreateAnimation` 方法被调用，接收到代表各个窗口/Surface 的 `RemoteAnimationTarget` 数组 (包括 MODE\_OPENING 的应用，MODE\_CLOSING 的 Launcher，以及壁纸等)。
    *   **判断启动类型:** 代码确认启动源不是 Widget 或 Recents，执行图标启动逻辑。
    *   **构建核心动画 (`composeIconLaunchAnimator`)**: 这是关键步骤，构建一个 `AnimatorSet` 来编排整个动画：
        *   **链接状态机:** 调用 `mLauncher.getStateManager().setCurrentAnimation(anim);` 将这个 `AnimatorSet` 注册给状态管理器，通常意味着 Launcher 会开始或已经处于 `BACKGROUND_APP` 状态。
        *   **创建窗口动画 (`getOpeningWindowAnimators`)**: 这是**最核心**的部分，负责应用窗口从无到有、从小到大的动画：
            *   **创建 `FloatingIconView`:** 调用 `FloatingIconView.getFloatingIconView(...)`，根据点击的图标 `v` 创建一个悬浮的、可变形的图标视图，并计算出它在 `DragLayer` 中的初始边界 (`launcherIconBounds`)。原始图标通常会被隐藏。
            *   **计算动画参数 (`AnimOpenProperties`)**: 计算出动画所需的详细起止参数，包括：窗口裁剪区域 (从图标大小到全屏)、窗口位置/缩放 (从图标位置/大小到全屏)、浮动图标的位置/缩放 (与窗口同步)、浮动图标与窗口的 Alpha 透明度变化（浮动图标淡出、窗口淡入）、窗口圆角（从图标圆角到系统窗口圆角）、阴影等。
            *   **创建主驱动动画 (`ValueAnimator`)**: 创建一个从 0 到 1 的 `ValueAnimator`，时长为 `APP_LAUNCH_DURATION`，使用 `LINEAR` 插值器，它驱动整个动画的进度。
            *   **添加更新监听器 (`MultiValueUpdateListener`)**: 这是每一帧执行变换的地方：
                *   使用多个 `FloatProp` 实例（带有不同的插值器如 `mOpeningXInterpolator`, `mOpeningInterpolator`）根据主进度计算当前帧的精确属性值（位移 `dX`, `dY`，缩放 `mIconScaleToFitScreen`，Alpha `mIconAlpha`，窗口圆角 `mWindowRadius`，窗口裁剪 `mCropRect*` 等）。
                *   **更新 `FloatingIconView`**: 调用 `floatingView.update(...)`，传入计算好的边界、Alpha、形状进度、圆角等，让浮动图标在视觉上匹配正在变化的“窗口”。
                *   **应用 `SurfaceControl.Transaction`**: 创建一个 `SurfaceControl.Transaction`。遍历 `appTargets`，对于 `MODE_OPENING` 的 Target (即正在打开的应用窗口)：
                    *   获取其 `SurfaceControl` (Leash)。
                    *   计算 `Matrix` 来设置缩放和位移。
                    *   调用 `transaction.forSurface(target.leash)` 获取 Surface 属性构建器。
                    *   使用 `.setMatrix()`, `.setWindowCrop()`, `.setAlpha()` (通常是 `1f - mIconAlpha.value`，实现交叉淡入淡出), `.setCornerRadius()`, `.setShadowRadius()` 等方法设置当前帧的窗口属性。
                *   **应用 Transaction:** 调用 `surfaceApplier.scheduleApply(transaction)` 将这一帧的所有 Surface 变换提交给 `SurfaceFlinger`。
            *   **添加清理监听器:** 在 `appAnimator` 上添加 `AnimatorListenerAdapter`，在 `onAnimationEnd` 时释放 `RemoteAnimationTarget` (`openingTargets.release()`) 并可能恢复图标状态。
        *   **创建 Launcher 内容退场动画 (`getLauncherContentAnimator`)**: 创建另一个 `AnimatorSet` 来并行地动画 Launcher 自身的 UI 元素（Workspace, Hotseat, QSB, ScrimView 等），通常是让它们缩小、淡出。源码显示它会根据 Launcher 当前状态 (ALL\_APPS, OVERVIEW, NORMAL) 选择不同的元素和方式进行动画。如果 `ENABLE_SCRIM_FOR_APP_LAUNCH` 开启，还会动画 `ScrimView` 的背景色。
        *   **组合动画:** 将窗口动画 (`getOpeningWindowAnimators` 返回的) 和 Launcher 内容动画 (`getLauncherContentAnimator` 返回的) 添加到主 `AnimatorSet` (`anim`) 中，使它们协同播放。
        *   **添加 JANK 追踪:** 使用 `addCujInstrumentation` 添加卡顿监控。
        *   **设置 Launcher 不可见:** 如果 Launcher 窗口本身是 `MODE_CLOSING` Target，添加 `mForceInvisibleListener`，在动画期间强制 Launcher 视图不可见 (`INVISIBLE_BY_APP_TRANSITIONS`)。
    *   **返回结果:** `AppLaunchAnimationRunner` 通过 `AnimationResult.setAnimation(...)` 将构建好的主 `AnimatorSet` 返回给系统。
5.  **动画结束与清理 (不变)**:
    
    *   系统播放 `AnimatorSet`。动画结束时，`onAnimationEnd` 监听器被调用。
    *   清理 `FloatingIconView`，释放 `SurfaceControl` 资源，执行 `mOnEndCallback` 中的回调，Launcher 状态稳定在 `BACKGROUND_APP`。应用窗口完全可见并获得焦点。

**总结:**

`QuickstepTransitionManager` 通过其内部类 `AppLaunchAnimationRunner` 精确地实现了图标到应用的启动动画。核心在于 `composeIconLaunchAnimator` 方法，它协同了以下几个关键部分：

1.  **`FloatingIconView`:** 提供图标变形放大的视觉引导。
2.  **`SurfaceControl.Transaction`:** 在动画每一帧**直接操控**打开应用的窗口 Surface (Leash)，改变其 Matrix (位置/缩放)、Crop、Alpha、圆角等属性，使其从模拟图标状态平滑过渡到全屏状态。
3.  **`getLauncherContentAnimator`:** 并行地将 Launcher 的 Workspace、Hotseat 等内容动画隐藏。
4.  **`StateManager`:** 将此动画与 Launcher 内部状态（通常是进入 `BACKGROUND_APP`）关联起来。

整个过程充分利用了远程动画和 `SurfaceControl` 的能力，实现了高性能、跨进程、视觉效果丰富且同步精确的启动过渡。

 

  

本文转自 [https://blog.csdn.net/csr\_yang/article/details/147395772?ops\_request\_misc=&request\_id=&biz\_id=102&utm\_term=android%20launcher%20%E7%82%B9%E5%87%BB%E5%9B%BE%E6%A0%87&utm\_medium=distribute.pc\_search\_result.none-task-blog-2~all~sobaiduweb~default-0-147395772.142^v102^pc\_search\_result\_base8&spm=1018.2226.3001.4187](https://blog.csdn.net/csr_yang/article/details/147395772?ops_request_misc=&request_id=&biz_id=102&utm_term=android%20launcher%20%E7%82%B9%E5%87%BB%E5%9B%BE%E6%A0%87&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-0-147395772.142^v102^pc_search_result_base8&spm=1018.2226.3001.4187)，如有侵权，请联系删除。