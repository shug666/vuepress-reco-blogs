---
title: Android Studio Gradle 加速指南
date: 2023-11-21
tags:
 - IDE
categories: 
 - IDE
sticky: 
   true
---

## 1\. 简介

在Android开发中，使用Gradle构建系统是非常常见的。然而，有时候我们会遇到Gradle构建过程非常慢的情况，这给开发效率带来了很大的困扰。本文将介绍如何加速Android Studio中的Gradle构建过程。

## 2\. 解决方案概览

下面是加速Gradle构建的一般步骤和流程图：

![image-20231118110245048](https://raw.githubusercontent.com/shug666/image/main/imagesimage-20231118110245048.png)

## 3\. 解决方案详细步骤

### 3.1 Clean Project

首先，我们需要执行Clean Project来清理项目。这可以帮助我们避免一些潜在的问题并确保构建的干净。

在Android Studio的菜单中选择`Build -> Clean Project`，或者使用快捷键`Ctrl + Shift + F9`。

### 3.2 Sync Gradle

接下来，我们需要执行Sync Gradle来同步Gradle配置和依赖项。这将确保我们使用的是最新的Gradle版本和库。

在Android Studio的工具栏中点击`Sync Project with Gradle Files`按钮，或者选择`File -> Sync Project with Gradle Files`。

### 3.3 Enable Offline Mode

为了加速Gradle构建，我们可以启用离线模式，这样Gradle将不会从远程仓库下载任何依赖项。

在项目的`build.gradle`文件中找到`android`块，在其中添加以下代码：

```java
allprojects {
    repositories {
        google()
        jcenter()

        // 离线模式
        offlineMode()
    }
}
```

### 3.4 Enable Parallel Mode

另一个加速Gradle构建的方法是启用并行模式，这将使Gradle在构建过程中并行执行多个任务。

在项目的`gradle.properties`文件中添加以下代码：

```java
// 并行模式
org.gradle.parallel=true
```

### 3.5 Enable Daemon

Gradle Daemon是一个后台进程，可以加速Gradle构建。我们需要启用它。

在项目的`gradle.properties`文件中添加以下代码：

```java
// 启用Daemon
org.gradle.daemon=true
```

### 3.6 优化依赖配置

在构建配置中，我们需要优化依赖项的配置，以减少不必要的依赖和冲突。

首先，我们可以使用`implementation`代替`compile`来定义依赖关系。这样可以避免不必要的传递依赖。

其次，我们可以使用`api`关键字来定义公共库的依赖关系。这样可以确保这些库对外部可见，以及其他模块可以正常访问。

最后，我们可以使用`exclude`关键字来排除不必要的依赖项或解决冲突。

```java
dependencies {
    // 使用implementation减少传递依赖
    implementation 'com.example:library:1.0.0'

    // 使用api定义公共库的依赖
    api 'com.example:common:1.0.0'

    // 排除不必要的依赖项或解决冲突
    implementation('com.example:library:1.0.0') {
        exclude module: 'unnecessary'
    }
}
```

### 3.7 使用缓存

Gradle有一个本地缓存目录，用于存储已下载的依赖项。我们可以使用这个缓存来加速构建过程。

在项目的`gradle.properties`文件中添加以下代码：

```java
// 使用本地缓存
org.gradle.caching=true
```



本文转自 [https://blog.51cto.com/u\_16213393/7429162?u\_atoken=51fcb1ca-ebd8-4610-b422-b94ffe006694&u\_asession=01wdxmOL-Id7frYe-5rsEmixoQkxosPk0H3xme27ielasFzh-ohLszWJnY5uFbzjPl0jmBYyoEOFKyenLwMmfXD9sq8AL43dpOnCClYrgFm6o&u\_asig=05tUzFRNe0NwR0Rlc-7bW3OkbWroIgaV2mu3SlfVHsYPimhSJUj-UnVzGR0yXh7l58wjzdHtNx3PoEKJvbw\_LiJ6KrFLB6fWabrjPmQ8VWnT8eg7lEZYCbb57pZGdqznjjDulWN-1cH6QqdL\_7R8z4CFOpqndSYLx4P00UsqK7NXuazg2jtdGm4Mcqvms3NnOAksmHjM0JOodanL5-M1Qs1Y9is60rpjg\_JsV4rE4vC-mCyTNb0N5m93xxQDD7GReVJVPtWzrxbNj-jqM-b2YbX7bNOywK-MZZxFsgOF\_IUHvY94r\_LXIIil3Y3aVPRGAe&u\_aref=e3NYCFqMzkFPHvJyCsN2ukBL5z0%3D](https://blog.51cto.com/u_16213393/7429162?u_atoken=51fcb1ca-ebd8-4610-b422-b94ffe006694&u_asession=01wdxmOL-Id7frYe-5rsEmixoQkxosPk0H3xme27ielasFzh-ohLszWJnY5uFbzjPl0jmBYyoEOFKyenLwMmfXD9sq8AL43dpOnCClYrgFm6o&u_asig=05tUzFRNe0NwR0Rlc-7bW3OkbWroIgaV2mu3SlfVHsYPimhSJUj-UnVzGR0yXh7l58wjzdHtNx3PoEKJvbw_LiJ6KrFLB6fWabrjPmQ8VWnT8eg7lEZYCbb57pZGdqznjjDulWN-1cH6QqdL_7R8z4CFOpqndSYLx4P00UsqK7NXuazg2jtdGm4Mcqvms3NnOAksmHjM0JOodanL5-M1Qs1Y9is60rpjg_JsV4rE4vC-mCyTNb0N5m93xxQDD7GReVJVPtWzrxbNj-jqM-b2YbX7bNOywK-MZZxFsgOF_IUHvY94r_LXIIil3Y3aVPRGAe&u_aref=e3NYCFqMzkFPHvJyCsN2ukBL5z0%3D)，如有侵权，请联系删除。
