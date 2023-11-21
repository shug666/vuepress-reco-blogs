---
title: Git 补丁 —— diff 和 patch 使用详解
date: 2023-01-13
tags:
 - git
categories: 
 - git
sticky: 
   true
---

## patch 和diff 的区别

  Git 提供了两种补丁方案，一是用git diff生成的UNIX标准补丁.diff文件，二是git format-patch生成的Git专用.patch 文件。

*   diff文件只是记录文件改变的内容，不带有commit记录信息,多个commit可以合并成一个diff文件。
*   patch文件带有记录文件改变的内容，也带有commit记录信息,每个commit对应一个patch文件。

**在Git下，我们可以使用.diff文件也可以使用.patch 文件来打补丁，主要应用场景有：CodeReview、代码迁移等。**

## 创建patch和diff

### 创建patch 文件的常用命令行

* 某个提交的patch：  

  ```sh
  git format-patch 【commit sha1 id】 -1
  
  #例子：  
  
  git format-patch 2a2fb4539925bfa4a141fe492d9828d030f7c8a8 -1
  ```

* 某次提交（含）之前的几次提交：

  ```sh
  git format-patch 【commit sha1 id】-n
  
  n指从sha1 id对应的commit开始算起n个提交。  
  
  例子：  
  
  git format-patch 2a2fb4539925bfa4a141fe492d9828d030f7c8a8 -2
  ```

* 某两次提交之间的所有patch:  

  ```sh
  git format-patch 【commit sha1 id】..【commit sha1 id】
  
  #例子：  
  
  git format-patch 2a2fb4539925bfa4a141fe492d9828d030f7c8a8..89aebfcc73bdac8054be1a242598610d8ed5f3c8
  ```

### 创建diff文件的常用方法

**使用命令行**  

```sh
git diff 【commit sha1 id】 【commit sha1 id】 > 【diff文件名】  

#例子：  

git diff 2a2fb4539925bfa4a141fe492d9828d030f7c8a8 89aebfcc73bdac8054be1a242598610d8ed5f3c8 > patch.diff
```

应用patch 和 diff
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



### 1. 检查 patch/diff 文件：

> git apply --stat xxx.patch  

### 2.检查patch/diff是否能正常打入:

> `git apply --check 【path/to/xxx.patch】`  
>
> `git apply --check 【path/to/xxx.diff】`

### 3.打入patch/diff:

> `git apply 【path/to/xxx.patch】`  
>
> `git apply 【path/to/xxx.diff】`  
>
> 或者  
>
> `git am 【path/to/xxx.patch】`

冲突解决
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1. 执行命令 `git am xxxx.patch` 尝试直接打入补丁。因为我们使用的 patch 已经过时了，所以这一步肯定会报错并中断（注意，虽然命令停止执行了，但我们依然处于git am命令的运行环境中，可以通过git status命令查看到当前的状态）。

2. 执行命令 `git apply --reject xxxx.patch` 自动合入 patch 中不冲突的代码改动，同时保留冲突的部分。这些存在冲突的改动内容会被单独存储到目标源文件的相应目录下，以后缀为 .rej 的文件进行保存。比如对 ./test/someDeviceDriver.c 文件中的某些行合入代码改动失败，则会将这些发生冲突的行数及内容都保存在 ./test/someDeviceDriver.c.rej 文件中。我们可以在执行 git am 命令的目录下执行 find  -name  *.rej 命令以查看所有存在冲突的源文件位置。

3. 依据 步骤2 中生成的 *.rej 文件内容逐个手动解决冲突，然后删除这些 *.rej 文件。完成这一步骤的操作后，我们就可以继续执行 git am 的过程了。

4. 执行命令 `git status` 查看当前改动过的以及新增的文件，确保没有多添加或少添加文件。

5. 执行命令 git  add . 将所有改动都添加到暂存区（注意，关键字add后有一个小数点 . 作为参数，表示当前路径）。

6. 执行命令 `git am --resolved` 或`git am --continue`继续 步骤1 中被中断的 patch 合入操作。合入完成后，会有提示信息输出。可以执行git am --skip跳过此次冲突，也可以执行git am --abort回退打入patch的动作，还原到操作前的状态。  
7. 执行命令 `git log` 确认合入状态。

## 包含二进制文件时的diff和apply

> git diff HEAD^..HEAD --binary > foobar.patch