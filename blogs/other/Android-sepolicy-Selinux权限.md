---
title: Android sepolicy Selinux权限
date: 2023-08-14
tags:
 - android
categories: 
 - android
sticky: 
   true
---

安全增强型 Linux（Security-Enhanced Linux）简称 SELinux，它是 Linux 的一个安全子系统。SELinux 主要作用是最大限度地减小系统中服务进程可访问的资源（最小权限原则）。

其实就是说，在没有添加权限的情况下，任何东西都是无法访问的。它通过主体和客体的安全上下文，定义主体是否有权限访问客体。  

主体就是我们的进程，客体是一切可访问的对象。  

Selinux中所有的文件都赋予一个type的类型标签，对于所有的进程也赋予domain的标签。domain标签能够执行的操作由安全策略（.te文件）里定义

## SELinux 模式

SELinux 有三种工作模式，分别为:  

1. enforcing: 强制模式, 执行SELinux规则, 违反的行为会被阻止  
2. permissive: 宽容模式, 执行SELinux规则, 违反的行不会被阻止  
3. disabled: 关闭SELinux  

通过执行getenforce命令可以获取当前SELinux的工作模式。

在工厂版本，通常需要permissive模式（当然需要研发人为修改），在permissive模式下，尽管log中仍会打印avc: denied，但是实际上不会对程序有任何影响，只是打印log。当然在enforcing模式下，如果我们的程序访问某个文件结果发现Permission denied，并且周围有打印avc: denied，那么就需要研发人员去解决问题了，解决问题的思路待会儿再说。  

当然，为了搞清楚是否因为SELinux导致的问题，可以用getenforce命令将SELinux工作模式临时改为permissive模式看问题是否解决, 来判定是否是SELinux引起的问题.。

规则
--

我们刚刚说过了，Selinux中所有的文件都赋予一个type的类型标签，对于所有的进程也赋予domain的标签。domain标签能够执行的操作由安全策略（.te文件）里定义

那怎么看文件的type标签呢？  

我们可能都用过ls -al -Z命令

![](https://raw.githubusercontent.com/shug666/image/main/images/23941061-00e3d497b5290ad6.png)

红框里面圈出来的，就是每个文件的type。  

这些type会在.te文件里定义  

如下：

![](https://raw.githubusercontent.com/shug666/image/main/images/23941061-bba4e85f7193ff99.png)

而某个文件属于什么type又是怎么定义的呢？可以使用 file\_contexts 和 genfscon 进行标记，当然二者还是有区别的，有些文件可能只能用 file\_contexts，有些可能只能用genfscon ，需要具体问题具体分析，最简单的办法就是看其他类似的文件用哪种方法标记的的，如下所示：

![](https://raw.githubusercontent.com/shug666/image/main/images/23941061-1d961ee2f811c92d.png)

  

![](https://raw.githubusercontent.com/shug666/image/main/images/23941061-1477db3adc19cc76.png)

基本问题解决
------

以下面这个avc报错为例子  

avc: denied { write } for path="/dev/block/vold/93:96" dev="tmpfs" ino=1263 scontext=u:r:kernel:s0 tcontext=u:object\_r:block\_device:s0 tclass=blk\_file permissive=0

### 1.添加allow规则

#### 方案一：手动写allow

我们要解决这个问题，需要先搞懂这句log的意思。  

下面是这句log的分析  

缺少什么权限： { write }权限，  

谁缺少权限： scontext=u:r:kernel:s0 也就是主体，我们的程序  

对哪个文件缺少权限：tcontext=u:object\_r:block\_device 也就是客体，我们要访问的文件或者别的什么的type  

什么类型的文件： tclass=blk\_file  

完整的意思： kernel进程对block\_device类型的blk\_file缺少write权限。  

所以我们就要像下面这样，把这一行添加到对应的位置，一般是添加到主体的te文件里去，在这里例子上应该添加到kernel.te文件里  

allow kernel block\_device:blk\_file write;

#### 方案二：用工具audit2allow自动生成allow

Ubuntu终端下输入audit2allow，如果没有按照提示安装即可。当然每个android项目里也会有audit2allow的bin文件，自己找一下目录也可  

用法：

1. adb logcat | grep avc，把报权限问题有关的log放在一个文档中，例如avc.txt

2.  终端输入audit2allow -i 文档所在路径，例如audit2allow -i ~/avc.txt  
    
2.  把终端显示的加入到对应的.te文件中，例如  
    
2.  allow kernel block\_device:blk\_file write;
    
    ![](https://raw.githubusercontent.com/shug666/image/main/images/23941061-1e83349bb95124c7.png)
    

建议使用方案一自己手写，比较快

### 2.编译验证

一般编译system/sepolicy即可。然后把生成的文件push到 /system/etc/selinux/下面和/vendor/etc/selinux/下面即可  

如果验证不生效的话，请确认下修改te的位置是否正确，是否生成了你想要的相关权限，确认权限修改在system还是vendor

NeverAllow问题
------------

一般的问题可能像上面那样就能解决了，下面说下不一般的问题，我们有时候会发现，当我们添加了allow xxxx之后，编译代码会报neverallow的编译报错。

neverallow的意思是违反了谷歌规定，谷歌有一系列禁止主客体之间赋予权限的规则，就是说，xxx类型的主体是不可以访问yyy的客体的，如果你加了allow，就会编译报错。  

这时候你可能会说这不是完蛋，我就是想给他这个访问权限你这还neverallow

其实倒不是没得办法，有些人提出直接修改neverallow规则，这个办法还是别了，因为你改了之后，过不了谷歌的CTS认证测试。

编译报错会明确指出违反了哪一条neverallow规则。借用一下别人博客的例子来说一下  

libsepol.report\_failure: neverallow on line 952 of system/sepolicy/public/domain.te (or line 12401 of policy.conf) violated by allow hello vendor\_toolbox\_exec:file { execute execute\_no\_trans };

意思就是我们添加的allow hello vendor\_toolbox\_exec:file { execute execute\_no\_trans };  

违反了 system/sepolicy/public/domain.te的第 952 的neverallow规则

一种思路是，改主体的type，或者客体的type，你不是不允许现在的xxx访问yyy吗，那我根据你的neverallow规则，修改改主客体type改成别的呗，不过这个要注意别改出其他毛病来了，因为你改主客体type之后会影响他们的其他权限设置呀，所以这个要注意到。 

另一种思路就是试试绕过权限，让xxx启动一个bin文件，用bin文件去访问yyy

  

本文转自 [https://www.jianshu.com/p/0f5bb0d281aa](https://www.jianshu.com/p/0f5bb0d281aa)，如有侵权，请联系删除。