---
title: CTS/GTS 生成带有密钥的签名文件
date: 2024-05-31
tags:
 - android
categories: 
 - android
sticky: 
   true
---

CTS/GTS测试项
-------------------------------------------------------------------------

前言：测试的Android版本是14

## 一、测试命令

```sh
run gts -m GtsApexSignatureVerificationTest -t android.appsecurity.cts.ApexSignatureVerificationTest#testApexPubKeyIsNotWellKnownKey
```

测试fail，测试报告如下：

![测试报告](https://img-blog.csdnimg.cn/direct/0771959677a74c1a95b3d399dfea0ca2.png)

## 二、错误原因

这个报错是因为使用的是 Google 的公共签名，而不是带有密钥进行的签名，所以我们需要重新进行一次签名，生成带有密钥的签名文件，并且将签名文件放入项目代码里，然后重新编译代码

三、生成签名文件和进行替换的方法
-----------------------------------------------------------------------------------

在测试报告中一共有9个报错，其中有4个用常规的方法进行签名，然后将生成的签名文件替换进去就可以  

1. com.android.uwb  
2. com.android.rkpd  
3. com.android.wifi  
4. com.android.virt

**1\. 生成签名文件**

在Android代码的根目录中执行以下三步

```sh
openssl genrsa -out com.android.runtime.pem 4096
./external/avb/avbtool.py extract_public_key --key com.android.runtime.pem --output com.android.runtime.avbpubkey
openssl req -x509 -newkey rsa:4096 -nodes -days 999999 -keyout key.pem -out com.android.runtime.x509.pem
openssl pkcs8 -topk8 -inform PEM -outform DER -in key.pem -out com.android.runtime.pk8 -nocrypt
```

(1) 执行第一步会生成com.android.uwb.pem文件  

(2) 执行第二步会生成com.android.uwb.avbpubkey文件  

(3) 执行第三步的时候，按照提示回车，需要输入公司等相关的信息

```sh
'/C=CH/ST=GX/L=NN/O=ThunderSoft/OU=ThunderSoft/CN=ThunderSoft/emailAddress=thundersoft@thundersoft.com'
```

ps: 这里是以com.android.uwb为例，其他3个rkpd、wifi和virt也都如法炮制

**2\. 将生成的签名文件替换进源代码里**

这个时候已经生成了com.android.uwb的四个签名文件  

com.android.uwb.pem  

com.android.uwb.avbpubkey  

com.android.uwb.pk8  

com.android.uwb.x509.pem

在源代码中使用find命令搜索，可以搜索到Google的公共签名文件的所在目录–com.android.uwb.x509.pem

```
//com.android.uwb的签名文件放进以下目录
QSSI14/packages/modules/Uwb/apex
QSSI14/packages/modules/Uwb/service/ServiceUwbResources/resources-certs

//com.android.rkpd的签名文件放进以下目录
QSSI14/packages/modules/RemoteKeyProvisioning/apex

//com.android.wifi的签名文件放进以下目录
QSSI14/packages/modules/Wifi/apex

//com.android.virt的签名文件放进以下目录
QSSI14/packages/modules/Virtualization/apex

```

在这个目录下，将生成的四个签名文件替换进去即可重新编译复测

做完之后删除所有生成的新文件，特别是需要rm key.pem

四、com.android.vndk
-------------------------------------------------------------------------------------

接下来还剩下com.android.vndk的签名文件要进行签名：  

com.android.vndk.v31  

com.android.vndk.v30  

com.android.vndk.v33  

com.android.vndk.v32  

com.android.vndk.v34

根据官方文档的指示来进行操作  

QSSI14/packages/modules/vndk/apex/README.md  

这 里 是 README.md 文 档 的 内 容：

#Add a new VNDK APEX  

In this document we add a new VNDK APEX for version 30. When you follow this doc  
with different versions,  

change “30” to what you’re adding. (eg. 31)

1.  Add a new definition in `Android.bp`

```makefile
apex_vndk {
name: "com.android.vndk.v30",
manifest: "apex_manifest.v30.json",
key: "com.android.vndk.v30.key",
certificate: ":com.android.vndk.v30.certificate",
vndk_version: "30",
system_ext_specific: true,
file_contexts: ":com.android.vndk-file_contexts",
}
apex_key {
name: "com.android.vndk.v30.key",
public_key: "com.android.vndk.v30.pubkey",
private_key: "com.android.vndk.v30.pem",
}
android_app_certificate {
name: "com.android.vndk.v30.certificate",s
certificate: "com.android.vndk.v30",
}
```

2.  Add `apex_manifest.v30.json`

```json
{
"name": "com.android.vndk.v30",
"version": 1
}
```

3.  Add keys/ceritificate

```sh
openssl genrsa -out com.android.vndk.v30.pem 4096
avbtool extract_public_key --key com.android.vndk.v30.pem --output com.android.vndk.v30.pubkey
openssl req -x509 -newkey rsa:4096 -nodes -days 999999 -keyout key.pem -out com.android.vndk.v30.x509.pem
```

**具体操作步骤：**  

以 com.android.vndk.v30 为例 
**第一步：先修改 Android.bp 文件**  

QSSI14/packages/modules/vndk/apex/Android.bp  

在 Android.bp 文件中添加以下参数：

```makefile
apex_vndk {
name: "com.android.vndk.v30",
manifest: "apex_manifest.v30.json",
key: "com.android.vndk.v30.key",
certificate: ":com.android.vndk.v30.certificate",
vndk_version: "30",
system_ext_specific: true,
file_contexts: ":com.android.vndk-file_contexts",
}
apex_key {
name: "com.android.vndk.v30.key",
public_key: "com.android.vndk.v30.pubkey",
private_key: "com.android.vndk.v30.pem",
}
android_app_certificate {
name: "com.android.vndk.v30.certificate",
certificate: "com.android.vndk.v30",
}
```

**第二步：**  

新建一个文件----apex\_manifest.v30.json  

放到 QSSI14/packages/modules/vndk/apex 目录下  

里面的内容是：  

```json
{  

"name": "com.android.vndk.v30",  

"version": 1  

}
```

**第三步：**  

生成签名文件，也放到 QSSI14/packages/modules/vndk/apex 目录下

```sh
openssl genrsa -out com.android.vndk.v30.pem 4096
./UM.9.14/external/avb/avbtool extract_public_key --key com.android.vndk.v30.pem --output com.android.vndk.v30.pubkey
openssl req -x509 -newkey rsa:4096 -nodes -days 999999 -keyout key.pem -out com.android.vndk.v30.x509.pem
//注意，执行第三步后会提示你填写相关的参数
openssl pkcs8 -topk8 -inform PEM -outform DER -in key.pem -out com.android.vndk.v30.pk8 -nocrypt '/C=CH/ST=GX/L=NN/O=CSDN/OU=CSDN/CN=CSDN/emailAddress=csdn@csdn.com'
```

生成的 key.pem 可以删除，无需放进 apex 的目录

ps：在还没替换 vndk 的签名之前，报错的是 v30,v31,v32,v33,v34  

但是只需生成和替换 v30,v31,v32,v33 的就可以  

在 QSSI14/prebuilts/vndk 也是只看到有 v29,v30,v31,v32,v33,没有看到 v34 的文件夹  

在 Android.bp 文件中也不需要将 v34 的参数添加进去  

因此，无需对com.android.vndk.v34进行签名



本文转自 [https://blog.csdn.net/weixin\_44956894/article/details/138655101](https://blog.csdn.net/weixin_44956894/article/details/138655101)，如有侵权，请联系删除。