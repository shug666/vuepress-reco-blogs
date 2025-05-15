---
title: Android15使用Winscope
date: 2025-01-21
tags:
 - android
categories: 
 - android
sticky: 
   true
---

 [使用 Winscope 跟踪窗口转换 | Android Open Source Project (google.cn)](https://source.android.google.cn/docs/core/graphics/tracing-win-transitions?hl=zh-cn#analyze-traces)

Winscope 是一款 Web 工具，可以让用户在动画和转换期间和之后记录、重放和分析多个系统服务的状态。Winscope 将所有相关的系统服务状态记录在一个跟踪文件中。使用带有跟踪文件的 Winscope 界面，您可以通过重放、单步执行和调试转换来针对每个动画帧检查这些服务的状态（无论是否有屏幕录制）。

说的通俗一点，我感觉Winscope就是在一段时间内的每一帧，都dump一下手机中的某些信息，然后将这些信息收集起来并且以图形的方式展示，如：  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images202ee6eae72248c9862822e71655c992.png)

本文主要记录一下我本地在Android15平台上使用Winscope的情况，这个跟个人使用的平台以及环境都有很大的关系，不一定说按照我的做法就一定成功，我遇到的问题你可能没有遇到，同样你遇到的问题我可能没有遇到。

## Android15以前使用Winscope

1、在开发者模式中，“Quick settings developer tiles“中，开启”Winscope trace“：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesee9f139c227644f1bf22888d1d6f0196.png)

2、执行复现问题的操作。

3、操作完后的winscope文件在手机保存到了`data/misc/wmtrace`，我们一般关注比较多的是保存了SurfaceFlinger的信息，“layers\_trace.winscope”文件：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesc73bc943dc1c461680b42a68c72a7513.png)

4、使用`prebuilts/misc/common/winscope/winscope.html`查看相关信息：

### 通过 adb 命令捕获SurfaceFlinger跟踪记录

要记录 SurfaceFlinger 的跟踪情况，请执行以下操作：  
1、启用跟踪：

```shell
adb shell su root service call SurfaceFlinger 1025 i32 1
```

2、停用跟踪：

```shell
adb shell su root service call SurfaceFlinger 1025 i32 0

```

3、获取跟踪文件：

```shell
adb pull /data/misc/wmtrace/layers_trace.winscope layers_trace.winscope
```

4、拖动到Winscope来查看layers\_trace.winscope文件：

这里展示一下从Launcher启动google Files的过程。

## Android15变动

然而这些在Android15上已经行不通了，如果我们使用adb命令：

```shell
adb shell su root service call SurfaceFlinger 1025 i32 1
```

去抓取跟踪信息，会报错：

```shell
Result: Parcel(Error: 0xfffffffffffffffe "No such file or directory")
```

原因则是Android15中SurfaceFlinger这块的逻辑已经被移除了：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesee8df13e1e1f4ccea93feb913d25c905.png)

提示需要使用perfetto来开启layer追踪。

再根据google的官网介绍：

[使用 Winscope 跟踪窗口转换 | Android Open Source Project (google.cn)](https://source.android.google.cn/docs/core/graphics/tracing-win-transitions?hl=zh-cn#capture-traces-winscope)

最新的情况是“Quick settings developer tiles“下移除了”Winscope trace“，移动到了“System Tracing”中：

如我的手机截图：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesa7bd15fcd2794078b33bf5d2b0558b9b.png)

那现在的Android15要如何使用Winscope工具呢，毕竟这个工具还挺好用的。

## Android15使用winscope

首先根据google官网的指导去调试肯定是没错的，但是官网有些地方说的并不清楚，实际上去操作也遇到过很多问题，本文也参考了：

