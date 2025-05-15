---
title: Gradle开发与应用
date: 2024-11-28
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## Gradle简介

Gradle是一个基于Apache Ant和Apache Maven概念的项目自动化构建工具。它使用一种基于Groovy的特定领域语言（DSL）来声明项目设置，但Gradle本身是用Java编写的，确保了跨平台的兼容性和高效性。Gradle支持多种编程语言，包括Java、Kotlin、Android等，并且允许通过插件机制扩展其功能。

## Gradle基础语法

### 1\. 项目结构

Gradle项目通常包含一个或多个子项目（也称为模块）。每个项目都有一个`build.gradle`文件，用于定义该项目的构建逻辑。在Android项目中，通常会有一个项目级别的`build.gradle`文件和一个或多个模块级别的`build.gradle`文件。

### 2\. 插件应用

在Gradle中，插件用于扩展其功能。在Android项目中，你需要应用`com.android.application`或`com.android.library`插件来配置Android构建过程。这通常在模块级别的`build.gradle`文件中完成，如下所示：

```java
apply plugin: 'com.android.application'
```

或者，对于Kotlin DSL（如果你使用的是Kotlin来编写Gradle脚本）：

```kotlin
plugins {
    id 'com.android.application'
}
```

### 3\. 仓库与依赖

Gradle通过仓库来查找和下载依赖项。在Android项目中，你通常会配置Maven Central、JCenter或Google的Maven仓库。依赖项在`build.gradle`文件的`dependencies`块中声明，如下所示：

```java
dependencies {
    implementation 'com.android.support:appcompat-v7:28.0.0'
    testImplementation 'junit:junit:4.12'
}
```

### 4\. 任务（Tasks）

Gradle中的任务（Tasks）是构建过程中的最小工作单元。你可以定义自己的任务，也可以使用Gradle提供的内置任务。任务之间可以定义依赖关系，以确保它们按正确的顺序执行。

```java
task hello {
    doLast {
        println 'Hello, Gradle!'
    }
}

task greet(dependsOn: hello) {
    doLast {
        println 'How are you?'
    }
}
```

## Gradle在Android项目中的深入应用

### 1\. 构建变体（Build Variants）

在Android Gradle插件中，构建变体是构建过程中的一个重要概念，它允许你根据不同的需求（如debug和release）来配置不同的构建类型。以下是一个配置两个构建类型（debug和release）的示例：

```java
android {
    ...
    buildTypes {
        debug {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
    ...
}
```

在这个例子中，`debug`构建类型关闭了代码压缩（`minifyEnabled false`），而`release`构建类型则开启了代码压缩（`minifyEnabled true`）并应用了签名配置（`signingConfig signingConfigs.release`）。

### 2. 配置签名

相关的API的时候，是需要我们填入相关的的app签名进行校验后才能进行操作，而默认我们在调试模式下使用的是AS为我们提供的android.keystore，所幸，Gradle为我们提供了相关的方法，我们可以为debug和release指定密钥文件和前面。我们需要先在app.gradle的android节点做做相关的配置。

```java
android{
    ...
    signingConfigs {
        debug {
            try {
                storeFile file("../签名文件.jks")
                storePassword "密码"
                keyAlias "别名"
                keyPassword "密码"
                v1SigningEnabled true
                v2SigningEnabled false
            }
            catch (ex) {
                ex.printStackTrace()
                throw new InvalidUserDataException("秘钥用户名或密码错误${ex.getMessage()}")
            }
        }
        release {
            try {
                storeFile file("../签名文件.jks")
                storePassword "密码"
                keyAlias "别名"
                keyPassword "密码"
                v1SigningEnabled true
                v2SigningEnabled false
            }
            catch (ex) {
                throw new InvalidUserDataException("秘钥用户名或密码错误")
            }
        }
    }
    ...
}
```

> signingConfigs 是处于android节点中
>
> 这里需要注意的是storeFile的路径是指当前app.gradle的相对路径。
>
> 关于v1SigningEnabled和v2SigningEnabled
>
> APK Signature Scheme v2是Android 7.0 引入一项新的应用签名方案 APK Signature Scheme v2，它能提供更快的应用安装时间和更多针对未授权 APK 文件更改的保护。一般情况下都会选择关闭。

### 3\. 依赖管理

Gradle的依赖管理功能让添加、更新和删除项目的库依赖变得简单。以下是一个在`build.gradle`文件中添加依赖项的示例：

```java
dependencies {
    // 添加Android Support库
    implementation 'androidx.appcompat:appcompat:1.3.0'

    // 添加单元测试库
    testImplementation 'junit:junit:4.13.2'

    // 添加AndroidX的Espresso测试库
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'

    // 添加第三方库，如Retrofit进行网络请求
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
}
```

在这个例子中，我们添加了Android Support库（现已迁移至AndroidX）、JUnit单元测试库、Espresso UI测试库以及Retrofit网络请求库作为项目的依赖项。

