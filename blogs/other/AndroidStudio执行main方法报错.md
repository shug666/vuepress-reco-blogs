---
title: Android Studio 执行main方法报错
date: 2023-04-12
tags:
 - IDE
categories: 
 - IDE
sticky: 
   true
---

### 问题：

有时在开发中想直接写一个java文件来测试一些东西，但是AndroidStudio执行的时候会报错。

### 代码信息：

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("HelloWorld");
    }
}
```

### 报错信息

```
12:04:41: Executing task 'HelloWorld.main()'...

Executing tasks: [HelloWorld.main()] in project D:\AndroidStudioProjects\MyApplication8


> Configure project :app
WARNING: The following project options are deprecated and have been removed: 
android.enableAapt2
This property has no effect, AAPT2 is now always used.



FAILURE: Build failed with an exception.

* Where:
Initialization script 'C:\Users\cj\AppData\Local\Temp\HelloWorld_main__.gradle' line: 20

* What went wrong:
A problem occurred configuring project ':app'.
> Could not create task ':app:HelloWorld.main()'.
   > SourceSet with name 'main' not found.

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

Deprecated Gradle features were used in this build, making it incompatible with Gradle 6.0.
Use '--warning-mode all' to show the individual deprecation warnings.
See https://docs.gradle.org/5.6.4/userguide/command_line_interface.html#sec:command_line_warnings

BUILD FAILED in 116ms
12:04:41: Task execution finished 'HelloWorld.main()'.

```

### 解决方案

在.idea文件夹中找到gradle.xml， 打开文件，在`<GradleProjectSettings>`标签下添加

![](https://raw.githubusercontent.com/shug666/image/main/images/20210302100754743.png)

```xml
<option name="delegatedBuild" value="false" />
```

### 添加后文件内容

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="GradleMigrationSettings" migrationVersion="1" />
  <component name="GradleSettings">
    <option name="linkedExternalProjectsSettings">
      <GradleProjectSettings>
        <option name="delegatedBuild" value="false" />
        <option name="testRunner" value="GRADLE" />
        <option name="distributionType" value="LOCAL" />
        <option name="externalProjectPath" value="$PROJECT_DIR$" />
        <option name="gradleHome" value="D:/gradle/gradle-6.1.1" />
        <option name="gradleJvm" value="1.8" />
        <option name="modules">
          <set>
            <option value="$PROJECT_DIR$" />
            <option value="$PROJECT_DIR$/app" />
          </set>
        </option>
      </GradleProjectSettings>
    </option>
  </component>
</project>
```

### 总结

再次运行就可以显示执行结果了，据说这句话的意思是不让gradle接管构建任务，防止当作gradle的task来执行。

  

//参考：[https://www.jianshu.com/p/38e86e32cf67](https://www.jianshu.com/p/38e86e32cf67)

  

本文转自 [https://blog.csdn.net/qq\_40307919/article/details/114277740](https://blog.csdn.net/qq_40307919/article/details/114277740)，如有侵权，请联系删除。
