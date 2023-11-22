---
title: ubuntu 修改环境变量的几种方法
date: 2023-10-23
tags:
 - linux
categories: 
 - linux
sticky: 
   true 
---

## ubuntu修改环境变量的几种方法

有多种方法可以修改Ubuntu系统的环境变量，包括：

1. ### 临时修改环境变量

   在终端中使用export命令可以临时修改环境变量。例如，要将PATH环境变量添加到新目录，可以运行以下命令：

```sh
export PATH=$PATH:/path/to/new/directory
# 或者使用
declare -x JAVA_HOME="/usr/local/jdk1.7.0_03/bin/"
```

这将在当前终端会话中添加新目录到PATH环境变量中。但是，当关闭终端时，这些更改将被删除。

2. ## 永久修改环境变量

   要永久修改环境变量，可以编辑系统级别的配置文件或用户级别的配置文件。系统级别的配置文件包括/etc/environment和/etc/profile文件，而用户级别的配置文件包括~/.bashrc和~/.profile文件。

在/etc/environment文件中添加环境变量将使其对所有用户和进程都可用。例如，要将新目录添加到PATH环境变量中，可以编辑/etc/environment文件并添加以下行：

```sh
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/path/to/new/directory"
```

*   在/etc/profile文件中添加环境变量将使其对所有用户可用。例如，要将新目录添加到PATH环境变量中，可以编辑/etc/profile文件并添加以下行：

```sh
export PATH=$PATH:/path/to/new/directory
```

*   在~/.bashrc文件中添加环境变量将使其对当前用户可用。例如，要将新目录添加到PATH环境变量中，可以编辑~/.bashrc文件并添加以下行：

```sh
export PATH=$PATH:/path/to/new/directory
```

*   在~/.profile文件中添加环境变量将使其对当前用户可用。例如，要将新目录添加到PATH环境变量中，可以编辑~/.profile文件并添加以下行：

```sh
export PATH=$PATH:/path/to/new/directory
```

3.  区别：不同的方法具有不同的作用范围和永久性。

* 临时修改环境变量只在当前终端会话中有效，并且在关闭终端后被删除。

* 在/etc/environment文件中添加环境变量将使其对所有用户和进程都可用，并且在系统重启后仍然有效。

* 在/etc/profile文件中添加环境变量将使其对所有用户可用，并且在系统重启后仍然有效。

* 在~/.bashrc文件中添加环境变量将使其对当前用户可用，并且在用户注销后仍然有效。

* 在~/.profile文件中添加环境变量将使其对当前用户可用，并且在用户注销后仍然有效。

    

本文转自 [https://blog.csdn.net/qq\_43577613/article/details/130875690](https://blog.csdn.net/qq_43577613/article/details/130875690)，如有侵权，请联系删除。