[android 14版本的winscope编译使用-手把手教你编译成功不报错\_android wincope-CSDN博客](https://blog.csdn.net/learnframework/article/details/141681248)

另外我工作用的机器是windows+WSL，用的代码下载在了服务器，然后挂载到本地来查看的，实际操作起来一堆问题，虽然最后还是在本地弄好了，但这个是后话了。

最开始，为了实验一下按照官方的教程是否能够成功，我用的是公司机房的电脑，ubuntu系统，并且能够连接外网，先体验一下简单难度，再挑战地狱难度。

### 1. 下载Android15源码

```shell
repo init -u https://android.googlesource.com/platform/manifest -b android-15.0.0_r1
#清华镜像源 repo init -u https://mirrors.tuna.tsinghua.edu.cn/git/AOSP/platform/manifest -b android-15.0.0_r1
```

这里只需要下载几个依赖的库就好了：

```shell
repo sync development external/protobuf external/perfetto frameworks/base frameworks/libs/systemui frameworks/native frameworks/proto_logging platform_testing prebuilts/misc
```

不同的Android版本不一样，具体是哪些库应该要看“development/tools/winscope/protos/build.js”的具体内容。

### 2. 导航到 Winscope 文件夹

```shell
cd development/tools/winscope
```

### 3. 安装npm

查看版本号为：

```shell
ukynho@user:~$ node -v
v22.9.0
ukynho@user:~$ npm -v
10.8.3
```

如果使用”apt-get“安装npm，我本地安装的node版本是10.19.0，低版本的node到后续的步骤可能会出错。

另外我这边查看node版本的时候，也遇到了GLIBC版本过低的错误，这一点更新到后面的解决问题的章节。

### 4. 安装依赖项

使用以下命令安装依赖项：

```shell
npm install
```

如需查看可用命令的列表，请运行以下命令： `npm run`

通过npm run命令查看的应该是package.json下的命令，我们重点关注build的这几个，“build:trace\_processor”、“build:prod”"和"build:protos：

### 5. 构建所有生产和测试目标

使用以下命令构建所有生产和测试目标：

```shell
npm run build:prod
```

实际上执行的也就是：

```shell
> npm run build:trace_processor && npm run build:protos && rm -rf dist/prod/ && webpack --config webpack.config.prod.js --progress && cp deps_build/trace_processor/to_be_served/* src/adb/winscope_proxy.py src/logo_light_mode.svg src/logo_dark_mode.svg src/viewers/components/rects/cube_full_shade.svg src/viewers/components/rects/cube_partial_shade.svg src/app/components/trackpad_right_click.svg src/app/components/trackpad_vertical_scroll.svg src/app/components/trackpad_horizontal_scroll.svg dist/prod/
```

我本地的情况是，当执行到以下步骤：

```shell
> winscope@0.0.0 build:protos /local/sdb/android-15/development/tools/winscope
> node protos/build.js
```

最终成功，显示：

webpack 5.91.0 compiled with 3 warnings in 35078ms

并生成`dist/prod`目录：

### 6. 运行Winscope

使用以下命令运行 Winscope：

```shell
npm run start
```

然后Winscope页面在浏览器中打开

## 捕获追踪记录

### 1. 在设备上捕获跟踪记录

这里是官网的介绍：

在针对动画问题提交错误时，在设备上捕获跟踪记录以收集数据。所有界面跟踪记录都是通过此方法记录的，因为无法自定义配置。

在 Android 设备上：

1、[启用开发者选项](https://developer.android.google.cn/studio/debug/dev-options?hl=zh-cn#enable)。

2、选择**开发者选项下的 System Tracing**。

3、启用**收集 Winscope 跟踪记录**。

4、在**其他**下：

1.  启用**在错误报告中附加录制内容**。
2.  启用**显示“快捷设置”功能块**。

5、 导航到您需要重现错误的位置。

6、如需开始记录，请打开“快捷设置”，然后选择**录制跟踪记录**：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ec3de6c3cce54ad8ba23c916d2a969e2.png)

7、仅执行重现错误所需的步骤。  

8、如需停止捕获，请打开“快捷设置”，然后选择**停止跟踪**。  

9、使用所列选项之一共享捕获的日志，如 Gmail、云端硬盘或 BetterBug。

我本地操作下来，看到最终的“perfetto-trace”文件是保存在了“data/local/traces”目录下，如：

```
data/local/traces/trace-MT6835-AP3A.240617.008-2024-10-15-10-33-52.perfetto-trace
```

另外我没看到对应的视频，我个人觉得有“perfetto-trace”搭配视频就最好了，大部分情况下wm或者ime的信息啥的我不太需要，比如Transitions啥的一般看log就够了，当然特殊情况下肯定是有参考价值的。

### 2. 通过 Winscope 捕获跟踪记录

这种方式虽然有点麻烦，但是能抓的信息却是最全，如果情况允许的，我最推荐这种。

1、执行以下命令：

```shell
python3 development/tools/winscope/src/adb/winscope_proxy.py
```

生成了token：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images0881cb25524443d8aec117302e53e25b.png)

