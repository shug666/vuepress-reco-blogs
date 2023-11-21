---
title: app的安装与卸载过程创建/删除的目录、文件和记录信息总结
date: 2022-12-10
tags:
 - android
categories: 
 - android
sticky: 
   true
---

apk本质上就是一个zip包

## 1\. Apk安装

常见的apk安装方式有三种:

1.  系统自带的应用和厂商预装的应用. 没错, 系统自带的应用其实也是apk, 其安装是在系统首次启动时完成的. 这也就是为什么root后可以卸载系统自带应用.没有安装界面.
2.  通过存储介质安装. 最常见的就是通过sd卡放置apk或者网上下载apk方式安装.通过 packageinstaller.apk来处理安装及卸载的过程的界面
3.  adb命令安装. 这应该是开发者最熟悉的安装方式了, 包括`adb install`和`adb pm install`.没有安装界面.

三种安装方式, 在安装apk时最终都是同一套流程, 即处理apk文件的流程. 安装过程可以归结为以下几个步骤:

1.  将apk文件拷贝到指定目录下. 系统应用是在`/system/app`, 第三方应用在`/data/app`下.
2.  解压apk, 拷贝文件. 创建UID, 创建`/data/data/${package_name}`目录, 设置权限. 这个就是应用的数据目录.
3.  从apk中提取dex, 放到`/data/dalvik-cache`目录.
4.  解析`AndroidManifest.xml`文件, 提取信息添加到`PMS`中, **更新PMS中相应的数据结构. 具体是, 将提取到的包信息更新到`/data/system/packages.list`和`/data/system/packages.xml`**.
5.  发送广播`Intent.ACTION_PACKAGE_ADDED`或者`Intent.ACTION_PACKAGE_REPLACED`. 从名字可以判断分别对应全新安装和覆盖安装.

Android中每个app都要一个`userId(UID)`的原因：Android在系统设计上把每个应用当做Linux系统上的一个用户对待,这样就可以利用已有的Linux用户管理机制来设计Android应用,比如应用目录/应用权限/应用进程管理等.

*   系统自带的以及厂商预装的app, 在手机首次启动时, 会通过扫描`/system/app` `/system/framework` `/vendor/app`等目录下面的APK文件, 完成安装. 原生系统没有`vendor`(供应商)目录.
*   至于通过`adb push`的方式, 如果root过, 完全可以推送到系统目录, 以系统应用的方式进行安装. 系统应用的好处是系统在启动的时候就会将apk进行解压复制, 坏处是没办法热更新等. 推送到一般目录, 则可以使用系统命令`/bin/pm`安装apk文件. `pm`就是一个可执行文件版的`PackageManager`. 最终调用`PackageManager.installPackage() -> PackageManagerService.installPacakge()`进行安装. 顺便一提, 具有`INSTALL_PACKAGES`权限就可以自己调用这个方法进行apk安装.

### 安装过程

扫描apk安装， 主要是`PackageManagerService`进行安装包扫描和解析工作. 信息解析完毕后存在特定数据结构中(`PackageParser.Package`), 此后需要进行信息同步工作. 这是因为, 扫描到的APK可能是已经更名的包/disable的包/需要升级的包/已经安装但签名冲突的包/替换了系统包的非系统包等情况, 需要处理这些情况, 保证最终信息正确.  
如果包需要进行`Rename`或者`Update`, 则需要签名比较.  
而使用`adb shell pm`安装略有不同, 是由`com.android.commands.pm.Pm`中的`runInstall`来安装的(`adb install`最终也是调用的`shell pm`).

### 核心函数scanPackageDirtyLI

系统最初调用`installPackageAsUser`检查是否有安装权限, 安装APK的整个过程在`PackageHandler`中进行, 主要分为 拷贝APK(检查是否有足够空间)->扫描APK->安装后处理(主要是发送广播信息), 其中最关键的一步就是扫描APK, 由函数`scanPackageLI`完成, 该函数里面调用`scanPackageDirtyLI`.  
`scanPackageDirtyLI()`源码位于`frameworks/base/services/core/java/com/android/server/pm/PackageManagerService.java`中（基于7.0源码）： 
参考http://blog.hjhjw1991.com/android/2018/01/02/Apk%E5%AE%89%E8%A3%85%E5%8D%B8%E8%BD%BD%E5%8E%9F%E7%90%86/

### 安装后的目录结构

| 目录 | 含义 |
| --- | --- |
| /system/app | 系统自带的应用程序,获得 root 权限才能删除 |
| /data/app | 第三方应用apk文件.安装时把apk文件复制到此目录 |
| /data/anr | 存放anr信息（/data/anr/traces.txt用于存放app ANR信息） |
| /data/data | 应用程序数据 |
| /data/data/${package\_name} | 特定应用程序数据目录 |
| /data/data/${package\_name}/cache | 临时文件，系统会自动清理 |
| /data/data/${package\_name}/databases | 数据库 |
| /data/data/${package\_name}/files | 一般文件 |
| /data/data/${package\_name}/shared\_pres | SharedPreference |
| /data/data/${package\_name}/lib | so文件 |
| /data/dalvik-cache | 存放odex文件.将apk中的dex文件安装到dalvik-cache目录下(dex文件是dalvik虚拟机的可执行文件,ART模式的可执行文件格式为.aot,启动ART时,系统会执行dex文件转换至aot文件) |
| /data/system/packages.list | 类似于Window的注册表,该文件是解析apk时由writeLP()创建的。记录了系统的permissons,以及解析apk的AndroidManifest获取的应用name,codePath,flag,ts,version,userid等信息。解析完apk后将更新信息写入这个文件并保存到flash,下次开机的时候直接从里面读取相关信息并添加到内存相关列表中.当有apk升级,安装或删除时会更新这个文件。 |
| /data/system/packages.xml | 指定应用的默认存储位置/data/data/com.xx.xx/package.xml中包含了该应用申请的权限,签名和代码所在的位置等信息系,并且两者都有同一个userld. |
| /data/user/0 | 软链接，指向/data/data |
| /data/user\_de/0/${package\_name} | 设备存储保护区，在快速启动模式可以访问这个文件夹 |
| /proc/cpuinfo | cpu信息 |
| /proc/smaps | 内存占用信息 |
| /sdcard | 软链接，最终指向/storage/emulated/0【跟Android版本和ROM版本有关】 |
| /storage/emulated/0 | 外部存储的根目录 |
| /storage/emulated/0/Android/data/${package\_name} | 应用的额外数据 |
| /system/app | 系统应用apk文件 |
| /system/lib | 系统应用so库 |