### 自定义构建逻辑

Gradle的灵活性允许你通过编写自定义任务（Tasks）或配置现有任务来扩展构建逻辑。以下是一个自定义Gradle任务的示例，该任务用于在构建过程中打印一条自定义消息：

```java
task printCustomMessage {
    doLast {
        println 'This is a custom message from a Gradle task.'
    }
}

// 可以将这个自定义任务添加到其他任务的依赖中，以确保在它们之前或之后执行
assembleDebug.dependsOn printCustomMessage
```

但是，请注意，将自定义任务直接依赖于`assembleDebug`这样的内置任务可能不是最佳实践，因为这可能会干扰Gradle的正常构建流程。更好的做法可能是将自定义任务作为构建过程中的一个独立步骤来运行，或者使用Gradle的钩子（如`gradle.projectsEvaluated`）来在构建过程的特定阶段执行自定义逻辑。

### 4. 自定义apk输出名称

本配置为Android studio3.0及以上的配置，3.0以下版本适用，下面的配置会将所有的Variants都输出。

这可以通过在`android`块中配置`applicationVariants`或`libraryVariants`（取决于你的项目类型）来实现：

> **注：配置到buildTypes的release和debug下面**

```java
// 便利所有的Variants，all是迭代遍历操作符，相当于for
applicationVariants.all { variant ->// 遍历得出所有的variant
    variant.outputs.all {// 遍历所有的输出类型，一般是debug和replease
        // 定义apk的名字，拼接variant的版本号
        def apkName = "app_${variant.versionName}"
        // 判断是否为空
        if (!variant.flavorName.isEmpty()) {
            apkName += "_${variant.flavorName}"
        }
        // 赋值属性
        outputFileName = apkName + ".apk"
    }
}
```

在这个例子中，我们遍历了所有的应用变体，并修改了每个变体生成的APK文件的名称，使其包含版本号。

### 5. release和debug设置全局变量

写程序就会要有log，有log我们就需要在打release包的时候就需要手动的设置debug开关为false，但是在某些情况下我们可能会忘记关闭的。所以可以选择在gradle中通过buildConfigField定义变量，然后再需要的时候直接进行引用。

```java
buildTypes {
    release {
        ...
        buildConfigField "boolean", "isDebug", "false"
        ...
    }
    debug {
    ...
        buildConfigField "boolean", "isDebug", "true"
    ...
    }
}
```

以上，我们在两种模式中都创建了一个叫做isDebug的布尔值的变量，根据类型不同设置值，然后需要重新编译一下。

**编译完成后直接调用BuildConfig.isDebug作为开关设置即可**

### 6. API地址的配置

既然有了全局debug开关的设置，那么就肯定有这么一个需求：debug和release下使用不同的API请求地址，其实也就是和前面一个套路，直接通过buildConfigField定义变量。

```java
buildTypes {
    release {
        ...
        buildConfigField "boolean", "isDebug", "false"
        buildConfigField "String", "API", "http://192.168.1.1/release"
        ...
    }
    debug {
    ...
        buildConfigField "boolean", "isDebug", "true"
        buildConfigField "String", "API", "\"http://192.168.1.1/debug\""
    ...
    }
}
```

**String类型一定要记得加双引用转义。**
**String类型一定要记得加双引用转义。**
**String类型一定要记得加双引用转义。**

### 7. 执行cmd命令

我想在执行完成这个任务之后执行一个终端命令。在`build.gradle`中，最底下位置增加代码:

目标任务assembleRelease

```java
android {
    // 你的其他配置
}
tasks.whenTaskAdded { task ->
    if (task.name == "assembleRelease") {
        task.finalizedBy 'apkCopyTask'
    }
}
task apkCopyTask {
    doLast {
        // 在这里执行你的终端命令， 这个命令可以换自己的，例如我的alias fff
        def command = "echo 'Hello, World!'"
        println "Executing command: $command"

        // 使用下列语句执行终端命令
        def process = command.execute()
        process.in.eachLine { line ->
            println line
        }
        process.waitFor()
    }
}
```

这样配置后，同步一次`Gradle`即可，在你每次执行`assembleRelease`的时候都会执行`myCustomTask`，但你的同事也执行这个任务也会触发定制任务。为了不影响别人，应该改成一个独立的任务，这个任务执行的时候，先执行`assembleRelease`，再执行自己的逻辑。

可以修改：

```java
// 自定义任务来执行 assembleRelease
task myAssembleAndRunCommand {
    dependsOn 'assembleRelease'  // 先执行 assembleRelease 任务
    doLast {
        // 在 assembleRelease 完成后执行你的终端命令
        def command = "echo 'Hello, World!'"
        println "Executing command: $command"
        // 使用下列语句执行终端命令
        def process = command.execute()
        process.in.eachLine { line ->
            println line
        }
        process.waitFor()
    }
}
```

