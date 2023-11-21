---
title: Android 对apk签名及重新签名
date: 2023-04-10
tags:
 - android
categories: 
 - android
sticky: 
   true
---

## 重新签名应用

对于客户提供的已签名apk进行再次签名的方法如下：  

1. 使用apktool工具，将原apk的签名进行删除：命令如下：apktool d test.apk  
2. 对删除签名之后的文件夹进行再次打包，此时无签名，命令如下：apktool b test，此时在test目录下会有一个dist文件夹，dist下面的就是重新打包的apk；  
3. 使用jarsigner对步骤2当中重新打包的apk进行签名，android有自带签名的DOS命令 : jarsigner -verbose -keystore [您的[私钥](https://so.csdn.net/so/search?q=私钥&spm=1001.2101.3001.7020)存放路径] -signedjar [签名后文件存放路径] [未签名的文件路径] [您的证书名称] 

示例命令如下：jarsigner -verbose -keystore platform-rtk.jks -signedjar out.apk app-debug.apk androiddebugkey

## jarsigner命令说明

> \-keystore后面为keystore  
>
> \-sigfile 指定.SF和.RSA文件的文件名，如果不输入-sigfile，则默认使用keystore别名的前8个字符作为文件名  
>
> \-storepass 指定keystore的密码  
>
> \-sigalg 指定摘要算法  
>
> \-digestalg 指定签名算法，如果指定SHA1则使用SHA1签名，如果不指定，则使用SHA256  
>
> androiddebugkey 为keystore的别名  

示例：  

jarsigner -verbose -keystore debug.keystore -storepass android -signedjar test\_signed.apk -digestalg SHA1 -sigalg MD5withRSA test.apk androiddebugkey

## apksigner 命令说明  

java -jar apksigner.jar sign --ks debug.keystore --ks-key-alias androiddebugkey --ks-pass pass:android --key-pass pass:android --out test-new\_sign.apk test-new.apk  

> –ks 后面为keystore  
>
> –ks-key-alias 后面为keystore别名  
>
> –ks-pass pass: 后面为keystore的密码  
>
> –key-pass pass: 后面为keystore的密码  
>
> –v1-signing-enabled 是否开启V1签名,默认开启  
>
> –v2-signing-enabled 是否开启V2签名,默认开启（apksigner sign --v2-signing-enabled false --ks 密钥库名 xxx.apk）  
> –out 为输出的apk

apksigner.jar所在目录：E:\\studio\_sdk\\build-tools\\28.0.3\\lib

使用示例：

java -jar E:\\studio\_sdk\\build-tools\\28.0.3\\lib\\apksigner.jar sign --ks application.keystore --ks-key-alias androiddebugkey --ks-pass pass:android --key-pass pass:android --out cashier\_system\_tablet-release\_signed.apk cashier\_system\_tablet-release\_unsign.apk

 

本文转自 [https://blog.csdn.net/u010755471/article/details/127582206](https://blog.csdn.net/u010755471/article/details/127582206)，如有侵权，请联系删除。