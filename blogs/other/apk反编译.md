---
title: apk 反编译
date: 2022-09-17
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 一、准备工具

**(1) 使用工具介绍：**

 **1.apktool 最新版 jar 包**
 作用：资源文件获取，可以提取出图片文件和布局文件进行使用查看
 **2.dex2 jar 的zip包**
 作用：将apk反编译成java源码（classes.dex转化成jar文件）
 **3.jd-gui 工具**
 作用：查看APK中classes.dex转化成出的jar文件，即源码文件

**(2) 使用工具下载与安装：**

 **1.apktool_2.3.4 jar 包**
  官网下载地址：https://bitbucket.org/iBotPeaches/apktool/downloads/

![img](https://raw.githubusercontent.com/shug666/image/main/images/1483449-20181101212900787-424863520.jpg)

 **2.dex2 2.0 jar 包**
  官网下载地址：http://sourceforge.net/projects/dex2jar/files/

![img](https://raw.githubusercontent.com/shug666/image/main/images/1483449-20181101212914656-383424119.jpg)

 **3.jd-gui 1.4.0**

官网下载地址：http://jd.benow.ca/

![image-20220919192515379](https://raw.githubusercontent.com/shug666/image/main/images/image-20220919192515379.png)

## 二、Apk 反编译步骤

**(1) 使用 apktool 反编译 apk 得到图片、XML配置、语言资源等文件**

1.将上述下载好的 3 个工具统一放到一个文件夹中（目录最好不好有中文），并解压 zip 文件

2.打开 cmd/终端，进入上述工具目录

 3.运行apktool_2.3.4.jar这个jar文件来将 apk文件进行反编译，在java中，运行可执行jar包的命令是：

> **java -jar apktool_2.3.4.jar d -f apk文件绝对路径 -o 输出的目录**

**例如：** 使用如下的命令运行apktool_2.0.1.jar反编译MMTS-release-1.0.2.apk

> **java -jar apktool_2.3.4.jar d -f D:\apkDecompile\ocrTest.apk -o source**

这个命令是启动 apktool_2.3.4.jar 将位于 D:\apkDecompile\ocrTest.apk 文件执行反编译，然后将反编译生成的文件存放到 apk 文件同级的 source 目录下，然后就会生成源文件的目录，以上就是使用 apktool 这个工具将一个 apk 反编译得到图片、XML配置、语言资源等文件的过程，截图：

![image-20220919192630537](https://raw.githubusercontent.com/shug666/image/main/images/image-20220919192630537.png)

**(2) 使用 dex2jar 反编译 apk 得到 Jar 包**

 将要反编译的 APK 后缀名改为 .rar 或者 .zip，并解压，得到其中的classes.dex 文件（它就是java文件编译再通过dx工具打包而成的），如下图所示：

将获取到的classes.dex放到之前解压出来的工具【dex2jar-2.0】文件夹内，如下图所示：

在命令行下进入到 dex2jar.bat 所在目录，输入"d2j-dex2jar classes.dex"

命令执行完成之后，在当前目录下就可以看到生成的Jar文件了，如下图所示：

![image-20220919192719298](https://raw.githubusercontent.com/shug666/image/main/images/image-20220919192719298.png)

反编译 classes.dex 得到 classes-dex2jar.jar 文件之后，就可以使用【jd-gui】工具将 class 文件反编译成 java 源代码了

**(3) 使用 jd-gui.exe 工具将 class 文件反编译成 java 源代码**

 1.打开 jd-gui.exe 程序（不需要安装，之前 zip 包解压即可）

2.选择 class 文件就可以看到 java 源代码：

## 参考链接

apk 反编译https://www.cnblogs.com/xpwi/p/9892680.html