在`/data/data/包名`目录下，每个app都有自己的目录，目录名就是应用程序在`AndroidManifest.xml`文件中定义的包。每个应用程序的代码，对自己的目录是有绝对的控制权限的。在每个目录下，一般有如下几个子目录（结合上面的表格）：

*   databases : 存放数据库
*   cache : 存放缓存数据
*   files : 存放应用程序自己控制的文件
*   lib : 存放使用的包

### 总结：

在第三方app安装后，会创建的目录、文件以及记录的信息：

1.  拷贝的apk文件，位于`/data/app`下
2.  创建的app数据目录`/data/data/${package_name}`
3.  从apk中提取的dex文件，位于`/data/dalvik-cache`目录下
4.  `/data/system/packages.list`和`/data/system/packages.xml`中关于app的记录信息

另外，app在运行期间有可能会使用到外部存储目录`/storage/emulated/0/Android/data/${package_name}`，该目录只有在app运行时调用相关函数时才创建，app安装后不会创建的。

## 2\. Apk卸载

卸载是安装的逆过程, **删除在创建过程中三个路径下产生的文件夹**，以及有可能后面创建的外部存储目录`/storage/emulated/0/Android/data/${package_name}`。  
通过系统来卸载App通常是，点击卸载后，就会发送一个`Intent`给`UninstallerActivity`，在`UninstallerActivity`最后会启动`UninstallAppProgress`的`initView`方法，调用到`ApplicantPackageManger.java`的`deletePackage`方法，通过`Binder`绑定，其实是调用`PMS`中的`deletePackageAsUser`方法, 同样位于`/frameworks/base/services/core/java/com/android/server/pm/PackageManagerService.java`。  
源码参考：http://blog.hjhjw1991.com/android/2018/01/02/Apk%E5%AE%89%E8%A3%85%E5%8D%B8%E8%BD%BD%E5%8E%9F%E7%90%86/

卸载第三方app最后由`deleteInstalledPackageLI()`方法来完成，分两步走：

1.  第一步删除`/data/data`下面的数据目录，并从PMS的内部数据结构上清除当前卸载的package信息
    1.  `deleteInstalledPackageLI()`–>（表示调用，下同）`removePackageDataLI()`。`removePackageDataLI()`–>`removePackageLI()`–>mPackages的`remove()`：删除apk。`removePackageLI()`–>`cleanPackageDataStructuresLILPw()`：将package的`providers`、`services`、`receivers`、`activities`等信息去PMS的全局数据结构上移除。
    2.  `removePackageDataLI()`–>`removeDataDirsLI()`–>installd的`remove()`：删除目录`/data/data/${package_name}`
    3.  `removePackageDataLI()`–>`schedulePackageCleaning()`：安排清理动作。向`PackageHandler`发送`START_CLEANING_PACKAGE`消息，PMS会调用`ContainService`的函数去删除`/storage/sdcard0/Android/data`和`/storage/sdcard0/Android/media`下面与`package`相关的文件
    4.  `removePackageDataLI()`–>Settings的`removePackageLPw()`：首先从`mPackages`这个`map`中删除`PackageSettings`信息，即删除对应的`Package UID`信息
    5.  `removePackageDataLI()`–>`updatePermissionsLPw()`：检查`mPermissionTrees`和`mPermissions`两个数组中的权限是否是被删除的`Package`提供，如果有，则删除。
    6.  `removePackageDataLI()`–>Settings的`updateSharedUserPermsLPw()`：清除`sharedUser`不用的`gid`信息，防止权限泄露。
    7.  `removePackageDataLI()`–>Settings的`writeLPr()`：将修改的信息写到`Package.xml`中
2.  第二步就删除code和resource文件
    1.  分别构造`FileInstallArgs`和`AsecInstallArgs`来完成code和resource资源的清除
    2.  `FileInstallArgs`的`doPostDeleteLI()`–>`cleanUpResourcesLI()`–>`cleanUp()`：删除code、resource以及library文件
    3.  `cleanUpResourcesLI()`–>installd的`rmdex()`：删除存在`/data/dalvik-cache`文件

参考：  
[https://blog.csdn.net/xinsong1989/article/details/78527439](https://blog.csdn.net/xinsong1989/article/details/78527439)

[http://blog.hjhjw1991.com/android/2018/01/02/Apk%E5%AE%89%E8%A3%85%E5%8D%B8%E8%BD%BD%E5%8E%9F%E7%90%86/](http://blog.hjhjw1991.com/android/2018/01/02/Apk%E5%AE%89%E8%A3%85%E5%8D%B8%E8%BD%BD%E5%8E%9F%E7%90%86/)

[https://blog.csdn.net/hanfengzqh/article/details/82790896](https://blog.csdn.net/hanfengzqh/article/details/82790896)