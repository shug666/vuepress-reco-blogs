---
title: Android 源码创建生成jks签名文件脚本
date: 2023-08-11
tags:
 - android
categories: 
 - android
sticky: 
   true
---

用法
-----------------------------------------------------------------------------------------

将脚本置于源码目录下，最好lunch一下你的工程  

生成的签名文件为工程名称\_AN\_版本号

```sh
chmod +x ./auto_build_signature.sh
chmod 777  ./auto_build_signature.sh

#默认的存储密码，别名，秘钥密码
#[Shugan:AutoBuildSignature]创建签名文件的存储密码为android
#[Shugan:AutoBuildSignature]创建签名文件的别名 androiddebugkey
#[Shugan:AutoBuildSignature]创建签名文件的签名密码 android
source auto_build_signature.sh
#source auto_build_signature.sh Android_studio的存储密码  Android_studio的Alias别名  Android_studio的密钥密码
```

脚本内容
-------------------------------------------------------------------------------------------

```sh
#!/bin/bash
# 使用前需source build/envsetup.sh && lunch
# 固定值
KEY_STORED_PASSWORD=android
KEY_ALIAS=androiddebugkey
KEY_PASSWORD=android
#在命令行输入参数
# KEY_STORED_PASSWORD=$1
# KEY_ALIAS=$2
# KEY_PASSWORD=$3
DIR_NAME="createSignature"
PRODUCT_NAME=`get_build_var TARGET_PRODUCT`
VERSION_NAME=`get_build_var PLATFORM_VERSION`
LOG_TAG="\033[34m[Shugan:AutoBuildSignature]\033[0m"
LOG_END="\033[0m"
FILE_NAME="${PRODUCT_NAME}_AN_${VERSION_NAME}.jks"
do_main () {
    echo "----- do_main ----"
    if [ "$KEY_STORED_PASSWORD" = "" ] || [ "$KEY_STORED_PASSWORD" = "-h" ] || [ "$KEY_STORED_PASSWORD" = "--h" ]
        then 
        #echo -e "${LOG_TAG}\033[31mYour should add correct params .For Exapmle ${LOG_END}"
        echo -e "${LOG_TAG}\033[31m参数错误,使用示例如下${LOG_END}"
        #echo -e "${LOG_TAG}\033[31m./auto_build_signature.sh key_stored_password key_alias key_password ${LOG_END}"
        echo -e "${LOG_TAG}\033[31m./auto_build_signature.sh Android studio的存储密码  Android studio的Alias别名  Android studio的密钥密码 ${LOG_END}"
        return;
    fi
    if [ "$PRODUCT_NAME" == "" ] || [ "$PLATFORM_VERSION" = "" ]
        then 
        FILE_NAME="platform.jks"
    fi
    if [ "$KEY_ALIAS" = "" ] ;then
        #echo -e "${LOG_TAG}\033[31mOnly one extra param .use $1 to set key alias and key password ${LOG_END}"
        echo -e "${LOG_TAG}\033[31m当前只传递了Android studio的存储密码,使用\033[33m$1${LOG_END}来替代Android studio的Alias别名/Android studio的密钥密码${LOG_END}"
        KEY_ALIAS="$KEY_STORED_PASSWORD"
        KEY_PASSWORD="$KEY_STORED_PASSWORD"
    fi
    if [ "$KEY_PASSWORD" = "" ] ;then
        #echo -e "${LOG_TAG}\033[31mOnly two extra param .use $1 to set key password  ${LOG_END}"
        echo -e "${LOG_TAG}\033[31m当前只传递了Android studio的存储密码和Android studio的Alias别名,使用\033[33m$1${LOG_END}来替代Android studio的密钥密码${LOG_END}"
        KEY_PASSWORD=$KEY_STORED_PASSWORD
    fi

    #echo -e "${LOG_TAG}Creatingkey \033[33mstored password is $KEY_STORED_PASSWORD${LOG_END}"
    echo -e "${LOG_TAG}创建签名文件的\033[33m存储密码 $KEY_STORED_PASSWORD${LOG_END}"
    #echo -e "${LOG_TAG}Creatingkey \033[36malias is $KEY_ALIAS${LOG_END}"
    echo -e "${LOG_TAG}创建签名文件的\033[36m别名 $KEY_ALIAS${LOG_END}"
    #echo -e "${LOG_TAG}Creatingkey \033[35mpassword is $KEY_PASSWORD${LOG_END}"
    echo -e "${LOG_TAG}创建签名文件的\033[35m签名密码 $KEY_PASSWORD${LOG_END}"

    mkdir $DIR_NAME
    cp build/target/product/security/platform.pk8 ./$DIR_NAME
    cp build/target/product/security/platform.x509.pem ./$DIR_NAME
    cp prebuilts/sdk/tools/lib/signapk.jar ./$DIR_NAME
    cp prebuilts/sdk/tools/linux/lib64/libconscrypt_openjdk_jni.so ./$DIR_NAME
    cd ./$DIR_NAME
    openssl pkcs8 -inform DER -nocrypt -in platform.pk8 -out platform.pem
    openssl pkcs12 -export -in platform.x509.pem -out platform.p12 -inkey platform.pem -password pass:$KEY_STORED_PASSWORD -name $KEY_ALIAS
    keytool -importkeystore -deststorepass $KEY_PASSWORD -destkeystore ./$FILE_NAME -srckeystore ./platform.p12 -srcstoretype PKCS12 -srcstorepass $KEY_STORED_PASSWORD

    mv $FILE_NAME ../$FILE_NAME
    cd ..

    if  [ -f "$FILE_NAME" ] ;then 
        #echo -e "\r\n\r\n\r\n${LOG_TAG}\033[32mFile Created Success !!! ${LOG_END}"
        echo -e "\r\n\r\n\r\n${LOG_TAG}\033[32m签名文件创建成功 !!! ${LOG_END}"
    else
        #echo -e "${LOG_TAG}\033[31mFile Created Faild. Please Recheck !!! ${LOG_END}"
        echo -e "${LOG_TAG}\033[31m签名文件创建失败,请确认是否在源码根目录以及参数是否正常 !!! ${LOG_END}"
        return;
    fi
    rm -rf $DIR_NAME
}
do_main
```

  

本文转自 [https://blog.csdn.net/qq\_18906227/article/details/124673441?spm=1001.2014.3001.5502](https://blog.csdn.net/qq_18906227/article/details/124673441?spm=1001.2014.3001.5502)，如有侵权，请联系删除。