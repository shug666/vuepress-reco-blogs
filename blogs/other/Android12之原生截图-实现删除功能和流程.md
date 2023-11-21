---
title: Android12 之原生截图，实现删除功能和流程
date: 2023-02-14
tags:
 - android
categories: 
 - android
sticky: 
   true
---

 

概述：
-------------------------------------------------------------------

在Android12原生中，截图的按钮中目前只有修改按钮和分享按钮以及单页面情况下隐藏的长截屏按钮。  
在基于12原生的基础上，只要触发了截屏，图片就一定会保存，今天就实现一个小功能，在原生的基础上添加删除功能。

主要思路：
---------------------------------------------------------------------

首先添加一个删除按钮布局，然后在调用截屏功能后，保存截图资源时，再通过URI去作删除截图产生的媒体资源。

1.添加一个删除按钮布局:
-----------------------------------------------------------------------------

```xml
<HorizontalScrollView
    android:id="@+id/global_screenshot_actions_container"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:layout_marginEnd="@dimen/screenshot_action_container_margin_horizontal"
    android:paddingEnd="@dimen/screenshot_action_container_padding_right"
    android:paddingVertical="@dimen/screenshot_action_container_padding_vertical"
    android:elevation="1dp"
    android:scrollbars="none"
    app:layout_constraintHorizontal_bias="0"
    app:layout_constraintWidth_percent="1.0"
    app:layout_constraintWidth_max="wrap"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintStart_toEndOf="@+id/global_screenshot_preview_border"
    app:layout_constraintEnd_toEndOf="parent">
    <LinearLayout
        android:id="@+id/global_screenshot_actions"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content">
        //1.复用global_screenshot_action_chip.xml布局，实现增加delete按钮布局
        <include layout="@layout/global_screenshot_action_chip"
            android:id="@+id/screenshot_delete_chip"/>
        <include layout="@layout/global_screenshot_action_chip"
                 android:id="@+id/screenshot_share_chip"/>
        <include layout="@layout/global_screenshot_action_chip"
                 android:id="@+id/screenshot_edit_chip"/>
        <include layout="@layout/global_screenshot_action_chip"
                 android:id="@+id/screenshot_scroll_chip"
                 android:visibility="gone" />
    </LinearLayout>
</HorizontalScrollView>
```

2.在ScreenshotView.java中初始化
------------------------------------------------------------------------------------------

```java
public class ScreenshotView extends FrameLayout implements ViewTreeObserver.OnComputeInternalInsetsListener {
    ...
//1.在ScreenshotView中对screenshot_delete_chip进行初始化
    private ScreenshotActionChip mDeleteChip;
    
    protected void onFinishInflate() {
        ...
        mDeleteChip = requireNonNull(mActionsContainer.findViewById(R.id.screenshot_delete_chip));
    }
}
```

3.ScreenshotView.createScreenshotActionsShadeAnimation()
------------------------------------------------------------------------------------------------------------------------

```java
ValueAnimator createScreenshotActionsShadeAnimation() {
    // By default the activities won't be able to start immediately; override this to keep
    // the same behavior as if started from a notification
    try {
        ActivityManager.getService().resumeAppSwitches();
    } catch (RemoteException e) {
    }

    ArrayList<ScreenshotActionChip> chips = new ArrayList<>();

    
//1.设置删除文字
    mDeleteChip.setContentDescription(mContext.getString(com.android.internal.R.string.delete));
//2.设置删除图标
    mDeleteChip.setIcon(Icon.createWithResource(mContext, R.drawable.ic_screenshot_delete), true);
//3.删除的点击监听
mDeleteChip.setOnClickListener(v -> {
            mDeleteChip.setIsPending(true);
            mShareChip.setIsPending(false);
            mEditChip.setIsPending(false);
            if (mQuickShareChip != null) {
                mQuickShareChip.setIsPending(false);
            }
//4.将DELETE赋值给当前的交互状态
    mPendingInteraction = PendingInteraction.DELETE;
    });
    chips.add(mDeleteChip);
    
    mShareChip.setContentDescription(mContext.getString(com.android.internal.R.string.share));
    mShareChip.setIcon(Icon.createWithResource(mContext, R.drawable.ic_screenshot_share), true);
    mShareChip.setOnClickListener(v -> {
        mShareChip.setIsPending(true);
        
//5.也要在其他chip中将除了当前chip外的chip挂起视图置为false
        mDeleteChip.setIsPending(false);
        mEditChip.setIsPending(false);
        if (mQuickShareChip != null) {
            mQuickShareChip.setIsPending(false);
        }
        mPendingInteraction = PendingInteraction.SHARE;
    });
    chips.add(mShareChip);
}
```