2、在 **Collect Traces**（收集跟踪记录）界面上，点击 **ADB Proxy**（ADB 代理）：

输入token，然后点击“Connect”，选择对应的机器：

然后点击“Start trace”，就可以开始记录了。

最后你也可以把所有的文件下载下来查看，下载后是一个压缩包

另外说一下这个生成状态转储文件的功能：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images9108315608804f6e9d001c1924350e8d.png)

我个人觉得也还不错，Android15上用“dumpsys SurfaceFlinger”看不到每一个Layer的具体信息了（也许还能看，我现在还没去研究），但是通过这里还是能看到：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images1644fb967fd1404dafadf53c9fd33247.png)

### 3. 通过 adb 命令捕获跟踪记录

这里重点看下SurfaceFlinger的部分，首先是官网的介绍。

SurfaceFlinger 层跟踪使用 Perfetto 跟踪记录进行捕获。如需了解配置信息，请参阅[跟踪配置](https://perfetto.dev/docs/concepts/config)。

请参阅以下有关 SurfaceFlinger 层跟踪配置的示例：

```java
unique_session_name: "surfaceflinger_layers_active"
buffers: {
    size_kb: 63488
    fill_policy: RING_BUFFER
}
data_sources: {
    config {
        name: "android.surfaceflinger.layers"
        surfaceflinger_layers_config: {
            mode: MODE_ACTIVE
            trace_flags: TRACE_FLAG_INPUT
            trace_flags: TRACE_FLAG_COMPOSITION
            trace_flags: TRACE_FLAG_HWC
            trace_flags: TRACE_FLAG_BUFFERS
            trace_flags: TRACE_FLAG_VIRTUAL_DISPLAYS
        }
    }
}
```

请参阅以下示例命令，以生成 SurfaceFlinger 层的跟踪记录：

```shell
adb shell -t perfetto \
    -c - --txt \
    -o /data/misc/perfetto-traces/trace \
```

我看了这个是比较懵逼的，最后参考了：

[Trace configuration - Perfetto Tracing Docs](https://perfetto.dev/docs/concepts/config)

才稍微弄懂了一点，主要是看关于Android的介绍：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images8aec5987a03044ff81583be619a74bae.png)

接着是我本地的操作。

1、首先将以上配置写到一个文件中：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images4b170720778a46d5ac36af61f4e037de.png)

命名为config.pbtx。

2、使用以下命令：

```shell
cat config.pbtx | adb shell perfetto -c - --txt -o /data/misc/perfetto-traces/test.perfetto-trace
```

然后在适当的时候断掉

最终在“/data/misc/perfetto-traces/”目录生成名为“test”的perfetto-trace文件：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images7ed4c5af0b914a91a8d4d17b7df87076.png)

但是这里的生成的文件大小是0，所以肯定是哪里有点问题的，我现在还不清楚。

后续看了下perfetto官网的介绍，仿照着在配置文件中额外增加抓取时间，“duration\_ms: 10000”，如：

```java
duration_ms: 10000

unique_session_name: "surfaceflinger_layers_active"
buffers: {
    size_kb: 63488
    fill_policy: RING_BUFFER
}
data_sources: {
    config {
        name: "android.surfaceflinger.layers"
        surfaceflinger_layers_config: {
            mode: MODE_ACTIVE
            trace_flags: TRACE_FLAG_INPUT
            trace_flags: TRACE_FLAG_COMPOSITION
            trace_flags: TRACE_FLAG_HWC
            trace_flags: TRACE_FLAG_BUFFERS
            trace_flags: TRACE_FLAG_VIRTUAL_DISPLAYS
        }
    }
}
```

