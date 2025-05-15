---
title: Android14 SystemUI下拉菜单栏高斯模糊背景效果
date: 2025-03-10
tags:
 - android
categories: 
 - android
sticky: 
   true
---

我们都知道，从Android12起，下拉菜单栏控制中心都是黑色的，看起来非常不美观，而且国内的手机系统UI都做的比较美观，大部分的下拉菜单UI背景都是实现了高斯模糊效果，所以客户也会要求实现类似于这样的效果。

在以前的Android项目中，实现下拉菜单栏的模糊背景就是通过截图的方式进行替换背景，而这种方式下拉菜单背景极易替换不了，就算是在各个地方都适配，还是有概率在复杂场景或者一些测试手法下出现背景是黑的情况，并且这种方式还比较影响性能，毕竟每次都要去截图一次，多做了额外的事。下面我说一种方法百分百不会引起下拉栏背景异常的修改方法，就不管是复杂场景或者特殊测试手法下，背景都是高斯模糊的效果。

首先讲一下通过截图替换背景的实现方式的思路，就不做详细介绍。

## 一，截图方式实现SystemUI下拉栏的模糊效果

首先要在文件`frameworks/base/packages/SystemUI/res/layout/status\_bar\_expanded.xml`中定义背景的ImageView

然后再在NotificationPanelViewController.java中监听下拉事件，实现显示与否模糊效果，其他百度博文都有写如何实现，重点讲解第二种实现方案。

## 二，第二种实现SystemUI下拉栏的模糊效果

这种方式其实是Google已经提供给我们的方式，就是发现找到并利用它需要花费一番功夫。非常遗憾，Android Go版本暂不支持此种方式。

首先，我们要先将下拉菜单栏修改成透明的，如何修改呢，请看文件：

`frameworks/base/packages/SystemUI/src/com/android/systemui/statusbar/phone/ScrimController.java`

```java
private void updateScrimColor(View scrim, float alpha, int tint) {
        alpha = Math.max(0, Math.min(1.0f, alpha));
        if (scrim instanceof ScrimView) {
            ScrimView scrimView = (ScrimView) scrim;
            if (DEBUG_MODE) {
                tint = getDebugScrimTint(scrimView);
            }

            Trace.traceCounter(Trace.TRACE_TAG_APP, getScrimName(scrimView) + "_alpha",
                    (int) (alpha * 255));

            Trace.traceCounter(Trace.TRACE_TAG_APP, getScrimName(scrimView) + "_tint",
                    Color.alpha(tint));
            scrimView.setTint(tint);
            if (!mIsBouncerToGoneTransitionRunning) {
                scrimView.setViewAlpha(alpha);
            }
        } else {
            scrim.setAlpha(alpha);
        }
        dispatchScrimsVisible();
    }
```

重点看这个方法，它是设置下拉菜单栏背景scrimView的透明度的，所以我们要做的就是把alpha改为0，那么下拉菜单栏现在就是完全透明的了，修改如下

```java
private void updateScrimColor(View scrim, float alpha, int tint) {
-       alpha = Math.max(0, Math.min(1.0f, alpha));
+       alpha = 0f;
        if (scrim instanceof ScrimView) {
            ScrimView scrimView = (ScrimView) scrim;
            if (DEBUG_MODE) {
                tint = getDebugScrimTint(scrimView);
            }

            Trace.traceCounter(Trace.TRACE_TAG_APP, getScrimName(scrimView) + "_alpha",
                    (int) (alpha * 255));

            Trace.traceCounter(Trace.TRACE_TAG_APP, getScrimName(scrimView) + "_tint",
                    Color.alpha(tint));
            scrimView.setTint(tint);
-           if (!mIsBouncerToGoneTransitionRunning) {
-               scrimView.setViewAlpha(alpha);
-           }
+           scrimView.setViewAlpha(alpha);
        } else {
            scrim.setAlpha(alpha);
        }
        dispatchScrimsVisible();
    }
```

这里直接把所有传过来去设置背景透明度的alpha 都强制为0了，所以现在下拉菜单栏就是完全透明且有一定的模糊效果，这里的模糊效果是文件

`frameworks/base/packages/SystemUI/src/com/android/systemui/statusbar/NotificationShadeDepthController.kt`增加的模糊效果

主要代码

