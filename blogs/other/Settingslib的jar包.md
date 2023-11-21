---
title: Android系统开发 settingslib的jar包
date: 2023-07-04
tags:
 - android
categories: 
 - android
sticky: 
   true
---

前言
--

  settingslib用于系统原生settings的开发支持，当然我们也可以调用settingslib实现自己需要的设置功能，比如系统级蓝牙、系统级WiFi开发、声音、亮度、电量等等。所以settingslib毋庸置疑是需要系统签名、系统权限的系统级应用才能使用的。 如果你的项目是普通应用项目就请不需要在花费时间在这里了。

架包流程
----

### jar获取路径

out\\target\\common\\obj\\JAVA\_LIBRARIES\\SettingsLib\_intermediates   这个是系统编译后的路径

目标jar

![](https://raw.githubusercontent.com/shug666/image/main/images/1497956-20230428191727830-1493260824.png)

### 放入项目中的libs文件

![](https://raw.githubusercontent.com/shug666/image/main/images/1497956-20230428191828669-1332248027.png)

### 在build添加

请注意这里引用的是implementation 这与 framework 的架包不同，我们是需要settingslib.jar参加编译的

```xml
//framework里的的settingslib架包
implementation files('libs\\settingslib.jar')
```

## 解决编译时可能出现的库冲突错误

这是因为settingslib.jar内容也依赖了相同的库，与我们自己项目的库冲突了

报错如图：

![](https://raw.githubusercontent.com/shug666/image/main/images/1497956-20230505110338022-1784659609.png)

## 解决办法

用压缩包打开jar，直接根据上面的报错信息删除库文件目录

注意下面这个不能删除，这个是我们需要使用的settingslib库，

![](https://raw.githubusercontent.com/shug666/image/main/images/1497956-20230505110911771-1371722232.png)

而jar里其他目录里的库文件如果冲突都可以删除，如下标记

![](https://raw.githubusercontent.com/shug666/image/main/images/1497956-20230505111052871-1016508734.png)

![](https://img2023.cnblogs.com/blog/1497956/202305/1497956-20230505111120399-2102491437.png)

  

本文转自 [https://www.cnblogs.com/guanxinjing/p/17363003.html](https://www.cnblogs.com/guanxinjing/p/17363003.html)，如有侵权，请联系删除。