然后果然就可以了

拖动到Winscope中可以查看：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images05b14b765bb1410a9f6f765634b6f9bb.png)

3、最后如perfetto官网介绍的，从Android12开始，“/data/misc/perfetto-configs”可以用来存储配置文件，你也可以把自己的配置文件push到这个目录下，然后直接用命令：

```shell
adb shell -t perfetto -c data/misc/perfetto-configs/config.pbtx --txt -o /data/misc/perfetto-traces/test2.perfetto-trace
```

来生成perfetto-trace文件：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images9035e87fe1d3491d8679c82678671fda.png)

我个人觉得还是自己本地写好一个配置文件，然后执行：

```shell
cat config.pbtx | adb shell perfetto -c - --txt -o /data/misc/perfetto-traces/test.perfetto-trace
```

这种方式最简单快捷。

## 分析跟踪记录

这部分官网已经讲的很详细了，我这边没有遇到什么别的问题。

## 问题收集

如我之前所说，最开始我用的是公司机房的ubuntu系统的电脑，并且能够连接外网，所以遇到的问题还算少的。

但是我最终的目的肯定是在自己自用的电脑上用的，由于我本地是windows系统+WSL，不能连外网，并且代码是下载在服务器然后挂载到本地的，所以实际上操作的时候遇到了很多其它的问题。

### 1. 直接使用index.html行吗

根据我们在Android15之前的平台上的经验，是可以直接把`prebuilts/misc/common/winscope/winscope.html`这个文件拷贝到其它地方，然后直接打开来用的，那现在对`development/tools/winscope/dist/prod/index.html`还可以用同样的操作吗？

我直接将机房生成的”dist/prod“目录拷到我本地，然后直接打开`development/tools/winscope/dist/prod/index.html`后，同样是这个界面：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f6c657c5cacb4f338ea15b85fa22a89c.png)

然后我本地试了一下，大部分的文件都能拖进去解析：

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/485341a28d514869b7b9c0ceba09ed88.png)

但是唯独`trace.perfetto-trace`不行！

说实话我用Winscope主要就是看SurfaceFlinger的信息的，你哪怕功能再多，SurfaceFlinger的信息看不了对我来说等于没用，目前我本地是行不通的。

~不知道有没有网上的各位大佬有没有办法，如果可以的话，就能省下很多工作了。~

该问题别的博主已经解决：  
[aosp15上winscope离线html如何使用？\_winscope.html-CSDN博客](https://blog.csdn.net/learnframework/article/details/144384808?spm=1001.2014.3001.5501)

### 2. 解决html直接导入Winscope文件

1、用npm安好http-server

```shell
npm install -g http-server
```

2、然后到cd到html目录执行http-server
例如我们到`development/tools/winscope/dist/prod`目录下执行http-server

```shell
test@test:~/aosp15/development/tools/winscope/dist/prod$ http-server 
Starting up http-server, serving ./

http-server version: 14.1.1

http-server settings: 
CORS: disabled
Cache: 3600 seconds
Connection Timeout: 120 seconds
Directory Listings: visible
AutoIndex: visible
Serve GZIP Files: false
Serve Brotli Files: false
Default File Extension: none

Available on:
  http://127.0.0.1:8080
  http://192.168.31.142:8080
Hit CTRL-C to stop the server

```

3、进入浏览器，访问http://127.0.0.1:8080地址既可以

### 3. 直接将别的机器的源码拷到本地可以吗

既然直接将`index.html`拿过来不行，那将别的机器中配置好的源码拷贝过来可以用吗？比如我在机器A上配置好了，然后我把机器A上的源码直接拷贝到机器B上，然后直接在`development/tools/winscope`目录下执行最后一步`npm run start`可以吗？毕竟能少执行一步就少执行一步…

实际上是可行的，但是根据我操作的情况，将机房中的机器A配置好的源码拷贝到机房中的机器B（同样的Ubuntu+连接外网）下是行得通的，但是拷贝到我自用的机器（Windows+WSL+不能连外网）就不行，具体现象和直接打开“index.html”是一样的，没办法查看perfetto-trace文件…时运不齐，命途多舛。

### 4. OSError: \[Errno 98\] Address already in use

有的时候执行`winscope_proxy.py`：

```shell
python3 winscope_proxy.py
```

会提示：

```shell
OSError: [Errno 98] Address already in use
```

此时执行：

```shell
netstat -tunlp
```

kill掉相应的进程：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images3c68a2f5a6b9488fa4b1eacbb2a610f3.png)

