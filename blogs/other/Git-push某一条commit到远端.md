---
title: Git---本地仓库有多条commit,如何push某一条commit到远端
date: 2023-03-11
tags:
 - git
categories: 
 - git
sticky: 
   true
---

默认情况下
-------------------------------------------------------------

`git push`会推送暂存区所有提交（也即`HEAD`及其之前的提交），使用下面的命令可以改变此默认行为：

```sh
$ git push <remotename> <commit SHA>:<remotebranchname>
```

举例如下：

```sh
git push origin 248ed23e2:branchname
```

* * *

推送某一条提交：
-------------

### 第一种方式

即符合git操作的规则，从**最初的commit**开始一个一个提交，但是不能实现指定某一个commit,基本满足日常的开发异常情况了**（只能按顺序提交）**

图一

![](https://raw.githubusercontent.com/shug666/image/main/images/d61420705ce243819ac2b119bb22bb1b.png)

本地commit了3次提交但是并不想一下push到远程，根据功能或者时间的原因，想一个一个提交

 此时可以使用：

```sh
// 最下面的 一条为最老的一条，优先推送
git push origin 9267dd9:test  
// 接着第二条同样的命令，commit换掉即可
git push origin 9267dd9:test

// ... 依次按顺序一个一个提交...
```

### 第二种方式

采用cherry-pick用新分支去拉取当前分支的指定commit记录，之后推送到当前分支远程仓库实现推送指定历史提交的功能

**1. 创建临时分支**

```sh
// localbranch 为本地分支名  origin/feat 为远程目标分支
 git checkout -b  localbranch  --track origin/feat
```

**2.  执行cherry-pick，将修改bug的记录同步过来**

```sh
git cherry-pick fcf254130f
```

后续操作就是将临时分支记录推到目标分支！！！ 
