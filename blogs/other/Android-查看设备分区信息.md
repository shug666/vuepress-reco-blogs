---
title: Android 查看设备分区信息 分区备份
date: 2023-08-11
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 1.先查询系统分区信息

命令: `ls -al /dev/block/platform/18010800.emmc/by-name`命令来查看设备的分区信息。该命令将显示所有按名称排序的分区的符号链接。通常，这些链接指向设备的各个分区，例如system、userdata、boot、recovery、cache等。

![image-20230818153902304](https://raw.githubusercontent.com/shug666/image/main/images/image-20230818153902304.png)

此路径下也可以查看/dev/block/by-name

此外还可以使用df , mount ,  cat /proc/devices , cat /proc/partitions等命令去完善更多的分区信息

1. 使用cat /proc/partitions命令来查看设备的分区信息。该命令将显示每个分区的名称、大小、起始扇区和结束扇区等信息。
2. 如果想知道每个挂载到文件系统上的分区大小和使用情况的信息，可以像普通Linux一样使用：df -h；不过df命令只显示了在文件系统上的挂载点，并没有显示对应的块设备是哪个，这点可以通过使用**mount**命令来弥补
3. 使用cat /proc/mounts命令来查看设备当前已经挂载的分区信息。该命令将显示每个已经挂载的分区的挂载点、文件系统类型和选项等信息。

详细的linux命令使用方法可以 参见 : [Linux 命令大全 | 菜鸟教程 (runoob.com)](https://www.runoob.com/linux/linux-command-manual.html "Linux 命令大全 | 菜鸟教程 (runoob.com)")

 如: [Linux df 命令 | 菜鸟教程 (runoob.com)](https://www.runoob.com/linux/linux-comm-df.html " Linux df 命令 | 菜鸟教程 (runoob.com)")

2.备份 boot 分区至 内置sd卡 中生成 boot.img镜像文件:
-------------------------------------

命令: dd if=/dev/block/platform/7824900.sdhci/by-name/boot of=/sdcard/boot.img

![](https://raw.githubusercontent.com/shug666/image/main/images/a5762e0b61c241b398cce4d2f8e11018.png)

3.备份system 分区 至 外置 sd卡中 生成 system.img镜像文件 :
-------------------------------------------

命令: dd if=/dev/block/platform/7824900.sdhci/by-name/system of=/storage/sdcard1/system.img

![](https://raw.githubusercontent.com/shug666/image/main/images/e4fe528c35db4608a5feee9e1c70ccb8.png)

dd命令使用方法参见:[Linux dd 命令 | 菜鸟教程 (runoob.com)](https://www.runoob.com/linux/linux-comm-dd.html "Linux dd 命令 | 菜鸟教程 (runoob.com)") 



 [安卓平台如何查看分区信息\_crow\_ch的博客-CSDN博客\_安卓分区表](https://blog.csdn.net/crow_ch/article/details/86528219 "安卓平台如何查看分区信息_crow_ch的博客-CSDN博客_安卓分区表")

  

本文转自 [https://blog.csdn.net/u012336596/article/details/122742574?utm\_medium=distribute.pc\_relevant.none-task-blog-2~default~baidujs\_baidulandingword~default-4-122742574-blog-129501113.235^v38^pc\_relevant\_anti\_vip\_base&spm=1001.2101.3001.4242.3&utm\_relevant\_index=7](https://blog.csdn.net/u012336596/article/details/122742574?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-4-122742574-blog-129501113.235^v38^pc_relevant_anti_vip_base&spm=1001.2101.3001.4242.3&utm_relevant_index=7)，如有侵权，请联系删除。