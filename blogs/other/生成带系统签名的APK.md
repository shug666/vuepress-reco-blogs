---
title: 生成带系统签名的APK
date: 2022-09-05
tags:
 - android
categories: 
 - android
sticky: 
   true
---

有时候，我们开发的apk需要用到系统权限，需要在AndroidManifest.xml中添加共享系统进程属性：

```xml
android:sharedUserId="android.uid.system"
android:sharedUserId="android.uid.shared"
android:sharedUserId="android.media"
```

这时候apk的签名就需要是系统签名(platform、shared或media)才能正常使用。

## **一、Android源码环境下签名**

### 1.直接编译apk

这种方式比较麻烦，你需要有编译过的源码环境，并按如下步骤：

1、拷贝App源码到Android源码的`packages/apps/`目录下，且App源码是普通(Eclipse)格式的  
2、配置Android.mk，在其中添加

```xml
LOCAL_CERTIFICATE := platform 或 shared 或 media
```

3、使用`mm`编译App，生成的apk即系统签名

### 2.源码编译生成签名

1.进入系统目录

```sh
build/target/product/security
```

2.执行命令

```
openssl pkcs8 -inform DER -nocrypt -in platform.pk8 -out platform.pem
&& openssl pkcs12 -export -in platform.x509.pem -out platform.p12 -inkey platform.pem -password pass:android -name androiddebugkey
&& keytool -importkeystore -deststorepass android -destkeystore platform.jks -srckeystore platform.p12 -srcstoretype PKCS12 -srcstorepass android
```

生成的platform.jks就是需要的系统签名文件

## 二、**对apk手动重新签名**

这种方式比在源码环境下签名简单，App可以在Eclipse或Android Studio下编译，然后给apk重新签名即可。  
但这种方式在频繁调试的时候比较痛苦，即使写成脚本，也需要重复一样的操作。

### **相关文件**

platform.x509.pem、platform.pk8、signapk.jar

### **文件位置**

platform.x509.pem、platform.pk8:

```
../build/target/product/security
```

signapk.jar:

```
../out/host/linux-x86/framework
```

signapk源码路径:

```
../build/tools/signapk
```

### **签名命令**

```
java -jar signapk.jar platform.x509.pem platform.pk8 old.apk new.apk
```

### **步骤**

1、将相关文件及源apk文件置于同一路径下  

2、检查源apk包，去掉`META-INF/CERT.SF` 和 `META-INF/CERT.RSA` 文件  

3、执行签名命令即可

## **三、Android Studio生成系统签名**

让Android Studio集成系统签名，需要用到一个工具`keytool-importkeypair`，详见下文。

#### **keytool-importkeypair**

> keytool-importkeypair – A shell script to import key/certificate pairs into an existing Java keystore

这个工具的作用是将系统签名的相关信息导入到已有的签名文件里。可从[这里](https://github.com/getfatday/keytool-importkeypair)下载。

工具的使用方法可以通过–help或README.textile来寻求帮助，或参考[使用keytool工具](http://czj4451.iteye.com/blog/1487684) 这篇文章。

#### **相关文件**

platform.x509.pem、platform.pk8、keytool-importkeypair、demo.jks、signature.sh

我的做法是在App根目录新建Signature文件夹专门存放签名相关文件。

#### **步骤**

1、生成demo.jks签名文件

![image-20230629142000050](https://raw.githubusercontent.com/shug666/image/main/images/image-20230629142000050.png)

![image-20230629142039888](https://raw.githubusercontent.com/shug666/image/main/images/image-20230629142039888.png)

2、编写签名脚本signature.sh，内容如下：

```sh
#!/bin/sh

# 转换系统签名命令
./keytool-importkeypair -k platform.jks -p android -pk8 platform.pk8 -cert platform.x509.pem -alias androiddebugkey

# platform.jks : 签名文件
# android : 签名文件密码
# platform.pk8、platform.x509.pem : 系统签名文件
# androiddebugkey : 签名文件别名
```

为脚本文件添加可执行权限：

```sh
$ sudo chmod a+x signature.sh
```

执行脚本：

```sh
$ ./signature.sh
```

3、配置builde.gradle

在android区域下(与defaultConfig同级)添加配置：

```sh
signingConfigs {
    release {
        keyAlias 'androiddebugkey'
        keyPassword 'android'
        storePassword 'android'

		storeFile file("${rootDir}/.android/${product_name}/platform.jks")
    }

    debug {
        keyAlias 'androiddebugkey'
        keyPassword 'android'
        storePassword 'android'

		storeFile file("${rootDir}/.android/${product_name}/platform.jks")
    }
}


```

这样debug或release apk就带有系统签名了。

如果想直接`Run app`就是release版且带系统签名的apk，还需修改Build Variants为debug/release：

2) 修改`buildTypes`：

```sh
buildTypes {
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.txt'
        signingConfig signingConfigs.release
    }
}
```

这样直接`Run app`就是带系统签名的release版apk了。

## 参考网址

https://blog.csdn.net/Donald_Zhuang/article/details/127472471在Android Studio中开发系统应用的环境配置

https://www.jianshu.com/p/10889088840e ：一次调用android.jar的internal与hideApi的解决方案
https://www.jianshu.com/p/10889088840e：开源带hide api的android.jar项目
https://hardiannicko.medium.com/create-your-own-android-hidden-apis-fa3cca02d345 ：自行创建 android.jar教程
https://blog.csdn.net/DKBDKBDKB/article/details/122347440 : Android11 全编译后无法生成framework.jar的解决方案
https://stackoverflow.com/questions/39657812/how-to-import-x509-pem-pk8-file-into-jks-keystore ：How to import x509.pem pk8 file



本文转自 [https://blog.csdn.net/zhixuan322145/article/details/51277921](https://blog.csdn.net/zhixuan322145/article/details/51277921)，如有侵权，请联系删除。