```kotlin
private fun computeBlurAndZoomOut(): Pair<Int, Float> {
        val animationRadius = MathUtils.constrain(shadeAnimation.radius,
                blurUtils.minBlurRadius.toFloat(), blurUtils.maxBlurRadius.toFloat())
        val expansionRadius = blurUtils.blurRadiusOfRatio(
                ShadeInterpolation.getNotificationScrimAlpha(
                        if (shouldApplyShadeBlur()) shadeExpansion else 0f))
        var combinedBlur = (expansionRadius * INTERACTION_BLUR_FRACTION +
                animationRadius * ANIMATION_BLUR_FRACTION)
        val qsExpandedRatio = ShadeInterpolation.getNotificationScrimAlpha(qsPanelExpansion) *
                shadeExpansion
        combinedBlur = max(combinedBlur, blurUtils.blurRadiusOfRatio(qsExpandedRatio))
        combinedBlur = max(combinedBlur, blurUtils.blurRadiusOfRatio(transitionToFullShadeProgress))
        var shadeRadius = max(combinedBlur, wakeAndUnlockBlurRadius)

        if (blursDisabledForAppLaunch || blursDisabledForUnlock) {
            shadeRadius = 0f
        }

        var zoomOut = MathUtils.saturate(blurUtils.ratioOfBlurRadius(shadeRadius))
        var blur = shadeRadius.toInt()

        if (inSplitShade) {
            zoomOut = 0f
        }

        // Make blur be 0 if it is necessary to stop blur effect.
        if (scrimsVisible) {
            blur = 0
            zoomOut = 0f
        }

        if (!blurUtils.supportsBlursOnWindows()) {
            blur = 0
        }

        // Brightness slider removes blur, but doesn't affect zooms
        blur = (blur * (1f - brightnessMirrorSpring.ratio)).toInt()

        return Pair(blur, zoomOut)
    }
```

`blur = (blur * (1f - brightnessMirrorSpring.ratio)).toInt()`这个代码就是必要的模糊度，我们就可以根据这个值适当的增加或者减少模糊度，注意这里增加或减少一定要用乘的方式，比如当前我就是用乘

修改如下：

```kotlin
        if (!blurUtils.supportsBlursOnWindows()) {
            blur = 0
        }

        // Brightness slider removes blur, but doesn't affect zooms
-       blur = (blur * (1f - brightnessMirrorSpring.ratio)).toInt()
+       blur = (blur * (1f - brightnessMirrorSpring.ratio)).toInt() *2

        return Pair(blur, zoomOut)
    }
```

这里我乘了2，必须用乘。这样模糊度就增加了。但是还有一个问题，就是当在白色页面时，下拉模糊之后背景是白色的，我们的下拉栏的字体也是白色的，就看的不是很清楚，所以我们需要在当前模糊背景下再增加一个暗黑色，增加在如下文件：

`frameworks/base/packages/SystemUI/src/com/android/systemui/statusbar/BlurUtils.kt`

```kotlin
fun applyBlur(viewRootImpl: ViewRootImpl?, radius: Int, opaque: Boolean) {
        if (viewRootImpl == null || !viewRootImpl.surfaceControl.isValid) {
            return
        }
        createTransaction().use {
            if (supportsBlursOnWindows()) {
                it.setBackgroundBlurRadius(viewRootImpl.surfaceControl, radius)
                if (!earlyWakeupEnabled && lastAppliedBlur == 0 && radius != 0) {
                    Trace.asyncTraceForTrackBegin(
                        TRACE_TAG_APP,
                        TRACK_NAME,
                        "eEarlyWakeup (applyBlur)",
                        0
                    )
                    it.setEarlyWakeupStart()
                    earlyWakeupEnabled = true
                }
                if (earlyWakeupEnabled && lastAppliedBlur != 0 && radius == 0) {
                    it.setEarlyWakeupEnd()
                    Trace.asyncTraceForTrackEnd(TRACE_TAG_APP, TRACK_NAME, 0)
                    earlyWakeupEnabled = false
                }
                lastAppliedBlur = radius
            }
            it.setOpaque(viewRootImpl.surfaceControl, opaque)
            it.apply()
        }
    }
```

所以我，们用代码给viewRootImpl再增加一个暗色的就行，方法如下

```kotlin
fun applyBlur(viewRootImpl: ViewRootImpl?, radius: Int, opaque: Boolean) {
        if (viewRootImpl == null || !viewRootImpl.surfaceControl.isValid) {
            return
        }
        createTransaction().use {
            if (supportsBlursOnWindows()) {
                it.setBackgroundBlurRadius(viewRootImpl.surfaceControl, radius)
                if (!earlyWakeupEnabled && lastAppliedBlur == 0 && radius != 0) {
                    Trace.asyncTraceForTrackBegin(
                        TRACE_TAG_APP,
                        TRACK_NAME,
                        "eEarlyWakeup (applyBlur)",
                        0
                    )
                    it.setEarlyWakeupStart()
                    earlyWakeupEnabled = true
                }
                if (earlyWakeupEnabled && lastAppliedBlur != 0 && radius == 0) {
                    it.setEarlyWakeupEnd()
                    Trace.asyncTraceForTrackEnd(TRACE_TAG_APP, TRACK_NAME, 0)
                    earlyWakeupEnabled = false
                }
                lastAppliedBlur = radius
            }
            it.setOpaque(viewRootImpl.surfaceControl, opaque)
+           val alpha = (255 * (radius.toFloat() / 100.0f)).toInt()
+           val grayColor = (alpha shl 24) or 0x101010
+           viewRootImpl.view?.setBackgroundColor(grayColor)
            it.apply()
        }
    }
```

这样下拉菜单栏背景模糊效果就大功告成，这里要用radius模糊度来设置这个背景颜色，不能用一个固定的值，否则会有闪屏发生。
