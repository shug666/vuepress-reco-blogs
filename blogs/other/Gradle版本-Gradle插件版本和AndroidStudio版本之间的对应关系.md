---
title: Gradle版本、Gradle插件版本和AndroidStudio版本之间的对应关系
date: 2023-11-02
tags:
 - IDE
categories: 
 - IDE
sticky: 
   true
---

## 问题描述

有时候碰到gradle版本死活下载不下来，还会报Gralde Sync Issues,有可能是你的Gradle Wrapper版本和Gradle插件版本、AndroidStudio版本不匹配。  
![](https://raw.githubusercontent.com/shug666/image/main/images060f310e6beb4d009821ed34f1964f1f.png)

## 解决方案

Gradle版本和Gradle插件版本之间存在一定的对应关系。Gradle Wrapper是用来指定项目使用的Gradle版本，Gradle插件则是用来构建Android应用程序的。

### Android Gradle 插件版本所需的 Gradle 版本

下表列出了各个 Android Gradle 插件版本所需的 Gradle 版本：

<table class="data-table" data-transient-attributes="class" style="width: 100%; outline: none; border-collapse: collapse;" data-width="922.017px"><colgroup><col span="1" width="461.009"><col span="1" width="461.009"></colgroup><tbody><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>Plugin version<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>Required Gradle version<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>1.0.0 - 1.1.3<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>2.2.1 - 2.3<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>1.2.0 - 1.3.1<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>2.2.1 - 2.9<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>1.5.0<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>2.2.1 - 2.13<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>2.0.0 - 2.1.2<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>2.10 - 2.13<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>2.1.3 - 2.2.3<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>2.14.1+<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>2.3.0+<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>3.3+<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>3.0.0+<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>4.1+<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>3.1.0+<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>4.4+<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>3.2.0 - 3.2.1<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>4.6+<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>3.3.0 - 3.3.2<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>4.10.1+<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>3.4.0 - 3.4.1<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>5.1.1+<br></p></td></tr><tr style="height: 30px;"><td data-transient-attributes="table-cell-selection" class="table-last-column" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>3.5.0<br></p></td><td data-transient-attributes="table-cell-selection" class="table-last-column table-last-row" style="min-width: auto; overflow-wrap: break-word; margin: 4px 8px; border: 1px solid rgb(217, 217, 217); padding: 4px 8px; cursor: default; vertical-align: top;"><p>5.4.1+<br></p></td></tr></tbody></table>

| 插件版本 | 所需的最低 Gradle 版本 |
| --- | --- |
| 8.2 | 8.1 |
| 8.0 | 8.0 |
| 7.4 | 7.5 |
| 7.3 | 7.4 |
| 7.2 | 7.3.3 |
| 7.1 | 7.2 |
| 7.0 | 7.0 |
| 4.2.0+ | 6.7.1 |

要指定Gradle Wrapper版本，请打开项目根目录的 `gradle/wrapper/gradle-wrapper.properties` 文件，并将 `distributionUrl` 属性设置为要使用的Gradle版本的下载链接。例如：

```groovy
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-7.2-bin.zip
```

要指定Gradle插件版本，请在**项目层级**的 build.gradle 文件中修改以下属性：

```groovy
buildscript {
    repositories {
        google()
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.1.3'
    }
}
```

### Android Gradle 插件和 Android Studio 兼容性

下表列出了各个 Android Studio 版本所需的 Android Gradle 插件版本。

| Android Studio 版本 | 所需插件版本 |
| --- | --- |
| Hedgehog 2023.1.1 | 3.2-8.2 |
| Giraffe 2022.3.1 | 3.2-8.1 |
| Flamingo 2022.2.1 | 3.2-8.0 |
| Electric Eel 2022.1.1 | 3.2-7.4 |
| Dolphin 2021.3.1 | 3.2-7.3 |
| Chipmunk 2021.2.1 | 3.2-7.2 |
| Bumblebee 2021.1.1 | 3.2-7.1 |
| Arctic Fox 2020.3.1 | 3.1-7.0 |

改为匹配的版本关系后，点一下`Sync Project with Gradle Files` ，发现就下载成功项目可以正常运行起来了。

参考安卓官方文档：[https://developer.android.com/studio/releases/gradle-plugin?hl=zh-cn#updating-plugin](https://developer.android.com/studio/releases/gradle-plugin?hl=zh-cn#updating-plugin)

 

  

本文转自 [https://blog.csdn.net/Jackson\_Wen/article/details/130671443](https://blog.csdn.net/Jackson_Wen/article/details/130671443)，如有侵权，请联系删除。
