---
title: Git使用及命令清单
date: 2022-08-14
---

# 常用 Git 命令清单

<a data-fancybox title="image-20220813224219987.png" href="https://s2.loli.net/2022/08/13/eBUG6DbCL8c9M2x.png">![image-20220813224219987.png](https://cdn.jsdelivr.net/gh/shug666/image/images/eBUG6DbCL8c9M2x.png)</a>

下面是我整理的常用 Git 命令清单。几个专用名词的译名如下。

​				1.Workspace：工作区

​				2.Index / Stage：暂存区

​				3.Repository：仓库区（或本地仓库）

​				4.Remote：远程仓库

## **一、新建代码库**

```bash
# 在当前目录新建一个Git代码库
$ git init

# 新建一个目录，将其初始化为Git代码库
$ git init [project-name]

# 下载一个项目和它的整个代码历史
$ git clone [url]
```

## 二、配置

Git的设置文件为`.gitconfig`，它可以在用户主目录下（全局配置），也可以在项目目录下（项目配置）。

```bash

# 显示当前的Git配置
$ git config --list

# 编辑Git配置文件
$ git config -e [--global]

# 设置提交代码时的用户信息
$ git config [--global] user.name "[name]"
$ git config [--global] user.email "[email address]"
```

## 三、增加/删除文件

```bash

# 添加指定文件到暂存区
$ git add [file1] [file2] ...

# 添加指定目录到暂存区，包括子目录
$ git add [dir]

# 添加当前目录的所有文件到暂存区
$ git add .

# 添加每个变化前，都会要求确认
# 对于同一个文件的多处变化，可以实现分次提交
$ git add -p

# 删除工作区文件，并且将这次删除放入暂存区
$ git rm [file1] [file2] ...

# 停止追踪指定文件，但该文件会保留在工作区
$ git rm --cached [file]

# 改名文件，并且将这个改名放入暂存区
$ git mv [file-original] [file-renamed]
```



## 四、代码提交

```bash
# 提交暂存区到仓库区
$ git commit -m [message]

# 提交暂存区的指定文件到仓库区
$ git commit [file1] [file2] ... -m [message]

# 提交工作区自上次commit之后的变化，直接到仓库区
$ git commit -a

# 提交时显示所有diff信息
$ git commit -v

# 使用一次新的commit，替代上一次提交
# 如果代码没有任何新变化，则用来改写上一次commit的提交信息
$ git commit --amend -m [message]

# 重做上一次commit，并包括指定文件的新变化
$ git commit --amend [file1] [file2] ...
```

## 五、分支

```bash
# 列出所有本地分支
$ git branch

# 列出所有远程分支
$ git branch -r

# 列出所有本地分支和远程分支
$ git branch -a

# 新建一个分支，但依然停留在当前分支
$ git branch [branch-name]

# 新建一个分支，并切换到该分支
$ git checkout -b [branch]

# 新建一个分支，指向指定commit
$ git branch [branch] [commit]

#下拉远程分支并切换至该分支
$ git checkout --track [remote-branch]

# 新建一个分支，与指定的远程分支建立追踪关系
$ git branch --track [branch] [remote-branch]

# 切换到指定分支，并更新工作区
$ git checkout [branch-name]

# 切换到上一个分支
$ git checkout -

# 建立追踪关系，在现有分支与指定的远程分支之间
$ git branch --set-upstream [branch] [remote-branch]

# 合并指定分支到当前分支
$ git merge [branch]

# 选择一个commit，合并进当前分支
$ git cherry-pick [commit]

# 删除分支
$ git branch -d [branch-name]

# 删除远程分支
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]

```

## 六、标签

```bash
# 列出所有tag
$ git tag

# 新建一个tag在当前commit
$ git tag [tag]

# 新建一个tag在指定commit
$ git tag [tag] [commit]

# 删除本地tag
$ git tag -d [tag]

# 删除远程tag
$ git push origin :refs/tags/[tagName]

# 查看tag信息
$ git show [tag]

# 提交指定tag
$ git push [remote] [tag]

# 提交所有tag
$ git push [remote] --tags

# 新建一个分支，指向某个tag
$ git checkout -b [branch] [tag]
```

## 七、查看信息

```bash
# 显示有变更的文件
$ git status

# 显示当前分支的版本历史
$ git log

# 显示commit历史，以及每次commit发生变更的文件
$ git log --stat

# 搜索提交历史
$ git log --grep=<提交信息>

# 显示某个commit之后的所有变动，每个commit占据一行
$ git log [tag] HEAD --pretty=format:%s

# 显示某个commit之后的所有变动，其"提交说明"必须符合搜索条件
$ git log [tag] HEAD --grep feature

# 显示某个文件的版本历史，包括文件改名
$ git log --follow [file]
$ git whatchanged [file]

# 显示指定文件相关的每一次diff
$ git log -p [file]

# 显示过去5次提交
$ git log -5 --pretty --oneline

# 显示所有提交过的用户，按提交次数排序
$ git shortlog -sn

# 显示指定文件是什么人在什么时间修改过
$ git blame [file]

# 显示暂存区和工作区的差异
$ git diff

# 显示暂存区和上一个commit的差异
$ git diff --cached [file]

# 显示工作区与当前分支最新commit之间的差异
$ git diff HEAD

# 显示两次提交之间的差异
$ git diff [first-branch]...[second-branch]

# 显示今天你写了多少行代码
$ git diff --shortstat "@{0 day ago}"

# 显示某次提交的元数据和内容变化
$ git show [commit]

# 显示某次提交发生变化的文件
$ git show --name-only [commit]

# 显示某次提交时，某个文件的内容
$ git show [commit]:[filename]

# 显示当前分支的最近几次提交
$ git reflog
```

## 八、远程同步

```bash
# 下载远程仓库的所有变动
$ git fetch [remote]

# 显示所有远程仓库
$ git remote -v

# 显示某个远程仓库的信息
$ git remote show [remote]

# 增加一个新的远程仓库，并命名
$ git remote add [shortname] [url]

# 拉取远程分支并与本地分支合并
$ git pull [remote] [远程branch:本地branch]			#本地branch可省略，代表当前分支

# 上传本地指定分支到远程仓库
$ git push [remote] [branch]

# 强行推送当前分支到远程仓库，即使有冲突
$ git push [remote] --force

# 推送所有分支到远程仓库
$ git push [remote] --all

# 更新远程分支
git remote update origin --p
```

## 九、撤销

```bash
# 撤销file文件工作区的修改，恢复到暂存区的状态
$ git checkout [file]		#也可用 git restore [file]

# 恢复某个commit的指定文件到暂存区和工作区
$ git checkout [commit] [file]

# 撤销所有工作区的修改，恢复到暂存区的状态
$ git checkout .

# 丢弃暂存区的修改
$ git reset [file]		#也可用 git restore --staged [file]

# 重置暂存区与工作区，与上一次commit保持一致
$ git reset --hard

# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
$ git reset [commit]

# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
$ git reset --hard [commit]

# 重置当前HEAD为指定commit，但保持暂存区和工作区不变
$ git reset --keep [commit]

# 新建一个commit，用来撤销指定commit
# 后者的所有变化都将被前者抵消，并且应用到当前分支
$ git revert [commit]

# 暂时将未提交的变化移除，稍后再移入
$ git stash
$ git stash pop
```

## Git pull 强制拉取并覆盖本地代码（与git远程仓库保持一致）

第一个是：拉取所有更新，不同步；
第二个是：本地代码同步线上最新版本(会覆盖本地所有与远程仓库上同名的文件)；
第三个是：再更新一次（其实也可以不用，第二步命令做过了其实）

```bash
git fetch --all
git reset --hard origin/master
git pull
```

## 查看修改远程地址

深圳地址 58.250.251.47:20111			武汉地址 162.168.0.245

```sh
cat .git/config
#武汉地址
ssh://git@162.168.0.245/rtk2816a
#深圳地址
ssh://mgr023@58.250.251.47:20111/rtk2816a
```

<a data-fancybox title="image.png" href="https://s2.loli.net/2022/08/17/wNaK2qUrol4emEf.png">![image.png](https://cdn.jsdelivr.net/gh/shug666/image/images/wNaK2qUrol4emEf.png)</a>

## 提交修改流程

我们在修改文件之前一定要用git checkout XXX切换到我们要修改的分支。修改之后，我们通过以下步骤提交修改

1.git pull [origin] [远程分支名] 首先进行下拉代码，并与本地的代码合并。避免漏掉在此期间有他人推送的新文件或者修改的文件（此时如果修改了同一个文件会提示错误信息）。

<a data-fancybox title="image-20220818154554911" href="https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220818154554911.png">![image-20220818154554911](https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220818154554911.png)</a>

2.可使用git status 或者git diff 查看自己在分支上的修改文件。

3.git add . 添加需要提交的文件。

4.git commit -m “修改说明” 添加修改注释。

5.在push提交服务器之前还需重新走第2步使用pull拉取代码（如果在第二步时有错误），这时就会提示有文件合并时冲突了，解决文件冲突后，就可add添加并commit提交重复此步骤直至无冲突。

<a data-fancybox title="image-20220818154659710" href="https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220818154659710.png">![image-20220818154659710](https://cdn.jsdelivr.net/gh/shug666/image/images/image-20220818154659710.png)</a>

## 设置别名

```sh
cd ~ #进入根目录
vim .gitconfig  #编辑.gitconfig文件里面设置别名

#直接使用命令查看
git config --list | grep alias
#查询log的小技巧
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) &C(bold blue)<%an>%Creset' --abbrev-commit"
公司使用的lg
log --color --graph --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'%C(bold red) %h%Creset %C(bold yellow)<%an>%Creset %C(bold green)(%cd) %C(yellow)%d%Creset %s '  --abbrev-commit

取消别名：
git config --global --unset alias.br
```

## 配置SSH公钥

```sh
ssh-keygen -t rsa
不断回车 如果公钥已经存在，则自动覆盖

cat ~/.ssh/id_rsa.pub 查看公钥
```

## patch文件的生成和应用

### patch 和diff 的区别

  Git 提供了两种补丁方案，一是用git diff生成的UNIX标准补丁.diff文件，二是git format-patch生成的Git专用.patch 文件。

*   diff文件只是记录文件改变的内容，不带有commit记录信息,多个commit可以合并成一个diff文件。
*   patch文件带有记录文件改变的内容，也带有commit记录信息,每个commit对应一个patch文件。

**在Git下，我们可以使用.diff文件也可以使用.patch 文件来打补丁，主要应用场景有：CodeReview、代码迁移等。**

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

### 应用patch 和 diff

#### 1. 检查 patch/diff 文件：

> git apply --stat xxx.patch  

#### 2.检查patch/diff是否能正常打入:

> `git apply --check 【path/to/xxx.patch】`  
>
> `git apply --check 【path/to/xxx.diff】`

#### 3.打入patch/diff:

> `git apply 【path/to/xxx.patch】`  
>
> `git apply 【path/to/xxx.diff】`  
>
> 或者  
>
> `git am 【path/to/xxx.patch】`

### 冲突解决

1. 执行命令 `git am xxxx.patch` 尝试直接打入补丁。因为我们使用的 patch 已经过时了，所以这一步肯定会报错并中断（注意，虽然命令停止执行了，但我们依然处于git am命令的运行环境中，可以通过git status命令查看到当前的状态）。

2. 执行命令 `git apply --reject xxxx.patch` 自动合入 patch 中不冲突的代码改动，同时保留冲突的部分。这些存在冲突的改动内容会被单独存储到目标源文件的相应目录下，以后缀为 .rej 的文件进行保存。比如对 ./test/someDeviceDriver.c 文件中的某些行合入代码改动失败，则会将这些发生冲突的行数及内容都保存在 ./test/someDeviceDriver.c.rej 文件中。我们可以在执行 git am 命令的目录下执行 find  -name  *.rej 命令以查看所有存在冲突的源文件位置。

3. 依据 步骤2 中生成的 *.rej 文件内容逐个手动解决冲突，然后删除这些 *.rej 文件。完成这一步骤的操作后，我们就可以继续执行 git am 的过程了。

4. 执行命令 `git status` 查看当前改动过的以及新增的文件，确保没有多添加或少添加文件。

5. 执行命令 git  add . 将所有改动都添加到暂存区（注意，关键字add后有一个小数点 . 作为参数，表示当前路径）。

6. 执行命令 `git am --resolved` 或`git am --continue`继续 步骤1 中被中断的 patch 合入操作。合入完成后，会有提示信息输出。可以执行git am --skip跳过此次冲突，也可以执行git am --abort回退打入patch的动作，还原到操作前的状态。  
7. 执行命令 `git log` 确认合入状态。

### 包含二进制文件时的diff和apply

> git diff HEAD^..HEAD --binary > foobar.patch

## git blame用法

git blame用来追溯一个指定文件的历史修改记录。它能显示任何文件中每行最后一次修改的提交记录。 所以，如果你在代码中看到有一个bug，你可以使用 git blame 标注这个文件，查看哪一次提交引入了这行。

命令用法：

```sh
git blame filename
git blame -L 69,82 Makefile		#查看Makefile这个文件第69--82行最近一次的修改记录
```

可以使用 -L 指定文件的行数范围：

```sh
git blame -L n1,n2 filename
```

git blame的具体显示格式是：

```
commit ID  (代码提交作者  提交时间  代码位于文件中的行数)  实际代码
```

第一列是commit id；接下来是提交人、提交时间、代码位于文件中的行数、实际代码。注意一下 `^1da177e4c3f4` 这个提交的几行，其中的前缀 ^ 指出了该文件自第一次提交后从未修改的那些行。

## 多个commit合并

![image-20221210093832699](https://raw.githubusercontent.com/shug666/image/main/images/image-20221210093832699.png)

找到最早要合并的提交id的父commit-id。

```sh
git rebase -i commit-id //(commit-id是需要合并的提交中最早的提交的前一个id)
```

接着会出现pick xxx将第二个及后面的pick（提交）关键词改成s（合并），也可删除commit，最后整理几个提交日志为一个日志。

最后推送到远端
push到远端时远端仓库会提示冲突。因为之前已经推过到远端了，如果没有推过，本地直接推即可，如果要合并几个远程提交，可能会提示合并git pull xxx，千万不要这么做，直接强制提交即可。

```sh
git push -f 或 git push origin xxx/xxx -f
```

## git pull –rebase

![](https://raw.githubusercontent.com/shug666/image/main/images/20221210093155.png)

这个命令做了以下内容：

1. 把你 [commit](https://so.csdn.net/so/search?q=commit&spm=1001.2101.3001.7020) 到本地仓库的内容，取出来放到暂存区(stash)（这时你的工作区是干净的）
2. 然后从远端拉取代码到本地，由于工作区是干净的，所以不会有冲突
3. 从暂存区把你之前提交的内容取出来，跟拉下来的代码合并

**所以 rebase 在拉代码前要确保你本地工作区是干净的，如果你本地修改的内容没完全 commit 或者 stash，就会 rebase 失败。**

## git stash详解

```bash
#能够将所有未提交的修改（工作区和暂存区）保存至堆栈中，用于后续恢复当前工作目录。
$ git stash

# 作用等同于git stash，区别是可以加一些注释
$ git stash save

#查看当前stash中的内容
$ git stash list 

#将当前stash中的内容弹出，并应用到当前分支对应的工作目录上。
#注：该命令将堆栈中最近保存的内容删除（栈是先进后出）
$ git stash pop

#将堆栈中的内容应用到当前目录，不同于git stash pop，该命令不会将内容从堆栈中删除，也就说该命令能够将堆栈的内容多次应用到工作目录中，适应于多个分支的情况。
#堆栈中的内容并没有删除。
#可以使用git stash apply + stash名字（如stash@{1}）指定恢复哪个stash到当前的工作目录。
$ git stash apply

# 从堆栈中移除某个指定的stash
$ git stash drop + 名称

#清除堆栈中的所有 内容
$ git stash clear

#查看堆栈中最新保存的stash和当前目录的差异。
$ git stash show stash@{1}查看指定的stash和当前目录差异。
#通过 git stash show -p 查看详细的不同：
#同样，通过git stash show stash@{1} -p查看指定的stash的差异内容。
$ git stash show

#从最新的stash创建分支。
#应用场景：当储藏了部分工作，暂时不去理会，继续在当前分支进行开发，后续想将stash中的内容恢复到当前工作目录时，如果是针对同一个文件的修改（即便不是同行数据），那么可能会发生冲突，恢复失败，这里通过创建新的分支来解决。可以用于解决stash中的内容和当前目录的内容发生冲突的情景。
#发生冲突时，需手动解决冲突。
$ git stash branchs

# stash单个文件temp.c命令：
$ git stash push temp.c

#push 和 备注同时使用
$ git stash push -m "message" /test /tes2
```

## push某一条commit到远端

### 默认情况下

`git push`会推送暂存区所有提交（也即`HEAD`及其之前的提交），使用下面的命令可以改变此默认行为：

```sh
$ git push <remotename> <commit SHA>:<remotebranchname>
```

举例如下：

```sh
git push origin 248ed23e2:branchname
```

* * *

### 推送某一条提交：

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

## gitignore忽略文件

在 `.gitignore` 文件中，可以指定哪些文件或目录应该被 Git 忽略，这样 Git 就不会追踪这些文件或目录的变化。如果你想让 Git 忽略某个特定的目录，你可以按照以下步骤操作：

### 添加gitignore 文件

打开你的项目根目录下的 .gitignore 文件，并在其中添加你想要忽略的目录的路径。例如，如果你想忽略名为 logs 的目录，你可以这样写：

`logs/`，确保目录路径后面有一个斜杠`（/）`，这表示这是一个目录，而不是一个文件。

- **忽略单个文件**：直接在`.gitignore`文件中写入文件名即可。
- **忽略目录**：在文件名后加上斜杠`/`表示忽略该目录及其所有内容。
- **忽略特定类型的文件**：使用星号`*`作为通配符。例如，`*.log`会忽略所有`.log`文件。
- **忽略特定路径下的文件**：在规则前加上路径。例如，`/temp/*`会忽略根目录下temp目录中的所有文件。

### `.gitignore`文件的规则匹配优先级

1. **精确匹配**：如果`.gitignore`文件中存在精确匹配的文件名或目录名，则这些文件或目录会被忽略。
2. **前缀匹配**：如果规则以斜杠`/`开头，则表示从仓库根目录开始匹配。
3. **目录匹配**：如果规则以斜杠`/`结尾，则表示忽略该目录及其所有内容。
4. **通配符匹配**：使用`*`、`?`和`[]`等通配符进行匹配。
5. **否定规则**：在规则前加上`!`表示否定，即不忽略匹配的文件或目录。但需要注意的是，否定规则不会使已经被父目录规则忽略的文件重新被跟踪。

### `.gitignore`文件的配置示例

```bash
# 忽略构建产物目录
/build/
/dist/

# 忽略日志文件
*.log

# 忽略操作系统特定的文件
.DS_Store
Thumbs.db

# 忽略临时文件
*.tmp
*.swp

# 忽略IDE配置文件
/.idea/
/.vscode/
*.iml

# 忽略node_modules目录（对于Node.js项目）
/node_modules/

# 忽略package-lock.json文件（对于Node.js项目）
package-lock.json

```

### 如何应用`.gitignore`文件规则

- **新文件**：对于新创建的文件，如果它们符合`.gitignore`文件中的规则，则不会被Git跟踪。
- **已跟踪文件**：对于已经被Git跟踪的文件，即使它们符合`.gitignore`文件中的规则，也不会被自动忽略。你需要手动从Git的索引中删除这些文件（使用`git rm --cached <文件>`），然后提交更改。
- **全局`.gitignore`文件**：除了仓库级别的`.gitignore`文件外，你还可以配置全局`.gitignore`文件来忽略所有Git仓库中的某些文件。这通常通过Git配置命令来实现（例如，`git config --global core.excludesfile <全局.gitignore文件路径>`）。

### 检查

添加完 `.gitignore` 规则后，你可以通过以下命令来检查某个文件或目录是否被正确忽略：

`git check-ignore -v logs/`

## gc命令详解

git gc 是 Git 的一个垃圾回收命令，用于优化和清理本地仓库。Git 仓库在长期使用过程中会产生大量不再使用的对象、无效的引用等，这些都可能影响仓库的性能和大小。通过执行 git gc，Git 会自动执行一系列清理操作，压缩历史对象、删除不再使用的对象，并合并较小的对象，从而减少仓库的体积和提升性能。

具体来说，git gc 会执行以下操作：

- 压缩对象文件：将多个小的对象文件合并为一个较大的文件，减少文件系统的碎片化。
- 清理无用的引用：删除已经合并、被丢弃或被删除的分支的引用。
- 删除 dangling objects：清除悬挂对象（如没有被引用的提交、树或文件）。
- git gc 可以定期执行，也可以在 Git 仓库出现性能下降时手动执行

**仓库过大**：如果 Git 仓库的体积变得非常庞大，可以使用 `git gc` 来压缩和清理不必要的对象，减小仓库的大小。

```bash
git gc
```

### 命令的常用选项及参数

Git 提供了多个选项来定制 `git gc` 的行为，以下是一些常见的选项：

#### `--aggressive`

```bash
git gc --aggressive
```

该选项会执行更深入的垃圾回收操作，花费更多时间来进一步压缩和优化对象文件。适用于希望最大程度优化仓库的情况，通常在仓库非常庞大的时候使用。

#### `--prune=<date>`

```bash
git gc --prune=now
```

该选项用于删除自指定日期以来没有被引用的对象。now 表示删除所有悬挂的对象，`<date>` 可以使用相对日期（如 2.weeks.ago）来指定。

例如，要删除 2 周之前的无用对象，可以使用：

```bash
git gc --prune=2.weeks.ago
```

#### `--quiet`

```bash
git gc --quiet
```

此选项用于减少输出信息，只显示必要的警告或错误信息。如果希望在后台运行并且不看到过多日志时，使用此选项非常合适

#### `--auto`

```bash
git gc --auto
```

当 Git 检测到需要垃圾回收时，`--auto` 会自动触发回收，而无需手动执行。此选项通常用于 Git 在后台自动执行垃圾回收时使用。

### 命令的进阶用法

#### 使用 git gc 与其他 Git 优化命令结合

git gc 可以与 git fsck 等命令结合使用，以确保仓库在执行垃圾回收后的完整性和一致性。

```bash
git fsck --full
git gc --aggressive
```

解释：git fsck 检查仓库的完整性和一致性，确保没有坏的对象和引用；之后执行 git gc --aggressive 进一步优化仓库。

#### 自定义垃圾回收配置

Git 允许用户通过配置文件定制垃圾回收行为，例如，通过修改 .gitconfig 文件中的以下设置：

```bash
    auto = 1
    aggressive = true
    pruneExpire = 2.weeks.ago
```

### 命令的常见问题与解答

#### 问题 1：git gc 后仓库变慢了？

解答：通常来说，`git gc` 旨在提升性能。如果回收后仓库变慢了，可能是由于回收过程不完全或仓库中存在大量的小文件。尝试使用 git gc --aggressive 来优化。如果问题依然存在，考虑检查仓库的硬件或文件系统性能。

#### 问题 2：`git gc` 是否会删除重要的历史记录？

解答：git gc 不会删除重要的历史记录。它只会清理无用的对象和引用，不影响仓库的有效数据。如果你担心丢失数据，可以在执行 git gc 前进行备份。

#### 问题 3：如何避免自动执行垃圾回收？

解答：Git 会根据仓库的大小自动触发垃圾回收。如果希望禁用此功能，可以通过以下命令设置：

```bash
git config --global gc.auto 0
```

### 总结与建议

`git gc` 是一个非常实用的 Git 命令，用于清理和优化本地仓库。通过定期使用 git gc，你可以保持仓库的健康和性能。对于大型仓库，使用 --aggressive 选项来进行更深入的优化。如果你的仓库已经过度膨胀，或者频繁出现性能瓶颈，执行 `git gc` 是一个非常有效的解决方案。

### 最佳实践建议：

定期执行 git gc，特别是在长期开发后的仓库。
结合 `git gc` 与 `git fsck`，确保仓库的完整性和健康。
如果仓库过大，尝试使用 `--aggressive` 来最大化优化。
使用 `--prune` 定期清理不再使用的对象，减小仓库体积。
通过这些方法，你可以有效地管理你的 Git 仓库，提升开发效率和仓库性能。

彻底清除

### 彻底清除
```bash
# 强制删除Git保存的原始引用备份
rm -rf .git/refs/original/

# 立即让所有引用日志（reflog）条目过期
git reflog expire --expire=now --all

# 检查仓库完整性并列出所有不可达对象
git fsck --full --unreachable

# 重新打包对象以优化存储
git repack -A -d

# 彻底清理仓库并立即删除冗余数据
git gc --aggressive --prune=now
```

> `https://blog.csdn.net/leslie3350/article/details/144792889`

### 清理工作树和索引

加快git的速度，但会失去所有索引，需要手动添加对应文件/路径，否则合并会冲突

`git rm -r --cached .`  # 如果需要重新扫描所有文件状态的话