就可以了。

### 5. listen EADDRINUSE: address already in use :::8080

有的时候执行`npm run start`，会遇到端口被占用的情况：

```shell
listen EADDRINUSE: address already in use :::8080
```

那么执行：

```shell
sudo lsof -i :<端口号>
```

然后kill掉相关进程就好了，如我这里的是8080端口号被占了：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesb4af6ea085bd4f348311d1f4c936bd3f.png)

## 小试牛刀 —— 闪屏问题分析

现在你已经掌握了Winscope的使用方法了，可以运用到实际来解决问题了，这里看一个启动头条闪屏的问题。

### 1.  问题描述

非冷启动头条的情况，偶尔会出现闪屏的情况，如：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images7c0ea5b744204edca3d47a2277f396eb.png)

看这个现象：

1、是Starting Window消失又出现了？

2、还是Starting Window消失后过了一阵子Activity界面显示了？

3、亦或是Starting Window根本就没有显示，是Activity界面消失又出现了？

…

可能的原因很多，单从问题场景无法得知原因。

### 2. 分析方式一：添加log

在计算Layer可见区域的函数Output.ensureOutputLayerIfVisible中添加log，看到：

1、SnapshotStartingWindow先被显示：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images86193239574946c88e5a3249c4fd26a4.png)

2、然后在真正的MainActivity显示之前，SnapshotStartingWindow被隐藏了：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images74296312629f4f6ea57ed16d4646282c.png)

3、最终MainActivity显示：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images75ff565f776341249eedba2a6b9df526.png)

4、正常来说，SnapshotStartingWindow应该是要等MainActivity显示了之后才隐藏的，如这份正常的log：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images60021512c758443688d9e74b5003085e.png)

MainActivity显示的时候SnapshotStartingWindow还在，但是出现问题的时候，是提前隐藏了。

### 3.  分析方式二：Winscope

以上方式显而易见，我们得有一套编译过的代码以及相匹配的手机才行，有的时候你可能手头没有这些，你要重新下一套代码再去编译啥的，很花时间，再看使用Winscope如何分析问题。

我这边只抓了SurfaceFlinger和视频的信息，当然也可以SurfaceFlinger和视频的信息结合着一起看，但是这样会比较卡，由于复现的时间比较长，所以我这边先查看了视频的信息，如下：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesbd24a5056a554352934066ebe136cbe1.png)

上面显示的“f=…”应该是帧号的意思，那么看视频：

1）、大概是在1130帧的时候，头条的相关界面（可能是StartingWindow，也可能是头条的Activity，现在还不得而知）完全消失。

2）、1131帧的时候，Launcher界面也消失。

3）、1135帧的时候，头条的相关界面又重新出现。

再看Winscope的信息：

1、由于是1130帧出现了问题，那么首先看1129帧：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/imagesfa3cc0c650004b688da371636f76c5e9.png)

看视频的信息，知道此时头条的界面还在显示，从SurfaceFlinger的信息知，此时显示的是头条的StartingWindow。

展开看StartingWindow：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images269e5558cffc4e159e56ddf0e3e8470e.png)

其Layer位于头条对应的Task#8之下，没毛病。

2、接着是1130帧：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images52f5043cb9f24cf3939684499b871142.png)

看视频此时StartingWindow不见了，再看SurfaceFlinger的信息，头条的StartingWindow对应的可见Layer也不在了。

