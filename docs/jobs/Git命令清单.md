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

## 补丁文件的生成和应用

```sh
git format-patch  你的commit对应的id #生成补丁

git apply --stat 0001-limit-log-function.patch  # 查看patch的情况

git apply --check 0001-limit-log-function.patch # 检查patch是否能够打上，如果没有任何输出，则说明无冲突，可以打上

git am --signoff < 0001-add-liuxiansong.patch	# 打补丁
-----------------------------------------------
git diff > text.patch
```

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
