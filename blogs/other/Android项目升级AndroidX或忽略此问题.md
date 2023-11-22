---
title: Android项目升级AndroidX或忽略此问题
date: 2022-09-05
tags:
 - IDE
categories: 
 - IDE
sticky: 
   true
---

Android Studio升级到3.5后，原先项目引入的是android，现在新建module时有Project needs to be converted to androidx.\* dependencies，而且Finish是灰色，无法创建，现在提供两种解决方法：

**参考一篇博客：**https://blog.csdn.net/weixin_40420578/article/details/100132061

## **项目不升级到AndroidX**

一开始新建module_test时，如下图：

![image-20220905200840138](https://raw.githubusercontent.com/shug666/image/main/images/image-20220905200840138.png)

**步骤一：gradle.properties(Global Properties)下添加：**

```xml
android.useAndroidX=true
android.enableJetifier=true
```

点一下右上角Sync Now

**步骤二：新建module_test，这时就没有Project needs to be converted to androidx.\* dependencies ：**

**步骤三：把module_test的build.gradle——dependencies下引入的androidX包改成android的，如果不知道怎么改，就从原先的module对应的build.gradle里拷贝过来**

**步骤四：在步骤一种添加的改成false**

```
android.useAndroidX=false
android.enableJetifier=false
```

同步一下即可 Sync Now