再展开看头条对应的Task#8的信息：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images8d38d27976b24ad0a4a363fa3d6cb109.png)

发现StartingWindow的WindowState啥的全被移除了。

此时头条的MainActivity还没显示，但是StartingWindow已经被移除了，这个肯定是不对的。

3、最后看1135帧：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images5bc0395038ca43b5b5d58fde1b1aa3b9.png)

看视频的信息，此时头条的界面又显示出来了，从SurfaceFlinger的信息知，此时显示的是头条的真正的界面，MainActivity。

根据Winscope显示的信息，我们可以和方式一添加log调试那样得出同样的结论，即StartingWindow被提前隐藏/移除了。

### 4. 问题原因

根据以上分析，我们知道了闪屏的原因是因为StartingWindow被提前移除了，但是从Winscope上也无法再得出更多的信息了。

继续打开更多相关的log开关，主要是`WM_DEBUG_STARTING_WINDOW、WM_SHOW_TRANSACTIONS以及WM_SHOW_SURFACE_ALLOC`，并且结合我自己的log（有没有都行），抓取一份复现问题的log进行分析：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images46d31557ee544ece9d5fb138e3c1ffdc.png)

log中的信息总结如下：

1、SnapshotStartingWindow窗口被添加、绘制完成以及SurfaceControl显示。

2、SnapshotStartingWindow对应的Layer显示。

3、头条的一个子窗口，PopupWindow，绘制完成，于是准备移除SnapshotStartingWindow，但是MainActivity的主窗口还没绘制完成。

4、WMS侧发起对SnapshotStartingWindow的隐藏和销毁。

5、SnapshotStartingWindow的Layer被隐藏，但是此时头条的MainActivity还没显示。

6、头条MainActivity的主窗口绘制完成、显示。

7、头条MainActivity主窗口对应的Layer显示。

关键就在于当头条的一个子窗口，PopupWindow，绘制完成后，即触发了：

ActivityRecord.onFirstWindowDrawn

\-> ActivityRecord.removeStartingWindow

\-> ActivityRecord.removeStartingWindowAnimation

移除了SnapshotStaringWindow。

但是实际上不管是看视频，还是看log，都是没找到这个PopupWindow的相关信息的，查看这个PopupWindow的信息：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images2ae60ae99bc94f16a84e9f9b3100da02.png)

请求的宽是0，所以这个PopupWindow实际上是没有内容显示的，但是它绘制完成的时候，又认为此时可以移除SnapshotStartingWindow了，这肯定是不合理的。

### 5.  pixel现象

最后看到pixel上同样可以复现，log为：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images154aec3e142446f2ac4b9df0acb4f0de.png)

原因是一样的，由于PopupWindow绘制完成，移除了SnapshotStartingWindow，而此时MainActivity的主窗口还没绘制完成，从而出现闪屏：

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images886c51b4bcd94043ac8baf8eab984f79.png)

### 6. 小结

从本题的分析我们可以看到，如果是用Winscope分析这个问题的话，只需要两步：

1、手头任意一台能够复现问题的手机，用Winscope查看问题发生过程中的界面变化。

2、打开更多log开关，然后根据log查明问题发生的原因。

如果不用Winscope，那么我们的解题步骤是：

1、下一套代码，添加log，编译。

2、找个机器，刷和下载的代码日期相近的版本。

3、将编译出的东西push到手机，然后复现问题，根据log得知问题发生过程中的界面变化。

4、打开更多log开关，然后根据log查明问题发生的原因。

这种问题，耗时的地方往往在于前几步，因为log中没有信息来表明每时每刻屏幕上正在发生的界面变化，如果没有Winscope的话，那么我们只能搞一套代码，添加log来调试，非常麻烦。

但是Winscope也有局限性，大部分情况下我们无法只通过Winscope就知道问题原因，还是需要结合log或者其它工具来综合分析问题。

 

  

本文转自 [https://blog.csdn.net/ukynho/article/details/143023774?spm=1001.2014.3001.5501](https://blog.csdn.net/ukynho/article/details/143023774?spm=1001.2014.3001.5501)，如有侵权，请联系删除。