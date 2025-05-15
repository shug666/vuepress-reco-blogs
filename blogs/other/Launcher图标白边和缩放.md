---
title: Launcher图标白边和缩放
date: 2024-11-25
tags:
 - android
categories: 
 - android
sticky: 
   true
---

[TOC]

## 问题背景

有的桌面图标有白边，图标被缩放的很小。

## 问题原因

1. 为了统一图标形状  
2. 图标形状可以配置系统的IconMask，修改圆形或者正方形或者水滴等等
3. 具体哪里对app的图标做了缩放功能

## launcher图标加载

### 加载应用图标

**`packages\apps\Launcher3\src\com\android\launcher3\model\LoaderTask.java`**

```java
private List<LauncherActivityInfo> loadAllApps() {
	...
	mBgAllAppsList.add(new AppInfo(app, user, quietMode), app);
	...
}
```

**`packages\apps\Launcher3\src\com\android\launcher3\model\AllAppsList.java`**

```java
    public void add(AppInfo info, LauncherActivityInfo activityInfo) {
        ...
        mIconCache.getTitleAndIcon(info, activityInfo, true);
        ...
    }
```

**`packages\apps\Launcher3\src\com\android\launcher3\icons\IconCache.java`**

getTitleAndIcon方法的cacheLocked里面处理图标

```java
    private synchronized void getTitleAndIcon(
            @NonNull ItemInfoWithIcon infoInOut,
            @NonNull Supplier<LauncherActivityInfo> activityInfoProvider,
            boolean usePkgIcon, boolean useLowResIcon) {
        CacheEntry entry = cacheLocked(infoInOut.getTargetComponent(), infoInOut.user,
                activityInfoProvider, mLauncherActivityInfoCachingLogic, usePkgIcon, useLowResIcon);
        applyCacheEntry(entry, infoInOut);
    }
```

### launcher图标的获取和裁剪

`frameworks\libs\systemui\iconloaderlib\src\com\android\launcher3\icons\cache\BaseIconCache.java` 的**cacheLocked**方法，调用`frameworks\libs\systemui\iconloaderlib\src\com\android\launcher3\icons\cache\CachingLogic.java`的**loadIcon**  

真正的实现在`packages\apps\Launcher3\src\com\android\launcher3\icons\LauncherActivityCachingLogic.java`

```java
    @Override
    public BitmapInfo loadIcon(Context context, LauncherActivityInfo object) {
        try (LauncherIcons li = LauncherIcons.obtain(context)) {
            return li.createBadgedIconBitmap(new IconProvider(context)
                            .getIcon(object, li.mFillResIconDpi),
                    object.getUser(), object.getApplicationInfo().targetSdkVersion);
        }
    }
```

通过保存Drawable到本地发现`new IconProvider(context).getIcon(object, li.mFillResIconDpi)`拿到的图标是ok的。  

也就是说图标的处理在li.**createBadgedIconBitmap**内部。

### Launcher图标的工厂类

**BaseIconFactory.java**控制图标UI展示（图标白边控制） 在这个类中，为Launcher3来构造不同类型的app图标，包括缩放等功能

**`public class LauncherIcons extends BaseIconFactory`**

`frameworks\libs\systemui\iconloaderlib\src\com\android\launcher3\icons\BaseIconFactory.java的createBadgedIconBitmap`方法里，通用一步一步打印保存bitmap到本地，发现是

```java
icon = normalizeAndWrapToAdaptiveIcon(icon, shrinkNonAdaptiveIcons, null, scale);//这个方法改变了图标的形状，把各种各样的图标改成了符合系统图标形状的样子并且用来判断缩放比例
```
```java
    private Drawable normalizeAndWrapToAdaptiveIcon(@NonNull Drawable icon,
            boolean shrinkNonAdaptiveIcons, RectF outIconBounds, float[] outScale) {
        if (icon == null) {
            return null;
        }
        float scale = 1f;
        Log.i("cheyingkun","normalizeAndWrapToAdaptiveIcon 111 : "+isMyIcon);

        if (shrinkNonAdaptiveIcons && ATLEAST_OREO) {
            if (mWrapperIcon == null) {
                mWrapperIcon = mContext.getDrawable(R.drawable.adaptive_icon_drawable_wrapper)
                        .mutate();
            }
            AdaptiveIconDrawable dr = (AdaptiveIconDrawable) mWrapperIcon;
            dr.setBounds(0, 0, 1, 1);
            boolean[] outShape = new boolean[1];
            //缩放比例1
            scale = getNormalizer().getScale(icon, outIconBounds, dr.getIconMask(), outShape);
            Log.d("cheyingkun","normalizeAndWrapToAdaptiveIcon 222 scale: "+scale);
            if (!(icon instanceof AdaptiveIconDrawable) && !outShape[0]) {
                FixedScaleDrawable fsd = ((FixedScaleDrawable) dr.getForeground());
                fsd.setDrawable(icon);
                fsd.setScale(scale);
                icon = dr;
                //缩放比例2
                scale = getNormalizer().getScale(icon, outIconBounds, null, null);
                Log.d("cheyingkun","normalizeAndWrapToAdaptiveIcon 333 scale: "+scale);
                //这里设置的白色背景
                ((ColorDrawable) dr.getBackground()).setColor(mWrapperBackgroundColor);
            }
        } else {
            scale = getNormalizer().getScale(icon, outIconBounds, null, null);
            Log.d("cheyingkun","normalizeAndWrapToAdaptiveIcon 444 scale: "+scale);
        }

        outScale[0] = scale;
        return icon;
    }
```

**FixedScaleDrawable**中

```java
//把这个缩放比例改为1f
private static final float LEGACY_ICON_SCALE = 1f;//.7f * .6667f;
    @Override
    public void draw(Canvas canvas) {
        int saveCount = canvas.save();
        canvas.scale(mScaleX, mScaleY,
                getBounds().exactCenterX(), getBounds().exactCenterY());
        super.draw(canvas);
        canvas.restoreToCount(saveCount);
    }
```

最终图标呈现细节在draw中的缩放比例。

源码中的**`frameworks\base\graphics\java\android\graphics\drawable\AdaptiveIconDrawable.java`**

```java
private static final float EXTRA_INSET_PERCENTAGE = 1 / 4f;
private static final float DEFAULT_VIEW_PORT_SCALE = 1f / (1 + 2 * EXTRA_INSET_PERCENTAGE);
```

AdaptiveIconDrawable会对前景图做裁剪，而不是等比例缩放。所以会导致没有适配AdaptiveIconDrawable的应用图标可能被裁剪掉。

也不能直接修改AdaptiveIconDrawable里的DEFAULT\_VIEW\_PORT\_SCALE ，会导致Google应用图标前景图异常小。

## 总结

1. 图标的处理还是在iconloaderlib中。  
2. BaseIconFactory.java的normalizeAndWrapToAdaptiveIcon处理了图标形状、白色背景。  
3. 里面有几个缩放比例，调整会影响桌面图标大小和白色背景。

  

本文转自 [https://blog.csdn.net/a396604593/article/details/128874127](https://blog.csdn.net/a396604593/article/details/128874127)，如有侵权，请联系删除。