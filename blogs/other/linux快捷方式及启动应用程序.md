---
title: linux快捷方式及启动应用程序
date: 2024-01-09
tags:
 - linux
categories: 
 - linux
sticky: 
   true
---

## 设置相关权限

对要操作的 AppImage **右击 > 属性**进行如下图的设置，必须勾选 **允许执行文件**

## 创建 desktop 文件

在任意文件夹内启动终端，执行 `gedit CAJViewer.desktop` ，创建 .desktop 文件，并输入以下内容：

```
[Desktop Entry]
Encoding=UTF-8
Type=Application
#应用名称
Name=CAJViewer
#图标路径
Icon=***/CAJViewer/Icon.png
#启动是否开启终端
Terminal=false
#AppImage文件路径
Exec=***/CAJViewer/CAJViewer.AppImage
```

.desktop 文件置于桌面时可以作为类似 Windows 的快捷方式一样来启动软件

当快捷方式像如上图所示一样时是无法启动软件的，**右击 > 允许运行** 后图标处没有红叉即可启动

这样就可以从桌面启动了。

## 添加至应用程序

使用 `sudo cp CAJViewer.desktop /usr/share/applications` 命令，将设置好的 .desktop 文件复制到 **/usr/share/applications** 文件夹中，就可以在应用程序里看到 CAJViewer 应用。

## 为特定格式文件设置默认启动程序

首先查看要设置的文件所属格式，右击目标文件查看文件类型，如图所示，caj文件是 `application/octet-stream` 格式

> 14/02/2023 09:33 ------ 补充
> 
> 在为搜狗输入法安装皮肤时发现，皮肤文件的格式也是 Application/octet-stream ，查阅资料了解到：**Application/octet-stream** 是应用程序文件的默认值，意思是 **未知的应用程序文件**
> 
> 所以此处的设置方法可能会影响到其它后缀的文件，使用时请自行甄别

通过 `sudo gedit /usr/share/applications/defaults.list` 命令编辑 defaults.list 文件，在末尾添加一行

```
application/octet-stream=CAJViewer.desktop;
```

*   全局默认打开方式保存在 `/etc/gnome/defaults.list`
*   用户默认打开方式保存在 `~/.local/share/applications/mimeapps.list`

保存后再次点击caj文件就会通过 CAJViewer 运行。

  

本文转自 [https://www.cnblogs.com/KoiC/p/17112703.html](https://www.cnblogs.com/KoiC/p/17112703.html)，如有侵权，请联系删除。