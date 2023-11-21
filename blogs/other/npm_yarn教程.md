---
title: nodejs npm yarn安装及使用教程
date: 2022-08-14
tags:
 - nodejs
 - npm
 - yarn
categories: 
 - nodejs
 - npm
 - yarn
sticky: 
   true
---

## nodejs+npm的安装与配置

点击_[Node.js中文网](http://nodejs.cn/download/)_根据自身系统进行下载即可

检查环境变量和安装目录，win+R，输入cmd，获取node版本号

![在这里插入图片描述](https://img-blog.csdnimg.cn/64857159d6344184a330f7ca6b7421cc.png)

如果无法获取版本号，则在path添加环境变量为node的安装目录

npm是在nodejs下载安装后自带的工具，所以我们首先要了解npm的默认配置；第一步还是检查版本

![在这里插入图片描述](https://img-blog.csdnimg.cn/e2b26ca8355248f1a9ca1b0174041af8.png)

## npm相关配置

1.查看npm的配置文件及其配置

```
npm config ls -l 				#查看npm的所有配置信息
npm config get globalconfig		#获取全局配置文件的路径，默认不启用
npm config get userconfig		#获取用户配置文件的路径，默认启用
npm config get registry			#获取远程依赖包的下载地址
npm config get cache			#获取包缓存路径
npm config get prefix			#获取全局包的安装路径
npm config get proxy			#获取代理地址
```

2.修改默认配置

```
npm config list		#获取用户配置
npm config set prefix="D:\Program Files\nodejs\node_global" #设置全局包的下载路径
npm config set cache="D:\Program Files\nodejs\node_cache"	#设置缓存路径
npm config set registry=http://registry.npm.taobao.org/		#设置远程镜像地址
npm config set proxy="http://127.0.0.1:[代理端口号]"			#设置代理端口号
```

如果有些包下载不下来，比如我遇到过sass无法从github上下载下来，我们连接代理服务器并设置代理地址来下载

## 包下载、全局模块（尽量不要使用全局安装，避免依赖错误）

首先我们要了解公共模块和私有模块，公共模块顾名思义是公共的一个模块，该模块下的包可以被其他所有项目所使用，而私有的模块下的包，只应用在当前项目下。
![在这里插入图片描述](https://img-blog.csdnimg.cn/ba1ff1c513e643b7954fb5f0ab71319c.png)

```
npm install [模块名] [-g] 	#包安装，加上-g代表全局安装，不加则是当前文件夹下安装
```

为了让命令能在终端执行，我们需要在系统环境变量中添加该路径（D:\Program Files\nodejs\node_global）到系统环境Path中
![在这里插入图片描述](https://img-blog.csdnimg.cn/b64fbffee1bd4b2d96092cbfa0f82c73.png)

## win10下安装[node](https://so.csdn.net/so/search?q=node&spm=1001.2101.3001.7020)之后，[node](https://so.csdn.net/so/search?q=node&spm=1001.2101.3001.7020) -v正常，npm -v报错

**原因：node目录权限不够**

**找到node安装目录，右键属性，点击安全，设置users用户完全控制权限**

![img](https://img-blog.csdnimg.cn/aba2e7343a88411ab80bac63b0cc7575.bmp)

## yarn的安装

```
npm install -g yarn 
yarn --version
```

Yarn 设置淘宝源

```
yarn config set registry https://registry.npm.taobao.org -g 
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
```

## npm命令

```
// 查看 npm 全局安装过的包
npm list -g --depth 0
// 全局安装
npm install <package> -g
// 安装项目所有依赖
npm install
// 安装指定版本
npm install <package>@1.2.3
// 安装最新版本
npm i <package>@latest
// 删除全局的包
npm uninstall -g <package>
// 删除 node_modules 目录下面的包
npm uninstall <package>
// 更新指定包
npm update <package>
// 更新指定全局包
npm update -g <package>
// 更新本地安装的包
// 在 package.json 文件所在的目录中执行 npm update 命令
// 执行 npm outdated 命令。不应该有任何输出。
```

## yarn命令

```
// 查看 yarn 全局安装过的包
yarn global list --depth=0
// 全局安装
yarn global add <package>
// 安装所有依赖
yarn
// 安装指定版本
yarn add <package>@<version>
// 安装最新版本
yarn add <package>
// 删除包,会更新package.json和yarn.lock
yarn remove <package>
// 更新包
yarn upgrade
// 更新指定的包
yarn upgrade <package>
// 获取可更新的包列表选择更新
yarn upgrade-interactive --latest
// 更新全局依赖
yarn global upgrade --latest
// 更新全局依赖，有交互
yarn global upgrade-interactive --latest
// 列出已缓存的包
yarn cache list
// 查找缓存包的路径
yarn cache dir
// 清除缓存的包
yarn cache clean
```

## yarn的配置项

```
yarn config list // 显示所有配置项
yarn config get <key> //显示某配置项
yarn config delete <key> //删除某配置项
yarn config set <key> <value> [-g|--global] //设置配置项
```

