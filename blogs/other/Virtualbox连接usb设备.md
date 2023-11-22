---
title: Virtualbox 连接usb设备
date: 2023-11-02
tags:
 - linux
categories: 
 - linux
sticky: 
   true
---

Linux系统安装Windows虚拟机，Virtualbox 的 USB设备筛选器 中找不到连接的usb设备，解决办法如下：

步骤：

**1、安装扩展包 Virtualbox Extension Pack。扩展包可在官网下载。**

      下载完后，打开Virtualbox “管理——工具——Extension Pack Manager”，选择“Install”，添加扩展包 Virtualbox Extension Pack。

**2、 **添加相关用户、用户组（ Virtualbox 装完成后会有 vboxusers 和 vboxsf ）****

      打开终端

      ## 添加usbfs 用户组

       **sudo groupadd usbfs**

      ## 将 Linux 常用用户添加到 vboxusers、usbfs 这个两个用户组中

       **sudo adduser** user（本机开机显示的系统用户名） **vboxusers**

       **sudo adduser** user（本机开机显示的系统用户名） **usbfs**

**3、重启电脑**

**4、打开 Virtualbox，虚拟机 -> 设置 -> USB设备 -> 勾选“启用USB控制器” -> 选中“USB 3.0(xHCI)控制器”-> USB设备筛选器手动添加USB设备**

  

本文转自 [https://www.cnblogs.com/manmande/p/17329504.html](https://www.cnblogs.com/manmande/p/17329504.html)，如有侵权，请联系删除。
