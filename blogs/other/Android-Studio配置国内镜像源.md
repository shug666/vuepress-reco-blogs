---
title: Android Studio 配置国内镜像源
date: 2024-07-01
tags:
 - android
categories: 
 - android
sticky: 
   true
---

##  一、简介

*   本文只介绍单个项目配置，所有项目配置自行百度。
    
*   新老版本 `Android Studio` 配置文件稍有不同。
    
    *   `pluginManagement` 和 `dependencyResolutionManagement` 里面的 `repositories` 都需要填写。
        
    *   不同版本的 `gradle` 文件的 `url` 格式不一样。
    
*   备用一套镜像地址，这套与下面的镜像地址不同，如果下面的案例中的不行可以替换成这份，注意 `url` 书写格式
    
    ```java
    // 新版本 settings.gradle.kts
    maven { url=uri ("https://maven.aliyun.com/repository/releases")}
    maven { url=uri ("https://maven.aliyun.com/repository/google")}
    maven { url=uri ("https://maven.aliyun.com/repository/central")}
    maven { url=uri ("https://maven.aliyun.com/repository/gradle-plugin")}
    maven { url=uri ("https://maven.aliyun.com/repository/public")}
    
    // 老版本 build.gradle
    maven { url "https://maven.aliyun.com/repository/releases"}
    maven { url "https://maven.aliyun.com/repository/google"}
    maven { url "https://maven.aliyun.com/repository/central"}
    maven { url "https://maven.aliyun.com/repository/gradle-plugin"}
    maven { url "https://maven.aliyun.com/repository/public"}
    ```
    

## 二、新版本 

*   打开 `Android Studio` 工程文件，找到 `settings.gradle.kts`
    
    ```kotlin
    pluginManagement {
        repositories {
            google()
            mavenCentral()
            gradlePluginPortal()
        }
    }
    dependencyResolutionManagement {
        repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
        repositories {
            google()
            mavenCentral()
        }
    }
    
    rootProject.name = "My Application"
    include(":app")
    ```
    
*   修改为
    
    ```kotlin
    pluginManagement {
        repositories {
            maven { url=uri ("https://www.jitpack.io")}
            maven { url=uri ("https://maven.aliyun.com/repository/releases")}
            maven { url=uri ("https://maven.aliyun.com/repository/google")}
            maven { url=uri ("https://maven.aliyun.com/repository/central")}
            maven { url=uri ("https://maven.aliyun.com/repository/gradle-plugin")}
            maven { url=uri ("https://maven.aliyun.com/repository/public")}
            google()
            mavenCentral()
            gradlePluginPortal()
        }
    }
    dependencyResolutionManagement {
        repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
        repositories {
            maven { url=uri ("https://www.jitpack.io")}
            maven { url=uri ("https://maven.aliyun.com/repository/releases")}
            maven { url=uri ("https://maven.aliyun.com/repository/google")}
            maven { url=uri ("https://maven.aliyun.com/repository/central")}
            maven { url=uri ("https://maven.aliyun.com/repository/gradle-plugin")}
            maven { url=uri ("https://maven.aliyun.com/repository/public")}
            google()
            mavenCentral()
        }
    }
    
    rootProject.name = "My Application"
    include(":app")
    ```
    

## 三、老版本 

*   打开 `Android Studio` 工程文件，找到 `build.gradle`
    
    ```java
    // Top-level build file where you can add configuration options common to all sub-projects/modules.
    
    buildscript {
    
        repositories {
            google()
            jcenter()
        }
        dependencies {
            classpath 'com.android.tools.build:gradle:4.1.1'
    
    
            // NOTE: Do not place your application dependencies here; they belong
            // in the individual module build.gradle files
        }
    }
    
    allprojects {
        repositories {
            google()
            jcenter()
        }
    }
    
    task clean(type: Delete) {
        delete rootProject.buildDir
    }
    ```
    
