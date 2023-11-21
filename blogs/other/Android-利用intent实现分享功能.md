---
title: Android 利用intent实现分享功能
date: 2023-04-04
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 一、 概述

现在的社会化分享大多使用了第三方的分享，例如友盟，ShareSDK等等，当然也有使用微信，QQ等官方的SDK进行分享。不过这些方法比较繁琐，如果没有特别要求，只希望将信息分享出去，我们可以利用安卓的intent来做这个事情。

### 二、 简单Intent的构建

在构建一个intent时，必须指定这个intent需要触发的action。Android定义了一些actions，比如**ACTION\_SEND**，该action表明该intent用于从一个activity发送数据到另外一个activity的，甚至可以是跨进程的数据发送。

为了发送数据到另一个Activity，我们只需要指定数据和数据的类型，系统就会自动识出能够接收这些数据类型的Activity。如果选择有多个，就会把这些Activity显示给用户进行选择；如果只有一个，则立即启动该Activity。

下面列出一个简单的分享方式

```java
Intent intent = new Intent();
intent.setAction(Intent.ACTION_SEND);
intent.putExtra(Intent.EXTRA_TEXT,"文字分享");
intent.setType("text/plain");
startActivity(intent);
```

> putExtra()方法中放入的是分享的内容；
>
> setType()设置分享的类型；
>

利用这样的分享方式进行分享时，会出现一个设置默认的选择，选定后，系统默认此类型的分享内容一直使用选定的程序进行，这样显然不符合我们的分享需求。我们可以使用下面的方法：

```java
Intent intent = new Intent();
intent.setAction(Intent.ACTION_SEND);
intent.putExtra(Intent.EXTRA_TEXT,"文字分享");
intent.setType("text/plain");
startActivity(Intent.createChooser(intent,"选择分享应用"));
```

调用`Intent.createChooser()`这个方法，此时即使用户之前为这个intent设置了默认，选择界面还是会显示，并且我们可以指定选择界面的标题。

此外，我们不仅可以分享文字，还可以分享图片、视频、文件等。需要改变的就是**putExtra()**方法和**setType()**方法。**Intent.EXTRA\_TEXT**是文本类型，除此之外还有一个重要**Intent.EXTRA\_STREAM**，在附件数据中的EXTRA\_STREAM中放一个指向数据的URI，就可以来分享二进制数据。这个通常用来分享图片，也可以用来分享任何类型的二进制内容。如下所示：

```java
Uri uri = Uri.parse("file://" + image.getImagePath());
Intent intent = new Intent();
intent.setAction(Intent.ACTION_SEND);
intent.putExtra(Intent.EXTRA_STREAM, uri);
intent.setType("image/*");
startActivity(Intent.createChooser(intent, "选择分享应用"));
```

> setType()方法根据要分享的内容的类型，还可以有“audio/mp4a-latm”、“audio/x-mpeg”、 “video/mp4”…很多类型。
>

### 三、 分享应用的过滤

通过上面的设置，我们会发现，系统弹出了很多方式，包括邮件、短信、蓝牙之类的，有些应用我们不希望显示出来，我们就可以使用以下方法：

1、首先，我们定义一个图片的分享，继续沿用上面的方式：

```java
Intent intent = new Intent(Intent.ACTION_SEND, null);
intent.addCategory(Intent.CATEGORY_DEFAULT);
intent.setType("*/*");
```

2、然后获取匹配图片类型的应用信息列表：

```java
PackageManager  pm = getPackageManager();
List<ResolveInfo> resolveInfos = pm.queryIntentActivities(intent, PackageManager.COMPONENT_ENABLED_STATE_DEFAULT);
if(resolveInfos.isEmpty()){
   Toaster.showShort(this,"没有可以分享的应用");
   return;
}
```

3、接下来遍历这个集合，通过包名筛选出我们想要显示的应用(微信和QQ)：

在进行筛选时，需要注意的一点是setType（）方法是必须设置的，不然的话不能跳转到选择的应用。

