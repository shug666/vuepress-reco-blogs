---
title: 无障碍服务获取当前Activity的名字
date: 2023-11-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

         找来找去，终于找到能够获取当前Activity名字的方法，需要用到无障碍服务AccessibilityService，在以下的方法中添加代码：

```java
    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {

        AccessibilityNodeInfo source = event.getSource();

        if (source != null) {
            CharSequence packageName = source.getPackageName();
            if (event.getEventType() == event.TYPE_WINDOW_STATE_CHANGED) {

                //获取当前窗口activity名
                ComponentName componentName = new ComponentName(
                        event.getPackageName().toString(),
                        event.getClassName().toString()
                );
                try {
                    String activityName=getPackageManager().getActivityInfo(componentName, 0).toString();
                    activityName=activityName.substring(activityName.indexOf(" "),activityName.indexOf("}"));
                    Log.e("当前窗口activity", "=================" +activityName);
                } catch (PackageManager.NameNotFoundException e) {
                    e.printStackTrace();
                }
          }
    }
}
```

推荐参考阅读：[Android 如何监控当前Foreground Activity，如何获知应用程序的启动\_苍痕的博客-CSDN博客](https://blog.csdn.net/wangbaochu/article/details/50554406 "Android 如何监控当前Foreground Activity，如何获知应用程序的启动_苍痕的博客-CSDN博客") 

  

本文转自 [https://blog.csdn.net/actionwind/article/details/118858034?spm=1001.2101.3001.6650.2&utm\_medium=distribute.pc\_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-2-118858034-blog-77651302.235%5Ev38%5Epc\_relevant\_default\_base&depth\_1-utm\_source=distribute.pc\_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-2-118858034-blog-77651302.235%5Ev38%5Epc\_relevant\_default\_base&utm\_relevant\_index=5](https://blog.csdn.net/actionwind/article/details/118858034?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-2-118858034-blog-77651302.235%5Ev38%5Epc_relevant_default_base&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-2-118858034-blog-77651302.235%5Ev38%5Epc_relevant_default_base&utm_relevant_index=5)，如有侵权，请联系删除。