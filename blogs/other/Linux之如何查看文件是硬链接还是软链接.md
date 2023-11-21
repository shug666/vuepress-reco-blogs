---
title: Linux之 如何查看文件是`硬链接`还是`软链接`
date: 2023-08-11
tags:
 - linux命令
categories: 
 - linux命令
sticky: 
   true
---

Linux之 如何查看文件是`硬链接`还是`软链接`
-------------------------------------------------------------------------------------

可以用 `ll 文件名` 查看文件属性  

以`l`开头的是软链接 , 相当于快捷方式  

以`-`开头的是硬链接

## 例子

1.  创建一个文件名为"hello" `touch hello`
2.  创建一个file的软链接 `ln -s hello 软链接`
3.  创建一个file的硬链接 `ln hello 硬链接` 或 `link hello 硬链接`
4.  用`ll`或`ls -l`查看

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/1c840cc978d9402f83aabf363c197460.png)

```sh
cd ~
rm -rf 软硬链接测试
mkdir 软硬链接测试
cd 软硬链接测试
touch hello
ln -s hello hello的软链接
ln hello hello的硬链接
ll
```

## 创建硬链接软链接

### 创建软连接 

```sh
# 创建软连接
ln -s 源文件 软链接名
```

### 创建硬连接 

```sh
# 创建硬连接
ln 源文件 硬链接名
```
```sh
# 创建硬连接
link 源文件 硬链接名
```

**`link`只能创建硬链接 , `ln`软硬都可以**

## `ln`的说明

```sh
用法：ln [选项]... [-T] 目标 链接名
　或：ln [选项]... 目标
　或：ln [选项]... 目标... 目录
　或：ln [选项]... -t 目录 目标...
在第一种格式中，创建具有指定链接名且指向指定目标的链接。
在第二种格式中，在当前目录创建指向目标位置的链接。
在第三、四种格式中，在指定目录中创建指向指定目标的链接。
默认创建硬链接，当使用--symbolic 时创建符号链接。
默认情况下，创建每个目标时不应存在与新链接的名称相同的文件。
创建硬链接时，每个指定的目标都必须存在。符号链接可以指向任意的位置；
当链接解析正常时，将其解析为一个相对于其父目录的相对链接。

必选参数对长短选项同时适用。
      --backup[=CONTROL]      为每个已存在的目标文件创建备份文件
  -b                          类似--backup，但不接受任何参数
  -d, -F, --directory         允许超级用户尝试创建指向目录的硬链接
                              （注意：此操作可能因系统限制而失败）
  -f, --force                 强行删除任何已存在的目标文件
  -i, --interactive           prompt whether to remove destinations
  -L, --logical               dereference TARGETs that are symbolic links
  -n, --no-dereference        treat LINK_NAME as a normal file if
                                it is a symbolic link to a directory
  -P, --physical              make hard links directly to symbolic links
  -r, --relative              with -s, create links relative to link location
  -s, --symbolic              make symbolic links instead of hard links
  -S, --suffix=后缀           自行指定备份文件的后缀
  -t, --target-directory=目录  在指定的目录中创建链接
  -T, --no-target-directory   总是将给定的链接名当作普通文件
  -v, --verbose               列出每个链接的文件名称
      --help		显示此帮助信息并退出
      --version		显示版本信息并退出

```

##   查看硬链接数量

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/b9bed82d5d534d55b7e0ac36a3f65a25.jpeg)

![添加硬链接,查看硬链接数](https://raw.githubusercontent.com/shug666/image/main/images/7fcd504c57ff44da93242edd45a320c1.png)

硬链接除了名称,其它信息都相同, 没法区分

硬链接除了名称和位置,其它信息都相同, 包括日期, 没法区分  

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/7abec417a7194fc6a6b7fb60b3e4af4a.png)

  

## 软连接可以凭空创建, 硬链接不可以

![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/cd9380e498544b86acd5dc4eeb3551b3.png)

 

  

本文转自 [https://blog.csdn.net/kfepiza/article/details/126654350](https://blog.csdn.net/kfepiza/article/details/126654350)，如有侵权，请联系删除。