```java
//解析resolveInfos，封装到自定义的实体类
List<AppInfoVo> appInfoVos = new ArrayList<AppInfoVo>();
for (int i = 0; i < resolveInfos.size(); i++) {
    AppInfoVo appInfoVo = new AppInfoVo();
    ResolveInfo resolveInfo = resolveInfos.get(i);
    appInfoVo.setAppName(resolveInfo.loadLabel(packageManager).toString());
    appInfoVo.setIcon(resolveInfo.loadIcon(packageManager));
    appInfoVo.setPackageName(resolveInfo.activityInfo.packageName);
    appInfoVo.setLauncherName(resolveInfo.activityInfo.name);
    appInfoVos.add(appInfoVo);
}

---------------------------------------------------------------------------------

//过滤分享的应用
List<Intent> targetIntents = new ArrayList<>();
for (AppInfoVo appInfoVo : appInfoVos) {
    if (appInfoVo.packageName.contains("com.tencent.mm")
        || appInfoVo.packageName.contains("com.tencent.mobileqq")){
        //过滤掉qq收藏
        if (appInfoVo.appName.contains("QQ收藏")){
            continue;
        }
        Intent target = new Intent();
        target.setAction(Intent.ACTION_SEND);
        target.setComponent(new ComponentName(appInfoVo.packageName,appInfoVo.launcherName));
        target.putExtra(Intent.EXTRA_STREAM, uri);
        target.setType("image/*");//必须设置，否则选定分享类型后不能跳转界面
        targetIntents.add(new LabeledIntent(target,appInfoVo.packageName,appInfoVo.appName,appInfoVo.icon));
    }
}
if (targetIntents.size()<= 0){
    Toaster.showShort(this,"没有可以分享的应用");
    return;
}
```

```java
//可分享应用的实体类
public class AppInfoVo {
    private Drawable icon;
    private String appName;
    private String packageName;
    private boolean isSystemApp;
    private long codesize;
    private String launcherName;


    public String getLauncherName() {
        return launcherName;
    }

    public void setLauncherName(String launcherName) {
        this.launcherName = launcherName;
    }

    public long getCodesize() {
        return codesize;
    }

    public void setCodesize(long codesize) {
        this.codesize = codesize;
    }

    public Drawable getIcon() {
        return icon;
    }

    public void setIcon(Drawable icon) {
        this.icon = icon;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public boolean isSystemApp() {
        return isSystemApp;
    }

    public void setSystemApp(boolean isSystemApp) {
        this.isSystemApp = isSystemApp;
    }

}
```

4、最后调用createChooser方法，显示分享dialog

```java
Intent chooser = Intent.createChooser(targetIntents.remove(targetIntents.size() - 1), "选择分享");
if (chooser == null) return;
LabeledIntent[] labeledIntents = targetIntents.toArray(new LabeledIntent[targetIntents.size()]);
chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS,labeledIntents);
startActivity(chooser);
```

createChooser()方法最终展示给用户的选择包括，符合createChooser第一个参数的应用以及由EXTRA\_INTENT\_INTENTS指定的应用。

效果图如下：

![](https://raw.githubusercontent.com/shug666/image/main/images/3708736-e18ae9e2ab80e87d.png)

### 四、 多张图片的分享

上述方法都是对单个图片的分享，如果我们想要一次分享多张图片，要怎么做呢？其实很简单，只需要把多张图片的uri装进一个集合里，并将action设置为ACTION\_SEND\_MULTIPLE多个文件发送模式，并把uri集合传入即可，代码如下所示：

```java
ArrayList<Uri> myList = new ArrayList<>();
Intent target = new Intent();
target.setAction(Intent.ACTION_SEND_MULTIPLE);
target.putParcelableArrayListExtra(Intent.EXTRA_STREAM, myList);
target.setType("image/*");
startActivity(Intent.createChooser(target,"选择分享"));
```

上述代码中没有对分享应用进行过滤，如果需要进行过滤，可以参考第三小节进行。

### 五、 总结

最后呢，总结一下利用Android原生实现分享和利用第三方SDK实现的优缺点，如下表中所示：

| 分享类型 | 优势 | 劣势 |
| --- | --- | --- |
| 原生分享 | 1.简单粗暴，轻松实现分享功能;2没有多余的架包和依赖库3.无需去申请繁琐AppKey | 1.系统会调出手机中所有具有分享的功能的App;2.界面风格不统一跟随系统的版本; 3.如果没有安装需要分享的指定APP，则无法分享 |
| 第三方SDK | 1.可以统一分享的界面风格;2.支持网页分享和App直接分享; 3.分享类型比较多，封装了分享内容的样式 | 1.需要添加大量依赖库和架包;2.需要去申请繁琐的AppKey;3.经常更新版本，兼容性和稳定性不好 |

### 六、 补充

在Android 7.0及以上系统，限制了file域的访问，导致进行intent分享的时候，会报错甚至崩溃。我们需要在App启动的时候在Application的onCreate方法中添加如下代码，解除对file域访问的限制：

```java
 if(VERSION.SDK_INT >= 24) {
      Builder builder = new Builder();
      StrictMode.setVmPolicy(builder.build());
 }
```

[Android——intent分享图片到微信好友、朋友圈、QQ](https://blog.csdn.net/qq_15710245/article/details/107185841  )

本文转自 [https://blog.csdn.net/qq\_43093708/article/details/84641389](https://blog.csdn.net/qq_43093708/article/details/84641389)，如有侵权，请联系删除。