前三步操作是添加删除按钮布局和初始化操作。接下来从调用系统截屏开始，找到截图时保存的那张图片的URI。

4.ScreenshotController.takeScreenshotInternal()
---------------------------------------------------------------------------------------------------------------

```java
private void takeScreenshotInternal(Consumer<Uri> finisher, Rect crop) {
//1.先判断当前屏幕是否为竖屏状态
    mScreenshotTakenInPortrait =
            mContext.getResources().getConfiguration().orientation == ORIENTATION_PORTRAIT;

    // copy the input Rect, since SurfaceControl.screenshot can mutate it
//2.先new一个矩形对象用于保存截图大小，再在captureScreenshot()方法中返回一个位图（该方法下面有具体内容）
    Rect screenRect = new Rect(crop);
    Bitmap screenshot = captureScreenshot(crop);

    if (screenshot == null) {
        Log.e(TAG, "takeScreenshotInternal: Screenshot bitmap was null");
        mNotificationsController.notifyScreenshotError(
                R.string.screenshot_failed_to_capture_text);
        if (mCurrentRequestCallback != null) {
            mCurrentRequestCallback.reportError();
        }
        return;
    }
//3.最后调用保存截屏将刚才的返回的图保存
    saveScreenshot(screenshot, finisher, screenRect, Insets.NONE, true);
}
```
```java
private Bitmap captureScreenshot(Rect crop) {
    int width = crop.width();
    int height = crop.height();
    Bitmap screenshot = null;
    final Display display = getDefaultDisplay();//return主设备
    final DisplayAddress address = display.getAddress();
    if (!(address instanceof DisplayAddress.Physical)) {
        Log.e(TAG, "Skipping Screenshot - Default display does not have a physical address: "
                + display);
    } else {
        final DisplayAddress.Physical physicalAddress = (DisplayAddress.Physical) address;

        final IBinder displayToken = SurfaceControl.getPhysicalDisplayToken(
                physicalAddress.getPhysicalDisplayId());
        final SurfaceControl.DisplayCaptureArgs captureArgs =
                new SurfaceControl.DisplayCaptureArgs.Builder(displayToken)
                        .setSourceCrop(crop)
                        .setSize(width, height)
                        .build();
        final SurfaceControl.ScreenshotHardwareBuffer screenshotBuffer =
                SurfaceControl.captureDisplay(captureArgs);
//4.返回ScreenshotHardwareBuffer获取到的位图
        screenshot = screenshotBuffer == null ? null : screenshotBuffer.asBitmap();
    }
    return screenshot;
}
```
```java
public Bitmap asBitmap() {
        if (mHardwareBuffer == null) {
            Log.w(TAG, "Failed to take screenshot. Null screenshot object");
            return null;
        }
        return Bitmap.wrapHardwareBuffer(mHardwareBuffer, mColorSpace);
}
```

5.ScreenshotController.saveScreenshot()
-------------------------------------------------------------------------------------------------------

