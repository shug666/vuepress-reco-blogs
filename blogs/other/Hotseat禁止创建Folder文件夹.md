---
title: Launcher3 Hotseat禁止创建Folder文件夹
date: 2024-12-02
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 1. 概述

在13.0的系统rom定制化开发中，在laucher3的某些功能中，在拖拽item时 靠近某个图标时会形成文件夹（folder）,
而根据客户需求不想再hotseat形成文件夹， 这就要从workspace.java从来寻找解决方案了分析hotseat是怎么变成
folder的，接下来具体实现相关功能

## 2. 核心代码

```java
/packages/apps/Launcher3/src/com/android/launcher3/Workspace.java
```

## 3. 功能分析和实现

在Launcher3中长按桌面图标在拖动app图标，当靠近某个app的图标的时候，这时候这两个app图标就会形成文件夹图标FolderIcon的缩略图。

打开的文件夹叫Folder，桌面上和图标一样的文件夹叫FolderIcon，文件夹的主要逻辑代码都在`Launcher\src\com\android\launcher3\folder`包下面

在Launcher3中添加默认文件夹就是通过添加folder中的，然后展开文件夹后，显示当前的item图标，而关于folder文件夹的布局就是`user_folder_icon_normalized.xml`
在Launcher3中形成文件夹的主要流程，就是在Workspace.java中的onDrop()方法里面实现的，在这里会根据拖拽释放的时候，根据拖动图标落点处可以合成一个Folder，如果满足文件夹的条件，
调用CellLayout.java的performReorder方法来形成文件夹，最主要的方法就是createUserFolderIfNecessary()方法来实现创建文件夹功能

### 3.1 取消创建文件夹

在Launcher3 中,工作区(Workspace)是指桌面上显示应用程序和小部件的区域

Workspace.java: 抽象的桌面。由N个cellLayout组成,从cellLayout更高一级的层面上对事件的处理。接下来分析下Folder文件夹形成的过程

```java
 boolean createUserFolderIfNecessary(View newView, int container, CellLayout target,
              int[] targetCell, float distance, boolean external, DragObject d) {
    if (distance > target.getFolderCreationRadius(targetCell)) return false;
          View v = target.getChildAt(targetCell[0], targetCell[1]);
  
          boolean hasntMoved = false;
          if (mDragInfo != null) {
              CellLayout cellParent = getParentCellLayoutForView(mDragInfo.cell);
              hasntMoved = (mDragInfo.cellX == targetCell[0] &&
                      mDragInfo.cellY == targetCell[1]) && (cellParent == target);
          }
  
          if (v == null || hasntMoved || !mCreateUserFolderOnDrop) return false;
          mCreateUserFolderOnDrop = false;
          final int screenId = getIdForScreen(target);
  
          boolean aboveShortcut = (v.getTag() instanceof WorkspaceItemInfo);
          boolean willBecomeShortcut = (newView.getTag() instanceof WorkspaceItemInfo);
  
          if (aboveShortcut && willBecomeShortcut) {
              WorkspaceItemInfo sourceInfo = (WorkspaceItemInfo) newView.getTag();
              WorkspaceItemInfo destInfo = (WorkspaceItemInfo) v.getTag();
              // if the drag started here, we need to remove it from the workspace
              if (!external) {
                  getParentCellLayoutForView(mDragInfo.cell).removeView(mDragInfo.cell);
              }
  
              Rect folderLocation = new Rect();
              float scale = mLauncher.getDragLayer().getDescendantRectRelativeToSelf(v, folderLocation);
              target.removeView(v);
              mStatsLogManager.logger().withItemInfo(destInfo).withInstanceId(d.logInstanceId)
                      .log(LauncherEvent.LAUNCHER_ITEM_DROP_FOLDER_CREATED);
              FolderIcon fi = mLauncher.addFolder(target, container, screenId, targetCell[0],
                      targetCell[1]);
              destInfo.cellX = -1;
              destInfo.cellY = -1;
              sourceInfo.cellX = -1;
              sourceInfo.cellY = -1;
  
              // If the dragView is null, we can't animate
              boolean animate = d != null;
              if (animate) {
                  // In order to keep everything continuous, we hand off the currently rendered
                  // folder background to the newly created icon. This preserves animation state.
                  fi.setFolderBackground(mFolderCreateBg);
                  mFolderCreateBg = new PreviewBackground();
                  fi.performCreateAnimation(destInfo, v, sourceInfo, d, folderLocation, scale);
              } else {
                  fi.prepareCreateAnimation(v);
                  fi.addItem(destInfo);
                  fi.addItem(sourceInfo);
              }
              return true;
          }
          return false;
      }
```