这个时候，`myAssembleAndRunCommand`是一个新的任务，它依赖于 `assembleRelease`。在执行`myAssembleAndRunCommand`时，`Gradle` 会先确保 `assembleRelease`已经完成。在自己需要的时候去other里面找到`myAssembleAndRunCommand`双击执行就可以，不会影响到其他人。

### 8. 打包jar包

```java
//删除任务
task deleteJarTask(type: Delete) {
    delete 'build/intermediates/compile_library_classes_jar/release/bundleLibCompileToJarRelease/classes.jar'
    delete 'build/outputs/aar/'
    delete 'build/libs/csdk.jar'
}

task makeJarTask(type: Jar) {
    //默认生成Jar包的位置
    from('build/intermediates/compile_library_classes_jar/release/bundleLibCompileToJarRelease/classes.jar')
    into('libs/') //生成路径
    include('classes.jar')
    rename('classes.jar', 'mylibrary.jar')//mylibrary.jar  生成jar包java的名称
}
makeJarTask.dependsOn(build)
```

参考：

[将代码打包成Jar包和aar文件](https://blog.csdn.net/qq_30089721/article/details/116780955?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522285ddf75dbe226dc964208b19dd6538f%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=285ddf75dbe226dc964208b19dd6538f&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_ecpm_v1~times_rank-13-116780955-null-null.142^v100^pc_search_result_base8&utm_term=android%20%E5%B0%86%E4%BB%A3%E7%A0%81%E6%89%93%E5%8C%85%E6%88%90Jar%E5%8C%85&spm=1018.2226.3001.4187)

[保姆级别使用android studio 生成jar包](https://blog.csdn.net/qq_32903439/article/details/133810420)

## Gradle Wrapper

Gradle Wrapper是Gradle提供的一个工具，它允许你在没有预先安装Gradle的情况下，通过包装器脚本来执行Gradle命令。这样做的好处是，它确保了所有开发者和构建环境都使用相同版本的Gradle来构建项目，从而避免了因Gradle版本不同而导致的构建不一致问题。

### Gradle Wrapper的组成

Gradle Wrapper主要由以下几个文件组成：

*   `gradlew`（Unix/Linux shell 脚本）
*   `gradlew.bat`（Windows 批处理脚本）
*   `gradle/wrapper/gradle-wrapper.properties`（配置文件，指定Gradle的版本和其他设置）

### 使用Gradle Wrapper的示例

当你使用Gradle Wrapper时，你应该通过`gradlew`（在Unix/Linux系统上）或`gradlew.bat`（在Windows系统上）脚本来执行Gradle命令，而不是直接使用`gradle`命令。这样做会自动下载并配置指定的Gradle版本（如果尚未下载的话），然后使用它来执行命令。

### 示例：使用Gradle Wrapper构建项目

在命令行中，你可以使用以下命令来构建你的Android项目（假设你已经在项目的根目录下）：

```shell
# Unix/Linux/macOS
./gradlew build

# Windows
gradlew.bat build
```

这些命令会检查`gradle/wrapper/gradle-wrapper.properties`文件中指定的Gradle版本，如果本地没有安装该版本，Gradle Wrapper会自动下载并配置它。然后，它会使用这个版本的Gradle来执行`build`任务，构建你的Android项目。

### 修改Gradle版本

如果你想更改项目中使用的Gradle版本，你需要编辑`gradle/wrapper/gradle-wrapper.properties`文件，并更新`distributionUrl`属性的值。例如，要将Gradle版本更改为6.7.1，你可以将`distributionUrl`属性设置为：

```java
distributionUrl=https\://services.gradle.org/distributions/gradle-6.7.1-bin.zip
```

请注意，更改Gradle版本后，所有开发者和构建环境都需要重新下载并使用新版本的Gradle，因此最好在团队中进行协调，并确保所有相关环境都已更新。



本文转自 [https://blog.csdn.net/Lwjobs/article/details/140878113?ops\_request\_misc=%257B%2522request%255Fid%2522%253A%252263d3182ab6d063742b0aef8f6955a535%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request\_id=63d3182ab6d063742b0aef8f6955a535&biz\_id=0&utm\_medium=distribute.pc\_search\_result.none-task-blog-2~all~baidu\_landing\_v2~default-4-140878113-null-null.142^v100^pc\_search\_result\_base8&utm\_term=android%20gradle%20%E8%AF%AD%E6%B3%95&spm=1018.2226.3001.4187](https://blog.csdn.net/Lwjobs/article/details/140878113?ops_request_misc=%257B%2522request%255Fid%2522%253A%252263d3182ab6d063742b0aef8f6955a535%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=63d3182ab6d063742b0aef8f6955a535&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-4-140878113-null-null.142^v100^pc_search_result_base8&utm_term=android%20gradle%20%E8%AF%AD%E6%B3%95&spm=1018.2226.3001.4187)，如有侵权，请联系删除。