*   修改为
    
    ```java
    // Top-level build file where you can add configuration options common to all sub-projects/modules.
    
    buildscript {
    
        repositories {
            // google()
            // jcenter()
            maven { url "https://www.jitpack.io"}
            maven { url "https://maven.aliyun.com/repository/releases"}
            maven { url "https://maven.aliyun.com/repository/google"}
            maven { url "https://maven.aliyun.com/repository/central"}
            maven { url "https://maven.aliyun.com/repository/gradle-plugin"}
            maven { url "https://maven.aliyun.com/repository/public"}
        }
        dependencies {
            classpath 'com.android.tools.build:gradle:4.1.1'
    
    
            // NOTE: Do not place your application dependencies here; they belong
            // in the individual module build.gradle files
        }
    }
    
    allprojects {
        repositories {
            // google()
            // jcenter()
            maven { url "https://www.jitpack.io"}
            maven { url "https://maven.aliyun.com/repository/releases"}
            maven { url "https://maven.aliyun.com/repository/google"}
            maven { url "https://maven.aliyun.com/repository/central"}
            maven { url "https://maven.aliyun.com/repository/gradle-plugin"}
            maven { url "https://maven.aliyun.com/repository/public"}
        }
    }
    
    task clean(type: Delete) {
        delete rootProject.buildDir
    }
    ```
    

## 四、Gradle镜像

![img](https://raw.githubusercontent.com/shug666/image/main/images9bb5b64254dc431d9fce34ff122b5733.png)

这里需要下载gradle构建工具，进行项目构建。

- 官网地址：https://services.gradle.org/distributions/

- 腾讯镜像 Gradle下载地址：https://mirrors.cloud.tencent.com/gradle/
- 阿里云镜像 Gradle下载地址：https://mirrors.aliyun.com/macports/distfiles/gradle/

```java
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https://mirrors.cloud.tencent.com/gradle/gradle-8.5-all.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

## 五、配置 `HTTP` 代理

*   代理服务器的作用
    
    *   `内容缓存`：缓存经常访问的网页和数据，当再次访问时可以直接从代理服务器获取，加快访问速度。
        
    *   `绕过限制`：某些国外源在国内访问的速度极慢，通过代理可以绕过限制，实现跨地域访问。
        
    *   `安全性`：匿名浏览，数据加密
    
*   配置 `HTTP` 代理【`方式一`】
    
    *   镜像地址
        
        ```java
        腾讯： https://mirrors.cloud.tencent.com/AndroidSDK/
        阿里： https://mirrors.aliyun.com/android.googlesource.com/
        ```
        
    *   打开 `Settings`，搜索 `HTTP Proxy`，然后填入镜像地址，点击 `Apply`，在点击 `OK`。
        
        ![image.png](https://raw.githubusercontent.com/shug666/image/main/imagesb0e783f06a7d96bde32a8c4734fc9082.png)
        
    
*   配置 `HTTP` 代理【`方式二`】
    
    *   打开 `Settings`，搜索 `HTTP Proxy`，然后填下面的常用代理服务器，任意选个，点击 `Apply`，在点击 `OK`。
        
        ![image.png](https://raw.githubusercontent.com/shug666/image/main/imagese5b8b89da27b7f5d656c3f52e8dcc918.png)
    
*   国内常用的代理服务器（注意：只需要域名即可）
    
    1、东软信息学院
    
    ```java
    http://mirrors.neusoft.edu.cn 端口：80
    ```
    
    2、北京化工大学
    
    ```java
    http://ubuntu.buct.edu.cn/ 端口：80
    http://ubuntu.buct.cn/ 端口：80
    http://ubuntu.buct6.edu.cn/ 端口：80
    ```
    
    3、中国科学院开源协会
    
    ```java
    http://mirrors.opencas.cn 端口：80
    http://mirrors.opencas.org 端口：80
    http://mirrors.opencas.ac.cn 端口：80
    ```
    
    4、上海GDG镜像服务器
    
    ```java
    http://sdk.gdgshanghai.com 端口：8000
    ```
    
    5、电子科技大学
    
    ```java
    http://mirrors.dormforce.net 端口：80
    ```
    
    6、腾讯 `Bugly` 镜像
    
    ```java
    http://android-mirror.bugly.qq.com 端口：8080
    ```
    

## SDK更新出现错误的解决办法

在更新SDK时，经常会出现更新不了的问题, 报错unable to access android sdk add-on list解决方案

一、**HOST文件**

加上 `74.125.237.1 dl-ssl.google.com`

**二、****设置初次打开AS，不下载sdk**

1、在这个Android studio的安装目录下，找到下面这个文件

```java
\bin\idea.properties
```

2、设置初次打开AS，不检测SDK。使用记事本打开，文件末尾添加一行：

```java
disable.android.first.run=true
```

网上大部分介绍这种方法，但是治标不治本，SDK没有下载，就算进入界面了，也用不了。还是要去手动下载SDK。



本文转自 [https://blog.csdn.net/zz00008888/article/details/135483803](https://blog.csdn.net/zz00008888/article/details/135483803)，如有侵权，请联系删除。