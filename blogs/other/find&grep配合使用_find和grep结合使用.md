---
title: Linux命令 之 find & grep配合使用_find和grep结合使用
date: 2023-02-14
tags:
 - linux
categories: 
 - linux
sticky: 
   true
---

一、使用find与grep
-------------------------------------------------------------------------------

1.  查找所有".h"文件（非组合命令）

```sh
find /PATH -name "*.h"
```

2.  查找所有".h"文件中的含有"helloworld"字符串的文件（组合命令）

```sh
find /PATH -name "*.h" -exec grep -in "helloworld" {} \;

find /PATH -name "*.h" | xargs grep -in "helloworld"
```

3.  查找所有".h"和".c"文件中的含有"helloworld"字符串的文件

```sh
find /PATH /( -name "*.h" -or -name "*.c" /) -exec grep -in "helloworld" {} \;
```

4.  查找非备份文件中的含有"helloworld"字符串的文件

```sh
find /PATH /( -not -name "*~" /) -exec grep -in "helloworld" {} \;
```

**注：/PATH为查找路径，默认为当前路径。带-exec参数时必须以;结尾，否则会提示“find: 遗漏“-exec”的参数”。**

二、使用find和xargs
--------------------------------------------------------------------------------

### 1\. find pathname -options \[-print -exec -ok\]

\-optinos  
a) -name:按照文件名查找

```sh
find ~ -name “*.txt” -print
find ~ -name “[a-z][0-9].txt” -print
```

b) -perm:按照权限查找文件

```sh
find ~ -perm 755 -print  #查找权限为755的文件
find ~ -perm 007 -print #查找o位置上具有7权限的文件
find ~ -perm 4000 -print #查找具有suid的文件
```

c) -prune  
不在当前目录下查找

d) -user和－nouser

```sh
find ~ -user zhao -print #查找文件属主是zhao的文件
find ~ -nouser -print #查找文件属主已经被删除的文件
```

e)-group和－nogroup

```sh
find ~ -group zhao -print #查找文件群组是zhao的文件
```

f) 按照时间

```sh
find ~ -mtime -5 -print #文件更改时间在5天内的文件
find ~ -mtime +3 -print #文件更改时间在3天前的文件
find ~ -newer file1 -print #查找比文件file1新的文件
```

g)按照类型查找  

```sh
find ~ -type d -print #查找所有目录
```

h) 按照大小  

```sh
find ~ -size +1000000C -print #查找文件大小大于1000000字节(1M)的文件
```

i) 查找位于本文件系统里面的文件

```sh
find / -name “*.txt” -mount -print -exec,-ok 
#find命令对于匹配文件执行该参数所给出shell命令，相应命令形式为: ‘command’ {} \;
#-ok 在执行命令前要确认
```
```sh
find ~ -type f -exec ls -l {} \;
find / -name “*.log” -mtime +5 -ok rm {} \;
find . -name core -exec rm {} \; #使用-x dev参数   防止find搜索其他分区
find . -size 0 -exec rm {} \; #删除尺寸为０的文件
```

2\. xargs与-exec功能类似
-------------------------------------------------------------------------------------

```sh
find ~ -type f | xargs ls -l
find / -name “*.log” -type f -print| xargs grep -i DB0
find . -type f |xargs grep -i “Mary” #在所有文件中检索字符串Mary
ls *~ |xargs rm -rf #删除所有以~结尾的文件
```

三、svn过滤svn文件夹
-------------------------------------------------------------------------------

1.使用管道进行双层“过滤”，其中第二次grep使用了-v选项，即逆向匹配，打印出不匹配的行

```sh
grep -r 'function_name' * | grep -v '.svn'
```

2.或者更简单一些，直接使用–exclude-dir选项，即指定排除目录，注意svn前的 .

```sh
grep -r --exclude-dir=\.svn 'function_name' * 
```

3.grep多个过滤条件

a、或操作

```sh
  grep -E '123|abc' filename  #找出文件（filename）中包含123或者包含abc的行
  egrep '123|abc' filename    #用egrep同样可以实现
  awk '/123|abc/' filename   #awk 的实现方式
```

b、与操作

```sh
  grep pattern1 files | grep pattern2 #显示既匹配 pattern1 又匹配 pattern2 的行。
```

c、其他操作

```sh
grep -i pattern files #不区分大小写地搜索。默认情况区分大小写，
grep -l pattern files #只列出匹配的文件名，
grep -L pattern files #列出不匹配的文件名，
grep -w pattern files #只匹配整个单词，而不是字符串的一部分（如匹配‘magic’，而不是‘magical’），
grep -C number pattern files #匹配的上下文分别显示[number]行，
```

d、find过滤svn文件夹

```sh
find -type f ! -path '*/.svn/*'
```

只搜索那些具有 .c 或 .h 扩展名的文件

```sh
grep --include=\*.{c,h} -rnw '/path/to/somewhere/' -e "pattern"
```

排除搜索所有以 .o 扩展名结尾的文件：

```sh
grep --exclude=\*.o -rnw '/path/to/somewhere/' -e "pattern"
```

对于目录，可以使用–exclude-dir参数排除一个或多个目录。例如，这将排除目录dir1/、dir2/ 以及所有与*.dst/ 匹配的目录

```sh
grep --exclude-dir={dir1,dir2,*.dst} -rnw '/path/to/somewhere/' -e "pattern"
```

本文转自 [https://blog.csdn.net/sinat\_32152141/article/details/126880839](https://blog.csdn.net/sinat_32152141/article/details/126880839)，https://blog.csdn.net/weixin_37335761/article/details/125918438如有侵权，请联系删除。
