---
title: 安装jdk，android studio以及配置快捷方式
date: 2023-10-19
tags:
 - linux
categories: 
 - linux
sticky: 
   true
---

## 在Linux上安装Android Studio

## 步骤概览

下表提供了安装Android Studio的步骤概览。

| 步骤 | 描述 |
| --- | --- |
| 步骤1 | 安装Java Development Kit (JDK) |
| 步骤2 | 下载Android Studio |
| 步骤3 | 安装Android Studio |
| 步骤4 | 配置Android Studio |

现在，让我们详细了解每个步骤需要做什么。

## 步骤1：安装Java Development Kit (JDK)

首先，你需要安装Java Development Kit (JDK)，因为Android Studio需要在JDK的支持下运行。你可以按照以下步骤安装JDK：

1.  打开终端（Terminal）。
2.  输入以下命令以安装JDK：

```sh
sudo apt update  # 更新软件包列表
sudo apt install openjdk-11-jdk  # 安装OpenJDK 11
```

3.  确保JDK安装成功，可以通过运行以下命令来检查Java版本：

```sh
java -version
```

如果一切正常，你将看到Java版本信息。

## 步骤2：下载Android Studio

在这一步中，你需要从官方网站上下载Android Studio的压缩包。按照以下步骤进行操作：

1.  打开你的Web浏览器，并访问\[Android Studio官方网站\](
2.  在网站上找到“Download Android Studio”按钮，并点击它。
3.  选择适用于Linux操作系统的版本，并下载压缩包（.tar.gz文件）。

## 步骤3：安装Android Studio

一旦你完成了Android Studio的下载，接下来你需要进行安装。按照以下步骤进行操作：

1.  打开终端（Terminal）。
2.  进入你下载的Android Studio压缩包所在的目录。你可以使用`cd`命令来切换目录，例如：

```sh
cd Downloads  # 如果你的压缩包在Downloads目录下
```

3.  解压缩Android Studio压缩包。你可以使用以下命令：

```sh
tar -xvzf android-studio-*.tar.gz
```

4.  进入解压缩后的Android Studio目录。你可以使用以下命令：

```sh
cd android-studio
```

5.  启动Android Studio安装程序。你可以使用以下命令：

```sh
./bin/studio.sh
```

## 步骤4：配置桌面快捷方式

创建文件如：android-studio.txt，并复制以下内容，随后将其后缀改为.desktop

```sh
[Desktop Entry]
Version=1.0
Name=android studio
Comment=studio
Exec=/home/ts/android-studio/bin/studio.sh
Icon=/home/ts/android-studio/bin/studio.png
Type=Application
Terminal=false
Categories=Utility 
```

给予权限sudo chmod a+x 以及sudo chmod 777 

放在桌面，随后右键选择允许启动即可

本文转自 [https://blog.51cto.com/u\_16175440/7166497](https://blog.51cto.com/u_16175440/7166497)，如有侵权，请联系删除。
