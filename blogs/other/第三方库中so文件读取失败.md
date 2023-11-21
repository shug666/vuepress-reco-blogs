---
title: as 编译apk导致第三方库中so文件读取失败问题
date: 2022-09-07
tags:
 - jni
categories: 
 - jni
sticky: 
   true 
---

## 第一种方法

```
1. 将需要调用的libSpiDevice.so放到/system/lib下
2. 运行程序发现报错,百度一查说是要把改so库的名字写到/system/etc/public.libraries.txt,这个文件里
3. adb pull出来,修改,adb push进去,重启;
```

重点来了:将libSpiDevice.so加到public.libraries.txt这个文件时,注意要换行,换行,换行!!!,否则push到系统中是识别不到的,cat public.libraries.txt,会发现根本没有刚添加的字段…这就是没有换行.所以,记得换行,换行,换行.
![在这里插入图片描述](https://raw.githubusercontent.com/shug666/image/main/images/20200314142212389.png)

## 第二种方法

使用Android studio的话，你直接把libxxxx.so放入jniLibs/armxxxxx/下就可以了，编译后就会自动帮你打包在apk里面，另外我看你app下有jni这个目录，应该是你自己创建的，这样在jni里执行了ndk-build后，会在app目录下产生两个临时文件夹libs和obj，这两个文件夹在Android Studio里面没用，因为Android studio不像eclipse那样把libs里的so打包到apk，而是默认使用了jniLibs目录。如果你非要让Android studio把app/libs的库打包到apk里，也是可以做到的，要自己编辑build.gradle文件来完成