通过上述的分析得知，CellLayout.java相关方法分析得知，在createUserFolderIfNecessary方法主要是生成文件夹的操作，所以不想再hotseat形成文件夹就做如下修改:

```java
 boolean createUserFolderIfNecessary(View newView, long container, CellLayout target,
                int[] targetCell, float distance, boolean external, DragView dragView,
                Runnable postAnimationRunnable) {
            //core begin
            if (container == LauncherSettings.Favorites.CONTAINER_HOTSEAT) {
                return false;
            }
            //core end
    if (distance > mMaxDistanceForFolderCreation) return false;
            View v = target.getChildAt(targetCell[0], targetCell[1]);
```

修改完以后运行一下，发现确实有效果 但是在HotSeat中拖动一个APP放到目标APP上方仍然会有一个文件夹的虚影

继续在workspace.java中看到了manageFolderFeedback()，管理文件夹进入方法看下：

### 3.2 取消动画虚影

通过上述的分析得知，Workspace.java的核心功能就是负责加载app图标folder文件夹widget微件功能，接下来看下folder的相关功能

```java
private void manageFolderFeedback(float distance, DragObject dragObject) {
          if (distance > mDragTargetLayout.getFolderCreationRadius(mTargetCell)) {
              if ((mDragMode == DRAG_MODE_ADD_TO_FOLDER
                      || mDragMode == DRAG_MODE_CREATE_FOLDER)) {
                  setDragMode(DRAG_MODE_NONE);
              }
              return;
          }
  
          final View dragOverView = mDragTargetLayout.getChildAt(mTargetCell[0], mTargetCell[1]);
          ItemInfo info = dragObject.dragInfo;
          boolean userFolderPending = willCreateUserFolder(info, dragOverView, false);
          if (mDragMode == DRAG_MODE_NONE && userFolderPending) {
  
              mFolderCreateBg = new PreviewBackground();
              mFolderCreateBg.setup(mLauncher, mLauncher, null,
                      dragOverView.getMeasuredWidth(), dragOverView.getPaddingTop());
  
              // The full preview background should appear behind the icon
              mFolderCreateBg.isClipping = false;
  
              mFolderCreateBg.animateToAccept(mDragTargetLayout, mTargetCell[0], mTargetCell[1]);
              mDragTargetLayout.clearDragOutlines();
              setDragMode(DRAG_MODE_CREATE_FOLDER);
  
              if (dragObject.stateAnnouncer != null) {
                  dragObject.stateAnnouncer.announce(WorkspaceAccessibilityHelper
                          .getDescriptionForDropOver(dragOverView, getContext()));
              }
              return;
          }
  
          boolean willAddToFolder = willAddToExistingUserFolder(info, dragOverView);
          if (willAddToFolder && mDragMode == DRAG_MODE_NONE) {
              mDragOverFolderIcon = ((FolderIcon) dragOverView);
              mDragOverFolderIcon.onDragEnter(info);
              if (mDragTargetLayout != null) {
                  mDragTargetLayout.clearDragOutlines();
              }
              setDragMode(DRAG_MODE_ADD_TO_FOLDER);
  
              if (dragObject.stateAnnouncer != null) {
                  dragObject.stateAnnouncer.announce(WorkspaceAccessibilityHelper
                          .getDescriptionForDropOver(dragOverView, getContext()));
              }
              return;
          }
  
          if (mDragMode == DRAG_MODE_ADD_TO_FOLDER && !willAddToFolder) {
              setDragMode(DRAG_MODE_NONE);
          }
          if (mDragMode == DRAG_MODE_CREATE_FOLDER && !userFolderPending) {
              setDragMode(DRAG_MODE_NONE);
          }
      }
```

在manageFolderFeedback()中的boolean userFolderPending变量就是决定在拖拽的时候是否会有阴影产生的，所以就让这里为false就好了, 改完后测试发现找到解决方法:
修改如下:

```java
 private void manageFolderFeedback(float distance, DragObject dragObject) {
          if (distance > mDragTargetLayout.getFolderCreationRadius(mTargetCell)) {
              if ((mDragMode == DRAG_MODE_ADD_TO_FOLDER
                      || mDragMode == DRAG_MODE_CREATE_FOLDER)) {
                  setDragMode(DRAG_MODE_NONE);
              }
              return;
          }
  
          final View dragOverView = mDragTargetLayout.getChildAt(mTargetCell[0], mTargetCell[1]);
          ItemInfo info = dragObject.dragInfo;
     
          -  boolean userFolderPending = willCreateUserFolder(info, dragOverView, false);
          + boolean userFolderPending = willCreateUserFolder(info, dragOverView, false)
                    && !mLauncher.isHotseatLayout(targetLayout);
```