```java
private void saveScreenshot(Bitmap screenshot, Consumer<Uri> finisher, Rect screenRect,
        Insets screenInsets, boolean showFlash) {
    if (mAccessibilityManager.isEnabled()) {
        AccessibilityEvent event =
                new AccessibilityEvent(AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED);
        event.setContentDescription(
                mContext.getResources().getString(R.string.screenshot_saving_title));
        mAccessibilityManager.sendAccessibilityEvent(event);
    }

    if (mScreenshotView.isAttachedToWindow()) {
        // if we didn't already dismiss for another reason
        if (!mScreenshotView.isDismissing()) {
            mUiEventLogger.log(ScreenshotEvent.SCREENSHOT_REENTERED);
        }
        if (DEBUG_WINDOW) {
            Log.d(TAG, "saveScreenshot: screenshotView is already attached, resetting. "
                    + "(dismissing=" + mScreenshotView.isDismissing() + ")");
        }
        mScreenshotView.reset();
    }
    mScreenshotView.updateOrientation(
            mWindowManager.getCurrentWindowMetrics().getWindowInsets());

    mScreenBitmap = screenshot;

    if (!isUserSetupComplete()) {
        Log.w(TAG, "User setup not complete, displaying toast only");
        // User setup isn't complete, so we don't want to show any UI beyond a toast, as editing
        // and sharing shouldn't be exposed to the user.
        saveScreenshotAndToast(finisher);
        return;
    }

    // Optimizations
    mScreenBitmap.setHasAlpha(false);
    mScreenBitmap.prepareToDraw();
    //1.保存截图的线程
    saveScreenshotInWorkerThread(finisher, this::showUiOnActionsReady,
            this::showUiOnQuickShareActionReady);
    ...
}
```
```java
private void saveScreenshotInWorkerThread(Consumer<Uri> finisher,
        @Nullable ScreenshotController.ActionsReadyListener actionsReadyListener,
        @Nullable ScreenshotController.QuickShareActionReadyListener
                quickShareActionsReadyListener) {
    ScreenshotController.SaveImageInBackgroundData
            data = new ScreenshotController.SaveImageInBackgroundData();
    data.image = mScreenBitmap;
    data.finisher = finisher;
    data.mActionsReadyListener = actionsReadyListener;
    data.mQuickShareActionsReadyListener = quickShareActionsReadyListener;

    if (mSaveInBgTask != null) {
        // just log success/failure for the pre-existing screenshot
        mSaveInBgTask.setActionsReadyListener(this::logSuccessOnActionsReady);
    }

    mSaveInBgTask = new SaveImageInBackgroundTask(mContext, mImageExporter,
            mScreenshotSmartActions, data, getActionTransitionSupplier());
//2.保存任务异步进行，后续删除相关
    mSaveInBgTask.execute();
}
private void showUiOnActionsReady(ScreenshotController.SavedImageData imageData) {
//3.记录截图成功与否
    logSuccessOnActionsReady(imageData);
    if (DEBUG_UI) {
        Log.d(TAG, "Showing UI actions");
    }

    resetTimeout();
    if (imageData.uri != null) {
//4.直到动画结束，再将imageData传入到ScreenshotView中，调用setChipIntents()给单个chip提供交互
        mScreenshotHandler.post(() -> {
            if (mScreenshotAnimation != null && mScreenshotAnimation.isRunning()) {
                mScreenshotAnimation.addListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationEnd(Animator animation) {
                        super.onAnimationEnd(animation);
                        mScreenshotView.setChipIntents(imageData);
                    }
                });
            } else {
                mScreenshotView.setChipIntents(imageData);
            }
        });
    }
}
```

6.ScreenshotView.setChipIntents()
-------------------------------------------------------------------------------------------------

