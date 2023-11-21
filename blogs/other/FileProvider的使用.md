---
title: android FileProvider的使用
date: 2022-12-19
tags:
 - android
categories: 
 - android
sticky: 
   true
---

FileProvider是Android中推荐的获取文件Uri方式，将取代Uri.fromFile()方法

## 老方式的问题

在安卓7.0版本中，直接根据内部存储中的文件获取Uri会程序崩溃，相关代码如下：

```
Uri uri = Uri.fromFile(file);
```

运行的话，会报错：

![](https://raw.githubusercontent.com/shug666/image/main/images/20180425172136380)

解决方法，就是引入FileProvider

## FileProvider的使用

现在，我一步一步来给大家演示FileProvider的用法

声明

我们首先要在清单文件中application节点下，声明一个FileProvider子节点

```xml
<provider
  android:authorities="com.example.songzeceng.myFileProvider"
  android:name="android.support.v4.content.FileProvider"
  android:exported="false"
  android:grantUriPermissions="true">
  <meta-data android:name="android.support.FILE_PROVIDER_PATHS"
             android:resource="@xml/updatepath"></meta-data>
</provider>
```

里面的属性和节点解释如下：

>     provider:表示这是一个provider    
>
>     android:authorities:provider的名字，跟ContentProvider的这个属性一样，是这个provider的标识
>
>     android:name:固定的，要用FileProvider就必须声明成代码中的样子
>
>     android:exported:可否导出，必须为false
>
>     android:grantUriPermissions:是否被赋予uri权限，必须为true
>
>     `<meta-data>`：这个provider的外部应用可见的属性，必须声明一个path，表示分享的目录
>
>         android:name:分享目录的名字，固定写死的
>
>         android:resource:路径对应的xml文件，这个应该在res目录下新建一个对应的xml文件
>

创建分享xml文件

现在我们要创建一个跟上文说的android:resource标签对应的xml文件-->xml/updatepath.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:android="http://schemas.android.com/apk/res/android">
    <paths>
        <files-path path="." name="files" />
        <cache-path path="." name="cache" />
        <external-path path="." name="external" />
        <external-files-path path="." name="externalfiles"/>
        <!-- 此标签需要 support 25.0.0以上才可以使用-->
        <external-cache-path  path="." name="externalcache"/>
    </paths>
</resources>
```

其中标签 file-path、cache-path这些表示手机内存中的某个目录，path属性是这个目录下的子目录，name属性是假名，这个假名将替代path目录的绝对路径

图中涉及的子标签对应的路径如下：

| 子标签              | 子标签对应的绝对路径(加path)                          | 子标签对应的绝对路径(加path)                                 | 假名           |
| :------------------ | :---------------------------------------------------- | ------------------------------------------------------------ | -------------- |
| files-path          | app私有存储区域下的files目录(context.getFilesDir())   | files目录加上path(context.getFilesDir()/files)               | files          |
| cache-path          | app私有目录下的缓存目录(context.getCacheDir())        | 私有缓存目录加上path(context.getCacheDir()/files)            | cache          |
| external-path       | 外存根目录(Environment.getExternalStorageDirectory()) | 外存根目录加上path(Environment.getExternalStorageDirector()/files) | external       |
| external-files-path | 外存根目录下的文件目录(context.getExternalFilesDir()) | 文件目录加上path(context.getExternalFilesDir()/files)        | externalfiles  |
| external-cache-path | 外存根目录下的缓存目录(context.getExternalCacheDir()) | 缓存目录加上path(context.getExternalCacheDir()/files)        | externalcaches |

最后的结果，就是外部app获取到的分享目录，不是路径，而是假名

而且，每添加一个分享目录，就要添加一个对应的子标签

比如我添加一个新的分享目录，是外存根目录下的一个文件夹，就添加一个子标签如下：

```xml
<external-path name = "fp_pictures" path = "/Pictures/dongqiudi/"></external-path>
```

就可以了

利用FileProvider获取文件Uri

代码如下：

```java
String path = Environment.getExternalStorageDirectory().getPath() + "/Pictures/dongqiudi/1523624189281.jpg";
File file = new File(path);
if (file.exists()) {
   Uri uri = FileProvider.getUriForFile(MainActivity.this, "com.example.songzeceng.myFileProvider", file);
   Log.i(TAG, "uri:" + uri.toString());
}
```

代码很简单，只不过为了以防出错，我判断了一下文件是否存在(不存在会怎样，我没试过)

结果

![](https://raw.githubusercontent.com/shug666/image/main/images/20180425181757810)

可以看到，它确实把我们指定的分享目录路径，换成了假名fp\_pictures。这个uri和以前的路径uri不一样，但不影响使用，他还是会正确地找到我们的文件的。

## 通过uri获取文件路径

由于FileProvider类只有一个getUriForFile()方法对外开放，那么如果要通过FileProvider的uri获取文件路径，就需要通过反射了。

先说思路：

FileProvider内部有一个SimplePathStrategy类，这个类实现了PathStrategy接口，负责文件uri和文件路径的转换。FileProvider通过调用自己的私有静态方法getPathStrategy()来初始化PathStrategy对象，因此我们可以直接调用这个方法获取已经初始化好的PathStrategy对象。然后调用这个对象的getFileForUri()方法，获取uri对应的文件对象，最后通过文件对象获取路径。

代码如下所示

```java
                Class<FileProvider> clazz = FileProvider.class;
                Class<?> simplePathStrategyClazz = clazz.getDeclaredClasses()[0];

                Method getPathStrategyMethod = clazz.getDeclaredMethod("getPathStrategy", Context.class, String.class);
                getPathStrategyMethod.setAccessible(true);

                Object simplePathStrategyObject = getPathStrategyMethod.invoke(null, MainActivity.this, "com.example.songzeceng.myFileProvider");

                Method method = simplePathStrategyClazz.getDeclaredMethod("getFileForUri", Uri.class);
                method.setAccessible(true);
                File destFile = (File) method.invoke(simplePathStrategyObject, uri);

                Log.i(TAG, "share: file path:" + destFile.getAbsolutePath());
```

首先，获取FileProvider的类和SimplePathStrategy的类，我们所需的类就这两个；

其次，获取FileProvider的getPathStrategy()方法对象，方法入参为Context对象和String对象，这个String对象就是我们的authority标识。当然要把这个方法对象的可达性设置为true；

再次，调用getPathStrategy()方法，传入上下文对象和标识字符串，得到SimplePathStrategy对象。这里只能用Object类来接，因为外部访问不到SimplePathStrategy类或PathStrategy类；

然后，获取SimplePathStrategy类的getFileForUri()方法对象，入参为Uri对象，设置方法可达性为true；

最后，调用SimplePathStrategy对象的getFileForUri()方法，入参为Uri对象，强制类型转换成File后，即可获取绝对路径。

程序运行的输出日志如下图所示

![](https://raw.githubusercontent.com/shug666/image/main/images/20191120204411459.png)

功能可以实现，但是反射的消耗很大，用的时候还是要三思。 