```java
void setChipIntents(ScreenshotController.SavedImageData imageData) {
    mShareChip.setOnClickListener(v -> {
        mUiEventLogger.log(ScreenshotEvent.SCREENSHOT_SHARE_TAPPED);
        startSharedTransition(
                imageData.shareTransition.get());
    });
    ...
    if (mDeleteChip != null){
//1.设置PendingIntent(PendingIntent,Runnable)
        mDeleteChip.setPendingIntent(imageData.deleteAction.actionIntent,
                () -> {
                    mUiEventLogger.log(ScreenshotEvent.SCREENSHOT_NOT_SAVED);
                    animateDismissal();
                });
    }
    ...
}
```

7.SaveImageInBackgroundTask.doInBackground()
------------------------------------------------------------------------------------------------------------

```java
protected Void doInBackground(Void... paramsUnused) {
    ...
    mImageData.uri = uri;
    mImageData.smartActions = smartActions;
    mImageData.shareTransition = createShareAction(mContext, mContext.getResources(), uri);
    mImageData.editTransition = createEditAction(mContext, mContext.getResources(), uri);
//1.创建删除动作通知，与PendingIntent共同
    mImageData.deleteAction = createDeleteAction(mContext, mContext.getResources(), uri);
    mImageData.quickShareAction = createQuickShareAction(mContext,mQuickShareData.quickShareAction, uri);
    ...
}
```
```java
Notification.Action createDeleteAction(Context context, Resources r, Uri uri) {
    // Make sure pending intents for the system user are still unique across users
    // by setting the (otherwise unused) request code to the current user id.
    int requestCode = mContext.getUserId();

    // Create a delete action for the notification
    PendingIntent deleteAction = PendingIntent.getBroadcast(context, requestCode,
            new Intent(context, DeleteScreenshotReceiver.class)
//携带URI到DeleteScreenshotReceiver.class
                    .putExtra(ScreenshotController.SCREENSHOT_URI_ID, uri.toString())
                    .putExtra(ScreenshotController.EXTRA_ID, mScreenshotId)
                    .putExtra(ScreenshotController.EXTRA_SMART_ACTIONS_ENABLED,
                            mSmartActionsEnabled)
                    .addFlags(Intent.FLAG_RECEIVER_FOREGROUND),
            PendingIntent.FLAG_CANCEL_CURRENT
                    | PendingIntent.FLAG_ONE_SHOT
                    | PendingIntent.FLAG_IMMUTABLE);
    Notification.Action.Builder deleteActionBuilder = new Notification.Action.Builder(
            Icon.createWithResource(r, R.drawable.ic_screenshot_delete),
            r.getString(com.android.internal.R.string.delete), deleteAction);

    return deleteActionBuilder.build();
}
```

8.DeleteScreenshotReceiver.onReceive()
------------------------------------------------------------------------------------------------------

```java
public class DeleteScreenshotReceiver extends BroadcastReceiver {

    private final ScreenshotSmartActions mScreenshotSmartActions;
    private final Executor mBackgroundExecutor;

    @Inject
    public DeleteScreenshotReceiver(ScreenshotSmartActions screenshotSmartActions,
            @Background Executor backgroundExecutor) {
        mScreenshotSmartActions = screenshotSmartActions;
        mBackgroundExecutor = backgroundExecutor;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (!intent.hasExtra(SCREENSHOT_URI_ID)) {
            return;
        }

        // And delete the image from the media store
        final Uri uri = Uri.parse(intent.getStringExtra(SCREENSHOT_URI_ID));
        mBackgroundExecutor.execute(() -> {
//根据intent携带的uri将其删除
ContentResolver resolver = context.getContentResolver();
            resolver.delete(uri, null, null);
        });
        if (intent.getBooleanExtra(EXTRA_SMART_ACTIONS_ENABLED, false)) {
            mScreenshotSmartActions.notifyScreenshotAction(
                    context, intent.getStringExtra(EXTRA_ID), ACTION_TYPE_DELETE, false, null);
        }
    }
}
```



本文转自 [https://blog.csdn.net/a18870785170/article/details/126893311](https://blog.csdn.net/a18870785170/article/details/126893311)，如有侵权，请联系删除。